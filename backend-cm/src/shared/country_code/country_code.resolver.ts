import { Resolver, Query } from "@nestjs/graphql";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CountryCodeService } from "src/shared/country_code/country_code.service";

@UseGuards(JwtRoleGuard)
@Resolver("CountryCode")
export class CountryCodeResolver {
  constructor(private readonly countryCodeService: CountryCodeService) {}

  @Query("countries")
  @Roles(coreRoles)
  async findAll() {
    const c = await this.countryCodeService.findAll();
    return c;
  }
}
