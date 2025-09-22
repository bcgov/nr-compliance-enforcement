import { Resolver, Query } from "@nestjs/graphql";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwtauth.guard";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { EquipmentStatusCodeService } from "./equipment_status_code.service";

@UseGuards(JwtAuthGuard, JwtRoleGuard)
@Resolver("EquipmentStatusCode")
export class EquipmentStatusCodeResolver {
  constructor(private readonly equipmentStatusCodeService: EquipmentStatusCodeService) {}

  @Query("equipmentStatusCodes")
  @Roles(coreRoles)
  findAll() {
    return this.equipmentStatusCodeService.findAll();
  }
}
