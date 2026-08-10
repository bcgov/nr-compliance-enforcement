import { Resolver, Query, Args, Mutation, Context } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { validateAgencyAccess } from "../legislation/utils/validate-agency-access";
import { adminRoles, coreRoles } from "../../enum/role.enum";
import { LegislationVersionService } from "./legislation_version.service";

@UseGuards(JwtRoleGuard)
@Resolver("LegislationVersion")
export class LegislationVersionResolver {
  constructor(private readonly legislationVersionService: LegislationVersionService) {}

  @Query("legislationVersions")
  @Roles(coreRoles)
  async getLegislationVersions(@Args("legislationSourceGuid") legislationSourceGuid: string) {
    return await this.legislationVersionService.getBySource(legislationSourceGuid);
  }

  @Query("regulationVersions")
  @Roles(adminRoles)
  async getRegulationVersions(@Args("actVersionGuid") actVersionGuid: string) {
    return await this.legislationVersionService.getRegulationVersions(actVersionGuid);
  }

  @Query("legislationVersionContraventionStats")
  @Roles(adminRoles)
  async getContraventionStats(@Args("legislationVersionGuid") legislationVersionGuid: string) {
    return await this.legislationVersionService.getContraventionStats(legislationVersionGuid);
  }

  @Mutation("createLegislationVersion")
  @Roles(adminRoles)
  async createLegislationVersion(
    @Args("legislationSourceGuid") legislationSourceGuid: string,
    @Args("effectiveDate") effectiveDate: string | null,
    @Context() context: any,
  ) {
    const userId = context.req?.user?.idir_username || "system";
    validateAgencyAccess(
      context.req?.user?.client_roles,
      await this.legislationVersionService.getSourceAgencyCode(legislationSourceGuid),
    );

    return await this.legislationVersionService.create(legislationSourceGuid, effectiveDate, userId);
  }

  @Mutation("updateLegislationVersion")
  @Roles(adminRoles)
  async updateLegislationVersion(
    @Args("legislationVersionGuid") legislationVersionGuid: string,
    @Args("effectiveDate") effectiveDate: string,
    @Context() context: any,
  ) {
    const userId = context.req?.user?.idir_username || "system";
    validateAgencyAccess(
      context.req?.user?.client_roles,
      await this.legislationVersionService.getVersionAgencyCode(legislationVersionGuid),
    );

    return await this.legislationVersionService.updateEffectiveDate(legislationVersionGuid, effectiveDate, userId);
  }

  @Mutation("resetLegislationVersion")
  @Roles(adminRoles)
  async resetLegislationVersion(
    @Args("legislationVersionGuid") legislationVersionGuid: string,
    @Context() context: any,
  ) {
    const userId = context.req?.user?.idir_username || "system";
    validateAgencyAccess(
      context.req?.user?.client_roles,
      await this.legislationVersionService.getVersionAgencyCode(legislationVersionGuid),
    );
    await this.legislationVersionService.reset(legislationVersionGuid, userId);

    return true;
  }

  @Mutation("deleteLegislationVersion")
  @Roles(adminRoles)
  async deleteLegislationVersion(
    @Args("legislationVersionGuid") legislationVersionGuid: string,
    @Context() context: any,
  ) {
    const userId = context.req?.user?.idir_username || "system";
    validateAgencyAccess(
      context.req?.user?.client_roles,
      await this.legislationVersionService.getVersionAgencyCode(legislationVersionGuid),
    );
    await this.legislationVersionService.delete(legislationVersionGuid, userId);

    return true;
  }
}
