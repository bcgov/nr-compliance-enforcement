import { Injectable } from "@nestjs/common";
import { CaseManagementPrismaService } from "../../prisma/cm/prisma.cm.service";
import { DrugCode } from "./entities/drug_code.entity";

@Injectable()
export class DrugCodeService {
  constructor(private readonly prisma: CaseManagementPrismaService) {}

  async findAll() {
    const prismaDrugCodes = await this.prisma.drug_code.findMany({
      select: {
        drug_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    const drugCodes: DrugCode[] = prismaDrugCodes.map((prismaDrugCodes) => ({
      drugCode: prismaDrugCodes.drug_code,
      shortDescription: prismaDrugCodes.short_description,
      longDescription: prismaDrugCodes.long_description,
      displayOrder: prismaDrugCodes.display_order,
      activeIndicator: prismaDrugCodes.active_ind,
    }));

    return drugCodes;
  }

  findOne(id: string) {
    return this.prisma.drug_code.findUnique({
      where: {
        drug_code: id,
        active_ind: true,
      },
    });
  }
}
