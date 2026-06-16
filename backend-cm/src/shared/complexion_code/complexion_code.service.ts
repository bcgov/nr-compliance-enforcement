import { Injectable } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { complexion_code } from "prisma/shared/generated/complexion_code";

@Injectable()
export class ComplexionCodeService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findAll() {
    const prismaComplexionCodes = await this.prisma.complexion_code.findMany({
      select: {
        complexion_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    return this.mapper.mapArray<complexion_code, ComplexionCodeService>(
      prismaComplexionCodes as Array<complexion_code>,
      "complexion_code",
      "ComplexionCode",
    );
  }
}
