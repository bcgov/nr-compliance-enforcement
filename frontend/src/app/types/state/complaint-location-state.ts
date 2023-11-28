import { MapReturn } from "../complaints/map-return";

export interface ComplaintLocationsState {
  complaintItemsOnMap: ComplaintLocationsCollection;
}

export interface ComplaintLocationsCollection {
  wildlife: MapReturn;
  allegations: MapReturn;
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface MarkerCluster {
  coordinates: Array<Coordinate>;
}
