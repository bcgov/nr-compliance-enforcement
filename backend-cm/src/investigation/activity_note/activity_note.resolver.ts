import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ActivityNoteService } from "./activity_note.service";
import { Logger } from "@nestjs/common";
import { GraphQLError } from "graphql";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { ActivityNoteInput } from "./dto/activity_note";

@Resolver("ActivityNote")
export class ActivityNoteResolver {
  constructor(private readonly activityNoteService: ActivityNoteService) {}
  private readonly logger = new Logger(ActivityNoteResolver.name);

  @Query("getActivityNote")
  @Roles(coreRoles)
  async findOne(@Args("activityNoteGuid") activityNoteGuid: string) {
    try {
      return await this.activityNoteService.findOne(activityNoteGuid);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching data from activity note schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Query("getActivityNotes")
  @Roles(coreRoles)
  async findMany(
    @Args("investigationGuid") investigationGuid: string,
    @Args("activityNoteCode") activityNoteCode: string,
  ) {
    try {
      return await this.activityNoteService.findManyByInvestigationGuid(investigationGuid, activityNoteCode);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching data from Activity Note schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Query("getActivityNotesByTask")
  @Roles(coreRoles)
  async findManyByTask(@Args("taskGuid") taskGuid: string) {
    try {
      return await this.activityNoteService.findManyByTaskGuid(taskGuid);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching data from Activity Note schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Mutation("saveActivityNote")
  @Roles(coreRoles)
  async save(@Args("input") input: ActivityNoteInput) {
    try {
      return await this.activityNoteService.save(input);
    } catch (error) {
      this.logger.error("Save Activity Note error:", error);
      throw new GraphQLError("Error saving Activity Note", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
