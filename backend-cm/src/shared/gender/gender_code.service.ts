import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { gender_code } from "prisma/shared/generated/gender_code";
import { Gender } from "src/shared/gender/dto/gender_code";

@Injectable()
export class GenderCodeService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(GenderCodeService.name);

  async findAll() {
    const prismaGenderCodes = await this.prisma.gender_code.findMany({
      select: {
        gender_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    return this.mapper.mapArray<gender_code, Gender>(prismaGenderCodes as Array<gender_code>, "gender_code", "Gender");
  }
}
