import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Logger,
} from "@nestjs/common";
import { HwcrComplaintService } from "./hwcr_complaint.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator"

@UseGuards(JwtRoleGuard)
@ApiBearerAuth()
@ApiTags("hwcr-complaint")
@Controller({
  path: "hwcr-complaint",
  version: "1",
})
export class HwcrComplaintController {
  constructor(private readonly hwcrComplaintService: HwcrComplaintService) {}

  private readonly logger = new Logger(HwcrComplaintController.name);

  @Post()
  @Roles(Role.COS_OFFICER)
  create(@Body("hwcrComplaint") createHwcrComplaintDto: string) {
    return this.hwcrComplaintService.create(createHwcrComplaintDto);
  }

  @Get("/stats/by-zone/:zone")
  @Roles(Role.COS_OFFICER)
  statsByZone(@Param("zone") zone: string) {
    return this.hwcrComplaintService.getZoneAtAGlanceStatistics(zone);
  }
}
