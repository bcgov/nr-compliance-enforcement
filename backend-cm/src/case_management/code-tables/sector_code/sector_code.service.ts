import { Injectable } from "@nestjs/common";
import { CaseManagementPrismaService } from "../../../prisma/cm/prisma.cm.service";
import { SectorCode } from "./entities/sector_code.entity";

@Injectable()
export class SectorCodeService {
  constructor(private readonly prisma: CaseManagementPrismaService) {}

  findAll = async (): Promise<Array<SectorCode>> => {
    const codes = await this.prisma.sector_code.findMany({
      select: {
        sector_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
      orderBy: [{ display_order: "asc" }],
    });

    return codes.map(({ sector_code, short_description, long_description, display_order, active_ind }) => ({
      sectorCode: sector_code,
      shortDescription: short_description,
      longDescription: long_description,
      displayOrder: display_order,
      activeIndicator: active_ind,
    }));
  };
}
