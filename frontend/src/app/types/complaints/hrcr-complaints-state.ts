import { HwcrComplaint } from "./hwcr-complaint";

export interface HwcrComplaintsState {
    hwcrComplaints: HwcrComplaint[];
}

export interface HwcrComplaintRowState {
  hwcrComplaint: HwcrComplaint;
}