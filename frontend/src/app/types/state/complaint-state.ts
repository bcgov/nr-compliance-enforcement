import { AllegationComplaint } from "../complaints/allegation-complaint";
import { HwcrComplaint } from "../complaints/hwcr-complaint";
import { ZoneAtAGlanceState } from "./zone-at-a-glance-state";

export interface ComplaintState { 
    complaints: HwcrComplaint[] | AllegationComplaint[] | undefined;
    complaint: HwcrComplaint | AllegationComplaint | undefined | null;
    zoneAtGlance: ZoneAtAGlanceState;
}