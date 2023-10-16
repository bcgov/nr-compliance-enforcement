import { AllegationComplaint } from "../complaints/allegation-complaint";
import { HwcrComplaint } from "../complaints/hwcr-complaint";

export interface ComplaintLocationsState {
  complaintItemsOnMap: ComplaintLocationsCollection;
}

export interface ComplaintLocationsCollection {
  wildlife: Array<HwcrComplaint> | null;
  allegations: Array<AllegationComplaint>;
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface MarkerCluster {
  coordinates: Array<Coordinate>;
}
