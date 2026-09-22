ALTER TABLE complaint_outcome.wildlife
  RENAME COLUMN species_code TO species_code_ref;

ALTER TABLE complaint_outcome.wildlife
  ALTER COLUMN species_code_ref TYPE character varying(16);

COMMENT ON COLUMN complaint_outcome.wildlife.species_code_ref IS 'Unenforced foreign key to shared.species_code.species_code. A reference to the species of animal involved in the outcome of the human wildlife conflict complaint.';