import { AppState } from "@apptypes/app/app-state";
import { AppThunk, RootState, store } from "@store/store";
import { SsoToken } from "@apptypes/app/sso-token";
import jwtDecode from "jwt-decode";
import Profile from "@apptypes/app/profile";
import { UUID } from "node:crypto";
import { AppUser } from "@apptypes/app/app_user/app_user";
import config from "@/config";
import { generateApiParameters, get, patch, put } from "@common/api";
import { AUTH_TOKEN, getUserAgency } from "@service/user-service";

import { DropdownOption } from "@apptypes/app/drop-down-option";

import { Configurations } from "@constants/configurations";
import { ConfigurationType } from "@apptypes/configurations/configuration";
import { from } from "linq-to-typescript";
import { ConfigurationState } from "@apptypes/state/configuration-state";
import { NotificationState } from "@apptypes/state/notification-state";
import { ToggleError } from "@common/toast";
import { CodeTableVersionState } from "@apptypes/state/code-table-version-state";
import { fetchCaseCodeTables, fetchComplaintCodeTables } from "./code-table";
import { Action, ThunkAction } from "@reduxjs/toolkit";
import { ComsInviteResponse } from "@apptypes/app/coms-invite-response";
import { AxiosError } from "axios";
import { FEATURE_TYPES } from "@constants/feature-flag-types";
import { ActiveFilters } from "@apptypes/app/active-filters";
import { FeatureFlagState } from "@apptypes/state/feature-flag-state";

enum ActionTypes {
  SET_TOKEN_PROFILE = "app/SET_TOKEN_PROFILE",
  TOGGLE_SIDEBAR = "app/TOGGLE_SIDEBAR",
  SHOW_MODAL = "app/SHOW_MODAL",
  HIDE_MODAL = "app/HIDE_MODAL",
  TOGGLE_LOADING = "app/TOGGLE_LOADING",
  TOGGLE_NOTIFICATION = "app/TOGGLE_NOTIFICATION",
  CLEAR_NOTIFICATION = "app/CLEAR_NOTIFICATION",
  SET_DEFAULT_ZONE = "app/SET_DEFAULT_ZONE",
  SET_CONFIGURATIONS = "app/CONFIGURATIONS",
  SET_USER_AGENCY = "app/SET_USER_AGENCY",
  SET_CODE_TABLE_VERSION = "app/SET_CODE_TABLE_VERSION",
  SET_FEATURE_FLAG = "app/SET_FEATURE_FLAG",
  SET_ACTIVE_TAB = "app/SET_ACTIVE_TAB",
  SET_ACTIVE_COMPLAINTS_VIEW_TYPE = "app/SET_ACTIVE_COMPLAINTS_VIEW_TYPE",
}
//-- action creators

export const setTokenProfile = (profile: Profile) => ({
  type: ActionTypes.SET_TOKEN_PROFILE,
  payload: profile,
});

export const setConfigurations = (configurations: ConfigurationState) => ({
  type: ActionTypes.SET_CONFIGURATIONS,
  payload: configurations,
});

export const setCodeTableVersion = (version: CodeTableVersionState) => ({
  type: ActionTypes.SET_CODE_TABLE_VERSION,
  payload: version,
});

export const setFeatureFlag = (features: any) => ({
  type: ActionTypes.SET_FEATURE_FLAG,
  payload: features,
});

export const toggleSidebar = () => ({
  type: ActionTypes.TOGGLE_SIDEBAR,
});

export const toggleLoading = (loading: boolean) => ({
  type: ActionTypes.TOGGLE_LOADING,
  payload: loading,
});

export const toggleNotification = (type: "success" | "info" | "warning" | "error", message: string) => ({
  type: ActionTypes.TOGGLE_NOTIFICATION,
  payload: { type, message },
});

export const toggleToast = (type: "success" | "info" | "warning" | "error", message: string) => ({
  type: ActionTypes.TOGGLE_NOTIFICATION,
  payload: { type, message },
});

