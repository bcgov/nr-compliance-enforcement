import { CodeTableVersionState } from "@apptypes/state/code-table-version-state";
import { ConfigurationState } from "@apptypes/state/configuration-state";
import { FeatureFlagState } from "@apptypes/state/feature-flag-state";
import { LoadingState } from "@apptypes/state/loading-state";
import { NotificationState } from "@apptypes/state/notification-state";
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

  featureFlags: Array<FeatureFlagState>;
  activeTab: string;
}
