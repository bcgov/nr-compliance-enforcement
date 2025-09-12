import { Injectable } from "@nestjs/common";
import { ComplaintOutcomePrismaService } from "../../prisma/complaint_outcome/prisma.complaint_outcome.service";
import { EquipmentStatusCode } from "./entities/equipment_status_code.entity";

@Injectable()
export class EquipmentStatusCodeService {
  constructor(private readonly prisma: ComplaintOutcomePrismaService) {}

  async findAll() {
    const prismaEquipmentCodes = await this.prisma.equipment_status_code.findMany({
      select: {
        equipment_status_code: true,
        short_description: true,
        long_description: true,
        display_order: true,
        active_ind: true,
      },
      orderBy: {
        display_order: "asc",
      },
    });

    const equipmentStatusCodes: EquipmentStatusCode[] = prismaEquipmentCodes.map((prismaEquipmentCodes) => ({
      equipmentStatusCode: prismaEquipmentCodes.equipment_status_code,
      shortDescription: prismaEquipmentCodes.short_description,
      longDescription: prismaEquipmentCodes.long_description,
      displayOrder: prismaEquipmentCodes.display_order,
      activeIndicator: prismaEquipmentCodes.active_ind,
    }));

    return equipmentStatusCodes;
  }

  findOne(id: string) {
    return this.prisma.equipment_status_code.findUnique({
      where: {
        equipment_status_code: id,
        active_ind: true,
      },
    });
  }
}
