ALTER TABLE legislation_source
  ADD COLUMN IF NOT EXISTS acronym VARCHAR(16);

COMMENT ON COLUMN legislation_source.acronym IS 'Optional acronym for the act (e.g. EMA), displayed alongside the short description when selecting a contravention.';