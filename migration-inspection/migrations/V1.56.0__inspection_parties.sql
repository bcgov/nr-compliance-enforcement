CREATE TABLE inspection_party (
    inspection_party_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL PRIMARY KEY,
    party_guid_ref uuid,
    party_type_code_ref character varying(16) NOT NULL,
    inspection_guid uuid NOT NULL,
    active_ind boolean default true NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT fk_inspection_guid FOREIGN KEY (inspection_guid) REFERENCES inspection (inspection_guid)
);

CREATE UNIQUE INDEX uq_active_inspection_party_per_inspection
ON inspection_party (inspection_guid, party_guid_ref)
WHERE active_ind = true;

CREATE TABLE inspection_person (
    inspection_person_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL PRIMARY KEY,
    person_guid_ref uuid,
    inspection_party_guid uuid,
    first_name character varying(128) NOT NULL,
    middle_name character varying(128),
    middle_name_2 character varying(128),
    last_name character varying(128) NOT NULL,
    active_ind boolean default true NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT fk_inspection_party_guid FOREIGN KEY (inspection_party_guid) REFERENCES inspection_party (inspection_party_guid)
);

CREATE UNIQUE INDEX uq_active_inspection_person_per_party
ON inspection_person (inspection_party_guid, person_guid_ref)
WHERE active_ind = true;

CREATE TABLE inspection_business (
    inspection_business_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL PRIMARY KEY,
    business_guid_ref uuid,
    inspection_party_guid uuid,
    name character varying(128) NOT NULL,
    active_ind boolean default true NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT fk_inspection_party_guid FOREIGN KEY (inspection_party_guid) REFERENCES inspection_party (inspection_party_guid)
);

CREATE UNIQUE INDEX uq_active_inspection_business_per_party
ON inspection_business (inspection_party_guid, business_guid_ref)
WHERE active_ind = true;

CREATE TABLE inspection_party_h (
    h_inspection_party_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL PRIMARY KEY,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);

CREATE TABLE inspection_person_h (
    h_inspection_person_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL PRIMARY KEY,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);

CREATE TABLE inspection_business_h (
    h_inspection_business_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL PRIMARY KEY,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);

CREATE TRIGGER inspection_party_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON inspection_party FOR EACH ROW EXECUTE FUNCTION inspection.audit_history('inspection_party_h', 'inspection_party_guid');
CREATE TRIGGER inspection_person_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON inspection_person FOR EACH ROW EXECUTE FUNCTION inspection.audit_history('inspection_person_h', 'inspection_person_guid');
CREATE TRIGGER inspection_business_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON inspection_business FOR EACH ROW EXECUTE FUNCTION inspection.audit_history('inspection_business_h', 'inspection_business_guid');

COMMENT ON TABLE inspection_party IS 'A table that holds parties of interest for an inspection';
COMMENT ON COLUMN inspection_party.inspection_party_guid IS 'Primary key: System generated unique identifier for a party.';
COMMENT ON COLUMN inspection_party.party_guid_ref IS 'Cross schema foreign key (unenforced) to shared.party table to indicate the shared party record this party was created from or currently linked to.';
COMMENT ON COLUMN inspection_party.party_type_code_ref IS 'Cross schema foreign key (unenforced) to shared.party table to provide a human readable code representing a party type.';
COMMENT ON COLUMN inspection_party.inspection_guid IS 'Foreign key: System generated unique identifier for an inspection';
COMMENT ON COLUMN inspection_party.active_ind IS 'True if the party is currently attached to the inspection, false if it was previously attached and then removed.';
COMMENT ON COLUMN inspection_party.create_user_id IS 'The id of the user that created the party.';
COMMENT ON COLUMN inspection_party.create_utc_timestamp IS 'The timestamp when the party was created. The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN inspection_party.update_user_id IS 'The id of the user that updated the party.';
COMMENT ON COLUMN inspection_party.update_utc_timestamp IS 'The timestamp when the party was updated. The timestamp is stored in UTC with no offset.';

