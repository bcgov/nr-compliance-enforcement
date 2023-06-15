import { ComplaintDetailsAttractant } from "./complaint-attactant";

export interface ComplaintDetails {
  details?: string | undefined;
  location?: string | undefined;
  locationDescription?: string | undefined;
  incidentDateTime?: string | undefined
  coordinates?: number[] | string[] | undefined;
  area?: string | undefined;
  region?: string | undefined;
  zone?: string | undefined;
  office?: string | undefined;
  attractants?: Array<ComplaintDetailsAttractant> 
}
