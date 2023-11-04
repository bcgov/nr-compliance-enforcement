import { Controller, Get, NotFoundException, Param, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CodeTableService } from "./code-table.service";
import { Role } from '../../enum/role.enum';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtRoleGuard } from '../../auth/jwtrole.guard';

import CodeTable, { AvailableCodeTables } from "../../types/models/code-tables"

@UseGuards(JwtRoleGuard)
@ApiTags("code-table")
@Controller({ path: "code-table", version: "1" })
export class CodeTableController {
  constructor(private readonly service: CodeTableService) {}

  @Get(":table")
  @Roles(Role.COS_OFFICER)
  async getCodeTableByName(
    @Param("table") table: string
  ): Promise<CodeTable[]> {
    if(!AvailableCodeTables.includes(table)){ 
      throw new NotFoundException();
    }

    const result = await this.service.getCodeTableByName(table);
    return result;
  }
}
