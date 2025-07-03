import { Injectable } from "@nestjs/common";
import { CaseManagementPrismaService } from "../../prisma/cm/prisma.cm.service";
import { InactionJustificationCode } from "./entities/inaction_justification_code.entity";

@Injectable()
export class InactionJustificationTypeService {
  constructor(private readonly prisma: CaseManagementPrismaService) {}

  async find(agencyCode?: string) {
    let queryResult = null;
    const dataContext = this.prisma.inaction_reason_code;

    queryResult = await dataContext.findMany({
      where: {
        agency_code: agencyCode ? agencyCode : undefined,
      },
      select: {
        inaction_reason_code: true,
        agency_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    const inactionJustificationCodes: InactionJustificationCode[] = queryResult.map((queryResult) => ({
      inactionJustificationCode: queryResult.inaction_reason_code,
      agencyCode: queryResult.agency_code,
      shortDescription: queryResult.short_description,
      longDescription: queryResult.long_description,
      displayOrder: queryResult.display_order,
      activeIndicator: queryResult.active_ind,
    }));

    return inactionJustificationCodes;
  }
}
