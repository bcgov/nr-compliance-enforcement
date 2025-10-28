import { Resolver, Query } from "@nestjs/graphql";
import { OfficeService } from "./office.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("Office")
export class OfficeResolver {
  constructor(private readonly officeService: OfficeService) {}

  @Query("offices")
  @Roles(coreRoles)
  findAll() {
    return this.officeService.findAll();
  }
}
