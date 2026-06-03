import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { country_subdivision_code } from "prisma/shared/generated/country_subdivision_code";
import { CountrySubdivisionCode } from "src/shared/country_subdivision_code/dto/country_subdivision_code";

@Injectable()
export class CountrySubdivisionCodeService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(CountrySubdivisionCodeService.name);

  async findAll() {
    const prismaCountrySubdivisionCodes = await this.prisma.country_subdivision_code.findMany({
      select: {
        country_subdivision_code: true,
        country_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    return this.mapper.mapArray<country_subdivision_code, CountrySubdivisionCode>(
      prismaCountrySubdivisionCodes as Array<country_subdivision_code>,
      "country_subdivision_code",
      "CountrySubdivisionCode",
    );
  }
}
