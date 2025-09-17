--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8 (Debian 15.8-1.pgdg110+1)
-- Dumped by pg_dump version 15.1

SET check_function_bodies = false;


--
-- Name: inspection; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA IF NOT EXISTS inspection;


--
-- Name: audit_history(); Type: FUNCTION; Schema: inspection; Owner: -
--

CREATE FUNCTION inspection.audit_history() RETURNS trigger
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
            'INSERT INTO inspection.%I (target_row_id, operation_type, operation_user_id, data_after_executed_operation) VALUES ($1.%I,  ''I'', $1.create_user_id, to_jsonb($1))',  target_history_table, target_pk
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
            'INSERT INTO inspection.%I (target_row_id, operation_type, operation_user_id, data_after_executed_operation) VALUES ($1.%I, ''U'', $1.update_user_id, to_jsonb($1))', target_history_table, target_pk
          )
        USING NEW;
      RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN

      EXECUTE
        format(
                'INSERT INTO inspection.%I (target_row_id, operation_type) VALUES ($1.%I, ''D'')', target_history_table, target_pk
        )
        USING OLD;
      RETURN OLD;

    END IF;
  END;
$_$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: inspection; Type: TABLE; Schema: inspection; Owner: -
--

CREATE TABLE inspection.inspection (
    inspection_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    inspection_description character varying(4000),
    owned_by_agency_ref character varying(10) NOT NULL,
    inspection_status character varying(10) NOT NULL,
    inspection_opened_utc_timestamp timestamp without time zone NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32),
    update_utc_timestamp timestamp without time zone
);


--
-- Name: TABLE inspection; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON TABLE inspection.inspection IS 'The central entity of the inspections system.';


--
-- Name: COLUMN inspection.inspection_guid; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection.inspection_guid IS 'System generated unique key for a case.  This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN inspection.inspection_description; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection.inspection_description IS 'A summary of the inspection as provided by users.';


--
-- Name: COLUMN inspection.owned_by_agency_ref; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection.owned_by_agency_ref IS 'A reference to the human readable code used to identify the agency that owns this case, found in the shared schema.';


--
-- Name: COLUMN inspection.inspection_opened_utc_timestamp; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection.inspection_opened_utc_timestamp IS 'UTC timestamp of when the inspection was started.';


--
-- Name: COLUMN inspection.create_user_id; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection.create_user_id IS 'The id of the user that created the case.';


--
-- Name: COLUMN inspection.create_utc_timestamp; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection.create_utc_timestamp IS 'The timestamp when the case was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN inspection.update_user_id; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection.update_user_id IS 'The id of the user that updated the case.';


--
-- Name: COLUMN inspection.update_utc_timestamp; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection.update_utc_timestamp IS 'The timestamp when the case was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: inspection_h; Type: TABLE; Schema: inspection; Owner: -
--

