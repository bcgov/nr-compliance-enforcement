import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { DiaryDate, DiaryDateInput } from "./dto/diary_date";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";
import { UserService } from "../../common/user.service";
import { diary_date } from "../../../prisma/investigation/generated/diary_date";
import { withRlsTransaction } from "../../pg-session-extension/with-rls-transaction";
import { InvestigationService } from "../investigation/investigation.service";

@Injectable()
export class DiaryDateService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly user: UserService,
    private readonly investigationService: InvestigationService,
  ) {}

  private readonly logger = new Logger(DiaryDateService.name);

  async findManyByInvestigationGuid(investigationGuid: string): Promise<DiaryDate[]> {
    const prismaDiaryDates = await this.prisma.diary_date.findMany({
      where: {
        investigation_guid: investigationGuid,
        active_ind: true,
      },
      orderBy: {
        due_date: "asc",
      },
    });

    if (!prismaDiaryDates) {
      return [];
    }

    try {
      return this.mapper.mapArray<diary_date, DiaryDate>(
        prismaDiaryDates as Array<diary_date>,
        "diary_date",
        "DiaryDate",
      );
    } catch (error) {
      this.logger.error("Error mapping DiaryDate:", error);
      throw error;
    }
  }

  async findManyByTaskGuid(taskGuid: string): Promise<DiaryDate[]> {
    const prismaDiaryDates = await this.prisma.diary_date.findMany({
      where: {
        task_guid: taskGuid,
        active_ind: true,
      },
      orderBy: {
        due_date: "asc",
      },
    });

    if (!prismaDiaryDates) {
      return [];
    }

    try {
      return this.mapper.mapArray<diary_date, DiaryDate>(
        prismaDiaryDates as Array<diary_date>,
        "diary_date",
        "DiaryDate",
      );
    } catch (error) {
      this.logger.error("Error mapping DiaryDate:", error);
      throw error;
    }
  }

  async save(input: DiaryDateInput): Promise<DiaryDate> {
    let result;
    try {
      result = await withRlsTransaction(this.prisma, async (db) => {
        if (input.diaryDateGuid) {
          // Update existing diary date
          return await db.diary_date.update({
            where: { diary_date_guid: input.diaryDateGuid },
            data: {
              due_date: input.dueDate,
              description: input.description,
              app_update_utc_timestamp: new Date(),
              app_update_user_guid_ref: input.userGuid,
              update_user_id: this.user.getIdirUsername(),
              update_utc_timestamp: new Date(),
              task_guid: input.taskGuid || null,
            },
          });
        }
        // Create new diary date
        return await db.diary_date.create({
          data: {
            investigation_guid: input.investigationGuid,
            due_date: input.dueDate,
            description: input.description,
            app_create_utc_timestamp: new Date(),
            app_create_user_guid_ref: input.userGuid,
            active_ind: true,
            create_user_id: this.user.getIdirUsername(),
            create_utc_timestamp: new Date(),
            task_guid: input.taskGuid || null,
          },
        });
      });
    } catch (error) {
      this.logger.error("Error saving Diary Date:", error);
      throw error;
    }

    try {
      const mappedResult = this.mapper.map<diary_date, DiaryDate>(result as diary_date, "diary_date", "DiaryDate");

      await this.investigationService.updateInvestigationTimestamp(input.investigationGuid);

      return mappedResult;
    } catch (error) {
      this.logger.error("Error mapping Diary Date:", error);
      throw error;
    }
  }

  async delete(diaryDateGuid: string): Promise<boolean> {
    try {
      const diaryDate = await this.prisma.diary_date.findUnique({
        where: { diary_date_guid: diaryDateGuid },
      });

      if (!diaryDate) {
        throw new Error(`Diary date with guid ${diaryDateGuid} not found`);
      }

      // Soft delete by setting active_ind to false
      await withRlsTransaction(this.prisma, async (db) => {
        await db.diary_date.update({
          where: { diary_date_guid: diaryDateGuid },
          data: {
            active_ind: false,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        });
      });

      await this.investigationService.updateInvestigationTimestamp(diaryDate.investigation_guid);

      return true;
    } catch (error) {
      this.logger.error("Error deleting Diary Date:", error);
      throw error;
    }
  }

  async deleteByTask(taskGuid: string): Promise<boolean> {
    try {
      const task = await this.prisma.task.findUnique({
        where: { task_guid: taskGuid },
      });

      if (!task) {
        throw new Error(`Task with guid ${taskGuid} not found`);
      }

      await withRlsTransaction(this.prisma, async (db) => {
        await db.diary_date.updateMany({
          where: { task_guid: taskGuid },
          data: {
            active_ind: false,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        });
      });

      await this.investigationService.updateInvestigationTimestamp(task.investigation_guid);

      return true;
    } catch (error) {
      this.logger.error("Error deleting DiaryDatesByTask:", error);
      throw error;
    }
  }
}
