import { FEATURE_TYPES } from "@constants/feature-flag-types";
import { Roles } from "@apptypes/app/roles";
import { RootState } from "@store/store";
import { isFeatureActive } from "@store/reducers/app";
import UserService from "@service/user-service";

// Role that grant access to cases / investigations / inspections when the agency feature flag is off
const casesRoleBypass = (): boolean => UserService.hasRole(Roles.CASE_ACCESS);

export const selectCanAccessCases = (state: RootState): boolean =>
  isFeatureActive(FEATURE_TYPES.CASES)(state) && casesRoleBypass();

export const selectCanAccessInvestigations = (state: RootState): boolean =>
  isFeatureActive(FEATURE_TYPES.INVESTIGATIONS)(state) && casesRoleBypass();

export const selectCanAccessInspections = (state: RootState): boolean =>
  isFeatureActive(FEATURE_TYPES.INSPECTIONS)(state) && casesRoleBypass();
