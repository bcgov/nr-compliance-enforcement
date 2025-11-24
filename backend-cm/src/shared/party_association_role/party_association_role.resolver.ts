import { Resolver, Query } from "@nestjs/graphql";
import { PartyAssociationRoleService } from "./party_association_role.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("PartyAssociationRole")
export class PartyAssociationRoleResolver {
  constructor(private readonly partyAssociationRoleService: PartyAssociationRoleService) {}

  @Query("partyAssociationRoles")
  @Roles(coreRoles)
  async findAll() {
    return await this.partyAssociationRoleService.findAll();
  }
}