export const clearNotification = () => ({
  type: ActionTypes.CLEAR_NOTIFICATION,
});

type ModalProperties = {
  modalSize: "sm" | "md" | "lg" | "xl";
  modalIsOpen?: boolean;
  modalIsStatic?: boolean;
  data?: any;
  modalType: string;
  callback?: (() => void) | null;
  hideCallback?: (() => void) | null;
};

export const openModal = ({
  modalType,
  callback,
  data,
  modalSize,
  hideCallback = null,
  modalIsStatic = false,
}: ModalProperties) => ({
  type: ActionTypes.SHOW_MODAL,
  modalType,
  callback,
  data,
  modalSize,
  hideCallback,
  modalIsStatic,
});

export const closeModal = () => ({
  type: ActionTypes.HIDE_MODAL,
});

export const setOfficerDefaultZone = (name: string, description: string) => ({
  type: ActionTypes.SET_DEFAULT_ZONE,
  payload: { name, description },
});

export const setOfficerAgency = (agency: string) => ({
  type: ActionTypes.SET_USER_AGENCY,
  payload: agency,
});

export const setActiveTab = (activeTab: string) => ({
  type: ActionTypes.SET_ACTIVE_TAB,
  payload: activeTab,
});

export const setActiveComplaintsViewType = (viewType: "list" | "map") => ({
  type: ActionTypes.SET_ACTIVE_COMPLAINTS_VIEW_TYPE,
  payload: viewType,
});

//-- selectors
export const alertCount = (state: RootState) => state.app.alerts;
export const isSidebarOpen = (state: RootState) => state.app.isSidebarOpen;

export const profileInitials = (state: RootState) => {
  const { profile } = state.app;
  return `${profile.surName?.substring(0, 1)}${profile.givenName?.substring(0, 1)}`;
};

export const userGuid = (state: RootState) => {
  const { profile } = state.app;
  return profile.idir;
};

export const appUserGuid = (state: RootState) => {
  const { profile } = state.app;
  return profile.appUserGuid;
};

export const userId = (state: RootState) => {
  const {
    profile: { idir_username },
  } = state.app;
  return idir_username as string;
};

export const profileDisplayName = (state: RootState) => {
  const { profile } = state.app;
  return `${profile.surName}, ${profile.givenName}`;
};

export const profileIdir = (state: RootState): UUID => {
  const { profile } = state.app;
  return `${profile.idir}`;
};

export const profileZone = (state: RootState): string => {
  const { profile } = state.app;
  return profile.zone;
};

export const profileZoneDescription = (state: RootState): string => {
  const { profile } = state.app;
  return profile.zoneDescription;
};

export const selectDefaultZone = (state: RootState): DropdownOption | null => {
  const {
    profile: { zone: value, zoneDescription: label },
  } = state.app;

  return value && label ? { value, label } : null;
};

export const selectDefaultRegion = (state: RootState): DropdownOption | null => {
  const {
    profile: { region: value, regionDescription: label },
  } = state.app;

  return value && label ? { value, label } : null;
};

export const selectDefaultParkArea = (state: RootState): DropdownOption | null => {
  const {
    profile: { parkAreaGuid: value },
  } = state.app;
  let label = "";

  const defaultParkArea = state.codeTables["park-area"].find((item) => item.parkAreaGuid === value);
  if (defaultParkArea) {
    label = defaultParkArea.name;
  }
  return value && label ? { value, label } : null;
};

export const selectModalOpenState = (state: RootState): boolean => {
  const { app } = state;
  return app.modalIsOpen;
};

export const selectModalSize = (state: RootState): "sm" | "lg" | "xl" | undefined => {
  const { app } = state;
  return app.modalSize;
};

export const selectModalStaticState = (state: RootState): boolean => {
  const { app } = state;
  return app.modalIsStatic;
};

export const selectModalType = (state: RootState): string => {
  const { app } = state;
  return app.modalType;
};

