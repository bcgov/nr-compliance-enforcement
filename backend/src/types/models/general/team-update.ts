export interface TeamUpdate {
  userIdir: string;
  adminIdirUsername: string;
  agencyCode: string;
  teamCode: string | null;
  roles: Array<{ name: string }>;
}
