import { Injectable } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { facial_hair_style_code } from "prisma/shared/generated/facial_hair_style_code";
import { FacialHairStyleCode } from "src/shared/facial_hair_style_code/dto/facial_hair_style_code";

@Injectable()
export class FacialHairStyleCodeService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findAll() {
    const prismaFacialHairStyleCodes = await this.prisma.facial_hair_style_code.findMany({
      select: {
        facial_hair_style_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    return this.mapper.mapArray<facial_hair_style_code, FacialHairStyleCode>(
      prismaFacialHairStyleCodes as Array<facial_hair_style_code>,
      "facial_hair_style_code",
      "FacialHairStyleCode",
    );
  }
}
