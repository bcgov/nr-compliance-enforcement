import { Resolver, Query, Args } from "@nestjs/graphql";
import { DrugCodeService } from "./drug_code.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@Resolver("DrugCode")
@UseGuards(JwtRoleGuard)
export class DrugCodeResolver {
  constructor(private readonly drugCodeService: DrugCodeService) {}

  @Query("drugCodes")
  @Roles(coreRoles)
  findAll() {
    return this.drugCodeService.findAll();
  }
}
