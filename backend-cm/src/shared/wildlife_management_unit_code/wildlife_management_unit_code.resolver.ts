import { Resolver, Query } from "@nestjs/graphql";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { WildlifeManagementUnitCodeService } from "src/shared/wildlife_management_unit_code/wildlife_management_unit_code.service";

@UseGuards(JwtRoleGuard)
@Resolver("wildlifeManagementUnitCode")
export class WildlifeManagementUnitCodeResolver {
  constructor(private readonly wmuCodeService: WildlifeManagementUnitCodeService) {}

  @Query("wildlifeManagementUnitCodes")
  @Roles(coreRoles)
  async findAll() {
    return await this.wmuCodeService.findAll();
  }
}
