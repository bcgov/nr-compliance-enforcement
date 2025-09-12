import { Injectable } from "@nestjs/common";
import { ComplaintOutcomePrismaService } from "../../prisma/complaint_outcome/prisma.complaint_outcome.service";
import { ScheduleSectorXref } from "./entities/schedule_sector_xref.entity";

@Injectable()
export class ScheduleSectorXrefService {
  constructor(private readonly prisma: ComplaintOutcomePrismaService) {}

  findAll = async (): Promise<Array<ScheduleSectorXref>> => {
    const codes = await this.prisma.schedule_sector_xref.findMany({
      select: {
        sector_code: true,
        schedule_code: true,
        sector_code_schedule_sector_xref_sector_codeTosector_code: {
          select: {
            long_description: true,
            short_description: true,
          },
        },
        active_ind: true,
      },
      orderBy: [
        {
          sector_code_schedule_sector_xref_sector_codeTosector_code: {
            display_order: "asc",
          },
        },
      ],
    });

    return codes.map(
      ({
        sector_code,
        schedule_code,
        sector_code_schedule_sector_xref_sector_codeTosector_code: { long_description, short_description },
        active_ind,
      }) => ({
        sectorCode: sector_code,
        scheduleCode: schedule_code,
        longDescription: long_description,
        shortDescription: short_description,
        activeIndicator: active_ind,
      }),
    );
  };
}
