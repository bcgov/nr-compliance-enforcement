import { Resolver, Query } from "@nestjs/graphql";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { HairColourCodeService } from "src/shared/hair_colour_code/hair_colour_code.service";

@UseGuards(JwtRoleGuard)
@Resolver("HairColourCode")
export class HairColourCodeResolver {
  constructor(private readonly hairColourCodeService: HairColourCodeService) {}

  @Query("hairColourCodes")
  @Roles(coreRoles)
  async findAll() {
    return await this.hairColourCodeService.findAll();
  }
}
