import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Logger,
} from "@nestjs/common";
import { AllegationComplaintService } from "./allegation_complaint.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../enum/role.enum";
import { UUID } from "crypto";
import { SearchPayload } from "../complaint/models/search-payload";

@UseGuards(JwtRoleGuard)
@ApiTags("allegation-complaint")
@Controller({
  path: "allegation-complaint",
  version: "1",
})
export class AllegationComplaintController {
  constructor(
    private readonly allegationComplaintService: AllegationComplaintService
  ) {}

  private readonly logger = new Logger(AllegationComplaintController.name);

  @Post()
  @Roles(Role.COS_OFFICER)
  create(@Body('allegationComplaint') createAllegationComplaintDto: string) {
    return this.allegationComplaintService.create(createAllegationComplaintDto);
  }
  
  @Get("/stats/by-zone/:zone")
  @Roles(Role.COS_OFFICER)
  statsByZone(@Param("zone") zone: string) {
    return this.allegationComplaintService.getZoneAtAGlanceStatistics(zone);
  }
}
