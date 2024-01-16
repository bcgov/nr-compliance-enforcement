import { Controller, Get, Param, UseGuards, Logger } from "@nestjs/common";
import { AllegationComplaintService } from "./allegation_complaint.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../enum/role.enum";

@UseGuards(JwtRoleGuard)
@ApiTags("allegation-complaint")
@Controller({
  path: "allegation-complaint",
  version: "1",
})
export class AllegationComplaintController {
  constructor(private readonly allegationComplaintService: AllegationComplaintService) {}

  private readonly logger = new Logger(AllegationComplaintController.name);

  @Get("/stats/by-zone/:zone")
  @Roles(Role.COS_OFFICER)
  statsByZone(@Param("zone") zone: string) {
    return this.allegationComplaintService.getZoneAtAGlanceStatistics(zone);
  }
}
