import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { Prisma } from ".prisma/shared"; // NOSONAR
import { legislation } from "../../../prisma/shared/generated/legislation";
import { Legislation } from "./dto/legislation";

const getCurrentDatePacific = (): string =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Vancouver" }).format(new Date());

export interface CreateLegislationInput {
  legislationTypeCode: string;
  legislationVersionGuid: string;
  parentLegislationGuid?: string | null;
  citation?: string | null;
  fullCitation?: string | null;
  sectionTitle?: string | null;
  legislationText?: string | null;
  alternateText?: string | null;
  displayOrder: number;
  createUserId: string;
  agencyCode: string;
}

@Injectable()
export class LegislationService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(LegislationService.name);

  async findMany(args: {
    agencyCode: string;
    onlyActive?: boolean;
    legislationTypeCodes?: string[];
    ancestorGuid?: string;
    excludeRegulations?: boolean;
    legislationSourceGuid?: string;
    offenseDate?: string;
    legislationVersionGuid?: string;
  }) {
    const {
      agencyCode,
      onlyActive = true,
      legislationTypeCodes,
      ancestorGuid,
      excludeRegulations,
      legislationSourceGuid,
      offenseDate,
      legislationVersionGuid,
    } = args;
    const filterDate = offenseDate ?? getCurrentDatePacific();

    const prismaLegislation = await this.prisma.$queryRaw<legislation[]>`
      WITH RECURSIVE descendants AS (
        SELECT
          l.legislation_guid, -- Parent Nodes
          l.parent_legislation_guid,
          l.legislation_type_code,
          l.display_order,
          LPAD(l.display_order::text, 4, '0') AS sort_path, -- Sort by display_order (document order)
          FALSE AS has_reg_ancestor -- Track if any ancestor is a REG
        FROM legislation l
        INNER JOIN legislation_version lv
          ON l.legislation_version_guid = lv.legislation_version_guid AND lv.import_status = 'SUCCESS'
        INNER JOIN legislation_source ls ON lv.legislation_source_guid = ls.legislation_source_guid
        WHERE
          (
            -- When ancestorGuid is provided, match it directly (ignore source/version/date)
            (COALESCE(${ancestorGuid}, '') <> '' AND l.legislation_guid = ${ancestorGuid}::uuid)
          OR
            -- When legislationVersionGuid is provided, take that version's root regardless of date
            (
              COALESCE(${ancestorGuid}, '') = ''
              AND COALESCE(${legislationVersionGuid}, '') <> ''
              AND l.parent_legislation_guid IS NULL
              AND l.legislation_version_guid = ${legislationVersionGuid}::uuid
            )
          OR
            -- Otherwise resolve the version in force by filterDate, for the given source or the agency
            (
              COALESCE(${ancestorGuid}, '') = ''
              AND COALESCE(${legislationVersionGuid}, '') = ''
              AND l.parent_legislation_guid IS NULL
              AND lv.effective_date <= ${filterDate}::date
              AND NOT EXISTS (
                SELECT 1
                FROM legislation_version newer
                WHERE newer.legislation_source_guid = lv.legislation_source_guid
                  AND newer.import_status = 'SUCCESS'
                  AND newer.effective_date <= ${filterDate}::date
                  AND newer.effective_date > lv.effective_date
              )
              AND (
                (COALESCE(${legislationSourceGuid}, '') <> ''
                  AND lv.legislation_source_guid = ${legislationSourceGuid}::uuid)
                OR (COALESCE(${legislationSourceGuid}, '') = '' AND ls.agency_code = ${agencyCode})
              )
            )
          )
        UNION ALL

        SELECT -- Child nodes
          l.legislation_guid,
          l.parent_legislation_guid,
          l.legislation_type_code,
          l.display_order,
          d.sort_path || '.' || LPAD(l.display_order::text, 4, '0') AS sort_path,
          -- Mark as having REG ancestor if parent is REG or already has REG ancestor
          d.has_reg_ancestor OR d.legislation_type_code = 'REG' AS has_reg_ancestor
        FROM legislation l
        INNER JOIN descendants d ON l.parent_legislation_guid = d.legislation_guid
      )
      SELECT
        l.legislation_guid,
        l.legislation_type_code,
        l.parent_legislation_guid,
        l.legislation_version_guid,
        l.citation,
        l.full_citation,
        l.section_title,
        l.legislation_text,
        l.alternate_text,
        l.display_order,
        lv.legislation_source_guid,
        lv.effective_date AS version_effective_date,
        lv.source_url,
        COALESCE(lc.enabled_ind, true) AS enabled_ind
      FROM legislation l
      INNER JOIN descendants d ON l.legislation_guid = d.legislation_guid
      INNER JOIN legislation_version lv
        ON l.legislation_version_guid = lv.legislation_version_guid AND lv.import_status = 'SUCCESS'
      -- Join to config by agency
      LEFT JOIN legislation_configuration lc
        ON lc.legislation_guid = l.legislation_guid AND lc.agency_code = ${agencyCode}
      WHERE
        (
          ${legislationTypeCodes ?? []} = '{}'::text[]
          OR l.legislation_type_code = ANY(${legislationTypeCodes ?? []}::text[])
        )
        -- When excludeRegulations is true, exclude nodes that have a REG ancestor
        AND (NOT ${excludeRegulations ?? false} OR NOT d.has_reg_ancestor)
        AND (${onlyActive} = false OR COALESCE(lc.enabled_ind, true) = true)
      ORDER BY d.sort_path;
      `;

    try {
      return this.mapper.mapArray<legislation, Legislation>(prismaLegislation, "legislation", "Legislation");
    } catch (error) {
      this.logger.error("Error mapping legislation", error);
    }
  }

  async findOne(legislationGuid: string, includeAncestors: boolean = false) {
    if (!includeAncestors) {
      const prismaLegislation = await this.prisma.legislation.findFirst({
        where: { legislation_guid: legislationGuid, legislation_version: { import_status: "SUCCESS" } },
        include: {
          legislation_version: { select: { legislation_source_guid: true, effective_date: true, source_url: true } },
        },
      });

      if (!prismaLegislation) {
        return null;
      }

      const { legislation_version, ...node } = prismaLegislation;

      try {
        return this.mapper.map<legislation, Legislation>(
          {
            ...node,
            legislation_source_guid: legislation_version.legislation_source_guid,
            version_effective_date: legislation_version.effective_date,
            source_url: legislation_version.source_url,
            enabled_ind: true,
          } as unknown as legislation,
          "legislation",
          "Legislation",
        );
      } catch (error) {
        this.logger.error("Error mapping legislation", error);
      }
    }

    // Complex case - get legislation with ancestors
    const result = await this.prisma.$queryRaw<legislation[]>`
    WITH RECURSIVE ancestors AS (
      -- Start with the target legislation
      SELECT
        l.legislation_guid,
        l.parent_legislation_guid,
        l.legislation_type_code,
        1 as depth
      FROM legislation l
      INNER JOIN legislation_version lv
        ON l.legislation_version_guid = lv.legislation_version_guid AND lv.import_status = 'SUCCESS'
      WHERE l.legislation_guid = ${legislationGuid}::uuid

      UNION ALL

      -- Recursively get parent nodes
      SELECT
        l.legislation_guid,
        l.parent_legislation_guid,
        l.legislation_type_code,
        a.depth + 1
      FROM legislation l
      INNER JOIN ancestors a ON l.legislation_guid = a.parent_legislation_guid
    )
    SELECT
      l.legislation_guid,
      l.legislation_type_code,
      l.parent_legislation_guid,
      l.legislation_version_guid,
      l.citation,
      l.full_citation,
      l.section_title,
      l.legislation_text,
      l.alternate_text,
      l.display_order,
      lv.legislation_source_guid,
      lv.effective_date AS version_effective_date,
      lv.source_url,
      true AS enabled_ind,
      COALESCE(a.depth, 1) as depth
    FROM legislation l
    INNER JOIN ancestors a ON l.legislation_guid = a.legislation_guid
    INNER JOIN legislation_version lv
      ON l.legislation_version_guid = lv.legislation_version_guid AND lv.import_status = 'SUCCESS'
    ORDER BY a.depth ASC;
  `;

    if (!result || result.length === 0) {
      return null;
    }

    try {
      // First item (depth = 1) is the target legislation
      const targetLegislation = result[0];
      const ancestorRecords = result.slice(1); // Rest are ancestors (depth > 1)

      let legislation = this.mapper.map<legislation, Legislation>(targetLegislation, "legislation", "Legislation");

      const ancestors =
        ancestorRecords.length > 0
          ? this.mapper.mapArray<legislation, Legislation>(ancestorRecords, "legislation", "Legislation")
          : [];

      legislation.ancestors = ancestors;

      return legislation;
    } catch (error) {
      this.logger.error("Error mapping legislation", error);
    }
  }

  /**
   * Creates a new legislation record
   */
  async create(input: CreateLegislationInput) {
    return this.prisma.legislation.create({
      data: {
        legislation_type_code: input.legislationTypeCode,
        legislation_version_guid: input.legislationVersionGuid,
        parent_legislation_guid: input.parentLegislationGuid ?? null,
        citation: input.citation ?? null,
        full_citation: input.fullCitation ?? null,
        section_title: input.sectionTitle ?? null,
        legislation_text: input.legislationText ?? null,
        alternate_text: input.alternateText ?? null,
        display_order: input.displayOrder,
        create_user_id: input.createUserId,
        create_utc_timestamp: new Date(),
        legislation_configuration: {
          create: {
            agency_code: input.agencyCode,
            enabled_ind: true,
            create_user_id: input.createUserId,
            create_utc_timestamp: new Date(),
          },
        },
      },
    });
  }

  async deleteByVersion(versionGuids: string[], tx?: Prisma.TransactionClient): Promise<void> {
    if (versionGuids.length === 0) {
      return;
    }

    if (tx) {
      await this.deleteNodesByVersion(tx, versionGuids);
      return;
    }

    await this.prisma.$transaction(async (transaction) => this.deleteNodesByVersion(transaction, versionGuids));
  }

  private async deleteNodesByVersion(tx: Prisma.TransactionClient, versionGuids: string[]): Promise<void> {
    const descendants = Prisma.sql`
      descendants AS (
        SELECT l.legislation_guid
        FROM legislation l
        WHERE l.legislation_version_guid = ANY(${versionGuids}::uuid[])
        UNION
        SELECT l.legislation_guid
        FROM legislation l
        INNER JOIN descendants d ON l.parent_legislation_guid = d.legislation_guid
      )`;

    await tx.$executeRaw`
      WITH RECURSIVE ${descendants}
      DELETE FROM legislation_configuration
      WHERE legislation_guid IN (SELECT legislation_guid FROM descendants);`;

    await tx.$executeRaw`
      WITH RECURSIVE ${descendants}
      DELETE FROM legislation
      WHERE legislation_guid IN (SELECT legislation_guid FROM descendants);`;
  }

  /**
   * Gets all legislation type codes from the lookup table
   */
  async getAllLegislationTypeCodes() {
    const types = await this.prisma.legislation_type_code.findMany({
      where: {
        active_ind: true,
      },
      orderBy: {
        display_order: "asc",
      },
    });

    return types.map((type) => ({
      legislationTypeCode: type.legislation_type_code,
      shortDescription: type.short_description,
      longDescription: type.long_description,
      displayOrder: type.display_order,
      activeInd: type.active_ind,
    }));
  }
}
