import { Resolver, Query } from "@nestjs/graphql";
import { PartyAssociationRoleCodeService } from "./party_association_role_code.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("PartyAssociationRoleCode")
export class PartyAssociationRoleCodeResolver {
  constructor(private readonly partyAssociationRoleCodeService: PartyAssociationRoleCodeService) {}

  @Query("partyAssociationRoles")
  @Roles(coreRoles)
  async findAll() {
    return await this.partyAssociationRoleCodeService.findAll();
  }
}
