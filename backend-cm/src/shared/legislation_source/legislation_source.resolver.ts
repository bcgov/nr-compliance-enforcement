import { Resolver, Query, Args, Mutation, Context } from "@nestjs/graphql";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { adminRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { validateAgencyAccess } from "../legislation/utils/validate-agency-access";
import { LegislationSourceService } from "./legislation_source.service";
import { CreateLegislationSourceInput, UpdateLegislationSourceInput } from "./dto/legislation-source";

@UseGuards(JwtRoleGuard)
@Resolver("LegislationSource")
export class LegislationSourceResolver {
  constructor(private readonly legislationSourceService: LegislationSourceService) {}

  @Query("legislationSources")
  @Roles(adminRoles)
  async getLegislationSources() {
    return await this.legislationSourceService.getAll();
  }

  @Query("legislationSource")
  @Roles(adminRoles)
  async getLegislationSource(@Args("legislationSourceGuid") legislationSourceGuid: string) {
    return await this.legislationSourceService.getById(legislationSourceGuid);
  }

  @Mutation("createLegislationSource")
  @Roles(adminRoles)
  async createLegislationSource(@Args("input") input: CreateLegislationSourceInput, @Context() context: any) {
    const userId = context.req?.user?.idir_username || "system";
    validateAgencyAccess(context.req?.user?.client_roles, input.agencyCode);

    return await this.legislationSourceService.create({
      ...input,
      createUserId: userId,
    });
  }

  @Mutation("updateLegislationSource")
  @Roles(adminRoles)
  async updateLegislationSource(@Args("input") input: UpdateLegislationSourceInput, @Context() context: any) {
    const userId = context.req?.user?.idir_username || "system";
    const clientRoles = context.req?.user?.client_roles;
    validateAgencyAccess(clientRoles, await this.legislationSourceService.getAgencyCode(input.legislationSourceGuid));

    // A source cannot be moved into an agency where the user is not an administrator
    if (input.agencyCode !== undefined) {
      validateAgencyAccess(clientRoles, input.agencyCode);
    }

    return await this.legislationSourceService.update({
      ...input,
      updateUserId: userId,
    });
  }

  @Mutation("deleteLegislationSource")
  @Roles(adminRoles)
  async deleteLegislationSource(@Args("legislationSourceGuid") legislationSourceGuid: string, @Context() context: any) {
    validateAgencyAccess(
      context.req?.user?.client_roles,
      await this.legislationSourceService.getAgencyCode(legislationSourceGuid),
    );

    return await this.legislationSourceService.delete(legislationSourceGuid);
  }
}
