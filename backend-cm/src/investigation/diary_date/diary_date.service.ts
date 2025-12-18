import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { DiaryDate, DiaryDateInput, diary_date } from "./dto/diary_date";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";
import { UserService } from "../../common/user.service";

@Injectable()
export class DiaryDateService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly user: UserService,
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

  async save(input: DiaryDateInput): Promise<DiaryDate> {
    let result;
    if (input.diaryDateGuid) {
      // Update existing diary date
      result = await this.prisma.diary_date.update({
        where: { diary_date_guid: input.diaryDateGuid },
        data: {
          due_date: input.dueDate,
          description: input.description,
          updated_utc_timestamp: new Date(),
          updated_user_guid: input.userGuid,
          update_user_id: this.user.getIdirUsername(),
          update_utc_timestamp: new Date(),
        },
      });
    } else {
      // Create new diary date
      try {
        result = await this.prisma.diary_date.create({
          data: {
            investigation_guid: input.investigationGuid,
            due_date: input.dueDate,
            description: input.description,
            added_utc_timestamp: new Date(),
            added_user_guid: input.userGuid,
            active_ind: true,
            create_user_id: this.user.getIdirUsername(),
            create_utc_timestamp: new Date(),
          },
        });
      } catch (error) {
        this.logger.error("Error creating Diary Date:", error);
        throw error;
      }
    }

    try {
      const mappedResult = this.mapper.map<diary_date, DiaryDate>(result as diary_date, "diary_date", "DiaryDate");
      return mappedResult;
    } catch (error) {
      this.logger.error("Error mapping Diary Date:", error);
      throw error;
    }
  }

  async delete(diaryDateGuid: string): Promise<boolean> {
    try {
      // Soft delete by setting active_ind to false
      await this.prisma.diary_date.update({
        where: { diary_date_guid: diaryDateGuid },
        data: {
          active_ind: false,
          update_user_id: this.user.getIdirUsername(),
          update_utc_timestamp: new Date(),
        },
      });
      return true;
    } catch (error) {
      this.logger.error("Error deleting Diary Date:", error);
      throw error;
    }
  }
}
