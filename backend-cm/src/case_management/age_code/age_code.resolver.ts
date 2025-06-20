import { Resolver, Query } from "@nestjs/graphql";
import { AgeCodeService } from "./age_code.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("AgeCode")
export class AgeCodeResolver {
  constructor(private readonly ageCodeService: AgeCodeService) {}

  @Query("ageCodes")
  @Roles(coreRoles)
  findAll() {
    return this.ageCodeService.findAll();
  }
}
