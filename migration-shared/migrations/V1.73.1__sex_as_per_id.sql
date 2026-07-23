-- Add sex as per ID for people.  Gender is no longer captured but remains for potential future use.
-- The sex_code table is shared by both people and wildlife outcomes.

CREATE TABLE sex_code (
    sex_code character varying(16) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT sex_pk
      PRIMARY KEY (sex_code)
);

COMMENT ON TABLE shared.sex_code IS 'Contains the sex options used by both people (as recorded on their government-issued ID) and wildlife. For example M = Male, F = Female, U = Unknown, X = Unspecified or another gender.';

COMMENT ON COLUMN shared.sex_code.sex_code IS 'A human readable code used to identify a sex.';

COMMENT ON COLUMN shared.sex_code.short_description IS 'The short description of the sex.';

COMMENT ON COLUMN shared.sex_code.long_description IS 'The long description of the sex.';

COMMENT ON COLUMN shared.sex_code.display_order IS 'The order in which the sexes should be displayed when presented to a user in a list.';

COMMENT ON COLUMN shared.sex_code.active_ind IS 'A boolean indicator to determine if a sex is active.';

COMMENT ON COLUMN shared.sex_code.create_user_id IS 'The id of the user that created the sex.';

COMMENT ON COLUMN shared.sex_code.create_utc_timestamp IS 'The timestamp when the sex was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN shared.sex_code.update_user_id IS 'The id of the user that updated the sex.';

COMMENT ON COLUMN shared.sex_code.update_utc_timestamp IS 'The timestamp when the sex was updated. The timestamp is stored in UTC with no Offset.';

ALTER TABLE person
    ADD COLUMN sex_code character varying(16);

ALTER TABLE person
    ADD CONSTRAINT fk_person__sex_code
    FOREIGN KEY (sex_code)
    REFERENCES sex_code (sex_code);

COMMENT ON COLUMN shared.person.sex_code IS 'The sex of the person as recorded on their ID. References sex_code.';
