import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { legislation } from "../../../prisma/shared/generated/legislation";
import { Legislation } from "./dto/legislation";

export interface LegislationRow {
  legislation_guid: string;
  legislation_type_code: string;
  parent_legislation_guid: string | null;
  legislation_source_guid: string | null;
  citation: string | null;
  full_citation: string | null;
  section_title: string | null;
  legislation_text: string | null;
  trailing_text: string | null;
  alternate_text: string | null;
  display_order: number;
  effective_date: Date | null;
  expiry_date: Date | null;
  create_user_id: string;
  create_utc_timestamp: Date;
  update_user_id: string | null;
  update_utc_timestamp: Date | null;
}

export interface CreateLegislationInput {
  legislationTypeCode: string;
  parentLegislationGuid?: string | null;
  legislationSourceGuid?: string | null;
  citation?: string | null;
  fullCitation?: string | null;
  sectionTitle?: string | null;
  legislationText?: string | null;
  trailingText?: string | null;
  alternateText?: string | null;
  displayOrder: number;
  effectiveDate?: Date | null;
  expiryDate?: Date | null;
  createUserId: string;
}

@Injectable()
export class LegislationService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(LegislationService.name);

  async findMany(agencyCode: string, legislationTypeCodes?: string[], ancestorGuid?: string) {
    const today = new Date().toISOString().split("T")[0];

    const prismaLegislation = await this.prisma.$queryRaw<legislation[]>`
      WITH RECURSIVE descendants AS (
        SELECT 
          l.legislation_guid, -- Parent Nodes
          l.parent_legislation_guid,
          l.legislation_type_code,
          l.display_order,
          LPAD(l.display_order::text, 4, '0') AS sort_path -- Sort by display_order (document order)
        FROM legislation l
        -- Join to legislation_source when finding root nodes (no ancestorGuid)
        -- When ancestorGuid is provided, the parent was already filtered by agency at the parent level
        LEFT JOIN legislation_source ls ON l.legislation_source_guid = ls.legislation_source_guid
        WHERE
          (
            -- When ancestorGuid is provided, match it directly
            (COALESCE(${ancestorGuid}, '') <> '' AND l.legislation_guid = ${ancestorGuid}::uuid)
          OR
            -- When no ancestorGuid, find root nodes filtered by agency
            (COALESCE(${ancestorGuid}, '') = '' AND l.parent_legislation_guid IS NULL AND ls.agency_code = ${agencyCode})
          )
        
        UNION ALL
        
        SELECT -- Child nodes
          l.legislation_guid,
          l.parent_legislation_guid,
          l.legislation_type_code,
          l.display_order,
          d.sort_path || '.' || LPAD(l.display_order::text, 4, '0') AS sort_path
        FROM legislation l
        INNER JOIN descendants d ON l.parent_legislation_guid = d.legislation_guid
      )
      SELECT 
        l.legislation_guid,
        l.legislation_type_code,
        l.parent_legislation_guid,
        l.citation,
        l.full_citation,
        l.section_title,
        l.legislation_text,
        l.trailing_text,
        l.alternate_text,
        l.display_order
      FROM legislation l
      INNER JOIN descendants d ON l.legislation_guid = d.legislation_guid
      WHERE 
        (
          ${legislationTypeCodes ?? []} = '{}'::text[]
          OR l.legislation_type_code = ANY(${legislationTypeCodes ?? []}::text[])
        )
        AND (l.effective_date IS NULL OR l.effective_date <= ${today}::date)
        AND (l.expiry_date IS NULL OR l.expiry_date > ${today}::date)
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
      // Simple case - just return the legislation
      const prismaLegislation = await this.prisma.legislation.findUnique({
        where: {
          legislation_guid: legislationGuid,
        },
      });

      if (!prismaLegislation) {
        return null;
      }

      try {
        return this.mapper.map<legislation, Legislation>(
          prismaLegislation as legislation,
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
        legislation_guid,
        parent_legislation_guid,
        legislation_type_code,
        1 as depth
      FROM legislation
      WHERE legislation_guid = ${legislationGuid}::uuid
      
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
      l.citation,
      l.full_citation,
      l.section_title,
      l.legislation_text,
      l.trailing_text,
      l.alternate_text,
      l.display_order,
      COALESCE(a.depth, 1) as depth
    FROM legislation l
    INNER JOIN ancestors a ON l.legislation_guid = a.legislation_guid
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
  async create(input: CreateLegislationInput): Promise<LegislationRow> {
    return this.prisma.legislation.create({
      data: {
        legislation_type_code: input.legislationTypeCode,
        parent_legislation_guid: input.parentLegislationGuid ?? null,
        legislation_source_guid: input.legislationSourceGuid ?? null,
        citation: input.citation ?? null,
        full_citation: input.fullCitation ?? null,
        section_title: input.sectionTitle ?? null,
        legislation_text: input.legislationText ?? null,
        trailing_text: input.trailingText ?? null,
        alternate_text: input.alternateText ?? null,
        display_order: input.displayOrder,
        effective_date: input.effectiveDate ?? null,
        expiry_date: input.expiryDate ?? null,
        create_user_id: input.createUserId,
        create_utc_timestamp: new Date(),
      },
    });
  }

  /**
   * Finds legislation by type code, citation, parent GUID, and optionally section title
   * Definitions have null citation, section_title is used as additional key
   */
  private async _findByTypeAndCitation(
    legislationTypeCode: string,
    citation: string | null,
    parentLegislationGuid: string | null,
    sectionTitle: string | null = null,
  ): Promise<LegislationRow | null> {
    const where: any = {
      legislation_type_code: legislationTypeCode,
      citation: citation,
      parent_legislation_guid: parentLegislationGuid,
    };

    if (citation === null && sectionTitle !== null) {
      where.section_title = sectionTitle;
    }

    return this.prisma.legislation.findFirst({ where });
  }

  /**
   * Upserts legislation based on type code, citation, parent GUID, and section title
   */
  async upsert(input: CreateLegislationInput): Promise<LegislationRow> {
    const existing = await this._findByTypeAndCitation(
      input.legislationTypeCode,
      input.citation ?? null,
      input.parentLegislationGuid ?? null,
      input.sectionTitle ?? null,
    );

    if (existing) {
      return this.prisma.legislation.update({
        where: {
          legislation_guid: existing.legislation_guid,
        },
        data: {
          legislation_source_guid: input.legislationSourceGuid ?? existing.legislation_source_guid,
          full_citation: input.fullCitation ?? existing.full_citation,
          section_title: input.sectionTitle ?? existing.section_title,
          legislation_text: input.legislationText ?? existing.legislation_text,
          trailing_text: input.trailingText ?? existing.trailing_text,
          alternate_text: input.alternateText ?? existing.alternate_text,
          display_order: input.displayOrder,
          effective_date: input.effectiveDate ?? existing.effective_date,
          expiry_date: input.expiryDate ?? existing.expiry_date,
          update_user_id: input.createUserId,
          update_utc_timestamp: new Date(),
        },
      });
    }

    return this.create(input);
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
