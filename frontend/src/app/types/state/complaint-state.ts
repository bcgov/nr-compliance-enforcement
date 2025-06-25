import { Feature } from "@apptypes/maps/bcGeocoderType";
import { ZoneAtAGlanceState } from "./zone-at-a-glance-state";

import { WildlifeComplaint } from "@apptypes/app/complaints/wildlife-complaint";
import { AllegationComplaint } from "@apptypes/app/complaints/allegation-complaint";
import { GeneralIncidentComplaint } from "@apptypes/app/complaints/general-complaint";
import { Complaint } from "@apptypes/app/complaints/complaint";
import { WebEOCComplaintUpdateDTO } from "@apptypes/app/complaints/webeoc-complaint-update";
import { ActionTaken } from "@apptypes/app/complaints/action-taken";
import { ComplaintFilters } from "@apptypes/complaints/complaint-filters";
import { ComplaintReferral } from "@/app/types/app/complaints/complaint-referral";
import { Collaborator } from "@/app/types/app/complaints/collaborator";

export interface ComplaintState {
  complaintSearchParameters: ComplaintFilters;
  complaintItems: ComplaintCollection;
  totalCount: number;
  complaint: WildlifeComplaint | AllegationComplaint | GeneralIncidentComplaint | Complaint | null;
  complaintCollaborators: Collaborator[];
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
  wildlife: Array<WildlifeComplaint>;
  allegations: Array<AllegationComplaint>;
  general: Array<GeneralIncidentComplaint>;
  sector: Array<Complaint>;
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
