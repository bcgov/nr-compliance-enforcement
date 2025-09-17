import { Resolver, Query } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { JwtRoleGuard } from "src/auth/jwtrole.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { coreRoles } from "src/enum/role.enum";
import { DischargeCodeService } from "./discharge_code.service";

@UseGuards(JwtRoleGuard)
@Resolver("DischargeCode")
export class DischargeCodeResolver {
  constructor(private readonly service: DischargeCodeService) {}

  @Query("dischargeCodes")
  @Roles(coreRoles)
  findAll() {
    return this.service.findAll();
  }
}
