import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { GraphQLError } from "graphql";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { EnforcementActionService } from "src/investigation/enforcement_action/enforcement_action.service";
import {
  CreateEnforcementActionInput,
  UpdateEnforcementActionInput,
} from "src/investigation/enforcement_action/dto/enforcement_action";

@Resolver("EnforcementAction")
export class EnforcementActionResolver {
  constructor(private readonly enforcementActionService: EnforcementActionService) {}
  private readonly logger = new Logger(EnforcementActionResolver.name);

  @Query("enforcementActions")
  @Roles(coreRoles)
  async findMany(@Args("contraventionPartyXrefId") contraventionPartyXrefId: string) {
    try {
      return await this.enforcementActionService.findMany(contraventionPartyXrefId);
    } catch (error) {
      this.logger.error("Error fetching enforcement actions:", error?.message ?? error);
      throw new GraphQLError("Error fetching enforcement actions", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  @Query("enforcementAction")
  @Roles(coreRoles)
  async findOne(@Args("enforcementActionId") enforcementActionId: string) {
    try {
      return await this.enforcementActionService.findOne(enforcementActionId);
    } catch (error) {
      this.logger.error("Error fetching enforcement action:", error?.message ?? error);
      throw new GraphQLError("Error fetching enforcement action", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  @Mutation("createEnforcementAction")
  @Roles(coreRoles)
  async create(@Args("input") input: CreateEnforcementActionInput) {
    try {
      return await this.enforcementActionService.create(input);
    } catch (error) {
      this.logger.error("Create enforcement action error:", error?.message ?? error);
      throw new GraphQLError("Error creating enforcement action", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  @Mutation("updateEnforcementAction")
  @Roles(coreRoles)
  async update(@Args("input") input: UpdateEnforcementActionInput) {
    try {
      return await this.enforcementActionService.update(input);
    } catch (error) {
      this.logger.error("Update enforcement action error:", error?.message ?? error);
      throw new GraphQLError("Error updating enforcement action", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  @Mutation("removeEnforcementAction")
  @Roles(coreRoles)
  async remove(@Args("enforcementActionId") enforcementActionId: string) {
    try {
      return await this.enforcementActionService.remove(enforcementActionId);
    } catch (error) {
      this.logger.error("Remove enforcement action error:", error?.message ?? error);
      throw new GraphQLError("Error removing enforcement action", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
