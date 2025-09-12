import { Resolver, Query } from "@nestjs/graphql";
import { HwcrOutcomeActionedByCodeService } from "./hwcr_outcome_actioned_by_code.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("HwcrOutcomeActionedByCode")
export class HwcrOutcomeActionedByCodeResolver {
  constructor(private readonly hwcrOutcomeActionedByCodeService: HwcrOutcomeActionedByCodeService) {}

  @Query("hwcrOutcomeActionedByCodes")
  @Roles(coreRoles)
  findAll() {
    return this.hwcrOutcomeActionedByCodeService.findAll();
  }
}
