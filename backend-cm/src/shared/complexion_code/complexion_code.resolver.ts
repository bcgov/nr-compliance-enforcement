import { Resolver, Query } from "@nestjs/graphql";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { Role, coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { ComplexionCodeService } from "src/shared/complexion_code/complexion_code.service";

@UseGuards(JwtRoleGuard)
@Resolver("ComplexionCode")
export class ComplexionCodeResolver {
  constructor(private readonly complexionCodeService: ComplexionCodeService) {}

  @Query("complexionCodes")
  @Roles(coreRoles, Role.PARTY_ACCESS)
  async findAll() {
    return await this.complexionCodeService.findAll();
  }
}
