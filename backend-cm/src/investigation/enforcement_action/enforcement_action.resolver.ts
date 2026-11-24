import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { Logger, NotFoundException } from "@nestjs/common";
import { GraphQLError } from "graphql";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { validateActivityAccess } from "../../shared/app_user_activity_xref/utils/validate-activity-access";
import { EnforcementActionService } from "src/investigation/enforcement_action/enforcement_action.service";
import { ContraventionService } from "src/investigation/contravention/contravention.service";
import {
  CreateEnforcementActionInput,
  UpdateEnforcementActionInput,
} from "src/investigation/enforcement_action/dto/enforcement_action";

@Resolver("EnforcementAction")
export class EnforcementActionResolver {
  constructor(
    private readonly enforcementActionService: EnforcementActionService,
    private readonly contraventionService: ContraventionService,
  ) {}
  private readonly logger = new Logger(EnforcementActionResolver.name);

  @Query("enforcementActions")
  @Roles(coreRoles)
  async findMany(
    @Args("contraventionIdentifier") contraventionIdentifier: string,
    @Args("partyIdentifier") partyIdentifier: string,
  ) {
    try {
      return await this.enforcementActionService.findMany(contraventionIdentifier, partyIdentifier);
    } catch (error) {
      this.logger.error(error);
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
      if (error instanceof NotFoundException) {
        throw new GraphQLError(error.message, { extensions: { code: "NOT_FOUND" } });
      }
      this.logger.error("Error fetching enforcement action:", error?.message ?? error);
      throw new GraphQLError("Error fetching enforcement action", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  @Mutation("createEnforcementAction")
  @Roles(coreRoles)
  async create(@Args("input") input: CreateEnforcementActionInput) {
    validateActivityAccess(await this.contraventionService.getInvestigationGuid(input.contraventionIdentifier));
    try {
      return await this.enforcementActionService.create(input);
    } catch (error) {
      this.logger.error("Create enforcement action error:", error?.message ?? error);
      throw new GraphQLError("Error creating enforcement action", {
        extensions: { code: "INTERNAL_SERVER_ERROR", originalError: error.message },
      });
    }
  }

  @Mutation("updateEnforcementAction")
  @Roles(coreRoles)
  async update(@Args("input") input: UpdateEnforcementActionInput) {
    const enforcementAction = await this.enforcementActionService.findOne(input.enforcementActionIdentifier);
    validateActivityAccess(
      await this.contraventionService.getInvestigationGuid(enforcementAction.contraventionIdentifier),
    );
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
    const enforcementAction = await this.enforcementActionService.findOne(enforcementActionId);
    validateActivityAccess(
      await this.contraventionService.getInvestigationGuid(enforcementAction.contraventionIdentifier),
    );
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
