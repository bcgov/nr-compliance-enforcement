import { Controller, Param, UseGuards, Get } from "@nestjs/common";
import { LinkedComplaintXrefService } from "./linked_complaint_xref.service";
import { ApiTags } from "@nestjs/swagger";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../enum/role.enum";
import { DataSource } from "typeorm";

@UseGuards(JwtRoleGuard)
@ApiTags("linked-complaint-xref")
@Controller({
  path: "linked-complaint-xref",
  version: "1",
})
export class LinkedComplaintXrefController {
  constructor(
    private readonly linkedComplaintXrefService: LinkedComplaintXrefService,
    private dataSource: DataSource,
  ) {}

  @Get("/:complaint_id")
  @Roles(Role.COS_OFFICER)
  async findLinkedComplaintsById(@Param("complaint_id") complaintId: string) {
    const childComplaints = await this.linkedComplaintXrefService.findChildComplaints(complaintId);
    const parentComplaint = await this.linkedComplaintXrefService.findParentComplaint(complaintId);
    return { parentComplaint, childComplaints };
  }
}
