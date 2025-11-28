import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { GraphQLError } from "graphql";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { ContraventionService } from "src/investigation/contravention/contravention.service";
import { CreateContraventionInput } from "src/investigation/contravention/dto/contravention";

@Resolver("Contravention")
export class ContraventionResolver {
  constructor(private readonly contraventionService: ContraventionService) {}
  private readonly logger = new Logger(ContraventionResolver.name);

  @Mutation("createContravention")
  @Roles(coreRoles)
  async create(@Args("input") contraventionInput: CreateContraventionInput) {
    try {
      return await this.contraventionService.create(contraventionInput);
    } catch (error) {
      this.logger.error("Update investigation error:", error);
      throw new GraphQLError("Error adding contravention to investigation", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          originalError: error.message,
        },
      });
    }
  }

  @Mutation("removeContravention")
  @Roles(coreRoles)
  async remove(
    @Args("investigationGuid") investigationGuid: string,
    @Args("contraventionGuid") contraventionGuid: string,
  ) {
    try {
      return await this.contraventionService.remove(investigationGuid, contraventionGuid);
    } catch (error) {
      this.logger.error("Remove investigation contravention error:", error);
      throw new GraphQLError("Error removing contravention from investigation", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          originalError: error.message,
        },
      });
    }
  }
}
