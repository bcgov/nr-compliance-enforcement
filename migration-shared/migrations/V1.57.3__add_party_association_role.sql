CREATE TABLE shared.party_association_role_code  (
    party_association_role_code  character varying(16) NOT NULL,
    case_activity_type_code character varying(10) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer,
    active_ind boolean DEFAULT true NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


COMMENT ON TABLE shared.party_association_role_code  IS 'A table that holds party association roles.';
COMMENT ON COLUMN shared.party_association_role_code.party_association_role_code IS 'Primary key. Code representing role of the party. Examples of party types include: PTYOFINTRST = "Party of Interest", WITNESS = "Witness';
COMMENT ON COLUMN shared.party_association_role_code.case_activity_type_code IS 'Primary key. The reference to the associated case activity type.';
COMMENT ON COLUMN shared.party_association_role_code.short_description IS 'The short description of the party association role.  Used to store shorter versions of the long description when applicable.';
COMMENT ON COLUMN shared.party_association_role_code.long_description IS 'The long description of the party association role.  May contain additional detail not typically displayed in the application.';
COMMENT ON COLUMN shared.party_association_role_code.display_order IS 'The order in which the values of the party association roles should be displayed when presented to a user in a list.  Originally incremented by 10s to allow for new values to be easily added.';
COMMENT ON COLUMN shared.party_association_role_code.active_ind IS 'A boolean indicator to determine if the party association role is active.  Inactive values are still retained in the system for legacy data integrity but are not valid choices for new data being added.';
COMMENT ON COLUMN shared.party_association_role_code.create_user_id IS 'The id of the user that created the party association role.';
COMMENT ON COLUMN shared.party_association_role_code.create_utc_timestamp IS 'The timestamp when the party association role was created. The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN shared.party_association_role_code.update_user_id IS 'The id of the user that updated the party association role.';
COMMENT ON COLUMN shared.party_association_role_code.update_utc_timestamp IS 'The timestamp when the party association role was updated. The timestamp is stored in UTC with no offset.';


ALTER TABLE shared.party_association_role_code ADD CONSTRAINT "party_association_role_code_pkey" PRIMARY KEY (party_association_role_code, case_activity_type_code);
ALTER TABLE shared.party_association_role_code ADD CONSTRAINT party_association_role_code__activity_type_code_fk FOREIGN KEY (case_activity_type_code) REFERENCES case_activity_type_code (case_activity_type_code);

CREATE TRIGGER ptyascnrole_set_default_audit_values BEFORE UPDATE ON shared.party_association_role_code FOR EACH ROW EXECUTE FUNCTION shared.update_audit_columns();