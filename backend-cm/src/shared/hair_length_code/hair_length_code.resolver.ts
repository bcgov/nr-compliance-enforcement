import { Resolver, Query } from "@nestjs/graphql";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { Role, coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { HairLengthCodeService } from "src/shared/hair_length_code/hair_length_code.service";

@UseGuards(JwtRoleGuard)
@Resolver("HairLengthCode")
export class HairLengthCodeResolver {
  constructor(private readonly hairLengthCodeService: HairLengthCodeService) {}

  @Query("hairLengthCodes")
  @Roles(coreRoles, Role.PARTY_ACCESS)
  async findAll() {
    return await this.hairLengthCodeService.findAll();
  }
}
