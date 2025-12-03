import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { legislation } from "../../../prisma/shared/generated/legislation";
import { Legislation } from "./dto/legislation";

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
        AND l.effective_date < ${today}::date
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
}
