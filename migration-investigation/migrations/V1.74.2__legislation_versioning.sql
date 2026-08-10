-- Delete existing contravention data as a part of adding legislation versioning

DELETE FROM investigation.ticket;
DELETE FROM investigation.enforcement_action;
DELETE FROM investigation.contravention_party_xref;
DELETE FROM investigation.contravention;

-- Indexes for legislation reference lookups (version contravention stats, disable checks) and date-based validation

CREATE INDEX IF NOT EXISTS idx_contravention_legislation_guid_ref
  ON investigation.contravention (legislation_guid_ref);

CREATE INDEX IF NOT EXISTS idx_contravention_contravention_date
  ON investigation.contravention (contravention_date);
