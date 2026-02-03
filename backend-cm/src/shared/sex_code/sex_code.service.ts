import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { sex_code } from "prisma/shared/generated/sex_code";
import { SexCode } from "./dto/sex_code";

@Injectable()
export class SexCodeService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(SexCodeService.name);

  async findAll() {
    const prismaSexCodes = await this.prisma.sex_code.findMany({
      select: {
        sex_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    return this.mapper.mapArray<sex_code, SexCode>(
      prismaSexCodes as Array<sex_code>,
      "sex_code",
      "SexCode",
    );
  }
}
