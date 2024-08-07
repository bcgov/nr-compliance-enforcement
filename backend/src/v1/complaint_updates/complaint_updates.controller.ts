import { Controller, Get, Param, UseGuards, Logger } from "@nestjs/common";
import { ComplaintUpdatesService } from "./complaint_updates.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../enum/role.enum";

@ApiTags("complaint-updates")
@UseGuards(JwtRoleGuard)
@Controller({
  path: "complaint-updates",
  version: "1",
})
export class ComplaintUpdatesController {
  constructor(private readonly configurationService: ComplaintUpdatesService) {}
  private readonly logger = new Logger(ComplaintUpdatesController.name);

  @Get("/:id")
  @Roles(Role.COS_OFFICER, Role.CEEB)
  findByComplaintId(@Param("id") id: string) {
    return this.configurationService.findByComplaintId(id);
  }

  @Get("/count/:id")
  @Roles(Role.COS_OFFICER, Role.CEEB)
  getComplaintChangeCount(@Param("id") id: string) {
    return this.configurationService.getComplaintChangeCount(id);
  }
}
