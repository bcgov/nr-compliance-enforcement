ALTER TABLE investigation.contravention
  ADD COLUMN wildlife_management_unit_code_ref character varying(16),
  ADD COLUMN species_code_ref character varying(16),
  ADD COLUMN species_other_text character varying(256),
  ADD COLUMN quantity integer;
  
COMMENT ON COLUMN investigation.contravention.species_code_ref IS 'Unenforced foreign key to shared.species.species_code. A reference to the species of animal involved in the contravention.';

COMMENT ON COLUMN investigation.contravention.species_other_text IS 'The user entered description of the species of animal involved in the contravention. This value is only populated when the species is recorded as other.';

COMMENT ON COLUMN investigation.contravention.quantity IS 'The number of animals of the recorded species involved in the contravention.';

COMMENT ON COLUMN investigation.contravention.wildlife_management_unit_code_ref IS 'Unenforced foreign key to shared.wildlife_managinment_unit_code.wildlife_management_unit_code.  A reference to the wildlife management unit in which the contravention involving an animal occurred.';