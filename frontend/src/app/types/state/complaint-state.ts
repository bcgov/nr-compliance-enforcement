import { Feature } from "@apptypes/maps/bcGeocoderType";
import { ZoneAtAGlanceState } from "./zone-at-a-glance-state";

import { WildlifeComplaint as WildlifeComplaintDto } from "@apptypes/app/complaints/wildlife-complaint";
import { AllegationComplaint as AllegationComplaintDto } from "@apptypes/app/complaints/allegation-complaint";
import { GeneralIncidentComplaint as GeneralInformationComplaintDto } from "@apptypes/app/complaints/general-complaint";
import { WebEOCComplaintUpdateDTO } from "@apptypes/app/complaints/webeoc-complaint-update";
import { ActionTaken } from "@apptypes/app/complaints/action-taken";
import { ComplaintFilters } from "@apptypes/complaints/complaint-filters";
import { ComplaintReferral } from "@/app/types/app/complaints/complaint-referral";

export interface ComplaintState {
  complaintSearchParameters: ComplaintFilters;
  complaintItems: ComplaintCollection;
  totalCount: number;
  complaint: WildlifeComplaintDto | AllegationComplaintDto | GeneralInformationComplaintDto | null;
  zoneAtGlance: ZoneAtAGlanceState;
  complaintLocation: Feature | null;
  mappedComplaintsCount: MappedComplaintsCountState;
  webeocUpdates: WebEOCComplaintUpdateDTO[];
  actions: ActionTaken[];
  referrals: ComplaintReferral[];
  webeocChangeCount: number;
  linkedComplaints: [];
  complaintView: ComplaintView;
}

export interface ComplaintCollection {
  wildlife: Array<WildlifeComplaintDto>;
  allegations: Array<AllegationComplaintDto>;
  general: Array<GeneralInformationComplaintDto>;
}

export interface MappedComplaintsCountState {
  mapped: number;
  unmapped: number;
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface MarkerCluster {
  coordinates: Array<Coordinate>;
}

export interface ComplaintView {
  isReadOnly: boolean;
}
