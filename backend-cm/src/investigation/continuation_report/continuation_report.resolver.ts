import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ContinuationReportService } from "./continuation_report.service";
import { Logger } from "@nestjs/common";
import { GraphQLError } from "graphql";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { ContinuationReportInput } from "../continuation_report/dto/continuation_report";

@Resolver("ContinuationReport")
export class ContinuationReportResolver {
  constructor(private readonly continuationReportService: ContinuationReportService) {}
  private readonly logger = new Logger(ContinuationReportResolver.name);

  @Query("getContinuationReport")
  @Roles(coreRoles)
  async findOne(@Args("continuationReportGuid") continuationReportGuid: string) {
    try {
      return await this.continuationReportService.findOne(continuationReportGuid);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching data from ContinuationReport schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Query("getContinuationReports")
  @Roles(coreRoles)
  async findMany(@Args("investigationGuid") investigationGuid: string) {
    try {
      return await this.continuationReportService.findManyByInvestigationGuid(investigationGuid);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching data from ContinuationReport schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Mutation("saveContinuationReport")
  @Roles(coreRoles)
  async save(@Args("input") input: ContinuationReportInput) {
    try {
      return await this.continuationReportService.save(input);
    } catch (error) {
      this.logger.error("Save ContinuationReport error:", error);
      throw new GraphQLError("Error saving ContinuationReport", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
