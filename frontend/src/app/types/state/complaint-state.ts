import { AllegationComplaint } from "../complaints/allegation-complaint";
import { HwcrComplaint } from "../complaints/hwcr-complaint";
import { ZoneAtAGlanceState } from "./zone-at-a-glance-state";

export interface ComplaintState {
  complaintItems: ComplaintCollection;
  complaint: HwcrComplaint | AllegationComplaint | undefined | null;
  zoneAtGlance: ZoneAtAGlanceState;
}

export interface ComplaintCollection {
  wildlife: Array<HwcrComplaint>;
  allegations: Array<AllegationComplaint>;
}
