-- Index for inspection list/search filter + opened-date sort

CREATE INDEX IF NOT EXISTS idx_inspection_agency_status_opened
  ON inspection.inspection (owned_by_agency_ref, inspection_status, inspection_opened_utc_timestamp DESC NULLS LAST);
