--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8 (Debian 15.8-1.pgdg110+1)
-- Dumped by pg_dump version 15.1

SET check_function_bodies = false;


--
-- Name: shared; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA IF NOT EXISTS shared;


--
-- Name: audit_history(); Type: FUNCTION; Schema: shared; Owner: -
--

CREATE FUNCTION shared.audit_history() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE

	target_history_table TEXT;
	target_pk TEXT;

  BEGIN
    target_history_table := TG_ARGV[0];
    target_pk := TG_ARGV[1];

    IF TG_OP ='INSERT' THEN 
        
      -- Don't trust the caller not to manipulate any of these fields
      NEW.create_utc_timestamp := current_timestamp; -- create timestamp must be the current time
      NEW.update_utc_timestamp := current_timestamp; -- update timestamp must be the current time
      NEW.update_user_id := NEW.create_user_id;  -- the update user must be the same as the create user

      EXECUTE
        format( 
            'INSERT INTO shared.%I (target_row_id, operation_type, operation_user_id, data_after_executed_operation) VALUES ($1.%I,  ''I'', $1.create_user_id, to_jsonb($1))',  target_history_table, target_pk
        )
        USING NEW;
      RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN 

      -- Don't trust the caller not to manipulate any of these fields
      NEW.update_utc_timestamp := current_timestamp;  -- update timestamp must be the current time
      NEW.create_user_id := OLD.create_user_id; -- create userId can't be altered
      NEW.create_utc_timestamp := OLD.create_utc_timestamp; -- update timestamp can't be altered

      EXECUTE
        format(
            'INSERT INTO shared.%I (target_row_id, operation_type, operation_user_id, data_after_executed_operation) VALUES ($1.%I, ''U'', $1.update_user_id, to_jsonb($1))', target_history_table, target_pk
          )
        USING NEW;
      RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN

      EXECUTE
        format(
                'INSERT INTO shared.%I (target_row_id, operation_type) VALUES ($1.%I, ''D'')', target_history_table, target_pk
        )
        USING OLD;
      RETURN OLD;

    END IF;
  END;
$_$;


--
-- Name: update_audit_columns(); Type: FUNCTION; Schema: shared; Owner: -
--

CREATE FUNCTION shared.update_audit_columns() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
calling_query TEXT;
update_user_id_found BOOL;
BEGIN
        IF NEW.update_utc_timestamp IS NOT DISTINCT FROM OLD.update_utc_timestamp THEN
            NEW.update_utc_timestamp := CURRENT_TIMESTAMP;
        END IF;
        SELECT current_query() INTO calling_query;
        SELECT POSITION('update_user_id' IN calling_query) > 0 INTO update_user_id_found;
        IF update_user_id_found = 'f' THEN
            NEW.update_user_id := CURRENT_USER;
        END IF;
        RETURN NEW;
    END; 
$$;


--
-- Name: TEMP_POC_SEQ; Type: SEQUENCE; Schema: shared; Owner: -
--

CREATE SEQUENCE shared."TEMP_POC_SEQ"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 100;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: agency_code; Type: TABLE; Schema: shared; Owner: -
--

