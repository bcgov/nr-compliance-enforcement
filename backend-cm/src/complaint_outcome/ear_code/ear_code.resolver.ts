import { Resolver, Query } from "@nestjs/graphql";
import { EarCodeService } from "./ear_code.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("EarCode")
export class EarCodeResolver {
  constructor(private readonly earCodeService: EarCodeService) {}

  @Query("earCodes")
  @Roles(coreRoles)
  findAll() {
    return this.earCodeService.findAll();
  }
}
