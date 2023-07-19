import Profile from "./profile";

export interface AppState {
  alerts: number;
  profile: Profile;
  isSidebarOpen: boolean;

  //-- loading
  loading: boolean;
  
  //-- modal properties
  modalSize?: "sm" | "lg" | "xl";
  modalIsOpen: boolean;
  modalIsStatic: boolean;
  modalData: any;
  modalType: string;
  callback: (() => void) | null;
  hideCallback: (() => void) | null;
}
