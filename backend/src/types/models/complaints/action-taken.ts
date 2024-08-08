export interface ActionTakenDto {
  actionTakenGuid: string;
  complaintIdentifier?: string;
  complaintUpdateGuid?: string;
  actionDetailsTxt?: string;
  loggedByTxt?: string;
  actionUtcTimestamp?: Date;
}
