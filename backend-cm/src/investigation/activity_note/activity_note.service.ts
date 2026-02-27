import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { ActivityNote, ActivityNoteInput } from "./dto/activity_note";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";
import { UserService } from "../../common/user.service";
import { activity_note } from "prisma/investigation/generated/activity_note";

@Injectable()
export class ActivityNoteService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly user: UserService,
  ) {}

  private readonly logger = new Logger(ActivityNoteService.name);

  async findOne(activityNoteGuid: string) {
    const prismaActivityNote = await this.prisma.activity_note.findUnique({
      where: {
        activity_note_guid: activityNoteGuid,
        active_ind: true,
      },
    });
    if (!prismaActivityNote) {
      throw new Error(`Activity note with guid ${activityNoteGuid} not found`);
    }

    try {
      return this.mapper.map<activity_note, ActivityNote>(
        prismaActivityNote as activity_note,
        "activity_note",
        "ActivityNote",
      );
    } catch (error) {
      this.logger.error("Error mapping ActivityNote:", error);
      throw error;
    }
  }

  async findManyByInvestigationGuid(investigationGuid: string, activityNoteCode: string) {
    const prismaActivityNotes = await this.prisma.activity_note.findMany({
      where: {
        investigation_guid: investigationGuid,
        activity_note_code: activityNoteCode,
        active_ind: true,
      },
      orderBy: [
        { actioned_utc_date: "desc" },
        { actioned_utc_time: "desc" },
      ],
    });
    if (!prismaActivityNotes) {
      throw new Error(`Activity notes of investigation ${investigationGuid} with code ${activityNoteCode} not found`);
    }

    try {
      return this.mapper.mapArray<activity_note, ActivityNote>(
        prismaActivityNotes as Array<activity_note>,
        "activity_note",
        "ActivityNote",
      );
    } catch (error) {
      this.logger.error("Error mapping ActivityNote:", error);
      throw error;
    }
  }

  async findManyByTaskGuid(taskGuid: string) {
    const prismaActivityNotes = await this.prisma.activity_note.findMany({
      where: {
        task_guid: taskGuid,
        active_ind: true,
      },
      orderBy: [
        { actioned_utc_date: "asc" },
        { actioned_utc_time: "asc" },
      ],
    });

    try {
      return this.mapper.mapArray<activity_note, ActivityNote>(
        prismaActivityNotes as Array<activity_note>,
        "activity_note",
        "ActivityNote",
      );
    } catch (error) {
      this.logger.error("Error mapping ActivityNote:", error);
      throw error;
    }
  }

  async save(input: ActivityNoteInput): Promise<ActivityNote> {
    let result;
    if (input.activityNoteGuid) {
      //Update existing activity note
      result = await this.prisma.activity_note.update({
        where: { activity_note_guid: input.activityNoteGuid },
        data: {
          investigation_guid: input.investigationGuid,
          content_json: JSON.parse(input.contentJson),
          content_text: input.contentText,
          actioned_utc_time: input.actionedTime,
          actioned_utc_date: input.actionedDate,
          reported_utc_timestamp: input.reportedTimestamp,
          actioned_app_user_guid_ref: input.actionedAppUserGuidRef,
          reported_app_user_guid_ref: input.reportedAppUserGuidRef,
          create_user_id: this.user.getIdirUsername(),
          create_utc_timestamp: new Date(),
        },
      });
    } else {
      // Create new activity note
      try {
        result = await this.prisma.activity_note.create({
          data: {
            investigation_guid: input.investigationGuid,
            task_guid: input.taskGuid,
            activity_note_code: input.activityNoteCode,
            content_json: JSON.parse(input.contentJson),
            content_text: input.contentText,
            actioned_utc_time: input.actionedTime,
            actioned_utc_date: input.actionedDate,
            reported_utc_timestamp: input.reportedTimestamp,
            actioned_app_user_guid_ref: input.actionedAppUserGuidRef,
            reported_app_user_guid_ref: input.reportedAppUserGuidRef,
            active_ind: true,
            create_user_id: this.user.getIdirUsername(),
            create_utc_timestamp: new Date(),
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        });
      } catch (error) {
        this.logger.error("Error creating Activity Note:", error);
        throw error;
      }
    }

    try {
      const mappedResult = this.mapper.map<activity_note, ActivityNote>(
        result as activity_note,
        "activity_note",
        "ActivityNote",
      );
      return mappedResult;
    } catch (error) {
      this.logger.error("Error mapping Activity Note:", error);
      throw error;
    }
  }

  async delete(activityNoteGuid: string): Promise<boolean> {
    try {
      // Soft delete by setting active_ind to false
      await this.prisma.activity_note.update({
        where: { activity_note_guid: activityNoteGuid },
        data: {
          active_ind: false,
          update_user_id: this.user.getIdirUsername(),
          update_utc_timestamp: new Date(),
        },
      });
      return true;
    } catch (error) {
      this.logger.error("Error deleting Activity Note:", error);
      throw error;
    }
  }
}
