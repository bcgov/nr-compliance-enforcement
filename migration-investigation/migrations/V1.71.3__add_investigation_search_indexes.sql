-- Index for the investigation list/search filter + opened-date sort

CREATE INDEX IF NOT EXISTS idx_investigation_agency_status_opened
  ON investigation.investigation (owned_by_agency_ref, investigation_status, investigation_opened_utc_timestamp DESC NULLS LAST);
