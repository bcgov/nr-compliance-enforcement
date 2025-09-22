import { Injectable } from "@nestjs/common";
import { ComplaintOutcomePrismaService } from "../../prisma/complaint_outcome/prisma.complaint_outcome.service";
import { IPMAuthCategoryCode } from "./entities/ipm_auth_category_code.entity";

@Injectable()
export class IpmAuthCategoryCodeService {
  constructor(private readonly prisma: ComplaintOutcomePrismaService) {}

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
