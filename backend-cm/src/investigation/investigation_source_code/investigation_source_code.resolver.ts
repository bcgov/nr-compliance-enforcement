import { Resolver, Query } from "@nestjs/graphql";
import { InvestigationSourceCodeService } from "./investigation_source_code.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("InvestigationSourceCode")
export class InvestigationSourceCodeResolver {
  constructor(private readonly investigationSourceCodeService: InvestigationSourceCodeService) {}

  @Query("investigationSourceCodes")
  @Roles(coreRoles)
  async findAll() {
    return await this.investigationSourceCodeService.findAll();
  }
}
