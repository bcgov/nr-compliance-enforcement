--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8 (Debian 15.8-1.pgdg110+1)
-- Dumped by pg_dump version 15.1

SET check_function_bodies = false;


--
-- Name: investigation; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA IF NOT EXISTS investigation;


--
-- Name: audit_history(); Type: FUNCTION; Schema: investigation; Owner: -
--

CREATE FUNCTION investigation.audit_history() RETURNS trigger
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
            'INSERT INTO investigation.%I (target_row_id, operation_type, operation_user_id, data_after_executed_operation) VALUES ($1.%I,  ''I'', $1.create_user_id, to_jsonb($1))',  target_history_table, target_pk
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
            'INSERT INTO investigation.%I (target_row_id, operation_type, operation_user_id, data_after_executed_operation) VALUES ($1.%I, ''U'', $1.update_user_id, to_jsonb($1))', target_history_table, target_pk
          )
        USING NEW;
      RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN

      EXECUTE
        format(
                'INSERT INTO investigation.%I (target_row_id, operation_type) VALUES ($1.%I, ''D'')', target_history_table, target_pk
        )
        USING OLD;
      RETURN OLD;

    END IF;
  END;
$_$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: investigation; Type: TABLE; Schema: investigation; Owner: -
--

CREATE TABLE investigation.investigation (
    investigation_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    investigation_description character varying(4000),
    owned_by_agency_ref character varying(10) NOT NULL,
    investigation_status character varying(10) NOT NULL,
    investigation_opened_utc_timestamp timestamp without time zone NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE investigation; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON TABLE investigation.investigation IS 'The central entity of the investigations system.';


--
-- Name: COLUMN investigation.investigation_guid; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation.investigation_guid IS 'System generated unique key for a case.  This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN investigation.investigation_description; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation.investigation_description IS 'A summary of the investigation as provided by users.';


--
-- Name: COLUMN investigation.owned_by_agency_ref; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation.owned_by_agency_ref IS 'A reference to the human readable code used to identify the agency that owns this case, found in the shared schema.';


--
-- Name: COLUMN investigation.investigation_opened_utc_timestamp; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation.investigation_opened_utc_timestamp IS 'UTC timestamp of when the investigation was started.';


--
-- Name: COLUMN investigation.create_user_id; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation.create_user_id IS 'The id of the user that created the case.';


--
-- Name: COLUMN investigation.create_utc_timestamp; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation.create_utc_timestamp IS 'The timestamp when the case was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN investigation.update_user_id; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation.update_user_id IS 'The id of the user that updated the case.';


--
-- Name: COLUMN investigation.update_utc_timestamp; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation.update_utc_timestamp IS 'The timestamp when the case was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: investigation_h; Type: TABLE; Schema: investigation; Owner: -
--

CREATE TABLE investigation.investigation_h (
    h_investigation_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: TABLE investigation_h; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON TABLE investigation.investigation_h IS 'History table for investigation table';


--
-- Name: COLUMN investigation_h.h_investigation_guid; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation_h.h_investigation_guid IS 'System generated unique key for investigation history. This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN investigation_h.target_row_id; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation_h.target_row_id IS 'The unique key for the investigation that has been created or modified.';


--
-- Name: COLUMN investigation_h.operation_type; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN investigation_h.operation_user_id; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation_h.operation_user_id IS 'The id of the user that created or modified the data in the investigation table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN investigation_h.operation_executed_at; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation_h.operation_executed_at IS 'The timestamp when the data in the investigation table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN investigation_h.data_after_executed_operation; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


--
-- Name: investigation_status_code; Type: TABLE; Schema: investigation; Owner: -
--

CREATE TABLE investigation.investigation_status_code (
    investigation_status_code character varying(10) NOT NULL,
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
-- Name: COLUMN investigation_status_code.investigation_status_code; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation_status_code.investigation_status_code IS 'A human readable code used to identify an investigation status.';


--
-- Name: COLUMN investigation_status_code.short_description; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation_status_code.short_description IS 'The short description of the investigation status code.';


--
-- Name: COLUMN investigation_status_code.long_description; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation_status_code.long_description IS 'The long description of the investigation status code.';


--
-- Name: COLUMN investigation_status_code.display_order; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation_status_code.display_order IS 'The order in which the values of the investigation status code table should be displayed when presented to a user in a list.';


--
-- Name: COLUMN investigation_status_code.active_ind; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation_status_code.active_ind IS 'A boolean indicator to determine if the investigation status code is active.';


--
-- Name: COLUMN investigation_status_code.create_user_id; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation_status_code.create_user_id IS 'The id of the user that created the investigation status code.';


--
-- Name: COLUMN investigation_status_code.create_utc_timestamp; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation_status_code.create_utc_timestamp IS 'The timestamp when the  investigation status code was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN investigation_status_code.update_user_id; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation_status_code.update_user_id IS 'The id of the user that updated the investigation status code.';


--
-- Name: COLUMN investigation_status_code.update_utc_timestamp; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation_status_code.update_utc_timestamp IS 'The timestamp when the investigation status code was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: investigation_status_code_h; Type: TABLE; Schema: investigation; Owner: -
--

CREATE TABLE investigation.investigation_status_code_h (
    h_investigation_status_code_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id character varying(20) NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: TABLE investigation_status_code_h; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON TABLE investigation.investigation_status_code_h IS 'History table for investigation_status_code table';


--
-- Name: COLUMN investigation_status_code_h.h_investigation_status_code_guid; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation_status_code_h.h_investigation_status_code_guid IS 'System generated unique key for investigation_status_code history. This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN investigation_status_code_h.target_row_id; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation_status_code_h.target_row_id IS 'The unique key for the investigation_status_code that has been created or modified.';


--
-- Name: COLUMN investigation_status_code_h.operation_type; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation_status_code_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN investigation_status_code_h.operation_user_id; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation_status_code_h.operation_user_id IS 'The id of the user that created or modified the data in the investigation_status_code table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN investigation_status_code_h.operation_executed_at; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation_status_code_h.operation_executed_at IS 'The timestamp when the data in the investigation_status_code table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN investigation_status_code_h.data_after_executed_operation; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.investigation_status_code_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


--
-- Name: officer_investigation_xref; Type: TABLE; Schema: investigation; Owner: -
--

CREATE TABLE investigation.officer_investigation_xref (
    officer_investigation_xref_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    officer_guid_ref uuid NOT NULL,
    investigation_guid uuid NOT NULL,
    officer_investigation_xref_code character varying(10) NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL,
    active_ind boolean NOT NULL
);


--
-- Name: TABLE officer_investigation_xref; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON TABLE investigation.officer_investigation_xref IS 'Used to create a relationship between an officer and a investigation. One officer can play many roles on a investigation, and many people could be involved in a single investigation.';


--
-- Name: COLUMN officer_investigation_xref.officer_investigation_xref_guid; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref.officer_investigation_xref_guid IS 'System generated unique key for a relationship between an officer and a investigation. This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN officer_investigation_xref.officer_guid_ref; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref.officer_guid_ref IS 'A reference to the system generated unique key for an officer found outside of this schema.';


--
-- Name: COLUMN officer_investigation_xref.investigation_guid; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref.investigation_guid IS 'The GUID for the investigation.';


--
-- Name: COLUMN officer_investigation_xref.officer_investigation_xref_code; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref.officer_investigation_xref_code IS 'A human readable code used to identify a relationship type between an officer and a investigation.';


--
-- Name: COLUMN officer_investigation_xref.create_user_id; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref.create_user_id IS 'The id of the user that created the relationship between an officer and a investigation.';


--
-- Name: COLUMN officer_investigation_xref.create_utc_timestamp; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref.create_utc_timestamp IS 'The timestamp when the relationship between an officer and a investigation  was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN officer_investigation_xref.update_user_id; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref.update_user_id IS 'The id of the user that updated the relationship between an officer and a investigation .';


--
-- Name: COLUMN officer_investigation_xref.update_utc_timestamp; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref.update_utc_timestamp IS 'The timestamp when the relationship between an officer and a investigation  was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN officer_investigation_xref.active_ind; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref.active_ind IS 'A boolean indicator to determine if the relationship type between an officer and a investigation code is active.';


--
-- Name: officer_investigation_xref_code; Type: TABLE; Schema: investigation; Owner: -
--

CREATE TABLE investigation.officer_investigation_xref_code (
    officer_investigation_xref_code character varying(10) NOT NULL,
    short_description character varying(50) NOT NULL,
    long_description character varying(250),
    display_order integer NOT NULL,
    active_ind boolean DEFAULT true NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL
);


--
-- Name: TABLE officer_investigation_xref_code; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON TABLE investigation.officer_investigation_xref_code IS 'Used to track the relationship type between officer and investigation.  For example: ''ASSIGNEE'' = Assignee';


--
-- Name: COLUMN officer_investigation_xref_code.officer_investigation_xref_code; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref_code.officer_investigation_xref_code IS 'A human readable code used to identify a relationship type between an officer and a investigation.';


--
-- Name: COLUMN officer_investigation_xref_code.short_description; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref_code.short_description IS 'The short description of the relationship type between an officer and a investigation.';


--
-- Name: COLUMN officer_investigation_xref_code.long_description; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref_code.long_description IS 'The long description of the relationship type between an officer and a investigation.';


--
-- Name: COLUMN officer_investigation_xref_code.display_order; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref_code.display_order IS 'The order in which the values of the relationship type between an officer and a investigation code table should be displayed when presented to a user in a list.';


--
-- Name: COLUMN officer_investigation_xref_code.active_ind; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref_code.active_ind IS 'Boolean flag indicating if the relationship is active.';


--
-- Name: COLUMN officer_investigation_xref_code.create_user_id; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref_code.create_user_id IS 'The id of the user that created the relationship type between an officer and a investigation.';


--
-- Name: COLUMN officer_investigation_xref_code.create_utc_timestamp; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref_code.create_utc_timestamp IS 'The timestamp when the relationship type between an officer and a investigation  was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN officer_investigation_xref_code.update_user_id; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref_code.update_user_id IS 'The id of the user that updated the relationship type between an officer and a investigation .';


--
-- Name: COLUMN officer_investigation_xref_code.update_utc_timestamp; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref_code.update_utc_timestamp IS 'The timestamp when the relationship type between an officer and a investigation  was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: officer_investigation_xref_code_h; Type: TABLE; Schema: investigation; Owner: -
--

CREATE TABLE investigation.officer_investigation_xref_code_h (
    h_officer_investigation_xref_code_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id character varying(20) NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: TABLE officer_investigation_xref_code_h; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON TABLE investigation.officer_investigation_xref_code_h IS 'History table for officer_investigation_xref_code table';


--
-- Name: COLUMN officer_investigation_xref_code_h.h_officer_investigation_xref_code_guid; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref_code_h.h_officer_investigation_xref_code_guid IS 'System generated unique key for officer_investigation_xref_code history. This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN officer_investigation_xref_code_h.target_row_id; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref_code_h.target_row_id IS 'The unique key for the officer_investigation_xref_code that has been created or modified.';


--
-- Name: COLUMN officer_investigation_xref_code_h.operation_type; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref_code_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN officer_investigation_xref_code_h.operation_user_id; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref_code_h.operation_user_id IS 'The id of the user that created or modified the data in the officer_investigation_xref_code table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN officer_investigation_xref_code_h.operation_executed_at; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref_code_h.operation_executed_at IS 'The timestamp when the data in the officer_investigation_xref_code table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN officer_investigation_xref_code_h.data_after_executed_operation; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref_code_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


--
-- Name: officer_investigation_xref_h; Type: TABLE; Schema: investigation; Owner: -
--

CREATE TABLE investigation.officer_investigation_xref_h (
    h_officer_investigation_xref_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: TABLE officer_investigation_xref_h; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON TABLE investigation.officer_investigation_xref_h IS 'History table for officer_investigation_xref table';


--
-- Name: COLUMN officer_investigation_xref_h.h_officer_investigation_xref_guid; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref_h.h_officer_investigation_xref_guid IS 'System generated unique key for officer_investigation_xref history. This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN officer_investigation_xref_h.target_row_id; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref_h.target_row_id IS 'The unique key for the officer_investigation_xref that has been created or modified.';


--
-- Name: COLUMN officer_investigation_xref_h.operation_type; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN officer_investigation_xref_h.operation_user_id; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref_h.operation_user_id IS 'The id of the user that created or modified the data in the officer_investigation_xref table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN officer_investigation_xref_h.operation_executed_at; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref_h.operation_executed_at IS 'The timestamp when the data in the officer_investigation_xref table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN officer_investigation_xref_h.data_after_executed_operation; Type: COMMENT; Schema: investigation; Owner: -
--

COMMENT ON COLUMN investigation.officer_investigation_xref_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


--
-- Data for Name: investigation_status_code; Type: TABLE DATA; Schema: investigation; Owner: -
--

INSERT INTO investigation.investigation_status_code VALUES ('OPEN', 'Open', 'Open', 10, true, 'FLYWAY', '2025-09-10 15:01:50.599088', 'FLYWAY', '2025-09-10 15:01:50.599088');
INSERT INTO investigation.investigation_status_code VALUES ('CLOSED', 'Closed', 'Closed', 20, true, 'FLYWAY', '2025-09-10 15:01:50.599088', 'FLYWAY', '2025-09-10 15:01:50.599088');


--
-- Data for Name: investigation_status_code_h; Type: TABLE DATA; Schema: investigation; Owner: -
--

INSERT INTO investigation.investigation_status_code_h VALUES ('ff1a2d0d-4cd9-4e86-9755-ebf8a2892b03', 'OPEN', 'I', 'FLYWAY', '2025-09-10 15:01:50.599088', '{"active_ind": true, "display_order": 10, "create_user_id": "FLYWAY", "update_user_id": "FLYWAY", "long_description": "Open", "short_description": "Open", "create_utc_timestamp": "2025-09-10T15:01:50.599088", "update_utc_timestamp": "2025-09-10T15:01:50.599088", "investigation_status_code": "OPEN"}');
INSERT INTO investigation.investigation_status_code_h VALUES ('d53249db-e48b-4b35-9fd3-a7ded9c56e3f', 'CLOSED', 'I', 'FLYWAY', '2025-09-10 15:01:50.599088', '{"active_ind": true, "display_order": 20, "create_user_id": "FLYWAY", "update_user_id": "FLYWAY", "long_description": "Closed", "short_description": "Closed", "create_utc_timestamp": "2025-09-10T15:01:50.599088", "update_utc_timestamp": "2025-09-10T15:01:50.599088", "investigation_status_code": "CLOSED"}');


--
-- Data for Name: officer_investigation_xref_code; Type: TABLE DATA; Schema: investigation; Owner: -
--

INSERT INTO investigation.officer_investigation_xref_code VALUES ('ASSIGNEE', 'Officer assigned', 'The officer to whom the investigation is assigned.', 1, true, 'postgres', '2025-09-10 15:01:50.599088', 'postgres', '2025-09-10 15:01:50.599088');


--
-- Data for Name: officer_investigation_xref_code_h; Type: TABLE DATA; Schema: investigation; Owner: -
--

INSERT INTO investigation.officer_investigation_xref_code_h VALUES ('4b14da79-ed86-4d24-86ad-49ba6bac27b2', 'ASSIGNEE', 'I', 'postgres', '2025-09-10 15:01:50.599088', '{"active_ind": true, "display_order": 1, "create_user_id": "postgres", "update_user_id": "postgres", "long_description": "The officer to whom the investigation is assigned.", "short_description": "Officer assigned", "create_utc_timestamp": "2025-09-10T15:01:50.599088", "update_utc_timestamp": "2025-09-10T15:01:50.599088", "officer_investigation_xref_code": "ASSIGNEE"}');



--
-- Name: investigation_h PK_h_investigation; Type: CONSTRAINT; Schema: investigation; Owner: -
--

ALTER TABLE ONLY investigation.investigation_h
    ADD CONSTRAINT "PK_h_investigation" PRIMARY KEY (h_investigation_guid);


--
-- Name: investigation_status_code_h PK_h_investigation_status_code; Type: CONSTRAINT; Schema: investigation; Owner: -
--

ALTER TABLE ONLY investigation.investigation_status_code_h
    ADD CONSTRAINT "PK_h_investigation_status_code" PRIMARY KEY (h_investigation_status_code_guid);


--
-- Name: officer_investigation_xref_h PK_h_officer_investigation_xref; Type: CONSTRAINT; Schema: investigation; Owner: -
--

ALTER TABLE ONLY investigation.officer_investigation_xref_h
    ADD CONSTRAINT "PK_h_officer_investigation_xref" PRIMARY KEY (h_officer_investigation_xref_guid);


--
-- Name: officer_investigation_xref_code_h PK_h_officer_investigation_xref_code; Type: CONSTRAINT; Schema: investigation; Owner: -
--

ALTER TABLE ONLY investigation.officer_investigation_xref_code_h
    ADD CONSTRAINT "PK_h_officer_investigation_xref_code" PRIMARY KEY (h_officer_investigation_xref_code_guid);


--
-- Name: investigation_status_code PK_ingestigation_status_code; Type: CONSTRAINT; Schema: investigation; Owner: -
--

ALTER TABLE ONLY investigation.investigation_status_code
    ADD CONSTRAINT "PK_ingestigation_status_code" PRIMARY KEY (investigation_status_code);


--
-- Name: investigation PK_investigation_guid; Type: CONSTRAINT; Schema: investigation; Owner: -
--

ALTER TABLE ONLY investigation.investigation
    ADD CONSTRAINT "PK_investigation_guid" PRIMARY KEY (investigation_guid);


--
-- Name: officer_investigation_xref_code PK_officer_investigation_xref_code; Type: CONSTRAINT; Schema: investigation; Owner: -
--

ALTER TABLE ONLY investigation.officer_investigation_xref_code
    ADD CONSTRAINT "PK_officer_investigation_xref_code" PRIMARY KEY (officer_investigation_xref_code);


--
-- Name: officer_investigation_xref PK_officer_investigation_xref_guid; Type: CONSTRAINT; Schema: investigation; Owner: -
--

ALTER TABLE ONLY investigation.officer_investigation_xref
    ADD CONSTRAINT "PK_officer_investigation_xref_guid" PRIMARY KEY (officer_investigation_xref_guid);


--
-- Name: investigation investigation_history_trigger; Type: TRIGGER; Schema: investigation; Owner: -
--

CREATE TRIGGER investigation_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON investigation.investigation FOR EACH ROW EXECUTE FUNCTION investigation.audit_history('investigation_h', 'investigation_guid');


--
-- Name: investigation_status_code investigation_status_history_trigger; Type: TRIGGER; Schema: investigation; Owner: -
--

CREATE TRIGGER investigation_status_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON investigation.investigation_status_code FOR EACH ROW EXECUTE FUNCTION investigation.audit_history('investigation_status_code_h', 'investigation_status_code');


--
-- Name: officer_investigation_xref_code officer_investigation_xref_code_history_trigger; Type: TRIGGER; Schema: investigation; Owner: -
--

CREATE TRIGGER officer_investigation_xref_code_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON investigation.officer_investigation_xref_code FOR EACH ROW EXECUTE FUNCTION investigation.audit_history('officer_investigation_xref_code_h', 'officer_investigation_xref_code');


--
-- Name: officer_investigation_xref officer_investigation_xref_history_trigger; Type: TRIGGER; Schema: investigation; Owner: -
--

CREATE TRIGGER officer_investigation_xref_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON investigation.officer_investigation_xref FOR EACH ROW EXECUTE FUNCTION investigation.audit_history('officer_investigation_xref_h', 'officer_investigation_xref_guid');


--
-- Name: investigation FK_investigation__investigation_status; Type: FK CONSTRAINT; Schema: investigation; Owner: -
--

ALTER TABLE ONLY investigation.investigation
    ADD CONSTRAINT "FK_investigation__investigation_status" FOREIGN KEY (investigation_status) REFERENCES investigation.investigation_status_code(investigation_status_code);


--
-- Name: officer_investigation_xref FK_officer_investigation_xref__investigation_guid; Type: FK CONSTRAINT; Schema: investigation; Owner: -
--

ALTER TABLE ONLY investigation.officer_investigation_xref
    ADD CONSTRAINT "FK_officer_investigation_xref__investigation_guid" FOREIGN KEY (investigation_guid) REFERENCES investigation.investigation(investigation_guid);


--
-- Name: officer_investigation_xref FK_officer_investigation_xref__officer_investigation_xref_code; Type: FK CONSTRAINT; Schema: investigation; Owner: -
--

ALTER TABLE ONLY investigation.officer_investigation_xref
    ADD CONSTRAINT "FK_officer_investigation_xref__officer_investigation_xref_code" FOREIGN KEY (officer_investigation_xref_code) REFERENCES investigation.officer_investigation_xref_code(officer_investigation_xref_code);


--
-- PostgreSQL database dump complete
--

DO $$
BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_user WHERE usename = 'investigation') THEN
    CREATE USER investigation WITH PASSWORD '${INVESTIGATION_PASSWORD}';
END IF;
END $$;