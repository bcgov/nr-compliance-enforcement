export interface ComplaintUpdateDto {
  sequenceId: number;
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
