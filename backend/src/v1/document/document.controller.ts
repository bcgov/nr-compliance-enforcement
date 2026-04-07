import { Body, Controller, Logger, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { DocumentService } from "./document.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Token } from "../../auth/decorators/token.decorator";
import { escape } from "escape-html";
import { ExportComplaintParameters } from "../../types/models/reports/export-complaint-parameters";
import { ExportTaskParameters } from "src/types/models/reports/export-task-parameters";

@UseGuards(JwtRoleGuard)
@ApiTags("document")
@Controller({ path: "document", version: "1" })
export class DocumentController {
  private readonly logger = new Logger(DocumentController.name);

  constructor(private readonly service: DocumentService) {}

  // POST due to the fact that we are passing attachment information from the frontend rather than querying it from the backend
  @Post("/export-complaint")
  @Roles(coreRoles)
  async exportComplaint(@Body() model: ExportComplaintParameters, @Token() token, @Res() res: Response): Promise<void> {
    const id: string = model?.id ?? "unknown";
    const { type, fileName, tz, attachments } = model;
    try {
      const response = await this.service.exportComplaint(id, type, fileName, tz, attachments, token);

      if (!response?.data) {
        throw new Error(`exception: unable to export document for complaint: ${id}`);
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
      res.status(500).send(`exception: unable to export document for complaint: ${id}`);
    }
  }

  // POST due to the fact that we are passing attachment information from the frontend rather than querying it from the backend
  @Post("/export-task")
  @Roles(coreRoles)
  async exportTask(@Body() model: ExportTaskParameters, @Token() token, @Res() res: Response): Promise<void> {
    const { taskId, fileName, tz } = model;
    try {
      const response = await this.service.exportTask(taskId, fileName, tz, token);

      if (!response?.data) {
        throw new Error(`exception: unable to generate task document: ${taskId}`);
      }

      const buffer = Buffer.from(response.data, "binary");

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${fileName}`,
        "Content-Length": buffer.length,
      });

      res.end(buffer);
    } catch (error) {
      this.logger.error(`exception: unable to generate task document: ${taskId} - error: ${error}`);
      res.status(500).send(`exception: unable to generate task document: ${taskId}`);
    }
  }
}
