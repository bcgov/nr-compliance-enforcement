export interface MapElement {
  objectType: MapObjectType;
  name: string;
  description: string;
  isActive: boolean;
  location: {
    lat: number;
    lng: number;
  };
}

export enum MapObjectType {
  Complaint = "Complaint",
  Equipment = "Equipment",
  Investigation = "Investigation",
  Inspection = "Inspection",
}
