--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8 (Debian 15.8-1.pgdg110+1)
-- Dumped by pg_dump version 15.1

SET check_function_bodies = false;

--
-- Name: complaint_outcome; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA IF NOT EXISTS complaint_outcome;


--
-- Name: audit_history(); Type: FUNCTION; Schema: complaint_outcome; Owner: -
--

CREATE FUNCTION complaint_outcome.audit_history() RETURNS trigger
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
            'INSERT INTO complaint_outcome.%I (target_row_id, operation_type, operation_user_id, data_after_executed_operation) VALUES ($1.%I,  ''I'', $1.create_user_id, to_jsonb($1))',  target_history_table, target_pk
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
            'INSERT INTO complaint_outcome.%I (target_row_id, operation_type, operation_user_id, data_after_executed_operation) VALUES ($1.%I, ''U'', $1.update_user_id, to_jsonb($1))', target_history_table, target_pk
          )
        USING NEW;
      RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN

      EXECUTE
        format(
                'INSERT INTO complaint_outcome.%I (target_row_id, operation_type) VALUES ($1.%I, ''D'')', target_history_table, target_pk
        )
        USING OLD;
      RETURN OLD;

    END IF;
  END;
$_$;


--
-- Name: update_audit_columns(); Type: FUNCTION; Schema: complaint_outcome; Owner: -
--

CREATE FUNCTION complaint_outcome.update_audit_columns() RETURNS trigger
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
-- Name: USER_SEQ; Type: SEQUENCE; Schema: complaint_outcome; Owner: -
--

CREATE SEQUENCE complaint_outcome."USER_SEQ"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: action; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.action (
    action_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    complaint_outcome_guid uuid NOT NULL,
    action_type_action_xref_guid uuid NOT NULL,
    actor_guid uuid NOT NULL,
    action_date timestamp without time zone NOT NULL,
    active_ind boolean,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    equipment_guid uuid,
    wildlife_guid uuid,
    decision_guid uuid,
    case_note_guid uuid,
    assessment_guid uuid,
    prevention_education_guid uuid
);


--
-- Name: TABLE action; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.action IS 'Represents a concrete action recorded by the case management system.   All actions have an actor and the date/time they occurred.';


--
-- Name: COLUMN action.action_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action.action_guid IS 'System generated unique key for the action.  This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN action.complaint_outcome_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action.complaint_outcome_guid IS 'System generated unique key for a case.  This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN action.action_type_action_xref_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action.action_type_action_xref_guid IS 'System generated unique key for a relationship between case management actions and logical types.  This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN action.actor_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action.actor_guid IS 'Represents the IDIR guid of the user who performed the action.    ';


--
-- Name: COLUMN action.action_date; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action.action_date IS 'The date the action was recorded.   This value is user entered.';


--
-- Name: COLUMN action.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action.active_ind IS 'A boolean indicator to determine if the action is active and should be displayed in the application.';


--
-- Name: COLUMN action.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action.create_user_id IS 'The id of the user that created the case.';


--
-- Name: COLUMN action.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action.create_utc_timestamp IS 'The timestamp when the case was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN action.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action.update_user_id IS 'The id of the user that updated the case.';


--
-- Name: COLUMN action.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action.update_utc_timestamp IS 'The timestamp when the case was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN action.equipment_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action.equipment_guid IS 'System generated unique key for a piece of equipment.  This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN action.case_note_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action.case_note_guid IS 'Relates to case_note for note related actions such as UPDATENOTE.';


