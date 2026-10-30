import { Resolver, Query } from "@nestjs/graphql";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { Role, coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { FacialHairStyleCodeService } from "src/shared/facial_hair_style_code/facial_hair_style_code.service";

@UseGuards(JwtRoleGuard)
@Resolver("FacialHairStyleCode")
export class FacialHairStyleCodeResolver {
  constructor(private readonly facialHairStyleCodeService: FacialHairStyleCodeService) {}

  @Query("facialHairStyleCodes")
  @Roles(coreRoles, Role.PARTY_ACCESS)
  async findAll() {
    return await this.facialHairStyleCodeService.findAll();
  }
}
