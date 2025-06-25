import { Resolver, Query } from "@nestjs/graphql";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { ActionCodeService } from "../action_code/action_code.service";
import { ACTION_TYPE_CODES } from "../../common/action_type_codes";

@UseGuards(JwtRoleGuard)
@Resolver("HWCRPreventionAction")
export class HWCRPreventionActionResolver {
  constructor(private readonly actionCodeService: ActionCodeService) {}

  @Query("HWCRPreventionActions")
  @Roles(coreRoles)
  find() {
    return this.actionCodeService.findAllCodesByType([ACTION_TYPE_CODES.COSPRVANDEDU, ACTION_TYPE_CODES.PRKPRVANDEDU]);
  }
}
