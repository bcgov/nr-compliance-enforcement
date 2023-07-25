import Profile from "./profile";
import { isLoading } from '../../store/reducers/app';

export interface AppState {
  alerts: number;
  profile: Profile;
  isSidebarOpen: boolean;

  //-- loading
  loading: LoadingState;

  //-- modal properties
  modalSize?: "sm" | "lg" | "xl";
  modalIsOpen: boolean;
  modalIsStatic: boolean;
  modalData: any;
  modalType: string;
  callback: (() => void) | null;
  hideCallback: (() => void) | null;
}
