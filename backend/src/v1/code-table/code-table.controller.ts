import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CodeTableService } from "./code-table.service";
import { CreateCodeTableDto } from "./dto/create-code-table.dto";
import { UpdateCodeTableDto } from "./dto/update-code-table.dto";
import { JwtRoleGuard } from "src/auth/jwtrole.guard";

@UseGuards(JwtRoleGuard)
@ApiTags("code-table")
@Controller({ path: "code-table", version: "1" })
export class CodeTableController {
  constructor(private readonly service: CodeTableService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
