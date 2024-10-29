import { Feature } from "../maps/bcGeocoderType";
import { ZoneAtAGlanceState } from "./zone-at-a-glance-state";

import { WildlifeComplaint as WildlifeComplaintDto } from "../app/complaints/wildlife-complaint";
import { AllegationComplaint as AllegationComplaintDto } from "../app/complaints/allegation-complaint";
import { GeneralIncidentComplaint as GeneralInformationComplaintDto } from "../app/complaints/general-complaint";
import { WebEOCComplaintUpdateDTO } from "../app/complaints/webeoc-complaint-update";
import { ActionTaken } from "../app/complaints/action-taken";
import { ComplaintFilters } from "@apptypes/complaints/complaint-filters";

export interface ComplaintState {
  complaintSearchParameters: ComplaintFilters;
  complaintItems: ComplaintCollection;
  totalCount: number;
  complaint: WildlifeComplaintDto | AllegationComplaintDto | GeneralInformationComplaintDto | null;
  zoneAtGlance: ZoneAtAGlanceState;
  complaintLocation: Feature | null;
  mappedItems: MappedComplaintsState;
  webeocUpdates: WebEOCComplaintUpdateDTO[];
  actions: ActionTaken[];
  webeocChangeCount: number;
  linkedComplaints: [];
}

export interface ComplaintCollection {
  wildlife: Array<WildlifeComplaintDto>;
  allegations: Array<AllegationComplaintDto>;
  general: Array<GeneralInformationComplaintDto>;
}

export interface MappedComplaintsState {
  items: Array<AllegationComplaintDto> | Array<WildlifeComplaintDto> | Array<GeneralInformationComplaintDto>;
  unmapped: number;
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface MarkerCluster {
  coordinates: Array<Coordinate>;
}
