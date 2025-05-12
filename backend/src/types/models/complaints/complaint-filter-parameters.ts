export interface ComplaintFilterParameters {
  community?: string;
  zone?: string;
  region?: string;
  park?: string;
  area?: string;
  officerAssigned?: string;
  natureOfComplaint?: string;
  speciesCode?: string;
  violationCode?: string;
  incidentReportedStart?: Date;
  incidentReportedEnd?: Date;
  status?: string;
  girTypeCode?: string;
  complaintMethod?: string;
  actionTaken?: string;
  outcomeAnimal?: string;
  outcomeAnimalStartDate?: Date;
  outcomeAnimalEndDate?: Date;
  outcomeActionedBy?: string;
  equipmentStatus?: string;
  equipmentTypes?: string[];
}
