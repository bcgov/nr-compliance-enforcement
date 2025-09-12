import { Injectable } from "@nestjs/common";
import { ComplaintOutcomePrismaService } from "../../prisma/complaint_outcome/prisma.complaint_outcome.service";

@Injectable()
export class ActionCodeService {
  constructor(private readonly prisma: ComplaintOutcomePrismaService) {}

  findAll() {
    return this.prisma.action_code.findMany();
  }

  findOne(id: string) {
    return this.prisma.action_code.findUnique({
      where: {
        action_code: id,
        active_ind: true,
      },
    });
  }

  async findAllCodesByType(actionTypeCodes?: string[]) {
    const xrefDataContext = this.prisma.action_type_action_xref;
    let queryResult = null;
    queryResult = await xrefDataContext.findMany({
      where: {
        action_type_code: actionTypeCodes && actionTypeCodes.length > 0 ? { in: actionTypeCodes } : undefined,
        active_ind: true,
      },
      select: {
        action_type_code: true,
        action_code: true,
        display_order: true,
        active_ind: true,
        action_code_action_type_action_xref_action_codeToaction_code: {
          select: {
            short_description: true,
            long_description: true,
          },
        },
      },
      orderBy: [{ display_order: "asc" }],
    });

    const actions = queryResult.map((record) => ({
      actionTypeCode: record.action_type_code,
      actionCode: record.action_code,
      displayOrder: record.display_order,
      activeIndicator: record.active_ind,
      shortDescription: record.action_code_action_type_action_xref_action_codeToaction_code.short_description,
      longDescription: record.action_code_action_type_action_xref_action_codeToaction_code.long_description,
    }));

    return actions;
  }
}
