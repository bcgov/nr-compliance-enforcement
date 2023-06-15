import { HwcrComplaint } from "./hwcr-complaint";

export interface HwcrComplaintState {
    hwcrComplaints: HwcrComplaint[];
    selectedComplaintIdentifier: string;
    
  }