export interface ComplaintUpdateDto {
  sequenceId: number;
  description?: string;
  updatedOn?: string;
  updatedAt?: string;
  updateOn: string;
  location?: ComplaintUpdateLocation;
  caller?: ComplaintUpdateCaller;
  referral?: ComplaintReferralDetail;
  updateType: ComplaintUpdateType;
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

export interface ComplaintReferralDetail {
  previousAgency: string;
  newAgency: string;
  referredBy: {
    officerGuid: string;
    lastName: string;
    firstName: string;
  };
  referralReason: string;
}

export enum ComplaintUpdateType {
  UPDATE = "UPDATE",
  REFERRAL = "REFERRAL",
}
