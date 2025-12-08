import { Resolver, Query, Args, Mutation, Context } from "@nestjs/graphql";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles, adminRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { LegislationService } from "./legislation.service";

@UseGuards(JwtRoleGuard)
@Resolver("Legislation")
export class LegislationResolver {
  constructor(private readonly legislationService: LegislationService) {}

  @Query("legislations")
  @Roles(coreRoles)
  findMany(
    @Args("agencyCode") agencyCode: string,
    @Args("legislationTypeCodes") legislationTypeCodes?: string[],
    @Args("ancestorGuid") ancestorGuid?: string,
  ) {
    return this.legislationService.findMany(agencyCode, legislationTypeCodes, ancestorGuid);
  }

  @Query("legislation")
  @Roles(coreRoles)
  async findOne(@Args("legislationGuid") legislationGuid: string, @Args("includeAncestors") includeAncestors: boolean) {
    return await this.legislationService.findOne(legislationGuid, includeAncestors);
  }

  @Query("legislationChildTypes")
  @Roles(coreRoles)
  async getChildTypes(@Args("agencyCode") agencyCode: string, @Args("parentGuid") parentGuid?: string) {
    return await this.legislationService.getChildTypes(agencyCode, parentGuid);
  }

  @Query("legislationDirectChildren")
  @Roles(coreRoles)
  async findDirectChildren(
    @Args("agencyCode") agencyCode: string,
    @Args("parentGuid") parentGuid: string,
    @Args("legislationTypeCode") legislationTypeCode?: string,
  ) {
    return await this.legislationService.findDirectChildren(agencyCode, parentGuid, legislationTypeCode);
  }

  @Query("legislationSources")
  @Roles(adminRoles)
  async getLegislationSources() {
    return await this.legislationService.getAllLegislationSources();
  }

  @Query("legislationSource")
  @Roles(adminRoles)
  async getLegislationSource(@Args("legislationSourceGuid") legislationSourceGuid: string) {
    return await this.legislationService.getLegislationSourceById(legislationSourceGuid);
  }

  @Mutation("createLegislationSource")
  @Roles(adminRoles)
  async createLegislationSource(
    @Args("input")
    input: {
      shortDescription: string;
      longDescription?: string;
      sourceUrl: string;
      agencyCode: string;
    },
    @Context() context: any,
  ) {
    const userId = context.req?.user?.idir_username || "system";
    return await this.legislationService.createLegislationSource({
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
      agencyCode?: string;
      activeInd?: boolean;
      importedInd?: boolean;
    },
    @Context() context: any,
  ) {
    const userId = context.req?.user?.idir_username || "system";
    return await this.legislationService.updateLegislationSource({
      ...input,
      updateUserId: userId,
    });
  }

  @Mutation("deleteLegislationSource")
  @Roles(adminRoles)
  async deleteLegislationSource(@Args("legislationSourceGuid") legislationSourceGuid: string) {
    return await this.legislationService.deleteLegislationSource(legislationSourceGuid);
  }
}
