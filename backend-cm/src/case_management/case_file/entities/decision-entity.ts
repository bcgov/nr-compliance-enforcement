export interface Decision {
  id?: string;
  schedule: string;
  scheduleLongDescription?: string;
  sector: string;
  sectorLongDescription?: string;
  discharge: string;
  dischargeLongDescription?: string;
  nonCompliance?: string;
  nonComplianceLongDescription?: string;
  ipmAuthCategory?: string;
  ipmAuthCategoryLongDescription?: string;
  rationale?: string;
  inspectionNumber?: string;
  leadAgency?: string;
  leadAgencyLongDescription?: string;
  assignedTo?: string;
  actionTaken?: string;
  actionTakenLongDescription?: string;
  actionTakenDate?: Date;
}
