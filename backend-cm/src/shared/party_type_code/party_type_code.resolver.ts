import { Resolver, Query } from "@nestjs/graphql";
import { PartyTypeCodeService } from "./party_type_code.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("PartyTypeCode")
export class PartyTypeCodeResolver {
  constructor(private readonly partyTypeCodeService: PartyTypeCodeService) {}

  @Query("partyTypeCodes")
  @Roles(coreRoles)
  async findAll() {
    return await this.partyTypeCodeService.findAll();
  }
}
