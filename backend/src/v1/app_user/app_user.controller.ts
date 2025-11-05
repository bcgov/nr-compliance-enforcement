import { Controller, Get, Post, Body, Patch, Param, UseGuards, Put } from "@nestjs/common";
import { AppUserService } from "./app_user.service";
import { CreateAppUserDto } from "./dto/create-app-user.dto";
import { UpdateAppUserDto } from "./dto/update-app-user.dto";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role, coreRoles } from "../../enum/role.enum";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { UUID } from "node:crypto";
import { User } from "../../auth/decorators/user.decorator";
import { Token } from "../../auth/decorators/token.decorator";

@ApiTags("app-user")
@UseGuards(JwtRoleGuard)
@Controller({
  path: "app-user",
  version: "1",
})
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) {}

  @Post()
  @Roles(Role.TEMPORARY_TEST_ADMIN)
  create(@Body() createAppUserDto: CreateAppUserDto, @Token() token: string) {
    return this.appUserService.create(createAppUserDto, token);
  }

  @Get()
  @Roles(coreRoles)
  findAll(@Token() token: string) {
    return this.appUserService.findAll(token);
  }

  @Get(":id")
  @Roles(coreRoles)
  findOne(@Param("id") id: string, @Token() token: string) {
    return this.appUserService.findOne(id, token);
  }

  @Get("/find-by-office/:office_guid")
  @Roles(Role.COS)
  findByOffice(@Param("office_guid") office_guid: string, @Token() token: string) {
    return this.appUserService.findByOffice(office_guid, token);
  }

  @Get("/find-by-auth-user-guid/:auth_user_guid")
  @Roles(coreRoles)
  findByAuthUserGuid(@Param("auth_user_guid") auth_user_guid: string, @Token() token: string) {
    return this.appUserService.findByAuthUserGuid(auth_user_guid, token);
  }

  @Get("/find-by-userid/:userid")
  @Roles(coreRoles)
  findByUserId(@Param("userid") userid: string, @Token() token: string) {
    return this.appUserService.findByUserId(userid, token);
  }

  @Patch(":id")
  @Roles(coreRoles, Role.TEMPORARY_TEST_ADMIN)
  update(@Param("id") id: UUID, @Body() updateAppUserDto: UpdateAppUserDto, @Token() token: string) {
    return this.appUserService.update(id, updateAppUserDto, token);
  }

  @Put("/request-coms-access/:app_user_guid")
  @Roles(coreRoles, Role.READ_ONLY)
  requestComsAccess(@Token() token, @Param("app_user_guid") app_user_guid: UUID, @User() user) {
    return this.appUserService.requestComsAccess(token, app_user_guid, user);
  }
}
