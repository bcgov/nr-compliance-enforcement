import { Controller, Param, UseGuards, Put, Patch, Body } from "@nestjs/common";
import { PersonComplaintXrefService } from "./person_complaint_xref.service";
import { ApiTags } from "@nestjs/swagger";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../enum/role.enum";
import { UUID } from "crypto";
import { CreatePersonComplaintXrefDto } from "./dto/create-person_complaint_xref.dto";

@UseGuards(JwtRoleGuard)
@ApiTags("person-complaint-xref")
@Controller({
  path: "person-complaint-xref",
  version: "1",
})
export class PersonComplaintXrefController {
  constructor(
    private readonly personComplaintXrefService: PersonComplaintXrefService
  ) {}

  /**
   * Assigns an officer to a complaint.  This will perform one of two operations.  If the existing complaint is not yet assigned to an officer, then this will create a new complaint/officer cross reference.
   *
   * If the complaint is already assigned to an officer and the intention is to reassign the complaint to another officer, then first deactivate the first assignment and then
   * create a new cross reference between the complaint and officer.
   *
   * Given that this is intended to be idempotent, this is a Put request.
   */
  @Put("/assign-officer/")
  @Roles(Role.COS_OFFICER)
  assignOfficer(
    @Param("complaint_id") complaintId: string, @Body() createPersonComplaintXrefDto: CreatePersonComplaintXrefDto
  ) {
    return this.personComplaintXrefService.assignOfficer(
      complaintId,
      createPersonComplaintXrefDto
      );
  }
}
