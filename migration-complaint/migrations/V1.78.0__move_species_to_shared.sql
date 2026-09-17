ALTER TABLE complaint.hwcr_complaint
  DROP CONSTRAINT "FK_hwcrcmplnt_speciescd";

ALTER TABLE complaint.hwcr_complaint
  RENAME COLUMN species_code TO species_code_ref;

ALTER TABLE complaint.hwcr_complaint
  ALTER COLUMN species_code_ref TYPE character varying(16);

COMMENT ON COLUMN complaint.hwcr_complaint.species_code_ref IS 'A reference to the species of animal involved in the human wildlife conflict complaint. The value is a code from the shared.species_code table. No foreign key exists as the tables reside in different schemas.';

DROP TABLE complaint.species_code;