export interface ComplaintUpdateDto {
  sequenceId: number;
  description: string;
  updatedOn: string;
  updatedAt: string;
  updateOn: string;
  location: ComplaintUpdateLocation;
  caller: ComplaintUpdateCaller;
}

export interface ComplaintUpdateLocation {
  summary: string;
  details: string;
  latitude: number;
  longitude: number;
}

export interface ComplaintUpdateCaller {
  name: string;
  primaryPhone: string;
  alternativePhone1: string;
  alternativePhone2: string;
  address: string;
  email: string;
  organizationReportingComplaint: string;
}
