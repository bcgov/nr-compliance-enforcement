import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { legislation } from "../../../prisma/shared/generated/legislation";
import { Legislation } from "./dto/legislation";
import { Prisma } from "@prisma/client";

@Injectable()
export class LegislationService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(LegislationService.name);

  async findMany(agencyCode: string, legislationTypeCode?: string, ancestorGuid?: string) {
    const today = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD

    const baseCondition = ancestorGuid
      ? `legislation_guid = '${ancestorGuid}'::uuid`
      : `parent_legislation_guid IS NULL`;

    const prismaLegislation = await this.prisma.$queryRawUnsafe<legislation[]>(`
    WITH RECURSIVE descendants AS (
      SELECT legislation_guid
      FROM legislation
      WHERE ${baseCondition}
      
      UNION ALL
      
      SELECT l.legislation_guid
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
      l.alternate_text,
      l.display_order
    FROM legislation l
    WHERE l.legislation_guid IN (SELECT legislation_guid FROM descendants)
      AND l.legislation_type_code = '${legislationTypeCode}'
      AND l.effective_date < '${today}'::date
      AND (l.expiry_date IS NULL OR l.expiry_date > '${today}'::date)
      AND EXISTS (
        SELECT 1 FROM legislation_agency_xref lax
        WHERE lax.legislation_guid = l.legislation_guid
          AND lax.agency_code = '${agencyCode}'
      )
  `);
    console.log(prismaLegislation);
    try {
      return this.mapper.mapArray<legislation, Legislation>(prismaLegislation, "legislation", "Legislation");
    } catch (error) {
      this.logger.error("Error mapping legislation", error);
    }
  }
}
