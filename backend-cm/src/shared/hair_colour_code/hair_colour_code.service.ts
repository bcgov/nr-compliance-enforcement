import { Injectable } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { hair_colour_code } from "prisma/shared/generated/hair_colour_code";
import { HairColourCode } from "src/shared/hair_colour_code/dto/hair_colour_code";

@Injectable()
export class HairColourCodeService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findAll() {
    const prismaHairColourCodes = await this.prisma.hair_colour_code.findMany({
      select: {
        hair_colour_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    return this.mapper.mapArray<hair_colour_code, HairColourCode>(
      prismaHairColourCodes as Array<hair_colour_code>,
      "hair_colour_code",
      "HairColourCode",
    );
  }
}
