import { Injectable } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { build_code } from "prisma/shared/generated/build_code";

@Injectable()
export class BuildCodeService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findAll() {
    const prismaBuildCodes = await this.prisma.build_code.findMany({
      select: {
        build_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    return this.mapper.mapArray<build_code, BuildCodeService>(
      prismaBuildCodes as Array<build_code>,
      "build_code",
      "BuildCode",
    );
  }
}
