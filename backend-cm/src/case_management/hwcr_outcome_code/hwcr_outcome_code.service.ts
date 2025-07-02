import { Injectable } from "@nestjs/common";
import { HwcrOutcomeCode } from "./entities/hwcr_outcome_code.entity";
import { CaseManagementPrismaService } from "../../prisma/cm/prisma.cm.service";

@Injectable()
export class HwcrOutcomeCodeService {
  constructor(private readonly prisma: CaseManagementPrismaService) {}

  async findAll() {
    const prismaHWCROutcomeCodes = await this.prisma.hwcr_outcome_code.findMany({
      select: {
        hwcr_outcome_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
      orderBy: {
        display_order: "asc",
      },
    });

    const hwcrOutcomeCodes: HwcrOutcomeCode[] = prismaHWCROutcomeCodes.map((prismaHWCROutcomeCodes) => ({
      hwcrOutcomeCode: prismaHWCROutcomeCodes.hwcr_outcome_code,
      shortDescription: prismaHWCROutcomeCodes.short_description,
      longDescription: prismaHWCROutcomeCodes.long_description,
      displayOrder: prismaHWCROutcomeCodes.display_order,
      activeIndicator: prismaHWCROutcomeCodes.active_ind,
    }));

    return hwcrOutcomeCodes;
  }

  findOne(id: string) {
    return this.prisma.hwcr_outcome_code.findUnique({
      where: { hwcr_outcome_code: id, active_ind: true },
    });
  }
}