export const selectModalData = (state: RootState): any => {
  const { app } = state;
  return app.modalData;
};

export const selectCallback = (state: RootState): any => {
  const { app } = state;
  return app.callback;
};

export const selectClosingCallback = (state: RootState): any => {
  const { app } = state;
  return app.hideCallback;
};

export const isLoading = (state: RootState) => {
  const { loading } = state.app;
  const { isLoading: _isLoading } = loading;
  return _isLoading;
};

export const selectDefaultPageSize = (state: RootState): any => {
  const { app } = state;
  const configuration = app.configurations?.configurations?.find(
    (record) => Configurations.DEFAULT_PAGE_SIZE === record.configurationCode,
  );
  if (configuration?.configurationValue) {
    return +configuration.configurationValue;
  }
  return 50; // if there is no default in the configuration table, use 50 is the fallback
};

// get the maximum file size for uploading to COMS (in MB)
export const selectMaxFileSize = (state: RootState): any => {
  const { app } = state;
  const configuration = app.configurations?.configurations?.find(
    (record) => Configurations.MAX_FILES_SIZE === record.configurationCode,
  );
  if (configuration?.configurationValue) {
    return +configuration.configurationValue;
  }
  return 5000000; // if there is no default in the configuration table, use 5000000 as the default
};

export const selectNotification = (state: RootState): NotificationState => {
  const {
    app: { notifications },
  } = state;
  return notifications;
};

export const selectOfficerAgency = (state: RootState): string => {
  const {
    profile: { agency },
  } = state.app;

  return agency;
};

export const selectActiveTab = (state: RootState): string => {
  const {
    app: { activeTab },
  } = state;

  return activeTab;
};

export const selectActiveComplaintsViewType = (state: RootState): "list" | "map" => {
  const {
    app: { activeComplaintsViewType },
  } = state;

  return activeComplaintsViewType;
};

export const isFeatureActive =
  (featureCode: string) =>
  (state: RootState): boolean => {
    const features = state.app.featureFlags;
    return features.some(
      (feature: FeatureFlagState) => feature.featureCode === featureCode && feature.isActive === true,
    );
  };

export const listActiveFilters =
  () =>
  (state: RootState): ActiveFilters => {
    const features = state.app.featureFlags;
    const filters: ActiveFilters = {
      showActionTakenFilter: features.some(
        (feature: any) => feature.featureCode === FEATURE_TYPES.ACTION_TAKEN_FILTER && feature.isActive === true,
      ),
      showCommunityFilter: features.some(
        (feature: any) => feature.featureCode === FEATURE_TYPES.COMMUNITY_FILTER && feature.isActive === true,
      ),
      showParkFilter: features.some(
        (feature: any) => feature.featureCode === FEATURE_TYPES.PARK_COLUMN && feature.isActive === true,
      ),
      showDateFilter: features.some(
        (feature: any) => feature.featureCode === FEATURE_TYPES.DATE_LOGGED_FILTER && feature.isActive === true,
      ),
      showGirTypeFilter: features.some(
        (feature: any) => feature.featureCode === FEATURE_TYPES.GIR_FILTER && feature.isActive === true,
      ),
      showMethodFilter: features.some(
        (feature: any) => feature.featureCode === FEATURE_TYPES.METHOD_FILTER && feature.isActive === true,
      ),
      showNatureComplaintFilter: features.some(
        (feature: any) => feature.featureCode === FEATURE_TYPES.NATURE_FILTER && feature.isActive === true,
      ),
      showOfficerFilter: features.some(
        (feature: any) => feature.featureCode === FEATURE_TYPES.OFFICER_ASSIGNED_FILTER && feature.isActive === true,
      ),
      showRegionFilter: features.some(
        (feature: any) => feature.featureCode === FEATURE_TYPES.REGION_FILTER && feature.isActive === true,
      ),
      showSpeciesFilter: features.some(
        (feature: any) => feature.featureCode === FEATURE_TYPES.SPECIES_FILTER && feature.isActive === true,
      ),
      showStatusFilter: features.some(
        (feature: any) => feature.featureCode === FEATURE_TYPES.STATUS_FILTER && feature.isActive === true,
      ),
      showViolationFilter: features.some(
        (feature: any) => feature.featureCode === FEATURE_TYPES.VIOLATION_TYPE_FILTER && feature.isActive === true,
      ),
      showZoneFilter: features.some(
        (feature: any) => feature.featureCode === FEATURE_TYPES.ZONE_FILTER && feature.isActive === true,
      ),
      showOutcomeAnimalFilter: features.some(
        (feature: any) => feature.featureCode === FEATURE_TYPES.OUTCOME_ANIMAL_FILTER && feature.isActive === true,
      ),
      showOutcomeActionedByFilter: features.some(
        (feature: any) => feature.featureCode === FEATURE_TYPES.OUTCOME_ACTIONED_BY_FILTER && feature.isActive === true,
      ),
      showOutcomeAnimalDateFilter: features.some(
        (feature: any) => feature.featureCode === FEATURE_TYPES.OUTCOME_ANIMAL_DATE_FILTER && feature.isActive === true,
      ),
    };
    return filters;
  };

