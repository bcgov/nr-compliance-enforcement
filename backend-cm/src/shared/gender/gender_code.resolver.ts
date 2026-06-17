import { Resolver, Query } from "@nestjs/graphql";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { GenderCodeService } from "src/shared/gender/gender_code.service";

@UseGuards(JwtRoleGuard)
@Resolver("GenderCode")
export class GenderCodeResolver {
  constructor(private readonly genderCodeService: GenderCodeService) {}

  @Query("genderCodes")
  @Roles(coreRoles)
  async findAll() {
    return await this.genderCodeService.findAll();
  }
}
