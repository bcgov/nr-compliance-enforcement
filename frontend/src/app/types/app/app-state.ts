import Profile from "./profile";

export interface AppState {
    alerts: number;
    profile: Profile;
    isSidebarOpen: boolean
  }