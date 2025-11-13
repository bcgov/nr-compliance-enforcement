import { Resolver, Query, Args, Int, Mutation } from "@nestjs/graphql";
import { InspectionService } from "./inspection.service";
import { Logger } from "@nestjs/common";
import { GraphQLError } from "graphql";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { InspectionFilters, CreateInspectionInput, UpdateInspectionInput } from "./dto/inspection";

@Resolver("Inspection")
export class InspectionResolver {
  constructor(private readonly inspectionService: InspectionService) {}
  private readonly logger = new Logger(InspectionResolver.name);

  @Query("getInspection")
  @Roles(coreRoles)
  async findOne(@Args("inspectionGuid") inspectionGuid: string) {
    try {
      return await this.inspectionService.findOne(inspectionGuid);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching data from inspection schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Query("getInspections")
  @Roles(coreRoles)
  async findMany(@Args("ids", { type: () => [String] }) ids: string[]) {
    try {
      return await this.inspectionService.findMany(ids);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching inspections by IDs from inspection schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Mutation("createInspection")
  @Roles(coreRoles)
  async create(@Args("input") input: CreateInspectionInput) {
    try {
      return await this.inspectionService.create(input);
    } catch (error) {
      this.logger.error("Create inspection error:", error);
      throw new GraphQLError("Error creating inspection", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  @Mutation("updateInspection")
  @Roles(coreRoles)
  async update(@Args("inspectionGuid") inspectionGuid: string, @Args("input") input: UpdateInspectionInput) {
    try {
      return await this.inspectionService.update(inspectionGuid, input);
    } catch (error) {
      this.logger.error("Update inspection error:", error);
      throw new GraphQLError("Error updating inspection", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  @Query("getInspectionsByParty")
  @Roles(coreRoles)
  async findManyByParty(@Args("partyId") partyId: string, @Args("partyType") partyType: string) {
    try {
      return await this.inspectionService.findManyByParty(partyId, partyType);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching inspections by party IDs from inspection schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Query("searchInspections")
  @Roles(coreRoles)
  async search(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 }) page: number,
    @Args("pageSize", { type: () => Int, nullable: true, defaultValue: 25 }) pageSize: number,
    @Args("filters", { nullable: true }) filters?: InspectionFilters,
  ) {
    try {
      return await this.inspectionService.search(page, pageSize, filters);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error searching paginated inspection data from Shared schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Query("checkInspectionNameExists")
  @Roles(coreRoles)
  async checkInspectionNameExists(
    @Args("name") name: string,
    @Args("leadAgency") leadAgency: string,
    @Args("excludeInspectionGuid") excludeInspectionGuid?: string,
  ) {
    try {
      return await this.inspectionService.checkNameExists(name, leadAgency, excludeInspectionGuid);
    } catch (error) {
      this.logger.error("Check inspection name exists error:", error);
      throw new GraphQLError("Error checking inspection name", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
