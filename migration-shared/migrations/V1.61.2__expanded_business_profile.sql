-- Support for Business Aliases

CREATE TABLE
  alias (
    alias_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    business_guid uuid NOT NULL,
    name character varying(512) NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT NOW(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT alias_pk PRIMARY KEY (alias_guid),
    CONSTRAINT alias_business_fk
      FOREIGN KEY (business_guid)
      REFERENCES business (business_guid)
  );

COMMENT ON TABLE alias IS 'Contains alternative names or aliases associated with a business.';

COMMENT ON COLUMN alias.alias_guid IS 'The system-generated unique identifier for the alias record.';

COMMENT ON COLUMN alias.business_guid IS 'The unique identifier of the business to which the alias belongs.';

COMMENT ON COLUMN alias.name IS 'The alias name used to identify or reference the business.';

COMMENT ON COLUMN alias.active_ind IS 'A boolean indicator to determine if the alias is active.';

COMMENT ON COLUMN alias.create_user_id IS 'The id of the user that created the alias.';

COMMENT ON COLUMN alias.create_utc_timestamp IS 'The timestamp when the alias was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN alias.update_user_id IS 'The id of the user that updated the alias.';

COMMENT ON COLUMN alias.update_utc_timestamp IS 'The timestamp when the alias was updated. The timestamp is stored in UTC with no Offset.';

CREATE TABLE
  alias_h (
    h_alias_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

COMMENT ON TABLE alias_h IS 'Stores the audit history for alias records.';

COMMENT ON COLUMN alias_h.h_alias_guid IS 'The system-generated unique identifier for the alias history record.';

COMMENT ON COLUMN alias_h.target_row_id IS 'The unique identifier of the alias record affected by the operation.';

COMMENT ON COLUMN alias_h.operation_type IS 'The type of database operation executed on the alias record. For example I = Insert, U = Update, D = Delete.';

COMMENT ON COLUMN alias_h.operation_user_id IS 'The id of the user that executed the operation.';

COMMENT ON COLUMN alias_h.operation_executed_at IS 'The timestamp when the operation was executed. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN alias_h.data_after_executed_operation IS 'A JSON representation of the alias record after the operation was executed.';

ALTER TABLE alias_h
ADD CONSTRAINT pk_h_alias
PRIMARY KEY (h_alias_guid);

CREATE TRIGGER alias_history_trigger
BEFORE INSERT OR DELETE OR UPDATE
ON alias
FOR EACH ROW
EXECUTE FUNCTION audit_history ('alias_h', 'alias_guid');

-- Support for Business Identifiers

CREATE TABLE business_identifier_code (
    business_identifier_code character varying(16) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT business_identifier_code_pk
      PRIMARY KEY (business_identifier_code)
);

COMMENT ON TABLE shared.business_identifier_code IS 'Contains the list of business identifier types supported by the system. For example BNUM = Business Number, WSBC = WorkSafe BC';

COMMENT ON COLUMN shared.business_identifier_code.business_identifier_code IS 'A human readable code used to identify a business identifier type.';

COMMENT ON COLUMN shared.business_identifier_code.short_description IS 'The short description of the business identifier type.';

COMMENT ON COLUMN shared.business_identifier_code.long_description IS 'The long description of the business identifier type.';

COMMENT ON COLUMN shared.business_identifier_code.display_order IS 'The order in which the values of the business identifier type should be displayed when presented to a user in a list.';

COMMENT ON COLUMN shared.business_identifier_code.active_ind IS 'A boolean indicator to determine if a business identifier type is active.';

COMMENT ON COLUMN shared.business_identifier_code.create_user_id IS 'The id of the user that created the business identifier type.';

COMMENT ON COLUMN shared.business_identifier_code.create_utc_timestamp IS 'The timestamp when the business identifier type was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN shared.business_identifier_code.update_user_id IS 'The id of the user that updated the business identifier type.';

COMMENT ON COLUMN shared.business_identifier_code.update_utc_timestamp IS 'The timestamp when the business identifier type was updated. The timestamp is stored in UTC with no Offset.';

CREATE TABLE business_identifier (
    business_identifier_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    business_guid uuid NOT NULL,
    business_identifier_code character varying(16) NOT NULL,
    identifier_value character varying(256) NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT business_identifier_pk
      PRIMARY KEY (business_identifier_guid),
    CONSTRAINT business_identifier_business_fk
      FOREIGN KEY (business_guid)
      REFERENCES business (business_guid),
    CONSTRAINT business_identifier_code_fk
      FOREIGN KEY (business_identifier_code)
      REFERENCES shared.business_identifier_code (business_identifier_code)
);

COMMENT ON TABLE business_identifier IS 'Stores identifiers used to uniquely identify a business according to a specific identifier type.';

COMMENT ON COLUMN business_identifier.business_identifier_guid IS 'The system-generated unique identifier for the business identifier record.';

COMMENT ON COLUMN business_identifier.business_guid IS 'The unique identifier of the business associated with the identifier.';

COMMENT ON COLUMN business_identifier.business_identifier_code IS 'The code identifying the type of business identifier.';

COMMENT ON COLUMN business_identifier.identifier_value IS 'The value of the identifier as issued by the originating authority.';

COMMENT ON COLUMN business_identifier.active_ind IS 'A boolean indicator to determine if the business identifier is active.';

COMMENT ON COLUMN business_identifier.create_user_id IS 'The id of the user that created the business identifier.';

COMMENT ON COLUMN business_identifier.create_utc_timestamp IS 'The timestamp when the business identifier was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN business_identifier.update_user_id IS 'The id of the user that updated the business identifier.';

COMMENT ON COLUMN business_identifier.update_utc_timestamp IS 'The timestamp when the business identifier was updated. The timestamp is stored in UTC with no Offset.';

CREATE TABLE
  business_identifier_h (
    h_business_identifier_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

COMMENT ON TABLE business_identifier_h IS 'Stores the audit history for business identifier records.';

COMMENT ON COLUMN business_identifier_h.h_business_identifier_guid IS 'The system-generated unique identifier for the business identifier history record.';

COMMENT ON COLUMN business_identifier_h.target_row_id IS 'The unique identifier of the business identifier record affected by the operation.';

COMMENT ON COLUMN business_identifier_h.operation_type IS 'The type of database operation executed on the business identifier record. For example I = Insert, U = Update, D = Delete.';

COMMENT ON COLUMN business_identifier_h.operation_user_id IS 'The id of the user that executed the operation.';

COMMENT ON COLUMN business_identifier_h.operation_executed_at IS 'The timestamp when the operation was executed. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN business_identifier_h.data_after_executed_operation IS 'A JSON representation of the business identifier record after the operation was executed.';

ALTER TABLE business_identifier_h
ADD CONSTRAINT pk_h_business_identifier
PRIMARY KEY (h_business_identifier_guid);

CREATE TRIGGER business_identifier_history_trigger
BEFORE INSERT OR DELETE OR UPDATE
ON business_identifier
FOR EACH ROW
EXECUTE FUNCTION audit_history (
  'business_identifier_h',
  'business_identifier_guid'
);

-- Support for Direct Contacts

ALTER TABLE contact_method
ADD COLUMN business_guid uuid;

ALTER TABLE contact_method
ADD CONSTRAINT contact_method_business_fk
  FOREIGN KEY (business_guid)
  REFERENCES business (business_guid);

ALTER TABLE contact_method
ALTER COLUMN person_guid DROP NOT NULL;

ALTER TABLE contact_method
ADD CONSTRAINT contact_method_owner_chk
CHECK (
  (person_guid IS NOT NULL AND business_guid IS NULL)
  OR
  (person_guid IS NULL AND business_guid IS NOT NULL)
);

COMMENT ON COLUMN contact_method.business_guid IS 'The unique identifier of the business associated with the contact method. Exactly one of business_guid or person_guid must be populated.';

COMMENT ON COLUMN contact_method.person_guid IS 'The unique identifier of the person associated with the contact method. Exactly one of person_guid or business_guid must be populated.';

CREATE TABLE business_person_xref_code (
    business_person_xref_code character varying(16) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT business_person_xref_code_pk
      PRIMARY KEY (business_person_xref_code)
);

COMMENT ON TABLE shared.business_person_xref_code IS 'Contains the list of business to person associations. For example CONTACT = Business contact';
COMMENT ON COLUMN shared.business_person_xref_code.business_person_xref_code IS 'A human readable code used to identify a business to person association type.';
COMMENT ON COLUMN shared.business_person_xref_code.short_description IS 'The short description of the business to person association type.';
COMMENT ON COLUMN shared.business_person_xref_code.long_description IS 'The long description of the business to person association type.';
COMMENT ON COLUMN shared.business_person_xref_code.display_order IS 'The order in which the values of the business to person association type should be displayed when presented to a user in a list.';
COMMENT ON COLUMN shared.business_person_xref_code.active_ind IS 'A boolean indicator to determine if a business to person association type is active.';
COMMENT ON COLUMN shared.business_person_xref_code.create_user_id IS 'The id of the user that created the business to person association type.';
COMMENT ON COLUMN shared.business_person_xref_code.create_utc_timestamp IS 'The timestamp when the business to person association type was created. The timestamp is stored in UTC with no Offset.';
COMMENT ON COLUMN shared.business_person_xref_code.update_user_id IS 'The id of the user that updated the business to person association type.';
COMMENT ON COLUMN shared.business_person_xref_code.update_utc_timestamp IS 'The timestamp when the business to person association type was updated. The timestamp is stored in UTC with no Offset.';


CREATE TABLE business_person_xref (
    business_person_xref_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    business_guid uuid NOT NULL,
    person_guid uuid NOT NULL,
    business_person_xref_code character varying(16) NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT business_person_xref_pk
      PRIMARY KEY (business_person_xref_guid),
    CONSTRAINT business_person_xref_business_fk
      FOREIGN KEY (business_guid)
      REFERENCES business (business_guid),
    CONSTRAINT business_person_xref_person_fk
      FOREIGN KEY (person_guid)
      REFERENCES person (person_guid),
    CONSTRAINT business_person_xref_code_fk
      FOREIGN KEY (business_person_xref_code)
      REFERENCES shared.business_person_xref_code (business_person_xref_code)
);

COMMENT ON TABLE business_person_xref IS 'Associates a person to a business and defines the nature of the relationship between them.';
COMMENT ON COLUMN business_person_xref.business_person_xref_guid IS 'The system-generated unique identifier for the business to person relationship record.';
COMMENT ON COLUMN business_person_xref.business_guid IS 'The unique identifier of the business participating in the relationship.';
COMMENT ON COLUMN business_person_xref.person_guid IS 'The unique identifier of the person participating in the relationship.';
COMMENT ON COLUMN business_person_xref.business_person_xref_code IS 'A human readable code that identifies the type of relationship between the business and the person.';
COMMENT ON COLUMN business_person_xref.active_ind IS 'A boolean indicator to determine if the business to person relationship is active.';
COMMENT ON COLUMN business_person_xref.create_user_id IS 'The id of the user that created the business to person relationship.';
COMMENT ON COLUMN business_person_xref.create_utc_timestamp IS 'The timestamp when the business to person relationship was created. The timestamp is stored in UTC with no Offset.';
COMMENT ON COLUMN business_person_xref.update_user_id IS 'The id of the user that updated the business to person relationship.';
COMMENT ON COLUMN business_person_xref.update_utc_timestamp IS 'The timestamp when the business to person relationship was updated. The timestamp is stored in UTC with no Offset.';

CREATE TABLE business_person_xref_h (
    h_business_person_xref_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
);

ALTER TABLE business_person_xref_h
ADD CONSTRAINT pk_h_business_person_xref
PRIMARY KEY (h_business_person_xref_guid);

CREATE TRIGGER business_person_xref_history_trigger
BEFORE INSERT OR DELETE OR UPDATE
ON business_person_xref
FOR EACH ROW
EXECUTE FUNCTION audit_history (
  'business_person_xref_h',
  'business_person_xref_guid'
);

COMMENT ON TABLE business_person_xref_h IS 'Stores the audit history for business to person relationship records.';
COMMENT ON COLUMN business_person_xref_h.h_business_person_xref_guid IS 'The system-generated unique identifier for the business to person relationship history record.';
COMMENT ON COLUMN business_person_xref_h.target_row_id IS 'The unique identifier of the business to person relationship record affected by the operation.';
COMMENT ON COLUMN business_person_xref_h.operation_type IS 'The type of database operation executed on the business to person relationship record. For example I = Insert, U = Update, D = Delete.';
COMMENT ON COLUMN business_person_xref_h.operation_user_id IS 'The id of the user that executed the operation.';
COMMENT ON COLUMN business_person_xref_h.operation_executed_at IS 'The timestamp when the operation was executed. The timestamp is stored in UTC with no Offset.';
COMMENT ON COLUMN business_person_xref_h.data_after_executed_operation IS 'A JSON representation of the business to person relationship record after the operation was executed.';
