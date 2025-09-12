import { Injectable } from "@nestjs/common";
import { ComplaintOutcomePrismaService } from "../../prisma/complaint_outcome/prisma.complaint_outcome.service";
import { ConflictHistoryCode } from "./entities/conflict_history_code.entity";

@Injectable()
export class ConflictHistoryCodeService {
  constructor(private readonly prisma: ComplaintOutcomePrismaService) {}

  async findAll() {
    const prismaConflictHistoryCodes = await this.prisma.conflict_history_code.findMany({
      select: {
        conflict_history_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
    });

    const conflictHistoryCodes: ConflictHistoryCode[] = prismaConflictHistoryCodes.map(
      (prismaConflictHistoryCodes) => ({
        conflictHistoryCode: prismaConflictHistoryCodes.conflict_history_code,
        shortDescription: prismaConflictHistoryCodes.short_description,
        longDescription: prismaConflictHistoryCodes.long_description,
        displayOrder: prismaConflictHistoryCodes.display_order,
        activeIndicator: prismaConflictHistoryCodes.active_ind,
      }),
    );

    return conflictHistoryCodes;
  }

  findOne(id: string) {
    return this.prisma.conflict_history_code.findUnique({
      where: {
        conflict_history_code: id,
        active_ind: true,
      },
    });
  }
}