//-- thunks
export const getTokenProfile = (): AppThunk => async (dispatch) => {
  const token = localStorage.getItem(AUTH_TOKEN);

  if (token) {
    try {
      const decoded: SsoToken = jwtDecode<SsoToken>(token);
      const { given_name, family_name, email, idir_user_guid, idir_username } = decoded;
      let idir_user_guid_transformed: UUID;
      idir_user_guid_transformed = idir_user_guid as UUID;

      const parameters = generateApiParameters(
        `${config.API_BASE_URL}/v1/app-user/find-by-auth-user-guid/${idir_user_guid}`,
      );
      const response = await get<AppUser>(dispatch, parameters);

      //Update user_id and name if the idir_username is different
      if (response.user_id !== idir_username) {
        const updateUserIdParams = generateApiParameters(
          `${config.API_BASE_URL}/v1/app-user/${response.app_user_guid}`,
          {
            user_id: idir_username,
            first_name: given_name,
            last_name: family_name,
            coms_enrolled_ind: false,
          },
        );
        await patch<AppUser>(dispatch, updateUserIdParams);
      }

      let office = "";
      let region = "";
      let regionDescription = "";
      let zone = "";
      let zoneDescription = "";
      let agency = response.agency_code_ref;
      let appUserGuid = response.app_user_guid;
      let comsEnrolledInd = response.coms_enrolled_ind;
      let parkAreaGuid = response.park_area_guid;

      if (response.office_guid !== null) {
        const {
          office_guid: { cos_geo_org_unit: unit },
        } = response;

        office = unit.office_location_code;
        region = unit.region_code;
        regionDescription = unit.region_name;
        zone = unit.zone_code;
        zoneDescription = unit.zone_name;
      }

      if (!comsEnrolledInd) {
        try {
          const requestComsAccessParams = generateApiParameters(
            `${config.API_BASE_URL}/v1/app-user/request-coms-access/${response.app_user_guid}`,
          );
          const res = await put<AppUser>(dispatch, requestComsAccessParams);
          comsEnrolledInd = res.coms_enrolled_ind;
        } catch (error) {
          console.error(error);
        }
      }

      const profile: Profile = {
        givenName: given_name,
        surName: family_name,
        email: email,
        idir: idir_user_guid_transformed,
        idir_username: idir_username,
        office: office,
        region: region,
        regionDescription: regionDescription,
        zone: zone,
        zoneDescription: zoneDescription,
        agency,
        appUserGuid,
        comsEnrolledInd,
        parkAreaGuid,
      };

      dispatch(setTokenProfile(profile));
    } catch (error) {
      //-- handle error
      console.error(error);
    }
  } else {
    //-- the user is not logged in redirect them to the login
    window.location = config.KEYCLOAK_URL;
  }
};

