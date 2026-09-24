import { Resolver, Query } from "@nestjs/graphql";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { SpeciesCodeService } from "src/shared/species_code/species_code.service";

@UseGuards(JwtRoleGuard)
@Resolver("SpeciesCode")
export class SpeciesCodeResolver {
  constructor(private readonly speciesCodeService: SpeciesCodeService) {}

  @Query("speciesCodes")
  @Roles(coreRoles)
  async findAll() {
    return await this.speciesCodeService.findAll();
  }
}
