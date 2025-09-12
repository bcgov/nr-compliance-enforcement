import { Injectable } from "@nestjs/common";
import { ComplaintOutcomePrismaService } from "../../prisma/complaint_outcome/prisma.complaint_outcome.service";
import { DrugMethodCode } from "./entities/drug_method_code.entity";

@Injectable()
export class DrugMethodCodeService {
  constructor(private readonly prisma: ComplaintOutcomePrismaService) {}

  async findAll() {
    const prismaDrugMethodCodes = await this.prisma.drug_method_code.findMany({
      select: {
        drug_method_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    const drugMethodCodes: DrugMethodCode[] = prismaDrugMethodCodes.map((prismaDrugMethodCodes) => ({
      drugMethodCode: prismaDrugMethodCodes.drug_method_code,
      shortDescription: prismaDrugMethodCodes.short_description,
      longDescription: prismaDrugMethodCodes.long_description,
      displayOrder: prismaDrugMethodCodes.display_order,
      activeIndicator: prismaDrugMethodCodes.active_ind,
    }));

    return drugMethodCodes;
  }

  findOne(id: string) {
    return this.prisma.drug_method_code.findUnique({
      where: {
        drug_method_code: id,
        active_ind: true,
      },
    });
  }
}
