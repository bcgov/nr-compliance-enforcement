import { Resolver, Query } from "@nestjs/graphql";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwtauth.guard";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { EquipmentCodeService } from "./equipment_code.service";

@UseGuards(JwtAuthGuard, JwtRoleGuard)
@Resolver("EquipmentCode")
export class EquipmentCodeResolver {
  constructor(private readonly equipmentCodeService: EquipmentCodeService) {}

  @Query("equipmentCodes")
  @Roles(coreRoles)
  findAll() {
    return this.equipmentCodeService.findAll();
  }
}
