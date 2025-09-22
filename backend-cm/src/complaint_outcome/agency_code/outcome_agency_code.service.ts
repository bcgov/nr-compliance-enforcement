import { Injectable } from "@nestjs/common";
import { ComplaintOutcomePrismaService } from "../../prisma/complaint_outcome/prisma.complaint_outcome.service";
import { OutcomeAgencyCode } from "./entities/outcome_agency_code.entity";

@Injectable()
export class OutcomeAgencyCodeService {
  constructor(private readonly prisma: ComplaintOutcomePrismaService) {}

  async findAll() {
    const prismaAgencyCodes = await this.prisma.outcome_agency_code.findMany({
      select: {
        outcome_agency_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
      orderBy: [{ display_order: "asc" }],
    });

    const agencyCodes: OutcomeAgencyCode[] = prismaAgencyCodes.map((prismaAgencyCodes) => ({
      outcomeAgencyCode: prismaAgencyCodes.outcome_agency_code,
      shortDescription: prismaAgencyCodes.short_description,
      longDescription: prismaAgencyCodes.long_description,
      displayOrder: prismaAgencyCodes.display_order,
      activeIndicator: prismaAgencyCodes.active_ind,
    }));

    return agencyCodes;
  }

  findOne(id: string) {
    return this.prisma.outcome_agency_code.findUnique({
      where: {
        outcome_agency_code: id,
        active_ind: true,
      },
    });
  }
}
