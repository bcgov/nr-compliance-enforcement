import { Inject, Injectable, Logger } from "@nestjs/common";
import { CdogsService } from "../../external_api/cdogs/cdogs.service";
import { ComplaintService } from "../complaint/complaint.service";
import { COMPLAINT_TYPE } from "../../types/models/complaints/complaint-type";
import { Attachment, AttachmentType } from "src/types/models/general/attachment";

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  @Inject(CdogsService)
  private readonly cdogs: CdogsService;

  @Inject(ComplaintService)
  private readonly ceds: ComplaintService;

  exportComplaint = async (id: string, type: COMPLAINT_TYPE, fileName: string, tz, attachments, token) => {
    const complaintsAttachments = attachments?.complaintsAttachments ?? [];
    const outcomeAttachments = attachments?.outcomeAttachments ?? [];

    const combinedAttachments: Attachment[] = [
      ...complaintsAttachments.map((item, index) => {
        return {
          type: AttachmentType.COMPLAINT_ATTACHMENT,
          user: item.createdBy,
          name: decodeURIComponent(item.name),
          date: item.createdAt,
          sequenceId: index,
        } as Attachment;
      }),
      ...outcomeAttachments.map((item, index) => {
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
      //-- get the complaint from the system, but do not include anything other
      //-- than the base complaint. no maps, no attachments, no outcome data
      const data = await this.ceds.getReportData(id, type, tz, token, combinedAttachments);

      //--
      return await this.cdogs.generate(fileName, data, type);
    } catch (error) {
      this.logger.error(`exception: unable to export document for complaint: ${id} - error: ${error}`);
      throw new Error(`exception: unable to export document for complaint: ${id} - error: ${error}`);
    }
  };
}
