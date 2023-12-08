export interface ComplaintQueryParams {
  sortColumn?: string; //-- to be removed
  sortOrder?: string;  //-- to be removed

  sortBy?: string;
  orderBy?: string;

  region?: string;
  zone?: string;
  community?: string;
  officerAssigned?: string;
  natureOfComplaint?: string;
  speciesCode?: string;
  incidentReportedStart?: Date;
  incidentReportedEnd?: Date;
  violationCode?: string;
  status?: string;
  query?: string;
}
