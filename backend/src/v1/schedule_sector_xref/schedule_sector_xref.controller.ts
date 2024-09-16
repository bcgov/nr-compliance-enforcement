import { Controller, Param, UseGuards, Post, Body, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../enum/role.enum";
import { DataSource } from "typeorm";
import { ScheduleSectorXrefService } from "./schedule_sector_xref.service";

@ApiTags("schedule-sector-xref")
@Controller({
  path: "schedule-sector-xref",
  version: "1",
})
export class ScheduleSectorXrefController {
  constructor(private readonly scheduleSectorXrefService: ScheduleSectorXrefService, private dataSource: DataSource) {}

  @Get()
  findAll() {
    return this.scheduleSectorXrefService.findAll();
  }
}
