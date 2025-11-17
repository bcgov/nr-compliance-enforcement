import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { AppUserTeamXrefService } from "./app_user_team_xref.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { coreRoles, Role } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateAppUserTeamXrefInput, UpdateAppUserTeamXrefInput } from "./dto/app_user_team_xref";

@UseGuards(JwtRoleGuard)
@Resolver("AppUserTeamXref")
export class AppUserTeamXrefResolver {
  constructor(private readonly appUserTeamXrefService: AppUserTeamXrefService) {}

  @Query("appUserTeamXrefs")
  @Roles(coreRoles)
  async findAll() {
    return await this.appUserTeamXrefService.findAll();
  }

  @Query("appUserTeamXref")
  @Roles(coreRoles)
  async findOne(@Args("appUserGuid") appUserGuid: string) {
    return await this.appUserTeamXrefService.findOne(appUserGuid);
  }

  @Mutation("createAppUserTeamXref")
  @Roles(Role.TEMPORARY_TEST_ADMIN)
  async create(@Args("input") input: CreateAppUserTeamXrefInput) {
    return await this.appUserTeamXrefService.create(input);
  }

  @Mutation("updateAppUserTeamXref")
  @Roles(coreRoles, Role.TEMPORARY_TEST_ADMIN)
  async update(@Args("appUserGuid") appUserGuid: string, @Args("input") input: UpdateAppUserTeamXrefInput) {
    return await this.appUserTeamXrefService.update(appUserGuid, input);
  }

  @Mutation("deleteAppUserTeamXref")
  @Roles(Role.TEMPORARY_TEST_ADMIN)
  async delete(@Args("appUserTeamXrefGuid") appUserTeamXrefGuid: string) {
    return await this.appUserTeamXrefService.delete(appUserTeamXrefGuid);
  }
}
