export interface SearchPayload {
  sortColumn: string;
  sortOrder: string;
  community?: string;
  zone?: string;
  region?: string;
  officerAssigned?: string;
  natureOfComplaint?: string;
  speciesCode?: string;
  violationCode?: string;
  incidentReportedStart?: Date;
  incidentReportedEnd?: Date;
  status?: string;
  page?: number;
  pageSize?: number;
  query?: string;
}
