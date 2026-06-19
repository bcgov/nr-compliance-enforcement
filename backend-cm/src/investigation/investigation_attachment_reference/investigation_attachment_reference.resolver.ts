import { Resolver, Args, Mutation } from "@nestjs/graphql";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Logger, UseGuards, NotFoundException } from "@nestjs/common";
import { GraphQLError } from "graphql";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { InvestigationAttachmentReferenceService } from "src/investigation/investigation_attachment_reference/investigation_attachment_reference.service";
import { DeactivateInvestigationAttachmentReferenceInput } from "src/investigation/investigation_attachment_reference/dto/investigation_attachment_reference";

@UseGuards(JwtRoleGuard)
@Resolver("InvestigationAttachmentReference")
export class InvestigationAttachmentReferenceResolver {
  constructor(private readonly investigationAttachmentReferenceService: InvestigationAttachmentReferenceService) {}
  private readonly logger = new Logger(InvestigationAttachmentReferenceResolver.name);

  @Mutation("deactivateInvestigationAttachmentReference")
  @Roles(coreRoles)
  async deactivate(@Args("input") input: DeactivateInvestigationAttachmentReferenceInput) {
    try {
      return await this.investigationAttachmentReferenceService.deactivate(input);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLError(error.message, { extensions: { code: "NOT_FOUND" } });
      }
      this.logger.error(error);
      throw new GraphQLError("Error deactivating attachment reference", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
