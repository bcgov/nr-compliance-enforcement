import { Resolver, Query } from "@nestjs/graphql";
import { PartyExternalIdCodeService } from "./party_external_id_code.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { Role, coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("PartyExternalIdCode")
export class PartyExternalIdCodeResolver {
  constructor(private readonly partyExternalIdCodeService: PartyExternalIdCodeService) {}

  @Query("partyExternalIdCodes")
  @Roles(coreRoles, Role.PARTY_ACCESS)
  async findAll() {
    return await this.partyExternalIdCodeService.findAll();
  }
}
