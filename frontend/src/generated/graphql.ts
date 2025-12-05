import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  JSON: { input: any; output: any; }
  JSONObject: { input: any; output: any; }
  Point: { input: any; output: any; }
};

export type AgeCode = {
  __typename?: 'AgeCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  ageCode?: Maybe<Scalars['String']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type AgencyCode = {
  __typename?: 'AgencyCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  agencyCode?: Maybe<Scalars['String']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  externalAgencyIndicator?: Maybe<Scalars['Boolean']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type AppUser = {
  __typename?: 'AppUser';
  agencyCode?: Maybe<Scalars['String']['output']>;
  appUserGuid?: Maybe<Scalars['String']['output']>;
  authUserGuid?: Maybe<Scalars['String']['output']>;
  comsEnrolledIndicator?: Maybe<Scalars['Boolean']['output']>;
  deactivateIndicator?: Maybe<Scalars['Boolean']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  officeGuid?: Maybe<Scalars['String']['output']>;
  parkAreaGuid?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type AppUserTeamXref = {
  __typename?: 'AppUserTeamXref';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  appUserGuid?: Maybe<Scalars['String']['output']>;
  appUserTeamXrefGuid?: Maybe<Scalars['String']['output']>;
  teamGuid?: Maybe<Scalars['String']['output']>;
};

export type Assessment = {
  __typename?: 'Assessment';
  actionJustificationActiveIndicator?: Maybe<Scalars['Boolean']['output']>;
  actionJustificationCode?: Maybe<Scalars['String']['output']>;
  actionJustificationLongDescription?: Maybe<Scalars['String']['output']>;
  actionJustificationShortDescription?: Maybe<Scalars['String']['output']>;
  actionNotRequired?: Maybe<Scalars['Boolean']['output']>;
  actions?: Maybe<Array<Maybe<CaseFileAction>>>;
  attended?: Maybe<Scalars['Boolean']['output']>;
  cat1Actions?: Maybe<Array<Maybe<CaseFileAction>>>;
  categoryLevel?: Maybe<KeyValuePair>;
  conflictHistory?: Maybe<KeyValuePair>;
  contactedComplainant?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  locationType?: Maybe<KeyValuePair>;
  outcomeAgencyCode?: Maybe<Scalars['String']['output']>;
};

export type AssessmentActionInput = {
  actionCode: Scalars['String']['input'];
  activeIndicator: Scalars['Boolean']['input'];
  actor: Scalars['String']['input'];
  date: Scalars['Date']['input'];
  isLegacy?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AssessmentInput = {
  actionCloseComplaint?: InputMaybe<Scalars['Boolean']['input']>;
  actionJustificationCode?: InputMaybe<Scalars['String']['input']>;
  actionLinkedComplaintIdentifier?: InputMaybe<Scalars['String']['input']>;
  actionNotRequired: Scalars['Boolean']['input'];
  actions: Array<InputMaybe<AssessmentActionInput>>;
  attended?: InputMaybe<Scalars['Boolean']['input']>;
  cat1Actions?: InputMaybe<Array<InputMaybe<AssessmentActionInput>>>;
  categoryLevel?: InputMaybe<KeyValuePairInput>;
  conflictHistory?: InputMaybe<KeyValuePairInput>;
  contactedComplainant?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  locationType?: InputMaybe<KeyValuePairInput>;
};

export type Business = {
  __typename?: 'Business';
  businessGuid?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type BusinessInput = {
  name: Scalars['String']['input'];
};

export type CaseActivity = {
  __typename?: 'CaseActivity';
  activityIdentifier?: Maybe<Scalars['String']['output']>;
  activityType?: Maybe<CaseActivityTypeCode>;
  caseActivityGuid?: Maybe<Scalars['String']['output']>;
  caseFileGuid?: Maybe<Scalars['String']['output']>;
  effectiveDate?: Maybe<Scalars['Date']['output']>;
  expiryDate?: Maybe<Scalars['Date']['output']>;
};

export type CaseActivityCreateInput = {
  activityIdentifier: Scalars['String']['input'];
  activityType: Scalars['String']['input'];
  caseFileGuid: Scalars['String']['input'];
  eventContent?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type CaseActivityRemoveInput = {
  activityIdentifier: Scalars['String']['input'];
  caseFileGuid: Scalars['String']['input'];
};

export type CaseActivityTypeCode = {
  __typename?: 'CaseActivityTypeCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  caseActivityTypeCode?: Maybe<Scalars['String']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type CaseFile = {
  __typename?: 'CaseFile';
  activities?: Maybe<Array<Maybe<CaseActivity>>>;
  caseIdentifier?: Maybe<Scalars['String']['output']>;
  caseStatus?: Maybe<CaseStatusCode>;
  createdByAppUserGuid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  leadAgency?: Maybe<AgencyCode>;
  name?: Maybe<Scalars['String']['output']>;
  openedTimestamp?: Maybe<Scalars['Date']['output']>;
};

export type CaseFileAction = {
  __typename?: 'CaseFileAction';
  actionCode: Scalars['String']['output'];
  actionId: Scalars['String']['output'];
  actionTypeCode: Scalars['String']['output'];
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  actor: Scalars['String']['output'];
  date: Scalars['Date']['output'];
  displayOrder?: Maybe<Scalars['Int']['output']>;
  isLegacy?: Maybe<Scalars['Boolean']['output']>;
  longDescription: Scalars['String']['output'];
  shortDescription: Scalars['String']['output'];
};

export type CaseFileCreateInput = {
  activityIdentifier?: InputMaybe<Scalars['String']['input']>;
  activityType?: InputMaybe<Scalars['String']['input']>;
  caseStatus: Scalars['String']['input'];
  createdByAppUserGuid: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  leadAgency: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CaseFileFilters = {
  caseStatus?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['Date']['input']>;
  leadAgency?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
};

export type CaseFileResult = {
  __typename?: 'CaseFileResult';
  items: Array<CaseFile>;
  pageInfo: PageInfo;
};

export type CaseFileUpdateInput = {
  caseStatus?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  leadAgency?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CaseLocationCode = {
  __typename?: 'CaseLocationCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  caseLocationCode?: Maybe<Scalars['String']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type CaseStatusCode = {
  __typename?: 'CaseStatusCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  caseStatusCode?: Maybe<Scalars['String']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type ComplaintOutcome = {
  __typename?: 'ComplaintOutcome';
  assessment?: Maybe<Array<Maybe<Assessment>>>;
  authorization?: Maybe<PermitSite>;
  complaintId?: Maybe<Scalars['String']['output']>;
  complaintOutcomeGuid?: Maybe<Scalars['String']['output']>;
  decision?: Maybe<Decision>;
  equipment?: Maybe<Array<Maybe<EquipmentDetails>>>;
  isReviewRequired?: Maybe<Scalars['Boolean']['output']>;
  notes?: Maybe<Array<Maybe<Note>>>;
  prevention?: Maybe<Array<Maybe<Prevention>>>;
  reviewComplete?: Maybe<CaseFileAction>;
  subject?: Maybe<Array<Maybe<Wildlife>>>;
};

export type Configuration = {
  __typename?: 'Configuration';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  configurationCode?: Maybe<Scalars['String']['output']>;
  configurationValue?: Maybe<Scalars['String']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
};

export type ConflictHistoryCode = {
  __typename?: 'ConflictHistoryCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  conflictHistoryCode?: Maybe<Scalars['String']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type ContactMethod = {
  __typename?: 'ContactMethod';
  typeCode?: Maybe<Scalars['String']['output']>;
  typeDescription?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type ContactMethodInput = {
  typeCode: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type ContinuationReport = {
  __typename?: 'ContinuationReport';
  actionedAppUserGuidRef?: Maybe<Scalars['String']['output']>;
  actionedTimestamp?: Maybe<Scalars['Date']['output']>;
  contentJson?: Maybe<Scalars['String']['output']>;
  continuationReportGuid?: Maybe<Scalars['String']['output']>;
  investigationGuid?: Maybe<Scalars['String']['output']>;
  reportedAppUserGuidRef?: Maybe<Scalars['String']['output']>;
  reportedTimestamp?: Maybe<Scalars['Date']['output']>;
};

export type ContinuationReportInput = {
  actionedAppUserGuidRef?: InputMaybe<Scalars['String']['input']>;
  actionedTimestamp?: InputMaybe<Scalars['Date']['input']>;
  contentJson?: InputMaybe<Scalars['String']['input']>;
  contentText?: InputMaybe<Scalars['String']['input']>;
  continuationReportGuid?: InputMaybe<Scalars['String']['input']>;
  investigationGuid?: InputMaybe<Scalars['String']['input']>;
  reportedAppUserGuidRef?: InputMaybe<Scalars['String']['input']>;
  reportedTimestamp?: InputMaybe<Scalars['Date']['input']>;
};

export type Contravention = {
  __typename?: 'Contravention';
  contraventionIdentifier: Scalars['String']['output'];
  investigationIdentifier: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  legislationIdentifierRef: Scalars['String']['output'];
};

export type CosGeoOrgUnit = {
  __typename?: 'CosGeoOrgUnit';
  administrativeOfficeIndicator?: Maybe<Scalars['Boolean']['output']>;
  areaCode?: Maybe<Scalars['String']['output']>;
  areaName?: Maybe<Scalars['String']['output']>;
  officeLocationCode?: Maybe<Scalars['String']['output']>;
  officeLocationName?: Maybe<Scalars['String']['output']>;
  regionCode?: Maybe<Scalars['String']['output']>;
  regionName?: Maybe<Scalars['String']['output']>;
  zoneCode?: Maybe<Scalars['String']['output']>;
  zoneName?: Maybe<Scalars['String']['output']>;
};

export type CreateAppUserInput = {
  agencyCode?: InputMaybe<Scalars['String']['input']>;
  authUserGuid?: InputMaybe<Scalars['String']['input']>;
  comsEnrolledIndicator?: InputMaybe<Scalars['Boolean']['input']>;
  deactivateIndicator?: InputMaybe<Scalars['Boolean']['input']>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  officeGuid?: InputMaybe<Scalars['String']['input']>;
  parkAreaGuid?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateAppUserTeamXrefInput = {
  activeIndicator: Scalars['Boolean']['input'];
  appUserGuid: Scalars['String']['input'];
  teamGuid: Scalars['String']['input'];
};

export type CreateAssessmentInput = {
  assessment: AssessmentInput;
  complaintId?: InputMaybe<Scalars['String']['input']>;
  complaintOutcomeGuid?: InputMaybe<Scalars['String']['input']>;
  createUserId: Scalars['String']['input'];
  outcomeAgencyCode: Scalars['String']['input'];
};

export type CreateAuthorizationOutcomeInput = {
  complaintId: Scalars['String']['input'];
  createUserId: Scalars['String']['input'];
  input: PermitSiteInput;
  outcomeAgencyCode: Scalars['String']['input'];
};

export type CreateDecisionInput = {
  actor?: InputMaybe<Scalars['String']['input']>;
  complaintId?: InputMaybe<Scalars['String']['input']>;
  createUserId?: InputMaybe<Scalars['String']['input']>;
  decision?: InputMaybe<DecisionInput>;
  outcomeAgencyCode?: InputMaybe<Scalars['String']['input']>;
};

export type CreateEquipmentInput = {
  complaintId: Scalars['String']['input'];
  createUserId: Scalars['String']['input'];
  equipment: Array<InputMaybe<EquipmentDetailsInput>>;
  outcomeAgencyCode: Scalars['String']['input'];
};

export type CreateInspectionBusinessInput = {
  businessReference?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateInspectionInput = {
  caseIdentifier: Scalars['String']['input'];
  createdByAppUserGuid: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  inspectionStatus?: InputMaybe<Scalars['String']['input']>;
  leadAgency: Scalars['String']['input'];
  locationAddress?: InputMaybe<Scalars['String']['input']>;
  locationDescription?: InputMaybe<Scalars['String']['input']>;
  locationGeometry?: InputMaybe<Scalars['Point']['input']>;
  name: Scalars['String']['input'];
};

export type CreateInspectionPartyInput = {
  business?: InputMaybe<CreateInspectionBusinessInput>;
  partyAssociationRole?: InputMaybe<Scalars['String']['input']>;
  partyReference?: InputMaybe<Scalars['String']['input']>;
  partyTypeCode: Scalars['String']['input'];
  person?: InputMaybe<CreateInspectionPersonInput>;
};

export type CreateInspectionPersonInput = {
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  middleName?: InputMaybe<Scalars['String']['input']>;
  middleName2?: InputMaybe<Scalars['String']['input']>;
  personReference?: InputMaybe<Scalars['String']['input']>;
};

export type CreateInvestigationBusinessInput = {
  businessReference?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateInvestigationInput = {
  caseIdentifier: Scalars['String']['input'];
  createdByAppUserGuid: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  discoveryDate?: InputMaybe<Scalars['Date']['input']>;
  fileCoordinatorGuid?: InputMaybe<Scalars['String']['input']>;
  investigationStatus?: InputMaybe<Scalars['String']['input']>;
  leadAgency: Scalars['String']['input'];
  locationAddress?: InputMaybe<Scalars['String']['input']>;
  locationDescription?: InputMaybe<Scalars['String']['input']>;
  locationGeometry?: InputMaybe<Scalars['Point']['input']>;
  name: Scalars['String']['input'];
  primaryInvestigatorGuid?: InputMaybe<Scalars['String']['input']>;
  supervisorGuid?: InputMaybe<Scalars['String']['input']>;
};

export type CreateInvestigationPartyInput = {
  business?: InputMaybe<CreateInvestigationBusinessInput>;
  partyAssociationRole?: InputMaybe<Scalars['String']['input']>;
  partyReference?: InputMaybe<Scalars['String']['input']>;
  partyTypeCode: Scalars['String']['input'];
  person?: InputMaybe<CreateInvestigationPersonInput>;
};

export type CreateInvestigationPersonInput = {
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  middleName?: InputMaybe<Scalars['String']['input']>;
  middleName2?: InputMaybe<Scalars['String']['input']>;
  personReference?: InputMaybe<Scalars['String']['input']>;
};

export type CreateNoteInput = {
  actor: Scalars['String']['input'];
  complaintId: Scalars['String']['input'];
  createUserId: Scalars['String']['input'];
  note: Scalars['String']['input'];
  outcomeAgencyCode: Scalars['String']['input'];
};

export type CreateOfficeInput = {
  agencyCode: Scalars['String']['input'];
  geoOrganizationUnitCode: Scalars['String']['input'];
};

export type CreatePreventionInput = {
  complaintId?: InputMaybe<Scalars['String']['input']>;
  complaintOutcomeGuid?: InputMaybe<Scalars['String']['input']>;
  createUserId: Scalars['String']['input'];
  outcomeAgencyCode: Scalars['String']['input'];
  prevention: PreventionInput;
};

export type CreateWildlifeInput = {
  complaintId: Scalars['String']['input'];
  createUserId: Scalars['String']['input'];
  outcomeAgencyCode: Scalars['String']['input'];
  wildlife: WildlifeInput;
};

export type Decision = {
  __typename?: 'Decision';
  actionTaken?: Maybe<Scalars['String']['output']>;
  actionTakenDate?: Maybe<Scalars['Date']['output']>;
  actionTakenLongDescription?: Maybe<Scalars['String']['output']>;
  assignedTo?: Maybe<Scalars['String']['output']>;
  discharge?: Maybe<Scalars['String']['output']>;
  dischargeLongDescription?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  inspectionNumber?: Maybe<Scalars['String']['output']>;
  ipmAuthCategory?: Maybe<Scalars['String']['output']>;
  ipmAuthCategoryLongDescription?: Maybe<Scalars['String']['output']>;
  leadAgency?: Maybe<Scalars['String']['output']>;
  leadAgencyLongDescription?: Maybe<Scalars['String']['output']>;
  nonCompliance?: Maybe<Scalars['String']['output']>;
  nonComplianceLongDescription?: Maybe<Scalars['String']['output']>;
  rationale?: Maybe<Scalars['String']['output']>;
  schedule?: Maybe<Scalars['String']['output']>;
  scheduleLongDescription?: Maybe<Scalars['String']['output']>;
  sector?: Maybe<Scalars['String']['output']>;
  sectorLongDescription?: Maybe<Scalars['String']['output']>;
};

export type DecisionInput = {
  actionTaken?: InputMaybe<Scalars['String']['input']>;
  actionTakenDate?: InputMaybe<Scalars['Date']['input']>;
  assignedTo?: InputMaybe<Scalars['String']['input']>;
  discharge?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  inspectionNumber?: InputMaybe<Scalars['String']['input']>;
  ipmAuthCategory?: InputMaybe<Scalars['String']['input']>;
  leadAgency?: InputMaybe<Scalars['String']['input']>;
  nonCompliance?: InputMaybe<Scalars['String']['input']>;
  rationale?: InputMaybe<Scalars['String']['input']>;
  schedule?: InputMaybe<Scalars['String']['input']>;
  sector?: InputMaybe<Scalars['String']['input']>;
};

export type DeleteAuthorizationOutcomeInput = {
  complaintOutcomeGuid: Scalars['String']['input'];
  id: Scalars['String']['input'];
  updateUserId: Scalars['String']['input'];
};

export type DeleteEquipmentInput = {
  id: Scalars['String']['input'];
  updateUserId: Scalars['String']['input'];
};

export type DeleteNoteInput = {
  actor: Scalars['String']['input'];
  complaintOutcomeGuid: Scalars['String']['input'];
  id: Scalars['String']['input'];
  updateUserId: Scalars['String']['input'];
};

export type DeletePreventionInput = {
  complaintId: Scalars['String']['input'];
  id: Scalars['String']['input'];
  updateUserId: Scalars['String']['input'];
};

export type DeleteWildlifeInput = {
  actor: Scalars['String']['input'];
  complaintOutcomeGuid: Scalars['String']['input'];
  updateUserId: Scalars['String']['input'];
  wildlifeId: Scalars['String']['input'];
};

export type DischargeCode = {
  __typename?: 'DischargeCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  dischargeCode?: Maybe<Scalars['String']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type Drug = {
  __typename?: 'Drug';
  additionalComments?: Maybe<Scalars['String']['output']>;
  amountUsed?: Maybe<Scalars['String']['output']>;
  drug?: Maybe<Scalars['String']['output']>;
  drugDescription?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  injectionMethod?: Maybe<Scalars['String']['output']>;
  injectionMethodDescription?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  remainingUse?: Maybe<Scalars['String']['output']>;
  remainingUseDescription?: Maybe<Scalars['String']['output']>;
  vial?: Maybe<Scalars['String']['output']>;
};

export type DrugCode = {
  __typename?: 'DrugCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  drugCode?: Maybe<Scalars['String']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type DrugInput = {
  additionalComments?: InputMaybe<Scalars['String']['input']>;
  amountUsed: Scalars['String']['input'];
  drug: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  injectionMethod: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
  remainingUse?: InputMaybe<Scalars['String']['input']>;
  vial: Scalars['String']['input'];
};

export type DrugMethodCode = {
  __typename?: 'DrugMethodCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  drugMethodCode?: Maybe<Scalars['String']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type DrugRemainingOutcomeCode = {
  __typename?: 'DrugRemainingOutcomeCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  drugRemainingOutcomeCode?: Maybe<Scalars['String']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type EarCode = {
  __typename?: 'EarCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  earCode?: Maybe<Scalars['String']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type EarTag = {
  __typename?: 'EarTag';
  ear?: Maybe<Scalars['String']['output']>;
  earDescription?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
};

export type EarTagInput = {
  ear: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  identifier: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
};

export type EquipmentActionInput = {
  actionCode?: InputMaybe<Scalars['String']['input']>;
  actionGuid?: InputMaybe<Scalars['String']['input']>;
  activeIndicator?: InputMaybe<Scalars['Boolean']['input']>;
  actor?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['Date']['input']>;
};

export type EquipmentCode = {
  __typename?: 'EquipmentCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  equipmentCode?: Maybe<Scalars['String']['output']>;
  hasQuantityIndicator?: Maybe<Scalars['Boolean']['output']>;
  isTrapIndicator?: Maybe<Scalars['Boolean']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type EquipmentDetails = {
  __typename?: 'EquipmentDetails';
  actions?: Maybe<Array<Maybe<CaseFileAction>>>;
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  address?: Maybe<Scalars['String']['output']>;
  createDate?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  typeCode?: Maybe<Scalars['String']['output']>;
  typeDescription?: Maybe<Scalars['String']['output']>;
  wasAnimalCaptured?: Maybe<Scalars['String']['output']>;
  xCoordinate?: Maybe<Scalars['String']['output']>;
  yCoordinate?: Maybe<Scalars['String']['output']>;
};

export type EquipmentDetailsInput = {
  actions: Array<InputMaybe<EquipmentActionInput>>;
  activeIndicator: Scalars['Boolean']['input'];
  address?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  typeCode: Scalars['String']['input'];
  wasAnimalCaptured?: InputMaybe<Scalars['String']['input']>;
  xCoordinate?: InputMaybe<Scalars['String']['input']>;
  yCoordinate?: InputMaybe<Scalars['String']['input']>;
};

export type EquipmentStatusCode = {
  __typename?: 'EquipmentStatusCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  equipmentStatusCode?: Maybe<Scalars['String']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type Event = {
  __typename?: 'Event';
  actorEntityTypeCode: EventEntityTypeCode;
  actorId: Scalars['String']['output'];
  content?: Maybe<Scalars['JSONObject']['output']>;
  eventGuid: Scalars['String']['output'];
  eventVerbTypeCode: EventVerbTypeCode;
  publishedTimestamp: Scalars['Date']['output'];
  sourceEntityTypeCode?: Maybe<EventEntityTypeCode>;
  sourceId?: Maybe<Scalars['String']['output']>;
  targetEntityTypeCode: EventEntityTypeCode;
  targetId: Scalars['String']['output'];
};

export type EventCreateInput = {
  actorEntityTypeCode: Scalars['String']['input'];
  actorId: Scalars['String']['input'];
  content?: InputMaybe<Scalars['JSONObject']['input']>;
  eventVerbTypeCode: Scalars['String']['input'];
  sourceEntityTypeCode?: InputMaybe<Scalars['String']['input']>;
  sourceId?: InputMaybe<Scalars['String']['input']>;
  targetEntityTypeCode: Scalars['String']['input'];
  targetId: Scalars['String']['input'];
};

export type EventEntityTypeCode = {
  __typename?: 'EventEntityTypeCode';
  activeInd: Scalars['Boolean']['output'];
  displayOrder?: Maybe<Scalars['Int']['output']>;
  eventEntityTypeCode: Scalars['String']['output'];
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription: Scalars['String']['output'];
};

export type EventFilters = {
  actorId?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['Date']['input']>;
  eventVerbTypeCode?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
  sourceId?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
  targetId?: InputMaybe<Scalars['String']['input']>;
};

export type EventResult = {
  __typename?: 'EventResult';
  items: Array<Event>;
  pageInfo: PageInfo;
};

export type EventVerbTypeCode = {
  __typename?: 'EventVerbTypeCode';
  activeInd: Scalars['Boolean']['output'];
  displayOrder?: Maybe<Scalars['Int']['output']>;
  eventVerbTypeCode: Scalars['String']['output'];
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription: Scalars['String']['output'];
};

export type GeoOrgUnitTypeCode = {
  __typename?: 'GeoOrgUnitTypeCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  geoOrgUnitTypeCode?: Maybe<Scalars['String']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type GeoOrganizationUnitCode = {
  __typename?: 'GeoOrganizationUnitCode';
  administrativeOfficeIndicator?: Maybe<Scalars['Boolean']['output']>;
  effectiveDate?: Maybe<Scalars['Date']['output']>;
  expiryDate?: Maybe<Scalars['Date']['output']>;
  geoOrgUnitTypeCode?: Maybe<Scalars['String']['output']>;
  geoOrganizationUnitCode?: Maybe<Scalars['String']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type HWCROutcomeActionedByCode = {
  __typename?: 'HWCROutcomeActionedByCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  hwcrOutcomeActionedByCode?: Maybe<Scalars['String']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type HWCROutcomeCode = {
  __typename?: 'HWCROutcomeCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  hwcrOutcomeCode?: Maybe<Scalars['String']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type IPMAuthCategoryCodeType = {
  __typename?: 'IPMAuthCategoryCodeType';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  ipmAuthCategoryCode: Scalars['String']['output'];
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type InactionJustificationType = {
  __typename?: 'InactionJustificationType';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  inactionJustificationCode: Scalars['String']['output'];
  longDescription?: Maybe<Scalars['String']['output']>;
  outcomeAgencyCode: Scalars['String']['output'];
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type Inspection = {
  __typename?: 'Inspection';
  createdByAppUserGuid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  inspectionGuid?: Maybe<Scalars['String']['output']>;
  inspectionStatus?: Maybe<InspectionStatusCode>;
  leadAgency?: Maybe<Scalars['String']['output']>;
  locationAddress?: Maybe<Scalars['String']['output']>;
  locationDescription?: Maybe<Scalars['String']['output']>;
  locationGeometry?: Maybe<Scalars['Point']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  openedTimestamp?: Maybe<Scalars['Date']['output']>;
  parties?: Maybe<Array<Maybe<InspectionParty>>>;
};

export type InspectionBusiness = {
  __typename?: 'InspectionBusiness';
  businessGuid: Scalars['String']['output'];
  businessReference?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  partyGuid: Scalars['String']['output'];
};

export type InspectionFilters = {
  endDate?: InputMaybe<Scalars['Date']['input']>;
  inspectionStatus?: InputMaybe<Scalars['String']['input']>;
  leadAgency?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
};

export type InspectionParty = {
  __typename?: 'InspectionParty';
  business?: Maybe<InspectionBusiness>;
  inspectionGuid: Scalars['String']['output'];
  partyAssociationRole?: Maybe<Scalars['String']['output']>;
  partyIdentifier: Scalars['String']['output'];
  partyReference?: Maybe<Scalars['String']['output']>;
  partyTypeCode: Scalars['String']['output'];
  person?: Maybe<InspectionPerson>;
};

export type InspectionPerson = {
  __typename?: 'InspectionPerson';
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  middleName?: Maybe<Scalars['String']['output']>;
  middleName2?: Maybe<Scalars['String']['output']>;
  partyGuid: Scalars['String']['output'];
  personGuid: Scalars['String']['output'];
  personReference?: Maybe<Scalars['String']['output']>;
};

export type InspectionResult = {
  __typename?: 'InspectionResult';
  items: Array<Inspection>;
  pageInfo: PageInfo;
};

export type InspectionSearchMapParameters = {
  bbox?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<InspectionFilters>;
  zoom: Scalars['Int']['input'];
};

export type InspectionStatusCode = {
  __typename?: 'InspectionStatusCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  inspectionStatusCode?: Maybe<Scalars['String']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type Investigation = {
  __typename?: 'Investigation';
  caseIdentifier?: Maybe<Scalars['String']['output']>;
  contraventions?: Maybe<Array<Maybe<Contravention>>>;
  createdByAppUserGuid?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  discoveryDate?: Maybe<Scalars['Date']['output']>;
  fileCoordinatorGuid?: Maybe<Scalars['String']['output']>;
  investigationGuid?: Maybe<Scalars['String']['output']>;
  investigationStatus?: Maybe<InvestigationStatusCode>;
  leadAgency?: Maybe<Scalars['String']['output']>;
  locationAddress?: Maybe<Scalars['String']['output']>;
  locationDescription?: Maybe<Scalars['String']['output']>;
  locationGeometry?: Maybe<Scalars['Point']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  openedTimestamp?: Maybe<Scalars['Date']['output']>;
  parties?: Maybe<Array<Maybe<InvestigationParty>>>;
  primaryInvestigatorGuid?: Maybe<Scalars['String']['output']>;
  supervisorGuid?: Maybe<Scalars['String']['output']>;
};

export type InvestigationBusiness = {
  __typename?: 'InvestigationBusiness';
  businessGuid: Scalars['String']['output'];
  businessReference?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  partyGuid: Scalars['String']['output'];
};

export type InvestigationFilters = {
  endDate?: InputMaybe<Scalars['Date']['input']>;
  investigationStatus?: InputMaybe<Scalars['String']['input']>;
  leadAgency?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
};

export type InvestigationParty = {
  __typename?: 'InvestigationParty';
  business?: Maybe<InvestigationBusiness>;
  investigationGuid: Scalars['String']['output'];
  partyAssociationRole?: Maybe<Scalars['String']['output']>;
  partyIdentifier: Scalars['String']['output'];
  partyReference?: Maybe<Scalars['String']['output']>;
  partyTypeCode: Scalars['String']['output'];
  person?: Maybe<InvestigationPerson>;
};

export type InvestigationPerson = {
  __typename?: 'InvestigationPerson';
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  middleName?: Maybe<Scalars['String']['output']>;
  middleName2?: Maybe<Scalars['String']['output']>;
  partyGuid: Scalars['String']['output'];
  personGuid: Scalars['String']['output'];
  personReference?: Maybe<Scalars['String']['output']>;
};

export type InvestigationResult = {
  __typename?: 'InvestigationResult';
  items: Array<Investigation>;
  pageInfo: PageInfo;
};

export type InvestigationSearchMapParameters = {
  bbox?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<InvestigationFilters>;
  zoom: Scalars['Int']['input'];
};

export type InvestigationStatusCode = {
  __typename?: 'InvestigationStatusCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  investigationStatusCode?: Maybe<Scalars['String']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type KeyValuePair = {
  __typename?: 'KeyValuePair';
  key?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type KeyValuePairInput = {
  key?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type Legislation = {
  __typename?: 'Legislation';
  alternateText?: Maybe<Scalars['String']['output']>;
  citation?: Maybe<Scalars['String']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  fullCitation?: Maybe<Scalars['String']['output']>;
  legislationGuid?: Maybe<Scalars['String']['output']>;
  legislationText?: Maybe<Scalars['String']['output']>;
  legislationTypeCode?: Maybe<Scalars['String']['output']>;
  parentGuid?: Maybe<Scalars['String']['output']>;
  sectionTitle?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addPartyToInspection: Inspection;
  addPartyToInvestigation: Investigation;
  createAppUser?: Maybe<AppUser>;
  createAppUserTeamXref?: Maybe<AppUserTeamXref>;
  createAssessment: ComplaintOutcome;
  createAuthorizationOutcome: ComplaintOutcome;
  createCaseActivity: CaseActivity;
  createCaseFile: CaseFile;
  createContravention: Investigation;
  createDecision: ComplaintOutcome;
  createEquipment: ComplaintOutcome;
  createEvent: Event;
  createInspection: Inspection;
  createInvestigation: Investigation;
  createNote: ComplaintOutcome;
  createOffice?: Maybe<Office>;
  createPark: Park;
  createParkArea: ParkArea;
  createParty: Party;
  createPerson: Person;
  createPrevention: ComplaintOutcome;
  createReview: ComplaintOutcome;
  createWildlife: ComplaintOutcome;
  deleteAppUserTeamXref?: Maybe<Scalars['Boolean']['output']>;
  deleteAuthorizationOutcome: ComplaintOutcome;
  deleteEquipment: Scalars['Boolean']['output'];
  deleteNote: ComplaintOutcome;
  deletePark: Park;
  deleteParkArea: ParkArea;
  deletePerson: Person;
  deletePrevention: ComplaintOutcome;
  deleteWildlife: ComplaintOutcome;
  removeCaseActivity: CaseActivity;
  removeContravention: Investigation;
  removePartyFromInspection: Inspection;
  removePartyFromInvestigation: Investigation;
  saveContinuationReport: ContinuationReport;
  updateAppUser?: Maybe<AppUser>;
  updateAppUserTeamXref?: Maybe<AppUserTeamXref>;
  updateAssessment: ComplaintOutcome;
  updateAuthorizationOutcome: ComplaintOutcome;
  updateCaseFile: CaseFile;
  updateDecision: ComplaintOutcome;
  updateEquipment: ComplaintOutcome;
  updateInspection: Inspection;
  updateInvestigation: Investigation;
  updateNote: ComplaintOutcome;
  updateOffice?: Maybe<Office>;
  updatePark: Park;
  updateParkArea: ParkArea;
  updateParty: Party;
  updatePerson: Person;
  updatePrevention: ComplaintOutcome;
  updateReview: ComplaintOutcome;
  updateWildlife: ComplaintOutcome;
};


export type MutationaddPartyToInspectionArgs = {
  input: Array<InputMaybe<CreateInspectionPartyInput>>;
  inspectionGuid: Scalars['String']['input'];
};


export type MutationaddPartyToInvestigationArgs = {
  input: Array<InputMaybe<CreateInvestigationPartyInput>>;
  investigationGuid: Scalars['String']['input'];
};


export type MutationcreateAppUserArgs = {
  input: CreateAppUserInput;
};


export type MutationcreateAppUserTeamXrefArgs = {
  input: CreateAppUserTeamXrefInput;
};


export type MutationcreateAssessmentArgs = {
  input: CreateAssessmentInput;
};


export type MutationcreateAuthorizationOutcomeArgs = {
  input: CreateAuthorizationOutcomeInput;
};


export type MutationcreateCaseActivityArgs = {
  input: CaseActivityCreateInput;
};


export type MutationcreateCaseFileArgs = {
  input: CaseFileCreateInput;
};


export type MutationcreateContraventionArgs = {
  investigationGuid: Scalars['String']['input'];
  legislationReference: Scalars['String']['input'];
};


export type MutationcreateDecisionArgs = {
  input: CreateDecisionInput;
};


export type MutationcreateEquipmentArgs = {
  createEquipmentInput: CreateEquipmentInput;
};


export type MutationcreateEventArgs = {
  input: EventCreateInput;
};


export type MutationcreateInspectionArgs = {
  input: CreateInspectionInput;
};


export type MutationcreateInvestigationArgs = {
  input: CreateInvestigationInput;
};


export type MutationcreateNoteArgs = {
  input: CreateNoteInput;
};


export type MutationcreateOfficeArgs = {
  input: CreateOfficeInput;
};


export type MutationcreateParkArgs = {
  input: ParkInput;
};


export type MutationcreateParkAreaArgs = {
  input: ParkAreaInput;
};


export type MutationcreatePartyArgs = {
  input: PartyCreateInput;
};


export type MutationcreatePersonArgs = {
  input: PersonInput;
};


export type MutationcreatePreventionArgs = {
  input: CreatePreventionInput;
};


export type MutationcreateReviewArgs = {
  reviewInput: ReviewInput;
};


export type MutationcreateWildlifeArgs = {
  input: CreateWildlifeInput;
};


export type MutationdeleteAppUserTeamXrefArgs = {
  appUserTeamXrefGuid: Scalars['String']['input'];
};


export type MutationdeleteAuthorizationOutcomeArgs = {
  input: DeleteAuthorizationOutcomeInput;
};


export type MutationdeleteEquipmentArgs = {
  deleteEquipmentInput: DeleteEquipmentInput;
};


export type MutationdeleteNoteArgs = {
  input: DeleteNoteInput;
};


export type MutationdeleteParkArgs = {
  personGuid: Scalars['String']['input'];
};


export type MutationdeleteParkAreaArgs = {
  parkAreaGuid: Scalars['String']['input'];
};


export type MutationdeletePersonArgs = {
  personGuid: Scalars['String']['input'];
};


export type MutationdeletePreventionArgs = {
  input: DeletePreventionInput;
};


export type MutationdeleteWildlifeArgs = {
  input: DeleteWildlifeInput;
};


export type MutationremoveCaseActivityArgs = {
  input: CaseActivityRemoveInput;
};


export type MutationremoveContraventionArgs = {
  contraventionGuid: Scalars['String']['input'];
  investigationGuid: Scalars['String']['input'];
};


export type MutationremovePartyFromInspectionArgs = {
  inspectionGuid: Scalars['String']['input'];
  partyIdentifier: Scalars['String']['input'];
};


export type MutationremovePartyFromInvestigationArgs = {
  investigationGuid: Scalars['String']['input'];
  partyIdentifier: Scalars['String']['input'];
};


export type MutationsaveContinuationReportArgs = {
  input: ContinuationReportInput;
};


export type MutationupdateAppUserArgs = {
  appUserGuid: Scalars['String']['input'];
  input: UpdateAppUserInput;
};


export type MutationupdateAppUserTeamXrefArgs = {
  appUserGuid: Scalars['String']['input'];
  input: UpdateAppUserTeamXrefInput;
};


export type MutationupdateAssessmentArgs = {
  input: UpdateAssessmentInput;
};


export type MutationupdateAuthorizationOutcomeArgs = {
  input: UpdateAuthorizationOutcomeInput;
};


export type MutationupdateCaseFileArgs = {
  caseIdentifier: Scalars['String']['input'];
  input: CaseFileUpdateInput;
};


export type MutationupdateDecisionArgs = {
  input: UpdateDecisionInput;
};


export type MutationupdateEquipmentArgs = {
  updateEquipmentInput: UpdateEquipmentInput;
};


export type MutationupdateInspectionArgs = {
  input: UpdateInspectionInput;
  inspectionGuid: Scalars['String']['input'];
};


export type MutationupdateInvestigationArgs = {
  input: UpdateInvestigationInput;
  investigationGuid: Scalars['String']['input'];
};


export type MutationupdateNoteArgs = {
  input: UpdateNoteInput;
};


export type MutationupdateOfficeArgs = {
  input: UpdateOfficeInput;
  officeGuid: Scalars['String']['input'];
};


export type MutationupdateParkArgs = {
  input: ParkInput;
  personGuid: Scalars['String']['input'];
};


export type MutationupdateParkAreaArgs = {
  input: ParkAreaInput;
  parkAreaGuid: Scalars['String']['input'];
};


export type MutationupdatePartyArgs = {
  input: PartyUpdateInput;
  partyIdentifier: Scalars['String']['input'];
};


export type MutationupdatePersonArgs = {
  input: PersonInput;
  personGuid: Scalars['String']['input'];
};


export type MutationupdatePreventionArgs = {
  input: UpdatePreventionInput;
};


export type MutationupdateReviewArgs = {
  reviewInput: ReviewInput;
};


export type MutationupdateWildlifeArgs = {
  input: UpdateWildlifeInput;
};

export type NonComplianceCode = {
  __typename?: 'NonComplianceCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  nonComplianceCode?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type Note = {
  __typename?: 'Note';
  actions?: Maybe<Array<Maybe<CaseFileAction>>>;
  id?: Maybe<Scalars['String']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  outcomeAgencyCode?: Maybe<Scalars['String']['output']>;
};

export type Office = {
  __typename?: 'Office';
  agencyCode?: Maybe<Scalars['String']['output']>;
  appUsers?: Maybe<Array<Maybe<AppUser>>>;
  cosGeoOrgUnit?: Maybe<CosGeoOrgUnit>;
  geoOrganizationUnitCode?: Maybe<Scalars['String']['output']>;
  officeGuid?: Maybe<Scalars['String']['output']>;
};

export type OutcomeAgencyCode = {
  __typename?: 'OutcomeAgencyCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  outcomeAgencyCode?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  currentPage: Scalars['Int']['output'];
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Park = {
  __typename?: 'Park';
  externalId?: Maybe<Scalars['String']['output']>;
  legalName?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  parkAreas?: Maybe<Array<Maybe<ParkArea>>>;
  parkGuid?: Maybe<Scalars['String']['output']>;
};

export type ParkArea = {
  __typename?: 'ParkArea';
  name?: Maybe<Scalars['String']['output']>;
  parkAreaGuid?: Maybe<Scalars['String']['output']>;
  regionName?: Maybe<Scalars['String']['output']>;
};

export type ParkAreaInput = {
  parkAreaGuid: Scalars['String']['input'];
};

export type ParkInput = {
  externalId: Scalars['String']['input'];
  legalName?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  parkAreas?: InputMaybe<Array<ParkAreaInput>>;
};

export type Party = {
  __typename?: 'Party';
  business?: Maybe<Business>;
  createdDateTime?: Maybe<Scalars['Date']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  partyIdentifier?: Maybe<Scalars['String']['output']>;
  partyTypeCode?: Maybe<Scalars['String']['output']>;
  person?: Maybe<Person>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type PartyAssociationRole = {
  __typename?: 'PartyAssociationRole';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  caseActivityTypeCode?: Maybe<Scalars['String']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  partyAssociationRole?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type PartyCreateInput = {
  business?: InputMaybe<BusinessInput>;
  longDescription?: InputMaybe<Scalars['String']['input']>;
  partyTypeCode: Scalars['String']['input'];
  person?: InputMaybe<PersonInput>;
  shortDescription?: InputMaybe<Scalars['String']['input']>;
};

export type PartyFilters = {
  partyTypeCode?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
};

export type PartyResult = {
  __typename?: 'PartyResult';
  items: Array<Party>;
  pageInfo: PageInfo;
};

export type PartyTypeCode = {
  __typename?: 'PartyTypeCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  partyTypeCode?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type PartyUpdateInput = {
  business?: InputMaybe<BusinessInput>;
  longDescription?: InputMaybe<Scalars['String']['input']>;
  partyTypeCode: Scalars['String']['input'];
  person?: InputMaybe<PersonInput>;
  shortDescription?: InputMaybe<Scalars['String']['input']>;
};

export type PermitSite = {
  __typename?: 'PermitSite';
  id?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type PermitSiteInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type Person = {
  __typename?: 'Person';
  contactMethods?: Maybe<Array<Maybe<ContactMethod>>>;
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  middleName?: Maybe<Scalars['String']['output']>;
  middleName2?: Maybe<Scalars['String']['output']>;
  personGuid?: Maybe<Scalars['String']['output']>;
};

export type PersonInput = {
  contactMethods?: InputMaybe<Array<InputMaybe<ContactMethodInput>>>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  middleName?: InputMaybe<Scalars['String']['input']>;
  middleName2?: InputMaybe<Scalars['String']['input']>;
};

export type Prevention = {
  __typename?: 'Prevention';
  actions?: Maybe<Array<Maybe<CaseFileAction>>>;
  id?: Maybe<Scalars['String']['output']>;
  outcomeAgencyCode?: Maybe<Scalars['String']['output']>;
};

export type PreventionActionInput = {
  actionCode: Scalars['String']['input'];
  activeIndicator: Scalars['Boolean']['input'];
  actor: Scalars['String']['input'];
  date: Scalars['Date']['input'];
};

export type PreventionInput = {
  actions: Array<InputMaybe<PreventionActionInput>>;
  id?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  CEEBDecisionActions: Array<Maybe<CaseFileAction>>;
  HWCRAssessmentActions: Array<Maybe<CaseFileAction>>;
  HWCRAssessmentCat1Actions: Array<Maybe<CaseFileAction>>;
  HWCRPreventionActions: Array<Maybe<CaseFileAction>>;
  InspectionParties: Array<Maybe<InspectionParty>>;
  InvestigationParties: Array<Maybe<InvestigationParty>>;
  ageCodes: Array<Maybe<AgeCode>>;
  agencyCodes: Array<Maybe<AgencyCode>>;
  appUser?: Maybe<AppUser>;
  appUserTeamXref?: Maybe<AppUserTeamXref>;
  appUserTeamXrefs: Array<Maybe<AppUserTeamXref>>;
  appUsers: Array<Maybe<AppUser>>;
  caseFile?: Maybe<CaseFile>;
  caseFiles: Array<CaseFile>;
  caseFilesByActivityIds: Array<CaseFile>;
  caseLocationCodes: Array<Maybe<CaseLocationCode>>;
  checkCaseNameExists: Scalars['Boolean']['output'];
  checkInspectionNameExists: Scalars['Boolean']['output'];
  checkInvestigationNameExists: Scalars['Boolean']['output'];
  configurationCodes: Array<Maybe<Configuration>>;
  conflictHistoryCodes: Array<Maybe<ConflictHistoryCode>>;
  cosGeoOrgUnits: Array<Maybe<CosGeoOrgUnit>>;
  dischargeCodes: Array<Maybe<DischargeCode>>;
  drugCodes: Array<Maybe<DrugCode>>;
  drugMethodCodes: Array<Maybe<DrugMethodCode>>;
  drugRemainingOutcomeCodes: Array<Maybe<DrugRemainingOutcomeCode>>;
  earCodes: Array<Maybe<EarCode>>;
  equipmentCodes: Array<Maybe<EquipmentCode>>;
  equipmentStatusCodes: Array<Maybe<EquipmentStatusCode>>;
  geoOrgUnitTypeCodes: Array<Maybe<GeoOrgUnitTypeCode>>;
  geoOrganizationUnitCodes: Array<Maybe<GeoOrganizationUnitCode>>;
  getComplaintOutcome?: Maybe<ComplaintOutcome>;
  getComplaintOutcomeByComplaintId?: Maybe<ComplaintOutcome>;
  getComplaintOutcomesByComplaintId?: Maybe<Array<Maybe<ComplaintOutcome>>>;
  getComplaintOutcomesBySearchString?: Maybe<Array<Maybe<ComplaintOutcome>>>;
  getContinuationReport?: Maybe<ContinuationReport>;
  getContinuationReports?: Maybe<Array<ContinuationReport>>;
  getInspection?: Maybe<Inspection>;
  getInspections?: Maybe<Array<Maybe<Inspection>>>;
  getInspectionsByParty?: Maybe<Array<Maybe<Inspection>>>;
  getInvestigation?: Maybe<Investigation>;
  getInvestigations?: Maybe<Array<Maybe<Investigation>>>;
  getInvestigationsByParty?: Maybe<Array<Maybe<Investigation>>>;
  getLeadsByActionTaken?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  getLeadsByEquipment?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  getLeadsByOutcomeAnimal?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  getParksByArea?: Maybe<Array<Maybe<Park>>>;
  hwcrOutcomeActionedByCodes: Array<Maybe<HWCROutcomeActionedByCode>>;
  hwcrOutcomeCodes: Array<Maybe<HWCROutcomeCode>>;
  inactionJustificationCodes: Array<Maybe<InactionJustificationType>>;
  ipmAuthCategoryCodes: Array<Maybe<IPMAuthCategoryCodeType>>;
  legislation?: Maybe<Legislation>;
  legislations: Array<Maybe<Legislation>>;
  nonComplianceCodes: Array<Maybe<NonComplianceCode>>;
  office?: Maybe<Office>;
  offices: Array<Maybe<Office>>;
  officesByZone: Array<Maybe<Office>>;
  outcomeAgencyCodes: Array<Maybe<OutcomeAgencyCode>>;
  park?: Maybe<Park>;
  parkArea?: Maybe<ParkArea>;
  parkAreas: Array<Maybe<ParkArea>>;
  parks?: Maybe<Array<Maybe<Park>>>;
  parties: Array<Party>;
  party?: Maybe<Party>;
  partyAssociationRoles: Array<Maybe<PartyAssociationRole>>;
  partyTypeCodes: Array<Maybe<PartyTypeCode>>;
  people?: Maybe<Array<Maybe<Person>>>;
  person?: Maybe<Person>;
  scheduleCodes: Array<Maybe<ScheduleCode>>;
  scheduleSectorXrefs: Array<Maybe<ScheduleSectorXref>>;
  searchAppUsers: Array<Maybe<AppUser>>;
  searchCaseFiles: CaseFileResult;
  searchContinuationReports?: Maybe<Array<ContinuationReport>>;
  searchCosGeoOrgUnitsByNames: Array<Maybe<CosGeoOrgUnit>>;
  searchEvents: EventResult;
  searchInspections: InspectionResult;
  searchInspectionsMap: SearchMapResults;
  searchInvestigations: InvestigationResult;
  searchInvestigationsMap: SearchMapResults;
  searchParties: PartyResult;
  sectorCodes: Array<Maybe<SectorCode>>;
  sexCodes: Array<Maybe<SexCode>>;
  team?: Maybe<Team>;
  teamCodes: Array<Maybe<TeamCode>>;
  teams: Array<Maybe<Team>>;
  threatLevelCodes: Array<Maybe<ThreatLevelCode>>;
};


export type QueryInspectionPartiesArgs = {
  partyRefId: Scalars['String']['input'];
};


export type QueryInvestigationPartiesArgs = {
  partyRefId: Scalars['String']['input'];
};


export type QueryappUserArgs = {
  appUserGuid?: InputMaybe<Scalars['String']['input']>;
  authUserGuid?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryappUserTeamXrefArgs = {
  appUserGuid: Scalars['String']['input'];
};


export type QueryappUsersArgs = {
  agencyCode?: InputMaybe<Scalars['String']['input']>;
  officeGuids?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QuerycaseFileArgs = {
  caseIdentifier: Scalars['String']['input'];
};


export type QuerycaseFilesArgs = {
  caseIdentifiers: Array<Scalars['String']['input']>;
};


export type QuerycaseFilesByActivityIdsArgs = {
  activityIdentifiers: Array<Scalars['String']['input']>;
};


export type QuerycheckCaseNameExistsArgs = {
  excludeCaseIdentifier?: InputMaybe<Scalars['String']['input']>;
  leadAgency: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type QuerycheckInspectionNameExistsArgs = {
  excludeInspectionGuid?: InputMaybe<Scalars['String']['input']>;
  leadAgency: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type QuerycheckInvestigationNameExistsArgs = {
  excludeInvestigationGuid?: InputMaybe<Scalars['String']['input']>;
  leadAgency: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type QueryconfigurationCodesArgs = {
  configurationCode?: InputMaybe<Scalars['String']['input']>;
};


export type QuerycosGeoOrgUnitsArgs = {
  distinctOfficeLocations?: InputMaybe<Scalars['Boolean']['input']>;
  regionCode?: InputMaybe<Scalars['String']['input']>;
  zoneCode?: InputMaybe<Scalars['String']['input']>;
};


export type QuerygetComplaintOutcomeArgs = {
  complaintOutcomeGuid: Scalars['String']['input'];
};


export type QuerygetComplaintOutcomeByComplaintIdArgs = {
  complaintId: Scalars['String']['input'];
};


export type QuerygetComplaintOutcomesByComplaintIdArgs = {
  complaintIds: Array<Scalars['String']['input']>;
};


export type QuerygetComplaintOutcomesBySearchStringArgs = {
  complaintType: Scalars['String']['input'];
  searchString: Scalars['String']['input'];
};


export type QuerygetContinuationReportArgs = {
  continuationReportGuid: Scalars['String']['input'];
};


export type QuerygetContinuationReportsArgs = {
  investigationGuid: Scalars['String']['input'];
};


export type QuerygetInspectionArgs = {
  inspectionGuid?: InputMaybe<Scalars['String']['input']>;
};


export type QuerygetInspectionsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QuerygetInspectionsByPartyArgs = {
  partyId?: InputMaybe<Scalars['String']['input']>;
  partyType?: InputMaybe<Scalars['String']['input']>;
};


export type QuerygetInvestigationArgs = {
  investigationGuid?: InputMaybe<Scalars['String']['input']>;
};


export type QuerygetInvestigationsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QuerygetInvestigationsByPartyArgs = {
  partyId?: InputMaybe<Scalars['String']['input']>;
  partyType?: InputMaybe<Scalars['String']['input']>;
};


export type QuerygetLeadsByActionTakenArgs = {
  actionCode: Scalars['String']['input'];
};


export type QuerygetLeadsByEquipmentArgs = {
  equipmentCodes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  equipmentStatus: Scalars['String']['input'];
};


export type QuerygetLeadsByOutcomeAnimalArgs = {
  endDate: Scalars['String']['input'];
  outcomeActionedByCode: Scalars['String']['input'];
  outcomeAnimalCode: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};


export type QuerygetParksByAreaArgs = {
  parkAreaGuid: Scalars['String']['input'];
};


export type QueryinactionJustificationCodesArgs = {
  outcomeAgencyCode?: InputMaybe<Scalars['String']['input']>;
};


export type QuerylegislationArgs = {
  legislationGuid: Scalars['String']['input'];
};


export type QuerylegislationsArgs = {
  agencyCode: Scalars['String']['input'];
  ancestorGuid?: InputMaybe<Scalars['String']['input']>;
  legislationTypeCodes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryofficeArgs = {
  agencyCode?: InputMaybe<Scalars['String']['input']>;
  geoOrganizationUnitCode?: InputMaybe<Scalars['String']['input']>;
  officeGuid?: InputMaybe<Scalars['String']['input']>;
};


export type QueryofficesArgs = {
  agencyCode?: InputMaybe<Scalars['String']['input']>;
  geoOrganizationUnitCodes?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryofficesByZoneArgs = {
  zoneCode: Scalars['String']['input'];
};


export type QueryparkArgs = {
  parkGuid: Scalars['String']['input'];
};


export type QueryparkAreaArgs = {
  parkAreaGuid: Scalars['String']['input'];
};


export type QueryparksArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerypartiesArgs = {
  partyIdentifiers: Array<Scalars['String']['input']>;
};


export type QuerypartyArgs = {
  partyIdentifier: Scalars['String']['input'];
};


export type QuerypersonArgs = {
  personGuid: Scalars['String']['input'];
};


export type QuerysearchAppUsersArgs = {
  searchTerm: Scalars['String']['input'];
};


export type QuerysearchCaseFilesArgs = {
  filters?: InputMaybe<CaseFileFilters>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerysearchContinuationReportsArgs = {
  searchString: Scalars['String']['input'];
};


export type QuerysearchCosGeoOrgUnitsByNamesArgs = {
  areaName?: InputMaybe<Scalars['String']['input']>;
  distinctOfficeLocations?: InputMaybe<Scalars['Boolean']['input']>;
  officeLocationName?: InputMaybe<Scalars['String']['input']>;
  regionName?: InputMaybe<Scalars['String']['input']>;
  zoneName?: InputMaybe<Scalars['String']['input']>;
};


export type QuerysearchEventsArgs = {
  filters?: InputMaybe<EventFilters>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerysearchInspectionsArgs = {
  filters?: InputMaybe<InspectionFilters>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerysearchInspectionsMapArgs = {
  model: InspectionSearchMapParameters;
};


export type QuerysearchInvestigationsArgs = {
  filters?: InputMaybe<InvestigationFilters>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerysearchInvestigationsMapArgs = {
  model: InvestigationSearchMapParameters;
};


export type QuerysearchPartiesArgs = {
  filters?: InputMaybe<PartyFilters>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryteamArgs = {
  teamGuid: Scalars['String']['input'];
};


export type QueryteamsArgs = {
  agencyCode?: InputMaybe<Scalars['String']['input']>;
  teamCode?: InputMaybe<Scalars['String']['input']>;
};

export type ReviewActionInput = {
  actionCode: Scalars['String']['input'];
  actionId?: InputMaybe<Scalars['String']['input']>;
  activeIndicator?: InputMaybe<Scalars['Boolean']['input']>;
  actor: Scalars['String']['input'];
  date: Scalars['Date']['input'];
};

export type ReviewInput = {
  complaintId: Scalars['String']['input'];
  complaintOutcomeGuid?: InputMaybe<Scalars['String']['input']>;
  isReviewRequired: Scalars['Boolean']['input'];
  outcomeAgencyCode: Scalars['String']['input'];
  reviewComplete?: InputMaybe<ReviewActionInput>;
  userId: Scalars['String']['input'];
};

export type ScheduleCode = {
  __typename?: 'ScheduleCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  scheduleCode?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type ScheduleSectorXref = {
  __typename?: 'ScheduleSectorXref';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  scheduleCode?: Maybe<Scalars['String']['output']>;
  sectorCode?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type SearchMapResults = {
  __typename?: 'SearchMapResults';
  center?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  clusters?: Maybe<Scalars['JSON']['output']>;
  mappedCount?: Maybe<Scalars['Int']['output']>;
  unmappedCount?: Maybe<Scalars['Int']['output']>;
  zoom?: Maybe<Scalars['Int']['output']>;
};

export type SectorCode = {
  __typename?: 'SectorCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  sectorCode?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type SexCode = {
  __typename?: 'SexCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  sexCode?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
};

export type Team = {
  __typename?: 'Team';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  agencyCode?: Maybe<Scalars['String']['output']>;
  teamCode?: Maybe<Scalars['String']['output']>;
  teamGuid?: Maybe<Scalars['String']['output']>;
};

export type TeamCode = {
  __typename?: 'TeamCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
  teamCode?: Maybe<Scalars['String']['output']>;
};

export type ThreatLevelCode = {
  __typename?: 'ThreatLevelCode';
  activeIndicator?: Maybe<Scalars['Boolean']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  longDescription?: Maybe<Scalars['String']['output']>;
  shortDescription?: Maybe<Scalars['String']['output']>;
  threatLevelCode?: Maybe<Scalars['String']['output']>;
};

export type UpdateAppUserInput = {
  agencyCode?: InputMaybe<Scalars['String']['input']>;
  authUserGuid?: InputMaybe<Scalars['String']['input']>;
  comsEnrolledIndicator?: InputMaybe<Scalars['Boolean']['input']>;
  deactivateIndicator?: InputMaybe<Scalars['Boolean']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  officeGuid?: InputMaybe<Scalars['String']['input']>;
  parkAreaGuid?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAppUserTeamXrefInput = {
  activeIndicator?: InputMaybe<Scalars['Boolean']['input']>;
  teamGuid?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAssessmentInput = {
  assessment: AssessmentInput;
  complaintId?: InputMaybe<Scalars['String']['input']>;
  complaintOutcomeGuid: Scalars['String']['input'];
  outcomeAgencyCode: Scalars['String']['input'];
  updateUserId: Scalars['String']['input'];
};

export type UpdateAuthorizationOutcomeInput = {
  complaintOutcomeGuid?: InputMaybe<Scalars['String']['input']>;
  input?: InputMaybe<PermitSiteInput>;
  outcomeAgencyCode?: InputMaybe<Scalars['String']['input']>;
  updateUserId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateDecisionInput = {
  actor?: InputMaybe<Scalars['String']['input']>;
  complaintOutcomeGuid?: InputMaybe<Scalars['String']['input']>;
  decision?: InputMaybe<DecisionInput>;
  outcomeAgencyCode?: InputMaybe<Scalars['String']['input']>;
  updateUserId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEquipmentInput = {
  complaintId: Scalars['String']['input'];
  equipment: Array<InputMaybe<EquipmentDetailsInput>>;
  outcomeAgencyCode: Scalars['String']['input'];
  updateUserId: Scalars['String']['input'];
};

export type UpdateInspectionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  inspectionStatus?: InputMaybe<Scalars['String']['input']>;
  leadAgency?: InputMaybe<Scalars['String']['input']>;
  locationAddress?: InputMaybe<Scalars['String']['input']>;
  locationDescription?: InputMaybe<Scalars['String']['input']>;
  locationGeometry?: InputMaybe<Scalars['Point']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateInvestigationInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  discoveryDate?: InputMaybe<Scalars['Date']['input']>;
  fileCoordinatorGuid?: InputMaybe<Scalars['String']['input']>;
  investigationStatus?: InputMaybe<Scalars['String']['input']>;
  leadAgency?: InputMaybe<Scalars['String']['input']>;
  locationAddress?: InputMaybe<Scalars['String']['input']>;
  locationDescription?: InputMaybe<Scalars['String']['input']>;
  locationGeometry?: InputMaybe<Scalars['Point']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  primaryInvestigatorGuid?: InputMaybe<Scalars['String']['input']>;
  supervisorGuid?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateNoteInput = {
  actor: Scalars['String']['input'];
  complaintOutcomeGuid: Scalars['String']['input'];
  id: Scalars['String']['input'];
  note: Scalars['String']['input'];
  updateUserId: Scalars['String']['input'];
};

export type UpdateOfficeInput = {
  agencyCode?: InputMaybe<Scalars['String']['input']>;
  geoOrganizationUnitCode?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePreventionInput = {
  complaintId?: InputMaybe<Scalars['String']['input']>;
  complaintOutcomeGuid: Scalars['String']['input'];
  outcomeAgencyCode: Scalars['String']['input'];
  prevention: PreventionInput;
  updateUserId: Scalars['String']['input'];
};

export type UpdateWildlifeInput = {
  complaintOutcomeGuid: Scalars['String']['input'];
  updateUserId: Scalars['String']['input'];
  wildlife: WildlifeInput;
};

export type Wildlife = {
  __typename?: 'Wildlife';
  actions?: Maybe<Array<Maybe<CaseFileAction>>>;
  age?: Maybe<Scalars['String']['output']>;
  ageDescription?: Maybe<Scalars['String']['output']>;
  categoryLevel?: Maybe<Scalars['String']['output']>;
  categoryLevelDescription?: Maybe<Scalars['String']['output']>;
  drugs?: Maybe<Array<Maybe<Drug>>>;
  id?: Maybe<Scalars['String']['output']>;
  identifyingFeatures?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  outcome?: Maybe<Scalars['String']['output']>;
  outcomeActionedBy?: Maybe<Scalars['String']['output']>;
  outcomeActionedByDescription?: Maybe<Scalars['String']['output']>;
  outcomeDescription?: Maybe<Scalars['String']['output']>;
  sex?: Maybe<Scalars['String']['output']>;
  sexDescription?: Maybe<Scalars['String']['output']>;
  species: Scalars['String']['output'];
  tags?: Maybe<Array<Maybe<EarTag>>>;
};

export type WildlifeActionInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  activeIndicator?: InputMaybe<Scalars['Boolean']['input']>;
  actor?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['Date']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
};

export type WildlifeInput = {
  actions?: InputMaybe<Array<InputMaybe<WildlifeActionInput>>>;
  age?: InputMaybe<Scalars['String']['input']>;
  categoryLevel?: InputMaybe<Scalars['String']['input']>;
  drugs?: InputMaybe<Array<InputMaybe<DrugInput>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  identifyingFeatures?: InputMaybe<Scalars['String']['input']>;
  outcome?: InputMaybe<Scalars['String']['input']>;
  outcomeActionedBy?: InputMaybe<Scalars['String']['input']>;
  sex?: InputMaybe<Scalars['String']['input']>;
  species: Scalars['String']['input'];
  tags?: InputMaybe<Array<InputMaybe<EarTagInput>>>;
};



export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;