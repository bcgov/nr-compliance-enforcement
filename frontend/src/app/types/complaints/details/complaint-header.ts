export interface ComplaintHeader {
  loggedDate: string;
  createdBy: string;
  lastUpdated: string;
  officerAssigned: string;
  status: string;
  natureOfComplaint?: string;
  violationType?: string;
  species?: string;
}
