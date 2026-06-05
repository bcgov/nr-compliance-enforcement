import { Resolver, Query } from "@nestjs/graphql";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { BuildCodeService } from "src/shared/build_code/build_code.service";

@UseGuards(JwtRoleGuard)
@Resolver("BuildCode")
export class BuildCodeResolver {
  constructor(private readonly buildCodeService: BuildCodeService) {}

  @Query("buildCodes")
  @Roles(coreRoles)
  async findAll() {
    return await this.buildCodeService.findAll();
  }
}
