export interface ComplaintFilterParameters {
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
  girTypeCode?: string;
  complaintMethod?: string;
}