CREATE TABLE inspection.inspection_h (
    h_inspection_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: TABLE inspection_h; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON TABLE inspection.inspection_h IS 'History table for inspection table';


--
-- Name: COLUMN inspection_h.h_inspection_guid; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection_h.h_inspection_guid IS 'System generated unique key for inspection history. This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN inspection_h.target_row_id; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection_h.target_row_id IS 'The unique key for the inspection that has been created or modified.';


--
-- Name: COLUMN inspection_h.operation_type; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN inspection_h.operation_user_id; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection_h.operation_user_id IS 'The id of the user that created or modified the data in the inspection table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN inspection_h.operation_executed_at; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection_h.operation_executed_at IS 'The timestamp when the data in the inspection table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN inspection_h.data_after_executed_operation; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


--
-- Name: inspection_status_code; Type: TABLE; Schema: inspection; Owner: -
--

CREATE TABLE inspection.inspection_status_code (
    inspection_status_code character varying(10) NOT NULL,
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
-- Name: COLUMN inspection_status_code.inspection_status_code; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection_status_code.inspection_status_code IS 'A human readable code used to identify an inspection status.';


--
-- Name: COLUMN inspection_status_code.short_description; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection_status_code.short_description IS 'The short description of the inspection status code.';


--
-- Name: COLUMN inspection_status_code.long_description; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection_status_code.long_description IS 'The long description of the inspection status code.';


--
-- Name: COLUMN inspection_status_code.display_order; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection_status_code.display_order IS 'The order in which the values of the inspection status code table should be displayed when presented to a user in a list.';


--
-- Name: COLUMN inspection_status_code.active_ind; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection_status_code.active_ind IS 'A boolean indicator to determine if the inspection status code is active.';


--
-- Name: COLUMN inspection_status_code.create_user_id; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection_status_code.create_user_id IS 'The id of the user that created the inspection status code.';


--
-- Name: COLUMN inspection_status_code.create_utc_timestamp; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection_status_code.create_utc_timestamp IS 'The timestamp when the  inspection status code was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN inspection_status_code.update_user_id; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection_status_code.update_user_id IS 'The id of the user that updated the inspection status code.';


--
-- Name: COLUMN inspection_status_code.update_utc_timestamp; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection_status_code.update_utc_timestamp IS 'The timestamp when the inspection status code was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: inspection_status_code_h; Type: TABLE; Schema: inspection; Owner: -
--

CREATE TABLE inspection.inspection_status_code_h (
    h_inspection_status_code_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id character varying(20) NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: TABLE inspection_status_code_h; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON TABLE inspection.inspection_status_code_h IS 'History table for inspection_status_code table';


--
-- Name: COLUMN inspection_status_code_h.h_inspection_status_code_guid; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection_status_code_h.h_inspection_status_code_guid IS 'System generated unique key for inspection_status_code history. This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN inspection_status_code_h.target_row_id; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection_status_code_h.target_row_id IS 'The unique key for the inspection_status_code that has been created or modified.';


--
-- Name: COLUMN inspection_status_code_h.operation_type; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection_status_code_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN inspection_status_code_h.operation_user_id; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection_status_code_h.operation_user_id IS 'The id of the user that created or modified the data in the inspection_status_code table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN inspection_status_code_h.operation_executed_at; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection_status_code_h.operation_executed_at IS 'The timestamp when the data in the inspection_status_code table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN inspection_status_code_h.data_after_executed_operation; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.inspection_status_code_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


--
-- Name: officer_inspection_xref; Type: TABLE; Schema: inspection; Owner: -
--

CREATE TABLE inspection.officer_inspection_xref (
    officer_inspection_xref_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    officer_guid_ref uuid NOT NULL,
    inspection_guid uuid NOT NULL,
    officer_inspection_xref_code character varying(10) NOT NULL,
    create_user_id character varying(32) NOT NULL,
    create_utc_timestamp timestamp without time zone NOT NULL,
    update_user_id character varying(32) NOT NULL,
    update_utc_timestamp timestamp without time zone NOT NULL,
    active_ind boolean NOT NULL
);


--
-- Name: TABLE officer_inspection_xref; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON TABLE inspection.officer_inspection_xref IS 'Used to create a relationship between an officer and a inspection. One officer can play many roles on a inspection, and many people could be involved in a single inspection.';


--
-- Name: COLUMN officer_inspection_xref.officer_inspection_xref_guid; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref.officer_inspection_xref_guid IS 'System generated unique key for a relationship between an officer and a inspection. This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN officer_inspection_xref.officer_guid_ref; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref.officer_guid_ref IS 'A reference to the system generated unique key for an officer found outside of this schema.';


--
-- Name: COLUMN officer_inspection_xref.inspection_guid; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref.inspection_guid IS 'The GUID for the inspection.';


--
-- Name: COLUMN officer_inspection_xref.officer_inspection_xref_code; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref.officer_inspection_xref_code IS 'A human readable code used to identify a relationship type between an officer and a inspection.';


--
-- Name: COLUMN officer_inspection_xref.create_user_id; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref.create_user_id IS 'The id of the user that created the relationship between an officer and a inspection.';


--
-- Name: COLUMN officer_inspection_xref.create_utc_timestamp; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref.create_utc_timestamp IS 'The timestamp when the relationship between an officer and a inspection  was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN officer_inspection_xref.update_user_id; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref.update_user_id IS 'The id of the user that updated the relationship between an officer and a inspection .';


--
-- Name: COLUMN officer_inspection_xref.update_utc_timestamp; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref.update_utc_timestamp IS 'The timestamp when the relationship between an officer and a inspection  was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN officer_inspection_xref.active_ind; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref.active_ind IS 'A boolean indicator to determine if the relationship type between an officer and a inspection code is active.';


--
-- Name: officer_inspection_xref_code; Type: TABLE; Schema: inspection; Owner: -
--

CREATE TABLE inspection.officer_inspection_xref_code (
    officer_inspection_xref_code character varying(10) NOT NULL,
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
-- Name: TABLE officer_inspection_xref_code; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON TABLE inspection.officer_inspection_xref_code IS 'Used to track the relationship type between officer and inspection.  For example: ''ASSIGNEE'' = Assignee';


--
-- Name: COLUMN officer_inspection_xref_code.officer_inspection_xref_code; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref_code.officer_inspection_xref_code IS 'A human readable code used to identify a relationship type between an officer and a inspection.';


--
-- Name: COLUMN officer_inspection_xref_code.short_description; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref_code.short_description IS 'The short description of the relationship type between an officer and a inspection.';


--
-- Name: COLUMN officer_inspection_xref_code.long_description; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref_code.long_description IS 'The long description of the relationship type between an officer and a inspection.';


--
-- Name: COLUMN officer_inspection_xref_code.display_order; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref_code.display_order IS 'The order in which the values of the relationship type between an officer and a inspection code table should be displayed when presented to a user in a list.';


--
-- Name: COLUMN officer_inspection_xref_code.active_ind; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref_code.active_ind IS 'Boolean flag indicating if the relationship is active.';


--
-- Name: COLUMN officer_inspection_xref_code.create_user_id; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref_code.create_user_id IS 'The id of the user that created the relationship type between an officer and a inspection.';


--
-- Name: COLUMN officer_inspection_xref_code.create_utc_timestamp; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref_code.create_utc_timestamp IS 'The timestamp when the relationship type between an officer and a inspection  was created.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN officer_inspection_xref_code.update_user_id; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref_code.update_user_id IS 'The id of the user that updated the relationship type between an officer and a inspection .';


--
-- Name: COLUMN officer_inspection_xref_code.update_utc_timestamp; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref_code.update_utc_timestamp IS 'The timestamp when the relationship type between an officer and a inspection  was updated.  The timestamp is stored in UTC with no Offset.';


--
-- Name: officer_inspection_xref_code_h; Type: TABLE; Schema: inspection; Owner: -
--

CREATE TABLE inspection.officer_inspection_xref_code_h (
    h_officer_inspection_xref_code_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id character varying(20) NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: TABLE officer_inspection_xref_code_h; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON TABLE inspection.officer_inspection_xref_code_h IS 'History table for officer_inspection_xref_code table';


--
-- Name: COLUMN officer_inspection_xref_code_h.h_officer_inspection_xref_code_guid; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref_code_h.h_officer_inspection_xref_code_guid IS 'System generated unique key for officer_inspection_xref_code history. This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN officer_inspection_xref_code_h.target_row_id; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref_code_h.target_row_id IS 'The unique key for the officer_inspection_xref_code that has been created or modified.';


--
-- Name: COLUMN officer_inspection_xref_code_h.operation_type; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref_code_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN officer_inspection_xref_code_h.operation_user_id; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref_code_h.operation_user_id IS 'The id of the user that created or modified the data in the officer_inspection_xref_code table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN officer_inspection_xref_code_h.operation_executed_at; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref_code_h.operation_executed_at IS 'The timestamp when the data in the officer_inspection_xref_code table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN officer_inspection_xref_code_h.data_after_executed_operation; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref_code_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


--
-- Name: officer_inspection_xref_h; Type: TABLE; Schema: inspection; Owner: -
--

CREATE TABLE inspection.officer_inspection_xref_h (
    h_officer_inspection_xref_guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now() NOT NULL,
    data_after_executed_operation jsonb
);


--
-- Name: TABLE officer_inspection_xref_h; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON TABLE inspection.officer_inspection_xref_h IS 'History table for officer_inspection_xref table';


--
-- Name: COLUMN officer_inspection_xref_h.h_officer_inspection_xref_guid; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref_h.h_officer_inspection_xref_guid IS 'System generated unique key for officer_inspection_xref history. This key should never be exposed to users via any system utilizing the tables.';


--
-- Name: COLUMN officer_inspection_xref_h.target_row_id; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref_h.target_row_id IS 'The unique key for the officer_inspection_xref that has been created or modified.';


--
-- Name: COLUMN officer_inspection_xref_h.operation_type; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';


--
-- Name: COLUMN officer_inspection_xref_h.operation_user_id; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref_h.operation_user_id IS 'The id of the user that created or modified the data in the officer_inspection_xref table.  Defaults to the logged in user if not passed in by the application.';


--
-- Name: COLUMN officer_inspection_xref_h.operation_executed_at; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref_h.operation_executed_at IS 'The timestamp when the data in the officer_inspection_xref table was created or modified.  The timestamp is stored in UTC with no Offset.';


--
-- Name: COLUMN officer_inspection_xref_h.data_after_executed_operation; Type: COMMENT; Schema: inspection; Owner: -
--

COMMENT ON COLUMN inspection.officer_inspection_xref_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';


--
-- Data for Name: inspection; Type: TABLE DATA; Schema: inspection; Owner: -
--



--
-- Data for Name: inspection_h; Type: TABLE DATA; Schema: inspection; Owner: -
--



--
-- Data for Name: inspection_status_code; Type: TABLE DATA; Schema: inspection; Owner: -
--

INSERT INTO inspection.inspection_status_code VALUES ('OPEN', 'Open', 'Open', 10, true, 'FLYWAY', '2025-09-10 16:23:15.853697', 'FLYWAY', '2025-09-10 16:23:15.853697');
INSERT INTO inspection.inspection_status_code VALUES ('CLOSED', 'Closed', 'Closed', 20, true, 'FLYWAY', '2025-09-10 16:23:15.853697', 'FLYWAY', '2025-09-10 16:23:15.853697');


--
-- Data for Name: inspection_status_code_h; Type: TABLE DATA; Schema: inspection; Owner: -
--

INSERT INTO inspection.inspection_status_code_h VALUES ('ca2301d0-4368-409e-866f-a0f245e17dcf', 'OPEN', 'I', 'FLYWAY', '2025-09-10 16:23:15.853697', '{"active_ind": true, "display_order": 10, "create_user_id": "FLYWAY", "update_user_id": "FLYWAY", "long_description": "Open", "short_description": "Open", "create_utc_timestamp": "2025-09-10T16:23:15.853697", "update_utc_timestamp": "2025-09-10T16:23:15.853697", "inspection_status_code": "OPEN"}');
INSERT INTO inspection.inspection_status_code_h VALUES ('c5858260-65d4-4c7b-b323-34535d4fc86c', 'CLOSED', 'I', 'FLYWAY', '2025-09-10 16:23:15.853697', '{"active_ind": true, "display_order": 20, "create_user_id": "FLYWAY", "update_user_id": "FLYWAY", "long_description": "Closed", "short_description": "Closed", "create_utc_timestamp": "2025-09-10T16:23:15.853697", "update_utc_timestamp": "2025-09-10T16:23:15.853697", "inspection_status_code": "CLOSED"}');


--
-- Data for Name: officer_inspection_xref_code; Type: TABLE DATA; Schema: inspection; Owner: -
--

INSERT INTO inspection.officer_inspection_xref_code VALUES ('ASSIGNEE', 'Officer assigned', 'The officer to whom the inspection is assigned.', 1, true, 'postgres', '2025-09-10 16:23:15.853697', 'postgres', '2025-09-10 16:23:15.853697');


--
-- Data for Name: officer_inspection_xref_code_h; Type: TABLE DATA; Schema: inspection; Owner: -
--

INSERT INTO inspection.officer_inspection_xref_code_h VALUES ('dfda7601-7e49-44a9-ba96-84f2d7ed8c1e', 'ASSIGNEE', 'I', 'postgres', '2025-09-10 16:23:15.853697', '{"active_ind": true, "display_order": 1, "create_user_id": "postgres", "update_user_id": "postgres", "long_description": "The officer to whom the inspection is assigned.", "short_description": "Officer assigned", "create_utc_timestamp": "2025-09-10T16:23:15.853697", "update_utc_timestamp": "2025-09-10T16:23:15.853697", "officer_inspection_xref_code": "ASSIGNEE"}');



--
-- Name: inspection_h PK_h_inspection; Type: CONSTRAINT; Schema: inspection; Owner: -
--

ALTER TABLE ONLY inspection.inspection_h
    ADD CONSTRAINT "PK_h_inspection" PRIMARY KEY (h_inspection_guid);


--
-- Name: inspection_status_code_h PK_h_inspection_status_code; Type: CONSTRAINT; Schema: inspection; Owner: -
--

ALTER TABLE ONLY inspection.inspection_status_code_h
    ADD CONSTRAINT "PK_h_inspection_status_code" PRIMARY KEY (h_inspection_status_code_guid);


--
-- Name: officer_inspection_xref_h PK_h_officer_inspection_xref; Type: CONSTRAINT; Schema: inspection; Owner: -
--

ALTER TABLE ONLY inspection.officer_inspection_xref_h
    ADD CONSTRAINT "PK_h_officer_inspection_xref" PRIMARY KEY (h_officer_inspection_xref_guid);


--
-- Name: officer_inspection_xref_code_h PK_h_officer_inspection_xref_code; Type: CONSTRAINT; Schema: inspection; Owner: -
--

ALTER TABLE ONLY inspection.officer_inspection_xref_code_h
    ADD CONSTRAINT "PK_h_officer_inspection_xref_code" PRIMARY KEY (h_officer_inspection_xref_code_guid);


--
-- Name: inspection_status_code PK_ingestigation_status_code; Type: CONSTRAINT; Schema: inspection; Owner: -
--

ALTER TABLE ONLY inspection.inspection_status_code
    ADD CONSTRAINT "PK_ingestigation_status_code" PRIMARY KEY (inspection_status_code);


--
-- Name: inspection PK_inspection_guid; Type: CONSTRAINT; Schema: inspection; Owner: -
--

ALTER TABLE ONLY inspection.inspection
    ADD CONSTRAINT "PK_inspection_guid" PRIMARY KEY (inspection_guid);


--
-- Name: officer_inspection_xref_code PK_officer_inspection_xref_code; Type: CONSTRAINT; Schema: inspection; Owner: -
--

ALTER TABLE ONLY inspection.officer_inspection_xref_code
    ADD CONSTRAINT "PK_officer_inspection_xref_code" PRIMARY KEY (officer_inspection_xref_code);


--
-- Name: officer_inspection_xref PK_officer_inspection_xref_guid; Type: CONSTRAINT; Schema: inspection; Owner: -
--

ALTER TABLE ONLY inspection.officer_inspection_xref
    ADD CONSTRAINT "PK_officer_inspection_xref_guid" PRIMARY KEY (officer_inspection_xref_guid);


--
-- Name: inspection inspection_history_trigger; Type: TRIGGER; Schema: inspection; Owner: -
--

CREATE TRIGGER inspection_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON inspection.inspection FOR EACH ROW EXECUTE FUNCTION inspection.audit_history('inspection_h', 'inspection_guid');


--
-- Name: inspection_status_code inspection_status_history_trigger; Type: TRIGGER; Schema: inspection; Owner: -
--

CREATE TRIGGER inspection_status_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON inspection.inspection_status_code FOR EACH ROW EXECUTE FUNCTION inspection.audit_history('inspection_status_code_h', 'inspection_status_code');


--
-- Name: officer_inspection_xref_code officer_inspection_xref_code_history_trigger; Type: TRIGGER; Schema: inspection; Owner: -
--

CREATE TRIGGER officer_inspection_xref_code_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON inspection.officer_inspection_xref_code FOR EACH ROW EXECUTE FUNCTION inspection.audit_history('officer_inspection_xref_code_h', 'officer_inspection_xref_code');


--
-- Name: officer_inspection_xref officer_inspection_xref_history_trigger; Type: TRIGGER; Schema: inspection; Owner: -
--

CREATE TRIGGER officer_inspection_xref_history_trigger BEFORE INSERT OR DELETE OR UPDATE ON inspection.officer_inspection_xref FOR EACH ROW EXECUTE FUNCTION inspection.audit_history('officer_inspection_xref_h', 'officer_inspection_xref_guid');


--
-- Name: inspection FK_inspection__inspection_status; Type: FK CONSTRAINT; Schema: inspection; Owner: -
--

ALTER TABLE ONLY inspection.inspection
    ADD CONSTRAINT "FK_inspection__inspection_status" FOREIGN KEY (inspection_status) REFERENCES inspection.inspection_status_code(inspection_status_code);


--
-- Name: officer_inspection_xref FK_officer_inspection_xref__inspection_guid; Type: FK CONSTRAINT; Schema: inspection; Owner: -
--

ALTER TABLE ONLY inspection.officer_inspection_xref
    ADD CONSTRAINT "FK_officer_inspection_xref__inspection_guid" FOREIGN KEY (inspection_guid) REFERENCES inspection.inspection(inspection_guid);


--
-- Name: officer_inspection_xref FK_officer_inspection_xref__officer_inspection_xref_code; Type: FK CONSTRAINT; Schema: inspection; Owner: -
--

ALTER TABLE ONLY inspection.officer_inspection_xref
    ADD CONSTRAINT "FK_officer_inspection_xref__officer_inspection_xref_code" FOREIGN KEY (officer_inspection_xref_code) REFERENCES inspection.officer_inspection_xref_code(officer_inspection_xref_code);


--
-- PostgreSQL database dump complete
--

DO $$
BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_user WHERE usename = 'inspection') THEN
    CREATE USER inspection WITH PASSWORD '${INSPECTION_PASSWORD}';
END IF;
END $$;