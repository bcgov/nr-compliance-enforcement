import { FEATURE_TYPES } from "@constants/feature-flag-types";
import { Roles, coreRoles } from "@apptypes/app/roles";
import { AgencyType } from "@apptypes/app/agency-types";
import { COMPLAINT_TYPES } from "@apptypes/app/complaint-types";
import { RootState } from "@store/store";
import { isFeatureActive } from "@store/reducers/app";
import UserService from "@service/user-service";

// Role that grants access to cases / investigations / inspections when the agency feature flag is on
const casesRoleBypass = (): boolean => UserService.hasRole(Roles.CASE_ACCESS);

export const selectIsCasesFeatureEnabled = (state: RootState): boolean => isFeatureActive(FEATURE_TYPES.CASES)(state);

export const selectIsInvestigationsFeatureEnabled = (state: RootState): boolean =>
  isFeatureActive(FEATURE_TYPES.INVESTIGATIONS)(state);

export const selectIsInspectionsFeatureEnabled = (state: RootState): boolean =>
  isFeatureActive(FEATURE_TYPES.INSPECTIONS)(state);

export const selectIsPartiesFeatureEnabled = (state: RootState): boolean =>
  isFeatureActive(FEATURE_TYPES.PARTIES_OF_INTEREST)(state);

export const selectCanAccessCases = (state: RootState): boolean =>
  isFeatureActive(FEATURE_TYPES.CASES)(state) && casesRoleBypass();

export const selectCanAccessInvestigations = (state: RootState): boolean =>
  isFeatureActive(FEATURE_TYPES.INVESTIGATIONS)(state) && casesRoleBypass();

export const selectCanAccessInspections = (state: RootState): boolean =>
  isFeatureActive(FEATURE_TYPES.INSPECTIONS)(state) && casesRoleBypass();

export const selectCanAccessParties = (state: RootState): boolean =>
  isFeatureActive(FEATURE_TYPES.PARTIES_OF_INTEREST)(state) && UserService.hasRole(Roles.PARTY_ACCESS);

export const selectCanAccessComplaints = (state: RootState): boolean =>
  isFeatureActive(FEATURE_TYPES.COMPLAINTS)(state) && UserService.hasRole(coreRoles);

// Assessments on Enforcement/GIR complaints only apply to COS and PARKS
// (CEEB/NROS/MINES close on investigation creation; HWC has its own assessment flow)
export const selectComplaintAssessmentApplies =
  (complaintType?: string, agency?: string) =>
  (state: RootState): boolean =>
    isFeatureActive(FEATURE_TYPES.ERS_GIR_ASSESSMENT)(state) &&
    [AgencyType.COS, AgencyType.PARKS].includes(agency ?? "") &&
    [COMPLAINT_TYPES.ERS, COMPLAINT_TYPES.GIR].includes(complaintType ?? "");
