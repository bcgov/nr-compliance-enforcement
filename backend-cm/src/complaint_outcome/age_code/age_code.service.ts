import { Injectable } from "@nestjs/common";
import { ComplaintOutcomePrismaService } from "../../prisma/complaint_outcome/prisma.complaint_outcome.service";
import { AgeCode } from "./entities/age_code.entity";

@Injectable()
export class AgeCodeService {
  constructor(private readonly prisma: ComplaintOutcomePrismaService) {}

  async findAll() {
    const prismaAgeCodes = await this.prisma.age_code.findMany({
      select: {
        age_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    const ageCodes: AgeCode[] = prismaAgeCodes.map((prismaAgeCodes) => ({
      ageCode: prismaAgeCodes.age_code,
      shortDescription: prismaAgeCodes.short_description,
      longDescription: prismaAgeCodes.long_description,
      displayOrder: prismaAgeCodes.display_order,
      activeIndicator: prismaAgeCodes.active_ind,
    }));

    return ageCodes;
  }

  findOne(id: string) {
    return this.prisma.age_code.findUnique({
      where: {
        age_code: id,
        active_ind: true,
      },
    });
  }
}
