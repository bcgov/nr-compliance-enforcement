import { Injectable, Logger } from "@nestjs/common";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { exhibit } from "../../../prisma/investigation/generated/exhibit";
import { CreateUpdateExhibitInput, Exhibit } from "./dto/exhibit";
import { UserService } from "../../common/user.service";

@Injectable()
export class ExhibitService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    private readonly user: UserService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(ExhibitService.name);

  async findMany(taskGuid?: string) {
    const prismaExhibits = await this.prisma.exhibit.findMany({
      select: {
        exhibit_guid: true,
        task_guid: true,
        investigation_guid: true,
        exhibit_number: true,
        description: true,
        date_collected: true,
        collected_user_guid_ref: true,
        active_ind: true,
        create_utc_timestamp: true,
        update_utc_timestamp: true,
      },
      where: {
        active_ind: true,
        ...(taskGuid && { task_guid: taskGuid }),
      },
    });

    return this.mapper.mapArray<exhibit, Exhibit>(prismaExhibits as Array<exhibit>, "exhibit", "Exhibit");
  }

  async findOne(exhibitGuid: string) {
    const prismaExhibit = await this.prisma.exhibit.findUnique({
      select: {
        exhibit_guid: true,
        task_guid: true,
        investigation_guid: true,
        exhibit_number: true,
        description: true,
        date_collected: true,
        collected_user_guid_ref: true,
        active_ind: true,
        create_utc_timestamp: true,
        update_utc_timestamp: true,
      },
      where: {
        exhibit_guid: exhibitGuid,
      },
    });

    return this.mapper.map<exhibit, Exhibit>(prismaExhibit as exhibit, "exhibit", "Exhibit");
  }

  async create(exhibitInput: CreateUpdateExhibitInput): Promise<Exhibit> {
    try {
      const exhibit = await this.prisma.$transaction(async (tx) => {
        const highestExhibit = await tx.exhibit.findFirst({
          where: {
            investigation_guid: exhibitInput.investigationGuid,
          },
          orderBy: {
            exhibit_number: "desc",
          },
          select: {
            exhibit_number: true,
          },
        });

        const nextExhibitNumber = highestExhibit ? highestExhibit.exhibit_number + 1 : 1;

        return await tx.exhibit.create({
          data: {
            task_guid: exhibitInput.taskGuid,
            investigation_guid: exhibitInput.investigationGuid,
            exhibit_number: nextExhibitNumber,
            description: exhibitInput.description,
            date_collected: exhibitInput.dateCollected ?? new Date(),
            collected_user_guid_ref: exhibitInput.collectedAppUserGuidRef,
            active_ind: true,
            create_user_id: this.user.getIdirUsername(),
            create_utc_timestamp: new Date(),
          },
        });
      });

      return await this.findOne(exhibit.exhibit_guid);
    } catch (error) {
      this.logger.error("Error creating exhibit:", error);
      throw error;
    }
  }

  async remove(exhibitGuid: string): Promise<Exhibit> {
    try {
      await this.prisma.exhibit.update({
        where: {
          exhibit_guid: exhibitGuid,
        },
        data: {
          active_ind: false,
          update_user_id: this.user.getIdirUsername(),
          update_utc_timestamp: new Date(),
        },
      });
    } catch (error) {
      this.logger.error("Error removing exhibit:", error);
      throw error;
    }
    return await this.findOne(exhibitGuid);
  }

  async update(exhibitInput: CreateUpdateExhibitInput): Promise<Exhibit> {
    try {
      const exhibit = await this.prisma.exhibit.update({
        where: {
          exhibit_guid: exhibitInput.exhibitGuid,
        },
        data: {
          description: exhibitInput.description,
          date_collected: exhibitInput.dateCollected,
          collected_user_guid_ref: exhibitInput.collectedAppUserGuidRef,
          update_user_id: this.user.getIdirUsername(),
          update_utc_timestamp: new Date(),
        },
      });

      return await this.findOne(exhibit.exhibit_guid);
    } catch (error) {
      this.logger.error("Error updating exhibit:", error);
      throw error;
    }
  }
}
