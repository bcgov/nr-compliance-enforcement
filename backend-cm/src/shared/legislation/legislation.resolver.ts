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

  @Query("legislation")
  @Roles(coreRoles)
  findMany(
    @Args("agencyCode") agencyCode: string,
    @Args("legislationTypeCode") legislationTypeCode?: string,
    @Args("parentGuid") parentGuid?: string,
    @Args("directDescendantsOnly") directDescendantsOnly?: boolean,
  ) {
    return this.legislationService.findMany(agencyCode, legislationTypeCode, parentGuid, directDescendantsOnly);
  }
}
