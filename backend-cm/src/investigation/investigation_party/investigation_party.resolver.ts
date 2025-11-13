import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { GraphQLError } from "graphql";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateInvestigationPartyInput } from "../investigation_party/dto/investigation_party";
import { InvestigationPartyService } from "../investigation_party/investigation_party_service";

@Resolver("InvestigationParty")
export class InvestigationPartyResolver {
  constructor(private readonly investigationPartyService: InvestigationPartyService) {}
  private readonly logger = new Logger(InvestigationPartyResolver.name);

  @Mutation("addPartyToInvestigation")
  @Roles(coreRoles)
  async create(
    @Args("investigationGuid") investigationGuid: string,
    @Args("input") input: CreateInvestigationPartyInput[],
  ) {
    try {
      return await this.investigationPartyService.create(investigationGuid, input);
    } catch (error) {
      this.logger.error("Update investigation error:", error);
      throw new GraphQLError("Error adding parties to investigation", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          originalError: error.message,
        },
      });
    }
  }

  @Mutation("removePartyFromInvestigation")
  @Roles(coreRoles)
  async remove(@Args("investigationGuid") investigationGuid: string, @Args("partyIdentifier") partyIdentifier: string) {
    try {
      return await this.investigationPartyService.remove(investigationGuid, partyIdentifier);
    } catch (error) {
      this.logger.error("Remove investigation party error:", error);
      throw new GraphQLError("Error removing party from investigation", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          originalError: error.message,
        },
      });
    }
  }
}
