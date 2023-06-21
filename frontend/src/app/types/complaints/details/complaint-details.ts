import { ComplaintDetailsAttractant } from "./complaint-attactant";

export interface ComplaintDetails {
  details?: string;
  location?: string;
  locationDescription?: string;
  incidentDateTime?: string;
  coordinates?: number[] | string[];
  area?: string;
  region?: string;
  zone?: string;
  office?: string;
  attractants?: Array<ComplaintDetailsAttractant>;
  violationInProgress?: boolean;
  violationObserved?: boolean;
}
