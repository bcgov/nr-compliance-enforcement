import { Controller, Param, UseGuards, Post, Body, Get } from "@nestjs/common";
import { PersonComplaintXrefService } from "./person_complaint_xref.service";
import { ApiTags } from "@nestjs/swagger";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role, coreRoles } from "../../enum/role.enum";
import { CreatePersonComplaintXrefDto } from "./dto/create-person_complaint_xref.dto";
import { DataSource } from "typeorm";

@UseGuards(JwtRoleGuard)
@ApiTags("person-complaint-xref")
@Controller({
  path: "person-complaint-xref",
  version: "1",
})
export class PersonComplaintXrefController {
  constructor(
    private readonly personComplaintXrefService: PersonComplaintXrefService,
    private dataSource: DataSource,
  ) {}

  @Post(":complaint_id")
  @Roles(coreRoles)
  assignOfficer(
    @Param("complaint_id") complaintId: string,
    @Body() createPersonComplaintXrefDto: CreatePersonComplaintXrefDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    return this.personComplaintXrefService.assignOfficer(queryRunner, complaintId, createPersonComplaintXrefDto, true);
  }

  @Get("/:person_guid/:complaint_id")
  @Roles(coreRoles)
  findAssigned(@Param("person_guid") personGuid: string, @Param("complaint_id") complaintId: string) {
    return this.personComplaintXrefService.findAssigned(personGuid, complaintId);
  }
}
