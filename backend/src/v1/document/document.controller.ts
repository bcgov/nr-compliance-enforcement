import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { DocumentService } from "./document.service";
import { JwtRoleGuard } from "src/auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { Role } from "src/enum/role.enum";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Token } from "src/auth/decorators/token.decorator";

@UseGuards(JwtRoleGuard)
@ApiTags("document")
@Controller({ path: "document", version: "1" })
export class DocumentController {
  constructor(private readonly service: DocumentService) {}

  @Get("/export-complaint/:type")
  @Roles(Role.COS_OFFICER)
  async exportComplaint(@Param("type") type: string, @Query("id") id: string, @Token() token): Promise<any> {
    return Promise.resolve({ type, id });
  }
}
