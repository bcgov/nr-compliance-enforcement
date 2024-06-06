import { Controller, Get, Header, Param, Query, StreamableFile, UseGuards } from "@nestjs/common";
import { DocumentService } from "./document.service";
import { JwtRoleGuard } from "src/auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { Role } from "src/enum/role.enum";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Token } from "src/auth/decorators/token.decorator";
import { COMPLAINT_TYPE } from "src/types/models/complaints/complaint-type";
import { createReadStream } from "fs";

@UseGuards(JwtRoleGuard)
@ApiTags("document")
@Controller({ path: "document", version: "1" })
export class DocumentController {
  constructor(private readonly service: DocumentService) {}

  //--
  //-- exports a complaint to pdf
  //--
  // @Get("/export-complaint/:type")
  // @Roles(Role.COS_OFFICER)
  // async exportComplaint(@Param("type") type: COMPLAINT_TYPE, @Query("id") id: string, @Token() token): Promise<any> {
  //   return this.service.exportComplaint(id, type);
  // }

  @Get("/export-complaint/:type")
  @Roles(Role.COS_OFFICER)
  @Header("Content-Type", "application/json")
  @Header("Content-Disposition", 'attachment; filename="package.json"')
  async exportComplaint(
    @Param("type") type: COMPLAINT_TYPE,
    @Query("id") id: string,
    @Token() token,
  ): Promise<StreamableFile> {
    const data = await this.service.exportComplaint(id, type);
    const file = createReadStream(data);
    return new StreamableFile(file);
  }
  // getStaticFile(): StreamableFile {
  //   const file = createReadStream(join(process.cwd(), 'package.json'));
  //   return new StreamableFile(file);
  // }
}
