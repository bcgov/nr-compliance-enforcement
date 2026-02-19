export interface UpdateLegislationConfigurationInput {
  legislationGuid: string;
  agencyCode: string;
  isEnabled?: boolean;
  overrideText?: string;
}
