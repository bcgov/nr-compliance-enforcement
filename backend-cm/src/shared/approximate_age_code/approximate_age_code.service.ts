import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { ApproximateAgeCode } from "src/shared/approximate_age_code/dto/approximate_age_code";
import { approximate_age_code } from "prisma/shared/generated/approximate_age_code";

@Injectable()
export class ApproximateAgeCodeService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(ApproximateAgeCodeService.name);

  async findAll() {
    const prismaApproximateAgeCodes = await this.prisma.approximate_age_code.findMany({
      select: {
        approximate_age_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    return this.mapper.mapArray<approximate_age_code, ApproximateAgeCode>(
      prismaApproximateAgeCodes as Array<approximate_age_code>,
      "approximate_age_code",
      "ApproximateAgeCode",
    );
  }
}
