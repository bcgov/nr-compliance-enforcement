import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { InvestigationService } from "./investigation.service";
import { Logger } from "@nestjs/common";
import { GraphQLError } from "graphql";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import {
  CreateInvestigationInput,
  UpdateInvestigationInput,
  InvestigationFilters,
} from "src/investigation/investigation/dto/investigation";

@Resolver("Investigation")
export class InvestigationResolver {
  constructor(private readonly investigationService: InvestigationService) {}
  private readonly logger = new Logger(InvestigationResolver.name);

  @Query("getInvestigation")
  @Roles(coreRoles)
  async findOne(@Args("investigationGuid") investigationGuid: string) {
    try {
      return await this.investigationService.findOne(investigationGuid);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching data from investigation schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Mutation("createInvestigation")
  @Roles(coreRoles)
  async create(@Args("input") input: CreateInvestigationInput) {
    try {
      return await this.investigationService.create(input);
    } catch (error) {
      this.logger.error("Create investigation error:", error);
      throw new GraphQLError("Error creating investigation", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  @Mutation("updateInvestigation")
  @Roles(coreRoles)
  async update(@Args("investigationGuid") investigationGuid: string, @Args("input") input: UpdateInvestigationInput) {
    try {
      return await this.investigationService.update(investigationGuid, input);
    } catch (error) {
      this.logger.error("Update investigation error:", error);
      throw new GraphQLError("Error updating investigation", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  @Query("getInvestigations")
  @Roles(coreRoles)
  async findMany(@Args("ids", { type: () => [String] }) ids: string[]) {
    try {
      return await this.investigationService.findMany(ids);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching investigations by IDs from investigation schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Query("searchInvestigations")
  @Roles(coreRoles)
  async search(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 }) page: number,
    @Args("pageSize", { type: () => Int, nullable: true, defaultValue: 25 }) pageSize: number,
    @Args("filters", { nullable: true }) filters?: InvestigationFilters,
  ) {
    try {
      return await this.investigationService.search(page, pageSize, filters);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error searching paginated investigation data from Shared schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }
}
