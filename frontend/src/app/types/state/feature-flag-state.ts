export interface FeatureFlagState {
  id: string;
  featureCode: string;
  shortDesc: string;
  longDesc: string;
  isActive: boolean;
}

export interface FeatureAgencyXref {
  feature_agency_xref_guid: string;
  agency_code_ref: string;
  active_ind: boolean;
  feature_code: {
    feature_code: string;
    short_description: string;
    long_description: string;
  };
}
