export interface ComplaintUpdateDto {
  sequenceId: number;
  description?: string;
  updatedAt?: string;
  updateOn: string;
  updateTime: Date;
  location?: ComplaintUpdateLocation;
  caller?: ComplaintUpdateCaller;
  referral?: ComplaintReferralDetail;
  actionTaken?: ComplaintActionTakenUpdate;
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
    appUserGuid: string;
    lastName: string;
    firstName: string;
  };
  referralReason: string;
}

export interface ComplaintActionTakenUpdate {
  actionDetailsTxt: string;
  loggedByTxt: string;
  actionLogged: string;
}

export enum ComplaintUpdateType {
  UPDATE = "UPDATE",
  REFERRAL = "REFERRAL",
  ACTIONTAKEN = "ACTIONTAKEN",
}
