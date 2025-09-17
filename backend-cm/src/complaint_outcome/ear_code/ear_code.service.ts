import { Injectable } from "@nestjs/common";
import { ComplaintOutcomePrismaService } from "../../prisma/complaint_outcome/prisma.complaint_outcome.service";
import { EarCode } from "./entities/ear_code.entity";

@Injectable()
export class EarCodeService {
  constructor(private readonly prisma: ComplaintOutcomePrismaService) {}

  async findAll() {
    const prismaEarCodes = await this.prisma.ear_code.findMany({
      select: {
        ear_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    const earCodes: EarCode[] = prismaEarCodes.map((prismaEarCodes) => ({
      earCode: prismaEarCodes.ear_code,
      shortDescription: prismaEarCodes.short_description,
      longDescription: prismaEarCodes.long_description,
      displayOrder: prismaEarCodes.display_order,
      activeIndicator: prismaEarCodes.active_ind,
    }));

    return earCodes;
  }

  findOne(id: string) {
    return this.prisma.ear_code.findUnique({
      where: {
        ear_code: id,
        active_ind: true,
      },
    });
  }
}
