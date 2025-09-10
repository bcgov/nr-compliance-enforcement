import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { agency_code } from "prisma/shared/generated/agency_code";
import { AgencyCode } from "./dto/agency_code";

@Injectable()
export class AgencyCodeService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(AgencyCodeService.name);

  async findAll() {
    const prismaAgencies = await this.prisma.agency_code.findMany({
      select: {
        agency_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
        external_agency_ind: true,
      },
    });

    return this.mapper.mapArray<agency_code, AgencyCode>(
      prismaAgencies as Array<agency_code>,
      "agency_code",
      "AgencyCode",
    );
  }
}
