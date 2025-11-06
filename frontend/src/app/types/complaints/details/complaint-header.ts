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
  appUserGuid: string;  // Renamed from personGuid
  firstName?: string;
  lastName?: string;
  girType?: string;
  girTypeCode?: string;
  parkAreaGuids?: string[];
  type: string;
}
