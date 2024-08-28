export interface Decision {
  schedule: string;
  sector: string;
  discharge: string;
  nonCompliance: string;
  rationale: string;
  assignedTo: string;
  actionTaken: string;
  actionTakenDate: Date | null;
}
