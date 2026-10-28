import { Resolver, Query, Args, Mutation, Context } from "@nestjs/graphql";
import { AppUserService } from "./app_user.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { Role, adminRoles, coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateAppUserInput, UpdateAppUserInput } from "./dto/app_user";
import { UserService } from "../../common/user.service";
import { validateAppUserAccess } from "./utils/validate-app-user-access";
import { validateAppUserUpdate } from "./utils/validate-app-user-update";

@UseGuards(JwtRoleGuard)
@Resolver("AppUser")
export class AppUserResolver {
  constructor(
    private readonly appUserService: AppUserService,
    private readonly user: UserService,
  ) {}

  @Query("appUsers")
  @Roles(coreRoles, adminRoles)
  async findAll(@Args("officeGuids") officeGuids?: string[], @Args("agencyCode") agencyCode?: string) {
    return await this.appUserService.findAll(officeGuids, agencyCode);
  }

  @Query("appUsersByGuids")
  @Roles(coreRoles, Role.PARTY_ACCESS)
  async findManyByIds(@Args("appUserGuids") appUserGuids?: string[], @Args("authUserGuids") authUserGuids?: string[]) {
    return await this.appUserService.findManyByIds(appUserGuids, authUserGuids);
  }

  @Query("appUser")
  @Roles(coreRoles, adminRoles, Role.PARTY_ACCESS)
  async findOne(
    @Args("appUserGuid") appUserGuid?: string,
    @Args("userId") userId?: string,
    @Args("authUserGuid") authUserGuid?: string,
    @Context() context?: any,
  ) {
    const appUser = await this.appUserService.findOne(userId, authUserGuid, appUserGuid);
    validateAppUserAccess(context.req?.user?.client_roles, this.user.getUserGuid(), appUser);

    return appUser;
  }

  @Query("searchAppUsers")
  @Roles(coreRoles)
  async search(@Args("searchTerm") searchTerm: string) {
    return await this.appUserService.search(searchTerm);
  }

  @Mutation("createAppUser")
  @Roles(adminRoles)
  async create(@Args("input") input: CreateAppUserInput) {
    return await this.appUserService.create(input);
  }

  @Mutation("updateAppUser")
  @Roles(coreRoles, adminRoles, Role.PARTY_ACCESS)
  async update(
    @Args("appUserGuid") appUserGuid: string,
    @Args("input") input: UpdateAppUserInput,
    @Context() context: any,
  ) {
    validateAppUserUpdate(
      context.req?.user?.client_roles,
      this.user.getUserGuid(),
      this.user.getIdirUsername(),
      await this.appUserService.findOne(undefined, undefined, appUserGuid),
      input,
    );

    return await this.appUserService.update(appUserGuid, input);
  }
}
