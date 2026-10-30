import { Logger, UseGuards } from "@nestjs/common";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role, coreRoles } from "../../enum/role.enum";
import { GraphQLError } from "graphql";
import { PartyHistoryService } from "./party-history.service";

@UseGuards(JwtRoleGuard)
@Resolver()
export class PartyHistoryResolver {
  constructor(private readonly partyHistoryService: PartyHistoryService) {}
  private readonly logger = new Logger(PartyHistoryResolver.name);

  @Query("partyHistoryInvestigations")
  @Roles(coreRoles, Role.PARTY_ACCESS)
  async partyHistoryInvestigations(@Args("partyId") partyId: string, @Args("partyType") partyType: string) {
    try {
      return await this.partyHistoryService.findInvestigationsByParty(partyId, partyType);
    } catch (error) {
      this.logger.error("Party history investigations error:", error);
      throw new GraphQLError("Error fetching party history investigations", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  @Query("partyHistoryInspections")
  @Roles(coreRoles, Role.PARTY_ACCESS)
  async partyHistoryInspections(@Args("partyId") partyId: string, @Args("partyType") partyType: string) {
    try {
      return await this.partyHistoryService.findInspectionsByParty(partyId, partyType);
    } catch (error) {
      this.logger.error("Party history inspections error:", error);
      throw new GraphQLError("Error fetching party history inspections", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  @Query("partyHistoryCaseFiles")
  @Roles(coreRoles, Role.PARTY_ACCESS)
  async partyHistoryCaseFiles(@Args("partyId") partyId: string, @Args("partyType") partyType: string) {
    try {
      return await this.partyHistoryService.findCaseFilesByParty(partyId, partyType);
    } catch (error) {
      this.logger.error("Party history case files error:", error);
      throw new GraphQLError("Error fetching party history case files", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
