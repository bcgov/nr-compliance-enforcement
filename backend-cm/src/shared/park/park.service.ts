import { Injectable, Logger } from "@nestjs/common";
import { Park } from "./dto/park";
import { ParkArgs, ParkInput } from "./dto/park.input";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { park } from "prisma/shared/generated/park";

@Injectable()
export class ParkService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(ParkService.name);

  async findByArea(id: String) {
    const prismaPark = await this.prisma.park.findMany({
      where: {
        park_area_xref: {
          some: {
            park_area_guid: id as any,
          },
        },
      },
      select: {
        park_guid: true,
        external_id: true,
        name: true,
        legal_name: true,
      },
      orderBy: { name: "asc" } as any,
    });

    return this.mapper.mapArray<park, Park>(prismaPark as Array<park>, "park", "Park");
  }

  async find(args: ParkArgs) {
    const query = {
      select: {
        park_guid: true,
        external_id: true,
        name: true,
        legal_name: true,
        park_area_xref: {
          select: {
            park_area: {
              select: {
                park_area_guid: true,
                name: true,
                region_name: true,
              },
            },
          },
        },
      },
      skip: args.skip,
      take: args.take,
      where: {},
      orderBy: { name: "asc" } as any, // Workaround for Prisma type issue with orderBy
    };

    args.search && (query.where = { name: { contains: args.search, mode: "insensitive" } });

    const prismaPark = await this.prisma.park.findMany(query);

    return this.mapper.mapArray<park, Park>(prismaPark as Array<park>, "park", "Park");
  }

  async findOne(id: string) {
    const prismaPark = await this.prisma.park.findUnique({
      include: {
        park_area_xref: {
          include: {
            park_area: true,
          },
        },
      },
      where: {
        park_guid: id,
      },
    });

    try {
      return this.mapper.map<park, Park>(prismaPark as park, "park", "Park");
    } catch (error) {
      this.logger.error("Error mapping park", error);
    }
  }

  async findOneByExternalId(id: string) {
    const prismaPark = await this.prisma.park.findFirst({
      where: {
        external_id: id,
      },
    });

    try {
      return this.mapper.map<park, Park>(prismaPark as park, "park", "Park");
    } catch (error) {
      this.logger.error("Error mapping park", error);
    }
  }

  async create(input: ParkInput): Promise<Park> {
    const prismaPark = await this.prisma.park.create({
      data: {
        external_id: input.externalId,
        name: input.name,
        legal_name: input.legalName,
        park_area_xref: {
          create: input.parkAreas
            ? input.parkAreas.map((parkArea) => ({
                park_area_guid: parkArea.parkAreaGuid,
                create_user_id: "system",
              }))
            : [],
        },
        create_user_id: "system",
      },
    });
    return this.mapper.map<park, Park>(prismaPark as park, "park", "Park");
  }

  async update(parkGuid: string, input: ParkInput): Promise<Park> {
    const existingPark = await this.prisma.park.findUnique({
      where: { park_guid: parkGuid },
    });
    if (!existingPark) throw new Error("Park not found");

    const existingParkAreaXrefs = await this.prisma.park_area_xref.findMany({
      where: { park_guid: parkGuid },
    });
    // Find park_area_xref records to delete if they are not in input.parkAreas
    const parkAreaGuidsToDelete = existingParkAreaXrefs
      .filter((xref) => !input.parkAreas?.some((area) => area.parkAreaGuid === xref.park_area_guid))
      .map((xref) => xref.park_area_guid);
    // Find park_area_xref records to create if they are in input.parkAreas
    const parkAreaGuidsToCreate = input.parkAreas
      ? input.parkAreas.filter(
          (area) => !existingParkAreaXrefs.some((xref) => xref.park_area_guid === area.parkAreaGuid),
        )
      : [];

    const prismaPark = await this.prisma.park.update({
      where: { park_guid: parkGuid },
      data: {
        external_id: input.externalId,
        name: input.name,
        legal_name: input.legalName,
        park_area_xref: {
          deleteMany: {
            park_area_guid: { in: parkAreaGuidsToDelete },
          },
          create:
            parkAreaGuidsToCreate.map((parkArea) => ({
              park_area_guid: parkArea.parkAreaGuid,
              create_user_id: "system",
            })) ?? [],
        },
      },
    });
    return this.mapper.map<park, Park>(prismaPark as park, "park", "Park");
  }

  async delete(parkGuid: string): Promise<Park> {
    const existingPark = await this.prisma.park.findUnique({
      where: { park_guid: parkGuid },
    });
    if (!existingPark) throw new Error("Park not found");

    const prismaPark = await this.prisma.park.delete({
      where: { park_guid: parkGuid },
    });
    return this.mapper.map<park, Park>(prismaPark as park, "park", "Park");
  }
}
