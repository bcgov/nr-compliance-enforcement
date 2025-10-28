import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { office } from "prisma/shared/generated/office";
import { Office } from "./dto/office";

@Injectable()
export class OfficeService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(OfficeService.name);

  async findAll() {
    const prismaOffices = await this.prisma.office.findMany({
      select: {
        office_guid: true,
        geo_organization_unit_code: true,
        agency_code_ref: true,
        create_user_id: true,
        create_utc_timestamp: true,
        update_user_id: true,
        update_utc_timestamp: true,
      },
    });

    return this.mapper.mapArray<office, Office>(prismaOffices as Array<office>, "office", "Office");
  }
}