COMMENT ON TABLE inspection_person IS 'Stores personal information for individuals, including names and in the future other attributes.';
COMMENT ON COLUMN inspection_person.inspection_person_guid IS 'Primary key: System generated unique identifier for a person.';
COMMENT ON COLUMN inspection_person.person_guid_ref IS 'Cross schema foreign key (unenforced) to shared.person table to indicate the shared person record this party was created from or currently linked to.';
COMMENT ON COLUMN inspection_person.inspection_party_guid IS 'Foreign key: System generated unique identifier for a party.';
COMMENT ON COLUMN inspection_person.first_name IS 'First or given name of the person.';
COMMENT ON COLUMN inspection_person.middle_name IS 'Second or middle name of the person.';
COMMENT ON COLUMN inspection_person.middle_name_2 IS 'Additional Second or middle name of the person.';
COMMENT ON COLUMN inspection_person.last_name IS 'Last name or surname of the person.';
COMMENT ON COLUMN inspection_person.active_ind IS 'A value of true indicates this is the latest version of the record.   A value of false indicates that a newer version of the record is available.';
COMMENT ON COLUMN inspection_person.create_user_id IS 'The id of the user that created the person.';
COMMENT ON COLUMN inspection_person.create_utc_timestamp IS 'The timestamp when the person was created. The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN inspection_person.update_user_id IS 'The id of the user that updated the person.';
COMMENT ON COLUMN inspection_person.update_utc_timestamp IS 'The timestamp when the person was updated. The timestamp is stored in UTC with no offset.';

COMMENT ON TABLE inspection_business IS 'Stores organizational information on business entities, including names and in the future other attributes.';
COMMENT ON COLUMN inspection_business.inspection_business_guid IS 'Primary key: System generated unique identifier for a business.';
COMMENT ON COLUMN inspection_business.business_guid_ref IS 'Cross schema foreign key (unenforced) to shared.business table to indicate the shared business record this party was created from or currently linked to.';
COMMENT ON COLUMN inspection_business.inspection_party_guid IS 'Foreign key: System generated unique identifier for a party.';
COMMENT ON COLUMN inspection_business.name IS 'Name of the business.';
COMMENT ON COLUMN inspection_business.active_ind IS 'A value of true indicates this is the latest version of the record.   A value of false indicates that a newer version of the record is available.';
COMMENT ON COLUMN inspection_business.create_user_id IS 'The id of the user that created the business.';
COMMENT ON COLUMN inspection_business.create_utc_timestamp IS 'The timestamp when the business was created. The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN inspection_business.update_user_id IS 'The id of the user that updated the business.';
COMMENT ON COLUMN inspection_business.update_utc_timestamp IS 'The timestamp when the business was updated. The timestamp is stored in UTC with no offset.';

COMMENT ON TABLE inspection_party_h IS 'History table for party table';
COMMENT ON COLUMN inspection_party_h.h_inspection_party_guid IS 'Primary key: System generated unique identifier for a party history record.';
COMMENT ON COLUMN inspection_party_h.target_row_id IS 'The unique key for the party that has been created or modified.';
COMMENT ON COLUMN inspection_party_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT ON COLUMN inspection_party_h.operation_user_id IS 'The id of the user that created or modified the data in the party table.  Defaults to the logged in user if not passed in by the application.';
COMMENT ON COLUMN inspection_party_h.operation_executed_at IS 'The timestamp when the data in the party table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT ON COLUMN inspection_party_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.';

COMMENT ON TABLE inspection_person_h IS 'History table for person table';
COMMENT ON COLUMN inspection_person_h.h_inspection_person_guid IS 'Primary key: System generated unique identifier for a person history record.';
COMMENT ON COLUMN inspection_person_h.target_row_id IS 'The unique key for the person that has been created or modified.';
COMMENT ON COLUMN inspection_person_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT ON COLUMN inspection_person_h.operation_user_id IS 'The id of the user that created or modified the data in the person table.  Defaults to the logged in user if not passed in by the application.';
COMMENT ON COLUMN inspection_person_h.operation_executed_at IS 'The timestamp when the data in the person table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT ON COLUMN inspection_person_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';

COMMENT ON TABLE inspection_business_h IS 'History table for business table';
COMMENT ON COLUMN inspection_business_h.h_inspection_business_guid IS 'Primary key: System generated unique identifier for a business history record.';
COMMENT ON COLUMN inspection_business_h.target_row_id IS 'The unique key for the business that has been created or modified.';
COMMENT ON COLUMN inspection_business_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';
COMMENT ON COLUMN inspection_business_h.operation_user_id IS 'The id of the user that created or modified the data in the business table.  Defaults to the logged in user if not passed in by the application.';
COMMENT ON COLUMN inspection_business_h.operation_executed_at IS 'The timestamp when the data in the business table was created or modified.  The timestamp is stored in UTC with no Offset.';
COMMENT ON COLUMN inspection_business_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.';

