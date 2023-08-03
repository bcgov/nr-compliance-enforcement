export interface ComplaintQueryParams {
  sortColumn: string;
  sortOrder: string;
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
}
