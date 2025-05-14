export interface ComplaintHeader {
  loggedDate: string;
  createdBy: string;
  lastUpdated: string;
  status: string;
  natureOfComplaint?: string;
  violationType?: string;
  violationTypeCode?: string;
  species?: string;
  statusCode: string;
  natureOfComplaintCode?: string;
  speciesCode?: string;
  zone?: string;
  complaintAgency?: string;
  officerAssigned: string;
  personGuid: string;
  firstName?: string;
  lastName?: string;
  girType?: string;
  girTypeCode?: string;
  parkAreaGuids?: string[];
}
