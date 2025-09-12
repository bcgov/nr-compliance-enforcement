import { Injectable } from "@nestjs/common";
import { ComplaintOutcomePrismaService } from "../../../prisma/complaint_outcome/prisma.complaint_outcome.service";
import { NonComplianceCode } from "./entities/non_compliance_code.entity";

@Injectable()
export class NonComplianceCodeService {
  constructor(private readonly prisma: ComplaintOutcomePrismaService) {}

  findAll = async (): Promise<Array<NonComplianceCode>> => {
    const codes = await this.prisma.non_compliance_decision_matrix_code.findMany({
      select: {
        non_compliance_decision_matrix_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    return codes.map(
      ({ non_compliance_decision_matrix_code, short_description, long_description, display_order, active_ind }) => ({
        nonComplianceCode: non_compliance_decision_matrix_code,
        shortDescription: short_description,
        longDescription: long_description,
        displayOrder: display_order,
        activeIndicator: active_ind,
      }),
    );
  };
}
