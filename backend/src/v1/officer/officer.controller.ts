import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from "@nestjs/common";
import { OfficerService } from "./officer.service";
import { UpdateOfficerDto } from "./dto/update-officer.dto";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role, coreRoles } from "../../enum/role.enum";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { UUID } from "crypto";
import { User } from "../../auth/decorators/user.decorator";
import { Token } from "../../auth/decorators/token.decorator";
import { NewOfficer } from "../../types/models/people/officer";

@ApiTags("officer")
@UseGuards(JwtRoleGuard)
@Controller({
  path: "officer",
  version: "1",
})
export class OfficerController {
  constructor(private readonly officerService: OfficerService) {}

  @Post()
  @Roles(Role.TEMPORARY_TEST_ADMIN)
  create(@Body() createOfficerDto: NewOfficer) {
    return this.officerService.create(createOfficerDto);
  }

  @Get()
  @Roles(coreRoles)
  findAll() {
    return this.officerService.findAll();
  }

  @Get(":id")
  @Roles(Role.COS)
  findOne(@Param("id") id: string) {
    return this.officerService.findOne(id);
  }

  @Get("/find-by-office/:office_guid")
  @Roles(Role.COS)
  findByOffice(@Param("office_guid") office_guid: string) {
    return this.officerService.findByOffice(office_guid);
  }

  @Get("/find-by-auth-user-guid/:auth_user_guid")
  @Roles(coreRoles)
  findByAuthUserGuid(@Param("auth_user_guid") auth_user_guid: string) {
    return this.officerService.findByAuthUserGuid(auth_user_guid);
  }

  @Get("/find-by-userid/:userid")
  @Roles(coreRoles)
  findByUserId(@Param("userid") userid: string) {
    return this.officerService.findByUserId(userid);
  }

  @Get("/find-by-person-guid/:person_guid")
  @Roles(coreRoles, Role.TEMPORARY_TEST_ADMIN)
  findByPersonId(@Param("person_guid") person_guid: string) {
    return this.officerService.findByPersonGuid(person_guid);
  }

  @Get("/find-by-email/:email")
  @Roles(Role.TEMPORARY_TEST_ADMIN)
  findUserByEmail(@Param("email") email: string) {
    return this.officerService.findByCssEmail(email);
  }

  @Patch(":id")
  @Roles(coreRoles, Role.TEMPORARY_TEST_ADMIN)
  update(@Param("id") id: UUID, @Body() updateOfficerDto: UpdateOfficerDto) {
    return this.officerService.update(id, updateOfficerDto);
  }

  @Put("/request-coms-access/:officer_guid")
  @Roles(coreRoles, Role.READ_ONLY)
  requestComsAccess(@Token() token, @Param("officer_guid") officer_guid: UUID, @User() user) {
    return this.officerService.requestComsAccess(token, officer_guid, user);
  }

  @Delete(":id")
  @Roles(Role.COS)
  remove(@Param("id") id: string) {
    return this.officerService.remove(+id);
  }
}
