import { Injectable } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { eye_colour_code } from "prisma/shared/generated/eye_colour_code";
import { EyeColourCode } from "src/shared/eye_colour_code/dto/eye_colour_code";

@Injectable()
export class EyeColourCodeService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findAll() {
    const prismaEyeColourCodes = await this.prisma.eye_colour_code.findMany({
      select: {
        eye_colour_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    return this.mapper.mapArray<eye_colour_code, EyeColourCode>(
      prismaEyeColourCodes as Array<eye_colour_code>,
      "eye_colour_code",
      "EyeColourCode",
    );
  }
}
