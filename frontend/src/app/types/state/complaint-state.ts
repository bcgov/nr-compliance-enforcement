import { WildlifeComplaint } from "../app/complaints/wildlife-complaint";
import { AllegationComplaint as AllegationComplaintModel } from "../app/complaints/allegation-complaint";
import { AllegationComplaint } from "../complaints/allegation-complaint";
import { HwcrComplaint } from "../complaints/hwcr-complaint";
import { Feature } from "../maps/bcGeocoderType";
import { ZoneAtAGlanceState } from "./zone-at-a-glance-state";

export interface ComplaintState {
  complaintItems: ComplaintCollection;
  totalCount: number;
  complaint: HwcrComplaint | AllegationComplaint | undefined | null;
  zoneAtGlance: ZoneAtAGlanceState;
  complaintLocation: Feature | null;
  mappedItems: MappedComplaintsState
}

export interface ComplaintCollection {
  wildlife: Array<WildlifeComplaint>;
  allegations: Array<AllegationComplaintModel>;
}

export interface MappedComplaintsState {
  items: Array<AllegationComplaintModel> | Array<WildlifeComplaint>;
  unmapped: number;
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface MarkerCluster {
  coordinates: Array<Coordinate>;
}
