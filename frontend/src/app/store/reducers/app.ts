import { AppState } from "../../types/app/app-state";
import { AppThunk, RootState } from "../store";
import { SsoToken } from "../../types/app/sso-token";
import jwtDecode from "jwt-decode";
import Profile from "../../types/app/profile";
import { UUID } from "crypto";
import axios from "axios";
import { Officer } from "../../types/person/person";
import config from "../../../config";

enum ActionTypes {
  SET_TOKEN_PROFILE = "app/SET_TOKEN_PROFILE",
  TOGGLE_SIDEBAR = "app/TOGGLE_SIDEBAR",
  SHOW_MODAL = "app/SHOW_MODAL",
  HIDE_MODAL = "app/HIDE_MODAL",
}
//-- action creators

export const setTokenProfile = (profile: Profile) => ({
  type: ActionTypes.SET_TOKEN_PROFILE,
  payload: profile,
});

export const toggleSidebar = () => ({
  type: ActionTypes.TOGGLE_SIDEBAR,
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
  return `${profile.zone}`;
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

//-- thunks
export const getTokenProfile = (): AppThunk => async (dispatch) => {
  const token = localStorage.getItem("user");
  if (token) {
    const decoded: SsoToken = jwtDecode<SsoToken>(token);
    const { given_name, family_name, email, idir_user_guid, idir_username } = decoded;
    let idir_user_guid_transformed: UUID;
    idir_user_guid_transformed = idir_user_guid as UUID;

    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const response = await axios.get<Officer>(`${config.API_BASE_URL}/v1/officer/find-by-userid/${idir_username}`);
    const profile: Profile = {
      givenName: given_name,
      surName: family_name,
      email: email,
      idir: idir_user_guid_transformed,
      idir_username: idir_username,
      office: response.data.office_guid.cos_geo_org_unit.office_location_code,
      region: response.data.office_guid.cos_geo_org_unit.region_code,
      zone: response.data.office_guid.cos_geo_org_unit.zone_code,
    };

    dispatch(setTokenProfile(profile));
  }
};

//-- reducer
const initialState: AppState = {
  alerts: 1,
  profile: { givenName: "", surName: "", email: "", idir: "" as UUID, idir_username: "", office: "", region: "", zone: "" },
  isSidebarOpen: true,

  modalIsOpen: false,
  modalSize: undefined,
  modalIsStatic: false,
  modalData: undefined,
  modalType: "",
  callback: null,
  hideCallback: null
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
        zone: payload.zone
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
    default:
      return state;
  }
};

export default reducer;
