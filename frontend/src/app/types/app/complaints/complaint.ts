import { Delegate } from "../people/delegate";

export interface Complaint {
  id: string;
  details: string;
  name: string;
  address: string;
  email: string;
  phone1: string;
  phone2: string;
  phone3: string;
  location: { type: string; coordinates: Array<number> };
  locationSummary: string;
  locationDetail: string;
  status: string;
  reportedBy?: string;
  ownedBy: string;
  reportedByOther: string;
  incidentDateTime?: Date;
  reportedOn: Date;
  updatedOn: Date;
  createdBy: string;
  updatedBy: string;
  organization: {
    area: string;
    areaName?: string;
    zone: string;
    region: string;
    officeLocation?: string;
  };
  delegates: Array<Delegate>;
  webeocId: string;
  referenceNumber: string;
  complaintMethodReceivedCode: string;
  isPrivacyRequested: string;
}