export const getOfficerDefaultZone = (): AppThunk => async (dispatch) => {
  const token = localStorage.getItem(AUTH_TOKEN);

  if (token) {
    try {
      const decoded: SsoToken = jwtDecode<SsoToken>(token);
      const { idir_username } = decoded;

      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/app-user/find-by-userid/${idir_username}`);
      const response = await get<AppUser>(dispatch, parameters);

      if (response.office_guid !== null) {
        const {
          office_guid: { cos_geo_org_unit: unit, agency_code_ref },
        } = response;

        const { zone_code: name, zone_name: description } = unit;

        dispatch(setOfficerDefaultZone(name, description));
        dispatch(setOfficerAgency(agency_code_ref));
      }
    } catch (error) {
      //-- handler error
    }
  } else {
    //-- the user is not logged in redirect them to the login
    window.location = config.KEYCLOAK_URL;
  }
};

// Get list of the officers and update store
export const getConfigurations = (): AppThunk => async (dispatch) => {
  try {
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/configuration/`);
    const response = await get<Array<ConfigurationType>>(dispatch, parameters);

    if (response && from(response).any()) {
      dispatch(
        setConfigurations({
          configurations: response,
        }),
      );
    }
  } catch (error) {
    ToggleError("Unable to get configurations");
  }
};

export const getCodeTableVersion = (): AppThunk => async (dispatch) => {
  try {
    const state = store.getState();
    //Get previous codeTableVersion from store
    const {
      app: {
        codeTableVersion: { complaintManagement: prevComplaint, caseManagement: prevCase },
      },
    } = state;

    //Call new codeTableVersion from api
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/configuration/CDTABLEVER`);
    const response = await get<CodeTableVersionState>(dispatch, parameters);

    if (response) {
      const { complaintManagement: newComplaint, caseManagement: newCase } = response;

      //Compare previous version with new version
      if (Number(newComplaint.configurationValue) > Number(prevComplaint.configurationValue)) {
        dispatch(fetchComplaintCodeTables());
      }
      if (Number(newCase.configurationValue) > Number(prevCase.configurationValue)) {
        dispatch(fetchCaseCodeTables());
      }
      //set new version to redux store
      dispatch(setCodeTableVersion(response));
    }
  } catch (error) {
    ToggleError("Unable to get codeTableVersion");
  }
};

export const getFeatureFlag = (): AppThunk => async (dispatch) => {
  try {
    const agency = getUserAgency();
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/feature-flag/features-by-agency/${agency}`);
    const response: any = await get(dispatch, parameters);
    if (response) {
      dispatch(setFeatureFlag(response));
    }
  } catch (error) {
    ToggleError("Unable to get feature flag");
  }
};

export const validateComsAccess =
  (token: string): ThunkAction<Promise<ComsInviteResponse>, RootState, unknown, Action<string>> =>
  async (dispatch) => {
    try {
      const parameters = generateApiParameters(`${config.COMS_URL}/permission/invite/${token}`);
      await get(dispatch, parameters);
      return { status: "success" };
    } catch (error) {
      const { response } = error as AxiosError;
      return { status: "error", code: response?.status.toString() };
    }
  };

//-- reducer
const initialState: AppState = {
  alerts: 1,
  profile: {
    givenName: "",
    surName: "",
    email: "",
    idir: "" as UUID,
    idir_username: "",
    office: "",
    region: "",
    regionDescription: "",
    zone: "",
    zoneDescription: "",
    agency: "",
    appUserGuid: "",
    comsEnrolledInd: null,
    parkAreaGuid: null,
  },
  isSidebarOpen: false,

  loading: { isLoading: false },

  notifications: {
    type: "",
    message: "",
  },

  modalIsOpen: false,
  modalSize: undefined,
  modalIsStatic: false,
  modalData: undefined,
  modalType: "",
  callback: null,
  hideCallback: null,
  configurations: {
    configurations: undefined,
  },
  codeTableVersion: {
    complaintManagement: {
      configurationCode: "",
      configurationValue: "",
      activeInd: true,
    },
    caseManagement: {
      configurationCode: "",
      configurationValue: "",
      activeInd: true,
    },
  },
  featureFlags: [],
  activeTab: "HWCR",
  activeComplaintsViewType: "list",
};

