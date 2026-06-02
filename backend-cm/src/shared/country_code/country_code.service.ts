import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { CountryCode } from "src/shared/country_code/dto/country_code";
import { country_code } from "prisma/shared/generated/country_code";

@Injectable()
export class CountryCodeService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(CountryCodeService.name);

  async findAll() {
    const prismaCountryCodes = await this.prisma.country_code.findMany({
      select: {
        country_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
      orderBy: {
        display_order: "asc",
      },
    });

    return this.mapper.mapArray<country_code, CountryCode>(
      prismaCountryCodes as Array<country_code>,
      "country_code",
      "CountryCode",
    );
  }
}