CREATE TABLE shared.agency_code (
    agency_code character varying(10) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer,
    active_ind boolean DEFAULT true NOT NULL,
    external_agency_ind boolean DEFAULT false NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE agency_code; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON TABLE shared.agency_code IS 'An agency is an organized and named grouping of people that interacts in some way with the NatSuite application.';


--
-- Name: COLUMN agency_code.agency_code; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.agency_code.agency_code IS 'Primary key: Human readable code representing an agency.';


--
-- Name: COLUMN agency_code.short_description; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.agency_code.short_description IS 'The short description of the agency.  Used to store shorter versions of the long description when applicable.';


--
-- Name: COLUMN agency_code.long_description; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.agency_code.long_description IS 'The long description of the agency.  May contain additional detail not typically displayed in the application.';


--
-- Name: COLUMN agency_code.display_order; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.agency_code.display_order IS 'The order in which the values of the agency should be displayed when presented to a user in a list.  Originally incremented by 10s to allow for new values to be easily added.';


--
-- Name: COLUMN agency_code.active_ind; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.agency_code.active_ind IS 'A boolean indicator to determine if the agency is active.  Inactive values are still retained in the system for legacy data integrity but are not valid choices for new data being added.';


--
-- Name: COLUMN agency_code.external_agency_ind; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.agency_code.external_agency_ind IS 'A boolean indicator to determine if the agency is a direct NatSuite user or a partner agency.  A partner agency is an agency that might have a case activity referred to it, but would not complete the activity within the NatSuite.';


--
-- Name: COLUMN agency_code.create_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.agency_code.create_user_id IS 'The id of the user that created the agency.';


--
-- Name: COLUMN agency_code.create_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.agency_code.create_utc_timestamp IS 'The timestamp when the agency was created. The timestamp is stored in UTC with no offset.';


--
-- Name: COLUMN agency_code.update_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.agency_code.update_user_id IS 'The id of the user that updated the agency.';


--
-- Name: COLUMN agency_code.update_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.agency_code.update_utc_timestamp IS 'The timestamp when the agency was updated. The timestamp is stored in UTC with no offset.';


--
-- Name: business; Type: TABLE; Schema: shared; Owner: -
--

CREATE TABLE shared.business (
    business_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(128) NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    party_guid uuid
);


--
-- Name: COLUMN business.business_guid; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.business.business_guid IS 'Primary key: System generated unique identifier for a business.';


--
-- Name: COLUMN business.name; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.business.name IS 'Name of the business.';


--
-- Name: COLUMN business.create_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.business.create_user_id IS 'The id of the user that created the business.';


--
-- Name: COLUMN business.create_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.business.create_utc_timestamp IS 'The timestamp when the business was created. The timestamp is stored in UTC with no offset.';


--
-- Name: COLUMN business.update_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.business.update_user_id IS 'The id of the user that updated the business.';


--
-- Name: COLUMN business.update_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.business.update_utc_timestamp IS 'The timestamp when the business was updated. The timestamp is stored in UTC with no offset.';


--
-- Name: business_h; Type: TABLE; Schema: shared; Owner: -
--

CREATE TABLE shared.business_h (
    h_business_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: COLUMN business_h.h_business_guid; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.business_h.h_business_guid IS 'Primary key: System generated unique identifier for a business history record.';


--
-- Name: COLUMN business_h.target_row_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.business_h.target_row_id IS 'The unique key for the business that has been created or modified.';


--
-- Name: COLUMN business_h.operation_type; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.business_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN business_h.operation_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.business_h.operation_user_id IS 'The id of the user that created or modified the data in the business table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN business_h.operation_executed_at; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.business_h.operation_executed_at IS 'The timestamp when the data in the business table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN business_h.data_after_executed_operation; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.business_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.';


--
-- Name: case_activity; Type: TABLE; Schema: shared; Owner: -
--

CREATE TABLE shared.case_activity (
    case_activity_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    case_file_guid uuid NOT NULL,
    activity_type character varying(10) NOT NULL,
    activity_identifier_ref character varying(50) NOT NULL,
    effective_utc_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    expiry_utc_timestamp timestamp without time zone,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE case_activity; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON TABLE shared.case_activity IS 'A case activity is a distinct business process within the compliance and enforcement domain such as a complaint, inspection or an investigation.';


--
-- Name: COLUMN case_activity.case_activity_guid; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity.case_activity_guid IS 'Primary Key: System generated unique key for a case activity.  This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN case_activity.case_file_guid; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity.case_file_guid IS 'Foreign Key: System generated unique key for a case.  This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN case_activity.activity_type; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity.activity_type IS 'Foreign Key: Human readable code representing a case activity.';


--
-- Name: COLUMN case_activity.activity_identifier_ref; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity.activity_identifier_ref IS 'Business key representing a case activity stored in a another system or schema.   A case activity identifier can be a complaint: complaint.complaint.complaint_identifier, an inspection, or an investigation (physical implementation TBD)';


--
-- Name: COLUMN case_activity.effective_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity.effective_utc_timestamp IS 'The date and time the case activity was added to the case file. The timestamp is stored in UTC with no offset.';


--
-- Name: COLUMN case_activity.expiry_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity.expiry_utc_timestamp IS 'The date and time the case activity was removed from the case file. The timestamp is stored in UTC with no offset.';


--
-- Name: COLUMN case_activity.create_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity.create_user_id IS 'The id of the user that created the case activity record.';


--
-- Name: COLUMN case_activity.create_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity.create_utc_timestamp IS 'The timestamp when the case activity record was created. The timestamp is stored in UTC with no offset.';


--
-- Name: COLUMN case_activity.update_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity.update_user_id IS 'The id of the user that updated the case activity record.';


--
-- Name: COLUMN case_activity.update_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity.update_utc_timestamp IS 'The timestamp when the case activity record was updated. The timestamp is stored in UTC with no offset.';


--
-- Name: case_activity_h; Type: TABLE; Schema: shared; Owner: -
--

CREATE TABLE shared.case_activity_h (
    h_case_activity_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: TABLE case_activity_h; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON TABLE shared.case_activity_h IS 'History table for case activity table';


--
-- Name: COLUMN case_activity_h.h_case_activity_guid; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity_h.h_case_activity_guid IS 'System generated unique key for case activity history. This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN case_activity_h.target_row_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity_h.target_row_id IS 'The unique key for the case activity that has been created or modified.';


--
-- Name: COLUMN case_activity_h.operation_type; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN case_activity_h.operation_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity_h.operation_user_id IS 'The id of the user that created or modified the data in the case activity table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN case_activity_h.operation_executed_at; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity_h.operation_executed_at IS 'The timestamp when the data in the case activity table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN case_activity_h.data_after_executed_operation; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


--
-- Name: case_activity_type_code; Type: TABLE; Schema: shared; Owner: -
--

CREATE TABLE shared.case_activity_type_code (
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


--
-- Name: TABLE case_activity_type_code; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON TABLE shared.case_activity_type_code IS 'A case file is made up of many case activities.  Examples of case activities include: COMP = "Complaint", INV = "Investigation';


--
-- Name: COLUMN case_activity_type_code.case_activity_type_code; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity_type_code.case_activity_type_code IS 'Primary key: Human readable code representing a case activity.';


--
-- Name: COLUMN case_activity_type_code.short_description; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity_type_code.short_description IS 'The short description of the case activity.  Used to store shorter versions of the long description when applicable.';


--
-- Name: COLUMN case_activity_type_code.long_description; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity_type_code.long_description IS 'The long description of the case activity.  May contain additional detail not typically displayed in the application.';


--
-- Name: COLUMN case_activity_type_code.display_order; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity_type_code.display_order IS 'The order in which the values of the case activity should be displayed when presented to a user in a list.  Originally incremented by 10s to allow for new values to be easily added.';


--
-- Name: COLUMN case_activity_type_code.active_ind; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity_type_code.active_ind IS 'A boolean indicator to determine if the case activity is active.  Inactive values are still retained in the system for legacy data integrity but are not valid choices for new data being added.';


--
-- Name: COLUMN case_activity_type_code.create_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity_type_code.create_user_id IS 'The id of the user that created the case activity.';


--
-- Name: COLUMN case_activity_type_code.create_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity_type_code.create_utc_timestamp IS 'The timestamp when the case activity was created. The timestamp is stored in UTC with no offset.';


--
-- Name: COLUMN case_activity_type_code.update_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity_type_code.update_user_id IS 'The id of the user that updated the case activity.';


--
-- Name: COLUMN case_activity_type_code.update_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_activity_type_code.update_utc_timestamp IS 'The timestamp when the case activity was updated. The timestamp is stored in UTC with no offset.';


--
-- Name: case_file; Type: TABLE; Schema: shared; Owner: -
--

CREATE TABLE shared.case_file (
    case_file_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    lead_agency character varying(10) NOT NULL,
    case_status character varying(10) NOT NULL,
    opened_utc_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    description text
);


--
-- Name: TABLE case_file; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON TABLE shared.case_file IS 'A case file is the top level entity of the case management system and encapsulates all activities and records within it';


--
-- Name: COLUMN case_file.case_file_guid; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_file.case_file_guid IS 'Primary Key: System generated unique key for a case.  This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN case_file.lead_agency; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_file.lead_agency IS 'Foreign key: Human readable code representing an agency.';


--
-- Name: COLUMN case_file.case_status; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_file.case_status IS 'Foreign key: Human readable code representing a case status.';


--
-- Name: COLUMN case_file.opened_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_file.opened_utc_timestamp IS 'The time the case file was created.  The timestamp is stored in UTC with no offset.';


--
-- Name: COLUMN case_file.create_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_file.create_user_id IS 'The id of the user that created the case file.';


--
-- Name: COLUMN case_file.create_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_file.create_utc_timestamp IS 'The timestamp when the case file was created. The timestamp is stored in UTC with no offset.';


--
-- Name: COLUMN case_file.update_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_file.update_user_id IS 'The id of the user that updated the case file.';


--
-- Name: COLUMN case_file.update_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_file.update_utc_timestamp IS 'The timestamp when the case file was updated. The timestamp is stored in UTC with no offset.';


--
-- Name: COLUMN case_file.description; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_file.description IS 'Optional text description for the case file providing additional context or notes';


--
-- Name: case_file_h; Type: TABLE; Schema: shared; Owner: -
--

CREATE TABLE shared.case_file_h (
    h_case_file_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: TABLE case_file_h; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON TABLE shared.case_file_h IS 'History table for case file table';


--
-- Name: COLUMN case_file_h.h_case_file_guid; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_file_h.h_case_file_guid IS 'System generated unique key for case file history. This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN case_file_h.target_row_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_file_h.target_row_id IS 'The unique key for the case file that has been created or modified.';


--
-- Name: COLUMN case_file_h.operation_type; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_file_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN case_file_h.operation_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_file_h.operation_user_id IS 'The id of the user that created or modified the data in the case file table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN case_file_h.operation_executed_at; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_file_h.operation_executed_at IS 'The timestamp when the data in the case file table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN case_file_h.data_after_executed_operation; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_file_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


--
-- Name: case_status_code; Type: TABLE; Schema: shared; Owner: -
--

CREATE TABLE shared.case_status_code (
    case_status_code character varying(10) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer,
    active_ind boolean DEFAULT true NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE case_status_code; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON TABLE shared.case_status_code IS 'Represents the status of case (e.g. OPEN=Open; CLOSED=Closed).';


--
-- Name: COLUMN case_status_code.case_status_code; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_status_code.case_status_code IS 'Primary key: Human readable code representing a case status.';


--
-- Name: COLUMN case_status_code.short_description; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_status_code.short_description IS 'The short description of the case status code.  Used to store shorter versions of the long description when applicable.';


--
-- Name: COLUMN case_status_code.long_description; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_status_code.long_description IS 'The long description of the case status code.  May contain additional detail not typically displayed in the application.';


--
-- Name: COLUMN case_status_code.display_order; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_status_code.display_order IS 'The order in which the values of the case status code should be displayed when presented to a user in a list.  Originally incremented by 10s to allow for new values to be easily added.';


--
-- Name: COLUMN case_status_code.active_ind; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_status_code.active_ind IS 'A boolean indicator to determine if the case status code is active.  Inactive values are still retained in the system for legacy data integrity but are not valid choices for new data being added.';


--
-- Name: COLUMN case_status_code.create_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_status_code.create_user_id IS 'The id of the user that created the case status code.';


--
-- Name: COLUMN case_status_code.create_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_status_code.create_utc_timestamp IS 'The timestamp when the case status code was created. The timestamp is stored in UTC with no offset.';


--
-- Name: COLUMN case_status_code.update_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_status_code.update_user_id IS 'The id of the user that updated the case status code.';


--
-- Name: COLUMN case_status_code.update_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.case_status_code.update_utc_timestamp IS 'The timestamp when the case status code was updated. The timestamp is stored in UTC with no offset.';


--
-- Name: contact_method; Type: TABLE; Schema: shared; Owner: -
--

CREATE TABLE shared.contact_method (
    contact_method_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    person_guid uuid NOT NULL,
    contact_method_type character varying(10) NOT NULL,
    contact_value character varying(512),
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE contact_method; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON TABLE shared.contact_method IS 'Stores contact details for individuals, linking each contact method to a person and a type (e.g., email, phone).';


--
-- Name: COLUMN contact_method.contact_method_guid; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method.contact_method_guid IS 'Primary key: System generated unique identifier for a contact method.';


--
-- Name: COLUMN contact_method.person_guid; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method.person_guid IS 'Foreign key: References person.person_guid.';


--
-- Name: COLUMN contact_method.contact_method_type; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method.contact_method_type IS 'Foreign key: References contact_method_type_code.contact_method_type_code.';


--
-- Name: COLUMN contact_method.contact_value; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method.contact_value IS 'A contact method (e.g., phone number, email address) for a person.';


--
-- Name: COLUMN contact_method.create_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method.create_user_id IS 'The id of the user that created the contact method.';


--
-- Name: COLUMN contact_method.create_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method.create_utc_timestamp IS 'The timestamp when the contact method was created. The timestamp is stored in UTC with no offset.';


--
-- Name: COLUMN contact_method.update_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method.update_user_id IS 'The id of the user that updated the contact method.';


--
-- Name: COLUMN contact_method.update_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method.update_utc_timestamp IS 'The timestamp when the contact method was updated. The timestamp is stored in UTC with no offset.';


--
-- Name: contact_method_h; Type: TABLE; Schema: shared; Owner: -
--

CREATE TABLE shared.contact_method_h (
    h_contact_method_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: TABLE contact_method_h; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON TABLE shared.contact_method_h IS 'History table for contact method table';


--
-- Name: COLUMN contact_method_h.h_contact_method_guid; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method_h.h_contact_method_guid IS 'Primary key: System generated unique identifier for a contact method history record.';


--
-- Name: COLUMN contact_method_h.target_row_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method_h.target_row_id IS 'The unique key for the contact method that has been created or modified.';


--
-- Name: COLUMN contact_method_h.operation_type; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN contact_method_h.operation_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method_h.operation_user_id IS 'The id of the user that created or modified the data in the contact method table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN contact_method_h.operation_executed_at; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method_h.operation_executed_at IS 'The timestamp when the data in the contact method table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN contact_method_h.data_after_executed_operation; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


--
-- Name: contact_method_type_code; Type: TABLE; Schema: shared; Owner: -
--

CREATE TABLE shared.contact_method_type_code (
    contact_method_type_code character varying(16) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer,
    active_ind boolean DEFAULT true NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE contact_method_type_code; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON TABLE shared.contact_method_type_code IS 'Defines types of contact methods (e.g., email, primary phone, alternate phone) with descriptions and display ordering.';


--
-- Name: COLUMN contact_method_type_code.contact_method_type_code; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method_type_code.contact_method_type_code IS 'Primary key: Human readable code representing a contact method type.';


--
-- Name: COLUMN contact_method_type_code.short_description; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method_type_code.short_description IS 'The short description of the contact method type code.  Used to store shorter versions of the long description when applicable.';


--
-- Name: COLUMN contact_method_type_code.long_description; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method_type_code.long_description IS 'The long description of the contact method type code.  May contain additional detail not typically displayed in the application.';


--
-- Name: COLUMN contact_method_type_code.display_order; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method_type_code.display_order IS 'The order in which the values of the contact method type code should be displayed when presented to a user in a list.  Originally incremented by 10s to allow for new values to be easily added.';


--
-- Name: COLUMN contact_method_type_code.active_ind; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method_type_code.active_ind IS 'A boolean indicator to determine if the contact method type code is active.  Inactive values are still retained in the system for legacy data integrity but are not valid choices for new data being added.';


--
-- Name: COLUMN contact_method_type_code.create_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method_type_code.create_user_id IS 'The id of the user that created the contact method type code.';


--
-- Name: COLUMN contact_method_type_code.create_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method_type_code.create_utc_timestamp IS 'The timestamp when the contact method type code was created. The timestamp is stored in UTC with no offset.';


--
-- Name: COLUMN contact_method_type_code.update_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method_type_code.update_user_id IS 'The id of the user that updated the contact method type code.';


--
-- Name: COLUMN contact_method_type_code.update_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.contact_method_type_code.update_utc_timestamp IS 'The timestamp when the contact method type code was updated. The timestamp is stored in UTC with no offset.';


--
-- Name: park; Type: TABLE; Schema: shared; Owner: -
--

CREATE TABLE shared.park (
    park_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    external_id character varying(32) NOT NULL,
    name character varying(256) NOT NULL,
    legal_name character varying(256),
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE park; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON TABLE shared.park IS 'Stores a set of BC Parks, Conservatories, and Protected Areas. Data is imported from the data.bcparks.ca API.';


--
-- Name: COLUMN park.park_guid; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park.park_guid IS 'Primary key: System generated unique identifier for a park.';


--
-- Name: COLUMN park.external_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park.external_id IS 'External identifier for the park, this references the data.bcparks.ca API.';


--
-- Name: COLUMN park.name; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park.name IS 'Name of the park.';


--
-- Name: COLUMN park.legal_name; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park.legal_name IS 'Legal name of the park.';


--
-- Name: COLUMN park.create_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park.create_user_id IS 'The id of the user that created the park.';


--
-- Name: COLUMN park.create_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park.create_utc_timestamp IS 'The timestamp when the park was created. The timestamp is stored in UTC with no offset.';


--
-- Name: COLUMN park.update_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park.update_user_id IS 'The id of the user that updated the park.';


--
-- Name: COLUMN park.update_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park.update_utc_timestamp IS 'The timestamp when the park was updated. The timestamp is stored in UTC with no offset.';


--
-- Name: park_area; Type: TABLE; Schema: shared; Owner: -
--

CREATE TABLE shared.park_area (
    park_area_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(256) NOT NULL,
    region_name character varying(256),
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE park_area; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON TABLE shared.park_area IS 'Stores areas that may contain parks, including their names and associated region.';


--
-- Name: COLUMN park_area.park_area_guid; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park_area.park_area_guid IS 'Primary key: System generated unique identifier for a park area.';


--
-- Name: COLUMN park_area.name; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park_area.name IS 'Name of the park area.';


--
-- Name: COLUMN park_area.region_name; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park_area.region_name IS 'Region name associated with the park area.';


--
-- Name: COLUMN park_area.create_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park_area.create_user_id IS 'The id of the user that created the park area.';


--
-- Name: COLUMN park_area.create_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park_area.create_utc_timestamp IS 'The timestamp when the park area was created. The timestamp is stored in UTC with no offset.';


--
-- Name: COLUMN park_area.update_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park_area.update_user_id IS 'The id of the user that updated the park area.';


--
-- Name: COLUMN park_area.update_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park_area.update_utc_timestamp IS 'The timestamp when the park area was updated. The timestamp is stored in UTC with no offset.';


--
-- Name: park_area_mapping; Type: TABLE; Schema: shared; Owner: -
--

CREATE TABLE shared.park_area_mapping (
    park_area_mapping_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    park_area_guid uuid NOT NULL,
    external_id character varying(32) NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE park_area_mapping; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON TABLE shared.park_area_mapping IS 'Stores mapping between park areas and their identifiers based on a mapping spreadsheet. This data exists before parks are imported, so it is only loosly related to the park table through external_id.';


--
-- Name: COLUMN park_area_mapping.park_area_mapping_guid; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park_area_mapping.park_area_mapping_guid IS 'Primary key: System generated unique identifier for a park area mapping.';


--
-- Name: COLUMN park_area_mapping.park_area_guid; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park_area_mapping.park_area_guid IS 'Foreign key: References the park area that the mapping belongs to.';


--
-- Name: COLUMN park_area_mapping.external_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park_area_mapping.external_id IS 'External identifier for the park area mapping.';


--
-- Name: park_area_xref; Type: TABLE; Schema: shared; Owner: -
--

CREATE TABLE shared.park_area_xref (
    park_area_guid_xref uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    park_area_guid uuid NOT NULL,
    park_guid uuid NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE park_area_xref; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON TABLE shared.park_area_xref IS 'Stores mapping between park areas and parks.';


--
-- Name: COLUMN park_area_xref.park_area_guid_xref; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park_area_xref.park_area_guid_xref IS 'Primary key: System generated unique identifier for a park area xref.';


--
-- Name: COLUMN park_area_xref.park_area_guid; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park_area_xref.park_area_guid IS 'Foreign key: References the park area that the xref belongs to.';


--
-- Name: COLUMN park_area_xref.park_guid; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park_area_xref.park_guid IS 'Foreign key: References the park that the xref belongs to.';


--
-- Name: COLUMN park_area_xref.create_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park_area_xref.create_user_id IS 'The id of the user that created the park area xref.';


--
-- Name: COLUMN park_area_xref.create_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park_area_xref.create_utc_timestamp IS 'The timestamp when the park area xref was created. The timestamp is stored in UTC with no offset.';


--
-- Name: COLUMN park_area_xref.update_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park_area_xref.update_user_id IS 'The id of the user that updated the park area xref.';


--
-- Name: COLUMN park_area_xref.update_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.park_area_xref.update_utc_timestamp IS 'The timestamp when the park area xref was updated. The timestamp is stored in UTC with no offset.';


--
-- Name: party; Type: TABLE; Schema: shared; Owner: -
--

CREATE TABLE shared.party (
    party_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    party_type character varying(16),
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE party; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON TABLE shared.party IS 'A table that holds parties of interest';


--
-- Name: COLUMN party.party_guid; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.party.party_guid IS 'Primary key: System generated unique identifier for a party.';


--
-- Name: COLUMN party.party_type; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.party.party_type IS 'Human readable code representing a party type.';


--
-- Name: COLUMN party.create_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.party.create_user_id IS 'The id of the user that created the party.';


--
-- Name: COLUMN party.create_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.party.create_utc_timestamp IS 'The timestamp when the party was created. The timestamp is stored in UTC with no offset.';


--
-- Name: COLUMN party.update_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.party.update_user_id IS 'The id of the user that updated the party.';


--
-- Name: COLUMN party.update_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.party.update_utc_timestamp IS 'The timestamp when the party was updated. The timestamp is stored in UTC with no offset.';


--
-- Name: party_h; Type: TABLE; Schema: shared; Owner: -
--

CREATE TABLE shared.party_h (
    h_party_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: COLUMN party_h.h_party_guid; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.party_h.h_party_guid IS 'Primary key: System generated unique identifier for a party history record.';


--
-- Name: COLUMN party_h.target_row_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.party_h.target_row_id IS 'The unique key for the party that has been created or modified.';


--
-- Name: COLUMN party_h.operation_type; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.party_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN party_h.operation_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.party_h.operation_user_id IS 'The id of the user that created or modified the data in the party table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN party_h.operation_executed_at; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.party_h.operation_executed_at IS 'The timestamp when the data in the party table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN party_h.data_after_executed_operation; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.party_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.';


--
-- Name: party_type_code; Type: TABLE; Schema: shared; Owner: -
--

CREATE TABLE shared.party_type_code (
    party_type_code character varying(16) NOT NULL,
    short_description character varying(64) NOT NULL,
    long_description character varying(256),
    display_order integer,
    active_ind boolean DEFAULT true NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE party_type_code; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON TABLE shared.party_type_code IS 'A table that holds party types.  Examples of party types include: CMP = "Company", PRS = "Person';


--
-- Name: COLUMN party_type_code.party_type_code; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.party_type_code.party_type_code IS 'Primary key: Human readable code representing a party type.';


--
-- Name: COLUMN party_type_code.short_description; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.party_type_code.short_description IS 'The short description of the party type.  Used to store shorter versions of the long description when applicable.';


--
-- Name: COLUMN party_type_code.long_description; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.party_type_code.long_description IS 'The long description of the party type.  May contain additional detail not typically displayed in the application.';


--
-- Name: COLUMN party_type_code.display_order; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.party_type_code.display_order IS 'The order in which the values of the party type should be displayed when presented to a user in a list.  Originally incremented by 10s to allow for new values to be easily added.';


--
-- Name: COLUMN party_type_code.active_ind; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.party_type_code.active_ind IS 'A boolean indicator to determine if the party type is active.  Inactive values are still retained in the system for legacy data integrity but are not valid choices for new data being added.';


--
-- Name: COLUMN party_type_code.create_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.party_type_code.create_user_id IS 'The id of the user that created the party type.';


--
-- Name: COLUMN party_type_code.create_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.party_type_code.create_utc_timestamp IS 'The timestamp when the party type was created. The timestamp is stored in UTC with no offset.';


--
-- Name: COLUMN party_type_code.update_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.party_type_code.update_user_id IS 'The id of the user that updated the party type.';


--
-- Name: COLUMN party_type_code.update_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.party_type_code.update_utc_timestamp IS 'The timestamp when the party type was updated. The timestamp is stored in UTC with no offset.';


--
-- Name: person; Type: TABLE; Schema: shared; Owner: -
--

CREATE TABLE shared.person (
    person_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    first_name character varying(128) NOT NULL,
    middle_name character varying(128),
    middle_name_2 character varying(128),
    last_name character varying(128) NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    party_guid uuid
);


--
-- Name: TABLE person; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON TABLE shared.person IS 'Stores personal information for individuals, including names and in the future other attributes.';


--
-- Name: COLUMN person.person_guid; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.person.person_guid IS 'Primary key: System generated unique identifier for a person.';


--
-- Name: COLUMN person.first_name; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.person.first_name IS 'First or given name of the person.';


--
-- Name: COLUMN person.middle_name; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.person.middle_name IS 'Second or middle name of the person.';


--
-- Name: COLUMN person.middle_name_2; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.person.middle_name_2 IS 'Additional Second or middle name of the person.';


--
-- Name: COLUMN person.last_name; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.person.last_name IS 'Last name or surname of the person.';


--
-- Name: COLUMN person.create_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.person.create_user_id IS 'The id of the user that created the person.';


--
-- Name: COLUMN person.create_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.person.create_utc_timestamp IS 'The timestamp when the person was created. The timestamp is stored in UTC with no offset.';


--
-- Name: COLUMN person.update_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.person.update_user_id IS 'The id of the user that updated the person.';


--
-- Name: COLUMN person.update_utc_timestamp; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.person.update_utc_timestamp IS 'The timestamp when the person was updated. The timestamp is stored in UTC with no offset.';


--
-- Name: person_h; Type: TABLE; Schema: shared; Owner: -
--

CREATE TABLE shared.person_h (
    h_person_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: TABLE person_h; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON TABLE shared.person_h IS 'History table for person table';


--
-- Name: COLUMN person_h.h_person_guid; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.person_h.h_person_guid IS 'Primary key: System generated unique identifier for a person history record.';


--
-- Name: COLUMN person_h.target_row_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.person_h.target_row_id IS 'The unique key for the person that has been created or modified.';


--
-- Name: COLUMN person_h.operation_type; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.person_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN person_h.operation_user_id; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.person_h.operation_user_id IS 'The id of the user that created or modified the data in the person table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN person_h.operation_executed_at; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.person_h.operation_executed_at IS 'The timestamp when the data in the person table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN person_h.data_after_executed_operation; Type: COMMENT; Schema: shared; Owner: -
--

COMMENT ON COLUMN shared.person_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


--
-- Data for Name: agency_code; Type: TABLE DATA; Schema: shared; Owner: -
--

INSERT INTO shared.agency_code VALUES ('PARKS', 'BC Parks', 'BC Parks', 10, true, false, 'FLYWAY', '2025-09-10 17:08:30.209752', 'FLYWAY', '2025-09-10 17:09:12.126016');
INSERT INTO shared.agency_code VALUES ('COS', 'COS', 'Conservation Officer Service', 20, true, false, 'FLYWAY', '2025-09-10 17:08:30.209752', 'FLYWAY', '2025-09-10 17:09:12.126016');
INSERT INTO shared.agency_code VALUES ('EPO', 'CEEB', 'Compliance and Environmental Enforcement Branch', 30, true, false, 'FLYWAY', '2025-09-10 17:08:30.209752', 'FLYWAY', '2025-09-10 17:09:12.126016');
INSERT INTO shared.agency_code VALUES ('ECCC', 'Environment and Climate Change Canada', 'Environment and Climate Change Canada', 40, true, true, 'FLYWAY', '2025-09-10 17:08:30.209752', 'FLYWAY', '2025-09-10 17:09:12.126016');
INSERT INTO shared.agency_code VALUES ('DFO', 'Fisheries and Oceans Canada', 'Fisheries and Oceans Canada', 50, true, true, 'FLYWAY', '2025-09-10 17:08:30.209752', 'FLYWAY', '2025-09-10 17:09:12.126016');
INSERT INTO shared.agency_code VALUES ('NROS', 'Natural Resource Officer Service', 'Natural Resource Officer Service', 60, true, true, 'FLYWAY', '2025-09-10 17:08:30.209752', 'FLYWAY', '2025-09-10 17:09:12.126016');
INSERT INTO shared.agency_code VALUES ('NRS', 'Natural Resource Sector', 'Natural Resource Sector', 70, true, false, 'FLYWAY', '2025-09-10 17:08:30.209752', 'FLYWAY', '2025-09-10 17:09:12.126016');
INSERT INTO shared.agency_code VALUES ('OTH', 'Other', 'Other', 80, true, true, 'FLYWAY', '2025-09-10 17:08:30.209752', 'FLYWAY', '2025-09-10 17:09:12.126016');
INSERT INTO shared.agency_code VALUES ('POL', 'Police', 'Police', 90, true, true, 'FLYWAY', '2025-09-10 17:08:30.209752', 'FLYWAY', '2025-09-10 17:09:12.126016');


--
-- Data for Name: business; Type: TABLE DATA; Schema: shared; Owner: -
--



--
-- Data for Name: business_h; Type: TABLE DATA; Schema: shared; Owner: -
--



--
-- Data for Name: case_activity; Type: TABLE DATA; Schema: shared; Owner: -
--



--
-- Data for Name: case_activity_h; Type: TABLE DATA; Schema: shared; Owner: -
--



--
-- Data for Name: case_activity_type_code; Type: TABLE DATA; Schema: shared; Owner: -
--

INSERT INTO shared.case_activity_type_code VALUES ('COMP', 'Complaint', 'Complaint', 10, true, 'FLYWAY', '2025-09-10 17:08:30.209752', 'FLYWAY', '2025-09-10 17:09:12.211518');
INSERT INTO shared.case_activity_type_code VALUES ('INVSTGTN', 'Investigation', 'Investigation', 20, true, 'FLYWAY', '2025-09-10 17:09:12.211518', NULL, NULL);
INSERT INTO shared.case_activity_type_code VALUES ('INSPECTION', 'Inspection', 'Inspection', 30, true, 'FLYWAY', '2025-09-10 17:09:12.211518', NULL, NULL);


--
-- Data for Name: case_file; Type: TABLE DATA; Schema: shared; Owner: -
--



--
-- Data for Name: case_file_h; Type: TABLE DATA; Schema: shared; Owner: -
--



--
-- Data for Name: case_status_code; Type: TABLE DATA; Schema: shared; Owner: -
--

INSERT INTO shared.case_status_code VALUES ('OPEN', 'Open', 'Open', 10, true, 'FLYWAY', '2025-09-10 17:08:30.209752', 'FLYWAY', '2025-09-10 17:09:12.275041');
INSERT INTO shared.case_status_code VALUES ('CLOSED', 'Closed', 'Closed', 20, true, 'FLYWAY', '2025-09-10 17:08:30.209752', 'FLYWAY', '2025-09-10 17:09:12.275041');


--
-- Data for Name: contact_method; Type: TABLE DATA; Schema: shared; Owner: -
--



--
-- Data for Name: contact_method_h; Type: TABLE DATA; Schema: shared; Owner: -
--



--
-- Data for Name: contact_method_type_code; Type: TABLE DATA; Schema: shared; Owner: -
--

INSERT INTO shared.contact_method_type_code VALUES ('ALTPHONE1', 'Alternate phone 1', 'Alternate phone 1', 10, true, 'FLYWAY', '2025-09-10 17:09:12.610628', NULL, NULL);
INSERT INTO shared.contact_method_type_code VALUES ('ALTPHONE2', 'Alternate phone 2', 'Alternate phone 2', 20, true, 'FLYWAY', '2025-09-10 17:09:12.610628', NULL, NULL);
INSERT INTO shared.contact_method_type_code VALUES ('EMAILADDR', 'Email address', 'Email address', 30, true, 'FLYWAY', '2025-09-10 17:09:12.610628', NULL, NULL);
INSERT INTO shared.contact_method_type_code VALUES ('PRIMPHONE', 'Primary phone', 'Primary phone', 40, true, 'FLYWAY', '2025-09-10 17:09:12.610628', NULL, NULL);


--
-- Data for Name: park; Type: TABLE DATA; Schema: shared; Owner: -
--

INSERT INTO shared.park VALUES ('a41b0ced-1cd2-4ce8-abe4-363eadb6e74f', '0001', 'Strathcona Park - Lindsay Loop', NULL, 'system', '2025-09-10 17:09:13.143455', 'system', NULL);
INSERT INTO shared.park VALUES ('40c08e29-51a5-4efe-90a3-49f621e045e8', '0010', 'Inonoaklin Park', NULL, 'system', '2025-09-10 17:09:13.143455', 'system', NULL);
INSERT INTO shared.park VALUES ('1a736bc3-2cfa-43db-b077-217aa89477d1', '1000', 'Hunwadi/Ahnuhati-Bald Conservancy', NULL, 'system', '2025-09-10 17:09:13.143455', 'system', NULL);
INSERT INTO shared.park VALUES ('0ff7a4d3-585e-4aa1-9200-8a32f5dbc957', '0073', 'sx̌ʷəx̌ʷnitkʷ Park', NULL, 'system', '2025-09-10 17:09:13.143455', 'system', NULL);


--
-- Data for Name: park_area; Type: TABLE DATA; Schema: shared; Owner: -
--

INSERT INTO shared.park_area VALUES ('35a55b82-e441-4c56-b26e-9f598795709f', 'South Gulf Islands', 'WC South Island', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('ebc89b4d-d579-4dcf-8848-ad4a7ef07cf3', 'Cowichan', 'WC South Island', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('b234c034-e9cd-43dc-bacd-cdc37af8d4d1', 'Juan de Fuca', 'WC South Island', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('a7b4ef4f-e0e4-4b81-bd14-dac2e06d73a3', 'Arrowsmith', 'WC Mid Vancouver Island-HG Area', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('b4a18271-9722-4726-bc90-29520d91764b', 'Clayoquot', 'WC Mid Vancouver Island-HG Area', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('a63546fa-622c-4c1b-a0d2-a900d28a51a3', 'Haida Gwaii', 'WC Mid Vancouver Island-HG Area', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('ccaedadc-d798-40b7-bd18-a75c03ab25cf', 'Von Donop', 'WC Mid Vancouver Island-HG Area', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('365cf8ff-c9f8-4ad4-95a0-f8a4305eda4f', 'Strathcona', 'WC North Island-SCC Area', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('cfbd8a35-d5e5-406a-a64a-d7027923bd01', 'Nootka', 'WC North Island-SCC Area', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('2ad6879d-8959-419c-91af-cfb4d72a9a6d', 'Cape Scott', 'WC North Island-SCC Area', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('00d6064f-62d1-487b-87c7-f890ccd02879', 'South Central Coast', 'WC North Island-SCC Area', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('c5e964a5-fce6-4bb5-9299-49bdbb580202', 'Miracle Beach', 'WC North Island-SCC Area', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('dcfccb22-1dee-484d-915f-e95b107f218e', 'North Fraser Area', 'SC Lower Mainland', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('adab98b4-983e-4a75-9be3-fcd76bb4384c', 'South Fraser Area', 'SC Lower Mainland', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('8cd45108-1bde-4f5b-a0f2-faed446dc6a2', 'Vancouver Area', 'SC Lower Mainland', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('f90842f8-6b44-4ecc-9714-c70258e92fec', 'Howe Sound Area', 'SC Lower Mainland', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('c4c68a21-c5f2-4313-bb16-70a56bad46b6', 'Sunshine Coast', 'SC Sea to Sky', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('2776df25-b776-46ff-9939-0f0bc170725b', 'Pemberton', 'SC Sea to Sky', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('408fe8ab-d69c-4870-98f7-b5beb78fe003', 'Squamish', 'SC Sea to Sky', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('38b66691-f4eb-4fdb-a597-45539bf2c1c4', 'Garibaldi South', 'SC Sea to Sky', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('a7ed352d-48df-43a2-8b74-3c6f748a4e16', 'South Chilcotin', 'Cariboo-Chilcotin Coast', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('07cc2a3e-aa4c-4954-a363-97de7a34dba6', 'Bowron', 'Cariboo-Chilcotin Coast', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('5624d05a-1a06-4aa3-adf0-ac56db6b478c', 'Northern Forests', 'Cariboo-Chilcotin Coast', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('3bfa96e1-9501-44ee-877e-e1d88c49b597', 'North Chilcotin', 'Cariboo-Chilcotin Coast', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('5ed0d006-8d3f-4578-938e-7b43645efdbc', 'Central Coast', 'Cariboo-Chilcotin Coast', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('de6b51b7-588b-4b41-95a9-110ead51ceb4', 'Bella Coola', 'Cariboo-Chilcotin Coast', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('26e3561d-61d3-40a9-8695-ad47846a82d6', 'Southern Rivers', 'Thompson', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('9db89ac1-ae34-4fdd-ab72-b2ca78636aee', 'Grasslands', 'Thompson', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('7c78fdc1-91d9-4d8d-bd53-b081375c9d94', 'Western Mountains', 'Thompson', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('ff5ff18e-11ac-4058-ac78-c30902d9d8ca', 'Eastern Lakes', 'Thompson', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('0bdc6182-6d04-48bf-9096-22361603cfd3', 'Arrow', 'Kootenay Region', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('c9627a1f-d890-4191-9497-95743cbe0011', 'East Kootenay South', 'Kootenay Region', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('d94648ef-ed6e-4c48-9312-5ad43fd4e22d', 'Kootenay Lake', 'Kootenay Region', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('2382b484-546f-4b6b-bcf6-af64b3d3a96f', 'East Kootenay North', 'Kootenay Region', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('7bfca370-7bcf-4830-9641-7ea9798ee5db', 'East Okanagan', 'Okanagan', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('3b858d4a-19e8-4f9f-b258-1d01ae571db2', 'North Okanagan', 'Okanagan', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('5af6376d-20d6-478e-b45f-d50394b7f317', 'South Okanagan', 'Okanagan', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('5ea35b3f-7c47-44b4-bacf-e076239016a4', 'West Okanagan', 'Okanagan', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('24ade15c-9bda-4b88-af57-581d3abb7da8', 'Babine', 'Skeena East', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('3108d243-3ae8-4b5e-b634-374d8ec0b193', 'Tweedsmuir North', 'Skeena East', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('f5478fa2-d85b-41c6-8b8e-3f85d14dd257', 'Stikine', 'Skeena East', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('363b5ab2-63b1-4910-898b-de18ecf40f38', 'Atlin/Tatshenshini', 'Skeena East', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('d4d6f840-772f-4324-826c-cd0c23455028', 'Lakelse-Douglas Channel', 'Skeena West', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('07467b02-1664-4f85-9868-9ef7f8690bc3', 'Skeena-Nass', 'Skeena West', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('6bd54f8c-b3cf-4833-a54b-5592c300d474', 'North Coast', 'Skeena West', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('8133b284-6bf0-4781-b5f8-78d53a87fda9', 'Omineca', 'Omineca', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('414e799d-1253-438b-a55a-4e50228b474b', 'Robson', 'Omineca', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', 'Upper Fraser', 'Omineca', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('286b0494-178f-49a4-ac3c-19fe27574034', 'Liard', 'Peace', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area VALUES ('f9d95f6c-c3d5-4635-bac6-56994e3db31a', 'Peace', 'Peace', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');


--
-- Data for Name: park_area_mapping; Type: TABLE DATA; Schema: shared; Owner: -
--

INSERT INTO shared.park_area_mapping VALUES ('9d4ccf12-eea0-48c3-802c-260021363aad', 'de6b51b7-588b-4b41-95a9-110ead51ceb4', '0006', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('91bc7566-1e93-40f4-af89-c9f5bc7df876', 'de6b51b7-588b-4b41-95a9-110ead51ceb4', '0019', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('713ad125-262c-4d30-bcc5-88da12a2ddc8', 'de6b51b7-588b-4b41-95a9-110ead51ceb4', '1067', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c677462b-1adf-46d9-8723-0e46834dc404', 'de6b51b7-588b-4b41-95a9-110ead51ceb4', '1124', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('35eb9843-60dc-4629-b763-98846a1b0aec', 'de6b51b7-588b-4b41-95a9-110ead51ceb4', '1027', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3848bd13-4442-42ba-9b8e-b5305a6df883', 'de6b51b7-588b-4b41-95a9-110ead51ceb4', '1030', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('de163507-6160-429b-8481-12fcd83a6736', 'de6b51b7-588b-4b41-95a9-110ead51ceb4', '1032', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0025ea9f-1381-49a0-9b17-1bb23b4b0cc6', 'de6b51b7-588b-4b41-95a9-110ead51ceb4', '1044', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('32ce9c9d-9b4b-4c6b-8737-0f6667a3d7ea', 'de6b51b7-588b-4b41-95a9-110ead51ceb4', '1108', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c22a1936-ec21-45dc-bfe8-553dbbe3a94e', 'de6b51b7-588b-4b41-95a9-110ead51ceb4', '1074', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('46822cde-55f6-4e82-8b46-1b4c6f7a69fe', 'de6b51b7-588b-4b41-95a9-110ead51ceb4', '1040', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5eaef3d1-edd4-4d32-8eb7-12ce03b36c66', 'de6b51b7-588b-4b41-95a9-110ead51ceb4', '1046', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3c2b4a33-8cfb-4b93-a4b5-d25819003fa3', 'de6b51b7-588b-4b41-95a9-110ead51ceb4', '1054', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('dbce8bf6-a88a-422d-b827-750e20308b3d', 'de6b51b7-588b-4b41-95a9-110ead51ceb4', '1033', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5f45029a-5998-4859-b2c2-9b920a05ef3e', '07cc2a3e-aa4c-4954-a363-97de7a34dba6', '0582', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9241fe3e-6489-42f9-940a-7e9b8fda7109', '07cc2a3e-aa4c-4954-a363-97de7a34dba6', '0129', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('405b5df9-78a9-4476-a225-9c6e9f1d10b8', '07cc2a3e-aa4c-4954-a363-97de7a34dba6', '9622', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2e6ad097-b6fb-465e-a2c5-526949a3b359', '07cc2a3e-aa4c-4954-a363-97de7a34dba6', '0170', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('80cca642-c108-4733-8cd8-884f87ab76e7', '07cc2a3e-aa4c-4954-a363-97de7a34dba6', '9679', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b9b9c733-7689-4efc-957b-08b7d7496f8f', '07cc2a3e-aa4c-4954-a363-97de7a34dba6', '0060', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3eac15ef-7507-4361-81b3-3b6a9bc40903', '07cc2a3e-aa4c-4954-a363-97de7a34dba6', '0587', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b4470e39-2e55-4717-a037-16fbb3ae8ee1', '07cc2a3e-aa4c-4954-a363-97de7a34dba6', '4275', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c3d97e30-9933-4044-a17c-8bb81b72c9d8', '07cc2a3e-aa4c-4954-a363-97de7a34dba6', '7458', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ca1d8eea-8767-43b3-b67a-78d22213f518', '07cc2a3e-aa4c-4954-a363-97de7a34dba6', '0211', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d944fb04-ce9c-47d7-baab-efe4cb216d5a', '07cc2a3e-aa4c-4954-a363-97de7a34dba6', '0302', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5926c1fa-aec4-4477-8782-8cd22b5ae476', '07cc2a3e-aa4c-4954-a363-97de7a34dba6', '0136', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ab963116-f0a6-4e65-820e-6129e34d4eda', '07cc2a3e-aa4c-4954-a363-97de7a34dba6', '0592', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8ee226fc-b01c-4d18-920c-80be15d15df6', '07cc2a3e-aa4c-4954-a363-97de7a34dba6', '0032', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c7041eac-5b61-4c11-a1c1-a42179a292b3', '07cc2a3e-aa4c-4954-a363-97de7a34dba6', '3070', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('44533048-639a-493d-86d3-8f314c09bd55', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '0396', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d4e3a98f-7ab3-4eb3-9b02-2a4d8452a71b', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '0394', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a435e14c-39bd-4026-8995-cca4fad9d5f1', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '0344', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('92e23bc5-f13b-4e7a-83e2-3090222cf191', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '0393', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e3a69a4d-10fb-4762-83d9-527df4f31263', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '0395', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('52b186ee-be0b-4554-aae9-a58ebe8bafcd', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '0389', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('717e269b-1c43-4744-9cb4-37e803853ca6', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1005', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1b12de1e-7700-4bab-b64c-a77448a22b70', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1029', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6dcd0f3a-0931-4df1-b402-1014ef849bb7', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1034', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2f23f451-193a-4910-9301-6e1c802d09e4', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1073', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f9a4eb5d-67ae-4b98-a6ce-310283f4c068', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1035', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e7fd3058-40d6-403c-a4e5-33c99782a49e', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1036', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('013f71f6-b831-41bd-8a58-9e6789fec93f', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1037', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0ce98fd6-6c29-4371-b081-8a98d220636b', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '0343', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a072cb2c-d3be-401e-a6eb-46ded9cc8c2e', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1042', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7b06b66d-37bf-45c5-ab9c-08ff8293ead8', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1043', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ec5a55b5-9481-4aa5-8129-53fd96214737', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '0547', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('629ce451-7bb3-4dbc-a426-bfc60b7e915e', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1045', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e7f5a9f5-f5c8-48de-a473-09718b234d02', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1013', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b39e1e89-5f86-47ee-b1aa-efb4228de15d', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1016', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6744c0e9-c0c4-43a9-8e97-24c69239a885', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1020', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2a318e10-50cc-4aad-b878-521bf13036bd', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1050', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b2c34efd-b9e4-4f0c-bbdd-1149abe7f29d', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1051', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b6a1afdc-77f9-4e42-8cc7-1f3da056c3a5', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1056', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b5fcf982-e72b-43f7-908f-dfaef04aade3', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1052', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6aaa229a-9e4b-4458-8f9d-c24dad69d003', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1053', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('248283e1-90f8-450a-8843-87e4e336a700', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '0549', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b74615b8-a9ed-4b08-857e-f80e7e3b4554', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1055', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c3e11131-aabc-42ee-b3f0-70cc1a2608ab', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1057', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('08b0be8d-3b4b-4231-a524-e335b98fedb6', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1071', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d00a4738-db02-41c3-b0d9-6e9e3e2d7255', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1019', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5adb4a28-44ee-46b9-aa88-8c9d946d64a1', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1060', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d8f853bb-1753-4df9-8ac6-cefc031007cb', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1061', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ddb579f6-b02e-4970-946b-919e215824da', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1063', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('614e38f0-47b8-4a3a-9b6b-24daf75e8f71', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1048', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3eec4371-75ee-40b9-9798-c7808012d7ce', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '1066', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ca70f5fb-7144-4fc9-962e-fb5e17b7f763', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '3103', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9821ad46-a847-48a1-bf75-b2d24660ad04', '5ed0d006-8d3f-4578-938e-7b43645efdbc', '3023', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f04dfbd7-ca33-4702-b6cd-eb98e8af28d8', '3bfa96e1-9501-44ee-877e-e1d88c49b597', '0398', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f34c71b8-6bd1-4d13-a362-91383c04b7e7', '3bfa96e1-9501-44ee-877e-e1d88c49b597', '0585', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0a4fe6d6-d5a6-4bf4-8d31-1fb6eab25001', '3bfa96e1-9501-44ee-877e-e1d88c49b597', '0588', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('44e45634-4be2-4a06-bbe4-50a0920779dc', '3bfa96e1-9501-44ee-877e-e1d88c49b597', '9456', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9794d331-0565-4cb1-a057-bfe3944ccb51', '3bfa96e1-9501-44ee-877e-e1d88c49b597', '9489', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9df0fedf-c33d-4269-9502-4851942a3d80', '3bfa96e1-9501-44ee-877e-e1d88c49b597', '7668', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b72fada8-c5ec-471f-94a8-5800c6ebbc83', '3bfa96e1-9501-44ee-877e-e1d88c49b597', '1084', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('688ca7b9-06d3-4710-a2d3-b3080101f1d3', '3bfa96e1-9501-44ee-877e-e1d88c49b597', '0590', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ee93739d-89cf-4d67-9219-65e831e2d714', '3bfa96e1-9501-44ee-877e-e1d88c49b597', '1087', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5114cb25-9cdd-486f-aa55-a61c62a33086', '3bfa96e1-9501-44ee-877e-e1d88c49b597', '0409', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('102ad845-6780-4778-b2dc-6e65af7a1187', '3bfa96e1-9501-44ee-877e-e1d88c49b597', '224', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0bb5df61-6b9e-4ab3-badb-76f158f5ab9b', '3bfa96e1-9501-44ee-877e-e1d88c49b597', '9481', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ad8f3954-e2f1-48ed-a2aa-3126bbae4cdb', '3bfa96e1-9501-44ee-877e-e1d88c49b597', '3055', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('34a08a96-cc08-473c-a305-12d4e72d0316', '3bfa96e1-9501-44ee-877e-e1d88c49b597', '3101', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('48dc797f-8323-4146-b0c0-09953675f162', '3bfa96e1-9501-44ee-877e-e1d88c49b597', '3064', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4e2499f3-960c-43dd-a97c-7fac51209030', '3bfa96e1-9501-44ee-877e-e1d88c49b597', '3053', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f8ddc6ca-a5e5-4bf6-a15b-c8fb6e308408', '3bfa96e1-9501-44ee-877e-e1d88c49b597', '3035', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c1925c2b-82d8-4188-9c07-97e67d2888c7', '5624d05a-1a06-4aa3-adf0-ac56db6b478c', '9713', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6f30db0a-7dc3-4375-a39a-8df8bc1aad4a', '5624d05a-1a06-4aa3-adf0-ac56db6b478c', '9714', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5fff9edb-18cd-48f6-ad6c-32e0eedc6c37', '5624d05a-1a06-4aa3-adf0-ac56db6b478c', '9716', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5adde22d-d814-477e-a318-cbe02fb56a86', '5624d05a-1a06-4aa3-adf0-ac56db6b478c', '6818', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('89b6d69f-1ca2-4433-be27-7eb760ced430', '5624d05a-1a06-4aa3-adf0-ac56db6b478c', '9722', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('634391dc-65ac-45d2-990a-c3922b0cc283', '5624d05a-1a06-4aa3-adf0-ac56db6b478c', '9728', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('66d19704-7034-4c5c-a51a-ef1aadb60156', '5624d05a-1a06-4aa3-adf0-ac56db6b478c', '9729', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1add57b6-4caf-4958-94dc-91cea86e724b', '5624d05a-1a06-4aa3-adf0-ac56db6b478c', '9732', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('cf2621bb-241d-4f75-9ce4-a390ebb7a00c', '5624d05a-1a06-4aa3-adf0-ac56db6b478c', '9731', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6c7ec355-699b-44cd-9430-2eddfc45bc29', '5624d05a-1a06-4aa3-adf0-ac56db6b478c', '0195', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a4780f2f-57c9-465d-861e-64028d6a7f09', '5624d05a-1a06-4aa3-adf0-ac56db6b478c', '9733', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6c34e18a-7b5a-4469-a2a0-fb3b7571e7c7', '5624d05a-1a06-4aa3-adf0-ac56db6b478c', '9735', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('69567cbf-c9cf-4e8d-ad92-61f1dc8a334e', '5624d05a-1a06-4aa3-adf0-ac56db6b478c', '9698', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1454766a-f51c-432e-91cd-5d21b7c91658', '5624d05a-1a06-4aa3-adf0-ac56db6b478c', '0024', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('18940228-ddad-4231-87c3-3a711aa04c73', '5624d05a-1a06-4aa3-adf0-ac56db6b478c', '9740', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c02ed321-c793-4e34-ae76-8036a015fb28', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '0583', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c9280835-49fc-43c0-a78b-e54a5da9b50e', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '0213', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('996fbb1d-14a4-4537-96a8-4acbc3310f23', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '9563', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7ee2467e-70c2-4c73-a478-67e6e087b777', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '0057', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5df5a7f9-3f6e-4060-8a8a-9a03784eec6d', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '0059', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2c4a86bd-c095-4531-8720-392180893fc7', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '0135', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ff1baab4-89c0-43de-bfc6-198b6ff3d56c', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '0026', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4a743bc4-1183-440c-bae9-1509d38268de', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '0628', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('944b4aa5-01df-4671-b80f-bebf55d71714', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '0629', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e5cd8374-ce38-49c9-87d2-64d1eb1c075a', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '0586', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('be0d5826-77c7-42fb-a33d-f37bb024be3d', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '0217', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b81792ff-8a8a-48f1-a305-dfe1f91a8c78', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '9557', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5b08fa1a-7137-43b8-8693-92479d0fdcf1', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '9682', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d87a1fff-f76c-4d98-a8bc-416d161ac564', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '0625', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3bc3ecd0-64a7-4d54-82cf-00003e39f048', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '0273', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('53bae2a9-36ed-452b-ac39-98300f3d9c0c', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '0268', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7bba399c-0139-469b-858c-f42d469e14da', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '9482', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c3845da2-593b-4c95-a16d-1502cc0ceb17', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '0068', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('aef7395d-ccf1-4499-a170-760b698d065e', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '0589', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('22e14410-0861-461a-bd83-6b14a3474742', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '9485', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('440c2ade-89fd-4ad0-9ca8-6916af63a7a6', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '9480', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('41772d81-6aca-4063-b359-edd0076dd4a3', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '0591', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9c85df75-5bc1-44ba-b51f-60d791ca0c39', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '0584', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b46bb48e-b528-4dbb-b1ba-a0578599c6da', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '0111', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('01a8226d-412f-40fe-b933-034db8cf02cd', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '9483', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('79a1737e-ad62-4508-a15e-fc934b8a7e06', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '9590', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2db34380-5bc8-4237-9e66-3bdbd0a561bc', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '3127', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('43960964-8e3e-49bc-a2a9-aae9f581ebb3', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '3065', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ab33c47d-06a3-4bae-8541-885991264a5b', '0bdc6182-6d04-48bf-9096-22361603cfd3', '0308', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('cd3c5173-7ca2-4e06-9a45-989c351317c7', '0bdc6182-6d04-48bf-9096-22361603cfd3', '0323', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('939cf20a-338b-42d6-9b2b-4652da19edc4', '0bdc6182-6d04-48bf-9096-22361603cfd3', '0051', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('bbcb25c1-f8ba-4518-bdec-8b80c3eba459', '0bdc6182-6d04-48bf-9096-22361603cfd3', '9553', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('aeaa4e06-ecad-4aff-b44f-cb75c8433099', '0bdc6182-6d04-48bf-9096-22361603cfd3', '0010', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f2d333ab-e163-4785-abd9-2cf992674c24', '0bdc6182-6d04-48bf-9096-22361603cfd3', '0017', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b9a74afd-f757-4962-9dbe-81f901478d49', '0bdc6182-6d04-48bf-9096-22361603cfd3', '0404', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6d664de9-35da-4e78-9f47-3822809e733d', '0bdc6182-6d04-48bf-9096-22361603cfd3', '0324', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0d583e9b-9c5b-41ff-88e1-d14ced348be2', '0bdc6182-6d04-48bf-9096-22361603cfd3', '0232', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('dad58974-baaa-4d38-beb5-394bd91279cc', '0bdc6182-6d04-48bf-9096-22361603cfd3', '0110', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0239079e-0669-43c0-8c61-cafe0e9076c9', '0bdc6182-6d04-48bf-9096-22361603cfd3', '0156', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b36a7060-4ca4-455f-ab4d-68bc94cd6c2f', '0bdc6182-6d04-48bf-9096-22361603cfd3', '0202', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('733ca069-6ac7-4cf1-97fd-d29a1da8e8ca', '0bdc6182-6d04-48bf-9096-22361603cfd3', '0327', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('79ef15b3-a1ff-4e81-8476-a0a3645cb144', '0bdc6182-6d04-48bf-9096-22361603cfd3', '9960', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('95d2a4af-55c9-47f9-9573-119180ac6418', '0bdc6182-6d04-48bf-9096-22361603cfd3', '3032', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('db8170ef-dab2-4594-a1b0-5779d0fbc2d2', '0bdc6182-6d04-48bf-9096-22361603cfd3', '3031', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('681907c5-fbad-4dec-a288-5f7364dfb303', '2382b484-546f-4b6b-bcf6-af64b3d3a96f', '0206', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('cf962583-3b99-4ca2-8d6b-d6815eca0d60', '2382b484-546f-4b6b-bcf6-af64b3d3a96f', '0172', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4d4175a4-2997-4b4c-add5-41807decdc9d', '2382b484-546f-4b6b-bcf6-af64b3d3a96f', '0362', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('21b00350-d99d-44d0-8672-ab001806df27', '2382b484-546f-4b6b-bcf6-af64b3d3a96f', '9681', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('79582e04-20c6-45e4-9a62-1ff98de5a7d6', '2382b484-546f-4b6b-bcf6-af64b3d3a96f', '0061', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2e09e4c8-6177-46a3-a07f-39d7d367a64a', '2382b484-546f-4b6b-bcf6-af64b3d3a96f', '0034', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('599ee7a7-2fb8-4ed4-bc1f-f3edb6e22cf4', '2382b484-546f-4b6b-bcf6-af64b3d3a96f', '0293', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7cefd333-f5fb-418d-bd79-23380733cc2d', '2382b484-546f-4b6b-bcf6-af64b3d3a96f', '0130', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0c71457a-c124-407e-a19e-f3ab1e778127', '2382b484-546f-4b6b-bcf6-af64b3d3a96f', '0005', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('08d8e921-bb61-4456-bae9-7e68a087d6d6', '2382b484-546f-4b6b-bcf6-af64b3d3a96f', '0098', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1b6d6014-1f75-4ddb-a0ab-0c083d69087f', '2382b484-546f-4b6b-bcf6-af64b3d3a96f', '0025', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b63c06da-cc20-43a8-9b21-e83227f7e9ca', '2382b484-546f-4b6b-bcf6-af64b3d3a96f', '0114', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6b079427-f4dd-40c8-9e7c-62305a94d790', '2382b484-546f-4b6b-bcf6-af64b3d3a96f', '0247', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ad7cfe12-180e-41a7-8f58-6cf6365b11bd', '2382b484-546f-4b6b-bcf6-af64b3d3a96f', '0053', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6b904286-825b-4922-99cc-d57805c0b98f', '2382b484-546f-4b6b-bcf6-af64b3d3a96f', '0287', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c4813d5c-1ca0-4460-9556-7d1d8ddb09e8', '2382b484-546f-4b6b-bcf6-af64b3d3a96f', '7211', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5f313fe2-0674-49f7-aa4f-de62c6e56f56', '2382b484-546f-4b6b-bcf6-af64b3d3a96f', '4984', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('30261baf-7a39-4527-94b4-f460f71c7eaf', '2382b484-546f-4b6b-bcf6-af64b3d3a96f', '3020', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('04d1cbe3-3a7c-4949-a1e4-ee202bb622a8', '2382b484-546f-4b6b-bcf6-af64b3d3a96f', '3056', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a0fecdc6-90ce-4bda-9266-65bf34a18f1b', '2382b484-546f-4b6b-bcf6-af64b3d3a96f', '3019', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('41229985-b9f5-4329-86c9-43aab5859465', '2382b484-546f-4b6b-bcf6-af64b3d3a96f', '3026', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('011ff8f1-76b0-48cc-9ebc-77298b124f9f', 'c9627a1f-d890-4191-9497-95743cbe0011', '0338', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('30aae01c-b0f5-4510-9c01-727b339a0f44', 'c9627a1f-d890-4191-9497-95743cbe0011', '0120', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a98f6cc3-238f-4dd2-a7cd-61530d4632af', 'c9627a1f-d890-4191-9497-95743cbe0011', '0102', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e0d3e0ec-ad52-4079-a181-3cde91f5e539', 'c9627a1f-d890-4191-9497-95743cbe0011', '0253', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b5d4430b-4e98-4d70-81f7-adeec6009b92', 'c9627a1f-d890-4191-9497-95743cbe0011', '0121', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7496517d-83db-499f-9300-52d7557046ce', 'c9627a1f-d890-4191-9497-95743cbe0011', '9680', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('14add1a2-2a50-4714-8709-fae20a8efa7b', 'c9627a1f-d890-4191-9497-95743cbe0011', '9185', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e294447b-0360-421e-a146-1527dc3cec74', 'c9627a1f-d890-4191-9497-95743cbe0011', '0065', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('28c54c46-e023-4b50-ac6a-15dcc70b6efe', 'c9627a1f-d890-4191-9497-95743cbe0011', '0235', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6b95ed03-4523-4c10-b7f8-4a04ada9a734', 'c9627a1f-d890-4191-9497-95743cbe0011', '0144', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('775698a0-5493-42e9-9cfb-f6d94588cd09', 'c9627a1f-d890-4191-9497-95743cbe0011', '0105', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4f4a9893-b623-4ec3-865a-52e0bd5f9263', 'c9627a1f-d890-4191-9497-95743cbe0011', '0108', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('517c0be7-ce22-4e74-9981-9d789be96d8f', 'c9627a1f-d890-4191-9497-95743cbe0011', '9434', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('99456412-c303-42eb-8354-1f340e24cde8', 'c9627a1f-d890-4191-9497-95743cbe0011', '0112', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('56655759-c545-4c07-b4e7-77f667d20016', 'c9627a1f-d890-4191-9497-95743cbe0011', '0256', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9e526984-c4da-4b25-8fed-2f7ec0fc67d0', 'c9627a1f-d890-4191-9497-95743cbe0011', '0282', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c6d9e585-c343-4d8b-bbb6-02c1a7e34fe5', 'c9627a1f-d890-4191-9497-95743cbe0011', '0079', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('51c409a8-6975-4881-a5e5-4936824a6db7', 'c9627a1f-d890-4191-9497-95743cbe0011', '9773', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d3a458b0-b898-4aec-9196-eea64aad0521', 'c9627a1f-d890-4191-9497-95743cbe0011', '3104', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4396ba14-9408-4fda-87ea-071b9cfd02e4', 'd94648ef-ed6e-4c48-9312-5ad43fd4e22d', '0169', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7d1d569d-eb34-4ba6-b020-2e0aa36fa0da', 'd94648ef-ed6e-4c48-9312-5ad43fd4e22d', '0185', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6ae19ca9-42f4-4ce5-ae01-22e6097e3438', 'd94648ef-ed6e-4c48-9312-5ad43fd4e22d', '0216', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('85eb95aa-6364-42fc-8988-02e6626af9fe', 'd94648ef-ed6e-4c48-9312-5ad43fd4e22d', '0174', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4ed2344e-eeab-4501-9f7c-76857bb4da03', 'd94648ef-ed6e-4c48-9312-5ad43fd4e22d', '0311', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9a90bd67-5008-42ac-91d8-393aea4fc6a1', 'd94648ef-ed6e-4c48-9312-5ad43fd4e22d', '9551', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('70c1a310-ab07-44e3-9dc3-1aabb6893f10', 'd94648ef-ed6e-4c48-9312-5ad43fd4e22d', '0052', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c95209f1-57ca-49b0-89ae-9953095522ca', 'd94648ef-ed6e-4c48-9312-5ad43fd4e22d', '0004', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8fa26187-2185-4462-98d7-51a8182d1691', 'd94648ef-ed6e-4c48-9312-5ad43fd4e22d', '0357', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0ee66846-c1c8-4a1c-b091-a637ab50f472', 'd94648ef-ed6e-4c48-9312-5ad43fd4e22d', '0012', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4da20ce2-1ee1-46f9-8ce5-6b2a558f3dbd', 'd94648ef-ed6e-4c48-9312-5ad43fd4e22d', '9550', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('329a894a-0314-4a25-aa99-27ac3c9b1f50', 'd94648ef-ed6e-4c48-9312-5ad43fd4e22d', '0163', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3c0808c4-74a8-4073-8429-2ca86e8cb6c5', 'd94648ef-ed6e-4c48-9312-5ad43fd4e22d', '9435', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('98980ada-039d-4244-bf57-3a0bddc0704a', 'd94648ef-ed6e-4c48-9312-5ad43fd4e22d', '0164', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5197991f-668a-42fe-a699-793cef965361', 'd94648ef-ed6e-4c48-9312-5ad43fd4e22d', '9552', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ed170b48-7238-484e-b979-7dbc063660a0', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '0527', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a500092a-1fc8-497d-ae24-4d5b694e0b37', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '0056', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('31f48802-0cce-45da-b2c5-4bc5f327e484', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '0456', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('811a130f-9fcf-4bf1-badc-6f3c79d0f92c', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '0225', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e1a56a0c-2851-4ee1-828f-a68aa1bc7958', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '0244', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('31bae749-0479-4837-8816-7042420bfe2d', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '0528', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('eca248e1-3f21-47d3-b216-2c19ab35f7c9', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '9549', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('00626e27-a3aa-45c8-a710-3ba6a1264f3c', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '9548', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('958cbacf-2205-4cf6-8a96-325deae94817', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '0442', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('bea7c084-a8dd-4cf0-bd4e-973db8196e91', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '0319', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('80335b8c-6472-4a8b-8645-d277a7172f0c', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '0066', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0f626aec-2f43-4985-8eea-5020537c371d', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '0236', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4ab2e3fe-ae48-476c-adb0-13f05fb82963', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '0446', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('846af067-b98f-46ac-91b8-93d191bbbdfc', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '0259', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9e9edae0-2a39-4e74-bf5e-e5f3d8cd62c3', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '0153', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('cd99a4e2-8a23-48cf-9bb5-0fc51265861a', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '9711', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d8c38d93-15ec-4599-9a85-f1a9701b43ab', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '0440', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a26d526d-67b5-4a50-a830-2bfb143ab2dd', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '5024', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d14af3a9-3ea7-4daf-ac67-7695b0ae3e8e', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '0471', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5b413673-7e7f-4cc3-92e6-1682fee4761e', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '3034', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9e350651-5563-4b63-8db5-8fadfea6076e', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '3051', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('89c3621a-7d3f-4cfe-a1f4-9ccbc82f6424', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '3006', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d0cf8d5f-9772-4075-9c1f-4ebe23ffa2de', '7bfca370-7bcf-4830-9641-7ea9798ee5db', '3005', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8346ad5d-a3ce-41c6-bc23-af3d53f9e38a', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '4104', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2888efa0-7ed4-4221-93fc-2f839f8aeaaa', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '0086', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9b7f1792-d4ce-49ec-a19b-a967454c9719', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '0139', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('76c308c1-3922-4aef-b269-03ab2fdada9c', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '8697', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('fb687768-d6ba-43f4-a7bd-adf6876c9b48', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '0277', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('09758dd1-3c15-4b6f-b0e1-1d4bc207b463', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '0378', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4afe39fb-868e-4b18-90e4-2ba2fb368221', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '0453', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('954a0e21-2e08-425e-a5cf-a30181b05262', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '0241', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('478dbe6e-12e1-4351-aa6d-435dd3680449', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '0020', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9ff46db5-1468-4567-a4bd-86cd44b4acfa', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '0468', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a42f49e7-c5f2-42ac-a3e8-ab35c4f575ba', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '0143', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1e0f0ec3-e101-4c8c-bd2f-ea3485d3f427', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '0445', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5c3f6e37-34f8-4eff-b7aa-4e9aa7e86b34', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '9335', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4d86112d-ff7f-43f2-b63d-a16a310ae0a1', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '0027', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6f59c9a7-b25d-4005-b56f-fa8232ed8f4e', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '0463', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d55f1e61-5d36-462e-a067-e161a1f31781', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '0467', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('af975e30-7973-4082-ac6b-e95ecc7b9599', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '6610', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('636b1977-2f84-4e5d-ae8e-3e3338947403', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '9518', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c176e4ac-ba05-42cb-bcb0-eab76acfd5c3', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '3077', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('94c7ad31-30fa-41f3-931b-434123adc7da', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '3108', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2adfddea-f5ff-4da5-ae79-23f360b4abf3', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '3049', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f236779b-9220-4e7b-99c8-74d61f8ad56a', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '3042', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9803e6e2-3a59-4fac-bfea-eb92995a3b2b', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '3043', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('07f018b2-f81e-4746-8a98-74db65dfdba8', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '3061', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('bdeaa5a1-b0ef-416a-b985-f732137c0a49', '3b858d4a-19e8-4f9f-b258-1d01ae571db2', '3030', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('06e1e682-d509-4308-b176-00b7da6c91e4', '5af6376d-20d6-478e-b45f-d50394b7f317', '0307', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2efb2911-b7e6-4cb7-9051-e0633d7cabb7', '5af6376d-20d6-478e-b45f-d50394b7f317', '0035', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2934399c-d518-4e39-99f9-b481ba084eca', '5af6376d-20d6-478e-b45f-d50394b7f317', '0201', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('de6609fc-43d3-4b28-b383-47d51372df6c', '5af6376d-20d6-478e-b45f-d50394b7f317', '9213', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('134bfd88-5587-4ffb-a0bc-c8480beb3785', '5af6376d-20d6-478e-b45f-d50394b7f317', '0142', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5516e12e-365c-457a-8cf9-08e96f0ee5c9', '5af6376d-20d6-478e-b45f-d50394b7f317', '0064', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('416abab5-0c00-4012-bb0f-9ad069facce2', '5af6376d-20d6-478e-b45f-d50394b7f317', '0218', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('21a7307d-6ca9-4e2c-ab54-195a65abf9cc', '5af6376d-20d6-478e-b45f-d50394b7f317', '0073', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('51f3a7ee-e986-4024-bce9-9eb20b285fd9', '5af6376d-20d6-478e-b45f-d50394b7f317', '0054', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('61ab0ba0-c8a9-4730-adc8-7d9fcea2f3cc', '5af6376d-20d6-478e-b45f-d50394b7f317', '0474', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0d6a928e-647a-4abc-8780-3fd7cab3a49e', '5af6376d-20d6-478e-b45f-d50394b7f317', '0272', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f06b9727-ac12-4db7-9b6c-fa80cfc0a496', '5af6376d-20d6-478e-b45f-d50394b7f317', '0462', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('441e44ce-0b3b-4248-a3f3-b301c00b6e76', '5af6376d-20d6-478e-b45f-d50394b7f317', '0204', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7e8d4450-8ac2-45b3-84c4-4d8758aaef61', '5af6376d-20d6-478e-b45f-d50394b7f317', '6547', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('099cf3d2-e411-40c0-87f6-ef0eb7e7f319', '5af6376d-20d6-478e-b45f-d50394b7f317', '0077', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b6040a1d-5c19-4de8-8938-a8dd4aebcccf', '5af6376d-20d6-478e-b45f-d50394b7f317', '9587', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('31f8e316-35ff-4c5a-a26f-f424561a37af', '5af6376d-20d6-478e-b45f-d50394b7f317', '5018', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('830919ff-7e0d-4a0a-954e-e27d517b5802', '5af6376d-20d6-478e-b45f-d50394b7f317', '0464', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('cf8da097-6ddc-4c33-a812-e48d398bee43', '5af6376d-20d6-478e-b45f-d50394b7f317', '6624', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b63eeef1-14aa-45b5-a2ac-a049b57095ac', '5af6376d-20d6-478e-b45f-d50394b7f317', '3033', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('583f5a63-dc77-410c-a89c-0ece98af0fa7', '5af6376d-20d6-478e-b45f-d50394b7f317', '3100', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c1160580-68d0-416f-955c-910eee2c8ddd', '5af6376d-20d6-478e-b45f-d50394b7f317', '3130', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b185a87a-a594-4a08-ab03-a1c0cdab848b', '5af6376d-20d6-478e-b45f-d50394b7f317', '3007', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('fe6e325c-7ccc-4c8e-9117-6543c6fae3b0', '5ea35b3f-7c47-44b4-bacf-e076239016a4', '0119', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b6d80968-d46d-4b5d-81bd-81425310e9fe', '5ea35b3f-7c47-44b4-bacf-e076239016a4', '0058', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('98c05395-bda0-4714-9a0c-d795297f94c4', '5ea35b3f-7c47-44b4-bacf-e076239016a4', '0199', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('433237d5-b3bc-40e3-9cba-e20b8ddcd3fb', '5ea35b3f-7c47-44b4-bacf-e076239016a4', '0033', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('663da41b-8f3e-4b2b-ac74-b666c719e112', '5ea35b3f-7c47-44b4-bacf-e076239016a4', '0011', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3e4984c7-358e-411d-83a8-b9872a77c0d2', '5ea35b3f-7c47-44b4-bacf-e076239016a4', '0022', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c97c57e5-3a67-4e29-b91c-5b9f5df59952', '5ea35b3f-7c47-44b4-bacf-e076239016a4', '0146', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5f044a97-de7d-4e6f-b4cf-f830ff7830e0', '5ea35b3f-7c47-44b4-bacf-e076239016a4', '0076', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9b961ed6-1b98-4fb4-93a4-59f669aed021', '5ea35b3f-7c47-44b4-bacf-e076239016a4', '4982', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d3eb5165-499e-45df-bd32-aa7e11af4ca3', '5ea35b3f-7c47-44b4-bacf-e076239016a4', '0598', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6989695e-673d-4acd-b7e3-c40492c5e55f', '5ea35b3f-7c47-44b4-bacf-e076239016a4', '0448', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e08037cc-5ea8-442e-8129-b7ec8a8ba2b9', '5ea35b3f-7c47-44b4-bacf-e076239016a4', '3027', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5cb9b7d6-a9ce-4733-a9d9-8ffe4d181339', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '0055', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('13702d63-0f3b-4b50-b7e6-7275c3774576', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '0251', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2387f931-bebf-4538-96e0-b72c40c4ffd6', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '0435', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f30938a5-af4d-47cb-8ac8-a19efcf7f948', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '0177', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('51011188-5d31-4ff2-9e79-889bb3ea58ff', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '9597', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3b365f5c-6e79-4fc7-85d6-42bad20beed1', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '0436', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6145d326-8516-4fa7-a238-c8685f541e0a', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '0437', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0063251d-e1c1-416d-a714-14442777b6ca', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '9808', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4a9b020a-6815-4540-9230-9d4ceb80cb18', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '9809', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('419f311a-97cb-4dfa-9228-3ca1e037d1e5', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '9810', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c41f0fd9-3d99-401d-8e26-5c09b2487899', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '9864', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('eb5fd4dd-3240-4659-a8cc-1da9877672c0', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '0518', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('81bfa3b4-4bc3-4dbb-90b7-a4afaf9c1699', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '9812', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c6019cbd-4a6d-4827-8157-f61ef755febb', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '0234', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0d27ebee-158c-4a5d-9bfd-151a539a64bd', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '9793', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8ca92a81-1582-4419-8043-e40315a9ba06', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '0370', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1ffbb315-ea6a-4a28-a4e9-8fd9b25e0c93', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '9658', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3b9bac59-a63f-470e-9df8-d1f6a70922ad', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '0230', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4af8b292-3cbe-4932-812b-061dd5103633', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '0406', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('59232f5f-2409-4932-b5d1-36ed9f6fdc39', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '9118', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('14f6243d-7d67-43e1-92e8-a87d5b5b4767', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '0317', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b4c6fd49-5b92-427c-a5c0-3c99ef1f44fc', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '0078', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8de5aabf-a8c4-467e-aebb-4a513111bf80', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '9796', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9b59169e-be51-46eb-87cc-41ae1203127e', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '5027', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('800a4857-4568-4152-8600-36a92bd6311e', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '3071', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f573993b-2b57-41ce-8e1f-125fda9e2ff2', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '3087', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('fe92c319-6bc8-4eb9-a82b-b0e437caa7ff', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '3036', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d461ee3d-84ca-458b-91c7-876a97a3def4', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '3085', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2a996641-130e-4b7d-a9a5-c5c9874d80dd', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '3091', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6383373c-7fce-4c35-8d46-41b657c2f4c7', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '3041', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('31b1c0dc-11ba-4fcb-a602-aa85fa68c199', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '3038', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('427b6bd4-2c6c-4c49-a302-f1e73c6010c1', '414e799d-1253-438b-a55a-4e50228b474b', '0415', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8dda2687-3c92-47cd-b401-947b2c1b9f14', '414e799d-1253-438b-a55a-4e50228b474b', '0416', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('472164e3-b270-4448-b8eb-17c61b0f0472', '414e799d-1253-438b-a55a-4e50228b474b', '9802', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('aabbdb7a-75f2-4c92-831f-2fdd1ee2a177', '414e799d-1253-438b-a55a-4e50228b474b', '0002', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('92b80862-24b9-4279-9152-c330c78046d7', '414e799d-1253-438b-a55a-4e50228b474b', '0325', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('57bc7518-a891-4827-9369-dd0d68f1c5e5', '414e799d-1253-438b-a55a-4e50228b474b', '9034', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ef815951-c943-4612-8211-77c1e35a30da', '414e799d-1253-438b-a55a-4e50228b474b', '0385', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('41cef31a-475e-47b1-9aa7-0c8f21ce8f4c', '414e799d-1253-438b-a55a-4e50228b474b', '0425', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4fd467a2-be76-4fc8-8417-e55ba94eb79d', '414e799d-1253-438b-a55a-4e50228b474b', '4214', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('90d32e64-299c-438b-b912-6caa012131fc', '414e799d-1253-438b-a55a-4e50228b474b', '0422', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('13d5b751-bf58-4861-be66-a84ced7835f1', '414e799d-1253-438b-a55a-4e50228b474b', '9461', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e2283f2c-c776-46a5-8dfe-7f025a8ffa44', '414e799d-1253-438b-a55a-4e50228b474b', '4983', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('661423e4-402b-462e-aa63-d2bd7f14f83e', '414e799d-1253-438b-a55a-4e50228b474b', '9794', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6410ba2e-d8b4-44a4-9fa7-2c3abbde89ea', '414e799d-1253-438b-a55a-4e50228b474b', '9801', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e1bd7455-063b-4dc8-8134-58055af7542f', '414e799d-1253-438b-a55a-4e50228b474b', '9805', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('eef3574b-2eee-4870-bd94-72700fdb6e8a', '414e799d-1253-438b-a55a-4e50228b474b', '0509', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7f611c6f-8c0a-4251-b859-66b1a4391d79', '414e799d-1253-438b-a55a-4e50228b474b', '5043', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('84c14dd2-4fa0-41e4-b7a8-876319941e31', '414e799d-1253-438b-a55a-4e50228b474b', '5029', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('da00fb83-ba57-4147-894f-b0867197efba', '414e799d-1253-438b-a55a-4e50228b474b', '9821', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d37adeb0-6894-4da1-8f7b-d2b9d3a5b0c5', '414e799d-1253-438b-a55a-4e50228b474b', '5037', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('cd7c0eca-fe6b-4be2-982c-e1264340ea60', '414e799d-1253-438b-a55a-4e50228b474b', '3084', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d2ee00cf-a1b6-454c-a4cf-1289a69a3214', '414e799d-1253-438b-a55a-4e50228b474b', '3082', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b9978835-ab7a-4d54-8b3a-21809c9abbe5', '414e799d-1253-438b-a55a-4e50228b474b', '3039', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1bf203a9-2467-4cad-bbb0-411f92c051ff', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '9453', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6924997a-3613-4fef-8452-3beb008c3bea', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '3931', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7e3c0e88-8fdb-4891-bd82-83e5ae921ea6', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '0115', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e90b7503-d476-4a3e-8056-87e9d7fb2505', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '9855', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2d0df4cf-4d5a-4fcb-8517-27ec2f8a28cb', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '0318', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a2db2e7c-c17a-4f70-a967-48f27fba8f41', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '0355', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('156af9c4-1aea-469d-84fa-3f773e3fe5fb', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '9792', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e8670ab8-8be7-4b1d-92a8-fe4b6ab46119', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '9780', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0acb4bc1-bce3-4833-8994-f48cd9ea9c08', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '8053', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6c92270e-bdbc-4433-ac43-e1a7b6bb782e', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '9795', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('41d5d804-d6c6-4937-8b30-bda0538326dd', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '8796', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f2d015a5-eca3-4e1c-a0ea-98e7eb447d7e', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '0345', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d905876f-df19-41ea-9622-c62a897563c8', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '0229', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('84bd3c82-183c-4260-9505-479feb0431c5', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '9815', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ac299f30-2db3-4f63-81c3-97039cc45aec', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '0305', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b959215a-fefd-4479-a6c6-fee8ffd9e576', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '9953', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('34ccd6cb-479b-43ea-9a96-ca399c553fba', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '9779', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('00559865-6bf4-4730-b15b-ba5afbc000c5', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '5044', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2b6944a9-25cb-4796-9475-03383fe1361d', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '5031', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('00f7b92c-4755-4444-9283-aa4c08379495', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '3086', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b7ea3e2b-9057-4adb-9b59-c7bfa801accf', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '3079', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b8abe5fd-4d3d-45e6-9ea2-a0b7b7cb4c1c', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '3060', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('de31cc70-8b48-412d-b7a4-48262e76bb10', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '3134', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('bd56203c-f274-4f68-a469-2b0825b4f10e', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '3078', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b903e3a0-9ed4-4cae-bece-4d5685d0e145', '5dd75f7f-8a63-4b7e-a59e-9beb02e55e82', '3072', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1eb2071b-f7f0-4843-a1ef-417c4e025ed7', '286b0494-178f-49a4-ac3c-19fe27574034', '9828', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6aa650a9-ffc1-480c-8878-3bcd40d8e410', '286b0494-178f-49a4-ac3c-19fe27574034', '8297', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a2e15e25-43e7-4001-a582-6e0e6105785b', '286b0494-178f-49a4-ac3c-19fe27574034', '0426', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c2a709ea-4346-40fc-96f7-2199dc355402', '286b0494-178f-49a4-ac3c-19fe27574034', '9797', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('eedf624e-19c0-438e-bdd7-bce253f02f34', '286b0494-178f-49a4-ac3c-19fe27574034', '9829', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0341ba4e-456b-4e19-9713-cec56b4cdafd', '286b0494-178f-49a4-ac3c-19fe27574034', '9820', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('68781b15-e26e-4628-aa32-570409f92e6f', '286b0494-178f-49a4-ac3c-19fe27574034', '254', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('81872211-16d0-486f-b8b1-d58bc9693ce4', '286b0494-178f-49a4-ac3c-19fe27574034', '8969', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('26ce09b9-e0a5-47a7-a72f-0187887fb704', '286b0494-178f-49a4-ac3c-19fe27574034', '0092', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('05ca6382-2538-4738-9672-2809fa49bf09', '286b0494-178f-49a4-ac3c-19fe27574034', '5034', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('14b1be6b-524c-46ce-b912-976bb87ad3be', '286b0494-178f-49a4-ac3c-19fe27574034', '0328', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('936e23ba-ecaa-4149-934d-c85960d33bdc', '286b0494-178f-49a4-ac3c-19fe27574034', '0093', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d99834ff-cf90-4ed7-85dc-b9b2f96631a4', '286b0494-178f-49a4-ac3c-19fe27574034', '0341', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f3acfd27-7754-422d-b11b-43d5d7c8ca7a', '286b0494-178f-49a4-ac3c-19fe27574034', '8288', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('06d2aead-1dcd-467d-b0a1-a57eb65b7834', '286b0494-178f-49a4-ac3c-19fe27574034', '0280', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('37d922a4-8da0-4909-baf2-d0377b8bab15', '286b0494-178f-49a4-ac3c-19fe27574034', '8299', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5e85476b-e94d-4bd5-89c8-10bf893961ef', '286b0494-178f-49a4-ac3c-19fe27574034', '9830', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4caae0f9-95c2-4961-9d15-d2d7960741b6', '286b0494-178f-49a4-ac3c-19fe27574034', '9843', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1beb9515-06f1-47dc-9cce-0fadde56641d', '286b0494-178f-49a4-ac3c-19fe27574034', '8277', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1a2f5786-5af8-4af1-a3c4-d9119f0ab955', '286b0494-178f-49a4-ac3c-19fe27574034', '0094', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0a90edff-2b6e-4a68-a29f-cc0d5aa19c28', '286b0494-178f-49a4-ac3c-19fe27574034', '8284', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('376cc6ac-384d-45a9-87b5-e10cc94b310f', '286b0494-178f-49a4-ac3c-19fe27574034', '4985', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1cc4bbd7-7570-4766-b36e-daea4f81abe9', '286b0494-178f-49a4-ac3c-19fe27574034', '5015', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0146baf5-3f2e-46e5-8664-a640ad141c84', '286b0494-178f-49a4-ac3c-19fe27574034', '9790', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6b2eef8b-ba74-4acc-b351-fd84674e31ce', '286b0494-178f-49a4-ac3c-19fe27574034', '4041', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('27f51463-87f1-4ffb-ab72-2eec277994c3', '286b0494-178f-49a4-ac3c-19fe27574034', '9799', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2319bce7-6d9b-499f-93c2-6883bca08aab', '286b0494-178f-49a4-ac3c-19fe27574034', '9803', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ffbdd80b-00fd-453b-b897-a41acf8c7add', '286b0494-178f-49a4-ac3c-19fe27574034', '8330', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d8eae478-4fb4-4fbd-886d-a5d16e38d4ce', '286b0494-178f-49a4-ac3c-19fe27574034', '5022', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('46f48d01-a572-4632-b555-131362465f9c', '286b0494-178f-49a4-ac3c-19fe27574034', '5023', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c6ec3970-2033-4bc2-b054-c469ce32fe79', '286b0494-178f-49a4-ac3c-19fe27574034', '5026', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('afb34c47-8b46-492c-8fd2-0a29d71f8d07', '286b0494-178f-49a4-ac3c-19fe27574034', '5028', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('fd7b6883-8e90-4548-a1b4-009b99d1eb7b', '286b0494-178f-49a4-ac3c-19fe27574034', '9819', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('151f79d3-de92-4e3b-b4c2-c7fe125b43d1', '286b0494-178f-49a4-ac3c-19fe27574034', '5035', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('cc6ab7ec-aea7-4a09-beba-3736ac78ac8a', '286b0494-178f-49a4-ac3c-19fe27574034', '3062', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('78010af4-3856-44b9-ba51-ee18635abb15', '286b0494-178f-49a4-ac3c-19fe27574034', '8325', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('892ae8e6-f6e0-43a3-9a53-f9a2637fd38f', '286b0494-178f-49a4-ac3c-19fe27574034', '8312', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('88288921-8da4-4d3f-b7df-51b06b6afa79', '286b0494-178f-49a4-ac3c-19fe27574034', '8291', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ba2dd8bb-e49f-45f7-8545-1745d08709ac', '286b0494-178f-49a4-ac3c-19fe27574034', '3047', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9043e387-9ccc-4c89-b48a-c1ea7a5586d1', '286b0494-178f-49a4-ac3c-19fe27574034', '4232', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('21297588-001a-41c7-8803-9e770be00e1e', '286b0494-178f-49a4-ac3c-19fe27574034', '3046', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('00f393de-d02c-4489-bfae-7b2a2710ad4f', '286b0494-178f-49a4-ac3c-19fe27574034', '3080', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9036c055-24a7-475b-a586-2286e0ca4afc', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '9783', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1c87d329-4774-481c-a918-891597997047', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '0014', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c1b5ba6f-4b72-4afe-9d0d-f4509c7c6906', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '8094', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f4fdd8f1-3d4c-4980-80fe-186195ee8805', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '9785', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2e7e36aa-8ac4-4560-aa88-cba50bb3885d', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '0214', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('75ae8755-394c-4b92-a552-16303ac7149c', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '9786', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a0f81c44-72b8-4723-bb15-68c5c43eacc9', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '0161', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4411f5c0-c019-417f-a128-086e0a21288f', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '0326', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('78bda690-2c25-4155-bed8-8aa8d2441cf7', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '0222', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6d53808a-33ac-423d-b491-2611d143f861', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '9800', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e3af3765-ec9e-447d-a3aa-2eae2a54350a', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '0140', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('85826ebe-d05b-4e8b-8d0e-4d3b7e5fec67', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '8097', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6c0df599-b13e-4eb6-a47e-e19a299f82f2', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '0421', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('360f3291-a35b-41a7-a694-84a6c115efea', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '9806', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e4d5cd41-d1b4-4f64-89a3-792d8d778982', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '0181', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('fdad3096-2b4a-43e5-9f68-d1f3e32db3b7', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '0315', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('260584ba-0061-40ef-a113-92c4f2d9c1a8', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '0289', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('fc13d14e-bc13-4320-a408-c0ff136a44e2', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '9633', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('43ab3aa3-293c-40e6-9cf9-a3486927bfc5', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '9510', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('98c095ef-e619-433d-b171-b57eef7574c5', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '4351', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a8ca1a9b-0949-450c-9ff5-ade0351779b2', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '9813', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('34151e60-e713-4c0c-ad36-07879d67d857', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '9842', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1d1a0d53-1150-430a-b071-9d4bd69ccb62', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '0316', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('add31cde-8a98-40a1-acc7-ac8342bef686', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '0016', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('bc573492-ae81-4443-b461-3ba0e62de930', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '0286', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5ff5976d-52dd-409a-af5c-475667f21709', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '8109', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('67fc277a-851c-4557-bfac-9b8ef6811694', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '4981', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('53eb7366-5c9e-4b68-8a8a-4e73de3d0d6c', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '9958', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8662ea49-d3fd-45eb-95a6-f8de7aa39dfe', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '521', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e926c4aa-ed74-4d0a-a796-438786a1167b', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '8306', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('378530fb-c2df-492b-83d8-d6911c468fb3', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '3050', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('573630f6-601a-419e-b817-2f2e40a4ac6d', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '3107', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6ddea959-bc81-488b-812b-2b4624db6409', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '3008', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c8249c35-4072-4695-bd6b-d888a934bc1b', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '8123', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a44ecf8d-a665-4d89-8672-e925e0a55b5d', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '9955', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2d22dd4d-7e28-4a11-97b1-9edcf574795b', 'f90842f8-6b44-4ecc-9714-c70258e92fec', '0049', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c150bece-dfb7-461a-9c96-fb6c86767d93', 'f90842f8-6b44-4ecc-9714-c70258e92fec', '0278', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2d34439b-c709-41db-aa94-c4a5932553ac', 'f90842f8-6b44-4ecc-9714-c70258e92fec', '0365', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('72638c0c-caab-4a2f-a381-c266338b4ad8', 'f90842f8-6b44-4ecc-9714-c70258e92fec', '0116', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('afc78630-fef1-4fe7-a053-7a5fa928382e', 'f90842f8-6b44-4ecc-9714-c70258e92fec', '9508', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('383f2b7d-65a3-49a9-954c-a1de217f8b88', 'f90842f8-6b44-4ecc-9714-c70258e92fec', '0314', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4b36cddd-61ec-47f5-93ec-abb1871b86cd', 'f90842f8-6b44-4ecc-9714-c70258e92fec', '3048', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f85dfaf3-8f68-4040-8ab0-2b02af6f6793', 'dcfccb22-1dee-484d-915f-e95b107f218e', '0330', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('22a80c62-6d05-42a3-b729-ee09b3975101', 'dcfccb22-1dee-484d-915f-e95b107f218e', '0150', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('400e3ee5-3494-41c4-b158-2fa0aca1b536', 'dcfccb22-1dee-484d-915f-e95b107f218e', '0081', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0fe6c411-901a-420d-90e5-6f66cf90c44e', 'dcfccb22-1dee-484d-915f-e95b107f218e', '0008', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9f972eb9-eb7c-4f4d-b780-18688a266b4d', 'dcfccb22-1dee-484d-915f-e95b107f218e', '0245', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ae9e7497-55d1-4d17-b5dc-f3f0869bf9b3', 'dcfccb22-1dee-484d-915f-e95b107f218e', '9824', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ffc36df8-ade8-49ed-95d9-5ba2b6e6d483', 'dcfccb22-1dee-484d-915f-e95b107f218e', '6998', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a9a9a925-02e6-48e0-bee1-17d9771db538', 'dcfccb22-1dee-484d-915f-e95b107f218e', '0122', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('033da31f-642b-490c-9b0f-7e6f263873ed', 'dcfccb22-1dee-484d-915f-e95b107f218e', '0200', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('04c601e8-7cc9-4b9e-a881-f1e3caf9d960', 'dcfccb22-1dee-484d-915f-e95b107f218e', '5025', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('955d274f-1854-4585-8c8f-7f7a264b0350', 'dcfccb22-1dee-484d-915f-e95b107f218e', '0555', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('781f11e1-721d-456d-b8c5-1339860bfdf8', 'dcfccb22-1dee-484d-915f-e95b107f218e', '3076', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a87cea2c-4eab-4a9b-8d85-5f74a8f58567', 'dcfccb22-1dee-484d-915f-e95b107f218e', '3131', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f475a098-c6e2-4323-8981-695e57948713', 'adab98b4-983e-4a75-9be3-fcd76bb4384c', '0166', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('474df4bc-d836-4c3d-8971-ba07f4305a6e', 'adab98b4-983e-4a75-9be3-fcd76bb4384c', '0258', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d928649c-8aba-40bf-ba90-cd616eba3dce', 'adab98b4-983e-4a75-9be3-fcd76bb4384c', '0124', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('959ce12a-b80a-4dae-86ec-e1a1f4ce346e', 'adab98b4-983e-4a75-9be3-fcd76bb4384c', '0335', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e6ee5b38-f56f-4671-b94e-c7308c5dc770', 'adab98b4-983e-4a75-9be3-fcd76bb4384c', '0336', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('aa0d9fc2-a4bf-47b4-b4f2-e703379ddfab', 'adab98b4-983e-4a75-9be3-fcd76bb4384c', '0351', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e476145f-120e-4ca7-bd45-3ba83640e9ad', 'adab98b4-983e-4a75-9be3-fcd76bb4384c', '0041', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('aab10565-8fc8-4c5e-bf33-5c9a0af62808', 'adab98b4-983e-4a75-9be3-fcd76bb4384c', '0151', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('689ecc62-cf9e-4808-bf96-3dcfc6104ea3', 'adab98b4-983e-4a75-9be3-fcd76bb4384c', '0290', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('fc345c7e-41a5-43ed-bbc6-4f3ebb9d5e6d', 'adab98b4-983e-4a75-9be3-fcd76bb4384c', '0072', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c6481db2-6f26-42ae-9970-32ca324ac26f', 'adab98b4-983e-4a75-9be3-fcd76bb4384c', '0158', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('835b188e-5e12-4570-8334-fddbe2309e23', 'adab98b4-983e-4a75-9be3-fcd76bb4384c', '0261', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9e756a27-8fcb-4f34-acb7-05f18e90b965', 'adab98b4-983e-4a75-9be3-fcd76bb4384c', '3098', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('55b915bd-deb8-4152-a667-aa5982d050a0', 'adab98b4-983e-4a75-9be3-fcd76bb4384c', '3116', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('53ea0721-9040-4915-910f-f996d02d444c', 'adab98b4-983e-4a75-9be3-fcd76bb4384c', '9841', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c953c6a0-cf88-42e5-a412-e57d5b0639df', 'adab98b4-983e-4a75-9be3-fcd76bb4384c', '3089', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('faa62849-8e39-4d69-a440-b8f61ca22133', '8cd45108-1bde-4f5b-a0f2-faed446dc6a2', '9509', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b33922ee-8b6b-4aa1-a097-140481e97cc5', '8cd45108-1bde-4f5b-a0f2-faed446dc6a2', '0015', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2d2125ac-30a8-4e88-ab09-122300c6c899', '8cd45108-1bde-4f5b-a0f2-faed446dc6a2', '0023', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6551f898-713b-4f50-9b64-426e18a546e2', '8cd45108-1bde-4f5b-a0f2-faed446dc6a2', '9508', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b51cfd67-7827-47ea-842d-7f04909de067', '38b66691-f4eb-4fdb-a597-45539bf2c1c4', '0007', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4e51234e-fd6a-4edb-9636-b4776675957e', '38b66691-f4eb-4fdb-a597-45539bf2c1c4', '0090', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1678c747-8030-42e6-842d-923e6b7dafdd', '2776df25-b776-46ff-9939-0f0bc170725b', '0152', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('29bd0853-8624-4972-a3ed-bf612b1529bb', '2776df25-b776-46ff-9939-0f0bc170725b', '9565', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0222f89e-a4e5-4d8a-890f-c7cc07ffbfd2', '2776df25-b776-46ff-9939-0f0bc170725b', '0381', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4f081e7e-f10c-4065-9d61-8b9cd36bd8d4', '2776df25-b776-46ff-9939-0f0bc170725b', '0402', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('bd3de448-38df-484e-a9a6-8de8d180ed38', '2776df25-b776-46ff-9939-0f0bc170725b', '0007', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('21d38c3a-c1ca-4909-9d60-6ca58102ebfd', '2776df25-b776-46ff-9939-0f0bc170725b', '0363', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f4d13421-5b8a-4d4c-b03c-1bcca3e8b05f', '2776df25-b776-46ff-9939-0f0bc170725b', '0179', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('30b4825b-b1f3-4bd7-866a-cf53c12a0af3', '2776df25-b776-46ff-9939-0f0bc170725b', '9556', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b770c1c5-be27-4288-acd8-699f5fe7db0b', '2776df25-b776-46ff-9939-0f0bc170725b', '0561', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('db25604a-81af-4ee3-abda-0f461502be77', '2776df25-b776-46ff-9939-0f0bc170725b', '0552', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('809e5cce-658a-4ab3-a8c7-71872aaa7f46', '2776df25-b776-46ff-9939-0f0bc170725b', '0557', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('cc899e64-e1df-4f10-a14e-364bf2b2fc84', '2776df25-b776-46ff-9939-0f0bc170725b', '0546', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('60e1329b-261c-4452-a5ee-0121e58f353a', '2776df25-b776-46ff-9939-0f0bc170725b', '0553', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5a67c1ff-d078-434a-9cfa-3c83764b3dc7', '2776df25-b776-46ff-9939-0f0bc170725b', '0558', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7931e12c-f212-4238-a50c-e3003089869d', '408fe8ab-d69c-4870-98f7-b5beb78fe003', '0414', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5b7ec164-14fb-4ca2-9bbf-23293508ac57', '408fe8ab-d69c-4870-98f7-b5beb78fe003', '0242', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8f81093c-3125-41c3-adaf-78639b0474fc', '408fe8ab-d69c-4870-98f7-b5beb78fe003', '9451', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d330a3c0-67d5-4d43-bb37-d3157c8a48ec', '408fe8ab-d69c-4870-98f7-b5beb78fe003', '9768', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('622718f6-7b8d-4f9d-bf80-fbe3e3e8f1a1', '408fe8ab-d69c-4870-98f7-b5beb78fe003', '0141', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('04e88405-2d17-4895-bcbf-b81770638e1e', '408fe8ab-d69c-4870-98f7-b5beb78fe003', '0331', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('aa4a6135-6ad6-4bd6-85ef-4bb4ff9ea2bd', '408fe8ab-d69c-4870-98f7-b5beb78fe003', '6328', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('bb052480-1942-4789-9dd8-7ad1adc12a69', '408fe8ab-d69c-4870-98f7-b5beb78fe003', '9764', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6de4a849-a858-43c5-a0f1-e8ab8f529e5a', '408fe8ab-d69c-4870-98f7-b5beb78fe003', '0616', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1739aa92-8b5c-405e-ad30-d577aee96cb6', '408fe8ab-d69c-4870-98f7-b5beb78fe003', '0545', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('25da7caa-2782-46c1-901b-9b3166724aa7', '408fe8ab-d69c-4870-98f7-b5beb78fe003', '0554', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('914348aa-dd1d-483d-b6de-94a5e5071120', '408fe8ab-d69c-4870-98f7-b5beb78fe003', '556', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('742968a3-246e-407b-a455-6b30dc3a66c5', '408fe8ab-d69c-4870-98f7-b5beb78fe003', '3069', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('40e821f4-85b4-41cf-aaf6-2e9654e44127', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '6301', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('baacd887-2bfc-459b-adfa-de268af3ed01', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '0372', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e5f1abf8-ea17-490e-ab9f-2098d3c56421', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '0228', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('dd05b56d-761e-475e-8596-137511b7042f', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '0252', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('20602ad7-f9ac-4b06-a4cb-f6acdf3018c4', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '0469', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3f335f2b-a3da-4002-ae7f-c845424e8328', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '0203', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('aa0d3672-6f0e-4b98-a7be-c8c2f07317b4', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '0388', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7b4f7204-8c59-4f63-97b9-b611902935ec', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '0392', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('869773a9-7a6e-4c25-bfb5-cb760ef3ddf2', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '9825', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0618112c-4688-4477-8981-ae96955e0ebf', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '6197', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('81ea885a-7211-44c3-b9f3-22f3b5d8846f', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '6268', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('575f066f-e2cd-4c34-9fe5-12ce23c03d73', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '9761', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6d7321a4-5b32-4223-b613-06ae29a2b017', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '9765', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5fc033e2-4ded-4136-8e66-3e1eef157d61', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '0294', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d7d33415-50b2-4a91-8f53-2874f5aee3bf', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '0221', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('50719d9c-7b09-4483-b991-d9e6675f6d14', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '0173', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3c18e779-d00c-4984-ac10-1be6ee97cd7d', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '0040', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f5ef02c3-39c2-4446-8c51-c8a407ea5226', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '0373', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a5c0bd6a-49ee-4ba3-96dc-caf9c569cdff', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '0145', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('61a51844-bcd5-40ea-a603-ae7533f179be', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '0379', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('66cc9db0-64d9-4cf2-b830-7db893a3aa4b', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '0303', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('94a4264b-c8fa-4cc8-847b-9235f184a100', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '9763', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5c25ebc9-6c24-42f1-828d-084b82db310d', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '9544', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('de82aa12-7ed2-4753-9cfc-7cc404c36a08', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '0375', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1bf84ca2-2e41-4090-b98f-5d41bb4591b6', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '9460', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f8e30380-37e7-4ecc-b86b-0433b2edf037', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '0376', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2f7ae9af-b81e-4f7a-b34d-d0945d1dd7d1', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '9762', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e5f364cb-f2c4-45e7-8a4a-a393c17fca66', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '3028', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('105318e0-b089-47de-bbbb-6ab9fbcbf9cd', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '3002', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a370b037-2c74-4a57-9f24-ad203da02b87', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '0475', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9302e5f6-9afb-4da9-8505-7ed8fe774eba', '363b5ab2-63b1-4910-898b-de18ecf40f38', '0246', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c004d63a-751c-4ffd-b997-4846412f3a17', '363b5ab2-63b1-4910-898b-de18ecf40f38', '0178', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ab2f8709-38b8-483f-9ac6-8c2d118fd3cd', '363b5ab2-63b1-4910-898b-de18ecf40f38', '0159', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('642810e1-d5c2-446f-9ac2-04f21f8678ec', '363b5ab2-63b1-4910-898b-de18ecf40f38', '0266', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('bb684782-f56a-45c3-8840-527fae4e8428', '363b5ab2-63b1-4910-898b-de18ecf40f38', '0410', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ab0717c6-245b-4cdf-99e9-764654775bda', '363b5ab2-63b1-4910-898b-de18ecf40f38', '1081', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0232c968-fedf-43bb-bf28-b62b065e5e47', '363b5ab2-63b1-4910-898b-de18ecf40f38', '1083', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('736e1740-ab29-4a12-8ae9-469193824fa4', '363b5ab2-63b1-4910-898b-de18ecf40f38', '1077', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('dc8068a5-82ee-4412-bee1-9d988690f203', '363b5ab2-63b1-4910-898b-de18ecf40f38', '525', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('bdc80169-b887-47cc-ba69-7ae0f911f59f', '363b5ab2-63b1-4910-898b-de18ecf40f38', '523', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5f42fb7d-db9f-41f3-b88d-3f6549cde784', '363b5ab2-63b1-4910-898b-de18ecf40f38', '593', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0feeb5bb-8855-4c86-875d-3de79993a0fa', '363b5ab2-63b1-4910-898b-de18ecf40f38', '9522', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('42c9ffe8-c446-43af-b541-b98d50888f9d', '363b5ab2-63b1-4910-898b-de18ecf40f38', '1080', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4a27b58b-d320-4fe4-bf81-d254dca1b6e3', '363b5ab2-63b1-4910-898b-de18ecf40f38', '9123', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b5d33c24-d818-417a-b57a-1c8aadb70165', '363b5ab2-63b1-4910-898b-de18ecf40f38', '1079', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8b2426f0-efe8-4dba-a887-87da97cd51a6', '363b5ab2-63b1-4910-898b-de18ecf40f38', '568', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b417cf2b-4411-4dde-aa6a-00eb0753b86c', '363b5ab2-63b1-4910-898b-de18ecf40f38', '3058', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b1e19d4a-bf37-4dfc-923b-f374dbf67bdd', '363b5ab2-63b1-4910-898b-de18ecf40f38', '3102', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('30efd54f-3a93-4b28-b518-3fa2a0c4bbec', '24ade15c-9bda-4b88-af57-581d3abb7da8', '0530', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8db60900-15e9-42aa-a971-e06f94adf52f', '24ade15c-9bda-4b88-af57-581d3abb7da8', '0400', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f25c925f-9f31-4c29-acd1-8cff809c04c3', '24ade15c-9bda-4b88-af57-581d3abb7da8', '0329', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('68bd46c9-83cb-4a2f-b04c-ae1edb8ef06a', '24ade15c-9bda-4b88-af57-581d3abb7da8', '5038', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c6049fc0-0647-4876-b818-9a4a8fc42ec9', '24ade15c-9bda-4b88-af57-581d3abb7da8', '9584', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b5f3aa91-d973-49c0-bc64-c07d609be1b6', '24ade15c-9bda-4b88-af57-581d3abb7da8', '9851', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('792addb4-fc90-4485-a499-767a62b96626', '24ade15c-9bda-4b88-af57-581d3abb7da8', '9571', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2bfa108b-d6d5-49bb-8e19-7f34179f0ccf', '24ade15c-9bda-4b88-af57-581d3abb7da8', '0532', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9c81234a-e881-46ad-88f5-fd8c271f3145', '24ade15c-9bda-4b88-af57-581d3abb7da8', '9847', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('17684ad2-5988-45cf-8da1-45de120df622', '24ade15c-9bda-4b88-af57-581d3abb7da8', '0192', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1f9f8427-ffcb-4f39-887d-20c990355952', '24ade15c-9bda-4b88-af57-581d3abb7da8', '9848', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('18b4232d-f5dd-4a77-a454-7fe1b8b15ada', '24ade15c-9bda-4b88-af57-581d3abb7da8', '8509', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9c4481cd-d8d5-48fb-8c83-41af9e65a930', '24ade15c-9bda-4b88-af57-581d3abb7da8', '9849', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('eb17912f-8c9b-4c9a-a312-3f05eae008c2', '24ade15c-9bda-4b88-af57-581d3abb7da8', '0263', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('31e219c3-1eee-468a-89fa-a25c289ffbc5', '24ade15c-9bda-4b88-af57-581d3abb7da8', '0074', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ad971fa7-29e5-4aec-aec6-8a5800f18ced', '24ade15c-9bda-4b88-af57-581d3abb7da8', '9822', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8748303c-852e-4746-8cbe-f162b16a1560', '24ade15c-9bda-4b88-af57-581d3abb7da8', '0084', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f753694c-a44e-47aa-b7f7-1fd5cf8c6912', '24ade15c-9bda-4b88-af57-581d3abb7da8', '0533', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6f33e2c6-52e3-4b43-a947-e129c41137ed', '24ade15c-9bda-4b88-af57-581d3abb7da8', '9604', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d65b4ace-dcd5-4a28-bb9a-7db12ee94ef3', '24ade15c-9bda-4b88-af57-581d3abb7da8', '5032', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('da5ba0d1-ecd5-40bf-8985-b8f6dc66907a', '24ade15c-9bda-4b88-af57-581d3abb7da8', '9846', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('626a3268-1ea7-4120-b3fb-8f6c74570409', '24ade15c-9bda-4b88-af57-581d3abb7da8', '4448', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e2b281e6-8de0-4b3b-9ed3-4a3081ae5913', '24ade15c-9bda-4b88-af57-581d3abb7da8', '0477', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ecbb7702-9c75-4507-86d1-784b84a60fdc', '24ade15c-9bda-4b88-af57-581d3abb7da8', '3073', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2bdeb19d-9f1c-4cd4-9ea1-e2b204dff97b', 'f5478fa2-d85b-41c6-8b8e-3f85d14dd257', '0427', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4f23293e-8984-4424-ab78-fbb14bccf5f1', 'f5478fa2-d85b-41c6-8b8e-3f85d14dd257', '0428', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('622a39b5-348c-4c0a-b12a-731e766c2c57', 'f5478fa2-d85b-41c6-8b8e-3f85d14dd257', '0431', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('624e7ecf-de74-46f9-8c19-92018a2fa0ae', 'f5478fa2-d85b-41c6-8b8e-3f85d14dd257', '0432', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e22f22b6-9f8c-4102-90be-3122ba2271c1', 'f5478fa2-d85b-41c6-8b8e-3f85d14dd257', '0356', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('be6be0bc-0362-488c-8354-2080550c6657', 'f5478fa2-d85b-41c6-8b8e-3f85d14dd257', '8642', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('357e7f94-c7d1-4398-981b-6ad2f5e13837', 'f5478fa2-d85b-41c6-8b8e-3f85d14dd257', '0238', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('92787803-2c7f-4af2-ac3f-e168968a9097', 'f5478fa2-d85b-41c6-8b8e-3f85d14dd257', '0433', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('253aa105-90fe-47c5-ab05-432fa18f9a9c', 'f5478fa2-d85b-41c6-8b8e-3f85d14dd257', '0470', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4ab47b3e-fba0-4377-b8c5-9848b094b0e6', 'f5478fa2-d85b-41c6-8b8e-3f85d14dd257', '0279', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('be0e2a25-0af9-4ed6-9491-229be55e5aa4', 'f5478fa2-d85b-41c6-8b8e-3f85d14dd257', '0347', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c271aa6e-af63-4cb2-a5ad-0f60e9d1cb8f', 'f5478fa2-d85b-41c6-8b8e-3f85d14dd257', '0257', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('efe5af85-d77c-41ab-bd4b-fd595d0106cb', 'f5478fa2-d85b-41c6-8b8e-3f85d14dd257', '0434', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6c530418-f95c-47dd-8a92-3022d41c79ad', 'f5478fa2-d85b-41c6-8b8e-3f85d14dd257', '0438', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a55e3ebf-7b92-444d-878b-9574a74daf0b', 'f5478fa2-d85b-41c6-8b8e-3f85d14dd257', '0429', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b999602a-3716-4a56-a3b5-b8a9d0b1491b', 'f5478fa2-d85b-41c6-8b8e-3f85d14dd257', '0430', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('26853255-15e5-40da-ba50-97ef560e2c4e', 'f5478fa2-d85b-41c6-8b8e-3f85d14dd257', '8645', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('cc97ce41-f1e8-41ba-8273-c53978092e91', 'f5478fa2-d85b-41c6-8b8e-3f85d14dd257', '9957', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a172dc97-8ce3-4326-8225-34fab68f48b8', 'f5478fa2-d85b-41c6-8b8e-3f85d14dd257', '3057', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8b928888-3e74-4dfa-8fd9-9cba4602fd0a', 'f5478fa2-d85b-41c6-8b8e-3f85d14dd257', '3068', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e0aebe59-1a86-435b-aec7-926318885028', 'f5478fa2-d85b-41c6-8b8e-3f85d14dd257', '3059', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6a3aa67d-37c5-44d7-940b-d34b420ad097', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '0531', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('fee58b12-0e36-4d0d-b3a7-3d15775c105f', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '0400', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('36c40a56-eb75-4f03-8e3f-548c16066571', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '8555', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4bc148ad-2309-4577-9926-db4ecf4e5a61', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '0013', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0f3c6f9e-4f3e-4e60-83da-15d4222a5c68', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '9781', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9d1dcec1-2b19-491d-b560-aadb36529520', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '0047', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('13f7a507-a47e-4e63-81c7-32c30570de57', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '9778', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7842e90b-750f-4154-818c-ff158c92e899', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '0380', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('67c5b435-e142-4f56-b060-1bb8f6bf1096', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '0535', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b81bdc4d-b8da-4d17-b336-697d708801bd', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '0536', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('94a226c4-d544-4682-ac02-abfb7b46964c', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '0534', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0449c2e9-e8f1-4327-954d-23701141f5ef', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '0537', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('507c5c58-2eeb-4679-9412-1408a2cd39d5', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '0288', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1b450015-8fda-4ea5-ba9d-7895d7b931e6', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '9777', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('20a0c95e-1d14-4f6c-bdf9-f42c9236f6ed', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '0160', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2818a209-557d-46a3-856b-37c67d805415', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '0019', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('26ace85e-9eaf-4ac2-a107-bf2b8ca343ab', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '9866', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7684fb38-85be-4064-a3e4-79433932f09a', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '0320', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c7cc001e-0b63-4ab8-8a98-8bf1480f676c', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '5020', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('98ab9104-37a0-4061-97cd-e2fd035de725', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '5033', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a708da3f-22ef-4fae-9edc-4e595325e726', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '5036', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2fbf3076-de82-40ba-9883-d66b71606742', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '0543', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6f03443c-8071-4797-9c4a-461883db753a', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '0541', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('eaf0283a-4e71-4058-8d64-b62e2cb57be8', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '0544', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9e9cbe8f-5879-40f3-9400-3bbc969a890a', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '0539', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('382a18a1-bbc9-4b0c-a57a-fa8e6498bb72', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '0542', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9f0f0fa2-90b1-4fea-8fbf-e2b79858ef51', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '0538', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('200f3e0c-1206-4247-9978-ca438d04c72c', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '0540', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('407c13d4-4305-4a92-9e2e-922cef627892', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '3081', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e7dacd80-aa96-4ba0-91b6-069f4fa233a0', 'd4d6f840-772f-4324-826c-cd0c23455028', '0482', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('56289928-eb8e-4a21-95bf-232f6847fde8', 'd4d6f840-772f-4324-826c-cd0c23455028', '0483', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e92a6f3b-fc76-4b3c-afbb-7b759c0c9eb4', 'd4d6f840-772f-4324-826c-cd0c23455028', '0484', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('80d4036e-a616-47cd-a127-ca54dc9a3ead', 'd4d6f840-772f-4324-826c-cd0c23455028', '0485', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c0be26ef-0a98-47bd-86e8-6407e15767e2', 'd4d6f840-772f-4324-826c-cd0c23455028', '8350', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a7845df2-f2d3-4cca-95a6-f6003356bfbb', 'd4d6f840-772f-4324-826c-cd0c23455028', '4382', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ebdaa21f-04c4-417d-9feb-53ae65ad807d', 'd4d6f840-772f-4324-826c-cd0c23455028', '0067', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('cb32dca9-b3f5-4118-bd69-cca6d2d8a73e', 'd4d6f840-772f-4324-826c-cd0c23455028', '0070', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('aa59414c-e839-4e2e-998c-90c8a06bcde3', 'd4d6f840-772f-4324-826c-cd0c23455028', '8966', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('942c2e4c-6a59-40eb-93cd-852e0a0ec12c', 'd4d6f840-772f-4324-826c-cd0c23455028', '0405', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('eac2cf5f-2910-4163-bd16-9ed7ede02c34', 'd4d6f840-772f-4324-826c-cd0c23455028', '0488', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('66e6c1a3-b551-455a-8019-d797ec0fa4cc', 'd4d6f840-772f-4324-826c-cd0c23455028', '0489', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('dac89f23-b504-4282-9cec-8f1daa82fdf7', 'd4d6f840-772f-4324-826c-cd0c23455028', '9601', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9e8aa806-f70a-4a7e-acc3-34f015023baa', 'd4d6f840-772f-4324-826c-cd0c23455028', '0407', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f1040030-5aeb-430b-ac13-6f160be020bd', 'd4d6f840-772f-4324-826c-cd0c23455028', '8379', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f4733919-6b52-4fa5-8921-f4a6b747d728', 'd4d6f840-772f-4324-826c-cd0c23455028', '0481', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e727a427-494f-46df-8cb9-a1cda87cf8e2', 'd4d6f840-772f-4324-826c-cd0c23455028', '5040', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9297df4a-8d80-4045-824c-a06873962082', 'd4d6f840-772f-4324-826c-cd0c23455028', '8345', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0f4b44e6-bf0c-487a-adff-02304049856c', 'd4d6f840-772f-4324-826c-cd0c23455028', '0492', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7e326823-f5b7-4bc1-b545-6b08e1d476f8', 'd4d6f840-772f-4324-826c-cd0c23455028', '1094', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8c02a714-efc3-4a76-9051-a70b866ea7b2', 'd4d6f840-772f-4324-826c-cd0c23455028', '1003', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5b37db25-3f6e-4051-9463-f57d336fdee6', 'd4d6f840-772f-4324-826c-cd0c23455028', '1125', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('59e285ed-6adb-4532-ad58-ad75f05c243d', 'd4d6f840-772f-4324-826c-cd0c23455028', '1007', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d3ba7a1c-5aca-465a-bf4c-f36970984d98', 'd4d6f840-772f-4324-826c-cd0c23455028', '1092', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8f7b8884-3aaf-4179-a6ca-e144833d844a', 'd4d6f840-772f-4324-826c-cd0c23455028', '1091', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('335757e2-9aba-4a89-b4f7-0f6a0379ae77', 'd4d6f840-772f-4324-826c-cd0c23455028', '9457', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2fb2ed9c-5f87-48c0-a0c6-af447c423835', 'd4d6f840-772f-4324-826c-cd0c23455028', '1118', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('aa425fe9-aa7f-4bd0-a24e-2f65d7ca4d58', 'd4d6f840-772f-4324-826c-cd0c23455028', '1014', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('40a76d93-22b9-4e73-b343-14388c4f8a66', 'd4d6f840-772f-4324-826c-cd0c23455028', '1017', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0026b1d2-a644-4fdd-bf78-4eb5af217439', 'd4d6f840-772f-4324-826c-cd0c23455028', '1001', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('70874086-3415-4a15-96a2-fee49809c78e', 'd4d6f840-772f-4324-826c-cd0c23455028', '1012', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('cb5e91a7-754a-45c6-8610-525973dd20e9', 'd4d6f840-772f-4324-826c-cd0c23455028', '1105', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b8d18786-3311-437d-80fb-59bc723f6b51', 'd4d6f840-772f-4324-826c-cd0c23455028', '1123', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f2f9930c-be12-4ff5-97c1-2401d47a6c3b', 'd4d6f840-772f-4324-826c-cd0c23455028', '1006', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7082ea90-1a18-453e-80bc-6942d7bf9d21', 'd4d6f840-772f-4324-826c-cd0c23455028', '1009', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3b9cf3d7-344a-40b1-8bf5-7fb630fd9cec', 'd4d6f840-772f-4324-826c-cd0c23455028', '1116', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('139228f5-c07f-4342-9608-ab2e216756a2', 'd4d6f840-772f-4324-826c-cd0c23455028', '1010', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e01d7493-59f6-4966-b248-fc0d51f644fa', 'd4d6f840-772f-4324-826c-cd0c23455028', '1018', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3f83564d-497e-4f4b-ae92-d40064dba55f', 'd4d6f840-772f-4324-826c-cd0c23455028', '1015', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2ee8eb83-4c2c-47a3-a824-b6d281d6c2ad', 'd4d6f840-772f-4324-826c-cd0c23455028', '1110', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b39378c3-1a6a-4913-8bab-f04b2807d7ed', 'd4d6f840-772f-4324-826c-cd0c23455028', '1111', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f058ea98-3bd7-4289-b62e-96011b124d17', 'd4d6f840-772f-4324-826c-cd0c23455028', '1113', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7a710d7a-6a8b-4483-90ce-a408313185ef', 'd4d6f840-772f-4324-826c-cd0c23455028', '3025', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f4a36b97-33a8-4662-a08d-4fc68a8d9fc6', 'd4d6f840-772f-4324-826c-cd0c23455028', '3114', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0452ba9f-5ad9-4f3b-8a81-26651c1a42f6', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '0299', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('685892ca-3645-4013-99c4-50ef276bcd98', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '0397', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('76e58737-ba20-4a96-b926-64acb1bec940', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '0401', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('68d2c310-5f6f-4f7e-98cb-1f5ffc3a7b2f', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '0403', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('148a39e4-e619-4f0f-a5c4-c6a688c7821f', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '0162', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('23eb51f7-d0e5-4a1f-973a-5118bb8cf76a', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1002', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4446cd1a-64c5-4827-a244-564699e0e863', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1122', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('504a9523-9e88-4083-8bd0-6ab4b867396a', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1095', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6c546584-8dce-4198-a93f-3de695b269e3', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1089', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3a5083e3-ccb6-40e6-896d-788fa1c670fd', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1011', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('df9b8009-30a3-4736-8c6a-67e60b53663e', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1096', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0548d6fb-07df-4361-aeef-4a2ec96df2bf', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1097', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('51f6f689-601d-4e05-9fc0-dbb7ce8e0e72', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1100', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('856f6524-313d-41b1-9681-c267f7741746', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1078', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b771adcc-90d5-418f-8762-c8e63c39725b', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1093', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5b0961d3-92ad-4cae-af67-b9c3449b612b', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1099', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b92b9707-a6b2-4503-9cf2-def8699384a4', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1114', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3d305abb-6c30-49e3-9814-b77d51c4bedf', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1101', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('915818fc-02ac-4ff4-808c-f6a772a1ec6a', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1022', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6f4e6df6-1032-41e3-b843-0581d38c01cb', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1102', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('befbbd84-44ef-42ff-b885-bc65a7453c2d', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1103', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a4db5321-fdbb-41ea-8e11-6dfe893578d7', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1004', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c8c1d903-c800-421e-a249-ef97cf96cb4e', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1090', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('edfe0684-5e53-4006-be76-932bd98bdddb', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1104', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0b5a2dd3-5449-40f7-a294-657acaddfaa2', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1106', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('36cb6b60-7de2-486a-add6-611f05e87d4c', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1109', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('221e3aa1-3d72-4b2a-82c1-6756d6f89157', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1112', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('fa40151d-4f81-4a9e-a2b6-2b5c6b81bc90', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1115', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ec53e866-7736-4155-84fb-487aee39e83f', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1119', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8275217e-607b-458d-bf91-ad8c22ec2da9', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1120', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0ed2a3d2-faee-4d36-ab47-27eeff5a377c', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1117', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d63ffb12-831d-41a2-8576-4b55fc4a1899', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '1121', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('bf71782d-dd72-4c8f-847b-1b1e23858d2a', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '3133', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4e9648f0-638d-4067-96f6-512cd8479b97', '07467b02-1664-4f85-9868-9ef7f8690bc3', '386', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f0c51608-e312-4f20-8b97-4fa5d3e6861a', '07467b02-1664-4f85-9868-9ef7f8690bc3', '8814', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7937f953-2727-4764-a248-d4af6234d5ff', '07467b02-1664-4f85-9868-9ef7f8690bc3', '0062', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3445fb09-1589-4a57-adc0-d296c27dc58b', '07467b02-1664-4f85-9868-9ef7f8690bc3', '0340', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e483824d-aa27-40d1-8b9f-c60df37047bd', '07467b02-1664-4f85-9868-9ef7f8690bc3', '0038', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('898c8eee-9770-450e-a86d-0b841fa00fbe', '07467b02-1664-4f85-9868-9ef7f8690bc3', '9782', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8c8acb27-cf74-4a55-87e5-d5d1481d778b', '07467b02-1664-4f85-9868-9ef7f8690bc3', '0486', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('bf050809-0229-4996-8649-0b1eddd3b27e', '07467b02-1664-4f85-9868-9ef7f8690bc3', '0358', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('829e82e8-4c0b-406f-a0ee-e7931954ba95', '07467b02-1664-4f85-9868-9ef7f8690bc3', '8741', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('81d1a611-681b-4db0-a865-0b59bb176714', '07467b02-1664-4f85-9868-9ef7f8690bc3', '9077', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('aa5c84ef-37d5-44ec-886e-c6175343d1c5', '07467b02-1664-4f85-9868-9ef7f8690bc3', '0490', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('75444fe0-c885-49bb-86d3-13ae6992396f', '07467b02-1664-4f85-9868-9ef7f8690bc3', '5039', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d98b283e-710b-40d3-b224-3b350b5d158b', '07467b02-1664-4f85-9868-9ef7f8690bc3', '5041', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3622a0fa-77e9-413b-8e00-0a0e51ccba3e', '07467b02-1664-4f85-9868-9ef7f8690bc3', '0491', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a3caa0c1-7a73-4128-bd74-e495bc2a9df8', '07467b02-1664-4f85-9868-9ef7f8690bc3', '0487', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9610a6f1-c396-4559-9560-ae71fabd8950', '07467b02-1664-4f85-9868-9ef7f8690bc3', '1088', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('348db67c-9900-4ce6-9489-2979ffb13b8c', '07467b02-1664-4f85-9868-9ef7f8690bc3', '0577', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1158ee45-8bc4-4343-8397-9f45abea413f', '07467b02-1664-4f85-9868-9ef7f8690bc3', '3932', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f579635a-2583-4418-bb42-ce02df5a8cbd', '07467b02-1664-4f85-9868-9ef7f8690bc3', '5030', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5fdc92fb-7eea-4ef6-b26c-8c54ba111fd9', '07467b02-1664-4f85-9868-9ef7f8690bc3', '0596', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1ea0b694-418c-402b-8309-b05a21e6cc7c', '07467b02-1664-4f85-9868-9ef7f8690bc3', '1098', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b8a37d4c-32fa-4da7-ae30-aacba8add981', '07467b02-1664-4f85-9868-9ef7f8690bc3', '3115', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f51331ac-9b6b-4e6e-aff3-48afd60f147c', '07467b02-1664-4f85-9868-9ef7f8690bc3', '3063', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('12ef43db-5e29-4814-b9b7-696d8c748db4', 'ff5ff18e-11ac-4058-ac78-c30902d9d8ca', '0361', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('62781128-3563-4edb-9c48-4bd9a9531615', 'ff5ff18e-11ac-4058-ac78-c30902d9d8ca', '6648', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a798c40c-c736-4a8a-8332-70df6f95a16f', 'ff5ff18e-11ac-4058-ac78-c30902d9d8ca', '9582', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5290aaca-3d4d-4f0c-8ae1-fd236d70163f', 'ff5ff18e-11ac-4058-ac78-c30902d9d8ca', '0085', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ef74851c-9f7f-4b33-81b5-731bc2e28f75', 'ff5ff18e-11ac-4058-ac78-c30902d9d8ca', '0551', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('32530a4a-872b-4cac-ba35-630056990343', 'ff5ff18e-11ac-4058-ac78-c30902d9d8ca', '0457', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c91548a7-3a49-4c43-9c75-03adb7458dfc', 'ff5ff18e-11ac-4058-ac78-c30902d9d8ca', '0276', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f74a6bce-87b6-4e1f-b031-8c7b734e0059', 'ff5ff18e-11ac-4058-ac78-c30902d9d8ca', '9693', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2503e812-d5ec-4880-8041-803d8e19d5bd', 'ff5ff18e-11ac-4058-ac78-c30902d9d8ca', '0447', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c3321fca-7e06-43d5-a71e-d886fe720090', 'ff5ff18e-11ac-4058-ac78-c30902d9d8ca', '0281', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('be5ee069-d227-4642-a757-cf7faabf8f4f', 'ff5ff18e-11ac-4058-ac78-c30902d9d8ca', '0089', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4eb02138-311f-4df9-bade-4a0ad4d090ff', 'ff5ff18e-11ac-4058-ac78-c30902d9d8ca', '0300', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('51593ff1-bbe1-4df8-be77-a2b6a7dbb29c', 'ff5ff18e-11ac-4058-ac78-c30902d9d8ca', '0212', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b58a31e7-f795-4738-9b98-cbac827fbcf0', 'ff5ff18e-11ac-4058-ac78-c30902d9d8ca', '0449', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('abaa0782-ad7c-4638-b534-3aae798b849c', 'ff5ff18e-11ac-4058-ac78-c30902d9d8ca', '0123', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('984486f4-a421-4583-849b-4c8e63c47825', 'ff5ff18e-11ac-4058-ac78-c30902d9d8ca', '0167', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b1e14bf1-c38b-4a84-a9f5-4147fc578fd4', 'ff5ff18e-11ac-4058-ac78-c30902d9d8ca', '0080', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('df4d9e63-ef97-40f4-9af4-1ee5d989186d', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '9755', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d95151a1-e1bc-4a8c-8acf-7b2d527a1c1a', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '6860', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('cd66e46c-a745-41d1-a6c5-b8605d30317c', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '9719', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0c45d411-affd-45c6-9b69-15da65420080', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '9720', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('010f2dc0-a015-401a-9baa-44c4d7aab61e', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '9691', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('91df981a-7750-41a3-8238-85ca2c75a6ff', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '9687', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ea8821b1-118c-48b1-9d95-040a096e7439', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '9726', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7254f57d-8360-4d5b-9f58-81d94312cb91', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '0071', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c5ba75db-04c5-49bd-a592-dd8af9df4422', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '0275', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('291baae6-6aa5-449e-a82b-d675afa08a13', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '9731', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('360902a4-aed0-4030-9e27-8bca4c64eeb0', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '0127', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9c66df5f-d486-4562-9590-845b9e795a4c', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '9710', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b3f44a0e-ab6c-4ee4-b546-6ea6a0682dc2', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '9383', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0118ce7b-8ae4-42cf-844f-ff36b367adb4', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '9695', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f51e90c3-90d4-4fc1-8127-bb3117eec2cf', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '9218', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('79bfe5aa-e6f3-4c0a-b7c1-0902f0eccc88', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '6892', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4b8366d5-0008-45db-a93c-42bc13a322e0', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '9696', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('afb4257d-14ee-4f1c-b022-8196966cedc5', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '9715', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('605d70ec-75b1-4ed2-b3e1-ff6f158afd1a', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '9596', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ef4c27d0-3380-4981-aa9e-b72b77b5f572', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '4433', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('03b36ae4-9bb5-446d-b19f-5187c5142643', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '3110', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9022d0fe-89d8-4b1c-a24b-ec9cc99353f8', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '3029', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('252f8d6d-41d7-4cab-be40-9381b1d93178', '26e3561d-61d3-40a9-8695-ad47846a82d6', '9712', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b8092a4c-2cf7-4c76-b3f8-4e976e646ca6', '26e3561d-61d3-40a9-8695-ad47846a82d6', '6900', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5426c861-41ee-4230-b765-cb6ea319c655', '26e3561d-61d3-40a9-8695-ad47846a82d6', '0334', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4f71bb56-b67f-4d34-85ab-40208a60378c', '26e3561d-61d3-40a9-8695-ad47846a82d6', '9688', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('35a15b1f-832e-4862-87c7-66fffdef8714', '26e3561d-61d3-40a9-8695-ad47846a82d6', '6987', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('90e78995-04c7-4030-811d-af4ae0d2d0d3', '26e3561d-61d3-40a9-8695-ad47846a82d6', '0063', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6298cb9c-ed28-4336-9cfc-fae9f719b96d', '26e3561d-61d3-40a9-8695-ad47846a82d6', '9723', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f31c0c74-9819-4d62-bd6b-a98c041295c4', '26e3561d-61d3-40a9-8695-ad47846a82d6', '0306', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6be898e4-ff47-470a-894f-71f54e5c8849', '26e3561d-61d3-40a9-8695-ad47846a82d6', '0069', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('89078b61-91b9-460c-800c-bf143ad66c66', '26e3561d-61d3-40a9-8695-ad47846a82d6', '6865', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('cc05957c-cb2e-475f-b5cb-8d553bf83402', '26e3561d-61d3-40a9-8695-ad47846a82d6', '0046', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('83c470a1-a80f-4c59-844b-2f5a3af9854c', '26e3561d-61d3-40a9-8695-ad47846a82d6', '9694', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0be67836-eaa1-4671-bce6-722590927d92', '26e3561d-61d3-40a9-8695-ad47846a82d6', '0075', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('48ca5e13-3591-4452-8a37-9db438369586', '26e3561d-61d3-40a9-8695-ad47846a82d6', '6878', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4286f60f-387e-4965-a437-83ae3c3d8d56', '26e3561d-61d3-40a9-8695-ad47846a82d6', '0353', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f5534700-fb98-495a-96fb-abfea61b4937', '26e3561d-61d3-40a9-8695-ad47846a82d6', '3092', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8430ac5a-20a2-4607-8862-50f55c1189e4', '26e3561d-61d3-40a9-8695-ad47846a82d6', '3088', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('709c8f58-c385-45ec-9089-acc79894b6d1', '26e3561d-61d3-40a9-8695-ad47846a82d6', '3003', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('57af22ba-f29f-438d-a6ed-be713c80924d', '26e3561d-61d3-40a9-8695-ad47846a82d6', '9458', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('dbe79e3f-fb81-43e6-9e62-962c14be53e5', '7c78fdc1-91d9-4d8d-bd53-b081375c9d94', '9689', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8b8ca7d4-0579-46b7-b368-77ae9962a2dc', '7c78fdc1-91d9-4d8d-bd53-b081375c9d94', '9567', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('bc155d10-3ace-4ff5-96db-2006094fc5df', '7c78fdc1-91d9-4d8d-bd53-b081375c9d94', '0623', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('878c0c12-d243-447a-85a8-4b9daef5e5e2', '7c78fdc1-91d9-4d8d-bd53-b081375c9d94', '9717', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d696c46c-4958-4dba-ab5c-9067c335746c', '7c78fdc1-91d9-4d8d-bd53-b081375c9d94', '9690', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('57017772-8a70-4ab0-99ac-0e56264e6a3e', '7c78fdc1-91d9-4d8d-bd53-b081375c9d94', '0624', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('bc05f36b-e385-4247-ad9a-bd87f9d3a78b', '7c78fdc1-91d9-4d8d-bd53-b081375c9d94', '9721', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0494cedc-e4ff-4b73-a8df-01bb23283713', '7c78fdc1-91d9-4d8d-bd53-b081375c9d94', '0626', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('bacf4030-5d47-4635-a000-ccf718685997', '7c78fdc1-91d9-4d8d-bd53-b081375c9d94', '0369', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('66ab28c4-a4f0-4497-9492-5a1f1fca76ca', '7c78fdc1-91d9-4d8d-bd53-b081375c9d94', '0082', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d2fd428b-e24c-4071-9ace-d20601a21b77', '7c78fdc1-91d9-4d8d-bd53-b081375c9d94', '0183', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ebf72719-0561-4d60-8446-b2276a91ffe3', '7c78fdc1-91d9-4d8d-bd53-b081375c9d94', '9727', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d0d5198f-b2f9-4c1e-ba12-a2934a9cc29a', '7c78fdc1-91d9-4d8d-bd53-b081375c9d94', '9734', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5108cd57-b061-49df-b9ca-8703746a7ee9', '7c78fdc1-91d9-4d8d-bd53-b081375c9d94', '0233', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9f2867b8-a4f8-46f0-a7f4-a5a6ba188de8', '7c78fdc1-91d9-4d8d-bd53-b081375c9d94', '9066', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('449dacd0-bdcd-4ad6-a803-5a76b4eb1204', '7c78fdc1-91d9-4d8d-bd53-b081375c9d94', '0408', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7e236b55-e314-462d-86b7-f7334c88f93f', '7c78fdc1-91d9-4d8d-bd53-b081375c9d94', '9738', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6f072cca-cc95-4153-a65d-696919aa5630', '7c78fdc1-91d9-4d8d-bd53-b081375c9d94', '9739', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('014bdbc6-3739-4d1f-ad65-4d31f2ec263f', '7c78fdc1-91d9-4d8d-bd53-b081375c9d94', '0627', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5d06906d-1b04-4004-a595-42eb91f2af46', '7c78fdc1-91d9-4d8d-bd53-b081375c9d94', '9736', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('111aa449-dcd0-4fcc-819d-70b339e9b1cb', '7c78fdc1-91d9-4d8d-bd53-b081375c9d94', '0500', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('31417700-c60b-4ca0-80d6-f741000a2d01', 'a7b4ef4f-e0e4-4b81-bd14-dac2e06d73a3', '0186', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c2a5e92d-91a1-4c8f-877c-18bf14d56a07', 'a7b4ef4f-e0e4-4b81-bd14-dac2e06d73a3', '0226', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('933682c3-4235-4e47-90c2-d148bf111fa6', 'a7b4ef4f-e0e4-4b81-bd14-dac2e06d73a3', '0029', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('20de16f8-36a3-4566-8466-049f23e6ed27', 'a7b4ef4f-e0e4-4b81-bd14-dac2e06d73a3', '0118', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c7c0e2b8-c051-4353-8253-11c88df5c3eb', 'a7b4ef4f-e0e4-4b81-bd14-dac2e06d73a3', '0635', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6e0f6b82-695a-4fae-af32-a928ae6fa10b', 'a7b4ef4f-e0e4-4b81-bd14-dac2e06d73a3', '0310', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('be4efb2d-6f8c-41d8-a2d0-106e5b365c56', 'a7b4ef4f-e0e4-4b81-bd14-dac2e06d73a3', '0030', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('14ba82ba-622e-4d7a-a575-ac6e83688fe0', 'a7b4ef4f-e0e4-4b81-bd14-dac2e06d73a3', '0039', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f6e7ae6f-c0ce-46ff-9157-513513c3e26f', 'a7b4ef4f-e0e4-4b81-bd14-dac2e06d73a3', '0231', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('69301c0d-9af2-418c-8794-9cda23f92c97', 'a7b4ef4f-e0e4-4b81-bd14-dac2e06d73a3', '0133', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4db84a3b-59fc-4718-807d-2160d697175d', 'a7b4ef4f-e0e4-4b81-bd14-dac2e06d73a3', '0043', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7842e8e8-38e8-4b18-8943-4892b5fef13f', 'a7b4ef4f-e0e4-4b81-bd14-dac2e06d73a3', '0193', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9405e81e-4d21-4022-aa9f-e088dba4cc96', 'a7b4ef4f-e0e4-4b81-bd14-dac2e06d73a3', '0301', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('00d70914-c40a-4e30-8ddf-809aa67b99c3', 'a7b4ef4f-e0e4-4b81-bd14-dac2e06d73a3', '0366', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('af1410dc-c4fe-4d6f-88db-0d0412cfc51f', 'a7b4ef4f-e0e4-4b81-bd14-dac2e06d73a3', '3117', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ccd2fb38-6624-475d-b05f-b6b557db40cd', 'a7b4ef4f-e0e4-4b81-bd14-dac2e06d73a3', '9743', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9beecc7a-f6cf-40f2-b6ed-3ae49d092d9b', 'a7b4ef4f-e0e4-4b81-bd14-dac2e06d73a3', '4455', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a5d3eae2-c2b1-4a88-9fba-4a021f1d7bf9', 'a7b4ef4f-e0e4-4b81-bd14-dac2e06d73a3', '4471', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8335a28a-a227-4096-9230-92b04a98d1cd', 'b4a18271-9722-4726-bc90-29520d91764b', '9502', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7b11c1fd-6419-404b-a768-5e91bb436479', 'b4a18271-9722-4726-bc90-29520d91764b', '9507', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5e936cd2-2566-491e-927e-e76f545f08be', 'b4a18271-9722-4726-bc90-29520d91764b', '9500', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1f3d0a89-24ee-45d8-bfa5-5540d195002a', 'b4a18271-9722-4726-bc90-29520d91764b', '9499', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5800d265-093f-400c-9d6a-361928ae1dac', 'b4a18271-9722-4726-bc90-29520d91764b', '9497', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0845b3ec-0ae1-4a6f-8c23-229a50f7c279', 'b4a18271-9722-4726-bc90-29520d91764b', '0269', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5d877dce-06d2-4d16-bf4d-f01fbf24aa5a', 'b4a18271-9722-4726-bc90-29520d91764b', '0196', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c841c6a1-2fc8-4b26-8b4b-e2d288d71ac6', 'b4a18271-9722-4726-bc90-29520d91764b', '9493', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8b99c56c-2806-4400-ba39-386a1e04c2b9', 'b4a18271-9722-4726-bc90-29520d91764b', '9494', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('dc9c306e-0e3b-4a16-bf32-224e5373022b', 'b4a18271-9722-4726-bc90-29520d91764b', '9504', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e91b473b-4b61-4133-8fd1-abf3616554c9', 'b4a18271-9722-4726-bc90-29520d91764b', '9503', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0f45d0d5-cebb-486e-b449-a516242a28f6', 'b4a18271-9722-4726-bc90-29520d91764b', '0050', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f2810f58-8fc0-4a8b-b84d-8e513eff2e0a', 'b4a18271-9722-4726-bc90-29520d91764b', '0182', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('962fd82b-264c-4f4a-b64e-83d009091d4f', 'b4a18271-9722-4726-bc90-29520d91764b', '0031', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('59036f24-9adb-43c1-9f10-71e4908ebfcb', 'b4a18271-9722-4726-bc90-29520d91764b', '9540', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('435081ee-a2ab-4f5c-a818-009592a3a281', 'b4a18271-9722-4726-bc90-29520d91764b', '9495', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('cfea52fa-10e6-4d69-98a0-859ee4b819b1', 'b4a18271-9722-4726-bc90-29520d91764b', '9501', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e716c975-c3af-4864-b04f-ffe3b9e51464', 'b4a18271-9722-4726-bc90-29520d91764b', '0296', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ef552f74-41c8-4ebc-acd4-405226b00b3b', 'b4a18271-9722-4726-bc90-29520d91764b', '9498', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ada587eb-0e65-4139-addb-2d817a129111', 'b4a18271-9722-4726-bc90-29520d91764b', '5042', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a02f5c57-e34d-4dd7-9ef5-5a48efd35eae', 'b4a18271-9722-4726-bc90-29520d91764b', '0517', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c93f3532-cef9-42e7-8a36-c8f3c3b1135b', 'b4a18271-9722-4726-bc90-29520d91764b', '3024', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f6db115f-e16a-41a4-b884-a9d8bd09c0b8', 'b4a18271-9722-4726-bc90-29520d91764b', '3001', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('59e97412-3703-4462-bdcd-00cc366aedb2', 'b4a18271-9722-4726-bc90-29520d91764b', '3105', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5acb76c9-221b-4c29-a8aa-9278986e4dcd', 'b4a18271-9722-4726-bc90-29520d91764b', '3090', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a77380ac-a9c1-40f6-acb3-38f83c19e98b', 'a63546fa-622c-4c1b-a0d2-a900d28a51a3', '0255', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d24e8fbc-3f09-478b-9c8e-a3f17c3f4924', 'a63546fa-622c-4c1b-a0d2-a900d28a51a3', '0321', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('76bd944c-5d90-4258-aa84-db56515025bd', 'a63546fa-622c-4c1b-a0d2-a900d28a51a3', '0562', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d0ab5723-2098-40ec-b6a0-da5b9bf01875', 'a63546fa-622c-4c1b-a0d2-a900d28a51a3', '0569', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6a15ec30-e8f0-44f2-8714-7c7bd949cc1b', 'a63546fa-622c-4c1b-a0d2-a900d28a51a3', '0559', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('99a75019-7ee6-4a21-85fe-3b4a5e302ee8', 'a63546fa-622c-4c1b-a0d2-a900d28a51a3', '0563', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('028b6056-3d9a-4c25-87ab-f2091d49c22b', 'a63546fa-622c-4c1b-a0d2-a900d28a51a3', '0564', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8c0b1fb8-b7e9-43ca-899b-e7308b3c044c', 'a63546fa-622c-4c1b-a0d2-a900d28a51a3', '0566', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4fe02e91-192e-4bd1-9e6c-f9d717e71ce1', 'a63546fa-622c-4c1b-a0d2-a900d28a51a3', '0567', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1c47acf5-abc2-4ac5-ab78-0596c5f393e9', 'a63546fa-622c-4c1b-a0d2-a900d28a51a3', '0570', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('57f77756-15e9-460a-a4d3-a8408524eb7b', 'a63546fa-622c-4c1b-a0d2-a900d28a51a3', '0571', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('998c1d28-9c92-4a19-8f65-71c7757204a6', 'a63546fa-622c-4c1b-a0d2-a900d28a51a3', '0572', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('36246c1d-bfce-4fde-a0fe-28a962c35e68', 'a63546fa-622c-4c1b-a0d2-a900d28a51a3', '0560', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('225591bd-8b56-45a5-9a37-9256ebea20ad', 'a63546fa-622c-4c1b-a0d2-a900d28a51a3', '3052', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c87869d8-4b5d-46ef-a415-2f47c07365ec', 'a63546fa-622c-4c1b-a0d2-a900d28a51a3', '3093', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b750e5e2-0d94-407e-a667-4ab41b921072', 'a63546fa-622c-4c1b-a0d2-a900d28a51a3', '3010', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('fe944bf9-3570-4bbd-837f-4ba063f6c4a6', 'a63546fa-622c-4c1b-a0d2-a900d28a51a3', '3009', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('14d801ac-6cd7-4fe3-b15a-5e497491953b', 'a63546fa-622c-4c1b-a0d2-a900d28a51a3', '3045', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f7ad468a-53df-4651-adaf-eed2bcca1e8a', 'ccaedadc-d798-40b7-bd18-a75c03ab25cf', '0371', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('76b33079-e699-46a0-8971-a92f079bd3ae', 'ccaedadc-d798-40b7-bd18-a75c03ab25cf', '0633', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b174824e-c235-4055-a435-70d107afdfe0', 'ccaedadc-d798-40b7-bd18-a75c03ab25cf', '0048', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d3c8fbb4-c83f-4395-9f1e-df5f5425be81', 'ccaedadc-d798-40b7-bd18-a75c03ab25cf', '0187', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8fc4f3cb-06c8-47fa-bec1-29a4670ac22a', 'ccaedadc-d798-40b7-bd18-a75c03ab25cf', '0292', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f8793871-ccc2-4829-bc10-4e8de8404576', 'ccaedadc-d798-40b7-bd18-a75c03ab25cf', '0632', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('77939f67-78c3-454b-b8db-d8115699c1e3', 'ccaedadc-d798-40b7-bd18-a75c03ab25cf', '0634', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ce00eb6b-6dfc-4f66-bbc1-1b4feb496be0', 'ccaedadc-d798-40b7-bd18-a75c03ab25cf', '9870', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d80c11bb-f2c6-4eba-a4c1-ae13be8dda5a', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '0250', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3a01bc73-0016-4236-b0be-37b61c4167d6', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '9469', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('dfb89d9c-b3eb-457b-b68f-e9ef431edf50', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '8774', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('bfa64c21-aeb0-433d-85ac-b3db57ae9780', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '0450', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('22fda6c2-aba5-4dd5-95ad-17194e22cb93', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '9747', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e1bbb1a3-b7a0-4c77-96d6-3a19cf9726f0', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '9466', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('673ddc95-95e0-4b53-833c-52a35cbdde90', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '0472', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9b6e2c8a-6665-4761-9464-3aeb1e3137bb', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '9465', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('05c75404-4b8a-4612-97bf-59f376d98802', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '9532', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5bcf27d8-5693-4a45-9a0e-52fd16df58e1', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '9464', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3ef32749-eade-403c-802e-5967adcf37d1', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '0377', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7d3a33e9-5f00-49aa-80a7-bdfe077355a9', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '0283', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('bdbf881e-7c03-4a35-80cc-5e7180ae2ce1', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '2115', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('47a62bf2-2037-4989-b4d5-56cf181d56c8', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '3013', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9eefbf8e-3b66-417e-9066-c2646c46b9b7', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '3012', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('587abe03-e5de-4653-ab06-e952aa35bb93', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '3126', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d5be32d3-0929-4421-aac1-d903bff2ebc4', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '9744', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('bd54f215-d3dd-4423-8258-384467b9cd17', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '3123', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b81e8c31-243b-4eda-a055-021bbdcc3a75', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '3125', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9c81ec98-5531-4568-ae59-6d3f3a497f84', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '3118', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('09c2fb63-29e0-4b35-9d79-78aa01a23bc7', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '3011', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8d25f526-e8c8-4ee1-8795-8902f616895c', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '3122', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e005b496-403b-4fda-8aa4-ec99e63cfdae', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '3124', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('66797033-2f15-486c-afa2-8bb5537c230a', 'c5e964a5-fce6-4bb5-9299-49bdbb580202', '0411', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('1b537c55-4bed-410a-952e-45ca2a4083ec', 'c5e964a5-fce6-4bb5-9299-49bdbb580202', '9512', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('94be383e-6e7a-43a5-8a81-e91b1c2361e8', 'c5e964a5-fce6-4bb5-9299-49bdbb580202', '6093', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c0851951-012f-41d8-bd4d-2b89fd40467f', 'c5e964a5-fce6-4bb5-9299-49bdbb580202', '0264', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9e8aff94-eafa-451e-ae49-87bd4f833c00', 'c5e964a5-fce6-4bb5-9299-49bdbb580202', '0045', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8775293d-02d8-457a-a1bc-856e58c4ed83', 'c5e964a5-fce6-4bb5-9299-49bdbb580202', '0131', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c939385a-087c-4b67-ad43-50fec5ef974d', 'c5e964a5-fce6-4bb5-9299-49bdbb580202', '0265', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('528a698d-6dff-4ede-84c5-01ef6f0a635a', 'c5e964a5-fce6-4bb5-9299-49bdbb580202', '9750', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0f3dbce9-0065-4793-a0a5-4fe430ee94f2', 'c5e964a5-fce6-4bb5-9299-49bdbb580202', '0109', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('69f007c9-1767-40fc-b0ba-58af76791763', 'c5e964a5-fce6-4bb5-9299-49bdbb580202', '9767', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7f8b9626-9078-4a15-99a5-50f1b2a95074', 'c5e964a5-fce6-4bb5-9299-49bdbb580202', '9476', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('65db22cc-780d-422e-b973-aa89a0479990', 'c5e964a5-fce6-4bb5-9299-49bdbb580202', '9506', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('dfb280c6-e300-4586-9293-223a27ece667', 'c5e964a5-fce6-4bb5-9299-49bdbb580202', '0412', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8b2eb373-e74d-4120-9c01-c92672372fa1', 'c5e964a5-fce6-4bb5-9299-49bdbb580202', '9754', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6e663f24-dcf6-4152-b81f-89c6fa450c6a', 'c5e964a5-fce6-4bb5-9299-49bdbb580202', '0243', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('75270377-934e-4ce1-9ef9-d6cf32a4adb8', 'c5e964a5-fce6-4bb5-9299-49bdbb580202', '0367', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7ff77dfb-848a-49f4-ac3d-6e69c0e1f52e', 'c5e964a5-fce6-4bb5-9299-49bdbb580202', '9751', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f8c9664d-b8d7-4877-8183-273eb0ad08ef', 'c5e964a5-fce6-4bb5-9299-49bdbb580202', '3004', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9a1cadc1-bcbf-4849-bc17-4e6ccb95a42f', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '9745', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b0a16eca-4fd1-4da8-a40b-a315f62a18c3', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '8779', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('79f2985d-ecda-4423-bb8f-e2e5514825bd', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '9209', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c4b5b724-ab64-4ed2-ac1f-d0662762c55b', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '0339', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('000156e2-4418-4854-b2d0-ed1803868e77', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '8778', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3cd25d4e-a91d-42a3-9888-0e359fe45fb1', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '9147', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('90c91d6a-c3b3-45db-aa34-7b7f4554adf4', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '0028', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('56ca9788-9923-447e-9345-66818ef30adc', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '9746', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('03d3a87e-e22f-4741-bd87-53dd95bca061', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '0189', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9715e3a4-d006-4216-9e6c-97b321be90de', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '0190', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('60e58b60-82f6-4299-99d9-bb058a03fae5', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '9749', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('98153053-cdb2-4e9b-b44a-c0f9deee71c0', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '0374', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('451e75bc-9194-4a46-97d4-bfd632a0ddd0', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '6111', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3ed26752-3e48-403f-b80c-29a56895c839', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '9459', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3bcbe80e-8498-4bb4-86d6-4204e0a1ad34', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '9752', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4ac318c4-22ae-428a-89c6-b7d918a79dea', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '8782', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6070f3ac-00b2-4c19-8896-4efa22db01bd', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '9753', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3c259762-c115-4815-b981-3ca5499a2357', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '0631', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('dae99275-883a-4b24-a946-66a6bd812f85', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '0511', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('28d3a663-e3ca-4fa3-81a1-f78aaa8e4fa8', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '3109', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2076a829-e42e-4295-aa5f-ce0f96a132f4', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '3075', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d6326c61-60d1-4979-a01c-5e8486b3052e', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '3129', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('66c8d0ef-73ee-4bd3-a398-65e4ed696f00', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '3014', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('bbffc373-8c0c-4f52-8b25-9372f8c83d91', 'cfbd8a35-d5e5-406a-a64a-d7027923bd01', '3119', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ebc3ec84-5a62-42b1-ab70-453f6e0cd3dd', '00d6064f-62d1-487b-87c7-f890ccd02879', '0520', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('790b884b-f708-42e3-9f95-74f95198bd80', '00d6064f-62d1-487b-87c7-f890ccd02879', '0391', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0d6d2e31-bfbf-465c-8739-70ab91e0ab53', '00d6064f-62d1-487b-87c7-f890ccd02879', '0390', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('dc287b0e-e77b-485d-9b96-7619ca82ab79', '00d6064f-62d1-487b-87c7-f890ccd02879', '0223', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('429020d1-8a54-431a-88e8-2258c7a3d555', '00d6064f-62d1-487b-87c7-f890ccd02879', '0215', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('90a05ee9-b516-47cd-9a3a-e591b6cc2ee7', '00d6064f-62d1-487b-87c7-f890ccd02879', '1086', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c198b4d0-5014-4752-8921-ec128b8d50f8', '00d6064f-62d1-487b-87c7-f890ccd02879', '1024', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('44315939-504a-41d0-91e1-24cfc5993705', '00d6064f-62d1-487b-87c7-f890ccd02879', '1025', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('570e5f31-318b-4692-9be4-f187b385db94', '00d6064f-62d1-487b-87c7-f890ccd02879', '1026', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('81fe905c-009a-42f1-aaf5-3ed2486c0145', '00d6064f-62d1-487b-87c7-f890ccd02879', '1023', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8cec334d-8383-460c-ad9f-80c69123b9f4', '00d6064f-62d1-487b-87c7-f890ccd02879', '1028', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('70e7e102-2f7d-45d6-bd28-bd10aec5f7b2', '00d6064f-62d1-487b-87c7-f890ccd02879', '1031', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3fdf98a3-3fa7-4be5-a699-1046b5224e96', '00d6064f-62d1-487b-87c7-f890ccd02879', '1065', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('30e8ea01-389c-4729-ac50-f2c14aefbfac', '00d6064f-62d1-487b-87c7-f890ccd02879', '1008', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6899e467-b6bd-4d0b-a117-717bc0583000', '00d6064f-62d1-487b-87c7-f890ccd02879', '1049', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('86aed33a-a7d9-4254-b190-29f8a33d585b', '00d6064f-62d1-487b-87c7-f890ccd02879', '1068', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('fbbed968-2df4-4661-87dd-280e7a7c42cb', '00d6064f-62d1-487b-87c7-f890ccd02879', '1038', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d9b0ce95-7d58-4817-bd28-6e29983d48b7', '00d6064f-62d1-487b-87c7-f890ccd02879', '1039', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ad5ac603-e6ab-4c1c-812e-718a2886f57b', '00d6064f-62d1-487b-87c7-f890ccd02879', '1041', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c8457a3d-e14b-486d-9b4d-87f753ae6365', '00d6064f-62d1-487b-87c7-f890ccd02879', '1000', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('856cbdef-7fb3-4c6c-b1e9-767c5793eded', '00d6064f-62d1-487b-87c7-f890ccd02879', '1075', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8c5a8df7-8955-4d24-9c71-db37439e6bf1', '00d6064f-62d1-487b-87c7-f890ccd02879', '1058', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('7953071c-3510-4e9b-a760-1db687b1cb21', '00d6064f-62d1-487b-87c7-f890ccd02879', '1059', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('cf4c88c1-3e19-4df6-a133-ab258f70666d', '00d6064f-62d1-487b-87c7-f890ccd02879', '1062', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('50e434a3-fd93-40ad-b0dd-6f4ebb303928', '00d6064f-62d1-487b-87c7-f890ccd02879', '1021', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('375573ba-2c1f-4fbc-9ea6-7220193e66f9', '00d6064f-62d1-487b-87c7-f890ccd02879', '1064', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('63de87ed-37a0-4ec8-b7f0-ad01aa3ed640', '00d6064f-62d1-487b-87c7-f890ccd02879', '1069', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('20d2c9a1-4cc1-49ee-9e9f-d2d3841b5eda', '00d6064f-62d1-487b-87c7-f890ccd02879', '1070', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f184be15-a12c-4905-917f-ec98f89aff04', '00d6064f-62d1-487b-87c7-f890ccd02879', '1072', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('fd7f92c1-731e-4fbd-8212-ddb9f6f950a6', '00d6064f-62d1-487b-87c7-f890ccd02879', '3120', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c1da5b38-4964-4e40-86be-29102672d801', '00d6064f-62d1-487b-87c7-f890ccd02879', '3040', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('fb71c3b1-c4b1-471d-aaa3-9f5d89ba30f5', '00d6064f-62d1-487b-87c7-f890ccd02879', '3111', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ac412ff8-1e11-412c-9cb6-7215440a818a', '365cf8ff-c9f8-4ad4-95a0-f8a4305eda4f', '0220', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('dc80cd52-656a-46c7-8984-20ab95f57fbb', '365cf8ff-c9f8-4ad4-95a0-f8a4305eda4f', '0087', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2b22760c-7f92-4705-b3d8-488c8b259493', '365cf8ff-c9f8-4ad4-95a0-f8a4305eda4f', '0313', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('54b923ac-8f84-4c28-8463-3ceb77ac41f9', '365cf8ff-c9f8-4ad4-95a0-f8a4305eda4f', '0001', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b25c1454-9d84-435c-8ff8-f24b36c0c156', '365cf8ff-c9f8-4ad4-95a0-f8a4305eda4f', '0348', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d5c34a7e-be34-49d1-8161-a7260ce8aced', '365cf8ff-c9f8-4ad4-95a0-f8a4305eda4f', '0188', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('939ed30a-6ee5-4a1e-a8e7-b83d0c2b148a', '365cf8ff-c9f8-4ad4-95a0-f8a4305eda4f', '0036', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('c44dbde5-8d91-42ac-9f8f-25259fc5bf2b', '365cf8ff-c9f8-4ad4-95a0-f8a4305eda4f', '0180', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d77755d0-9997-4174-9a2c-bd34652aec54', '365cf8ff-c9f8-4ad4-95a0-f8a4305eda4f', '4337', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9393a895-6fe7-49c8-bd23-6edba51d23bf', '365cf8ff-c9f8-4ad4-95a0-f8a4305eda4f', '6081', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('349a9a19-e14f-498f-8743-cc47dafe8530', 'ebc89b4d-d579-4dcf-8848-ad4a7ef07cf3', '0117', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('63fe42f6-8c94-4750-a8ad-dd942bacc43d', 'ebc89b4d-d579-4dcf-8848-ad4a7ef07cf3', '0383', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('cbaae813-cd2c-42b5-b5b5-43e2b53daa5d', 'ebc89b4d-d579-4dcf-8848-ad4a7ef07cf3', '0113', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('91771747-31e3-4ebf-a3b9-f2bf77319591', 'ebc89b4d-d579-4dcf-8848-ad4a7ef07cf3', '6161', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f5633313-6481-44f0-871a-136cb3196823', 'ebc89b4d-d579-4dcf-8848-ad4a7ef07cf3', '0210', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8fee9807-23a9-4bd5-a916-9914f3781fb0', 'ebc89b4d-d579-4dcf-8848-ad4a7ef07cf3', '9229', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('6c0f7e4e-b4d0-471d-9b0b-27b43dbe1517', 'ebc89b4d-d579-4dcf-8848-ad4a7ef07cf3', '9959', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8fc50848-741c-4da3-becb-19f1bb2a43af', 'ebc89b4d-d579-4dcf-8848-ad4a7ef07cf3', '9474', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('69d732f3-3db4-4535-8828-2ea14c188197', 'ebc89b4d-d579-4dcf-8848-ad4a7ef07cf3', '0003', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5a24d1b6-ae0b-4120-80c7-c8b4939767cb', 'ebc89b4d-d579-4dcf-8848-ad4a7ef07cf3', '0106', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('e8aedb6a-45af-444a-bf99-0851528fa37e', 'ebc89b4d-d579-4dcf-8848-ad4a7ef07cf3', '0037', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f610b07c-a47b-49d9-9c28-ffd2e56fae64', 'ebc89b4d-d579-4dcf-8848-ad4a7ef07cf3', '9748', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('a7b86455-5a91-49f5-b4fb-6c176c91405d', 'ebc89b4d-d579-4dcf-8848-ad4a7ef07cf3', '0154', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b294f03b-a454-4410-b512-33bc910ce769', 'ebc89b4d-d579-4dcf-8848-ad4a7ef07cf3', '0295', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('15218b4e-53f1-4255-a654-9902bb2756a4', 'ebc89b4d-d579-4dcf-8848-ad4a7ef07cf3', '0137', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ae660220-55e2-41c6-9c11-d3cd1b437466', 'ebc89b4d-d579-4dcf-8848-ad4a7ef07cf3', '3113', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('8bedc84d-d5e9-4548-8304-4f7278700875', 'ebc89b4d-d579-4dcf-8848-ad4a7ef07cf3', '4460', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('d02212ab-f691-499a-83a1-0666e1185915', 'ebc89b4d-d579-4dcf-8848-ad4a7ef07cf3', '3112', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('47f7305d-a2e5-4043-a1e7-4c70975d7105', 'ebc89b4d-d579-4dcf-8848-ad4a7ef07cf3', '3054', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ce4a4576-1aa9-40d6-bc4d-c45d2facc442', 'b234c034-e9cd-43dc-bacd-cdc37af8d4d1', '0262', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('bf6c7b04-7dbf-403d-9726-e463de2e089b', 'b234c034-e9cd-43dc-bacd-cdc37af8d4d1', '0096', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('4a5da86c-b3e9-468a-b539-0a22e14daed2', 'b234c034-e9cd-43dc-bacd-cdc37af8d4d1', '9398', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('85574a33-ea85-4183-afc8-bc890a4f76c9', 'b234c034-e9cd-43dc-bacd-cdc37af8d4d1', '0240', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0b3b1ce6-580b-4960-90e4-3f1cc5e23915', 'b234c034-e9cd-43dc-bacd-cdc37af8d4d1', '0009', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('07067555-0338-40a9-90e9-338f374aba4c', 'b234c034-e9cd-43dc-bacd-cdc37af8d4d1', '3097', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3306e316-8874-474e-8f92-38d0443e9696', 'b234c034-e9cd-43dc-bacd-cdc37af8d4d1', '4361', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('cf92d03a-91da-4de8-8e4b-c4fe0214a692', 'b234c034-e9cd-43dc-bacd-cdc37af8d4d1', '3083', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('0851631e-f778-44dd-9351-4bb90e372f66', 'b234c034-e9cd-43dc-bacd-cdc37af8d4d1', '3066', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('f4ba53d6-b211-4647-b6ab-6e27f669340e', '35a55b82-e441-4c56-b26e-9f598795709f', '0165', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('896d6fdf-31fb-4ced-a9bd-d24d15d8c18f', '35a55b82-e441-4c56-b26e-9f598795709f', '9554', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('2b767c93-c6a8-4d67-8597-ae93362ebfe2', '35a55b82-e441-4c56-b26e-9f598795709f', '9868', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ab1697f8-2c63-4bff-abb6-eb3c99099689', '35a55b82-e441-4c56-b26e-9f598795709f', '9869', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('367a7143-328c-424a-95a1-78021949a645', '35a55b82-e441-4c56-b26e-9f598795709f', '0384', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5fded880-dbbe-4a62-94f3-d21bfce6b1b8', '35a55b82-e441-4c56-b26e-9f598795709f', '0237', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ff3a6416-7a3e-4590-8bda-c8ad9116133d', '35a55b82-e441-4c56-b26e-9f598795709f', '0104', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('df2fc6c8-a8b9-4ac7-a40c-8355ede7ca37', '35a55b82-e441-4c56-b26e-9f598795709f', '0529', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('52f4f329-02e0-417e-ac1b-43b998e35982', '35a55b82-e441-4c56-b26e-9f598795709f', '0021', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b541664c-e8b4-41f7-acc1-154a8bc04e2f', '35a55b82-e441-4c56-b26e-9f598795709f', '0198', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ebee5989-e145-44f1-b0de-b013140f909c', '35a55b82-e441-4c56-b26e-9f598795709f', '0267', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('60a87006-d81d-4aa8-9bc8-40b47aa81066', '35a55b82-e441-4c56-b26e-9f598795709f', '9867', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ad4385bc-205e-4e34-b80d-e1d79ad564b3', '35a55b82-e441-4c56-b26e-9f598795709f', '0382', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('039fa37b-9757-4a5c-acc6-cd99d17f6962', '35a55b82-e441-4c56-b26e-9f598795709f', '0322', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('9b1b9957-5ec3-44b7-b20d-b7f994a495bc', '35a55b82-e441-4c56-b26e-9f598795709f', '0044', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('ae79f2e6-1365-4f34-aa93-da57e543ac34', '35a55b82-e441-4c56-b26e-9f598795709f', '0155', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('085036dd-87ec-4497-a06b-8fe15faefcd4', '35a55b82-e441-4c56-b26e-9f598795709f', '3017', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('820b6ffe-0340-43a8-9533-902d1a7fc738', '35a55b82-e441-4c56-b26e-9f598795709f', '3128', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('922b31ce-dfaf-4941-b8b1-29f61b7ea35b', '35a55b82-e441-4c56-b26e-9f598795709f', '3037', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('b2e090af-7704-40dc-a4dd-944f2be67796', '35a55b82-e441-4c56-b26e-9f598795709f', '3016', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('87ff60b2-5730-4bf9-a54a-f49e1534eae3', '35a55b82-e441-4c56-b26e-9f598795709f', '3094', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('5fcf3cba-7cd5-4689-920d-056d52d511e5', '35a55b82-e441-4c56-b26e-9f598795709f', '3018', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('53726d22-b182-421a-9384-e978b70ad022', '35a55b82-e441-4c56-b26e-9f598795709f', '3067', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('458f4d9c-eae2-4a8e-9d73-f5cf89225457', '35a55b82-e441-4c56-b26e-9f598795709f', '3132', 'postgres', '2025-09-10 17:08:29.707837', 'postgres', '2025-09-10 17:08:29.707837');
INSERT INTO shared.park_area_mapping VALUES ('3dd8033b-588b-4287-82bf-ceaf7f77a7c5', '363b5ab2-63b1-4910-898b-de18ecf40f38', '0523', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('0838166d-4040-4595-8197-467fb97e4bac', '363b5ab2-63b1-4910-898b-de18ecf40f38', '0525', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('011441b7-6720-4c7f-8cc7-829d5b575066', '363b5ab2-63b1-4910-898b-de18ecf40f38', '0568', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('99b3bf4d-a81b-40bf-8231-3055d962f2ae', '363b5ab2-63b1-4910-898b-de18ecf40f38', '0593', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('59a7af29-ce94-4b62-b25c-9d170e3f261d', '24ade15c-9bda-4b88-af57-581d3abb7da8', '400-1', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('98c3b3f1-c1cd-4b0d-8322-afc8628a4ebc', '24ade15c-9bda-4b88-af57-581d3abb7da8', '400-2', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('9c9c9732-65e4-4405-8741-df37bc0206a5', '24ade15c-9bda-4b88-af57-581d3abb7da8', '400-3', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('eb113e2e-3456-44c0-bc30-8262015ed29f', '24ade15c-9bda-4b88-af57-581d3abb7da8', '400-4', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('0bea9758-8718-4be0-8f8c-facd1490bea4', '24ade15c-9bda-4b88-af57-581d3abb7da8', '400-5', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('2cd622d8-bab1-4b57-8c36-33999dffbbdf', '24ade15c-9bda-4b88-af57-581d3abb7da8', '400-6', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('4a11566d-1dea-45fc-b306-ec02a29a9808', '24ade15c-9bda-4b88-af57-581d3abb7da8', '406-1', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('4cadc997-3cf1-427f-9d72-09d22fc05ef9', '07cc2a3e-aa4c-4954-a363-97de7a34dba6', '4276', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('71f84b6f-2e1c-4870-923b-915a346a45fa', '2ad6879d-8959-419c-91af-cfb4d72a9a6d', '9471', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('28310b3f-866b-41a9-96c5-2898345f06e1', 'b4a18271-9722-4726-bc90-29520d91764b', '9964', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('b461c1f6-0578-4af0-a4c3-6881fb3ac4d6', 'b4a18271-9722-4726-bc90-29520d91764b', '9965', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('de3d9817-f145-4404-bc10-36f1db539c4c', 'b4a18271-9722-4726-bc90-29520d91764b', '9966', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('dde6713b-060d-445b-ac13-74d6e99127aa', 'b4a18271-9722-4726-bc90-29520d91764b', '9967', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('166bc581-46eb-48ac-8d25-50a4afcc5978', 'b4a18271-9722-4726-bc90-29520d91764b', '9968', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('ea7f1ae3-33e7-4859-96c9-146373c633ed', 'b4a18271-9722-4726-bc90-29520d91764b', '9970', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('c2c0e98d-3754-4886-b913-df80256b3e8d', 'b4a18271-9722-4726-bc90-29520d91764b', '9971', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('2bf684fd-0a0f-4a6c-b880-b3dfea1eb098', 'b4a18271-9722-4726-bc90-29520d91764b', '9972', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('5b8e6154-0a20-44f5-8292-72b15e739eec', '9db89ac1-ae34-4fdd-ab72-b2ca78636aee', '9730', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('1c96bc38-86b7-4959-8c70-716b8feaa597', 'a63546fa-622c-4c1b-a0d2-a900d28a51a3', '9969', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('09723d00-505d-4ac3-82f3-bf728016fc03', 'd94648ef-ed6e-4c48-9312-5ad43fd4e22d', '357-1', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('87707034-a739-4d34-a73d-646c4e89df87', 'd94648ef-ed6e-4c48-9312-5ad43fd4e22d', '357-2', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('b6a25c0d-2f0e-4070-a55a-2313c7731602', 'd94648ef-ed6e-4c48-9312-5ad43fd4e22d', '357-3', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('95d32350-e15a-4028-bb3a-8503a48db620', 'd94648ef-ed6e-4c48-9312-5ad43fd4e22d', '357-4', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('ed6e1e27-f34c-49c7-b09e-5b10ecf0203b', 'd94648ef-ed6e-4c48-9312-5ad43fd4e22d', '357-5', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('03598e6c-061f-412a-b655-385c52a638a2', '286b0494-178f-49a4-ac3c-19fe27574034', '0254', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('28a8b5f8-85fe-4406-8b30-3b60b93b0584', 'c5e964a5-fce6-4bb5-9299-49bdbb580202', '0597', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('1269ae96-a957-41eb-917b-698dd77d3113', '3bfa96e1-9501-44ee-877e-e1d88c49b597', '0224', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('ddf7cb4e-66d9-4c17-bace-968839e309b6', '3bfa96e1-9501-44ee-877e-e1d88c49b597', '0524', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('fdbc4028-bbd9-4886-8143-3fe3feab0f04', 'dcfccb22-1dee-484d-915f-e95b107f218e', '3099', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('e5c5e797-2509-4dc4-a546-037c66b1b42a', 'dcfccb22-1dee-484d-915f-e95b107f218e', '9769', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('7ea20b42-20de-40c6-8ef0-856e1ba4eece', '5624d05a-1a06-4aa3-adf0-ac56db6b478c', '3875', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('e9913693-cb6e-43c1-bbb9-be35c199b0fa', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '406-2', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('0f44bed6-6604-4485-a224-1a105dedeacc', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '406-3', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('7eb8190b-29e8-43c2-89bc-fa0402492e0e', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '9658-1', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('12435d5c-8e29-4089-8aeb-63e878cfde67', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '9658-2', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('8038f5f4-7ad6-4ea8-8310-c52a8d2304a2', '8133b284-6bf0-4781-b5f8-78d53a87fda9', '9658-3', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('9c69ba3d-b271-44fa-a5e6-e4c879959eb4', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '0521', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('f5739095-7175-4039-a6a0-aa5b261143a1', 'f9d95f6c-c3d5-4635-bac6-56994e3db31a', '9956', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('b95693c2-fbb2-47fa-bde3-68c1b964afc1', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '273-1', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('621cfc22-a5ac-441d-a0bc-8f41e464f07b', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '273-10', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('973259ff-e38b-488a-8827-680c9d4a233e', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '273-2', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('0f48fab8-5983-4266-bbed-a6d6ac70049d', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '273-3', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('58444ad6-dfd1-4e4d-9e1d-9eeaeab7adb4', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '273-4', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('c7edc911-3920-4f6b-bd58-66af31841907', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '273-5', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('0f97c913-e921-4112-a082-91a84cb0f757', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '273-6', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('99b0bd54-2970-4eb4-9156-e96bb3fc7cc6', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '273-7', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('b2f0fa5e-a274-4336-9467-dc296c983131', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '273-8', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('f8f8248a-894e-48a1-a443-c011302e6948', 'a7ed352d-48df-43a2-8b74-3c6f748a4e16', '273-9', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('1d96945a-ec99-4d76-bfbb-8f0d974d1630', 'adab98b4-983e-4a75-9be3-fcd76bb4384c', '3021', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('21356e7c-908d-44ca-a899-a7e12d4e5ba1', 'adab98b4-983e-4a75-9be3-fcd76bb4384c', '3022', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('e9ca517d-b38e-43de-8f62-4bd8c9243099', 'adab98b4-983e-4a75-9be3-fcd76bb4384c', '3106', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('a265f862-3e13-4e3b-adb6-90114e28d0c9', '5af6376d-20d6-478e-b45f-d50394b7f317', '5019', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('15b44f76-adc0-4ff2-8d98-cece6dc93edb', '408fe8ab-d69c-4870-98f7-b5beb78fe003', '0556', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('4b61b0e9-e67b-45e6-87a5-2b0c1ec70ff5', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '0227', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('74746229-8685-468b-a6f5-e49c2a20b6d3', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '303-1', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('2d276507-82f0-438a-8791-f0834f0a6148', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '303-2', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('fe9b851e-f79d-4de3-b08c-2b3b4f8d0a0a', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '303-4', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('2934b23b-b99f-487b-bd46-672a8d2d2912', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '303-5', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('3a9897a1-fdd4-434b-a64e-246116f04a06', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '303-6', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('67b83839-cd51-44d2-8b6f-cc8b0eac4ca5', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '303-8', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('90087ab4-e7b9-4add-b949-d9d070c4c2cc', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '0333', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('335e600c-785b-4887-bcf5-266595b12964', 'c4c68a21-c5f2-4313-bb16-70a56bad46b6', '0095', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('108b7e62-ffe4-43ff-b37d-f392aea8c7e5', '3108d243-3ae8-4b5e-b634-374d8ec0b193', '0018', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('fb028fce-8af2-49a9-b9eb-6bf0b377b148', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '486-1', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('38f7c16d-f598-4c6d-991c-2dd4bd45d0cd', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '486-2', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('490727be-d2e1-4f5d-8e27-a24a20f81f96', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '9601-1', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('d6e8fcc4-b3ec-452c-ac18-bb44b56e4bd0', '6bd54f8c-b3cf-4833-a54b-5592c300d474', '9601-2', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');
INSERT INTO shared.park_area_mapping VALUES ('6c638ab1-5bfb-4964-b092-b68e5f319450', '07467b02-1664-4f85-9868-9ef7f8690bc3', '0386', 'postgres', '2025-09-10 17:08:30.088477', 'postgres', '2025-09-10 17:08:30.088477');


--
-- Data for Name: park_area_xref; Type: TABLE DATA; Schema: shared; Owner: -
--



--
-- Data for Name: party; Type: TABLE DATA; Schema: shared; Owner: -
--



--
-- Data for Name: party_h; Type: TABLE DATA; Schema: shared; Owner: -
--



--
-- Data for Name: party_type_code; Type: TABLE DATA; Schema: shared; Owner: -
--

INSERT INTO shared.party_type_code VALUES ('PRS', 'Person', 'Person', 2, true, 'system', '2025-09-10 17:09:13.194874', NULL, NULL);
INSERT INTO shared.party_type_code VALUES ('CMP', 'Business', 'Business', 1, true, 'system', '2025-09-10 17:09:13.194874', 'postgres', '2025-09-10 17:09:13.231579');


--
-- Data for Name: person; Type: TABLE DATA; Schema: shared; Owner: -
--



--
-- Data for Name: person_h; Type: TABLE DATA; Schema: shared; Owner: -
--



--
-- Name: TEMP_POC_SEQ; Type: SEQUENCE SET; Schema: shared; Owner: -
--

SELECT pg_catalog.setval('shared."TEMP_POC_SEQ"', 100, true);


--
-- Name: business_h PK_h_business; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.business_h
    ADD CONSTRAINT "PK_h_business" PRIMARY KEY (h_business_guid);


--
-- Name: contact_method_h PK_h_contact_method; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.contact_method_h
    ADD CONSTRAINT "PK_h_contact_method" PRIMARY KEY (h_contact_method_guid);


--
-- Name: party_h PK_h_party; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.party_h
    ADD CONSTRAINT "PK_h_party" PRIMARY KEY (h_party_guid);


--
-- Name: person_h PK_h_person; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.person_h
    ADD CONSTRAINT "PK_h_person" PRIMARY KEY (h_person_guid);


--
-- Name: park UK_park__external_id; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.park
    ADD CONSTRAINT "UK_park__external_id" UNIQUE (external_id);


--
-- Name: business UQ_business_party_guid; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.business
    ADD CONSTRAINT "UQ_business_party_guid" UNIQUE (party_guid);


--
-- Name: person UQ_person_party_guid; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.person
    ADD CONSTRAINT "UQ_person_party_guid" UNIQUE (party_guid);


--
-- Name: agency_code agency_code_pkey; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.agency_code
    ADD CONSTRAINT agency_code_pkey PRIMARY KEY (agency_code);


--
-- Name: business business_pkey; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.business
    ADD CONSTRAINT business_pkey PRIMARY KEY (business_guid);


--
-- Name: case_activity_h case_activity_h_pkey; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.case_activity_h
    ADD CONSTRAINT case_activity_h_pkey PRIMARY KEY (h_case_activity_guid);


--
-- Name: case_activity case_activity_pkey; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.case_activity
    ADD CONSTRAINT case_activity_pkey PRIMARY KEY (case_activity_guid);


--
-- Name: case_activity_type_code case_activity_type_code_pkey; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.case_activity_type_code
    ADD CONSTRAINT case_activity_type_code_pkey PRIMARY KEY (case_activity_type_code);


--
-- Name: case_file_h case_file_h_pkey; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.case_file_h
    ADD CONSTRAINT case_file_h_pkey PRIMARY KEY (h_case_file_guid);


--
-- Name: case_file case_file_pkey; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.case_file
    ADD CONSTRAINT case_file_pkey PRIMARY KEY (case_file_guid);


--
-- Name: case_status_code case_status_code_pkey; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.case_status_code
    ADD CONSTRAINT case_status_code_pkey PRIMARY KEY (case_status_code);


--
-- Name: contact_method contact_method_pkey; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.contact_method
    ADD CONSTRAINT contact_method_pkey PRIMARY KEY (contact_method_guid);


--
-- Name: contact_method_type_code contact_method_type_code_pkey; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.contact_method_type_code
    ADD CONSTRAINT contact_method_type_code_pkey PRIMARY KEY (contact_method_type_code);


--
-- Name: park_area_mapping park_area_mapping_pkey; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.park_area_mapping
    ADD CONSTRAINT park_area_mapping_pkey PRIMARY KEY (park_area_mapping_guid);


--
-- Name: park_area park_area_pkey; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.park_area
    ADD CONSTRAINT park_area_pkey PRIMARY KEY (park_area_guid);


--
-- Name: park_area_xref park_area_xref_pkey; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.park_area_xref
    ADD CONSTRAINT park_area_xref_pkey PRIMARY KEY (park_area_guid_xref);


--
-- Name: park park_pkey; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.park
    ADD CONSTRAINT park_pkey PRIMARY KEY (park_guid);


--
-- Name: party party_pkey; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.party
    ADD CONSTRAINT party_pkey PRIMARY KEY (party_guid);


--
-- Name: party_type_code party_type_code_pkey; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.party_type_code
    ADD CONSTRAINT party_type_code_pkey PRIMARY KEY (party_type_code);


--
-- Name: person person_pkey; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (person_guid);


--
-- Name: park_area uk_park_area__name; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.park_area
    ADD CONSTRAINT uk_park_area__name UNIQUE (name);


--
-- Name: park_area_mapping uk_park_area_mapping__park_area_guid__external_id; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.park_area_mapping
    ADD CONSTRAINT uk_park_area_mapping__park_area_guid__external_id UNIQUE (park_area_guid, external_id);


--
-- Name: park_area_xref uk_park_area_xref__park_guid__park_area_guid; Type: CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.park_area_xref
    ADD CONSTRAINT uk_park_area_xref__park_guid__park_area_guid UNIQUE (park_area_guid, park_guid);


--
-- Name: business business_history_trigger; Type: TRIGGER; Schema: shared; Owner: -
--

CREATE TRIGGER business_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON shared.business FOR EACH ROW EXECUTE FUNCTION shared.audit_history('business_h', 'business_guid');


--
-- Name: case_activity case_activity_h_trigger; Type: TRIGGER; Schema: shared; Owner: -
--

CREATE TRIGGER case_activity_h_trigger BEFORE INSERT OR DELETE OR UPDATE ON shared.case_activity FOR EACH ROW EXECUTE FUNCTION shared.audit_history('case_activity_h', 'case_activity_guid');


--
-- Name: case_file case_file_h_trigger; Type: TRIGGER; Schema: shared; Owner: -
--

CREATE TRIGGER case_file_h_trigger BEFORE INSERT OR DELETE OR UPDATE ON shared.case_file FOR EACH ROW EXECUTE FUNCTION shared.audit_history('case_file_h', 'case_file_guid');


--
-- Name: contact_method contact_method_history_trigger; Type: TRIGGER; Schema: shared; Owner: -
--

CREATE TRIGGER contact_method_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON shared.contact_method FOR EACH ROW EXECUTE FUNCTION shared.audit_history('contact_method_h', 'contact_method_guid');


--
-- Name: park_area parkarea_set_default_audit_values; Type: TRIGGER; Schema: shared; Owner: -
--

CREATE TRIGGER parkarea_set_default_audit_values BEFORE UPDATE ON shared.park_area FOR EACH ROW EXECUTE FUNCTION shared.update_audit_columns();


--
-- Name: party party_history_trigger; Type: TRIGGER; Schema: shared; Owner: -
--

CREATE TRIGGER party_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON shared.party FOR EACH ROW EXECUTE FUNCTION shared.audit_history('party_h', 'party_guid');


--
-- Name: person person_history_trigger; Type: TRIGGER; Schema: shared; Owner: -
--

CREATE TRIGGER person_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON shared.person FOR EACH ROW EXECUTE FUNCTION shared.audit_history('person_h', 'person_guid');


--
-- Name: party_type_code ptytpcde_set_default_audit_values; Type: TRIGGER; Schema: shared; Owner: -
--

CREATE TRIGGER ptytpcde_set_default_audit_values BEFORE UPDATE ON shared.party_type_code FOR EACH ROW EXECUTE FUNCTION shared.update_audit_columns();


--
-- Name: business FK_business_party; Type: FK CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.business
    ADD CONSTRAINT "FK_business_party" FOREIGN KEY (party_guid) REFERENCES shared.party(party_guid);


--
-- Name: person FK_person_party; Type: FK CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.person
    ADD CONSTRAINT "FK_person_party" FOREIGN KEY (party_guid) REFERENCES shared.party(party_guid);


--
-- Name: case_activity fk_case_activity__case_activity_type_code; Type: FK CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.case_activity
    ADD CONSTRAINT fk_case_activity__case_activity_type_code FOREIGN KEY (activity_type) REFERENCES shared.case_activity_type_code(case_activity_type_code);


--
-- Name: case_activity fk_case_activity__case_file; Type: FK CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.case_activity
    ADD CONSTRAINT fk_case_activity__case_file FOREIGN KEY (case_file_guid) REFERENCES shared.case_file(case_file_guid);


--
-- Name: case_file fk_case_file__agency_code; Type: FK CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.case_file
    ADD CONSTRAINT fk_case_file__agency_code FOREIGN KEY (lead_agency) REFERENCES shared.agency_code(agency_code);


--
-- Name: case_file fk_case_file__case_status_code; Type: FK CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.case_file
    ADD CONSTRAINT fk_case_file__case_status_code FOREIGN KEY (case_status) REFERENCES shared.case_status_code(case_status_code);


--
-- Name: contact_method fk_contact_method_person; Type: FK CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.contact_method
    ADD CONSTRAINT fk_contact_method_person FOREIGN KEY (person_guid) REFERENCES shared.person(person_guid) ON DELETE CASCADE;


--
-- Name: contact_method fk_contact_method_type; Type: FK CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.contact_method
    ADD CONSTRAINT fk_contact_method_type FOREIGN KEY (contact_method_type) REFERENCES shared.contact_method_type_code(contact_method_type_code);


--
-- Name: park_area_xref fk_park_area_xref__park; Type: FK CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.park_area_xref
    ADD CONSTRAINT fk_park_area_xref__park FOREIGN KEY (park_area_guid) REFERENCES shared.park_area(park_area_guid);


--
-- Name: park_area_xref fk_park_area_xref__park_area; Type: FK CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.park_area_xref
    ADD CONSTRAINT fk_park_area_xref__park_area FOREIGN KEY (park_guid) REFERENCES shared.park(park_guid);


--
-- Name: party fk_party__party_type; Type: FK CONSTRAINT; Schema: shared; Owner: -
--

ALTER TABLE ONLY shared.party
    ADD CONSTRAINT fk_party__party_type FOREIGN KEY (party_type) REFERENCES shared.party_type_code(party_type_code);


--
-- PostgreSQL database dump complete
--

DO $$
BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_user WHERE usename = 'shared') THEN
    CREATE USER shared WITH PASSWORD '${SHARED_PASSWORD}';
END IF;
END $$;