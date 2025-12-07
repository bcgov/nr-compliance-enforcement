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
  alternateText?: string | null;
  displayOrder: number;
  effectiveDate?: Date | null;
  expiryDate?: Date | null;
  createUserId: string;
}

export interface LegislationSource {
  legislationSourceGuid: string;
  shortDescription: string;
  longDescription: string | null;
  sourceUrl: string;
  agencyCode: string;
  activeInd: boolean;
  importedInd: boolean;
  lastImportTimestamp: Date | null;
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
        SELECT legislation_guid, -- Parent Nodes
          parent_legislation_guid,
          legislation_type_code,
          display_order,
          (
            CASE legislation_type_code  
              WHEN 'SEC' THEN '1'
              WHEN 'SUBSEC' THEN '2'
              WHEN 'PAR' THEN '3'
              WHEN 'SUBPAR' THEN '4'
              ELSE '9'
            END || ':' || LPAD(display_order::text, 4, '0')  -- LPAD so that 1, 2, 10 sorts correctly as 0001, 0002, 0010
          ) AS sort_path  
        FROM legislation
        WHERE 
          -- If ancestorGuid is provided, match it; else match root nodes
          (COALESCE(${ancestorGuid}, '') <> '' AND legislation_guid = ${ancestorGuid}::uuid)
          OR
          (COALESCE(${ancestorGuid}, '') = '' AND parent_legislation_guid IS NULL)
        UNION ALL
        SELECT -- Child nodes
          l.legislation_guid,
          l.parent_legislation_guid,
          l.legislation_type_code,
          l.display_order,
          d.sort_path || '.' || -- append child path to parent e.g 0001.0001, 0001.0002 etc.
          (
            CASE l.legislation_type_code
              WHEN 'SEC' THEN '1'
              WHEN 'SUBSEC' THEN '2'
              WHEN 'PAR' THEN '3'
              WHEN 'SUBPAR' THEN '4'
              ELSE '9'
            END
            || ':' || LPAD(l.display_order::text, 4, '0')
          ) AS sort_path
        FROM legislation l
        INNER JOIN descendants d 
          ON l.parent_legislation_guid = d.legislation_guid
      )
      SELECT 
        l.legislation_guid,
        l.legislation_type_code,
        l.parent_legislation_guid,
        l.citation,
        l.full_citation,
        l.section_title,
        l.legislation_text,
        l.alternate_text,
        l.display_order
      FROM legislation l
      INNER JOIN descendants d ON l.legislation_guid = d.legislation_guid
      WHERE 
        l.legislation_guid IN (SELECT legislation_guid FROM descendants)
        AND (
          ${legislationTypeCodes ?? []} = '{}'::text[]
          OR l.legislation_type_code = ANY(${legislationTypeCodes ?? []}::text[])
        )
        AND (l.effective_date IS NULL OR l.effective_date <= ${today}::date)
        AND (l.expiry_date IS NULL OR l.expiry_date > ${today}::date)
        AND EXISTS (
          SELECT 1 
          FROM legislation_agency_xref lax
          WHERE lax.legislation_guid = l.legislation_guid
            AND lax.agency_code = ${agencyCode}
        )
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
   * Finds legislation by type code, citation, and parent GUID
   */
  async findByTypeAndCitation(
    legislationTypeCode: string,
    citation: string | null,
    parentLegislationGuid: string | null,
  ): Promise<LegislationRow | null> {
    return this.prisma.legislation.findFirst({
      where: {
        legislation_type_code: legislationTypeCode,
        citation: citation,
        parent_legislation_guid: parentLegislationGuid,
      },
    });
  }

  /**
   * Upserts legislation based on type code, citation, and parent GUID
   */
  async upsert(input: CreateLegislationInput): Promise<LegislationRow> {
    const existing = await this.findByTypeAndCitation(
      input.legislationTypeCode,
      input.citation ?? null,
      input.parentLegislationGuid ?? null,
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
   * Gets distinct child legislation types for a given parent legislation
   */
  async getChildTypes(agencyCode: string, parentGuid?: string): Promise<string[]> {
    const today = new Date();

    // Build the where clause for parent
    const parentWhere = parentGuid ? { parent_legislation_guid: parentGuid } : { parent_legislation_guid: null };

    // Find all children matching criteria
    const children = await this.prisma.legislation.findMany({
      where: {
        ...parentWhere,
        OR: [{ effective_date: null }, { effective_date: { lte: today } }],
        AND: [{ OR: [{ expiry_date: null }, { expiry_date: { gt: today } }] }],
        legislation_agency_xref: {
          some: {
            agency_code: agencyCode,
          },
        },
      },
      select: {
        legislation_type_code: true,
      },
      distinct: ["legislation_type_code"],
    });

    // Extract unique types and sort by hierarchy order
    const typeOrder: Record<string, number> = {
      ACT: 1,
      REG: 2,
      BYLAW: 3,
      PART: 4,
      DIV: 5,
      RULE: 6,
      SCHED: 7,
      SEC: 8,
      SUBSEC: 9,
      PAR: 10,
      SUBPAR: 11,
      DEF: 12,
    };

    const types = children.map((c) => c.legislation_type_code);
    types.sort((a, b) => (typeOrder[a] ?? 9) - (typeOrder[b] ?? 9));

    return types;
  }

  /**
   * Gets direct children of a legislation node (not recursive descendants)
   */
  async findDirectChildren(agencyCode: string, parentGuid: string, legislationTypeCode?: string) {
    const today = new Date();

    const whereClause: any = {
      parent_legislation_guid: parentGuid,
      OR: [{ effective_date: null }, { effective_date: { lte: today } }],
      AND: [{ OR: [{ expiry_date: null }, { expiry_date: { gt: today } }] }],
      legislation_agency_xref: {
        some: {
          agency_code: agencyCode,
        },
      },
    };

    // Add type filter if provided
    if (legislationTypeCode) {
      whereClause.legislation_type_code = legislationTypeCode;
    }

    const prismaLegislation = await this.prisma.legislation.findMany({
      where: whereClause,
      orderBy: {
        display_order: "asc",
      },
    });

    try {
      return this.mapper.mapArray<legislation, Legislation>(
        prismaLegislation as legislation[],
        "legislation",
        "Legislation",
      );
    } catch (error) {
      this.logger.error("Error mapping legislation", error);
    }
  }

  /**
   * Creates an agency association for a legislation record
   */
  async createAgencyXref(legislationGuid: string, agencyCode: string, createUserId: string): Promise<void> {
    // Check if association already exists
    const existing = await this.prisma.legislation_agency_xref.findFirst({
      where: {
        legislation_guid: legislationGuid,
        agency_code: agencyCode,
      },
    });

    if (!existing) {
      await this.prisma.legislation_agency_xref.create({
        data: {
          legislation_guid: legislationGuid,
          agency_code: agencyCode,
          create_user_id: createUserId,
          create_utc_timestamp: new Date(),
        },
      });
    }
  }

  async getPendingLegislationSources(): Promise<LegislationSource[]> {
    const sources = await this.prisma.legislation_source.findMany({
      where: {
        active_ind: true,
        imported_ind: false,
      },
      orderBy: {
        short_description: "asc",
      },
    });

    return sources.map((source) => ({
      legislationSourceGuid: source.legislation_source_guid,
      shortDescription: source.short_description,
      longDescription: source.long_description,
      sourceUrl: source.source_url,
      agencyCode: source.agency_code,
      activeInd: source.active_ind,
      importedInd: source.imported_ind,
      lastImportTimestamp: source.last_import_timestamp,
    }));
  }

  async markLegislationSourceImported(legislationSourceGuid: string): Promise<void> {
    await this.prisma.legislation_source.update({
      where: {
        legislation_source_guid: legislationSourceGuid,
      },
      data: {
        imported_ind: true,
        last_import_timestamp: new Date(),
        update_user_id: "system",
        update_utc_timestamp: new Date(),
      },
    });
  }
}
