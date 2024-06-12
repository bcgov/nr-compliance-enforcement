import { Inject, Injectable, Logger } from "@nestjs/common";
import { CdogsService } from "../../external_api/cdogs/cdogs.service";
import { ComplaintService } from "../complaint/complaint.service";
import { COMPLAINT_TYPE } from "../../types/models/complaints/complaint-type";

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  @Inject(CdogsService)
  private readonly cdogs: CdogsService;

  @Inject(ComplaintService)
  private readonly ceds: ComplaintService;

  //--
  //-- using the cdogs api generate a new document from the specified
  //-- complaint-id and complaint type
  //--
  exportComplaint = async (id: string, type: COMPLAINT_TYPE, name: string) => {
    try {
      //-- get the complaint from the system, but do not include anything other
      //-- than the base complaint. no maps, no attachments, no outcome data
      const data = await this.ceds.getReportData(id, type);

      this.logger.debug(`COMPLAINT-DATA: ${JSON.stringify(data)}`);

      //--
      return await this.cdogs.generate(name, data, type);
    } catch (error) {
      this.logger.error(`exception: unable to export document for complaint: ${id} - error: ${error}`);
      throw new Error(`exception: unable to export document for complaint: ${id} - error: ${error}`);
    }
  };
}
