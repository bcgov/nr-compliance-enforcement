import { Injectable } from "@nestjs/common";
import { ComplaintOutcomePrismaService } from "../../prisma/complaint_outcome/prisma.complaint_outcome.service";
import { DrugRemainingOutcomeCode } from "./entities/drug_remaining_outcome_code.entity";

@Injectable()
export class DrugRemainingOutcomeCodeService {
  constructor(private readonly prisma: ComplaintOutcomePrismaService) {}

  async findAll() {
    const prismaDrugRemainingOutcomeCodes = await this.prisma.drug_remaining_outcome_code.findMany({
      select: {
        drug_remaining_outcome_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    const drugRemainingOutcomeCodes: DrugRemainingOutcomeCode[] = prismaDrugRemainingOutcomeCodes.map(
      (prismaDrugRemainingOutcomeCodes) => ({
        drugRemainingOutcomeCode: prismaDrugRemainingOutcomeCodes.drug_remaining_outcome_code,
        shortDescription: prismaDrugRemainingOutcomeCodes.short_description,
        longDescription: prismaDrugRemainingOutcomeCodes.long_description,
        displayOrder: prismaDrugRemainingOutcomeCodes.display_order,
        activeIndicator: prismaDrugRemainingOutcomeCodes.active_ind,
      }),
    );

    return drugRemainingOutcomeCodes;
  }

  findOne(id: string) {
    return this.prisma.drug_remaining_outcome_code.findUnique({
      where: {
        drug_remaining_outcome_code: id,
        active_ind: true,
      },
    });
  }
}
