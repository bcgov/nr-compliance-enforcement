import { Injectable } from "@nestjs/common";
import { ComplaintOutcomePrismaService } from "../../prisma/complaint_outcome/prisma.complaint_outcome.service";
import { SexCode } from "./entities/sex_code.entity";

@Injectable()
export class SexCodeService {
  constructor(private readonly prisma: ComplaintOutcomePrismaService) {}

  async findAll() {
    const prismaSexCodes = await this.prisma.sex_code.findMany({
      select: {
        sex_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    const sexCodes: SexCode[] = prismaSexCodes.map((prismaSexCodes) => ({
      sexCode: prismaSexCodes.sex_code,
      shortDescription: prismaSexCodes.short_description,
      longDescription: prismaSexCodes.long_description,
      displayOrder: prismaSexCodes.display_order,
      activeIndicator: prismaSexCodes.active_ind,
    }));

    return sexCodes;
  }

  findOne(id: string) {
    return this.prisma.sex_code.findUnique({
      where: {
        sex_code: id,
        active_ind: true,
      },
    });
  }
}
