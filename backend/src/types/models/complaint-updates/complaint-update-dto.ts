export interface ComplaintUpdateDto {
  description: string;
  updatedOn: string;
  updatedAt: string;
  location: ComplaintUpdateLocation;
}

export interface ComplaintUpdateLocation {
  summary: string;
  details: string;
  latitude: number;
  longitude: number;
}