--
-- Name: action_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.action_code (
    action_code character varying(10) NOT NULL,
    short_description character varying(250),
    long_description character varying(250),
    active_ind boolean,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE action_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.action_code IS 'Contains a list of all possible actions that can be performed on a case.  ';


--
-- Name: COLUMN action_code.action_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_code.action_code IS 'A human readable code used to identify a case management action.';


--
-- Name: COLUMN action_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_code.short_description IS 'The short description of a case management action.';


--
-- Name: COLUMN action_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_code.long_description IS 'The long description of a case management action.';


--
-- Name: COLUMN action_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_code.active_ind IS 'A boolean indicator to determine if the case management action is active.';


--
-- Name: COLUMN action_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_code.create_user_id IS 'The id of the user that created the case management action.';


--
-- Name: COLUMN action_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_code.create_utc_timestamp IS 'The timestamp when the case management action was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN action_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_code.update_user_id IS 'The id of the user that updated the case management action.';


--
-- Name: COLUMN action_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_code.update_utc_timestamp IS 'The timestamp when the case management action was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: action_h; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.action_h (
    h_action_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: TABLE action_h; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.action_h IS 'History table for action table';


--
-- Name: COLUMN action_h.h_action_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_h.h_action_guid IS 'System generated unique key for action history. This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN action_h.target_row_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_h.target_row_id IS 'The unique key for the action that has been created or modified.';


--
-- Name: COLUMN action_h.operation_type; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN action_h.operation_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_h.operation_user_id IS 'The id of the user that created or modified the data in the action table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN action_h.operation_executed_at; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_h.operation_executed_at IS 'The timestamp when the data in the action table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN action_h.data_after_executed_operation; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


--
-- Name: action_type_action_xref; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.action_type_action_xref (
    action_type_action_xref_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    action_type_code character varying(10) NOT NULL,
    action_code character varying(10) NOT NULL,
    display_order integer NOT NULL,
    active_ind boolean,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE action_type_action_xref; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.action_type_action_xref IS 'Contains the relationship between case management actions and logical types.';


--
-- Name: COLUMN action_type_action_xref.action_type_action_xref_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_type_action_xref.action_type_action_xref_guid IS 'System generated unique key for a relationship between case management actions and logical types.  This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN action_type_action_xref.action_type_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_type_action_xref.action_type_code IS 'A human readable code used to identify a logical grouping of case management actions.';


--
-- Name: COLUMN action_type_action_xref.action_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_type_action_xref.action_code IS 'A human readable code used to identify a case management action.';


--
-- Name: COLUMN action_type_action_xref.display_order; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_type_action_xref.display_order IS 'The order in which the values of the case management actions should be displayed when presented to a user in a list.';


--
-- Name: COLUMN action_type_action_xref.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_type_action_xref.active_ind IS 'A boolean indicator to determine if the relationship between case management actions and logical types is active.';


--
-- Name: action_type_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.action_type_code (
    action_type_code character varying(10) NOT NULL,
    short_description character varying(50),
    long_description character varying(250),
    active_ind boolean,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE action_type_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.action_type_code IS 'Case management actions are grouped into logical types. For example COMPASSESS = ''Complaint Assessment''.';


--
-- Name: COLUMN action_type_code.action_type_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_type_code.action_type_code IS 'A human readable code used to identify a logical grouping of case management actions.';


--
-- Name: COLUMN action_type_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_type_code.short_description IS 'The short description of a logical grouping of case management actions.';


--
-- Name: COLUMN action_type_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_type_code.long_description IS 'The long description of a logical grouping of case management actions.';


--
-- Name: COLUMN action_type_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_type_code.active_ind IS 'A boolean indicator to determine if the logical grouping of case management actions is active.';


--
-- Name: COLUMN action_type_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_type_code.create_user_id IS 'The id of the user that created the action type entry.';


--
-- Name: COLUMN action_type_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_type_code.create_utc_timestamp IS 'The timestamp when the action type entry was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN action_type_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_type_code.update_user_id IS 'The id of the user that updated the action type entry.';


--
-- Name: COLUMN action_type_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.action_type_code.update_utc_timestamp IS 'The timestamp when the action type entry was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: age_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.age_code (
    age_code character varying(10) NOT NULL,
    short_description character varying(50) NOT NULL,
    long_description character varying(250),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL
);


--
-- Name: TABLE age_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.age_code IS 'Used to categorize wildlife into age brackets.  For example ADLT = "Adult"';


--
-- Name: COLUMN age_code.age_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.age_code.age_code IS 'A human readable code used to identify an age type.';


--
-- Name: COLUMN age_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.age_code.short_description IS 'The short description of an age type.';


--
-- Name: COLUMN age_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.age_code.long_description IS 'The long description of an age type.';


--
-- Name: COLUMN age_code.display_order; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.age_code.display_order IS 'The order in which the values of the age type should be displayed when presented to a user in a list.';


--
-- Name: COLUMN age_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.age_code.active_ind IS 'A boolean indicator to determine if an age type is active.';


--
-- Name: COLUMN age_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.age_code.create_user_id IS 'The id of the user that created the age type.';


--
-- Name: COLUMN age_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.age_code.create_utc_timestamp IS 'The timestamp when the age type was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN age_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.age_code.update_user_id IS 'The id of the user that updated the age type.';


--
-- Name: COLUMN age_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.age_code.update_utc_timestamp IS 'The timestamp when the age type was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: assessment; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.assessment (
    assessment_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    complaint_outcome_guid uuid NOT NULL,
    outcome_agency_code character varying(10) NOT NULL,
    inaction_reason_code character varying(10),
    action_not_required_ind boolean,
    complainant_contacted_ind boolean,
    attended_ind boolean,
    case_location_code character varying(10),
    case_conflict_history_code character varying(10),
    case_threat_level_code character varying(10),
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: assessment_h; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.assessment_h (
    h_assessment_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: authorization_permit; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.authorization_permit (
    authorization_permit_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    complaint_outcome_guid uuid NOT NULL,
    authorization_permit_id character varying(50) NOT NULL,
    active_ind boolean DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE authorization_permit; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.authorization_permit IS 'Contains the authroized site id for the Authroization Outcome';


--
-- Name: COLUMN authorization_permit.authorization_permit_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.authorization_permit.authorization_permit_guid IS 'System generated unique key for an authorized_permit record';


--
-- Name: COLUMN authorization_permit.complaint_outcome_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.authorization_permit.complaint_outcome_guid IS 'System generated unique key for a case.  This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN authorization_permit.authorization_permit_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.authorization_permit.authorization_permit_id IS 'The value used for an authorized site id';


--
-- Name: COLUMN authorization_permit.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.authorization_permit.active_ind IS 'A boolean indicator to determine if the has been soft deleted.';


--
-- Name: COLUMN authorization_permit.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.authorization_permit.create_user_id IS 'The id of the user that created the authroized site id.';


--
-- Name: COLUMN authorization_permit.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.authorization_permit.create_utc_timestamp IS 'The timestamp when the authroized site id was created. The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN authorization_permit.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.authorization_permit.update_user_id IS 'The id of the user that updated the authroized site id';


--
-- Name: COLUMN authorization_permit.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.authorization_permit.update_utc_timestamp IS 'The timestamp when the authroized site id was updated. The timestamp is stored in UTC with no Offset.';


--
-- Name: authorization_permit_h; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.authorization_permit_h (
    h_authorization_permit_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: TABLE authorization_permit_h; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.authorization_permit_h IS 'History table for authorization_permit table';


--
-- Name: COLUMN authorization_permit_h.h_authorization_permit_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.authorization_permit_h.h_authorization_permit_guid IS 'System generated unique key for authorization permit history. This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN authorization_permit_h.target_row_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.authorization_permit_h.target_row_id IS 'The unique key for the authorization permit that has been created or modified.';


--
-- Name: COLUMN authorization_permit_h.operation_type; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.authorization_permit_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN authorization_permit_h.operation_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.authorization_permit_h.operation_user_id IS 'The id of the user that created or modified the data in the authorization permit table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN authorization_permit_h.operation_executed_at; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.authorization_permit_h.operation_executed_at IS 'The timestamp when the data in the authorization permit table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN authorization_permit_h.data_after_executed_operation; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.authorization_permit_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


--
-- Name: case_location_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.case_location_code (
    case_location_code character varying(10) NOT NULL,
    short_description character varying(50),
    long_description character varying(250),
    display_order integer,
    active_ind boolean,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE case_location_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.case_location_code IS 'Contains the list of location types a user can select to indicate that where they take an action on a case. Values are Organization specific.';


--
-- Name: COLUMN case_location_code.case_location_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.case_location_code.case_location_code IS 'A human readable code used to identify a location type.';


--
-- Name: COLUMN case_location_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.case_location_code.short_description IS 'The short description of the location type where the case was taken.';


--
-- Name: COLUMN case_location_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.case_location_code.long_description IS 'The long description of the location type where the case was taken.';


--
-- Name: COLUMN case_location_code.display_order; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.case_location_code.display_order IS 'The order in which the values of the location type should be displayed when presented to a user in a list.';


--
-- Name: COLUMN case_location_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.case_location_code.active_ind IS 'A boolean indicator to determine if the location type is active.';


--
-- Name: COLUMN case_location_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.case_location_code.create_user_id IS 'The id of the user that created the location type.';


--
-- Name: COLUMN case_location_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.case_location_code.create_utc_timestamp IS 'The timestamp when the location type was created. The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN case_location_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.case_location_code.update_user_id IS 'The id of the user that updated the location type.';


--
-- Name: COLUMN case_location_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.case_location_code.update_utc_timestamp IS 'The timestamp when the location type was updated. The timestamp is stored in UTC with no Offset.';


--
-- Name: case_note; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.case_note (
    case_note_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    complaint_outcome_guid uuid NOT NULL,
    case_note text NOT NULL,
    active_ind boolean DEFAULT true NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    outcome_agency_code character varying(10) NOT NULL
);


--
-- Name: COLUMN case_note.case_note_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.case_note.case_note_guid IS 'System generated unique key for a case note.';


--
-- Name: COLUMN case_note.complaint_outcome_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.case_note.complaint_outcome_guid IS 'System generated unique key for a case.  This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN case_note.case_note; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.case_note.case_note IS 'The textual content or description of the note.';


--
-- Name: COLUMN case_note.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.case_note.active_ind IS 'Indicates whether the note is active (true) or inactive (false).';


--
-- Name: COLUMN case_note.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.case_note.create_user_id IS 'The identifier (e.g., username) of the user who created the entry.';


--
-- Name: COLUMN case_note.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.case_note.create_utc_timestamp IS 'The date and time (UTC) when the entry was created.';


--
-- Name: COLUMN case_note.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.case_note.update_user_id IS 'The identifier (e.g., username) of the user who last updated the entry.';


--
-- Name: COLUMN case_note.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.case_note.update_utc_timestamp IS 'The date and time (UTC) when the entry was last updated.';


--
-- Name: COLUMN case_note.outcome_agency_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.case_note.outcome_agency_code IS 'The agency that recorded these actions.';


--
-- Name: complaint_outcome; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.complaint_outcome (
    complaint_outcome_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    owned_by_agency_code character varying(10) NOT NULL,
    review_required_ind boolean,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    complaint_identifier character varying(20)
);


--
-- Name: TABLE complaint_outcome; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.complaint_outcome IS 'The central entity of the case management system.   ';


--
-- Name: COLUMN complaint_outcome.complaint_outcome_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.complaint_outcome.complaint_outcome_guid IS 'System generated unique key for a case.  This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN complaint_outcome.owned_by_agency_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.complaint_outcome.owned_by_agency_code IS 'A human readable code used to identify the agency that owns this case.';


--
-- Name: COLUMN complaint_outcome.review_required_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.complaint_outcome.review_required_ind IS 'A flag to indicate that a further review of the file by a supervisor is required.';


--
-- Name: COLUMN complaint_outcome.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.complaint_outcome.create_user_id IS 'The id of the user that created the case.';


--
-- Name: COLUMN complaint_outcome.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.complaint_outcome.create_utc_timestamp IS 'The timestamp when the case was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN complaint_outcome.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.complaint_outcome.update_user_id IS 'The id of the user that updated the case.';


--
-- Name: COLUMN complaint_outcome.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.complaint_outcome.update_utc_timestamp IS 'The timestamp when the case was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: complaint_outcome_h; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.complaint_outcome_h (
    h_complaint_outcome_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: TABLE complaint_outcome_h; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.complaint_outcome_h IS 'History table for case_file table';


--
-- Name: COLUMN complaint_outcome_h.h_complaint_outcome_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.complaint_outcome_h.h_complaint_outcome_guid IS 'System generated unique key for case history. This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN complaint_outcome_h.target_row_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.complaint_outcome_h.target_row_id IS 'The unique key for the case that has been created or modified.';


--
-- Name: COLUMN complaint_outcome_h.operation_type; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.complaint_outcome_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN complaint_outcome_h.operation_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.complaint_outcome_h.operation_user_id IS 'The id of the user that created or modified the data in the case table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN complaint_outcome_h.operation_executed_at; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.complaint_outcome_h.operation_executed_at IS 'The timestamp when the data in the case table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN complaint_outcome_h.data_after_executed_operation; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.complaint_outcome_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


--
-- Name: configuration; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.configuration (
    configuration_code character varying(10) NOT NULL,
    configuration_value character varying(250) NOT NULL,
    long_description character varying(250) NOT NULL,
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE configuration; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.configuration IS 'The configuration table is used to store constants which are expected to change over the lifecycle of the application, or have different values in different environments.   By making changes to in the database the behaviour of the application can be altered without requiring a full deployment.';


--
-- Name: COLUMN configuration.configuration_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.configuration.configuration_code IS 'A human readable code used to identify an configuration entry.';


--
-- Name: COLUMN configuration.configuration_value; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.configuration.configuration_value IS 'The value of the configuration entry.';


--
-- Name: COLUMN configuration.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.configuration.long_description IS 'The long description of the configuration entry.';


--
-- Name: COLUMN configuration.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.configuration.active_ind IS 'A boolean indicator to determine if the configuration_entry is active.';


--
-- Name: COLUMN configuration.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.configuration.create_user_id IS 'The id of the user that created the configuration entry.';


--
-- Name: COLUMN configuration.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.configuration.create_utc_timestamp IS 'The timestamp when the configuration entry was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN configuration.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.configuration.update_user_id IS 'The id of the user that updated the configuration entry.';


--
-- Name: COLUMN configuration.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.configuration.update_utc_timestamp IS 'The timestamp when the configuration entry was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: configuration_h; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.configuration_h (
    h_configuration_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id character varying(10) NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: TABLE configuration_h; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.configuration_h IS 'History table for configuration table';


--
-- Name: COLUMN configuration_h.h_configuration_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.configuration_h.h_configuration_guid IS 'System generated unique key for configuration history. This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN configuration_h.target_row_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.configuration_h.target_row_id IS 'The unique key for the configuration that has been created or modified.';


--
-- Name: COLUMN configuration_h.operation_type; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.configuration_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN configuration_h.operation_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.configuration_h.operation_user_id IS 'The id of the user that created or modified the data in the configuration table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN configuration_h.operation_executed_at; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.configuration_h.operation_executed_at IS 'The timestamp when the data in the configuration table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN configuration_h.data_after_executed_operation; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.configuration_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


--
-- Name: conflict_history_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.conflict_history_code (
    conflict_history_code character varying(10) NOT NULL,
    short_description character varying(50) NOT NULL,
    long_description character varying(250),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL
);


--
-- Name: TABLE conflict_history_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.conflict_history_code IS 'A classification on the frequence that the target wildlife has previously had a history of human conflict.  For example L = "Low"';


--
-- Name: COLUMN conflict_history_code.conflict_history_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.conflict_history_code.conflict_history_code IS 'A human readable code used to identify a conflict history type.';


--
-- Name: COLUMN conflict_history_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.conflict_history_code.short_description IS 'The short description of a conflict history type.';


--
-- Name: COLUMN conflict_history_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.conflict_history_code.long_description IS 'The long description of a conflict history type.';


--
-- Name: COLUMN conflict_history_code.display_order; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.conflict_history_code.display_order IS 'The order in which the values of the conflict history type should be displayed when presented to a user in a list.';


--
-- Name: COLUMN conflict_history_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.conflict_history_code.active_ind IS 'A boolean indicator to determine if a conflict history type is active.';


--
-- Name: COLUMN conflict_history_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.conflict_history_code.create_user_id IS 'The id of the user that created the conflict history type.';


--
-- Name: COLUMN conflict_history_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.conflict_history_code.create_utc_timestamp IS 'The timestamp when the conflict history type was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN conflict_history_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.conflict_history_code.update_user_id IS 'The id of the user that updated the conflict history type.';


--
-- Name: COLUMN conflict_history_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.conflict_history_code.update_utc_timestamp IS 'The timestamp when the conflict history type was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: decision; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.decision (
    decision_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    complaint_outcome_guid uuid NOT NULL,
    schedule_sector_xref_guid uuid NOT NULL,
    discharge_code character varying(10) NOT NULL,
    rationale_text character varying(4000),
    inspection_number integer,
    outcome_agency_code character varying(10),
    non_compliance_decision_matrix_code character varying(10),
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL,
    ipm_auth_category_code character varying(10)
);


--
-- Name: TABLE decision; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.decision IS 'As a CEEB Compliance Coordinator or Officer, I need to be able to capture decision information to ensure that all information necessary in the decision making process can be captured in the complaint.';


--
-- Name: COLUMN decision.decision_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.decision.decision_guid IS 'Unique identifier for the decision';


--
-- Name: COLUMN decision.complaint_outcome_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.decision.complaint_outcome_guid IS 'Assoiciates the decision record to an existing case file';


--
-- Name: COLUMN decision.schedule_sector_xref_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.decision.schedule_sector_xref_guid IS 'Defines the combination of a WDR_SCHEDULE_CODE and a SECTOR_CATEGORY_CODE';


--
-- Name: COLUMN decision.discharge_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.decision.discharge_code IS 'The discharge code related to a decision';


--
-- Name: COLUMN decision.rationale_text; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.decision.rationale_text IS 'The rationale code related to a CEEB decision';


--
-- Name: COLUMN decision.inspection_number; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.decision.inspection_number IS 'The NRIS inspection number for a CEEB decision';


--
-- Name: COLUMN decision.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.decision.active_ind IS 'A boolean indicator to determine if the case management action is active.';


--
-- Name: COLUMN decision.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.decision.create_user_id IS 'The id of the user that created the case management action.';


--
-- Name: COLUMN decision.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.decision.create_utc_timestamp IS 'The timestamp when the case management action was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN decision.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.decision.update_user_id IS 'The id of the user that updated the case management action.';


--
-- Name: COLUMN decision.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.decision.update_utc_timestamp IS 'The timestamp when the case management action was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: decision_h; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.decision_h (
    h_decision_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: discharge_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.discharge_code (
    discharge_code character varying(10) NOT NULL,
    short_description character varying(50) NOT NULL,
    long_description character varying(250),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL
);


--
-- Name: TABLE discharge_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.discharge_code IS 'Contains a list of all possible discharge codes for a CEEB decision';


--
-- Name: COLUMN discharge_code.discharge_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.discharge_code.discharge_code IS 'A human readable code used to identify a discharge code.';


--
-- Name: COLUMN discharge_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.discharge_code.short_description IS 'The short description of a case management discharge_code.';


--
-- Name: COLUMN discharge_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.discharge_code.long_description IS 'The long description of a case management discharge_code.';


--
-- Name: COLUMN discharge_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.discharge_code.active_ind IS 'A boolean indicator to determine if the case management discharge_code is active.';


--
-- Name: COLUMN discharge_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.discharge_code.create_user_id IS 'The id of the user that created the case management discharge_code.';


--
-- Name: COLUMN discharge_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.discharge_code.create_utc_timestamp IS 'The timestamp when the case management discharge_code was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN discharge_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.discharge_code.update_user_id IS 'The id of the user that updated the case management discharge_code.';


--
-- Name: COLUMN discharge_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.discharge_code.update_utc_timestamp IS 'The timestamp when the case management discharge_code was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: drug_administered; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.drug_administered (
    drug_administered_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    wildlife_guid uuid NOT NULL,
    drug_code character varying(10) NOT NULL,
    drug_method_code character varying(10) NOT NULL,
    drug_remaining_outcome_code character varying(10),
    vial_number character varying(50) NOT NULL,
    drug_used_amount character varying(50) NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL,
    active_ind boolean,
    additional_comments_text text
);


--
-- Name: TABLE drug_administered; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.drug_administered IS 'While an officer is responding to a LEAD they may need to record that a WILDLIFE had a DRUG_ADMINISTERED.  This table keeps track of the type and amount of drugs administered, along with what happened to any remaining drug that was not used.';


--
-- Name: COLUMN drug_administered.drug_administered_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_administered.drug_administered_guid IS 'System generated unique key for an drug that was administered to an animal.  This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN drug_administered.wildlife_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_administered.wildlife_guid IS 'System generated unique key for an animal.  This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN drug_administered.drug_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_administered.drug_code IS 'A human readable code used to identify a drug type.';


--
-- Name: COLUMN drug_administered.drug_method_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_administered.drug_method_code IS 'A human readable code used to identify a drug injection method type.';


--
-- Name: COLUMN drug_administered.drug_remaining_outcome_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_administered.drug_remaining_outcome_code IS 'A human readable code used to identify a remaining drug outcome type.';


--
-- Name: COLUMN drug_administered.vial_number; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_administered.vial_number IS 'A vial number that relates to a seperate drug inventory system.';


--
-- Name: COLUMN drug_administered.drug_used_amount; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_administered.drug_used_amount IS 'The amount of drug used';


--
-- Name: COLUMN drug_administered.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_administered.create_user_id IS 'The id of the user that created the drug_administered record.';


--
-- Name: COLUMN drug_administered.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_administered.create_utc_timestamp IS 'The timestamp when the drug_administered record was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN drug_administered.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_administered.update_user_id IS 'The id of the user that updated the drug_administered record.';


--
-- Name: COLUMN drug_administered.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_administered.update_utc_timestamp IS 'The timestamp when the drug_administered record was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN drug_administered.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_administered.active_ind IS 'A boolean indicator to determine if the drug_administered record is active.';


--
-- Name: COLUMN drug_administered.additional_comments_text; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_administered.additional_comments_text IS 'Includes comments on immobilization outcomes, any adverse reactions, and drug storage or discarding.';


--
-- Name: drug_administered_h; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.drug_administered_h (
    h_drug_administered_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: TABLE drug_administered_h; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.drug_administered_h IS 'History table for case_file table';


--
-- Name: COLUMN drug_administered_h.h_drug_administered_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_administered_h.h_drug_administered_guid IS 'System generated unique key for case history. This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN drug_administered_h.target_row_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_administered_h.target_row_id IS 'The unique key for the case that has been created or modified.';


--
-- Name: COLUMN drug_administered_h.operation_type; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_administered_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN drug_administered_h.operation_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_administered_h.operation_user_id IS 'The id of the user that created or modified the data in the case table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN drug_administered_h.operation_executed_at; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_administered_h.operation_executed_at IS 'The timestamp when the data in the case table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN drug_administered_h.data_after_executed_operation; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_administered_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


--
-- Name: drug_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.drug_code (
    drug_code character varying(10) NOT NULL,
    short_description character varying(50) NOT NULL,
    long_description character varying(250),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL
);


--
-- Name: TABLE drug_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.drug_code IS 'Contains the list of drugs that could be administered to wildlife.  For example ATPMZ = "Atipamezole"';


--
-- Name: COLUMN drug_code.drug_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_code.drug_code IS 'A human readable code used to identify a drug type.';


--
-- Name: COLUMN drug_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_code.short_description IS 'The short description of a drug type.';


--
-- Name: COLUMN drug_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_code.long_description IS 'The long description of a drug type.';


--
-- Name: COLUMN drug_code.display_order; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_code.display_order IS 'The order in which the values of the drug type should be displayed when presented to a user in a list.';


--
-- Name: COLUMN drug_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_code.active_ind IS 'A boolean indicator to determine if a drug type is active.';


--
-- Name: COLUMN drug_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_code.create_user_id IS 'The id of the user that created the drug type.';


--
-- Name: COLUMN drug_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_code.create_utc_timestamp IS 'The timestamp when the drug type was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN drug_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_code.update_user_id IS 'The id of the user that updated the drug type.';


--
-- Name: COLUMN drug_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_code.update_utc_timestamp IS 'The timestamp when the drug type was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: drug_method_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.drug_method_code (
    drug_method_code character varying(10) NOT NULL,
    short_description character varying(50) NOT NULL,
    long_description character varying(250),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL
);


--
-- Name: TABLE drug_method_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.drug_method_code IS 'Contains the list of drug induction methods types supported by the system.  For example DART = "Dart"';


--
-- Name: COLUMN drug_method_code.drug_method_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_method_code.drug_method_code IS 'A human readable code used to identify a drug injection method type.';


--
-- Name: COLUMN drug_method_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_method_code.short_description IS 'The short description of a drug injection method type.';


--
-- Name: COLUMN drug_method_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_method_code.long_description IS 'The long description of a drug injection method type.';


--
-- Name: COLUMN drug_method_code.display_order; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_method_code.display_order IS 'The order in which the values of the drug injection method type should be displayed when presented to a user in a list.';


--
-- Name: COLUMN drug_method_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_method_code.active_ind IS 'A boolean indicator to determine if a drug injection method type is active.';


--
-- Name: COLUMN drug_method_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_method_code.create_user_id IS 'The id of the user that created the drug injection method type.';


--
-- Name: COLUMN drug_method_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_method_code.create_utc_timestamp IS 'The timestamp when the drug injection method type was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN drug_method_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_method_code.update_user_id IS 'The id of the user that updated the drug injection method type.';


--
-- Name: COLUMN drug_method_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_method_code.update_utc_timestamp IS 'The timestamp when the drug injection method type was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: drug_remaining_outcome_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.drug_remaining_outcome_code (
    drug_remaining_outcome_code character varying(10) NOT NULL,
    short_description character varying(50) NOT NULL,
    long_description character varying(250),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL
);


--
-- Name: TABLE drug_remaining_outcome_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.drug_remaining_outcome_code IS 'After a drug has been induced to an animal, the fate of the remaining drug in the vial is recorded.   This table contains a list of types supported by the system.  For example DISC = "Discard"';


--
-- Name: COLUMN drug_remaining_outcome_code.drug_remaining_outcome_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_remaining_outcome_code.drug_remaining_outcome_code IS 'A human readable code used to identify a remaining drug outcome type.';


--
-- Name: COLUMN drug_remaining_outcome_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_remaining_outcome_code.short_description IS 'The short description of a remaining drug outcome type.';


--
-- Name: COLUMN drug_remaining_outcome_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_remaining_outcome_code.long_description IS 'The long description of a remaining drug outcome type.';


--
-- Name: COLUMN drug_remaining_outcome_code.display_order; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_remaining_outcome_code.display_order IS 'The order in which the values of the remaining drug outcome type should be displayed when presented to a user in a list.';


--
-- Name: COLUMN drug_remaining_outcome_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_remaining_outcome_code.active_ind IS 'A boolean indicator to determine if a remaining drug outcome type is active.';


--
-- Name: COLUMN drug_remaining_outcome_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_remaining_outcome_code.create_user_id IS 'The id of the user that created the remaining drug outcome type.';


--
-- Name: COLUMN drug_remaining_outcome_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_remaining_outcome_code.create_utc_timestamp IS 'The timestamp when the remaining drug outcome type was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN drug_remaining_outcome_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_remaining_outcome_code.update_user_id IS 'The id of the user that updated the remaining drug outcome type.';


--
-- Name: COLUMN drug_remaining_outcome_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.drug_remaining_outcome_code.update_utc_timestamp IS 'The timestamp when the remaining drug outcome type was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: ear_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.ear_code (
    ear_code character varying(10) NOT NULL,
    short_description character varying(50) NOT NULL,
    long_description character varying(250),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL
);


--
-- Name: TABLE ear_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.ear_code IS 'Indicates which ear an identification tag is present on.  For example L = "Left"';


--
-- Name: COLUMN ear_code.ear_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_code.ear_code IS 'A human readable code used to identify an ear type.';


--
-- Name: COLUMN ear_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_code.short_description IS 'The short description of an ear type.';


--
-- Name: COLUMN ear_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_code.long_description IS 'The long description of an ear type.';


--
-- Name: COLUMN ear_code.display_order; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_code.display_order IS 'The order in which the values of the ear type should be displayed when presented to a user in a list.';


--
-- Name: COLUMN ear_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_code.active_ind IS 'A boolean indicator to determine if an ear type is active.';


--
-- Name: COLUMN ear_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_code.create_user_id IS 'The id of the user that created the ear type.';


--
-- Name: COLUMN ear_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_code.create_utc_timestamp IS 'The timestamp when the ear type was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN ear_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_code.update_user_id IS 'The id of the user that updated the ear type.';


--
-- Name: COLUMN ear_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_code.update_utc_timestamp IS 'The timestamp when the ear type was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: ear_tag; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.ear_tag (
    ear_tag_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    wildlife_guid uuid NOT NULL,
    ear_code character varying(10) NOT NULL,
    ear_tag_identifier character varying(10) NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL,
    active_ind boolean
);


--
-- Name: TABLE ear_tag; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.ear_tag IS 'an EAR_TAG is used to identify a specific WILDLIFE allowing the animal to be tracked over time.';


--
-- Name: COLUMN ear_tag.ear_tag_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_tag.ear_tag_guid IS 'System generated unique key for an ear tag.  This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN ear_tag.wildlife_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_tag.wildlife_guid IS 'System generated unique key for an animal.  This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN ear_tag.ear_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_tag.ear_code IS 'A human readable code used to identify an ear type.';


--
-- Name: COLUMN ear_tag.ear_tag_identifier; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_tag.ear_tag_identifier IS 'An identifier used to label an animal, not used as a natural key as they are not guaranteed to be unique';


--
-- Name: COLUMN ear_tag.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_tag.create_user_id IS 'The id of the user that created the ear_tag record.';


--
-- Name: COLUMN ear_tag.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_tag.create_utc_timestamp IS 'The timestamp when the ear_tag record was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN ear_tag.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_tag.update_user_id IS 'The id of the user that updated the ear_tag record.';


--
-- Name: COLUMN ear_tag.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_tag.update_utc_timestamp IS 'The timestamp when the ear_tag record was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN ear_tag.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_tag.active_ind IS 'A boolean indicator to determine if the ear_tag record is active.';


--
-- Name: ear_tag_h; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.ear_tag_h (
    h_ear_tag_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: TABLE ear_tag_h; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.ear_tag_h IS 'History table for case_file table';


--
-- Name: COLUMN ear_tag_h.h_ear_tag_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_tag_h.h_ear_tag_guid IS 'System generated unique key for case history. This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN ear_tag_h.target_row_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_tag_h.target_row_id IS 'The unique key for the case that has been created or modified.';


--
-- Name: COLUMN ear_tag_h.operation_type; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_tag_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN ear_tag_h.operation_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_tag_h.operation_user_id IS 'The id of the user that created or modified the data in the case table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN ear_tag_h.operation_executed_at; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_tag_h.operation_executed_at IS 'The timestamp when the data in the case table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN ear_tag_h.data_after_executed_operation; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ear_tag_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


--
-- Name: equipment; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.equipment (
    equipment_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    equipment_code character varying(10),
    equipment_location_desc character varying(120),
    equipment_geometry_point public.geometry,
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL,
    was_animal_captured character(1) DEFAULT 'U'::bpchar NOT NULL,
    quantity smallint
);


--
-- Name: TABLE equipment; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.equipment IS 'Represents a piece of physical equipment that has been deployed in support of the case.   Contains information about where and when the equipment was deployed.';


--
-- Name: COLUMN equipment.equipment_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment.equipment_guid IS 'System generated unique key for a piece of equipment.  This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN equipment.equipment_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment.equipment_code IS 'A human readable code used to identify a piece of equipment';


--
-- Name: COLUMN equipment.equipment_location_desc; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment.equipment_location_desc IS 'Free form text describing the location of the equipment.   Usually (but not always) an address.';


--
-- Name: COLUMN equipment.equipment_geometry_point; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment.equipment_geometry_point IS 'The closest approximation to where the equipment is deployed.   Stored as a geometric point using the EPSG:3005 Projected Coordinate System (BC Albers)';


--
-- Name: COLUMN equipment.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment.active_ind IS 'A boolean indicator to determine if the equipment record is active and should be displayed in the application.';


--
-- Name: COLUMN equipment.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment.create_user_id IS 'The id of the user that created the equipment record.';


--
-- Name: COLUMN equipment.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment.create_utc_timestamp IS 'The timestamp when the equipment record was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN equipment.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment.update_user_id IS 'The id of the user that updated the equipment record.';


--
-- Name: COLUMN equipment.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment.update_utc_timestamp IS 'The timestamp when the equipment record was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN equipment.was_animal_captured; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment.was_animal_captured IS 'Indicates if an animal was captured by the EQUIPMENT. Values are limited to ''Y'' (Yes) ''N'' (No) and ''U'' (Unknown - Not Specified Yet). The default is ''U''';


--
-- Name: COLUMN equipment.quantity; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment.quantity IS 'Indicates the number of EQUIPMENT used. Values should be a positive integer or null if not applicable. ';


--
-- Name: equipment_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.equipment_code (
    equipment_code character varying(10) NOT NULL,
    short_description character varying(50) NOT NULL,
    long_description character varying(250),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL,
    is_trap_ind boolean DEFAULT true NOT NULL,
    has_quantity_ind boolean DEFAULT false NOT NULL
);


--
-- Name: TABLE equipment_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.equipment_code IS 'Used to track pieces of equipment that could be deployed out in the field.  For example BRSNR = "Bear Snare"';


--
-- Name: COLUMN equipment_code.equipment_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_code.equipment_code IS 'A human readable code used to identify an equipment type.';


--
-- Name: COLUMN equipment_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_code.short_description IS 'The short description of an equipment type.';


--
-- Name: COLUMN equipment_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_code.long_description IS 'The long description of an equipment type.';


--
-- Name: COLUMN equipment_code.display_order; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_code.display_order IS 'The order in which the values of the equipment type should be displayed when presented to a user in a list.';


--
-- Name: COLUMN equipment_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_code.active_ind IS 'A boolean indicator to determine if an equipment type is active.';


--
-- Name: COLUMN equipment_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_code.create_user_id IS 'The id of the user that created the equipment type.';


--
-- Name: COLUMN equipment_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_code.create_utc_timestamp IS 'The timestamp when the equipment type was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN equipment_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_code.update_user_id IS 'The id of the user that updated the equipment type.';


--
-- Name: COLUMN equipment_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_code.update_utc_timestamp IS 'The timestamp when the equipment type was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN equipment_code.is_trap_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_code.is_trap_ind IS 'Indicates if the EQUIPMENT_CODE value represents a trap.   Default to ''true''.   For EQUIPMENT_CODE values such as Signage or Trail cameras the value is ''false''';


--
-- Name: COLUMN equipment_code.has_quantity_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_code.has_quantity_ind IS 'Indicates if the type of equipment allows a quantity to be speciofied.   Default to ''false''. ';


--
-- Name: equipment_h; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.equipment_h (
    h_equipment_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: TABLE equipment_h; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.equipment_h IS 'History table for equipment table';


--
-- Name: COLUMN equipment_h.h_equipment_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_h.h_equipment_guid IS 'System generated unique key for equipment history. This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN equipment_h.target_row_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_h.target_row_id IS 'The unique key for the equipment that has been created or modified.';


--
-- Name: COLUMN equipment_h.operation_type; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN equipment_h.operation_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_h.operation_user_id IS 'The id of the user that created or modified the data in the equipment table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN equipment_h.operation_executed_at; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_h.operation_executed_at IS 'The timestamp when the data in the equipment table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN equipment_h.data_after_executed_operation; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


--
-- Name: equipment_status_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.equipment_status_code (
    equipment_status_code character varying(10) NOT NULL,
    short_description character varying(50),
    long_description character varying(250),
    display_order integer,
    active_ind boolean DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE equipment_status_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.equipment_status_code IS 'Contains the list of equipment status a user can select for filtering.';


--
-- Name: COLUMN equipment_status_code.equipment_status_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_status_code.equipment_status_code IS 'A human readable code used to identify an equipment status.';


--
-- Name: COLUMN equipment_status_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_status_code.short_description IS 'The short description of an equipment status.';


--
-- Name: COLUMN equipment_status_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_status_code.long_description IS 'The long description of an equipment status.';


--
-- Name: COLUMN equipment_status_code.display_order; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_status_code.display_order IS 'The order in which the values of the equipment status should be displayed when presented to a user in a list.';


--
-- Name: COLUMN equipment_status_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_status_code.active_ind IS 'A boolean indicator to determine if the equipment status option is active.';


--
-- Name: COLUMN equipment_status_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_status_code.create_user_id IS 'The id of the user that created the equipment status.';


--
-- Name: COLUMN equipment_status_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_status_code.create_utc_timestamp IS 'The timestamp when the equipment status was created. The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN equipment_status_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_status_code.update_user_id IS 'The id of the user that updated the equipment status.';


--
-- Name: COLUMN equipment_status_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.equipment_status_code.update_utc_timestamp IS 'The timestamp when the equipment status was updated. The timestamp is stored in UTC with no Offset.';


--
-- Name: hwcr_outcome_actioned_by_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.hwcr_outcome_actioned_by_code (
    hwcr_outcome_actioned_by_code character varying(10) NOT NULL,
    outcome_agency_code character varying(10),
    short_description character varying(50) NOT NULL,
    long_description character varying(250),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL
);


--
-- Name: TABLE hwcr_outcome_actioned_by_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.hwcr_outcome_actioned_by_code IS 'Indicates the party responsible for carrying out the action in a HWC outcome.';


--
-- Name: COLUMN hwcr_outcome_actioned_by_code.hwcr_outcome_actioned_by_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.hwcr_outcome_actioned_by_code.hwcr_outcome_actioned_by_code IS 'A human readable code used to identify who carried out an HWCR outcome.';


--
-- Name: COLUMN hwcr_outcome_actioned_by_code.outcome_agency_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.hwcr_outcome_actioned_by_code.outcome_agency_code IS 'A reference to the agency in this system if the party is a NatCom user such as "COS".';


--
-- Name: COLUMN hwcr_outcome_actioned_by_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.hwcr_outcome_actioned_by_code.short_description IS 'The short description of an HWCR outcome actioned by code.';


--
-- Name: COLUMN hwcr_outcome_actioned_by_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.hwcr_outcome_actioned_by_code.long_description IS 'The long description of an HWCR outcome actioned by code.';


--
-- Name: COLUMN hwcr_outcome_actioned_by_code.display_order; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.hwcr_outcome_actioned_by_code.display_order IS 'The order in which the values of the HWCR outcome actioned by code should be displayed when presented to a user in a list.';


--
-- Name: COLUMN hwcr_outcome_actioned_by_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.hwcr_outcome_actioned_by_code.active_ind IS 'A boolean indicator to determine if an HWCR outcome actioned by code is active.';


--
-- Name: COLUMN hwcr_outcome_actioned_by_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.hwcr_outcome_actioned_by_code.create_user_id IS 'The id of the user that created the HWCR outcome actioned by code.';


--
-- Name: COLUMN hwcr_outcome_actioned_by_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.hwcr_outcome_actioned_by_code.create_utc_timestamp IS 'The timestamp when the HWCR outcome actioned by code was created. The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN hwcr_outcome_actioned_by_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.hwcr_outcome_actioned_by_code.update_user_id IS 'The id of the user that updated the HWCR outcome actioned by code.';


--
-- Name: COLUMN hwcr_outcome_actioned_by_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.hwcr_outcome_actioned_by_code.update_utc_timestamp IS 'The timestamp when the HWCR outcome actioned by code was updated. The timestamp is stored in UTC with no Offset.';


--
-- Name: hwcr_outcome_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.hwcr_outcome_code (
    hwcr_outcome_code character varying(10) NOT NULL,
    short_description character varying(50) NOT NULL,
    long_description character varying(250),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL
);


--
-- Name: TABLE hwcr_outcome_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.hwcr_outcome_code IS 'Indicates the final outcome for an animal as a result of an HWC.  For example DESTRYCOS = "Destroyed by COS"';


--
-- Name: COLUMN hwcr_outcome_code.hwcr_outcome_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.hwcr_outcome_code.hwcr_outcome_code IS 'A human readable code used to identify an HWCR outcome type.';


--
-- Name: COLUMN hwcr_outcome_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.hwcr_outcome_code.short_description IS 'The short description of an HWCR outcome type.';


--
-- Name: COLUMN hwcr_outcome_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.hwcr_outcome_code.long_description IS 'The long description of an HWCR outcome type.';


--
-- Name: COLUMN hwcr_outcome_code.display_order; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.hwcr_outcome_code.display_order IS 'The order in which the values of the HWCR outcome  type should be displayed when presented to a user in a list.';


--
-- Name: COLUMN hwcr_outcome_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.hwcr_outcome_code.active_ind IS 'A boolean indicator to determine if an HWCR outcome type is active.';


--
-- Name: COLUMN hwcr_outcome_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.hwcr_outcome_code.create_user_id IS 'The id of the user that created the HWCR outcome type.';


--
-- Name: COLUMN hwcr_outcome_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.hwcr_outcome_code.create_utc_timestamp IS 'The timestamp when the HWCR outcome type was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN hwcr_outcome_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.hwcr_outcome_code.update_user_id IS 'The id of the user that updated the HWCR outcome type.';


--
-- Name: COLUMN hwcr_outcome_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.hwcr_outcome_code.update_utc_timestamp IS 'The timestamp when the HWCR outcome type was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: inaction_reason_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.inaction_reason_code (
    inaction_reason_code character varying(10) NOT NULL,
    outcome_agency_code character varying(10) NOT NULL,
    short_description character varying(50),
    long_description character varying(250),
    display_order integer,
    active_ind boolean,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE inaction_reason_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.inaction_reason_code IS 'Contains the list of available reasons a user can select to indicate that the reason why they did not take any action on a case. Values are Organization specific.';


--
-- Name: COLUMN inaction_reason_code.inaction_reason_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.inaction_reason_code.inaction_reason_code IS 'A human readable code used to identify a reason why no action on the case was taken.';


--
-- Name: COLUMN inaction_reason_code.outcome_agency_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.inaction_reason_code.outcome_agency_code IS 'A human readable code used to identify an agency.';


--
-- Name: COLUMN inaction_reason_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.inaction_reason_code.short_description IS 'The short description of the reason why no action on the case was taken.';


--
-- Name: COLUMN inaction_reason_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.inaction_reason_code.long_description IS 'The long description of the reason why no action on the case was taken.';


--
-- Name: COLUMN inaction_reason_code.display_order; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.inaction_reason_code.display_order IS 'The order in which the values of the reasons why no action on the case was taken should be displayed when presented to a user in a list.';


--
-- Name: COLUMN inaction_reason_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.inaction_reason_code.active_ind IS 'A boolean indicator to determine if the reason why no action on the case was taken is active.';


--
-- Name: COLUMN inaction_reason_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.inaction_reason_code.create_user_id IS 'The id of the user that created the reason why no action on the case was taken.';


--
-- Name: COLUMN inaction_reason_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.inaction_reason_code.create_utc_timestamp IS 'The timestamp when the reason why no action on the case was taken was created. The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN inaction_reason_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.inaction_reason_code.update_user_id IS 'The id of the user that updated the reason why no action on the case was taken.';


--
-- Name: COLUMN inaction_reason_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.inaction_reason_code.update_utc_timestamp IS 'The timestamp when the reason why no action on the case was taken was updated. The timestamp is stored in UTC with no Offset.';


--
-- Name: ipm_auth_category_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.ipm_auth_category_code (
    ipm_auth_category_code character varying(10) NOT NULL,
    short_description character varying(50),
    long_description character varying(250),
    display_order integer,
    active_ind boolean DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE ipm_auth_category_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.ipm_auth_category_code IS 'Contains the list of IPM authorization categories a user can select to indicate the context in which a party is authorized to use pesticides.';


--
-- Name: COLUMN ipm_auth_category_code.ipm_auth_category_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ipm_auth_category_code.ipm_auth_category_code IS 'A human readable code used to identify a IPM authorization category.';


--
-- Name: COLUMN ipm_auth_category_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ipm_auth_category_code.short_description IS 'The short description of the IPM authorization category where the case was taken.';


--
-- Name: COLUMN ipm_auth_category_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ipm_auth_category_code.long_description IS 'The long description of the IPM authorization category where the case was taken.';


--
-- Name: COLUMN ipm_auth_category_code.display_order; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ipm_auth_category_code.display_order IS 'The order in which the values of the IPM authorization category should be displayed when presented to a user in a list.';


--
-- Name: COLUMN ipm_auth_category_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ipm_auth_category_code.active_ind IS 'A boolean indicator to determine if the IPM authorization category is active.';


--
-- Name: COLUMN ipm_auth_category_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ipm_auth_category_code.create_user_id IS 'The id of the user that created the IPM authorization category.';


--
-- Name: COLUMN ipm_auth_category_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ipm_auth_category_code.create_utc_timestamp IS 'The timestamp when the IPM authorization category was created. The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN ipm_auth_category_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ipm_auth_category_code.update_user_id IS 'The id of the user that updated the IPM authorization category.';


--
-- Name: COLUMN ipm_auth_category_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.ipm_auth_category_code.update_utc_timestamp IS 'The timestamp when the IPM authorization category was updated. The timestamp is stored in UTC with no Offset.';


--
-- Name: non_compliance_decision_matrix_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.non_compliance_decision_matrix_code (
    non_compliance_decision_matrix_code character varying(10) NOT NULL,
    short_description character varying(50) NOT NULL,
    long_description character varying(250),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL
);


--
-- Name: TABLE non_compliance_decision_matrix_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.non_compliance_decision_matrix_code IS 'Contains a list of all possible non_compliance_decision_matrix_code codes for a CEEB decision';


--
-- Name: COLUMN non_compliance_decision_matrix_code.non_compliance_decision_matrix_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.non_compliance_decision_matrix_code.non_compliance_decision_matrix_code IS 'A human readable code used to identify a non_compliance_decision_matrix_code code.';


--
-- Name: COLUMN non_compliance_decision_matrix_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.non_compliance_decision_matrix_code.short_description IS 'The short description of a case management non_compliance_decision_matrix_code.';


--
-- Name: COLUMN non_compliance_decision_matrix_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.non_compliance_decision_matrix_code.long_description IS 'The long description of a case management non_compliance_decision_matrix_code.';


--
-- Name: COLUMN non_compliance_decision_matrix_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.non_compliance_decision_matrix_code.active_ind IS 'A boolean indicator to determine if the case management non_compliance_decision_matrix_code is active.';


--
-- Name: COLUMN non_compliance_decision_matrix_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.non_compliance_decision_matrix_code.create_user_id IS 'The id of the user that created the case management non_compliance_decision_matrix_code.';


--
-- Name: COLUMN non_compliance_decision_matrix_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.non_compliance_decision_matrix_code.create_utc_timestamp IS 'The timestamp when the case management non_compliance_decision_matrix_code was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN non_compliance_decision_matrix_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.non_compliance_decision_matrix_code.update_user_id IS 'The id of the user that updated the case management non_compliance_decision_matrix_code.';


--
-- Name: COLUMN non_compliance_decision_matrix_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.non_compliance_decision_matrix_code.update_utc_timestamp IS 'The timestamp when the case management non_compliance_decision_matrix_code was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: outcome_agency_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.outcome_agency_code (
    outcome_agency_code character varying(10) NOT NULL,
    short_description character varying(50),
    long_description character varying(250),
    active_ind boolean,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone,
    display_order integer
);


--
-- Name: TABLE outcome_agency_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.outcome_agency_code IS 'Contains a list of all the organizations that have been onboarded onto the Case Management System. This can be used to restrict some content to organization specific values.';


--
-- Name: COLUMN outcome_agency_code.outcome_agency_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.outcome_agency_code.outcome_agency_code IS 'A human readable code used to identify an agency.';


--
-- Name: COLUMN outcome_agency_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.outcome_agency_code.short_description IS 'The short description of the agency code.';


--
-- Name: COLUMN outcome_agency_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.outcome_agency_code.long_description IS 'The long description of the agency code.';


--
-- Name: COLUMN outcome_agency_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.outcome_agency_code.active_ind IS 'A boolean indicator to determine if the agency code is active.';


--
-- Name: COLUMN outcome_agency_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.outcome_agency_code.create_user_id IS 'The id of the user that created the agency code.';


--
-- Name: COLUMN outcome_agency_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.outcome_agency_code.create_utc_timestamp IS 'The timestamp when the agency was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN outcome_agency_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.outcome_agency_code.update_user_id IS 'The id of the user that updated the agency code.';


--
-- Name: COLUMN outcome_agency_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.outcome_agency_code.update_utc_timestamp IS 'The timestamp when the agency was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN outcome_agency_code.display_order; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.outcome_agency_code.display_order IS 'The order in which the values of the agency should be displayed when presented to a user in a list.';


--
-- Name: prevention_education; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.prevention_education (
    prevention_education_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    complaint_outcome_guid uuid NOT NULL,
    outcome_agency_code character varying(10) NOT NULL,
    active_ind boolean DEFAULT true NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: COLUMN prevention_education.prevention_education_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.prevention_education.prevention_education_guid IS 'System generated unique key prevention education record.';


--
-- Name: COLUMN prevention_education.complaint_outcome_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.prevention_education.complaint_outcome_guid IS 'Foreign key to the case that these actions are for.';


--
-- Name: COLUMN prevention_education.outcome_agency_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.prevention_education.outcome_agency_code IS 'The agency that recorded these actions.';


--
-- Name: COLUMN prevention_education.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.prevention_education.active_ind IS 'Indicates whether the note is active (true) or inactive (false).';


--
-- Name: COLUMN prevention_education.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.prevention_education.create_user_id IS 'The identifier (e.g., username) of the user who created the entry.';


--
-- Name: COLUMN prevention_education.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.prevention_education.create_utc_timestamp IS 'The date and time (UTC) when the entry was created.';


--
-- Name: COLUMN prevention_education.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.prevention_education.update_user_id IS 'The identifier (e.g., username) of the user who last updated the entry.';


--
-- Name: COLUMN prevention_education.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.prevention_education.update_utc_timestamp IS 'The date and time (UTC) when the entry was last updated.';


--
-- Name: schedule_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.schedule_code (
    schedule_code character varying(10) NOT NULL,
    short_description character varying(50) NOT NULL,
    long_description character varying(250),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL
);


--
-- Name: TABLE schedule_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.schedule_code IS 'Contains the list of values for indicating the waste schedule or pesticide sector an incident falls under.';


--
-- Name: COLUMN schedule_code.schedule_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.schedule_code.schedule_code IS 'A human readable code used to identify a wdr schedule code';


--
-- Name: COLUMN schedule_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.schedule_code.short_description IS 'The short description of a case management schedule_code.';


--
-- Name: COLUMN schedule_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.schedule_code.long_description IS 'The long description of a case management schedule_code.';


--
-- Name: COLUMN schedule_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.schedule_code.active_ind IS 'A boolean indicator to determine if the case management schedule_code is active.';


--
-- Name: COLUMN schedule_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.schedule_code.create_user_id IS 'The id of the user that created the case management schedule_code.';


--
-- Name: COLUMN schedule_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.schedule_code.create_utc_timestamp IS 'The timestamp when the case management schedule_code was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN schedule_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.schedule_code.update_user_id IS 'The id of the user that updated the case management schedule_code.';


--
-- Name: COLUMN schedule_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.schedule_code.update_utc_timestamp IS 'The timestamp when the case management schedule_code was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: schedule_sector_xref; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.schedule_sector_xref (
    schedule_sector_xref_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    schedule_code character varying(10) NOT NULL,
    sector_code character varying(10) NOT NULL,
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL
);


--
-- Name: sector_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.sector_code (
    sector_code character varying(10) NOT NULL,
    short_description character varying(50) NOT NULL,
    long_description character varying(250),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL
);


--
-- Name: TABLE sector_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.sector_code IS 'Contains the list of values to further categorizes an incident by providing context (industry, methods of handling, etc.) for the kind of waste involved.';


--
-- Name: COLUMN sector_code.sector_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.sector_code.sector_code IS 'A human readable code used to identify a ipm_secord_code';


--
-- Name: COLUMN sector_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.sector_code.short_description IS 'The short description of a case management sector_code.';


--
-- Name: COLUMN sector_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.sector_code.long_description IS 'The long description of a case management sector_code.';


--
-- Name: COLUMN sector_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.sector_code.active_ind IS 'A boolean indicator to determine if the case management sector_code is active.';


--
-- Name: COLUMN sector_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.sector_code.create_user_id IS 'The id of the user that created the case management sector_code.';


--
-- Name: COLUMN sector_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.sector_code.create_utc_timestamp IS 'The timestamp when the case management sector_code was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN sector_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.sector_code.update_user_id IS 'The id of the user that updated the case management sector_code.';


--
-- Name: COLUMN sector_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.sector_code.update_utc_timestamp IS 'The timestamp when the case management sector_code was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: sex_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.sex_code (
    sex_code character varying(10) NOT NULL,
    short_description character varying(50) NOT NULL,
    long_description character varying(250),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL
);


--
-- Name: TABLE sex_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.sex_code IS 'Contains the list of biological sexes supported by the system.  For example M = "Male"';


--
-- Name: COLUMN sex_code.sex_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.sex_code.sex_code IS 'A human readable code used to identify a sex type.';


--
-- Name: COLUMN sex_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.sex_code.short_description IS 'The short description of a sex type.';


--
-- Name: COLUMN sex_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.sex_code.long_description IS 'The long description of a sex type.';


--
-- Name: COLUMN sex_code.display_order; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.sex_code.display_order IS 'The order in which the values of the sex type should be displayed when presented to a user in a list.';


--
-- Name: COLUMN sex_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.sex_code.active_ind IS 'A boolean indicator to determine if a sex type is active.';


--
-- Name: COLUMN sex_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.sex_code.create_user_id IS 'The id of the user that created the sex type.';


--
-- Name: COLUMN sex_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.sex_code.create_utc_timestamp IS 'The timestamp when the sex type was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN sex_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.sex_code.update_user_id IS 'The id of the user that updated the sex type.';


--
-- Name: COLUMN sex_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.sex_code.update_utc_timestamp IS 'The timestamp when the sex type was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: site; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.site (
    site_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    complaint_outcome_guid uuid NOT NULL,
    site_id character varying(50) NOT NULL,
    active_ind boolean DEFAULT true,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE site; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.site IS 'Contains the unauthorized site id for the Authroization Outcome';


--
-- Name: COLUMN site.site_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.site.site_guid IS 'System generated unique key for a site record';


--
-- Name: COLUMN site.complaint_outcome_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.site.complaint_outcome_guid IS 'System generated unique key for a case.  This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN site.site_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.site.site_id IS 'The value used for an unauthorized site id';


--
-- Name: COLUMN site.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.site.active_ind IS 'A boolean indicator to determine if the record has been soft deleted.';


--
-- Name: COLUMN site.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.site.create_user_id IS 'The id of the user that created the unauthroized site id.';


--
-- Name: COLUMN site.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.site.create_utc_timestamp IS 'The timestamp when the unauthroized site id was created. The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN site.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.site.update_user_id IS 'The id of the user that updated the unauthroized site id';


--
-- Name: COLUMN site.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.site.update_utc_timestamp IS 'The timestamp when the unauthroized site id was updated. The timestamp is stored in UTC with no Offset.';


--
-- Name: site_h; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.site_h (
    h_site_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: TABLE site_h; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.site_h IS 'History table for site table';


--
-- Name: COLUMN site_h.h_site_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.site_h.h_site_guid IS 'System generated unique key for site history. This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN site_h.target_row_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.site_h.target_row_id IS 'The unique key for the site that has been created or modified.';


--
-- Name: COLUMN site_h.operation_type; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.site_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN site_h.operation_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.site_h.operation_user_id IS 'The id of the user that created or modified the data in the site table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN site_h.operation_executed_at; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.site_h.operation_executed_at IS 'The timestamp when the data in the site table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN site_h.data_after_executed_operation; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.site_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


--
-- Name: threat_level_code; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.threat_level_code (
    threat_level_code character varying(10) NOT NULL,
    short_description character varying(50) NOT NULL,
    long_description character varying(250),
    display_order integer NOT NULL,
    active_ind boolean NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL
);


--
-- Name: TABLE threat_level_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.threat_level_code IS 'A COS determination that indicates the threat level of the animal to humans.  For example 1 = "Category 1"';


--
-- Name: COLUMN threat_level_code.threat_level_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.threat_level_code.threat_level_code IS 'A human readable code used to identify a threat level type.';


--
-- Name: COLUMN threat_level_code.short_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.threat_level_code.short_description IS 'The short description of a threat level type.';


--
-- Name: COLUMN threat_level_code.long_description; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.threat_level_code.long_description IS 'The long description of a threat level type.';


--
-- Name: COLUMN threat_level_code.display_order; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.threat_level_code.display_order IS 'The order in which the values of the threat level type should be displayed when presented to a user in a list.';


--
-- Name: COLUMN threat_level_code.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.threat_level_code.active_ind IS 'A boolean indicator to determine if a threat level type is active.';


--
-- Name: COLUMN threat_level_code.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.threat_level_code.create_user_id IS 'The id of the user that created the threat level type.';


--
-- Name: COLUMN threat_level_code.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.threat_level_code.create_utc_timestamp IS 'The timestamp when the threat level type was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN threat_level_code.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.threat_level_code.update_user_id IS 'The id of the user that updated the threat level type.';


--
-- Name: COLUMN threat_level_code.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.threat_level_code.update_utc_timestamp IS 'The timestamp when the threat level type was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: wildlife; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.wildlife (
    wildlife_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    complaint_outcome_guid uuid NOT NULL,
    threat_level_code character varying(10),
    sex_code character varying(10),
    age_code character varying(10),
    hwcr_outcome_code character varying(10),
    species_code character varying(10) NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL,
    active_ind boolean,
    identifying_features character varying(4000),
    hwcr_outcome_actioned_by_code character varying(10)
);


--
-- Name: TABLE wildlife; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.wildlife IS 'WILDLIFE can be a participant on a CASE_FILE, specifically for CASE_FILE with a CASE_CODE of "HWCR" (Human / Wildlife Conflict)';


--
-- Name: COLUMN wildlife.wildlife_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.wildlife.wildlife_guid IS 'System generated unique key for an animal.  This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN wildlife.complaint_outcome_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.wildlife.complaint_outcome_guid IS 'System generated unique key for a case.  This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN wildlife.threat_level_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.wildlife.threat_level_code IS 'A human readable code used to identify a threat level type.';


--
-- Name: COLUMN wildlife.sex_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.wildlife.sex_code IS 'A human readable code used to identify a sex type.';


--
-- Name: COLUMN wildlife.age_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.wildlife.age_code IS 'A human readable code used to identify an age type.';


--
-- Name: COLUMN wildlife.hwcr_outcome_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.wildlife.hwcr_outcome_code IS 'A human readable code used to identify an HWCR outcome type.';


--
-- Name: COLUMN wildlife.species_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.wildlife.species_code IS 'A human readable code used to identify a species.   The COS Complaint Management is the authorative source for the screen labels and descriptions of the codes.';


--
-- Name: COLUMN wildlife.create_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.wildlife.create_user_id IS 'The id of the user that created the wildlife record.';


--
-- Name: COLUMN wildlife.create_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.wildlife.create_utc_timestamp IS 'The timestamp when the wildlife record was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN wildlife.update_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.wildlife.update_user_id IS 'The id of the user that updated the wildlife record.';


--
-- Name: COLUMN wildlife.update_utc_timestamp; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.wildlife.update_utc_timestamp IS 'The timestamp when the wildlife record was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN wildlife.active_ind; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.wildlife.active_ind IS 'A boolean indicator to determine if the wildlife record is active.';


--
-- Name: COLUMN wildlife.hwcr_outcome_actioned_by_code; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.wildlife.hwcr_outcome_actioned_by_code IS 'A human readable code used to reference an HWCR outcome actioned by code.';


--
-- Name: wildlife_h; Type: TABLE; Schema: complaint_outcome; Owner: -
--

CREATE TABLE complaint_outcome.wildlife_h (
    h_wildlife_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: TABLE wildlife_h; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON TABLE complaint_outcome.wildlife_h IS 'History table for case_file table';


--
-- Name: COLUMN wildlife_h.h_wildlife_guid; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.wildlife_h.h_wildlife_guid IS 'System generated unique key for case history. This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN wildlife_h.target_row_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.wildlife_h.target_row_id IS 'The unique key for the case that has been created or modified.';


--
-- Name: COLUMN wildlife_h.operation_type; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.wildlife_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN wildlife_h.operation_user_id; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.wildlife_h.operation_user_id IS 'The id of the user that created or modified the data in the case table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN wildlife_h.operation_executed_at; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.wildlife_h.operation_executed_at IS 'The timestamp when the data in the case table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN wildlife_h.data_after_executed_operation; Type: COMMENT; Schema: complaint_outcome; Owner: -
--

COMMENT ON COLUMN complaint_outcome.wildlife_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


--
-- Data for Name: action; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Data for Name: action_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.action_code VALUES ('PROVSFTYIN', 'Provided safety information to the public', 'Provided safety information to the public', true, 'postgres', '2025-09-10 20:06:55.544666', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('CDCTMEDREL', 'Conducted media release to educate the community', 'Conducted media release to educate the community', true, 'postgres', '2025-09-10 20:06:55.544666', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('SETEQUIPMT', 'Equipment set by an officer', 'Equipment set by an officer', true, 'postgres', '2025-09-10 20:06:55.544666', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('REMEQUIPMT', 'Equipment removed by an officer', 'Equipment removed by an officer', true, 'postgres', '2025-09-10 20:06:55.544666', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('COMPLTREVW', 'Complete Review', 'Complete Review', true, 'postgres', '2025-09-10 20:06:55.611153', 'postgres', '2025-09-10 20:06:55.611153');
INSERT INTO complaint_outcome.action_code VALUES ('FWDLEADAGN', 'FWDLEADAGN', 'Forward to lead agency', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('RESPNFA', 'RESPNFA', 'Responded - no further action', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('RESPAUTO', 'RESPAUTO', 'Responded - auto-response/ed/promotion', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('RESPREC', 'RESPREC', 'Responded - recommend for inspection', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('NOACTION', 'No action', 'No action', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('SGHTNGS', 'Sighting', 'Sighting', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('FOODCOND', 'Food conditioned', 'Food conditioned', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('DAMGPROP', 'Damage to property', 'Damage to property', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('FSBCHRG', 'Follow/stalk/bluff charge', 'Follow/stalk/bluff charge', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('LVSTKILL', 'Livestock or pet, killed or injured', 'Livestock or pet, killed or injured', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('ENTRDWLL', 'Enters dwelling - temporary or permanent', 'Enters dwelling - temporary or permanent', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('NATPRYCP', 'Natural prey/crops', 'Natural prey/crops', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('CONFINED', 'Confined or treed', 'Confined or treed', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('SCHPRES', 'School/park/playground present', 'School/park/playground present', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('HUMINJ', 'Human injury/death', 'Human injury/death', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('COUGNGT', 'Cougar - sighting at night or tracks found', 'Cougar - sighting at night or tracks found', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('COUGDAY', 'Cougar - day time sighting', 'Cougar - day time sighting', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('UNFNDED', 'Unfounded', 'Unfounded', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('INJPRES', 'Present - injured/distressed/deceased', 'Present - injured/distressed/deceased', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_code VALUES ('ASSESSRISK', 'Assessed public safety risk', 'Assessed public safety risk', false, 'postgres', '2025-09-10 20:06:55.544666', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_code VALUES ('ASSESSHLTH', 'Assessed health as per animal welfare guidelines', 'Assessed health as per animal welfare guidelines', false, 'postgres', '2025-09-10 20:06:55.544666', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_code VALUES ('ASSESSHIST', 'Assessed known conflict history', 'Assessed known conflict history', false, 'postgres', '2025-09-10 20:06:55.544666', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_code VALUES ('CNFRMIDENT', 'Confirmed identification of offending animal(s)', 'Confirmed identification of offending animal(s)', false, 'postgres', '2025-09-10 20:06:55.544666', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_code VALUES ('DIRLOWLACT', 'Explained/directed livestock owner to the Wildlife Act', 'Explained/directed livestock owner to the Wildlife Act', true, 'postgres', '2025-09-10 20:06:55.595853', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_code VALUES ('UPDATENOTE', 'Add or Update a Note', 'Add or Update a Note', true, 'postgres', '2025-09-10 20:06:56.183043', 'postgres', '2025-09-10 20:06:56.183043');
INSERT INTO complaint_outcome.action_code VALUES ('INJNOTPRES', 'Not present - Injured/distressed', 'Not present - Injured/distressed', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('CNTCTBIOVT', 'Contacted/referred to biologist and/or veterinarian', 'Contacted/referred to biologist and/or veterinarian', true, 'postgres', '2025-09-10 20:06:55.595853', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_code VALUES ('CNTCTGROUP', 'Contacted/referred to WildSafeBC or local interest group to deliver education to the public', 'Contacted/referred to WildSafeBC or local interest group to deliver education to the public', true, 'postgres', '2025-09-10 20:06:55.544666', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_code VALUES ('CNTCTBYLAW', 'Contacted/referred to bylaw to assist with managing attractants', 'Contacted/referred to bylaw to assist with managing attractants', true, 'postgres', '2025-09-10 20:06:55.544666', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_code VALUES ('CONTACTLPP', 'Contacted/referred to the Livestock Protection Program ("LPP") (cattle and sheep only)', 'Contacted/referred to the Livestock Protection Program ("LPP") (cattle and sheep only)', true, 'postgres', '2025-09-10 20:06:55.595853', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_code VALUES ('PROVAMHSIN', 'Provided advice, attractant management and/or husbandry information', 'Provided advice, attractant management and/or husbandry information', true, 'postgres', '2025-09-10 20:06:55.544666', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_code VALUES ('CNTCTPOLIC', 'Contacted/referred to Police', 'Contacted/referred to Police', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('CNTCTREHFT', 'Contacted/referred to rehabilitation facility', 'Contacted/referred to rehabilitation facility', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_code VALUES ('ADMNSTRDRG', 'Drug administered by an officer', 'Drug administered by an officer', true, 'postgres', '2025-09-10 20:06:56.125214', 'postgres', '2025-09-10 20:06:56.125214');
INSERT INTO complaint_outcome.action_code VALUES ('RECOUTCOME', 'Outcome recorded by an officer', 'Outcome recorded by an officer', true, 'postgres', '2025-09-10 20:06:56.125214', 'postgres', '2025-09-10 20:06:56.125214');


--
-- Data for Name: action_h; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Data for Name: action_type_action_xref; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.action_type_action_xref VALUES ('88e98bb1-2a08-415c-9328-ab66d7871344', 'EQUIPMENT', 'SETEQUIPMT', 1, true, 'postgres', '2025-09-10 20:06:55.544666', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('43151925-f20f-4aab-841a-7fb79dcc6b13', 'EQUIPMENT', 'REMEQUIPMT', 2, true, 'postgres', '2025-09-10 20:06:55.544666', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('d236e9e8-5c36-4c0e-b079-b0a3fab3f303', 'CASEACTION', 'COMPLTREVW', 1, true, 'postgres', '2025-09-10 20:06:55.611153', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('b3eaf04b-a3b1-4915-adec-2427b981554c', 'CEEBACTION', 'NOACTION', 20, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('36f5f460-4609-41b9-9569-0d536d986b45', 'COMPASSESS', 'SGHTNGS', 10, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('db460a0b-f5d1-4447-b4c0-aea6cb9373a9', 'COMPASSESS', 'FOODCOND', 20, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('b4007fd0-bf40-4976-9569-a8194459218b', 'COMPASSESS', 'DAMGPROP', 30, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('6d1eeea6-a968-4c52-8fbb-1dc9ca0b6547', 'COMPASSESS', 'INJPRES', 40, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('2c2d890f-e871-4301-aae2-78358596dc32', 'COMPASSESS', 'FSBCHRG', 50, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('0a5ed0ea-7194-4db1-96a9-638fdc566c80', 'COMPASSESS', 'LVSTKILL', 60, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('745f6566-a0b1-4a8e-99fc-d6eaed17e91b', 'COMPASSESS', 'ENTRDWLL', 70, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('b88f8568-c1af-45f0-84c4-248420b2b80a', 'COMPASSESS', 'NATPRYCP', 80, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('868052df-ec51-461d-bfa9-fa1e662e3829', 'COMPASSESS', 'CONFINED', 90, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('feca6829-a7d4-4b2b-b0cc-da6cbad85de1', 'COMPASSESS', 'SCHPRES', 100, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('8b8b8dc9-3f5d-4dbc-9d26-eeb82bfd5db7', 'COMPASSESS', 'HUMINJ', 110, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('038772d9-1e52-473a-b2c0-e8069e286a03', 'COMPASSESS', 'UNFNDED', 120, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('f135b391-9cc6-48f1-a966-065620318e52', 'CAT1ASSESS', 'COUGNGT', 10, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('803f7444-4b2f-41b1-913b-87af220753c3', 'CAT1ASSESS', 'COUGDAY', 20, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('97b458eb-09f8-4cca-bdfe-b6b08d3727a8', 'CEEBACTION', 'FWDLEADAGN', 10, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('94753252-c114-4a06-8423-e154a32093fb', 'CEEBACTION', 'RESPNFA', 30, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('a7d0f3e6-410d-48cc-be05-2cce5435f607', 'CEEBACTION', 'RESPAUTO', 40, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('c2bf5d0b-5bbb-425b-aee4-a7bc8a11bfd4', 'CEEBACTION', 'RESPREC', 50, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('62bdfa28-d54d-4ed8-940b-5863289cbc36', 'COMPASSESS', 'ASSESSRISK', 1, false, 'postgres', '2025-09-10 20:06:55.544666', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('fc82bfaf-fada-45bf-a6d9-f941f9a5137c', 'COMPASSESS', 'ASSESSHLTH', 2, false, 'postgres', '2025-09-10 20:06:55.544666', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('048a81a6-3e45-47f9-a13a-d7e799ebb7de', 'COMPASSESS', 'ASSESSHIST', 3, false, 'postgres', '2025-09-10 20:06:55.544666', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('b084bd3d-d5ad-43cb-bbce-13625decb7d5', 'COMPASSESS', 'CNFRMIDENT', 4, false, 'postgres', '2025-09-10 20:06:55.544666', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('1e66074e-562b-47f5-9d4d-83e270fd5861', 'COMPASSESS', 'INJNOTPRES', 45, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('0100ddce-9c91-4c8f-9775-2ce877221e2d', 'COSPRV&EDU', 'CNTCTPOLIC', 60, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('d3ecb0e8-ad92-4ad0-82f1-2e092de9f3cc', 'COSPRV&EDU', 'CNTCTREHFT', 70, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('a169ce29-7e08-4400-a15b-3e22875f8fdf', 'COSPRV&EDU', 'PROVSFTYIN', 10, true, 'postgres', '2025-09-10 20:06:55.544666', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('9002d258-d010-4d1a-93c0-7a04274d0b75', 'COSPRV&EDU', 'PROVAMHSIN', 20, true, 'postgres', '2025-09-10 20:06:55.544666', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('a48fe014-3353-4a7c-8fef-57d77b7c4ee2', 'COSPRV&EDU', 'CNTCTBIOVT', 30, true, 'postgres', '2025-09-10 20:06:55.595853', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('54189608-0b90-4a5f-862b-4fbf79bf60e3', 'COSPRV&EDU', 'CNTCTBYLAW', 40, true, 'postgres', '2025-09-10 20:06:55.544666', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('d9f37cdc-8993-4c45-8a53-dc9e62060154', 'COSPRV&EDU', 'CNTCTGROUP', 50, true, 'postgres', '2025-09-10 20:06:55.544666', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('4a92f93e-db9f-4da7-a2ce-cfe6a3464e96', 'COSPRV&EDU', 'CONTACTLPP', 80, true, 'postgres', '2025-09-10 20:06:55.595853', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('719b9b76-7ae1-448f-88c8-59038917995d', 'COSPRV&EDU', 'CDCTMEDREL', 90, true, 'postgres', '2025-09-10 20:06:55.544666', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('b696dfe0-d919-4d59-b421-c0e74658a443', 'COSPRV&EDU', 'DIRLOWLACT', 100, true, 'postgres', '2025-09-10 20:06:55.595853', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('a9c5f8cc-415b-4e75-ba5d-6cb39d255adb', 'PRKPRV&EDU', 'CNTCTPOLIC', 50, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('250a2fe0-d93a-481e-9b25-67e12a386415', 'PRKPRV&EDU', 'CNTCTREHFT', 60, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('25fa5bd3-7e8d-4619-9061-901b1eb739dc', 'PRKPRV&EDU', 'PROVSFTYIN', 10, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('552db39a-4d95-4227-965e-ecf928f0f7bf', 'PRKPRV&EDU', 'PROVAMHSIN', 20, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('91a06a41-16a9-421c-b19b-63cb3ea96e17', 'PRKPRV&EDU', 'CNTCTBIOVT', 30, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('a6c3bd52-5fe1-4022-8422-c43a88f5f7d7', 'PRKPRV&EDU', 'CNTCTGROUP', 40, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('be0ef344-21da-4e44-8b38-8cc6cb5efdc6', 'WILDLIFE', 'ADMNSTRDRG', 1, true, 'postgres', '2025-09-10 20:06:56.125214', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('d413edde-626e-436a-ad15-eeda019c9d5c', 'WILDLIFE', 'RECOUTCOME', 2, true, 'postgres', '2025-09-10 20:06:56.125214', NULL, NULL);
INSERT INTO complaint_outcome.action_type_action_xref VALUES ('529efadd-fbe4-405f-b3e6-d0158f5d6604', 'CASEACTION', 'UPDATENOTE', 1, true, 'postgres', '2025-09-10 20:06:56.183043', NULL, NULL);


--
-- Data for Name: action_type_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.action_type_code VALUES ('COMPASSESS', 'Complaint Assessment', 'Complaint Assessment', true, 'postgres', '2025-09-10 20:06:55.544666', NULL, NULL);
INSERT INTO complaint_outcome.action_type_code VALUES ('COSPRV&EDU', 'Prevention and Education', 'Prevention and Education', true, 'postgres', '2025-09-10 20:06:55.544666', NULL, NULL);
INSERT INTO complaint_outcome.action_type_code VALUES ('EQUIPMENT', 'Equipment', 'Equipment', true, 'postgres', '2025-09-10 20:06:55.544666', NULL, NULL);
INSERT INTO complaint_outcome.action_type_code VALUES ('CASEACTION', 'Miscellaneous Case Actions', 'Miscellaneous Case Actions', true, 'postgres', '2025-09-10 20:06:55.611153', 'postgres', '2025-09-10 20:06:55.611153');
INSERT INTO complaint_outcome.action_type_code VALUES ('CEEBACTION', 'CEEB Actions', 'CEEB Actions', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_code VALUES ('CAT1ASSESS', 'Category 1 Assessment', 'Additional assessment options for large carnivores', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_code VALUES ('PRKPRV&EDU', 'Prevention and Education', 'Prevention and Education', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.action_type_code VALUES ('WILDLIFE', 'Wildlife', 'For actions related to the wildlife section', true, 'postgres', '2025-09-10 20:06:56.125214', 'postgres', '2025-09-10 20:06:56.125214');


--
-- Data for Name: age_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.age_code VALUES ('ADLT', 'Adult', 'Adult', 1, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');
INSERT INTO complaint_outcome.age_code VALUES ('YRLN', 'Yearling', 'Yearling', 2, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');
INSERT INTO complaint_outcome.age_code VALUES ('YOFY', 'Young of the year', 'Young of the year', 3, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');
INSERT INTO complaint_outcome.age_code VALUES ('UNKN', 'Unknown', 'Unknown', 4, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');


--
-- Data for Name: assessment; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Data for Name: assessment_h; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Data for Name: authorization_permit; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Data for Name: authorization_permit_h; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Data for Name: case_location_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.case_location_code VALUES ('RURAL', 'Rural', 'Rural', 10, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.case_location_code VALUES ('URBAN', 'Urban', 'Urban', 20, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.case_location_code VALUES ('WLDNS', 'Wilderness', 'Wilderness', 30, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);


--
-- Data for Name: case_note; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Data for Name: complaint_outcome; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Data for Name: complaint_outcome_h; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Data for Name: configuration; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.configuration VALUES ('CDTABLEVER', '3', 'The current version of the application stored in the database.   Will be incremented by 1 with each  change to signal to the application cache that the values of the code tables should be refreshed.', true, 'FLYWAY', '2025-09-10 20:06:55.57733', 'FLYWAY', '2025-09-10 20:06:55.81104');


--
-- Data for Name: configuration_h; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.configuration_h VALUES ('fe6fd84c-399c-4abc-bafe-5d56606da6c4', 'CDTABLEVER', 'I', 'FLYWAY', '2025-09-10 20:06:55.57733', '{"active_ind": true, "create_user_id": "FLYWAY", "update_user_id": "FLYWAY", "long_description": "The current version of the application stored in the database.   Will be incremented by 1 with each  change to signal to the application cache that the values of the code tables should be refreshed.", "configuration_code": "CDTABLEVER", "configuration_value": "1", "create_utc_timestamp": "2025-09-10T20:06:55.57733", "update_utc_timestamp": "2025-09-10T20:06:55.57733"}');
INSERT INTO complaint_outcome.configuration_h VALUES ('99bb8e61-7138-472f-b3bd-1e61aa5e9cfd', 'CDTABLEVER', 'U', 'FLYWAY', '2025-09-10 20:06:55.595853', '{"active_ind": true, "create_user_id": "FLYWAY", "update_user_id": "FLYWAY", "long_description": "The current version of the application stored in the database.   Will be incremented by 1 with each  change to signal to the application cache that the values of the code tables should be refreshed.", "configuration_code": "CDTABLEVER", "configuration_value": "2", "create_utc_timestamp": "2025-09-10T20:06:55.57733", "update_utc_timestamp": "2025-09-10T20:06:55.595853"}');
INSERT INTO complaint_outcome.configuration_h VALUES ('5abed55c-880d-4c87-ba10-5f0c5055495c', 'CDTABLEVER', 'U', 'FLYWAY', '2025-09-10 20:06:55.81104', '{"active_ind": true, "create_user_id": "FLYWAY", "update_user_id": "FLYWAY", "long_description": "The current version of the application stored in the database.   Will be incremented by 1 with each  change to signal to the application cache that the values of the code tables should be refreshed.", "configuration_code": "CDTABLEVER", "configuration_value": "3", "create_utc_timestamp": "2025-09-10T20:06:55.57733", "update_utc_timestamp": "2025-09-10T20:06:55.81104"}');


--
-- Data for Name: conflict_history_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.conflict_history_code VALUES ('L', 'Low', 'Low', 1, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');
INSERT INTO complaint_outcome.conflict_history_code VALUES ('M', 'Medium', 'Medium', 2, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');
INSERT INTO complaint_outcome.conflict_history_code VALUES ('H', 'High', 'High', 3, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');
INSERT INTO complaint_outcome.conflict_history_code VALUES ('U', 'Unknown', 'Unknown', 4, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');


--
-- Data for Name: decision; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Data for Name: decision_h; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Data for Name: discharge_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.discharge_code VALUES ('AIR_BURN', 'AIR_BURN', 'Air – burning', 10, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.discharge_code VALUES ('AIR_EMSSN', 'AIR_EMSSN', 'Air – emission', 30, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.discharge_code VALUES ('EFFLNT', 'EFFLNT', 'Effluent', 50, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.discharge_code VALUES ('NONE', 'NONE', 'None', 5, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.discharge_code VALUES ('AIR_DST', 'AIR_DST', 'Air – dust', 20, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.discharge_code VALUES ('AIR_ODOUR', 'AIR_ODOUR', 'Air – odour', 40, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.discharge_code VALUES ('PSTCD', 'PSTCD', 'Pesticides', 70, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.discharge_code VALUES ('RFS_DMP', 'RFS_DMP', 'Refuse – Dumping', 80, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.discharge_code VALUES ('RFS_OTHR', 'RFS_OTHR', 'Refuse - Other', 90, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');


--
-- Data for Name: drug_administered; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Data for Name: drug_administered_h; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Data for Name: drug_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.drug_code VALUES ('ATPMZ', 'Atipamezole', 'Atipamezole', 1, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');
INSERT INTO complaint_outcome.drug_code VALUES ('BAMII', 'BAM II', 'Butorphanol Azaperone Medetomidine', 2, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');
INSERT INTO complaint_outcome.drug_code VALUES ('MDTMD', 'Medetomidine', 'Medetomidine', 3, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');
INSERT INTO complaint_outcome.drug_code VALUES ('NLTRX', 'Naltrexone', 'Naltrexone', 4, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');
INSERT INTO complaint_outcome.drug_code VALUES ('ZLTIL', 'Zoletil', 'Zoletil', 5, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');


--
-- Data for Name: drug_method_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.drug_method_code VALUES ('DART', 'Dart', 'Dart', 1, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');
INSERT INTO complaint_outcome.drug_method_code VALUES ('HINJ', 'Hand injection', 'Hand injection', 2, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');
INSERT INTO complaint_outcome.drug_method_code VALUES ('PSRG', 'Pole syringe', 'Pole syringe', 3, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');
INSERT INTO complaint_outcome.drug_method_code VALUES ('ORNA', 'Oral/nasal', 'Oral/nasal', 4, true, 'FLYWAY', '2025-09-10 20:06:55.81104', 'FLYWAY', '2025-09-10 20:06:55.81104');


--
-- Data for Name: drug_remaining_outcome_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.drug_remaining_outcome_code VALUES ('DISC', 'Discarded', 'Discarded', 1, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');
INSERT INTO complaint_outcome.drug_remaining_outcome_code VALUES ('STOR', 'Storage', 'Storage', 2, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');
INSERT INTO complaint_outcome.drug_remaining_outcome_code VALUES ('RDIS', 'Returned to vet', 'Returned to vet', 3, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:55.81104');


--
-- Data for Name: ear_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.ear_code VALUES ('L', 'Left', 'Left', 1, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');
INSERT INTO complaint_outcome.ear_code VALUES ('R', 'Right', 'Right', 2, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');


--
-- Data for Name: ear_tag; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Data for Name: ear_tag_h; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Data for Name: equipment; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Data for Name: equipment_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.equipment_code VALUES ('BRSNR', 'Bear snare', 'Bear snare', 1, false, 'FLYWAY', '2025-09-10 20:06:53.660071', 'postgres', '2025-09-10 20:06:55.81104', true, false);
INSERT INTO complaint_outcome.equipment_code VALUES ('BRLTR', 'Bear live trap', 'Bear live trap', 2, false, 'FLYWAY', '2025-09-10 20:06:53.660071', 'postgres', '2025-09-10 20:06:55.81104', true, false);
INSERT INTO complaint_outcome.equipment_code VALUES ('CRFTR', 'Cougar foothold trap', 'Cougar foothold trap', 3, false, 'FLYWAY', '2025-09-10 20:06:53.660071', 'postgres', '2025-09-10 20:06:55.81104', true, false);
INSERT INTO complaint_outcome.equipment_code VALUES ('CRLTR', 'Cougar live trap', 'Cougar live trap', 4, false, 'FLYWAY', '2025-09-10 20:06:53.660071', 'postgres', '2025-09-10 20:06:55.81104', true, false);
INSERT INTO complaint_outcome.equipment_code VALUES ('LLTHL', 'Less lethal', 'Less lethal', 60, true, 'FLYWAY', '2025-09-10 20:06:55.81104', 'FLYWAY', '2025-09-10 20:06:55.81104', false, false);
INSERT INTO complaint_outcome.equipment_code VALUES ('K9UNT', 'K9 unit', 'K9 unit', 70, true, 'FLYWAY', '2025-09-10 20:06:55.81104', 'FLYWAY', '2025-09-10 20:06:55.81104', false, false);
INSERT INTO complaint_outcome.equipment_code VALUES ('FTRAP', 'Foothold trap', 'Foothold trap', 10, true, 'FLYWAY', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104', true, true);
INSERT INTO complaint_outcome.equipment_code VALUES ('LTRAP', 'Live trap', 'Live trap', 20, true, 'FLYWAY', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104', true, true);
INSERT INTO complaint_outcome.equipment_code VALUES ('SIGNG', 'Signage', 'Signage', 40, true, 'FLYWAY', '2025-09-10 20:06:53.660071', 'postgres', '2025-09-10 20:06:55.81104', false, true);
INSERT INTO complaint_outcome.equipment_code VALUES ('TRCAM', 'Trail camera', 'Trail camera', 50, true, 'FLYWAY', '2025-09-10 20:06:53.660071', 'postgres', '2025-09-10 20:06:55.81104', false, true);
INSERT INTO complaint_outcome.equipment_code VALUES ('SNR', 'Snare', 'Snare', 5, true, 'FLYWAY', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104', true, true);


--
-- Data for Name: equipment_h; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Data for Name: equipment_status_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.equipment_status_code VALUES ('ALLEQUIP', 'All equipment', 'All equipment', 10, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.equipment_status_code VALUES ('ACTEQUIP', 'Active equipment', 'Active equipment', 20, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.equipment_status_code VALUES ('INACTEQUIP', 'Inactive equipment', 'Inactive equipment', 30, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);


--
-- Data for Name: hwcr_outcome_actioned_by_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.hwcr_outcome_actioned_by_code VALUES ('COS', 'COS', 'COS', 'Conservation Officer Service', 1, true, 'FLYWAY', '2025-09-10 20:06:55.81104', 'FLYWAY', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.hwcr_outcome_actioned_by_code VALUES ('PARKS', 'PARKS', 'BC Parks', 'BC Parks', 2, true, 'FLYWAY', '2025-09-10 20:06:55.81104', 'FLYWAY', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.hwcr_outcome_actioned_by_code VALUES ('FRSTNTNS', NULL, 'First Nations', 'First Nations', 3, true, 'FLYWAY', '2025-09-10 20:06:55.81104', 'FLYWAY', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.hwcr_outcome_actioned_by_code VALUES ('OTHER', NULL, 'Other', 'Other', 4, true, 'FLYWAY', '2025-09-10 20:06:55.81104', 'FLYWAY', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.hwcr_outcome_actioned_by_code VALUES ('POLICE', NULL, 'Police', 'Police', 5, true, 'FLYWAY', '2025-09-10 20:06:55.81104', 'FLYWAY', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.hwcr_outcome_actioned_by_code VALUES ('PUBLIC', NULL, 'Public', 'Public', 6, true, 'FLYWAY', '2025-09-10 20:06:55.81104', 'FLYWAY', '2025-09-10 20:06:55.81104');


--
-- Data for Name: hwcr_outcome_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.hwcr_outcome_code VALUES ('TRANSREHB', 'Transferred to rehabilitation facility', 'Transferred to rehabilitation facility', 120, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.hwcr_outcome_code VALUES ('DEADONARR', 'Dead on arrival', 'Dead on arrival', 10, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.hwcr_outcome_code VALUES ('DISPTCHD', 'Dispatched', 'Dispatched', 40, true, 'FLYWAY', '2025-09-10 20:06:55.81104', 'FLYWAY', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.hwcr_outcome_code VALUES ('EUTHNIZD', 'Euthanized', 'Euthanized', 70, true, 'FLYWAY', '2025-09-10 20:06:55.81104', 'FLYWAY', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.hwcr_outcome_code VALUES ('GONEONARR', 'Gone on arrival', 'Gone on arrival', 80, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.hwcr_outcome_code VALUES ('NOTRCVD', 'Not recovered', 'Not recovered', 90, true, 'FLYWAY', '2025-09-10 20:06:55.81104', 'FLYWAY', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.hwcr_outcome_code VALUES ('RELSITE', 'Released on-site', 'Released on-site', 100, true, 'FLYWAY', '2025-09-10 20:06:55.81104', 'FLYWAY', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.hwcr_outcome_code VALUES ('SHRTRELOC', 'Relocated - within home range', 'Relocated - within home range', 110, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.hwcr_outcome_code VALUES ('TRANSLCTD', 'Translocated - outside home range', 'Translocated - outside home range', 130, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.hwcr_outcome_code VALUES ('LESSLETHAL', 'Less lethal', 'Less lethal', 85, false, 'FLYWAY', '2025-09-10 20:06:54.148688', 'FLYWAY', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.hwcr_outcome_code VALUES ('REFRTOBIO', 'Referred to biologist', 'Referred to biologist', 95, false, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:55.81104');


--
-- Data for Name: inaction_reason_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.inaction_reason_code VALUES ('DUPLICATE', 'COS', 'Duplicate', 'Duplicate', 1, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.inaction_reason_code VALUES ('NOPUBSFTYC', 'COS', 'No public safety concern', 'No public safety concern', 2, true, 'postgres', '2025-09-10 20:06:55.544666', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.inaction_reason_code VALUES ('OTHOPRPRTY', 'COS', 'Other operational priorities', 'Other operational priorities', 3, true, 'postgres', '2025-09-10 20:06:55.544666', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.inaction_reason_code VALUES ('OUTSDCOSMT', 'COS', 'Outside mandate', 'Outside mandate', 40, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');


--
-- Data for Name: ipm_auth_category_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.ipm_auth_category_code VALUES ('CONFHOLDR', 'Confirmation holder', 'Confirmation holder', 10, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.ipm_auth_category_code VALUES ('OTHERTYPE', 'Other', 'Other', 20, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.ipm_auth_category_code VALUES ('PERMHOLDR', 'Permit holder', 'Permit holder', 30, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.ipm_auth_category_code VALUES ('PESUSNSLC', 'Pesticide user non-service licence', 'Pesticide user non-service licence', 40, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.ipm_auth_category_code VALUES ('PESUSLICE', 'Pesticide user service licence', 'Pesticide user service licence', 50, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);
INSERT INTO complaint_outcome.ipm_auth_category_code VALUES ('PESVENLIC', 'Pesticide vendor licence', 'Pesticide vendor licence', 60, true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL);


--
-- Data for Name: non_compliance_decision_matrix_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.non_compliance_decision_matrix_code VALUES ('INCOMP', '0 In Compliance', '0 In Compliance', 10, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.non_compliance_decision_matrix_code VALUES ('NOIMPCT', '1 No impact likely', '1 No impact likely', 20, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.non_compliance_decision_matrix_code VALUES ('MINIMPCT', '2 Minor temporary impact likely', '2 Minor temporary impact likely', 30, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.non_compliance_decision_matrix_code VALUES ('MODIMPCT', '3 Moderate temporary impact likely', '3 Moderate temporary impact likely', 40, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.non_compliance_decision_matrix_code VALUES ('SIGIMPCT', '4 Significant impact likely', '4 Significant impact likely', 50, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.non_compliance_decision_matrix_code VALUES ('SVRIMPCT', '5 Severe human health impact demonstrated/likely', '5 Severe human health impact demonstrated/likely', 60, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.non_compliance_decision_matrix_code VALUES ('ND', 'Not determined', 'Not determined', 70, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');


--
-- Data for Name: outcome_agency_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.outcome_agency_code VALUES ('ALC', 'Agricultural Land Commission', 'Agricultural Land Commission', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL, 10);
INSERT INTO complaint_outcome.outcome_agency_code VALUES ('ENERGY', 'BC Energy Regulator ', 'BC Energy Regulator', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL, 20);
INSERT INTO complaint_outcome.outcome_agency_code VALUES ('PARKS', 'BC Parks', 'BC Parks', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL, 30);
INSERT INTO complaint_outcome.outcome_agency_code VALUES ('CEB', 'Compliance and Enforcement Branch', 'Compliance and Enforcement Branch', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL, 40);
INSERT INTO complaint_outcome.outcome_agency_code VALUES ('ECCC', 'Environment and Climate Change Canada', 'Environment and Climate Change Canada', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL, 70);
INSERT INTO complaint_outcome.outcome_agency_code VALUES ('EAO', 'Environmental Assessment Office', 'Environmental Assessment Office', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL, 80);
INSERT INTO complaint_outcome.outcome_agency_code VALUES ('FSIB', 'Food Safety Inspection Branch', 'Food Safety Inspection Branch', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL, 90);
INSERT INTO complaint_outcome.outcome_agency_code VALUES ('HEALTH', 'Health Authority', 'Health Authority', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL, 100);
INSERT INTO complaint_outcome.outcome_agency_code VALUES ('MHSED', 'Mines Health, Safety and Enforcement Division', 'Mines Health, Safety and Enforcement Division', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL, 110);
INSERT INTO complaint_outcome.outcome_agency_code VALUES ('MUNI', 'Municipality / Regional District', 'Municipality / Regional District', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL, 120);
INSERT INTO complaint_outcome.outcome_agency_code VALUES ('OTHER', 'Other', 'Other', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL, 140);
INSERT INTO complaint_outcome.outcome_agency_code VALUES ('COS', 'Conservation Officer Service', 'Conservation Officer Service', true, 'postgres', '2025-09-10 20:06:55.544666', 'postgres', '2025-09-10 20:06:55.81104', 60);
INSERT INTO complaint_outcome.outcome_agency_code VALUES ('EPO', 'CEEB', 'Compliance and Environmental Enforcement Branch', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104', 50);
INSERT INTO complaint_outcome.outcome_agency_code VALUES ('TRANSPORT', 'Transport Canada', 'Transport Canada', true, 'postgres', '2025-09-10 20:06:55.81104', NULL, NULL, 135);
INSERT INTO complaint_outcome.outcome_agency_code VALUES ('MOTI', 'MOTI', 'MOTI', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104', 130);


--
-- Data for Name: prevention_education; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Data for Name: schedule_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.schedule_code VALUES ('IPM', 'IPM sector type', 'IPM sector type', 10, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_code VALUES ('OTHER', 'Other', 'Other', 20, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_code VALUES ('RECYCLING', 'Recycling', 'Recycling', 30, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_code VALUES ('WDR1', 'WDR schedule 1', 'WDR schedule 1', 40, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_code VALUES ('WDR2', 'WDR schedule 2', 'WDR schedule 2', 50, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');


--
-- Data for Name: schedule_sector_xref; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('7ec3ba6b-4a10-43d8-8ccd-3ea16236893f', 'WDR1', 'ABRASIVESI', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('ff09e465-83c2-4bd2-b931-bcb6059ff4b6', 'WDR1', 'ALUMINUMPR', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('20cfc4cc-ef5f-4115-90aa-4166b6e4cdfa', 'WDR1', 'ASBESTOSMI', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('278f6723-47c8-4fbf-b5f4-efb339ba9906', 'WDR1', 'ASPHALTROO', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('a9136fb2-f432-4762-9b77-fb0c94b733b5', 'WDR1', 'BIOTECHIN', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('f929484c-04e4-4aec-94a2-4a6abea9cb17', 'WDR1', 'BURNVEGED', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('1ed8f7c9-722b-4b62-93d1-45fc400657cc', 'WDR1', 'BURNWASTE', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('27744cc0-a252-4293-97d4-19d29070dbfc', 'WDR1', 'BURNWOODR', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('d82e0d0c-4491-4d21-82dd-2f1be32bb747', 'WDR1', 'CEMENTLIME', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('9141d46f-d658-4967-9501-af09eb4ad1b9', 'WDR1', 'CHEMPRIND', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('b438e34b-dc14-4fc1-80e4-6066b80cd115', 'WDR1', 'CLAYINDUST', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('8c13979d-c67e-4371-9a51-ab5aaf271ec4', 'WDR1', 'COMWASTEIN', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('0c76d3b4-2e13-4a23-ab4e-35b1244c5580', 'WDR1', 'CONTSITEM', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('dff5f0f9-cdd7-4f26-b3b5-ec587caf46f1', 'WDR1', 'DAIRYPROD', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('c6add5b2-bed5-4e85-94b5-8337a15a2f97', 'WDR1', 'ELECPRODI', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('0aa97b52-e002-4f58-81be-5c91cb902a27', 'WDR1', 'ELECPOWER', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('01110695-bee5-404a-ae21-914cb4916a48', 'WDR1', 'FLOURFEED', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('cc6c1235-a7f4-410b-a65b-f729aefa1922', 'WDR1', 'GLASSPROD', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('8e754fd0-72af-4c4a-a62a-6acc458002cc', 'WDR1', 'HAZWASTEM', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('1495cae2-be1d-4344-bfed-2b8134baf807', 'WDR1', 'INDFASTEN', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('399a7fc5-b742-43f7-8663-88472ba8e5dc', 'WDR1', 'METALPROC', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('04d7c385-a8a3-4e75-b971-f93a022c48b8', 'WDR1', 'METALSMEL', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('53033f21-f13c-4a2e-b919-9cdd540f7338', 'WDR1', 'MININGCOA', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('4c379eee-ff42-4ce7-a078-f053cddb3995', 'WDR1', 'MUNSEWMAN', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('277a7cff-9515-4fe4-97f5-0f3c1cebe188', 'WDR1', 'MUNSOLWST', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('e2e19690-0024-4018-bab0-c41930703693', 'WDR1', 'MUNWASTEI', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('e4812db4-05bd-4623-a4a9-02643086ab6a', 'WDR1', 'NONMETMIN', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('89b881aa-ff48-4d71-a194-a1aafd61ac8a', 'WDR1', 'OILNATGASL', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('2a321fa9-ea37-4b9a-8abf-d6ec93965ed9', 'WDR1', 'OZONEMANG', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('8cfd4f4e-6cea-482e-9cab-7588104eae8c', 'WDR1', 'PAPERBOAR', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('13bb25d7-0b3d-452e-81ac-193b716c2622', 'WDR1', 'PAPERINDU', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('b37eb114-302a-4a33-b779-d1884ff4db54', 'WDR1', 'PARTWAFAI', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('466790f3-6352-46cf-816f-0596c62de681', 'WDR1', 'PIPETRANA', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('39015f13-fe27-4513-8a72-7c7995f76f91', 'WDR1', 'PLASTRESI', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('d102ddd9-262f-45b2-81b2-a30c16fcd6ef', 'WDR1', 'PULPINDUST', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('f45011a5-d8be-4964-ad65-6b56115da2fb', 'WDR1', 'REFPETPRO', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('6a253d12-e4aa-460e-9ad1-feebf7eb6249', 'WDR1', 'MEATBYPROD', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('66d807e0-955e-4cb1-a8d8-f29b6b3e3bef', 'WDR1', 'SUGARPROD', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('2dbcc8c7-5dd6-4951-80b9-18a026fa0f67', 'WDR1', 'VENEERPLY', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('803042db-0fc9-4ea8-a567-eafc4c065420', 'WDR2', 'AGRICULOP', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('91d81169-c12c-46da-9cb7-111055099f7d', 'WDR2', 'ANTICHEMM', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('7f371638-9e26-49a6-a605-0988e1bd42c4', 'WDR2', 'AQUALANDI', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('0890f724-6fe4-42bf-b81f-0bf482e37c52', 'WDR2', 'AQUAMARINE', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('b9a102e9-936b-41f5-a553-f263b5f375f6', 'WDR2', 'ASPHALTPI', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('ce724435-92fc-4a45-b5e0-c665f44081e6', 'WDR2', 'BEVERAGEIN', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('6678d876-7c2f-4071-ba57-1090ac3d92c9', 'WDR2', 'COALGASIN', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('c5770a35-efa7-4318-8f62-ed51d349d2df', 'WDR2', 'COMPOSTIN', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('fb4b9f29-6303-425a-9d6d-e82a79827752', 'WDR2', 'CONCRETEP', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('d7374f28-7eba-4488-bcce-d0ee2c0f04a5', 'WDR2', 'DEEPWELLD', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('67b0fde2-94c9-477c-bc66-0c095f6dc673', 'WDR2', 'FISHPRODI', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('4a6c5d60-c8ae-426c-8735-fa3f2c205a7f', 'WDR2', 'FRUITVEGI', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('76451862-bf7c-481c-bee7-da44828633d3', 'WDR2', 'NONHAZWST', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('fca9bef3-6878-4bcc-a364-a7866689b4d4', 'WDR2', 'NORADMATM', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('122d224f-0a06-460a-a7ff-502db1cd0dbe', 'WDR2', 'OILNATGSS', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('526efe1d-6200-4a05-8f9e-6a76f37740e2', 'WDR2', 'PETROSTOR', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('24a758de-93cb-47dd-9732-cabea5bb8801', 'WDR2', 'PIPETRANI', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('f6f45a3c-2d7f-445f-99a6-54dbccf1e016', 'WDR2', 'PLACERMIN', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('669db1cb-ea05-40c0-9cbc-94d2e05879f9', 'WDR2', 'PLASTCOMP', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('721a87cc-34ad-4f07-b6fa-0324a77261e3', 'WDR2', 'POULTRYPR', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('be9e32a7-ac18-443b-a7ec-146759978aca', 'WDR2', 'PRODSTORAG', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('19781c1c-bfd4-46a3-8251-ac241a201f26', 'WDR2', 'SLAUGHTER', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('ab899238-c8a3-46cb-baf0-3899c1899081', 'WDR2', 'SOILENHAN', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('847fd7f2-9834-4c21-9e61-e0d6f0114588', 'WDR2', 'VEHDISREC', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('30272d41-1ab5-4e51-9857-5ecd971f5d58', 'WDR2', 'VEHINDPAR', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('1ecd84a8-1cd6-47ac-bbdd-91c592287ec9', 'WDR2', 'WOODPRIMA', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('303cbe23-1a92-44d6-99c8-fc102eb5d714', 'WDR2', 'WOODSECON', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('efe97245-b4df-49d8-854c-887be8f29044', 'WDR2', 'WOODTREIN', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('2cdcfdd7-f354-4839-9cd5-1ed46ea57517', 'IPM', 'USRAERGEN', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('51427b1d-d76b-422c-ba5c-b03eb3f1d42a', 'IPM', 'USRINDGEN', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('7fb143d1-1423-44d8-ac0e-789e4cb78667', 'IPM', 'USRLANDGEN', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('d2482bd4-ad9c-4585-8ea1-a950d2419811', 'IPM', 'USRMOSBIT', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('2abebd97-5590-4e7f-acd7-62378acb59db', 'IPM', 'USRNOXGEN', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('080f8541-9f5f-442d-8440-1ac35cbe7b0f', 'IPM', 'USRRESTBE', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('89b9fc84-724a-46c6-be94-e8885383ea3a', 'IPM', 'USRSTRGEN', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('d5f0a182-f78a-447d-a200-80bbbe3806b6', 'IPM', 'USRSTRWOO', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('b978cd9c-4fbf-48ea-bb43-2d7a71fb571b', 'IPM', 'USRFORMAG', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('c302f1ee-80e1-4fe5-94b9-faa89973b6cd', 'IPM', 'VENDDOM100', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('d3c4b0a5-b1a5-4ece-a25a-6371458c837d', 'IPM', 'VENDGENCO', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('32baaa6c-2cec-4ca4-a024-085fd7c1c289', 'IPM', 'VENDGENDOM', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('91bd91b3-c01e-4a98-afdd-9f16a969315b', 'IPM', 'USAERIALDR', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('2e8e4ee3-5af5-42bc-b25d-7d781b0a8568', 'IPM', 'USRAGRICU', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('330b697d-8665-4a40-9f46-0c404b1aa7d0', 'IPM', 'USAGRISGAR', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('b2948ee7-c61c-4ecd-a0ca-8268e7f93f90', 'IPM', 'USAQUACULT', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('c7ae9bdd-6a19-4734-af67-495deda5482c', 'IPM', 'USAFMGTION', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('a96d8302-14d5-4bc1-86ba-5bacf982e9ea', 'IPM', 'USINDSTVEG', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('dae90341-a3d1-43d9-96e1-78fdb4b38158', 'IPM', 'USSTRCSGAR', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('a27e2b67-6b21-4f14-b9a8-413c3b33b4e0', 'OTHER', 'NONE', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.schedule_sector_xref VALUES ('469bb4d4-bdce-46ac-9f59-bb4287eb115b', 'RECYCLING', 'NONE', true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');


--
-- Data for Name: sector_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.sector_code VALUES ('ABRASIVESI', 'ABRASIVESI', 'Abrasives industry', 10, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('ALUMINUMPR', 'ALUMINUMPR', 'Aluminum and aluminum alloy products industry', 30, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('ASBESTOSMI', 'ASBESTOSMI', 'Asbestos mining industry', 70, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('ASPHALTROO', 'ASPHALTROO', 'Asphalt roof manufacturing industry', 90, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('BIOTECHIN', 'BIOTECHIN', 'Biotechnology industry', 110, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('BURNVEGED', 'BURNVEGED', 'Burning of vegetative debris', 120, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('BURNWASTE', 'BURNWASTE', 'Burning or incineration of waste', 130, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('BURNWOODR', 'BURNWOODR', 'Burning or incineration of wood residue', 140, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('CEMENTLIME', 'CEMENTLIME', 'Cement and lime manufacturing industry', 150, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('CHEMPRIND', 'CHEMPRIND', 'Chemical and chemical products industry', 160, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('CLAYINDUST', 'CLAYINDUST', 'Clay industry', 170, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('COMWASTEIN', 'COMWASTEIN', 'Commercial waste management or waste disposal industry', 190, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('CONTSITEM', 'CONTSITEM', 'Contaminated site contaminant management', 220, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('DAIRYPROD', 'DAIRYPROD', 'Dairy products industry', 230, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('ELECPRODI', 'ELECPRODI', 'Electrical or electronic products industry', 250, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('ELECPOWER', 'ELECPOWER', 'Electrical power industry', 260, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('FLOURFEED', 'FLOURFEED', 'Flour, prepared cereal food and feed industry', 280, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('GLASSPROD', 'GLASSPROD', 'Glass and glass products industry', 300, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('HAZWASTEM', 'HAZWASTEM', 'Hazardous waste management', 310, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('INDFASTEN', 'INDFASTEN', 'Industrial fastener industry', 320, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('METALPROC', 'METALPROC', 'Metal processing and metal products manufacturing industry', 350, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('METALSMEL', 'METALSMEL', 'Metal smelting, iron and steel foundry and metal refining industry', 360, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('MININGCOA', 'MININGCOA', 'Mining and coal mining industry', 370, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('MUNSEWMAN', 'MUNSEWMAN', 'Municipal sewage management', 380, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('MUNSOLWST', 'MUNSOLWST', 'Municipal solid waste management', 390, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('MUNWASTEI', 'MUNWASTEI', 'Municipal waste incineration or burning industry', 400, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('NONMETMIN', 'NONMETMIN', 'Non-metallic mineral products industry', 420, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('OILNATGASL', 'OILNATGASL', 'Oil and natural gas industry - large', 430, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('OZONEMANG', 'OZONEMANG', 'Ozone depleting substances and other halocarbons management', 450, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('PAPERBOAR', 'PAPERBOAR', 'Paperboard industry', 470, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('PAPERINDU', 'PAPERINDU', 'Paper industry', 460, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('PARTWAFAI', 'PARTWAFAI', 'Particle and wafer board industry', 480, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('PIPETRANA', 'PIPETRANA', 'Pipeline transport industry with approved operating plan', 500, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('PLASTRESI', 'PLASTRESI', 'Plastic and synthetic resin manufacturing industry', 530, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('PULPINDUST', 'PULPINDUST', 'Pulp industry', 570, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('REFPETPRO', 'REFPETPRO', 'Refined petroleum and coal products industry', 580, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('MEATBYPROD', 'MEATBYPROD', 'Meat by-product processing industry', 340, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('SUGARPROD', 'SUGARPROD', 'Sugar processing and refining industry', 620, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('VENEERPLY', 'VENEERPLY', 'Veneer and plywood industry', 990, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('AGRICULOP', 'AGRICULOP', 'Agricultural operations', 20, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('ANTICHEMM', 'ANTICHEMM', 'Antisapstain chemicals management', 40, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('AQUALANDI', 'AQUALANDI', 'Aquaculture - land-based industry', 50, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('AQUAMARINE', 'AQUAMARINE', 'Aquaculture - marine-based industry', 60, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('ASPHALTPI', 'ASPHALTPI', 'Asphalt plant industry', 80, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('BEVERAGEIN', 'BEVERAGEIN', 'Beverage industry', 100, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('COALGASIN', 'COALGASIN', 'Coalbed gas exploration and production industry', 180, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('COMPOSTIN', 'COMPOSTIN', 'Composting operations', 200, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('CONCRETEP', 'CONCRETEP', 'Concrete and concrete products industry', 210, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('DEEPWELLD', 'DEEPWELLD', 'Deep well disposal', 240, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('FISHPRODI', 'FISHPRODI', 'Fish products industry', 270, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('FRUITVEGI', 'FRUITVEGI', 'Fruit and vegetable processing industry', 290, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('NONHAZWST', 'NONHAZWST', 'Industrial non-hazardous waste landfills', 330, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('NORADMATM', 'NORADMATM', 'Naturally occurring radioactive materials management', 410, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('OILNATGSS', 'OILNATGSS', 'Oil and natural gas industry - small', 440, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('PETROSTOR', 'PETROSTOR', 'Petroleum storage', 490, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('PIPETRANI', 'PIPETRANI', 'Pipeline transport industry', 510, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('PLACERMIN', 'PLACERMIN', 'Placer mining industry', 520, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('PLASTCOMP', 'PLASTCOMP', 'Plastics and composite products industry', 540, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('POULTRYPR', 'POULTRYPR', 'Poultry processing industry', 550, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('PRODSTORAG', 'PRODSTORAG', 'Product storage - bulk solids', 560, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('SLAUGHTER', 'SLAUGHTER', 'Slaughter industry', 600, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('SOILENHAN', 'SOILENHAN', 'Soil enhancement using wastes', 610, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('VEHDISREC', 'VEHDISREC', 'Vehicle dismantling and recycling industry', 920, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('VEHINDPAR', 'VEHINDPAR', 'Vehicle, industrial machinery and parts and accessories manufacturing industry', 930, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('WOODPRIMA', 'WOODPRIMA', 'Wood processing industry - primary', 1000, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('WOODSECON', 'WOODSECON', 'Wood processing industry - secondary', 1010, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('WOODTREIN', 'WOODTREIN', 'Wood treatment industry', 1020, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('NONE', 'None', 'None', 1030, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('USRAERGEN', 'USRAERGEN', 'Aerial', 630, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('USAERIALDR', 'USAERIALDR', 'Aerial - Drones', 635, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('USRAGRICU', 'USRAGRICU', 'Agriculture', 643, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('USAGRISGAR', 'USAGRISGAR', 'Agriculture - SGARs', 645, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('USAQUACULT', 'USAQUACULT', 'Aquaculture', 655, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('USRRESTBE', 'USRRESTBE', 'Commercial beekeeping', 665, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('VENDGENCO', 'VENDGENCO', 'Commercial pesticides', 667, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('VENDDOM100', 'VENDDOM100', 'Domestic and up to 100 kg commercial pesticides', 668, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('VENDGENDOM', 'VENDGENDOM', 'Domestic pesticides', 669, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('USRFORMAG', 'USRFORMAG', 'Forestry', 675, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('USAFMGTION', 'USAFMGTION', 'Fumigation', 695, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('USINDSTVEG', 'USINDSTVEG', 'Industrial vegetation', 710, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('USRINDGEN', 'USRINDGEN', 'Industrial vegetation and noxious weeds', 740, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('USRLANDGEN', 'USRLANDGEN', 'Landscape', 750, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('USRMOSBIT', 'USRMOSBIT', 'Mosquito', 760, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('USRNOXGEN', 'USRNOXGEN', 'Noxious weed', 800, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('USRSTRGEN', 'USRSTRGEN', 'Structural', 850, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('USRSTRWOO', 'USRSTRWOO', 'Structural – Industrial wood preservation', 860, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');
INSERT INTO complaint_outcome.sector_code VALUES ('USSTRCSGAR', 'USSTRCSGAR', 'Structural – SGARs', 865, true, 'postgres', '2025-09-10 20:06:55.81104', 'postgres', '2025-09-10 20:06:55.81104');


--
-- Data for Name: sex_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.sex_code VALUES ('M', 'Male', 'Male', 1, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');
INSERT INTO complaint_outcome.sex_code VALUES ('F', 'Female', 'Female', 2, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');
INSERT INTO complaint_outcome.sex_code VALUES ('U', 'Unknown', 'Unknown', 3, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');


--
-- Data for Name: site; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Data for Name: site_h; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Data for Name: threat_level_code; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--

INSERT INTO complaint_outcome.threat_level_code VALUES ('1', 'Category 1', 'Category 1', 1, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');
INSERT INTO complaint_outcome.threat_level_code VALUES ('2', 'Category 2', 'Category 2', 2, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');
INSERT INTO complaint_outcome.threat_level_code VALUES ('3', 'Category 3', 'Category 3', 3, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');
INSERT INTO complaint_outcome.threat_level_code VALUES ('U', 'Unknown', 'Unknown', 4, true, 'FLYWAY', '2025-09-10 20:06:53.588724', 'FLYWAY', '2025-09-10 20:06:53.588724');


--
-- Data for Name: wildlife; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Data for Name: wildlife_h; Type: TABLE DATA; Schema: complaint_outcome; Owner: -
--



--
-- Name: USER_SEQ; Type: SEQUENCE SET; Schema: complaint_outcome; Owner: -
--

SELECT pg_catalog.setval('complaint_outcome."USER_SEQ"', 6, false);


--
-- Name: action_code PK_action_code; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.action_code
    ADD CONSTRAINT "PK_action_code" PRIMARY KEY (action_code);


--
-- Name: action PK_action_guid; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.action
    ADD CONSTRAINT "PK_action_guid" PRIMARY KEY (action_guid);


--
-- Name: action_type_action_xref PK_action_type_action_xref_guid; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.action_type_action_xref
    ADD CONSTRAINT "PK_action_type_action_xref_guid" PRIMARY KEY (action_type_action_xref_guid);


--
-- Name: action_type_code PK_action_type_code; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.action_type_code
    ADD CONSTRAINT "PK_action_type_code" PRIMARY KEY (action_type_code);


--
-- Name: age_code PK_agecode; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.age_code
    ADD CONSTRAINT "PK_agecode" PRIMARY KEY (age_code);


--
-- Name: outcome_agency_code PK_agency_code; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.outcome_agency_code
    ADD CONSTRAINT "PK_agency_code" PRIMARY KEY (outcome_agency_code);


--
-- Name: assessment PK_assessment_guid; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.assessment
    ADD CONSTRAINT "PK_assessment_guid" PRIMARY KEY (assessment_guid);


--
-- Name: authorization_permit PK_authorization_permit_guid; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.authorization_permit
    ADD CONSTRAINT "PK_authorization_permit_guid" PRIMARY KEY (authorization_permit_guid);


--
-- Name: complaint_outcome PK_case_file_guid; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.complaint_outcome
    ADD CONSTRAINT "PK_case_file_guid" PRIMARY KEY (complaint_outcome_guid);


--
-- Name: case_location_code PK_case_location_code; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.case_location_code
    ADD CONSTRAINT "PK_case_location_code" PRIMARY KEY (case_location_code);


--
-- Name: case_note PK_case_note_guid; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.case_note
    ADD CONSTRAINT "PK_case_note_guid" PRIMARY KEY (case_note_guid);


--
-- Name: conflict_history_code PK_cnfthistcd; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.conflict_history_code
    ADD CONSTRAINT "PK_cnfthistcd" PRIMARY KEY (conflict_history_code);


--
-- Name: decision PK_decision_guid; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.decision
    ADD CONSTRAINT "PK_decision_guid" PRIMARY KEY (decision_guid);


--
-- Name: discharge_code PK_discharge_code; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.discharge_code
    ADD CONSTRAINT "PK_discharge_code" PRIMARY KEY (discharge_code);


--
-- Name: drug_method_code PK_drgmethdcd; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.drug_method_code
    ADD CONSTRAINT "PK_drgmethdcd" PRIMARY KEY (drug_method_code);


--
-- Name: drug_remaining_outcome_code PK_drgrmotccd; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.drug_remaining_outcome_code
    ADD CONSTRAINT "PK_drgrmotccd" PRIMARY KEY (drug_remaining_outcome_code);


--
-- Name: drug_administered PK_drug_administered_guid; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.drug_administered
    ADD CONSTRAINT "PK_drug_administered_guid" PRIMARY KEY (drug_administered_guid);


--
-- Name: drug_code PK_drugcode; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.drug_code
    ADD CONSTRAINT "PK_drugcode" PRIMARY KEY (drug_code);


--
-- Name: ear_tag PK_ear_tag_guid; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.ear_tag
    ADD CONSTRAINT "PK_ear_tag_guid" PRIMARY KEY (ear_tag_guid);


--
-- Name: ear_code PK_earcode; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.ear_code
    ADD CONSTRAINT "PK_earcode" PRIMARY KEY (ear_code);


--
-- Name: equipment PK_equipment_guid; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.equipment
    ADD CONSTRAINT "PK_equipment_guid" PRIMARY KEY (equipment_guid);


--
-- Name: equipment_status_code PK_equipment_status_code; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.equipment_status_code
    ADD CONSTRAINT "PK_equipment_status_code" PRIMARY KEY (equipment_status_code);


--
-- Name: equipment_code PK_equipmntcd; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.equipment_code
    ADD CONSTRAINT "PK_equipmntcd" PRIMARY KEY (equipment_code);


--
-- Name: action_h PK_h_action; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.action_h
    ADD CONSTRAINT "PK_h_action" PRIMARY KEY (h_action_guid);


--
-- Name: assessment_h PK_h_assessment; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.assessment_h
    ADD CONSTRAINT "PK_h_assessment" PRIMARY KEY (h_assessment_guid);


--
-- Name: authorization_permit_h PK_h_authorization_permit; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.authorization_permit_h
    ADD CONSTRAINT "PK_h_authorization_permit" PRIMARY KEY (h_authorization_permit_guid);


--
-- Name: complaint_outcome_h PK_h_case_file; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.complaint_outcome_h
    ADD CONSTRAINT "PK_h_case_file" PRIMARY KEY (h_complaint_outcome_guid);


--
-- Name: configuration_h PK_h_configuration; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.configuration_h
    ADD CONSTRAINT "PK_h_configuration" PRIMARY KEY (h_configuration_guid);


--
-- Name: decision_h PK_h_decision; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.decision_h
    ADD CONSTRAINT "PK_h_decision" PRIMARY KEY (h_decision_guid);


--
-- Name: drug_administered_h PK_h_drug_administered; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.drug_administered_h
    ADD CONSTRAINT "PK_h_drug_administered" PRIMARY KEY (h_drug_administered_guid);


--
-- Name: ear_tag_h PK_h_ear_tag; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.ear_tag_h
    ADD CONSTRAINT "PK_h_ear_tag" PRIMARY KEY (h_ear_tag_guid);


--
-- Name: equipment_h PK_h_equipment; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.equipment_h
    ADD CONSTRAINT "PK_h_equipment" PRIMARY KEY (h_equipment_guid);


--
-- Name: site_h PK_h_site; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.site_h
    ADD CONSTRAINT "PK_h_site" PRIMARY KEY (h_site_guid);


--
-- Name: wildlife_h PK_h_wildlife; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.wildlife_h
    ADD CONSTRAINT "PK_h_wildlife" PRIMARY KEY (h_wildlife_guid);


--
-- Name: hwcr_outcome_actioned_by_code PK_hwc_outcome_actioned_by_code; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.hwcr_outcome_actioned_by_code
    ADD CONSTRAINT "PK_hwc_outcome_actioned_by_code" PRIMARY KEY (hwcr_outcome_actioned_by_code);


--
-- Name: hwcr_outcome_code PK_hwcrotcmcd; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.hwcr_outcome_code
    ADD CONSTRAINT "PK_hwcrotcmcd" PRIMARY KEY (hwcr_outcome_code);


--
-- Name: inaction_reason_code PK_inaction_reason_code; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.inaction_reason_code
    ADD CONSTRAINT "PK_inaction_reason_code" PRIMARY KEY (inaction_reason_code);


--
-- Name: ipm_auth_category_code PK_ipm_auth_category_code; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.ipm_auth_category_code
    ADD CONSTRAINT "PK_ipm_auth_category_code" PRIMARY KEY (ipm_auth_category_code);


--
-- Name: non_compliance_decision_matrix_code PK_non_compliance_decision_matrix_code; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.non_compliance_decision_matrix_code
    ADD CONSTRAINT "PK_non_compliance_decision_matrix_code" PRIMARY KEY (non_compliance_decision_matrix_code);


--
-- Name: prevention_education PK_prevention_education_guid; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.prevention_education
    ADD CONSTRAINT "PK_prevention_education_guid" PRIMARY KEY (prevention_education_guid);


--
-- Name: schedule_code PK_schedule_code; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.schedule_code
    ADD CONSTRAINT "PK_schedule_code" PRIMARY KEY (schedule_code);


--
-- Name: schedule_sector_xref PK_schedule_sector_xref_guid; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.schedule_sector_xref
    ADD CONSTRAINT "PK_schedule_sector_xref_guid" PRIMARY KEY (schedule_sector_xref_guid);


--
-- Name: sector_code PK_sector_code; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.sector_code
    ADD CONSTRAINT "PK_sector_code" PRIMARY KEY (sector_code);


--
-- Name: sex_code PK_sexcode; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.sex_code
    ADD CONSTRAINT "PK_sexcode" PRIMARY KEY (sex_code);


--
-- Name: site PK_site_guid; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.site
    ADD CONSTRAINT "PK_site_guid" PRIMARY KEY (site_guid);


--
-- Name: threat_level_code PK_thrtlvlcd; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.threat_level_code
    ADD CONSTRAINT "PK_thrtlvlcd" PRIMARY KEY (threat_level_code);


--
-- Name: wildlife PK_wildlife_guid; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.wildlife
    ADD CONSTRAINT "PK_wildlife_guid" PRIMARY KEY (wildlife_guid);


--
-- Name: action_type_action_xref UK_action_type_action_xref__action_type_code__action_code; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.action_type_action_xref
    ADD CONSTRAINT "UK_action_type_action_xref__action_type_code__action_code" UNIQUE (action_type_code, action_code);


--
-- Name: configuration configuration_pk; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.configuration
    ADD CONSTRAINT configuration_pk PRIMARY KEY (configuration_code);




--
-- Name: schedule_sector_xref uk_schedule_sector_xref__schedule_sector; Type: CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.schedule_sector_xref
    ADD CONSTRAINT uk_schedule_sector_xref__schedule_sector UNIQUE (schedule_code, sector_code);



--
-- Name: action_code actcd_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER actcd_set_default_audit_values BEFORE UPDATE ON complaint_outcome.action_code FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: action action_history_trigger; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER action_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON complaint_outcome.action FOR EACH ROW EXECUTE FUNCTION complaint_outcome.audit_history('action_h', 'action_guid');


--
-- Name: action_type_action_xref acttpactxref_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER acttpactxref_set_default_audit_values BEFORE UPDATE ON complaint_outcome.action_type_action_xref FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: action_type_code acttpcd_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER acttpcd_set_default_audit_values BEFORE UPDATE ON complaint_outcome.action_type_code FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: age_code agecode_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER agecode_set_default_audit_values BEFORE UPDATE ON complaint_outcome.age_code FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: outcome_agency_code agencycd_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER agencycd_set_default_audit_values BEFORE UPDATE ON complaint_outcome.outcome_agency_code FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: assessment assessment_history_trigger; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER assessment_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON complaint_outcome.assessment FOR EACH ROW EXECUTE FUNCTION complaint_outcome.audit_history('assessment_h', 'assessment_guid');


--
-- Name: authorization_permit auth_permit_history_trigger; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER auth_permit_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON complaint_outcome.authorization_permit FOR EACH ROW EXECUTE FUNCTION complaint_outcome.audit_history('authorization_permit_h', 'authorization_permit_guid');


--
-- Name: case_location_code caselcncd_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER caselcncd_set_default_audit_values BEFORE UPDATE ON complaint_outcome.case_location_code FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: conflict_history_code cnfthistcd_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER cnfthistcd_set_default_audit_values BEFORE UPDATE ON complaint_outcome.conflict_history_code FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: complaint_outcome complaint_outcome_history_trigger; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER complaint_outcome_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON complaint_outcome.complaint_outcome FOR EACH ROW EXECUTE FUNCTION complaint_outcome.audit_history('complaint_outcome_h', 'complaint_outcome_guid');


--
-- Name: configuration configuration_history_trigger; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER configuration_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON complaint_outcome.configuration FOR EACH ROW EXECUTE FUNCTION complaint_outcome.audit_history('configuration_h', 'configuration_code');


--
-- Name: decision decision_history_trigger; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER decision_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON complaint_outcome.decision FOR EACH ROW EXECUTE FUNCTION complaint_outcome.audit_history('decision_h', 'decision_guid');


--
-- Name: discharge_code dischargecd_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER dischargecd_set_default_audit_values BEFORE UPDATE ON complaint_outcome.discharge_code FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: drug_method_code drgmethdcd_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER drgmethdcd_set_default_audit_values BEFORE UPDATE ON complaint_outcome.drug_method_code FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: drug_remaining_outcome_code drgrmotmcd_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER drgrmotmcd_set_default_audit_values BEFORE UPDATE ON complaint_outcome.drug_remaining_outcome_code FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: drug_administered drug_administered_history_trigger; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER drug_administered_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON complaint_outcome.drug_administered FOR EACH ROW EXECUTE FUNCTION complaint_outcome.audit_history('drug_administered_h', 'drug_administered_guid');


--
-- Name: drug_code drugcd_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER drugcd_set_default_audit_values BEFORE UPDATE ON complaint_outcome.drug_code FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: ear_tag ear_tag_history_trigger; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER ear_tag_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON complaint_outcome.ear_tag FOR EACH ROW EXECUTE FUNCTION complaint_outcome.audit_history('ear_tag_h', 'ear_tag_guid');


--
-- Name: ear_code earcode_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER earcode_set_default_audit_values BEFORE UPDATE ON complaint_outcome.ear_code FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: equipment equipment_history_trigger; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER equipment_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON complaint_outcome.equipment FOR EACH ROW EXECUTE FUNCTION complaint_outcome.audit_history('equipment_h', 'equipment_guid');


--
-- Name: equipment_code equipmntcd_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER equipmntcd_set_default_audit_values BEFORE UPDATE ON complaint_outcome.equipment_code FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: equipment_status_code equipmntstcd_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER equipmntstcd_set_default_audit_values BEFORE UPDATE ON complaint_outcome.equipment_status_code FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: hwcr_outcome_actioned_by_code hwcotcmactbycd_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER hwcotcmactbycd_set_default_audit_values BEFORE UPDATE ON complaint_outcome.hwcr_outcome_actioned_by_code FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: inaction_reason_code inactnrsncd_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER inactnrsncd_set_default_audit_values BEFORE UPDATE ON complaint_outcome.inaction_reason_code FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: ipm_auth_category_code ipmathctgrcd_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER ipmathctgrcd_set_default_audit_values BEFORE UPDATE ON complaint_outcome.ipm_auth_category_code FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: non_compliance_decision_matrix_code noncompdnmtxcd_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER noncompdnmtxcd_set_default_audit_values BEFORE UPDATE ON complaint_outcome.non_compliance_decision_matrix_code FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: schedule_code schlcd_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER schlcd_set_default_audit_values BEFORE UPDATE ON complaint_outcome.schedule_code FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: sex_code sexcd_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER sexcd_set_default_audit_values BEFORE UPDATE ON complaint_outcome.sex_code FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: schedule_sector_xref shlstrxref_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER shlstrxref_set_default_audit_values BEFORE UPDATE ON complaint_outcome.schedule_sector_xref FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: site site_history_trigger; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER site_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON complaint_outcome.site FOR EACH ROW EXECUTE FUNCTION complaint_outcome.audit_history('site_h', 'site_guid');


--
-- Name: sector_code strcd_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER strcd_set_default_audit_values BEFORE UPDATE ON complaint_outcome.sector_code FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: threat_level_code thrtlvlcd_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER thrtlvlcd_set_default_audit_values BEFORE UPDATE ON complaint_outcome.threat_level_code FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: wildlife wildlife_history_trigger; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER wildlife_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON complaint_outcome.wildlife FOR EACH ROW EXECUTE FUNCTION complaint_outcome.audit_history('wildlife_h', 'wildlife_guid');


--
-- Name: wildlife wldlf_set_default_audit_values; Type: TRIGGER; Schema: complaint_outcome; Owner: -
--

CREATE TRIGGER wldlf_set_default_audit_values BEFORE UPDATE ON complaint_outcome.wildlife FOR EACH ROW EXECUTE FUNCTION complaint_outcome.update_audit_columns();


--
-- Name: action FK_action__case_guid; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.action
    ADD CONSTRAINT "FK_action__case_guid" FOREIGN KEY (complaint_outcome_guid) REFERENCES complaint_outcome.complaint_outcome(complaint_outcome_guid);


--
-- Name: action FK_action__case_note_guid; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.action
    ADD CONSTRAINT "FK_action__case_note_guid" FOREIGN KEY (case_note_guid) REFERENCES complaint_outcome.case_note(case_note_guid);


--
-- Name: action FK_action_action_type_action_xref; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.action
    ADD CONSTRAINT "FK_action_action_type_action_xref" FOREIGN KEY (action_type_action_xref_guid) REFERENCES complaint_outcome.action_type_action_xref(action_type_action_xref_guid);


--
-- Name: action_type_action_xref FK_action_type_action_xref__action_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.action_type_action_xref
    ADD CONSTRAINT "FK_action_type_action_xref__action_code" FOREIGN KEY (action_code) REFERENCES complaint_outcome.action_code(action_code);


--
-- Name: action_type_action_xref FK_action_type_action_xref__action_type_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.action_type_action_xref
    ADD CONSTRAINT "FK_action_type_action_xref__action_type_code" FOREIGN KEY (action_type_code) REFERENCES complaint_outcome.action_type_code(action_type_code);


--
-- Name: assessment FK_assessment__assessed_by_agency_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.assessment
    ADD CONSTRAINT "FK_assessment__assessed_by_agency_code" FOREIGN KEY (outcome_agency_code) REFERENCES complaint_outcome.outcome_agency_code(outcome_agency_code);


--
-- Name: assessment FK_assessment__inaction_reason_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.assessment
    ADD CONSTRAINT "FK_assessment__inaction_reason_code" FOREIGN KEY (inaction_reason_code) REFERENCES complaint_outcome.inaction_reason_code(inaction_reason_code);


--
-- Name: complaint_outcome FK_case_file__owned_by_agency_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.complaint_outcome
    ADD CONSTRAINT "FK_case_file__owned_by_agency_code" FOREIGN KEY (owned_by_agency_code) REFERENCES complaint_outcome.outcome_agency_code(outcome_agency_code);


--
-- Name: case_note FK_case_note__agency_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.case_note
    ADD CONSTRAINT "FK_case_note__agency_code" FOREIGN KEY (outcome_agency_code) REFERENCES complaint_outcome.outcome_agency_code(outcome_agency_code);


--
-- Name: case_note FK_case_note__case_file_guid; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.case_note
    ADD CONSTRAINT "FK_case_note__case_file_guid" FOREIGN KEY (complaint_outcome_guid) REFERENCES complaint_outcome.complaint_outcome(complaint_outcome_guid);


--
-- Name: hwcr_outcome_actioned_by_code FK_hwc_outcome_actioned_by__agency_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.hwcr_outcome_actioned_by_code
    ADD CONSTRAINT "FK_hwc_outcome_actioned_by__agency_code" FOREIGN KEY (outcome_agency_code) REFERENCES complaint_outcome.outcome_agency_code(outcome_agency_code);


--
-- Name: inaction_reason_code FK_inaction_reason_code__agency_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.inaction_reason_code
    ADD CONSTRAINT "FK_inaction_reason_code__agency_code" FOREIGN KEY (outcome_agency_code) REFERENCES complaint_outcome.outcome_agency_code(outcome_agency_code);


--
-- Name: prevention_education FK_prevention_education__agency_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.prevention_education
    ADD CONSTRAINT "FK_prevention_education__agency_code" FOREIGN KEY (outcome_agency_code) REFERENCES complaint_outcome.outcome_agency_code(outcome_agency_code);


--
-- Name: prevention_education FK_prevention_education__case_file_guid; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.prevention_education
    ADD CONSTRAINT "FK_prevention_education__case_file_guid" FOREIGN KEY (complaint_outcome_guid) REFERENCES complaint_outcome.complaint_outcome(complaint_outcome_guid);


--
-- Name: action action_assessment_guid_fkey; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.action
    ADD CONSTRAINT action_assessment_guid_fkey FOREIGN KEY (assessment_guid) REFERENCES complaint_outcome.assessment(assessment_guid);


--
-- Name: action action_prevention_education_guid_fkey; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.action
    ADD CONSTRAINT action_prevention_education_guid_fkey FOREIGN KEY (prevention_education_guid) REFERENCES complaint_outcome.prevention_education(prevention_education_guid);


--
-- Name: assessment assessment_case_file_guid_fkey; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.assessment
    ADD CONSTRAINT assessment_case_file_guid_fkey FOREIGN KEY (complaint_outcome_guid) REFERENCES complaint_outcome.complaint_outcome(complaint_outcome_guid);


--
-- Name: action fk_action__decision_guid; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.action
    ADD CONSTRAINT fk_action__decision_guid FOREIGN KEY (decision_guid) REFERENCES complaint_outcome.decision(decision_guid);


--
-- Name: action fk_action__equipment_guid; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.action
    ADD CONSTRAINT fk_action__equipment_guid FOREIGN KEY (equipment_guid) REFERENCES complaint_outcome.equipment(equipment_guid);


--
-- Name: action fk_action__wildlife_guid; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.action
    ADD CONSTRAINT fk_action__wildlife_guid FOREIGN KEY (wildlife_guid) REFERENCES complaint_outcome.wildlife(wildlife_guid);


--
-- Name: assessment fk_assessment__case_conflict_history_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.assessment
    ADD CONSTRAINT fk_assessment__case_conflict_history_code FOREIGN KEY (case_conflict_history_code) REFERENCES complaint_outcome.conflict_history_code(conflict_history_code);


--
-- Name: assessment fk_assessment__case_location_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.assessment
    ADD CONSTRAINT fk_assessment__case_location_code FOREIGN KEY (case_location_code) REFERENCES complaint_outcome.case_location_code(case_location_code);


--
-- Name: assessment fk_assessment__case_threat_level_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.assessment
    ADD CONSTRAINT fk_assessment__case_threat_level_code FOREIGN KEY (case_threat_level_code) REFERENCES complaint_outcome.threat_level_code(threat_level_code);


--
-- Name: authorization_permit fk_authorization_permit__case_file_guid; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.authorization_permit
    ADD CONSTRAINT fk_authorization_permit__case_file_guid FOREIGN KEY (complaint_outcome_guid) REFERENCES complaint_outcome.complaint_outcome(complaint_outcome_guid);


--
-- Name: decision fk_decision__case_file_guid; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.decision
    ADD CONSTRAINT fk_decision__case_file_guid FOREIGN KEY (complaint_outcome_guid) REFERENCES complaint_outcome.complaint_outcome(complaint_outcome_guid);


--
-- Name: decision fk_decision__discharge_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.decision
    ADD CONSTRAINT fk_decision__discharge_code FOREIGN KEY (discharge_code) REFERENCES complaint_outcome.discharge_code(discharge_code);


--
-- Name: decision fk_decision__ipm_auth_category_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.decision
    ADD CONSTRAINT fk_decision__ipm_auth_category_code FOREIGN KEY (ipm_auth_category_code) REFERENCES complaint_outcome.ipm_auth_category_code(ipm_auth_category_code);


--
-- Name: decision fk_decision__lead_agency_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.decision
    ADD CONSTRAINT fk_decision__lead_agency_code FOREIGN KEY (outcome_agency_code) REFERENCES complaint_outcome.outcome_agency_code(outcome_agency_code);


--
-- Name: decision fk_decision__ncdm_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.decision
    ADD CONSTRAINT fk_decision__ncdm_code FOREIGN KEY (non_compliance_decision_matrix_code) REFERENCES complaint_outcome.non_compliance_decision_matrix_code(non_compliance_decision_matrix_code);


--
-- Name: decision fk_decision__schedule_sector_xref_guid; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.decision
    ADD CONSTRAINT fk_decision__schedule_sector_xref_guid FOREIGN KEY (schedule_sector_xref_guid) REFERENCES complaint_outcome.schedule_sector_xref(schedule_sector_xref_guid);


--
-- Name: drug_administered fk_drug_administered__drug_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.drug_administered
    ADD CONSTRAINT fk_drug_administered__drug_code FOREIGN KEY (drug_code) REFERENCES complaint_outcome.drug_code(drug_code);


--
-- Name: drug_administered fk_drug_administered__drug_method_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.drug_administered
    ADD CONSTRAINT fk_drug_administered__drug_method_code FOREIGN KEY (drug_method_code) REFERENCES complaint_outcome.drug_method_code(drug_method_code);


--
-- Name: drug_administered fk_drug_administered__drug_remaining_outcome_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.drug_administered
    ADD CONSTRAINT fk_drug_administered__drug_remaining_outcome_code FOREIGN KEY (drug_remaining_outcome_code) REFERENCES complaint_outcome.drug_remaining_outcome_code(drug_remaining_outcome_code);


--
-- Name: drug_administered fk_drug_administered__wildlife_guid; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.drug_administered
    ADD CONSTRAINT fk_drug_administered__wildlife_guid FOREIGN KEY (wildlife_guid) REFERENCES complaint_outcome.wildlife(wildlife_guid);


--
-- Name: ear_tag fk_ear_tag__ear_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.ear_tag
    ADD CONSTRAINT fk_ear_tag__ear_code FOREIGN KEY (ear_code) REFERENCES complaint_outcome.ear_code(ear_code);


--
-- Name: ear_tag fk_ear_tag__wildlife_guid; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.ear_tag
    ADD CONSTRAINT fk_ear_tag__wildlife_guid FOREIGN KEY (wildlife_guid) REFERENCES complaint_outcome.wildlife(wildlife_guid);


--
-- Name: equipment fk_equipment__equipment_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.equipment
    ADD CONSTRAINT fk_equipment__equipment_code FOREIGN KEY (equipment_code) REFERENCES complaint_outcome.equipment_code(equipment_code);


--
-- Name: schedule_sector_xref fk_schedule_sector_xref__schedule_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.schedule_sector_xref
    ADD CONSTRAINT fk_schedule_sector_xref__schedule_code FOREIGN KEY (schedule_code) REFERENCES complaint_outcome.schedule_code(schedule_code);


--
-- Name: schedule_sector_xref fk_schedule_sector_xref__sector_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.schedule_sector_xref
    ADD CONSTRAINT fk_schedule_sector_xref__sector_code FOREIGN KEY (sector_code) REFERENCES complaint_outcome.sector_code(sector_code);


--
-- Name: site fk_site__case_file_guid; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.site
    ADD CONSTRAINT fk_site__case_file_guid FOREIGN KEY (complaint_outcome_guid) REFERENCES complaint_outcome.complaint_outcome(complaint_outcome_guid);


--
-- Name: wildlife fk_wildlife__age_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.wildlife
    ADD CONSTRAINT fk_wildlife__age_code FOREIGN KEY (age_code) REFERENCES complaint_outcome.age_code(age_code);


--
-- Name: wildlife fk_wildlife__case_file_guid; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.wildlife
    ADD CONSTRAINT fk_wildlife__case_file_guid FOREIGN KEY (complaint_outcome_guid) REFERENCES complaint_outcome.complaint_outcome(complaint_outcome_guid);


--
-- Name: wildlife fk_wildlife__hwcr_outcome_actioned_by_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.wildlife
    ADD CONSTRAINT fk_wildlife__hwcr_outcome_actioned_by_code FOREIGN KEY (hwcr_outcome_actioned_by_code) REFERENCES complaint_outcome.hwcr_outcome_actioned_by_code(hwcr_outcome_actioned_by_code);


--
-- Name: wildlife fk_wildlife__hwcr_outcome_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.wildlife
    ADD CONSTRAINT fk_wildlife__hwcr_outcome_code FOREIGN KEY (hwcr_outcome_code) REFERENCES complaint_outcome.hwcr_outcome_code(hwcr_outcome_code);


--
-- Name: wildlife fk_wildlife__sex_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.wildlife
    ADD CONSTRAINT fk_wildlife__sex_code FOREIGN KEY (sex_code) REFERENCES complaint_outcome.sex_code(sex_code);


--
-- Name: wildlife fk_wildlife__threat_level_code; Type: FK CONSTRAINT; Schema: complaint_outcome; Owner: -
--

ALTER TABLE ONLY complaint_outcome.wildlife
    ADD CONSTRAINT fk_wildlife__threat_level_code FOREIGN KEY (threat_level_code) REFERENCES complaint_outcome.threat_level_code(threat_level_code);


--
-- PostgreSQL database dump complete
--

DO $$
BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_user WHERE usename = 'complaint_outcome') THEN
    CREATE USER complaint_outcome WITH PASSWORD '${COMPLAINT_OUTCOME_PASSWORD}';
END IF;
END $$;
