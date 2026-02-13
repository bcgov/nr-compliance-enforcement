import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { Roles } from "src/auth/decorators/roles.decorator";
import { JwtRoleGuard } from "src/auth/jwtrole.guard";
import { adminRoles } from "src/enum/role.enum";
import { LegislationConfigurationService } from "src/shared/legislation_configuration/legislation_configuration.service";

@UseGuards(JwtRoleGuard)
@Resolver("LegislationSource")
export class LegislationConfigurationResolver {
  constructor(private readonly legislatioConfigurationService: LegislationConfigurationService) {}

  @Mutation("updateLegislationConfiguration")
  @Roles(adminRoles)
  async updateLegislationSource(
    @Args("input")
    input: {
      legislationGuid: string;
      agencyCode: string;
      isEnabled?: boolean;
      overrideText?: string;
    },
    @Context() context: any,
  ) {
    const userId = context.req?.user?.idir_username || "system";
    return await this.legislatioConfigurationService.update(input, userId);
  }
}
