import { DelegateDto } from "../people/delegate";

export interface ComplaintDto {
  id: string;
  details: string;
  name: string;
  address: string;
  email: string;
  phone1: string;
  phone2: string;
  phone3: string;
  // contacts: Array<ContactTypeDto> //-- for future use
  location: { type: string; coordinates: Array<number> };
  locationSummary: string;
  locationDetail: string;
  status: string;
  reportedBy: string;
  ownedBy: string;
  reportedByOther: string;
  incidentDateTime: Date;
  reportedOn: Date;
  updatedOn: Date;
  createdBy: string;
  updatedBy: string;
  organization: {
    area: string;
    zone: string;
    region: string;
    officeLocation?: string;
  };
  delegates: Array<DelegateDto>;
  webeocId: string;
  complaintMethodReceivedCode: string;
  isPrivacyRequested: string;
}
