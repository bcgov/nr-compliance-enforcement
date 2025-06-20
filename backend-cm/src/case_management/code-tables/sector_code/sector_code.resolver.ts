import { Resolver, Query, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { JwtRoleGuard } from "src/auth/jwtrole.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { coreRoles } from "src/enum/role.enum";
import { SectorCodeService } from "./sector_code.service";

@UseGuards(JwtRoleGuard)
@Resolver("SectorCode")
export class SectorCodeResolver {
  constructor(private readonly service: SectorCodeService) {}

  @Query("sectorCodes")
  @Roles(coreRoles)
  findAll() {
    return this.service.findAll();
  }
}
