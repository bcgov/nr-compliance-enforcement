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

  async findMany(
    agencyCode: string,
    legislationTypeCode?: string,
    parentGuid?: string,
    directDescendantsOnly?: boolean,
  ) {
    const today = new Date();

    const prismaLegislation = await this.prisma.legislation.findMany({
      where: {
        legislation_type_code: legislationTypeCode,
        effective_date: {
          lt: today,
        },
        legislation_agency_xref: {
          some: {
            agency_code: agencyCode,
          },
        },
      },
      select: {
        legislation_guid: true,
        legislation_type_code: true,
        parent_legislation_guid: true,
        citation: true,
        full_citation: true,
        section_title: true,
        legislation_text: true,
        alternate_text: true,
        display_order: true,
      },
    });

    try {
      return this.mapper.mapArray<legislation, Legislation>(
        prismaLegislation as Array<legislation>,
        "legislation",
        "Legislation",
      );
    } catch (error) {
      this.logger.error("Error mapping legislation", error);
    }
  }
}
