import { Controller, Get, Body, Patch, Param, UseGuards, Logger } from "@nestjs/common";
import { ConfigurationService } from "./configuration.service";
import { UpdateConfigurationDto } from "./dto/update-configuration.dto";
import { JwtRoleGuard } from "./../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "./../../auth/decorators/roles.decorator";
import { Token } from "./../../auth/decorators/token.decorator";
import { coreRoles } from "./../../enum/role.enum";
import { get } from "../../external_api/shared_data";

@ApiTags("configuration")
@UseGuards(JwtRoleGuard)
@Controller({
  path: "configuration",
  version: "1",
})
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}
  private readonly logger = new Logger(ConfigurationController.name);

  @Get()
  @Roles(coreRoles)
  findAll() {
    return this.configurationService.findAll();
  }

  @Get(":configurationCode")
  @Roles(coreRoles)
  async findOne(@Param("configurationCode") configurationCode: string, @Token() token) {
    try {
      const result = await this.configurationService.findOne(configurationCode);

      //If configuration is code table version, call another case managment api
      if (configurationCode === "CDTABLEVER") {
        const { data } = await get(token, {
          query:
            '{configurationCodes (configurationCode: "CDTABLEVER") {configurationCode configurationValue  activeIndicator}}',
        });

        let caseData = {};
        let complaintData = {};
        if (data) {
          caseData = {
            configurationCode: data.configurationCodes[0].configurationCode,
            configurationValue: data.configurationCodes[0].configurationValue,
            activeInd: data.configurationCodes[0].activeIndicator,
          };
        }
        if (result.length > 0) {
          complaintData = {
            configurationCode: result[0].configurationCode,
            configurationValue: result[0].configurationValue,
            activeInd: result[0].activeInd,
          };
        }
        return { complaintManagement: complaintData, caseManagement: caseData };
      }

      return result;
    } catch (err) {
      this.logger.error(
        `Error calling configurationCode ${configurationCode}: ${err?.message || "Unknown error"}`,
        err?.stack || err,
      );
      throw err;
    }
  }
}
