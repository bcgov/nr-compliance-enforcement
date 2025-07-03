import { Resolver, Query, Args } from "@nestjs/graphql";
import { ConfigurationService } from "./configuration.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("Configuration")
export class ConfigurationResolver {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Query("configurationCodes")
  @Roles(coreRoles)
  findOne(@Args("configurationCode") configurationCode?: string) {
    return this.configurationService.find(configurationCode);
  }
}
