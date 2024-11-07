import { Controller, Get, Logger, Param, Query, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { DocumentService } from "./document.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { Role } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Token } from "../../auth/decorators/token.decorator";
import { COMPLAINT_TYPE } from "../../types/models/complaints/complaint-type";
import { format } from "date-fns";
import { escape } from "escape-html";

@UseGuards(JwtRoleGuard)
@ApiTags("document")
@Controller({ path: "document", version: "1" })
export class DocumentController {
  private readonly logger = new Logger(DocumentController.name);

  constructor(private readonly service: DocumentService) {}

  @Get("/export-complaint/:type")
  @Roles(Role.COS_OFFICER, Role.CEEB)
  async exportComplaint(
    @Param("type") type: COMPLAINT_TYPE,
    @Query("id") id: string,
    @Query("tz") tz: string,
    @Token() token,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const fileName = `Complaint-${id}-${type}-${format(new Date(), "yyyy-MM-dd")}.pdf`;
      const response = await this.service.exportComplaint(id, type, fileName, tz, token);

      if (!response || !response.data) {
        throw Error(`exception: unable to export document for complaint: ${id}`);
      }

      const buffer = Buffer.from(response.data, "binary");

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${fileName}`,
        "Content-Length": buffer.length,
      });

      res.end(buffer);
    } catch (error) {
      this.logger.error(`exception: unable to export document for complaint: ${id} - error: ${error}`);
      res.status(500).send(`exception: unable to export document for complaint: ${escape(id)}`);
    }
  }
}
