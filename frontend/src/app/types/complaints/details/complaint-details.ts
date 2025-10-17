import { ComplaintMethodReceivedType } from "@apptypes/app/code-tables/complaint-method-received-type";
import { ComplaintDetailsAttractant } from "./complaint-attactant";

export interface ComplaintDetails {
  details?: string;
  location?: string;
  locationDescription?: string;
  incidentDateTime?: string | Date;
  coordinates?: number[] | string[];
  area?: string;
  areaCode?: string;
  region?: string;
  regionCode?: string;
  zone?: string;
  zone_code?: string;
  office?: string;
  officeCode?: string;
  attractants?: Array<ComplaintDetailsAttractant>;
  violationInProgress?: boolean;
  violationObserved?: boolean;
  girType?: string;
  girTypeCode?: string;
  complaintMethodReceivedCode?: ComplaintMethodReceivedType;
  ownedBy?: string;
  parkGuid?: string;
  issueType?: string;
}
