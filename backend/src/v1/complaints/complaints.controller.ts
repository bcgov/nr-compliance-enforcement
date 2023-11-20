import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Role } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ComplaintsService } from "./complaints.service";
import { COMPLAINT_TYPE } from "src/types/complaints/complaint-type";

@UseGuards(JwtRoleGuard)
@ApiTags("complaints")
@Controller({ path: "complaints", version: "1" })
export class ComplaintsController {
  constructor(private readonly service: ComplaintsService) {}

  @Get(":complaintType")
  @Roles(Role.COS_OFFICER)
  async getCodeTableByName(
    @Param("complaintType") complaintType: COMPLAINT_TYPE
  ): Promise<Array<any>> {
    const results = await this.service.findAllByType(complaintType);

    return results;
  }
}
