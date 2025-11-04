import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { AppUserService } from "./app_user.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles, Role } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateAppUserInput, UpdateAppUserInput } from "./dto/app_user";
import { UserService } from "../../common/user.service";

@UseGuards(JwtRoleGuard)
@Resolver("AppUser")
export class AppUserResolver {
  constructor(
    private readonly appUserService: AppUserService,
    private readonly user: UserService,
  ) {}

  @Query("appUsers")
  @Roles(coreRoles)
  findAll(@Args("officeGuids") officeGuids?: string[], @Args("agencyCode") agencyCode?: string) {
    return this.appUserService.findAll(officeGuids, agencyCode);
  }

  @Query("appUser")
  @Roles(coreRoles)
  findOne(
    @Args("appUserGuid") appUserGuid?: string,
    @Args("userId") userId?: string,
    @Args("authUserGuid") authUserGuid?: string,
  ) {
    return this.appUserService.findOne(userId, authUserGuid, appUserGuid);
  }

  @Query("searchAppUsers")
  @Roles(coreRoles)
  search(@Args("searchTerm") searchTerm: string) {
    return this.appUserService.search(searchTerm);
  }

  @Mutation("createAppUser")
  @Roles(Role.TEMPORARY_TEST_ADMIN)
  create(@Args("input") input: CreateAppUserInput) {
    return this.appUserService.create(input);
  }

  @Mutation("updateAppUser")
  @Roles(coreRoles, Role.TEMPORARY_TEST_ADMIN)
  update(@Args("appUserGuid") appUserGuid: string, @Args("input") input: UpdateAppUserInput) {
    return this.appUserService.update(appUserGuid, input);
  }
}
