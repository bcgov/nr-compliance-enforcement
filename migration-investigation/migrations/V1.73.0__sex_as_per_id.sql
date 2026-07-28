-- Add sex as per ID for people.  Gender is no longer captured but remains for potential future use.

ALTER TABLE investigation_person
    ADD COLUMN sex_code_ref character varying(16);

COMMENT ON COLUMN investigation_person.sex_code_ref IS 'Unenforced FK to shared.sex_code.  The sex of the person as recorded on their ID.';
