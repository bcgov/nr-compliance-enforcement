import { Resolver, Query, Args, Mutation, Context } from "@nestjs/graphql";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { adminRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { LegislationSourceService } from "./legislation_source.service";

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
  async createLegislationSource(
    @Args("input")
    input: {
      shortDescription: string;
      longDescription?: string;
      sourceUrl: string;
      regulationsSourceUrl?: string;
      agencyCode: string;
    },
    @Context() context: any,
  ) {
    const userId = context.req?.user?.idir_username || "system";
    return await this.legislationSourceService.create({
      ...input,
      createUserId: userId,
    });
  }

  @Mutation("updateLegislationSource")
  @Roles(adminRoles)
  async updateLegislationSource(
    @Args("input")
    input: {
      legislationSourceGuid: string;
      shortDescription?: string;
      longDescription?: string;
      sourceUrl?: string;
      regulationsSourceUrl?: string;
      agencyCode?: string;
      activeInd?: boolean;
      importedInd?: boolean;
    },
    @Context() context: any,
  ) {
    const userId = context.req?.user?.idir_username || "system";
    return await this.legislationSourceService.update({
      ...input,
      updateUserId: userId,
    });
  }

  @Mutation("deleteLegislationSource")
  @Roles(adminRoles)
  async deleteLegislationSource(@Args("legislationSourceGuid") legislationSourceGuid: string) {
    return await this.legislationSourceService.delete(legislationSourceGuid);
  }
}
