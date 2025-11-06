import { Controller, Get, Logger, NotFoundException, Param, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CodeTableService } from "./code-table.service";
import { Role, coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Token } from "../../auth/decorators/token.decorator";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";

import BaseCodeTable, {
  AvailableAgencies,
  AvailableCodeTables,
  ComplaintMethodReceivedType,
  OrganizationCodeTable,
  Sector,
} from "../../types/models/code-tables";

@UseGuards(JwtRoleGuard)
@ApiTags("code-table")
@Controller({ path: "code-table", version: "1" })
export class CodeTableController {
  constructor(private readonly service: CodeTableService) {}

  @Get(":table")
  @Roles(coreRoles, Role.TEMPORARY_TEST_ADMIN)
  async getCodeTableByName(@Param("table") table: string, @Token() token): Promise<BaseCodeTable[]> {
    if (!AvailableCodeTables.includes(table)) {
      throw new NotFoundException();
    }

    const result = await this.service.getCodeTableByName(table, token);
    return result;
  }

  @Get("/complaint-method-received-by-agency/:agency")
  @Roles(coreRoles)
  async getComplaintMethodReceived(@Param("agency") agency: string): Promise<ComplaintMethodReceivedType[]> {
    const result = await this.service.getComplaintMethodReceived(agency);
    return result;
  }

  @Get("/organization-by-agency/:agency")
  @Roles(coreRoles)
  async getOrganizationsByAgency(
    @Param("agency") agency: string,
    @Token() token: string,
  ): Promise<OrganizationCodeTable[]> {
    if (!AvailableAgencies.includes(agency)) {
      throw new NotFoundException();
    }

    const result = await this.service.getOrganizationsByAgency(agency, token);
    return result;
  }

  @Get("/regions-by-agency/:agency")
  @Roles(coreRoles)
  async getRegionsByAgency(@Param("agency") agency: string, @Token() token: string): Promise<Sector[]> {
    if (!AvailableAgencies.includes(agency)) {
      throw new NotFoundException();
    }

    const result = await this.service.getRegionsByAgency(agency, token);
    return result;
  }

  @Get("/zones-by-agency/:agency")
  @Roles(coreRoles)
  async getZonesByAgency(@Param("agency") agency: string, @Token() token: string): Promise<Sector[]> {
    if (!AvailableAgencies.includes(agency)) {
      throw new NotFoundException();
    }

    const result = await this.service.getZonesByAgency(agency, token);
    return result;
  }

  @Get("/communities-by-agency/:agency")
  @Roles(coreRoles)
  async getCommunitiesByAgency(@Param("agency") agency: string, @Token() token: string): Promise<Sector[]> {
    if (!AvailableAgencies.includes(agency)) {
      throw new NotFoundException();
    }

    const result = await this.service.getCommunitiesByAgency(agency, token);
    return result;
  }
}

@UseGuards(JwtRoleGuard)
@ApiTags("code-table/case-management")
@Controller({ path: "code-table/case-management", version: "1" })
export class CaseManagementCodeTableController {
  constructor(private readonly service: CodeTableService) {}
  private readonly logger = new Logger(CaseManagementCodeTableController.name);

  @Get(":table")
  @Roles(coreRoles)
  async getCodeTableByName(@Param("table") table: string, @Token() token): Promise<BaseCodeTable[]> {
    this.logger.debug("in case management: " + JSON.stringify(table));
    if (!AvailableCodeTables.includes(table)) {
      throw new NotFoundException();
    }

    const result = await this.service.getCodeTableByName(table, token);
    return result;
  }
}
