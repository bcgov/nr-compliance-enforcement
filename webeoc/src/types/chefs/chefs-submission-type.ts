import { Complaint } from "../complaint-type";

// Subset of the CHEFS readSubmission response used by NatSuite.
export interface ChefsSubmissionResponse {
  submission: {
    id: string;
    formVersionId: string;
    confirmationId: string;
    draft: boolean;
    submission: {
      data: ChefsSubmissionData;
    };
  };
}

export interface ChefsMapFeature {
  type: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ChefsMap {
  features: ChefsMapFeature[];
  selectedBaseLayer?: string;
}

// Raw form data from CHEFS: the Complaint fields plus CHEFS-only components that the transforms convert.
export interface ChefsSubmissionData extends Complaint {
  incidentLocation?: ChefsMap;
  cos_caller_name_first?: string;
  cos_caller_name_last?: string;
  witness_details?: string;
  transportation_details?: string;
  previously_reported_ind?: boolean;
  agency_reported_txt?: string;
  chefs_confirmation_id?: string;
}
