import { Injectable } from "@nestjs/common";
import { CaseManagementPrismaService } from "../../../prisma/cm/prisma.cm.service";
import { DischargeCode } from "./entities/discharge_code.entity";

@Injectable()
export class DischargeCodeService {
  constructor(private readonly prisma: CaseManagementPrismaService) {}

  findAll = async (): Promise<Array<DischargeCode>> => {
    const codes = await this.prisma.discharge_code.findMany({
      select: {
        discharge_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
      orderBy: [{ display_order: "asc" }],
    });

    return codes.map(({ discharge_code, short_description, long_description, display_order, active_ind }) => ({
      dischargeCode: discharge_code,
      shortDescription: short_description,
      longDescription: long_description,
      displayOrder: display_order,
      activeIndicator: active_ind,
    }));
  };
}
