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
    ADD COLUMN approximate_age_code character varying(16);

ALTER TABLE person
    ADD CONSTRAINT fk_person__approximate_age_code
    FOREIGN KEY (approximate_age_code)
    REFERENCES approximate_age_code (approximate_age_code);

COMMENT ON COLUMN shared.person.approximate_age_code IS 'The approximate age category of the person, used when no date of birth is known. References approximate_age_code.';

-- Replace sex with gender

ALTER TABLE person
    DROP CONSTRAINT fk_person__sex_code;

ALTER TABLE person
    DROP COLUMN sex_code;

DROP TABLE sex_code;

CREATE TABLE gender_code (
    gender_code character varying(16) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT gender_pk
      PRIMARY KEY (gender_code)
);

COMMENT ON TABLE shared.gender_code IS 'Contains the gender category options for a person. For example MN = Man/boy, NB = Non-binary, WM = Woman/girl.';

COMMENT ON COLUMN shared.gender_code.gender_code IS 'A human readable code used to identify a gender category.';

COMMENT ON COLUMN shared.gender_code.short_description IS 'The short description of the gender category.';

COMMENT ON COLUMN shared.gender_code.long_description IS 'The long description of the gender category.';

COMMENT ON COLUMN shared.gender_code.display_order IS 'The order in which the gender categories should be displayed when presented to a user in a list.';

COMMENT ON COLUMN shared.gender_code.active_ind IS 'A boolean indicator to determine if a gender category is active.';

COMMENT ON COLUMN shared.gender_code.create_user_id IS 'The id of the user that created the gender category.';

COMMENT ON COLUMN shared.gender_code.create_utc_timestamp IS 'The timestamp when the gender category was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN shared.gender_code.update_user_id IS 'The id of the user that updated the gender category.';

COMMENT ON COLUMN shared.gender_code.update_utc_timestamp IS 'The timestamp when the gender category was updated. The timestamp is stored in UTC with no Offset.';

ALTER TABLE person
    ADD COLUMN gender_code character varying(16);

ALTER TABLE person
    ADD CONSTRAINT fk_person__gender_code
    FOREIGN KEY (gender_code)
    REFERENCES gender_code (gender_code);

COMMENT ON COLUMN shared.person.gender_code IS 'The gender category of the person. References gender_code.';

-- Add DL Class and Jurisdiction

ALTER TABLE person
    DROP COLUMN drivers_license_jurisdiction;

ALTER TABLE person
    ADD COLUMN drivers_license_class character varying(128);

COMMENT ON COLUMN shared.person.drivers_license_class IS 'The class of the person''s driver''s licence.';

ALTER TABLE person
    ADD COLUMN drivers_license_country_code character varying(4);

ALTER TABLE person
    ADD CONSTRAINT fk_person__drivers_license_country_code
    FOREIGN KEY (drivers_license_country_code)
    REFERENCES country_code (country_code);

COMMENT ON COLUMN shared.person.drivers_license_country_code IS 'The country that issued the person''s driver''s licence. References country_code.';

-- Add subdivision of issue (FK to country_subdivision_code)
ALTER TABLE person
    ADD COLUMN drivers_license_country_subdivision_code character varying(16);

ALTER TABLE person
    ADD CONSTRAINT fk_person__drivers_license_country_subdivision_code
    FOREIGN KEY (drivers_license_country_subdivision_code)
    REFERENCES country_subdivision_code (country_subdivision_code);

COMMENT ON COLUMN shared.person.drivers_license_country_subdivision_code IS 'The country subdivision (province, state, etc.) that issued the person''s driver''s licence. References country_subdivision_code.';

