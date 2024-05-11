import { Controller, Get, Body, Patch, Param, UseGuards, Logger } from "@nestjs/common";
import { ComplaintUpdatesService } from "./complaint_updates.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Token } from "../../auth/decorators/token.decorator";
import { Role } from "../../enum/role.enum";
import { get } from "../../external_api/case_management";
import { ComplaintUpdatesDto } from "src/types/models/complaint-updates/complaint-updates";

@ApiTags("configuration")
@UseGuards(JwtRoleGuard)
@Controller({
  path: "configuration",
  version: "1",
})
export class ComplaintUpdatesController {
  constructor(private readonly configurationService: ComplaintUpdatesService) {}
  private readonly logger = new Logger(ComplaintUpdatesController.name);

  @Get()
  @Roles(Role.COS_OFFICER)
  findAll() {
    return this.configurationService.findAll();
  }

  @Patch(":id")
  @Roles(Role.COS_OFFICER)
  update(@Param("id") id: string, @Body() updateConfigurationDto: ComplaintUpdatesDto) {
    return this.configurationService.update(+id, updateConfigurationDto);
  }
}
