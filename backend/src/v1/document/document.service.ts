import { Inject, Injectable } from "@nestjs/common";
import { CdogsService } from "src/external_api/cdogs/cdogs.service";
import { ComplaintService } from "../complaint/complaint.service";
import { COMPLAINT_TYPE } from "src/types/models/complaints/complaint-type";
import { ComplaintDto } from "src/types/models/complaints/complaint";
import { AllegationComplaintDto } from "src/types/models/complaints/allegation-complaint";
import { WildlifeComplaintDto } from "src/types/models/complaints/wildlife-complaint";
import { formatDateTime } from "src/common/methods";

@Injectable()
export class DocumentService {
  @Inject(CdogsService)
  private readonly cdogs: CdogsService;

  @Inject(ComplaintService)
  private readonly ceds: ComplaintService;

  //--
  //-- using the cdogs api generate a new document from the specified
  //-- complaint-id and complaint type
  //--
  exportComplaint = async (id: string, type: COMPLAINT_TYPE): Promise<any> => {
    const _formatData = (data: ComplaintDto | WildlifeComplaintDto | AllegationComplaintDto, type: string) => {
      const {
        id,
        reportedOn,
        updatedOn,
        createdBy,
        delegates,
        status,
        incidentDateTime,
        locationSummary,
        location,
        organization,
        locationDetail,
        details,
      } = data;

      const { coordinates } = location;
      const { area, zone, officeLocation, region } = organization;

      //-- caller details
      const { name, address, email, phone1, phone2, phone3, reportedBy } = data;

      //-- hwcr
      const { natureOfComplaint, species, attractants } = data as WildlifeComplaintDto;

      //-- convert the officer from guid to name

      let result = {
        id,
        reportedOn: formatDateTime(reportedOn.toDateString()),
        updatedOn: formatDateTime(updatedOn.toDateString()),
        createdBy,
        officerAssigned: "pending",
        status,
        incidentDateTime: formatDateTime(incidentDateTime.toDateString()),
        location: locationSummary,
        latitude: coordinates ? coordinates[0] : "",
        longitude: coordinates ? coordinates[1] : "",
        community: area, //--lookup
        office: officeLocation, //-- lookup
        zone, //-- lookup
        region, //-- lookup
        locationDescription: locationDetail,
        description: details,

        //-- hwcr
        natureOfComplaint, //-- lookup
        species, //--lookup
        attractants, //-- lookup convert list to string

        //-- ers

        //-- caller information
        name,
        phone1,
        phone2,
        phone3,
        email,
        address,
        reportedBy, //-- lookup
      };

      return result;
    };

    try {
      //-- get the complaint from the system, but do not include anything other
      //-- than the base complaint. no maps, no attachments, no outcome data
      const data = await this.ceds.findById(id, type);

      //-- format the data so that it can be used in the cdogs service
      const formated = _formatData(data, type);

      const documentName = `${type}-${data.id}-${new Date()}.pdf`;
      const doc = await this.cdogs.generate(documentName, formated, type);
      doc.request.sen;
      return;
    } catch (error) {
      console.log("exception: export document", error);
      throw new Error(`exception: unable to export document for complaint: ${id} - error: ${error}`);
    }
  };
}
