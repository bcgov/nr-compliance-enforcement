export interface Decision {
  id?: string;
  schedule: string;
  sector: string;
  discharge: string;
  nonCompliance?: string;
  rationale: string;
  inspectionNumber?: string;
  leadAgency?: string;
  assignedTo: string;
  actionTaken: string;
  actionTakenDate: Date | null;
}
