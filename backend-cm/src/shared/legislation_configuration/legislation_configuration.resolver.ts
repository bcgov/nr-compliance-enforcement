import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Roles } from "src/auth/decorators/roles.decorator";
import { JwtRoleGuard } from "src/auth/jwtrole.guard";
import { validateAgencyAccess } from "src/shared/legislation/utils/validate-agency-access";
import { adminRoles } from "src/enum/role.enum";
import { UpdateLegislationConfigurationInput } from "src/shared/legislation_configuration/dto/legislation_configuration";
import { LegislationConfigurationService } from "src/shared/legislation_configuration/legislation_configuration.service";

@UseGuards(JwtRoleGuard)
@Resolver("LegislationSource")
export class LegislationConfigurationResolver {
  constructor(private readonly legislatioConfigurationService: LegislationConfigurationService) {}

  @Query("referencedLegislationGuids")
  @Roles(adminRoles)
  async getReferencedLegislationGuids(@Args("legislationGuids") legislationGuids: string[]) {
    return await this.legislatioConfigurationService.findReferencedLegislationGuids(legislationGuids);
  }

  @Mutation("updateLegislationConfiguration")
  @Roles(adminRoles)
  async updateLegislationSource(
    @Args("input")
    input: UpdateLegislationConfigurationInput[],
    @Context() context: any,
  ) {
    const userId = context.req?.user?.idir_username || "system";
    const clientRoles = context.req?.user?.client_roles;
    new Set(input.map((item) => item.agencyCode)).forEach((agencyCode) =>
      validateAgencyAccess(clientRoles, agencyCode),
    );

    return await this.legislatioConfigurationService.update(input, userId);
  }
}
