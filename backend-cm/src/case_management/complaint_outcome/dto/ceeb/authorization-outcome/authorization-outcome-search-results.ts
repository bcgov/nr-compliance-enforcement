export interface AuthorizationOutcomeSearchResults {
  authorization_permit: { authorization_permit_guid: string; authorization_permit_id: string }[];
  site: { site_guid: string; site_id: string }[];
}
