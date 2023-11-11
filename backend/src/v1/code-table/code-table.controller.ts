import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CodeTableService } from "./code-table.service";
import { Role } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";

import BaseCodeTable, {
  AvailableAgencies,
  AvailableCodeTables,
  OrganizationCodeTable,
  Sector,
} from "../../types/models/code-tables";

@UseGuards(JwtRoleGuard)
@ApiTags("code-table")
@Controller({ path: "code-table", version: "1" })
export class CodeTableController {
  constructor(private readonly service: CodeTableService) {}

  @Get(":table")
  @Roles(Role.COS_OFFICER)
  async getCodeTableByName(
    @Param("table") table: string
  ): Promise<BaseCodeTable[]> {
    if (!AvailableCodeTables.includes(table)) {
      throw new NotFoundException();
    }

    const result = await this.service.getCodeTableByName(table);
    return result;
  }

  @Get("/organization-by-agency/:agency")
  @Roles(Role.COS_OFFICER)
  async getOrganizationsByAgency(
    @Param("agency") agency: string
  ): Promise<OrganizationCodeTable[]> {
    if (!AvailableAgencies.includes(agency)) {
      throw new NotFoundException();
    }

    const result = await this.service.getOrganizationsByAgency(agency);
    return result;
  }

  @Get("/regions-by-agency/:agency")
  @Roles(Role.COS_OFFICER)
  async getRegionsByAgency(@Param("agency") agency: string): Promise<Sector[]> {
    if (!AvailableAgencies.includes(agency)) {
      throw new NotFoundException();
    }

    const result = await this.service.getRegionsByAgency(agency);
    return result;
  }

  @Get("/zones-by-agency/:agency")
  @Roles(Role.COS_OFFICER)
  async getZonesByAgency(@Param("agency") agency: string): Promise<Sector[]> {
    if (!AvailableAgencies.includes(agency)) {
      throw new NotFoundException();
    }

    const result = await this.service.getZonesByAgency(agency);
    return result;
  }

  @Get("/communities-by-agency/:agency")
  @Roles(Role.COS_OFFICER)
  async getCommunitiesByAgency(
    @Param("agency") agency: string
  ): Promise<Sector[]> {
    if (!AvailableAgencies.includes(agency)) {
      throw new NotFoundException();
    }

    const result = await this.service.getCommunitiesByAgency(agency);
    return result;
  }
}
