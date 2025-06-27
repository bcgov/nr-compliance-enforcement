import { Injectable } from "@nestjs/common";
import { CaseManagementPrismaService } from "../../../prisma/cm/prisma.cm.service";
import { CaseLocationCode } from "./entities/case_location_code.entity";

@Injectable()
export class CaseLocationCodeService {
  constructor(private readonly prisma: CaseManagementPrismaService) {}

  findAll = async (): Promise<Array<CaseLocationCode>> => {
    const codes = await this.prisma.case_location_code.findMany({
      where: {
        active_ind: true,
      },
      select: {
        case_location_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
      orderBy: [{ display_order: "asc" }],
    });

    return codes.map(({ case_location_code, short_description, long_description, display_order, active_ind }) => ({
      caseLocationCode: case_location_code,
      shortDescription: short_description,
      longDescription: long_description,
      displayOrder: display_order,
      activeIndicator: active_ind,
    }));
  };
}
