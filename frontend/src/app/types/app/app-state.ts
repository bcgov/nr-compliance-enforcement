import { CodeTableVersionState } from "../state/code-table-version-state";
import { ConfigurationState } from "../state/configuration-state";
import { LoadingState } from "../state/loading-state";
import { NotificationState } from "../state/notification-state";
import Profile from "./profile";

export interface AppState {
  alerts: number;
  profile: Profile;
  isSidebarOpen: boolean;

  //-- loading
  loading: LoadingState;

  //-- notifications
  notifications: NotificationState;

  //-- modal properties
  modalSize?: "sm" | "lg" | "xl";
  modalIsOpen: boolean;
  modalIsStatic: boolean;
  modalData: any;
  modalType: string;
  callback: (() => void) | null;
  hideCallback: (() => void) | null;

  configurations: ConfigurationState;
  codeTableVersion: CodeTableVersionState;

  featureFlag: any;
}
