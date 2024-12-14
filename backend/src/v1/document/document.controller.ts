import { Body, Controller, Logger, Post, Res, UseGuards } from "@nestjs/common";
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
import { ExportComplaintParameters } from "src/types/models/complaints/export-complaint-parameters";
import { Attachment, AttachmentType } from "src/types/models/general/attachment";

@UseGuards(JwtRoleGuard)
@ApiTags("document")
@Controller({ path: "document", version: "1" })
export class DocumentController {
  private readonly logger = new Logger(DocumentController.name);

  constructor(private readonly service: DocumentService) {}

  @Post("/export-complaint")
  @Roles(Role.COS_OFFICER, Role.CEEB)
  async exportComplaint(@Body() model: ExportComplaintParameters, @Token() token, @Res() res: Response): Promise<void> {
    const id: string = model?.id ?? "unknown";

    const attachments: Attachment[] = [
      ...model.attachments?.complaintsAttachments?.map((item, index) => {
        return {
          type: AttachmentType.COMPLAINT_ATTACHMENT,
          user: item.createdBy,
          name: decodeURIComponent(item.name),
          date: item.createdAt,
          sequenceId: index,
        } as Attachment;
      }),
      ...model.attachments?.outcomeAttachments?.map((item, index) => {
        return {
          type: AttachmentType.OUTCOME_ATTACHMENT,
          date: item.createdAt,
          name: decodeURIComponent(item.name),
          user: item.createdBy,
          sequenceId: index,
        } as Attachment;
      }),
    ];

    try {
      const fileName = `Complaint-${id}-${model.type}-${format(new Date(), "yyyy-MM-dd")}.pdf`;
      const response = await this.service.exportComplaint(id, model.type, fileName, model.tz, token, attachments);

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
