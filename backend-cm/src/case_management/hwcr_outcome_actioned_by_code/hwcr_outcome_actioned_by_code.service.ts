import { Injectable } from "@nestjs/common";
import { HwcrOutcomeActionedByCode } from "./entities/hwcr_outcome_actioned_by_code.entity";
import { ComplaintOutcomePrismaService } from "../../prisma/complaint_outcome/prisma.complaint_outcome.service";

@Injectable()
export class HwcrOutcomeActionedByCodeService {
  constructor(private readonly prisma: ComplaintOutcomePrismaService) {}

  async findAll() {
    const prismaHWCROutcomeActionedByCodes = await this.prisma.hwcr_outcome_actioned_by_code.findMany({
      select: {
        hwcr_outcome_actioned_by_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
      orderBy: {
        display_order: "asc",
      },
    });

    const hwcrOutcomeActionedByCodes: HwcrOutcomeActionedByCode[] = prismaHWCROutcomeActionedByCodes.map(
      (prismaHWCROutcomeActionedByCodes) => ({
        hwcrOutcomeActionedByCode: prismaHWCROutcomeActionedByCodes.hwcr_outcome_actioned_by_code,
        shortDescription: prismaHWCROutcomeActionedByCodes.short_description,
        longDescription: prismaHWCROutcomeActionedByCodes.long_description,
        displayOrder: prismaHWCROutcomeActionedByCodes.display_order,
        activeIndicator: prismaHWCROutcomeActionedByCodes.active_ind,
      }),
    );

    return hwcrOutcomeActionedByCodes;
  }

  findOne(id: string) {
    return this.prisma.hwcr_outcome_actioned_by_code.findUnique({
      where: { hwcr_outcome_actioned_by_code: id, active_ind: true },
    });
  }
}
