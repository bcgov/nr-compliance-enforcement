import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { DiaryDateService } from "./diary_date.service";
import { Logger } from "@nestjs/common";
import { GraphQLError } from "graphql";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { DiaryDateInput } from "./dto/diary_date";

@Resolver("DiaryDate")
export class DiaryDateResolver {
  constructor(private readonly diaryDateService: DiaryDateService) {}
  private readonly logger = new Logger(DiaryDateResolver.name);

  @Query("diaryDates")
  @Roles(coreRoles)
  async findMany(@Args("investigationGuid") investigationGuid: string) {
    try {
      return await this.diaryDateService.findManyByInvestigationGuid(investigationGuid);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching diary dates", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Mutation("saveDiaryDate")
  @Roles(coreRoles)
  async save(@Args("input") input: DiaryDateInput) {
    try {
      return await this.diaryDateService.save(input);
    } catch (error) {
      this.logger.error("Save DiaryDate error:", error);
      throw new GraphQLError("Error saving diary date", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  @Mutation("deleteDiaryDate")
  @Roles(coreRoles)
  async delete(@Args("diaryDateGuid") diaryDateGuid: string) {
    try {
      return await this.diaryDateService.delete(diaryDateGuid);
    } catch (error) {
      this.logger.error("Delete DiaryDate error:", error);
      throw new GraphQLError("Error deleting diary date", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
