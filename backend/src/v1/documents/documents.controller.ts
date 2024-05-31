import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { JwtRoleGuard } from "src/auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { Role } from "src/enum/role.enum";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Token } from "src/auth/decorators/token.decorator";

@UseGuards(JwtRoleGuard)
@ApiTags("documents")
@Controller({ path: "documents", version: "1" })
export class DocumentsController {
  constructor(private readonly service: DocumentsService) {}

  @Get("/export-complaint/:type")
  @Roles(Role.COS_OFFICER)
  async exportComplaint(@Param("type") type: string, @Token() token): Promise<any> {
    return Promise.resolve(type);
  }
}
