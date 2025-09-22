import { Resolver, Query } from "@nestjs/graphql";
import { HwcrOutcomeCodeService } from "./hwcr_outcome_code.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("HwcrOutcomeCode")
export class HwcrOutcomeCodeResolver {
  constructor(private readonly hwcrOutcomeCodeService: HwcrOutcomeCodeService) {}

  @Query("hwcrOutcomeCodes")
  @Roles(coreRoles)
  findAll() {
    return this.hwcrOutcomeCodeService.findAll();
  }
}
