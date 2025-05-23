import { Body, Controller, Logger, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { DocumentService } from "./document.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Token } from "../../auth/decorators/token.decorator";
import { escape } from "escape-html";
import { ExportComplaintParameters } from "../../types/models/complaints/export-complaint-parameters";

@UseGuards(JwtRoleGuard)
@ApiTags("document")
@Controller({ path: "document", version: "1" })
export class DocumentController {
  private readonly logger = new Logger(DocumentController.name);

  constructor(private readonly service: DocumentService) {}

  @Post("/export-complaint")
  @Roles(coreRoles)
  async exportComplaint(@Body() model: ExportComplaintParameters, @Token() token, @Res() res: Response): Promise<void> {
    const id: string = model?.id ?? "unknown";
    const { type, fileName, tz, attachments } = model;
    try {
      const response = await this.service.exportComplaint(id, type, fileName, tz, attachments, token);

      if (!response || !response.data) {
        throw Error(`exception: unable to export document for complaint: ${id}`);
      }

      const buffer = Buffer.from(response.data, "binary");

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${model.fileName}`,
        "Content-Length": buffer.length,
      });

      res.end(buffer);
    } catch (error) {
      this.logger.error(`exception: unable to export document for complaint: ${id} - error: ${error}`);
      res.status(500).send(`exception: unable to export document for complaint: ${escape(id)}`);
    }
  }
}
