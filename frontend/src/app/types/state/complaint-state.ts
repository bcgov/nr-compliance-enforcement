import { AllegationComplaint } from "../complaints/allegation-complaint";
import { HwcrComplaint } from "../complaints/hwcr-complaint";
import { Feature } from "../maps/bcGeocoderType";
import { ZoneAtAGlanceState } from "./zone-at-a-glance-state";

export interface ComplaintState {
  complaintItems: ComplaintCollection;
  complaint: HwcrComplaint | AllegationComplaint | undefined | null;
  zoneAtGlance: ZoneAtAGlanceState;
  complaintLocation: Feature | null;
}

export interface ComplaintCollection {
  wildlife: Array<HwcrComplaint>;
  allegations: Array<AllegationComplaint>;
}
