import { Resolver, Query } from "@nestjs/graphql";
import { AppUserService } from "./app_user.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("AppUser")
export class AppUserResolver {
  constructor(private readonly appUserService: AppUserService) {}

  @Query("appUsers")
  @Roles(coreRoles)
  findAll() {
    return this.appUserService.findAll();
  }
}
