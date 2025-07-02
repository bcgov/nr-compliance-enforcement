import { Injectable, Logger } from "@nestjs/common";
import { ParkAreaMapping } from "./dto/park_area_mapping";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { park_area_mapping } from "prisma/shared/generated/park_area_mapping";

@Injectable()
export class ParkAreaMappingService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(ParkAreaMappingService.name);

  async findByExternalId(id: string) {
    const prismaParkAreaMappings = await this.prisma.park_area_mapping.findMany({
      where: {
        external_id: id,
      },
    });

    try {
      return prismaParkAreaMappings.map((prismaParkAreaMapping) =>
        this.mapper.map<park_area_mapping, ParkAreaMapping>(
          prismaParkAreaMapping as park_area_mapping,
          "park_area_mapping",
          "ParkAreaMapping",
        ),
      );
    } catch (error) {
      this.logger.error("Error mapping park_area_mapping", error);
    }
  }
}
