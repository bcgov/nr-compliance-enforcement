-- Performance indexes for the complaint list/search, related-data and RLS referral paths (CE-2455).

CREATE INDEX IF NOT EXISTS idx_complaint_status_code_incident_reported
  ON complaint.complaint (complaint_status_code, incident_reported_utc_timestmp DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_complaint_owned_agency_status_incident_reported
  ON complaint.complaint (owned_by_agency_code_ref, complaint_status_code, incident_reported_utc_timestmp DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_complaint_geo_org_status_incident_reported
  ON complaint.complaint (geo_organization_unit_code, complaint_status_code, incident_reported_utc_timestmp DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_complaint_park_guid
  ON complaint.complaint (park_guid);

CREATE INDEX IF NOT EXISTS idx_complaint_referral_referred_by_agency_code_ref
  ON complaint.complaint_referral (referred_by_agency_code_ref);

CREATE INDEX IF NOT EXISTS idx_complaint_referral_complaint_identifier
  ON complaint.complaint_referral (complaint_identifier);

CREATE INDEX IF NOT EXISTS idx_app_user_complaint_xref_complaint_identifier_active
  ON complaint.app_user_complaint_xref (complaint_identifier)
  WHERE active_ind = true;

CREATE INDEX IF NOT EXISTS idx_action_taken_complaint_identifier
  ON complaint.action_taken (complaint_identifier);

CREATE INDEX IF NOT EXISTS idx_complaint_update_complaint_identifier
  ON complaint.complaint_update (complaint_identifier);
