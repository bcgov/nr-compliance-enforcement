import { Resolver, Query } from "@nestjs/graphql";
import { ThreatLevelCodeService } from "./threat_level_code.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("ThreatLevelCode")
export class ThreatLevelCodeResolver {
  constructor(private readonly threatLevelCodeService: ThreatLevelCodeService) {}

  @Query("threatLevelCodes")
  @Roles(coreRoles)
  findAll() {
    return this.threatLevelCodeService.findAll();
  }
}
