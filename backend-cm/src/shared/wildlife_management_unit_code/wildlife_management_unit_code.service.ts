import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { wildlife_management_unit_code } from "prisma/shared/generated/wildlife_management_unit_code";
import { WildlifeManagementUnitCode } from "src/shared/wildlife_management_unit_code/dto/wildlife_management_unit_code";

@Injectable()
export class WildlifeManagementUnitCodeService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(WildlifeManagementUnitCodeService.name);

  async findAll() {
    const prismaWMU = await this.prisma.wildlife_management_unit_code.findMany({
      select: {
        wildlife_management_unit_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
      orderBy: {
        display_order: "asc",
      },
    });

    return this.mapper.mapArray<wildlife_management_unit_code, WildlifeManagementUnitCode>(
      prismaWMU as Array<wildlife_management_unit_code>,
      "wildlife_management_unit_code",
      "WildlifeManagementUnitCode",
    );
  }
}
