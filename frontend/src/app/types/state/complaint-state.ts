import { AllegationComplaint } from "../complaints/allegation-complaint";
import { HwcrComplaint } from "../complaints/hwcr-complaint";

export interface ComplaintState { 
    complaints: HwcrComplaint[] | AllegationComplaint[] | undefined
    complaint: HwcrComplaint | AllegationComplaint | undefined | null;
}