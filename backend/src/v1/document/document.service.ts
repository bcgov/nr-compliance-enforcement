import { Inject, Injectable, Logger } from "@nestjs/common";
import { CdogsService } from "../../external_api/cdogs/cdogs.service";
import { ComplaintService } from "../complaint/complaint.service";
import { CaseFileService } from "../case_file/case_file.service";
import { COMPLAINT_TYPE } from "../../types/models/complaints/complaint-type";

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  @Inject(CdogsService)
  private readonly cdogs: CdogsService;

  @Inject(ComplaintService)
  private readonly ceds: ComplaintService;

  @Inject(CaseFileService)
  private readonly caseFile: CaseFileService;

  //--
  //-- using the cdogs api generate a new document from the specified
  //-- complaint-id and complaint type
  //--
  exportComplaint = async (id: string, type: COMPLAINT_TYPE, name: string, tz: string, token: string) => {
    try {
      //-- get the complaint from the system, but do not include anything other
      //-- than the base complaint. no maps, no attachments, no outcome data
      const complaintData = await this.ceds.getReportData(id, type, tz);
      //-- Get the Outcome Data
      const outcomeData = await this.caseFile.find(id, token);
      //create a new object, in the templates all complaint stuff will be accessed via complaint, outcome via outcome
      const data = { complaint: { ...complaintData }, outcome: { ...outcomeData } };

      //--
      return await this.cdogs.generate(name, data, type);
    } catch (error) {
      this.logger.error(`exception: unable to export document for complaint: ${id} - error: ${error}`);
      throw new Error(`exception: unable to export document for complaint: ${id} - error: ${error}`);
    }
  };
}
