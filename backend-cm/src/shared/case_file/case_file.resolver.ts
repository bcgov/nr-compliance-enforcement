import { Logger, UseGuards } from "@nestjs/common";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Args, Query, Mutation, Resolver, Int } from "@nestjs/graphql";
import { Roles } from "../../auth/decorators/roles.decorator";
import { coreRoles } from "../../enum/role.enum";
import { GraphQLError } from "graphql";
import { CaseFileService } from "./case_file.service";
import { CaseFileFilters, CaseFileCreateInput, CaseFileUpdateInput } from "./dto/case_file";

@UseGuards(JwtRoleGuard)
@Resolver("CaseFile")
export class CaseFileResolver {
  constructor(private readonly caseFileService: CaseFileService) {}
  private readonly logger = new Logger(CaseFileResolver.name);

  @Query("caseFile")
  @Roles(coreRoles)
  async findOne(@Args("caseIdentifier") id: string) {
    try {
      return await this.caseFileService.findOne(id);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching data from Shared schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Query("caseFiles")
  @Roles(coreRoles)
  async findMany(@Args("ids", { type: () => [String] }) ids: string[]) {
    try {
      return await this.caseFileService.findMany(ids);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching case files by IDs from Shared schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Query("caseFileByActivityId")
  @Roles(coreRoles)
  async findCaseFileByActivityId(
    @Args("activityType") activityType: string,
    @Args("activityIdentifier") activityIdentifier: string,
  ) {
    try {
      return await this.caseFileService.findCaseFileByActivityId(activityType, activityIdentifier);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching case file by activity ID from Shared schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Query("searchCaseFiles")
  @Roles(coreRoles)
  async search(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 }) page: number,
    @Args("pageSize", { type: () => Int, nullable: true, defaultValue: 25 }) pageSize: number,
    @Args("filters", { nullable: true }) filters?: CaseFileFilters,
  ) {
    try {
      return await this.caseFileService.search(page, pageSize, filters);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error searching paginated data from Shared schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Mutation("createCaseFile")
  @Roles(coreRoles)
  async create(@Args("input") input: CaseFileCreateInput) {
    try {
      return await this.caseFileService.create(input);
    } catch (error) {
      this.logger.error("Create case file error:", error);
      throw new GraphQLError("Error creating case file", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  @Mutation("updateCaseFile")
  @Roles(coreRoles)
  async update(@Args("caseIdentifier") caseIdentifier: string, @Args("input") input: CaseFileUpdateInput) {
    try {
      return await this.caseFileService.update(caseIdentifier, input);
    } catch (error) {
      this.logger.error("Update case file error:", error);
      throw new GraphQLError("Error updating case file", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
