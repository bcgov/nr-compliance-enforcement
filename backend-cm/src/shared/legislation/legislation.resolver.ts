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
    @Args()
    args: {
      agencyCode: string;
      legislationTypeCodes?: string[];
      ancestorGuid?: string;
      excludeRegulations?: boolean;
      legislationSourceGuid?: string;
      legislationVersionGuid?: string;
      onlyActive?: boolean;
      offenseDate?: string;
    },
  ) {
    return this.legislationService.findMany(args);
  }

  @Query("legislation")
  @Roles(coreRoles)
  async findOne(@Args("legislationGuid") legislationGuid: string, @Args("includeAncestors") includeAncestors: boolean) {
    return await this.legislationService.findOne(legislationGuid, includeAncestors);
  }

  @Query("legislationTypeCodes")
  @Roles(coreRoles)
  async getLegislationTypeCodes() {
    return await this.legislationService.getAllLegislationTypeCodes();
  }
}
