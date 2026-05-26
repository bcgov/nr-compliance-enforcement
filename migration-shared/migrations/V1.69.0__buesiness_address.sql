CREATE TABLE
  business_address (
    business_address_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    business_guid uuid NOT NULL,
    address_name character varying(128) NOT NULL,
    address character varying(120),
    city character varying(128),
    province character varying(64),
    postal_code character varying(16),
    country character varying(64),
    is_primary boolean NOT NULL DEFAULT false,
    active_ind boolean NOT NULL DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL DEFAULT now (),
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    CONSTRAINT business_address_pk PRIMARY KEY (business_address_guid),
    CONSTRAINT business_address_business_fk
      FOREIGN KEY (business_guid)
      REFERENCES business (business_guid)
  );

COMMENT ON TABLE business_address IS 'Stores physical or mailing addresses associated with a business.';

COMMENT ON COLUMN business_address.business_address_guid IS 'The system-generated unique identifier for the business address record.';

COMMENT ON COLUMN business_address.business_guid IS 'The unique identifier of the business associated with the address.';

COMMENT ON COLUMN business_address.address_name IS 'A label for the address (e.g. Head office, Mailing address).';

COMMENT ON COLUMN business_address.address IS 'The street address of the business.';

COMMENT ON COLUMN business_address.city IS 'The city of the business address.';

COMMENT ON COLUMN business_address.province IS 'The province or state of the business address.';

COMMENT ON COLUMN business_address.postal_code IS 'The postal or ZIP code of the business address.';

COMMENT ON COLUMN business_address.country IS 'The country of the business address.';

COMMENT ON COLUMN business_address.is_primary IS 'A boolean indicator of whether this is the primary address for the business.';

COMMENT ON COLUMN business_address.active_ind IS 'A boolean indicator to determine if the business address is active.';

COMMENT ON COLUMN business_address.create_user_id IS 'The id of the user that created the business address.';

COMMENT ON COLUMN business_address.create_utc_timestamp IS 'The timestamp when the business address was created. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN business_address.update_user_id IS 'The id of the user that updated the business address.';

COMMENT ON COLUMN business_address.update_utc_timestamp IS 'The timestamp when the business address was updated. The timestamp is stored in UTC with no Offset.';

CREATE TABLE
  business_address_h (
    h_business_address_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

COMMENT ON TABLE business_address_h IS 'Stores the audit history for business address records.';

COMMENT ON COLUMN business_address_h.h_business_address_guid IS 'The system-generated unique identifier for the business address history record.';

COMMENT ON COLUMN business_address_h.target_row_id IS 'The unique identifier of the business address record affected by the operation.';

COMMENT ON COLUMN business_address_h.operation_type IS 'The type of database operation executed on the business address record. For example I = Insert, U = Update, D = Delete.';

COMMENT ON COLUMN business_address_h.operation_user_id IS 'The id of the user that executed the operation.';

COMMENT ON COLUMN business_address_h.operation_executed_at IS 'The timestamp when the operation was executed. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN business_address_h.data_after_executed_operation IS 'A JSON representation of the business address record after the operation was executed.';

ALTER TABLE business_address_h
ADD CONSTRAINT pk_h_business_address
PRIMARY KEY (h_business_address_guid);

CREATE TRIGGER business_address_history_trigger
BEFORE INSERT OR DELETE OR UPDATE
ON business_address
FOR EACH ROW
EXECUTE FUNCTION audit_history (
  'business_address_h',
  'business_address_guid'
);

CREATE UNIQUE INDEX business_address_primary_unique
ON business_address (business_guid)
WHERE is_primary = true
AND active_ind = true;

CREATE UNIQUE INDEX business_identifier_bnum_active_unique
ON business_identifier (identifier_value)
WHERE business_identifier_code = 'BNUM'
AND active_ind = true;
