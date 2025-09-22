import { Resolver, Query } from "@nestjs/graphql";
import { OutcomeAgencyCodeService } from "./outcome_agency_code.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("OutcomeAgencyCode")
export class OutcomeAgencyCodeResolver {
  constructor(private readonly agencyCodeService: OutcomeAgencyCodeService) {}

  @Query("outcomeAgencyCodes")
  @Roles(coreRoles)
  findAll() {
    return this.agencyCodeService.findAll();
  }
}