const reducer = (state: AppState = initialState, action: any): AppState => {
  switch (action.type) {
    case ActionTypes.SET_TOKEN_PROFILE: {
      const { payload } = action;

      const profile: Profile = {
        givenName: payload.givenName,
        surName: payload.surName,
        email: payload.email,
        idir: payload.idir,
        idir_username: payload.idir_username,
        office: payload.office,
        region: payload.region,
        regionDescription: payload.regionDescription,
        zone: payload.zone,
        zoneDescription: payload.zoneDescription,
        agency: payload.agency,
        appUserGuid: payload.appUserGuid,
        comsEnrolledInd: payload.comsEnrolledInd,
        parkAreaGuid: payload.parkAreaGuid,
      };

      return { ...state, profile };
    }
    case ActionTypes.TOGGLE_SIDEBAR: {
      const { isSidebarOpen: isOpen } = state;
      return { ...state, isSidebarOpen: !isOpen };
    }
    case ActionTypes.SHOW_MODAL: {
      const {
        callback,

        data,
        hideCallback,
        modalIsStatic,
        modalSize,
        modalType,
      } = action;

      return {
        ...state,
        modalIsOpen: true,
        modalSize,
        modalData: data,
        modalType,
        modalIsStatic,
        callback,
        hideCallback,
      };
    }
    case ActionTypes.HIDE_MODAL: {
      return {
        ...state,
        modalIsOpen: false,
        modalSize: undefined,
        modalData: undefined,
        modalType: "",
        modalIsStatic: false,
        callback: null,
        hideCallback: null,
      };
    }

    case ActionTypes.TOGGLE_LOADING: {
      const { payload } = action;
      return { ...state, loading: { isLoading: payload } };
    }
    case ActionTypes.TOGGLE_NOTIFICATION: {
      const {
        payload: { type, message },
      } = action;

      const update = { type, message };

      return { ...state, notifications: update };
    }
    case ActionTypes.CLEAR_NOTIFICATION: {
      return { ...state, notifications: { type: "", message: "" } };
    }
    case ActionTypes.SET_DEFAULT_ZONE: {
      const {
        payload: { name, description },
      } = action;

      const { profile } = state;
      const update = { ...profile, zone: name, zoneDescription: description };

      return { ...state, profile: update };
    }
    case ActionTypes.SET_CONFIGURATIONS: {
      const {
        payload: { configurations },
      } = action;

      const configuration = { configurations };

      return { ...state, configurations: configuration };
    }
    case ActionTypes.SET_USER_AGENCY: {
      const { payload: agency } = action;
      const { profile } = state;
      const update = { ...profile, agency };

      return { ...state, profile: update };
    }
    case ActionTypes.SET_CODE_TABLE_VERSION: {
      const {
        payload: { complaintManagement, caseManagement },
      } = action;
      const update = { complaintManagement, caseManagement };
      return { ...state, codeTableVersion: update };
    }
    case ActionTypes.SET_FEATURE_FLAG: {
      const { payload } = action;
      return { ...state, featureFlags: payload };
    }
    case ActionTypes.SET_ACTIVE_TAB: {
      const { payload } = action;
      return { ...state, activeTab: payload };
    }
    case ActionTypes.SET_ACTIVE_COMPLAINTS_VIEW_TYPE: {
      const { payload } = action;
      return { ...state, activeComplaintsViewType: payload };
    }
    default:
      return state;
  }
};

export default reducer;
