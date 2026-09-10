-- External IDs for parties

CREATE TABLE party_external_id_code (
    party_external_id_code character varying(16) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT party_external_id_code_pk
      PRIMARY KEY (party_external_id_code)
);

COMMENT ON TABLE shared.party_external_id_code IS 'Contains the list of external identifier types supported by the system. For example FWID = Fish and wildlife ID, WIN = Winchester ID.';

COMMENT ON COLUMN shared.party_external_id_code.party_external_id_code IS 'A human readable code used to identify an external identifier type.';

COMMENT ON COLUMN shared.party_external_id_code.short_description IS 'The short description of the external identifier type.';

COMMENT ON COLUMN shared.party_external_id_code.long_description IS 'The long description of the external identifier type.';

COMMENT ON COLUMN shared.party_external_id_code.display_order IS 'The order in which the values of the external identifier type should be displayed when presented to a user in a list.';

COMMENT ON COLUMN shared.party_external_id_code.active_ind IS 'A boolean indicator to determine if an external identifier type is active.';

COMMENT ON COLUMN shared.party_external_id_code.create_user_id IS 'The id of the user that created the external identifier type.';

COMMENT ON COLUMN shared.party_external_id_code.create_utc_timestamp IS 'The timestamp when the external identifier type was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN shared.party_external_id_code.update_user_id IS 'The id of the user that updated the external identifier type.';

COMMENT ON COLUMN shared.party_external_id_code.update_utc_timestamp IS 'The timestamp when the external identifier type was updated. The timestamp is stored in UTC with no Offset.';


CREATE TABLE party_external_id (
    party_external_id_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    party_guid uuid NOT NULL,
    party_external_id_code character varying(16) NOT NULL,
    external_id_value character varying(64) NOT NULL,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now(),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT party_external_id_pk
      PRIMARY KEY (party_external_id_guid),
    CONSTRAINT party_external_id_party_fk
      FOREIGN KEY (party_guid)
      REFERENCES party (party_guid),
    CONSTRAINT party_external_id_code_fk
      FOREIGN KEY (party_external_id_code)
      REFERENCES party_external_id_code (party_external_id_code)
);

COMMENT ON TABLE party_external_id IS 'Stores identifiers issued by systems external to this one that uniquely identify a party, such as a fish and wildlife ID.';

COMMENT ON COLUMN party_external_id.party_external_id_guid IS 'The system-generated unique identifier for the party external identifier record.';

COMMENT ON COLUMN party_external_id.party_guid IS 'The unique identifier of the party associated with the external identifier.';

COMMENT ON COLUMN party_external_id.party_external_id_code IS 'The code identifying the type of external identifier.';

COMMENT ON COLUMN party_external_id.external_id_value IS 'The value of the identifier as issued by the external system.';

COMMENT ON COLUMN party_external_id.active_ind IS 'A boolean indicator to determine if the party external identifier is active.';

COMMENT ON COLUMN party_external_id.create_user_id IS 'The id of the user that created the party external identifier.';

COMMENT ON COLUMN party_external_id.create_utc_timestamp IS 'The timestamp when the party external identifier was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN party_external_id.update_user_id IS 'The id of the user that updated the party external identifier.';

COMMENT ON COLUMN party_external_id.update_utc_timestamp IS 'The timestamp when the party external identifier was updated. The timestamp is stored in UTC with no Offset.';


CREATE TABLE party_external_id_h (
    h_party_external_id_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
);

COMMENT ON TABLE party_external_id_h IS 'Stores the audit history for party external identifier records.';

COMMENT ON COLUMN party_external_id_h.h_party_external_id_guid IS 'The system-generated unique identifier for the party external identifier history record.';

COMMENT ON COLUMN party_external_id_h.target_row_id IS 'The unique identifier of the party external identifier affected by the operation.';

COMMENT ON COLUMN party_external_id_h.operation_type IS 'The type of database operation executed on the party external identifier. For example I = Insert, U = Update, D = Delete.';

COMMENT ON COLUMN party_external_id_h.operation_user_id IS 'The id of the user that executed the operation.';

COMMENT ON COLUMN party_external_id_h.operation_executed_at IS 'The timestamp when the operation was executed.';

COMMENT ON COLUMN party_external_id_h.data_after_executed_operation IS 'A JSON representation of the party external identifier after the operation was executed.';

ALTER TABLE party_external_id_h
ADD CONSTRAINT pk_h_party_external_id
PRIMARY KEY (h_party_external_id_guid);

CREATE TRIGGER party_external_id_history_trigger
BEFORE INSERT OR DELETE OR UPDATE
ON party_external_id
FOR EACH ROW
EXECUTE FUNCTION audit_history (
  'party_external_id_h',
  'party_external_id_guid'
);


-- A party holds one identifier per external system at a time
CREATE UNIQUE INDEX party_external_id_active_unique
ON party_external_id (party_guid, party_external_id_code)
WHERE active_ind = true;

COMMENT ON INDEX party_external_id_active_unique IS 'Enforces one active external identifier of each type per party.';

-- Global party list search and party match lookups
CREATE INDEX idx_party_external_id_value_search
    ON party_external_id USING gin (external_id_value public.gin_trgm_ops);

CREATE INDEX idx_party_external_id_value_norm
    ON party_external_id (shared.f_match_norm(external_id_value))
    WHERE active_ind = true;

CREATE INDEX idx_party_external_id_party
    ON party_external_id (party_guid)
    WHERE active_ind = true;
