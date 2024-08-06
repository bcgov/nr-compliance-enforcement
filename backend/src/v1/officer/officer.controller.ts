import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { OfficerService } from "./officer.service";
import { CreateOfficerDto } from "./dto/create-officer.dto";
import { UpdateOfficerDto } from "./dto/update-officer.dto";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../enum/role.enum";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { UUID } from "crypto";

@ApiTags("officer")
@UseGuards(JwtRoleGuard)
@Controller({
  path: "officer",
  version: "1",
})
export class OfficerController {
  constructor(private readonly officerService: OfficerService) {}

  @Post()
  @Roles(Role.COS_OFFICER)
  create(@Body() createOfficerDto: CreateOfficerDto) {
    return this.officerService.create(createOfficerDto);
  }

  @Get()
  @Roles(Role.COS_OFFICER, Role.CEEB)
  findAll() {
    return this.officerService.findAll();
  }

  @Get(":id")
  @Roles(Role.COS_OFFICER)
  findOne(@Param("id") id: string) {
    return this.officerService.findOne(id);
  }

  @Get("/find-by-office/:office_guid")
  @Roles(Role.COS_OFFICER)
  findByOffice(@Param("office_guid") office_guid: string) {
    return this.officerService.findByOffice(office_guid);
  }

  @Get("/find-by-auth-user-guid/:auth_user_guid")
  @Roles(Role.COS_OFFICER)
  findByAuthUserGuid(@Param("auth_user_guid") auth_user_guid: string) {
    return this.officerService.findByAuthUserGuid(auth_user_guid);
  }

  @Get("/find-by-userid/:userid")
  @Roles(Role.COS_OFFICER, Role.CEEB)
  findByUserId(@Param("userid") userid: string) {
    return this.officerService.findByUserId(userid);
  }

  @Patch(":id")
  @Roles(Role.COS_OFFICER, Role.CEEB)
  update(@Param("id") id: UUID, @Body() updateOfficerDto: UpdateOfficerDto) {
    return this.officerService.update(id, updateOfficerDto);
  }

  @Delete(":id")
  @Roles(Role.COS_OFFICER)
  remove(@Param("id") id: string) {
    return this.officerService.remove(+id);
  }
}
