import { Resolver, Query } from "@nestjs/graphql";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { ApproximateAgeCodeService } from "src/shared/approximate_age_code/approximate_age_code.service";

@UseGuards(JwtRoleGuard)
@Resolver("ApproximateAgeCode")
export class ApproximateAgeCodeResolver {
  constructor(private readonly approximateAgeCodeService: ApproximateAgeCodeService) {}

  @Query("approximateAgeCodes")
  @Roles(coreRoles)
  async findAll() {
    return await this.approximateAgeCodeService.findAll();
  }
}
