import { Resolver, Query, Args } from "@nestjs/graphql";
import { InactionJustificationTypeService } from "./inaction_justification_type.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("InactionJustificationType")
export class InactionJustificationTypeResolver {
  constructor(private readonly inactionJustificationTypeService: InactionJustificationTypeService) {}

  @Query("inactionJustificationCodes")
  @Roles(coreRoles)
  find(@Args("agencyCode") agencyCode?: string) {
    return this.inactionJustificationTypeService.find(agencyCode);
  }
}
