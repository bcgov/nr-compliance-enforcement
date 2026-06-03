-- Approximate age

CREATE TABLE approximate_age_code (
    approximate_age_code character varying(16) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT approximate_age_pk
      PRIMARY KEY (approximate_age_code)
);

COMMENT ON TABLE shared.approximate_age_code IS 'Contains the approximate age category options for a person when no date of birth is known. For example 18UNDER = 18 and under, 19TO39 = 19 to 39 years.';

COMMENT ON COLUMN shared.approximate_age_code.approximate_age_code IS 'A human readable code used to identify an approximate age category.';

COMMENT ON COLUMN shared.approximate_age_code.short_description IS 'The short description of the approximate age category.';

COMMENT ON COLUMN shared.approximate_age_code.long_description IS 'The long description of the approximate age category.';

COMMENT ON COLUMN shared.approximate_age_code.display_order IS 'The order in which the approximate age categories should be displayed when presented to a user in a list.';

COMMENT ON COLUMN shared.approximate_age_code.active_ind IS 'A boolean indicator to determine if an approximate age category is active.';

COMMENT ON COLUMN shared.approximate_age_code.create_user_id IS 'The id of the user that created the approximate age category.';

COMMENT ON COLUMN shared.approximate_age_code.create_utc_timestamp IS 'The timestamp when the approximate age category was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN shared.approximate_age_code.update_user_id IS 'The id of the user that updated the approximate age category.';

COMMENT ON COLUMN shared.approximate_age_code.update_utc_timestamp IS 'The timestamp when the approximate age category was updated. The timestamp is stored in UTC with no Offset.';

ALTER TABLE person
    ADD COLUMN approximate_age_code character varying(10);

ALTER TABLE person
    ADD CONSTRAINT fk_person__approximate_age_code
    FOREIGN KEY (approximate_age_code)
    REFERENCES approximate_age_code (approximate_age_code);

COMMENT ON COLUMN shared.person.approximate_age_code IS 'The approximate age category of the person, used when no date of birth is known. References approximate_age_code.';