import { Injectable } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { hair_length_code } from "prisma/shared/generated/hair_length_code";
import { HairLengthCode } from "src/shared/hair_length_code/dto/hair_length_code";

@Injectable()
export class HairLengthCodeService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findAll() {
    const prismaHairLengthCodes = await this.prisma.hair_length_code.findMany({
      select: {
        hair_length_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    return this.mapper.mapArray<hair_length_code, HairLengthCode>(
      prismaHairLengthCodes as Array<hair_length_code>,
      "hair_length_code",
      "HairLengthCode",
    );
  }
}
