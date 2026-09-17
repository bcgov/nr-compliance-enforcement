-- New Code table: Wildlife Management Unit Code

CREATE TABLE shared.wildlife_management_unit_code (
    wildlife_management_unit_code character varying(16) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT wildlife_management_unit_code_pk
      PRIMARY KEY (wildlife_management_unit_code)
);

COMMENT ON TABLE shared.wildlife_management_unit_code IS 'Contains the list of wildlife management units in British Columbia. For example 1-1 = Wildlife Management Unit 1-1 in Region 1.';

COMMENT ON COLUMN shared.wildlife_management_unit_code.wildlife_management_unit_code IS 'A human readable code used to identify a wildlife management unit.';

COMMENT ON COLUMN shared.wildlife_management_unit_code.short_description IS 'The short description of the wildlife management unit.';

COMMENT ON COLUMN shared.wildlife_management_unit_code.long_description IS 'The long description of the wildlife management unit.';

COMMENT ON COLUMN shared.wildlife_management_unit_code.display_order IS 'The order in which the values of the wildlife management unit should be displayed when presented to a user in a list.';

COMMENT ON COLUMN shared.wildlife_management_unit_code.active_ind IS 'A boolean indicator to determine if a wildlife management unit is active.';

COMMENT ON COLUMN shared.wildlife_management_unit_code.create_user_id IS 'The id of the user that created the wildlife management unit.';

COMMENT ON COLUMN shared.wildlife_management_unit_code.create_utc_timestamp IS 'The timestamp when the wildlife management unit was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN shared.wildlife_management_unit_code.update_user_id IS 'The id of the user that updated the wildlife management unit.';

COMMENT ON COLUMN shared.wildlife_management_unit_code.update_utc_timestamp IS 'The timestamp when the wildlife management unit was updated. The timestamp is stored in UTC with no Offset.';

-- New Code table: Species code

CREATE TABLE shared.species_code (
    species_code character varying(16) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    complaint_ind boolean NOT NULL DEFAULT true,
    large_carnivore_ind boolean NOT NULL DEFAULT false,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT species_code_pk
      PRIMARY KEY (species_code)
);

COMMENT ON TABLE shared.species_code IS 'Contains the list of animal species supported by the system. For example BLKBEAR = Black Bear, MOOSE = Moose.';

COMMENT ON COLUMN shared.species_code.species_code IS 'A human readable code used to identify a species.';

COMMENT ON COLUMN shared.species_code.short_description IS 'The short description of the species.';

COMMENT ON COLUMN shared.species_code.long_description IS 'The long description of the species.';

COMMENT ON COLUMN shared.species_code.display_order IS 'The order in which the values of the species should be displayed when presented to a user in a list.';

COMMENT ON COLUMN shared.species_code.active_ind IS 'A boolean indicator to determine if a species is active.';

COMMENT ON COLUMN shared.species_code.complaint_ind IS 'A boolean indicator to determine if a species is available for selection on a complaint.';

COMMENT ON COLUMN shared.species_code.large_carnivore_ind IS 'A boolean indicator to determine if a species is a large carnivore.';

COMMENT ON COLUMN shared.species_code.create_user_id IS 'The id of the user that created the species.';

COMMENT ON COLUMN shared.species_code.create_utc_timestamp IS 'The timestamp when the species was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN shared.species_code.update_user_id IS 'The id of the user that updated the species.';

COMMENT ON COLUMN shared.species_code.update_utc_timestamp IS 'The timestamp when the species was updated. The timestamp is stored in UTC with no Offset.';

-- Updates to legislation to support adding wildlife to contraventions

ALTER TABLE shared.legislation_source
  ADD COLUMN animal_information_display_code character(1) NOT NULL DEFAULT 'H';

ALTER TABLE shared.legislation_source
  ADD CONSTRAINT legislation_source_animal_information_display_code_ck
    CHECK (animal_information_display_code IN ('M', 'O', 'H'));

COMMENT ON COLUMN shared.legislation_source.animal_information_display_code IS 'Determines how animal information (species, quantity, wildlife management unit) behaves when recording a contravention against this legislation source. M = Mandatory, always visible and required. O = Optional, visible but not required. H = Hidden, not visible.';

