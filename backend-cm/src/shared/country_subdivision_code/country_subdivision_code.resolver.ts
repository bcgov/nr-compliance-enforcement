import { Resolver, Query } from "@nestjs/graphql";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { Role, coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CountrySubdivisionCodeService } from "src/shared/country_subdivision_code/country_subdivision_code.service";

@UseGuards(JwtRoleGuard)
@Resolver("CountrySubdivisionCode")
export class CountrySubdivisionCodeResolver {
  constructor(private readonly countrySubdivisionCodeService: CountrySubdivisionCodeService) {}

  @Query("countrySubdivisions")
  @Roles(coreRoles, Role.PARTY_ACCESS)
  async findAll() {
    return await this.countrySubdivisionCodeService.findAll();
  }
}
