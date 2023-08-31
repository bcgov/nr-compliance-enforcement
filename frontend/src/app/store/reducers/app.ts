import { AppState } from "../../types/app/app-state";
import { AppThunk, RootState } from "../store";
import { SsoToken } from "../../types/app/sso-token";
import jwtDecode from "jwt-decode";
import Profile from "../../types/app/profile";
import { UUID } from "crypto";
import { Officer } from "../../types/person/person";
import config from "../../../config";
import { generateApiParameters, get } from "../../common/api";
import { AUTH_TOKEN } from "../../service/user-service";
import { DropdownOption } from "../../types/code-tables/option";

enum ActionTypes {
  SET_TOKEN_PROFILE = "app/SET_TOKEN_PROFILE",
  TOGGLE_SIDEBAR = "app/TOGGLE_SIDEBAR",
  SHOW_MODAL = "app/SHOW_MODAL",
  HIDE_MODAL = "app/HIDE_MODAL",
  TOGGLE_LOADING = "app/TOGGLE_LOADING",
  TOGGLE_NOTIFICATION = "app/TOGGLE_NOTIFICATION",
}
//-- action creators

export const setTokenProfile = (profile: Profile) => ({
  type: ActionTypes.SET_TOKEN_PROFILE,
  payload: profile,
});

export const toggleSidebar = () => ({
  type: ActionTypes.TOGGLE_SIDEBAR,
});

export const toggleLoading = (loading: boolean) => ({
  type: ActionTypes.TOGGLE_LOADING,
  payload: loading,
});

export const toggleNotification = (
  type: "success" | "info" | "warning" | "error",
  message: string
) => ({
  type: ActionTypes.TOGGLE_NOTIFICATION,
  payload: { type, message },
});

export const toggleToast = (
  type: "success" | "info" | "warning" | "error",
  message: string
) => ({
  type: ActionTypes.TOGGLE_NOTIFICATION,
  payload: { type, message },
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

//-- selectors
export const alertCount = (state: RootState) => state.app.alerts;
export const isSidebarOpen = (state: RootState) => state.app.isSidebarOpen;

export const profileInitials = (state: RootState) => {
  const { profile } = state.app;
  return `${profile.givenName?.substring(0, 1)}${profile.surName?.substring(
    0,
    1
  )}`;
};

export const userGuid = (state: RootState) => {
  const { profile } = state.app;
  return profile.idir;
};

export const userId = (state: RootState) => {
  const { profile } = state.app;
  return profile.idir_username;
};

export const profileDisplayName = (state: RootState) => {
  const { profile } = state.app;
  return `${profile.givenName} ${profile.surName}`;
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

export const selectModalOpenState = (state: RootState): boolean => {
  const { app } = state;
  return app.modalIsOpen;
};

export const selectModalSize = (
  state: RootState
): "sm" | "lg" | "xl" | undefined => {
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

//-- thunks
export const getTokenProfile = (): AppThunk => async (dispatch) => {
  const token = localStorage.getItem(AUTH_TOKEN);

  if (token) {
    dispatch(toggleLoading(true));
    try {
      const decoded: SsoToken = jwtDecode<SsoToken>(token);
      const { given_name, family_name, email, idir_user_guid, idir_username } =
        decoded;
      let idir_user_guid_transformed: UUID;
      idir_user_guid_transformed = idir_user_guid as UUID;

      const parameters = generateApiParameters(
        `${config.API_BASE_URL}/v1/officer/find-by-userid/${idir_username}`
      );
      const response = await get<Officer>(dispatch, parameters);

      let office = "";
      let region = "";
      let zone = "";
      let zoneDescription = "";

      if (response.office_guid !== null) {
        const {
          office_guid: { cos_geo_org_unit: unit },
        } = response;

        office = unit.office_location_code;
        region = unit.region_code;
        zone = unit.zone_code;
        zoneDescription = unit.zone_name;
      }

      const profile: Profile = {
        givenName: given_name,
        surName: family_name,
        email: email,
        idir: idir_user_guid_transformed,
        idir_username: idir_username,
        office: office,
        region: region,
        zone: zone,
        zoneDescription: zoneDescription,
      };

      dispatch(setTokenProfile(profile));
    } catch (error) {
      //-- handler error
    } finally {
      dispatch(toggleLoading(false));
    }
  } else {
    //-- the user is not logged in redirect them to the login
    window.location = config.KEYCLOAK_URL;
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
    zone: "",
    zoneDescription: "",
  },
  isSidebarOpen: true,

  loading: { isLoading: false, count: 0 },

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
        zone: payload.zone,
        zoneDescription: payload.zoneDescription,
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
      const {
        loading: { count },
      } = state;
      const { payload } = action;

      if (payload) {
        let updateCount = count + 1;
        return { ...state, loading: { isLoading: true, count: updateCount } };
      }

      if (!payload) {
        let updateCount = count !== 0 ? count - 1 : 0;
        let updateIsLoading = updateCount !== 0;

        return {
          ...state,
          loading: { isLoading: updateIsLoading, count: updateCount },
        };
      }

      return { ...state };
    }
    case ActionTypes.TOGGLE_NOTIFICATION: {
      const {
        payload: { type, message },
      } = action;

      const update = { type, message };

      return { ...state, notifications: update };
    }
    default:
      return state;
  }
};

export default reducer;
