ALTER TABLE shared.party
ADD COLUMN active_ind boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN shared.party.active_ind IS 'Indicates whether the global party profile is active. Set false when the party is removed from its last investigation or inspection.';
