import { Feature } from "../maps/bcGeocoderType";
import { ZoneAtAGlanceState } from "./zone-at-a-glance-state";

import { WildlifeComplaint as WildlifeComplaintDto } from "../app/complaints/wildlife-complaint";
import { AllegationComplaint as AllegationComplaintDto } from "../app/complaints/allegation-complaint";
import { WebEOCComplaintUpdateDTO } from "../app/complaints/webeoc-complaint-update";

export interface ComplaintState {
  complaintItems: ComplaintCollection;
  totalCount: number;
  complaint: WildlifeComplaintDto | AllegationComplaintDto | null;
  zoneAtGlance: ZoneAtAGlanceState;
  complaintLocation: Feature | null;
  mappedItems: MappedComplaintsState;
  webeocUpdates: WebEOCComplaintUpdateDTO[];
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
