import { Resolver, Query } from "@nestjs/graphql";
import { SexCodeService } from "./sex_code.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("SexCode")
export class SexCodeResolver {
  constructor(private readonly sexCodeService: SexCodeService) {}

  @Query("sexCodes")
  @Roles(coreRoles)
  findAll() {
    return this.sexCodeService.findAll();
  }
}
