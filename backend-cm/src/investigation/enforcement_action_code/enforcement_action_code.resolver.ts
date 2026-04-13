import { Logger } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { Roles } from "../../auth/decorators/roles.decorator";
import { coreRoles } from "../../enum/role.enum";
import { EnforcementActionCodeService } from "../../investigation/enforcement_action_code/enforcement_action_code.service";

@Resolver("EnforcementActionCode")
export class EnforcementActionCodeResolver {
  constructor(private readonly enforcementActionCodeService: EnforcementActionCodeService) {}
  private readonly logger = new Logger(EnforcementActionCodeResolver.name);

  @Query("enforcementActionCodes")
  @Roles(coreRoles)
  async findEnforcementActionCodes(@Args("agencyCode") agencyCode: string) {
    try {
      return await this.enforcementActionCodeService.findEnforcementActionCodes(agencyCode);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching enforcement action codes", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
