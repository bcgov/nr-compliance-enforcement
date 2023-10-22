import { HwcrComplaint } from "./hwcr-complaint";

export interface HwcrComplaintsState {
  hwcrComplaints: HwcrComplaint[];
  complaint: any;
}

export interface HwcrComplaintRowState {
  hwcrComplaint: HwcrComplaint;
}
