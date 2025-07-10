import { Injectable, Logger } from "@nestjs/common";
import { ParkArea } from "./dto/park_area";
import { ParkAreaInput } from "./dto/park_area.input";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { park_area } from "prisma/shared/generated/park_area";

@Injectable()
export class ParkAreaService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(ParkAreaService.name);

  async findOne(id: string) {
    const prismaParkArea = await this.prisma.park_area.findUnique({
      where: {
        park_area_guid: id,
      },
    });

    try {
      return this.mapper.map<park_area, ParkArea>(prismaParkArea as park_area, "park_area", "ParkArea");
    } catch (error) {
      this.logger.error("Error mapping park_area", error);
    }
  }

  async findAll() {
    const prismaParkAreas = await this.prisma.park_area.findMany({
      orderBy: {
        name: "asc",
      },
    });

    try {
      return this.mapper.mapArray<park_area, ParkArea>(prismaParkAreas as Array<park_area>, "park_area", "ParkArea");
    } catch (error) {
      this.logger.error("Error mapping all park_area", error);
    }
  }

  async create(input: ParkAreaInput): Promise<ParkArea> {
    const prismaParkArea = await this.prisma.park_area.create({
      data: {
        name: input.name,
        region_name: input.regionName,
        create_user_id: "system",
      },
    });
    return this.mapper.map<park_area, ParkArea>(prismaParkArea as park_area, "park_area", "ParkArea");
  }

  async update(park_areaGuid: string, input: ParkAreaInput): Promise<ParkArea> {
    const existingParkArea = await this.prisma.park_area.findUnique({
      where: { park_area_guid: park_areaGuid },
    });
    if (!existingParkArea) throw new Error("ParkArea not found");

    const prismaParkArea = await this.prisma.park_area.update({
      where: { park_area_guid: park_areaGuid },
      data: {
        name: input.name,
        region_name: input.regionName,
      },
    });
    return this.mapper.map<park_area, ParkArea>(prismaParkArea as park_area, "park_area", "ParkArea");
  }

  async delete(park_areaGuid: string): Promise<ParkArea> {
    const existingParkArea = await this.prisma.park_area.findUnique({
      where: { park_area_guid: park_areaGuid },
    });
    if (!existingParkArea) throw new Error("ParkArea not found");

    const prismaParkArea = await this.prisma.park_area.delete({
      where: { park_area_guid: park_areaGuid },
    });
    return this.mapper.map<park_area, ParkArea>(prismaParkArea as park_area, "park_area", "ParkArea");
  }
}
