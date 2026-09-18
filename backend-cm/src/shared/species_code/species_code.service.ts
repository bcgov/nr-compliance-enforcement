import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { species_code } from "prisma/shared/generated/species_code";
import { SpeciesCode } from "src/shared/species_code/dto/species_code";

@Injectable()
export class SpeciesCodeService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(SpeciesCodeService.name);

  async findAll() {
    const prismaSpecies = await this.prisma.species_code.findMany({
      select: {
        species_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
        large_carnivore_ind: true,
      },
    });

    return this.mapper.mapArray<species_code, SpeciesCode>(
      prismaSpecies as Array<species_code>,
      "species_code",
      "SpeciesCode",
    );
  }
}
