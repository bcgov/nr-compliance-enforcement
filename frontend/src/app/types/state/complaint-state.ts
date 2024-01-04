import { AllegationComplaint } from "../complaints/allegation-complaint";
import { HwcrComplaint } from "../complaints/hwcr-complaint";
import { Feature } from "../maps/bcGeocoderType";
import { ZoneAtAGlanceState } from "./zone-at-a-glance-state";

import { WildlifeComplaint as WildlifeComplaintDto } from "../app/complaints/wildlife-complaint";
import { AllegationComplaint as AllegationComplaintDto } from "../app/complaints/allegation-complaint";

export interface ComplaintState {
  complaintItems: ComplaintCollection;
  totalCount: number;
  complaint: HwcrComplaint | AllegationComplaint | undefined | null;
  zoneAtGlance: ZoneAtAGlanceState;
  complaintLocation: Feature | null;
  mappedItems: MappedComplaintsState;
  data: WildlifeComplaintDto | AllegationComplaintDto | null
}

export interface ComplaintCollection {
  wildlife: Array<WildlifeComplaintDto>;
  allegations: Array<AllegationComplaintDto>;
}

export interface MappedComplaintsState {
  items: Array<AllegationComplaintDto> | Array<WildlifeComplaintDto>;
  unmapped: number;
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface MarkerCluster {
  coordinates: Array<Coordinate>;
}
