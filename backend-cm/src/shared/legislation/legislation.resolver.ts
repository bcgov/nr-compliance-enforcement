import { Resolver, Query, Args } from "@nestjs/graphql";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
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
  async findOne(@Args("legislationGuid") legislationGuid: string) {
    return await this.legislationService.findOne(legislationGuid);
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
}
