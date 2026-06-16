import { Resolver, Query } from "@nestjs/graphql";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { EyeColourCodeService } from "src/shared/eye_colour_code/eye_colour_code.service";

@UseGuards(JwtRoleGuard)
@Resolver("EyeColourCode")
export class EyeColourCodeResolver {
  constructor(private readonly eyeColourCodeService: EyeColourCodeService) {}

  @Query("eyeColourCodes")
  @Roles(coreRoles)
  async findAll() {
    return await this.eyeColourCodeService.findAll();
  }
}
