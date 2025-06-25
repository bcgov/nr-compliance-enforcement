import { Injectable } from "@nestjs/common";
import { CaseManagementPrismaService } from "../../prisma/cm/prisma.cm.service";
import { IPMAuthCategoryCode } from "./entities/ipm_auth_category_code.entity";

@Injectable()
export class IpmAuthCategoryCodeService {
  constructor(private readonly prisma: CaseManagementPrismaService) {}

  async findAll() {
    let queryResult = null;
    const dataContext = this.prisma.ipm_auth_category_code;

    queryResult = await dataContext.findMany({
      select: {
        ipm_auth_category_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    const ipmAuthCategoryCodes: IPMAuthCategoryCode[] = queryResult.map((queryResult) => ({
      ipmAuthCategoryCode: queryResult.ipm_auth_category_code,
      shortDescription: queryResult.short_description,
      longDescription: queryResult.long_description,
      displayOrder: queryResult.display_order,
      activeIndicator: queryResult.active_ind,
    }));

    return ipmAuthCategoryCodes;
  }
}
