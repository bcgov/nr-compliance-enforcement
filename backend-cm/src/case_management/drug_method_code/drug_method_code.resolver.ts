import { Resolver, Query } from "@nestjs/graphql";
import { DrugMethodCodeService } from "./drug_method_code.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@Resolver("DrugMethodCode")
@UseGuards(JwtRoleGuard)
export class DrugMethodCodeResolver {
  constructor(private readonly drugMethodCodeService: DrugMethodCodeService) {}

  @Query("drugMethodCodes")
  @Roles(coreRoles)
  findAll() {
    return this.drugMethodCodeService.findAll();
  }
}
