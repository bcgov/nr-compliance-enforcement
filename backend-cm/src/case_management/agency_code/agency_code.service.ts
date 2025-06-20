import { Injectable } from "@nestjs/common";
import { CaseManagementPrismaService } from "../../prisma/cm/prisma.cm.service";
import { AgencyCode } from "./entities/agency_code.entity";

@Injectable()
export class AgencyCodeService {
  constructor(private readonly prisma: CaseManagementPrismaService) {}

  async findAll() {
    const prismaAgencyCodes = await this.prisma.agency_code.findMany({
      select: {
        agency_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
      orderBy: [{ display_order: "asc" }],
    });

    const agencyCodes: AgencyCode[] = prismaAgencyCodes.map((prismaAgencyCodes) => ({
      agencyCode: prismaAgencyCodes.agency_code,
      shortDescription: prismaAgencyCodes.short_description,
      longDescription: prismaAgencyCodes.long_description,
      displayOrder: prismaAgencyCodes.display_order,
      activeIndicator: prismaAgencyCodes.active_ind,
    }));

    return agencyCodes;
  }

  findOne(id: string) {
    return this.prisma.agency_code.findUnique({
      where: {
        agency_code: id,
        active_ind: true,
      },
    });
  }
}
