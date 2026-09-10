-- ==========================================
-- ENFORCEMENT ACTION - MUTUAL DECISION FIELDS
-- ==========================================
ALTER TABLE investigation.enforcement_action
ADD COLUMN issuing_officer_guid_ref UUID,
ADD COLUMN date_served DATE;

COMMENT ON COLUMN investigation.enforcement_action.issuing_officer_guid_ref IS 'Cross schema foreign key (unenforced) to shared.app_user. Unique identifier for the application user that issued the enforcement action. Defaults to the primary investigator of the investigation. Not applicable to Unfounded/Unresolved decisions.';

COMMENT ON COLUMN investigation.enforcement_action.date_served IS 'The date the enforcement action was served. Defaults to the current date. Not applicable to Unfounded/Unresolved decisions.';

-- ==========================================
-- WARNING
-- ==========================================
-- Warning type is out of scope for now (no option list provided) - not captured here.
CREATE TABLE
    investigation.warning (
        warning_guid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        enforcement_action_guid UUID NOT NULL REFERENCES investigation.enforcement_action (enforcement_action_guid),
        warning_number VARCHAR(32) NOT NULL,
        active_ind BOOLEAN DEFAULT true NOT NULL,
        create_user_id VARCHAR(32) NOT NULL,
        create_utc_timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT now () NOT NULL,
        update_user_id VARCHAR(32),
        update_utc_timestamp TIMESTAMP WITHOUT TIME ZONE
    );

COMMENT ON TABLE investigation.warning IS 'Records the details of a warning issued as part of an enforcement action. Only applicable when the enforcement action is a Warning.';

COMMENT ON COLUMN investigation.warning.warning_guid IS 'Primary key. System generated unique identifier for the warning.';

COMMENT ON COLUMN investigation.warning.enforcement_action_guid IS 'Foreign key to enforcement_action. Unique identifier for the enforcement action the warning was issued as part of.';

COMMENT ON COLUMN investigation.warning.warning_number IS 'The identification number of the warning.';

COMMENT ON COLUMN investigation.warning.active_ind IS 'A boolean indicator to determine if the warning is active. Inactive values are retained for legacy data integrity and history.';

COMMENT ON COLUMN investigation.warning.create_user_id IS 'The id of the user that created the warning.';

COMMENT ON COLUMN investigation.warning.create_utc_timestamp IS 'The timestamp when the warning was created. Stored in UTC with no offset.';

COMMENT ON COLUMN investigation.warning.update_user_id IS 'The id of the user that last updated the warning.';

COMMENT ON COLUMN investigation.warning.update_utc_timestamp IS 'The timestamp when the warning was last updated. Stored in UTC with no offset.';

CREATE TABLE
    investigation.warning_h (
        h_warning_guid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        target_row_id UUID NOT NULL,
        operation_type CHAR(1) NOT NULL,
        operation_user_id VARCHAR(32) DEFAULT CURRENT_USER NOT NULL,
        operation_executed_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now () NOT NULL,
        data_after_executed_operation JSONB
    );

COMMENT ON TABLE investigation.warning_h IS 'History table for warning table.';

COMMENT ON COLUMN investigation.warning_h.h_warning_guid IS 'Primary key. System generated unique identifier for the warning history record.';

COMMENT ON COLUMN investigation.warning_h.target_row_id IS 'The unique key for the warning that has been created or modified.';

COMMENT ON COLUMN investigation.warning_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT ON COLUMN investigation.warning_h.operation_user_id IS 'The id of the user that created or modified the data in the warning table.';

COMMENT ON COLUMN investigation.warning_h.operation_executed_at IS 'The timestamp when the data in the warning table was created or modified. Stored in UTC with no offset.';

COMMENT ON COLUMN investigation.warning_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.';

CREATE TRIGGER warning_history_trigger BEFORE INSERT
OR
UPDATE
OR DELETE ON investigation.warning FOR EACH ROW EXECUTE FUNCTION investigation.audit_history ('warning_h', 'warning_guid');

-- ==========================================
-- TICKET TYPE CODE
-- ==========================================
CREATE TABLE
    investigation.ticket_type_code (
        ticket_type_code VARCHAR(16) PRIMARY KEY NOT NULL,
        short_description VARCHAR(64) NOT NULL,
        long_description VARCHAR(256),
        display_order INTEGER,
        active_ind BOOLEAN DEFAULT true NOT NULL,
        create_user_id VARCHAR(32) NOT NULL,
        create_utc_timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT now () NOT NULL,
        update_user_id VARCHAR(32),
        update_utc_timestamp TIMESTAMP WITHOUT TIME ZONE
    );

COMMENT ON TABLE investigation.ticket_type_code IS 'Reference table defining whether a violation ticket is Federal or Provincial.';

COMMENT ON COLUMN investigation.ticket_type_code.ticket_type_code IS 'Primary key. Code representing the type of ticket.';

COMMENT ON COLUMN investigation.ticket_type_code.short_description IS 'The short description of the ticket type code.';

COMMENT ON COLUMN investigation.ticket_type_code.long_description IS 'The long description of the ticket type code.';

COMMENT ON COLUMN investigation.ticket_type_code.display_order IS 'The order in which the values should be displayed when presented to a user in a list.';

COMMENT ON COLUMN investigation.ticket_type_code.active_ind IS 'A boolean indicator to determine if the ticket type code is active.';

COMMENT ON COLUMN investigation.ticket_type_code.create_user_id IS 'The id of the user that created the ticket type code.';

COMMENT ON COLUMN investigation.ticket_type_code.create_utc_timestamp IS 'The timestamp when the ticket type code was created. Stored in UTC with no offset.';

COMMENT ON COLUMN investigation.ticket_type_code.update_user_id IS 'The id of the user that last updated the ticket type code.';

COMMENT ON COLUMN investigation.ticket_type_code.update_utc_timestamp IS 'The timestamp when the ticket type code was last updated. Stored in UTC with no offset.';

INSERT INTO
    investigation.ticket_type_code (
        ticket_type_code,
        short_description,
        long_description,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
VALUES
    (
        'FED',
        'Federal',
        'Federal',
        10,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'PROV',
        'Provincial',
        'Provincial',
        20,
        true,
        'FLYWAY',
        now ()
    );

-- ==========================================
-- TICKET - NEW FIELDS
-- ==========================================
ALTER TABLE investigation.ticket
ADD COLUMN ticket_type_code VARCHAR(16) REFERENCES investigation.ticket_type_code (ticket_type_code),
ADD COLUMN appeal_hearing_date DATE;

COMMENT ON COLUMN investigation.ticket.ticket_type_code IS 'Foreign key to ticket_type_code. Whether the violation ticket is Federal or Provincial.';

COMMENT ON COLUMN investigation.ticket.appeal_hearing_date IS 'The date of the appeal hearing for the violation ticket, if any.';

-- Deactivated old ticket_outcome_code
UPDATE investigation.ticket_outcome_code
SET
    active_ind = false,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = now ()
WHERE
    ticket_outcome_code IN ('APLD', 'CNLD', 'ISUD', 'PAID');

INSERT INTO
    investigation.ticket_outcome_code (
        ticket_outcome_code,
        short_description,
        long_description,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
VALUES
    (
        'ACQT',
        'Acquitted',
        'Acquitted',
        10,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'CNIC',
        'Cancelled by ICBC',
        'Cancelled by ICBC',
        20,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'CNOF',
        'Cancelled by officer',
        'Cancelled by officer',
        30,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'GBEX',
        'Guilty by expiry',
        'Guilty by expiry',
        40,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'GBJU',
        'Guilty by judgement',
        'Guilty by judgement',
        50,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'GBPA',
        'Guilty by payment',
        'Guilty by payment',
        60,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'GBPL',
        'Guilty by plea',
        'Guilty by plea',
        70,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'INDI',
        'In dispute',
        'In dispute',
        80,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'INPR',
        'In progress',
        'In progress',
        90,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'NOTG',
        'Not guilty',
        'Not guilty',
        100,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'STAY',
        'Stay of proceedings',
        'Stay of proceedings',
        110,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'WTHD',
        'Withdrawn',
        'Withdrawn',
        120,
        true,
        'FLYWAY',
        now ()
    );

-- ==========================================
-- SANCTION TYPE CODE
-- ==========================================
CREATE TABLE
    investigation.sanction_type_code (
        sanction_type_code VARCHAR(16) PRIMARY KEY NOT NULL,
        short_description VARCHAR(64) NOT NULL,
        long_description VARCHAR(256),
        display_order INTEGER,
        active_ind BOOLEAN DEFAULT true NOT NULL,
        create_user_id VARCHAR(32) NOT NULL,
        create_utc_timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT now () NOT NULL,
        update_user_id VARCHAR(32),
        update_utc_timestamp TIMESTAMP WITHOUT TIME ZONE
    );

COMMENT ON TABLE investigation.sanction_type_code IS 'Reference table defining the types of administrative sanctions that can be issued as an enforcement action.';

COMMENT ON COLUMN investigation.sanction_type_code.sanction_type_code IS 'Primary key. Code representing the type of administrative sanction.';

COMMENT ON COLUMN investigation.sanction_type_code.short_description IS 'The short description of the sanction type code.';

COMMENT ON COLUMN investigation.sanction_type_code.long_description IS 'The long description of the sanction type code.';

COMMENT ON COLUMN investigation.sanction_type_code.display_order IS 'The order in which the values should be displayed when presented to a user in a list.';

COMMENT ON COLUMN investigation.sanction_type_code.active_ind IS 'A boolean indicator to determine if the sanction type code is active.';

COMMENT ON COLUMN investigation.sanction_type_code.create_user_id IS 'The id of the user that created the sanction type code.';

COMMENT ON COLUMN investigation.sanction_type_code.create_utc_timestamp IS 'The timestamp when the sanction type code was created. Stored in UTC with no offset.';

COMMENT ON COLUMN investigation.sanction_type_code.update_user_id IS 'The id of the user that last updated the sanction type code.';

COMMENT ON COLUMN investigation.sanction_type_code.update_utc_timestamp IS 'The timestamp when the sanction type code was last updated. Stored in UTC with no offset.';

INSERT INTO
    investigation.sanction_type_code (
        sanction_type_code,
        short_description,
        long_description,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
VALUES
    (
        'LICC',
        'Licence cancellation',
        'Licence cancellation',
        10,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'LICS',
        'Licence suspension',
        'Licence suspension',
        20,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'PMTC',
        'Permit cancellation',
        'Permit cancellation',
        30,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'PMTS',
        'Permit suspension',
        'Permit suspension',
        40,
        true,
        'FLYWAY',
        now ()
    );

-- ==========================================
-- SANCTION STATUS CODE
-- ==========================================
CREATE TABLE
    investigation.sanction_status_code (
        sanction_status_code VARCHAR(16) PRIMARY KEY NOT NULL,
        short_description VARCHAR(64) NOT NULL,
        long_description VARCHAR(256),
        display_order INTEGER,
        active_ind BOOLEAN DEFAULT true NOT NULL,
        create_user_id VARCHAR(32) NOT NULL,
        create_utc_timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT now () NOT NULL,
        update_user_id VARCHAR(32),
        update_utc_timestamp TIMESTAMP WITHOUT TIME ZONE
    );

COMMENT ON TABLE investigation.sanction_status_code IS 'Reference table defining the possible statuses of an administrative sanction.';

COMMENT ON COLUMN investigation.sanction_status_code.sanction_status_code IS 'Primary key. Code representing the status of an administrative sanction.';

COMMENT ON COLUMN investigation.sanction_status_code.short_description IS 'The short description of the sanction status code.';

COMMENT ON COLUMN investigation.sanction_status_code.long_description IS 'The long description of the sanction status code.';

COMMENT ON COLUMN investigation.sanction_status_code.display_order IS 'The order in which the values should be displayed when presented to a user in a list.';

COMMENT ON COLUMN investigation.sanction_status_code.active_ind IS 'A boolean indicator to determine if the sanction status code is active.';

COMMENT ON COLUMN investigation.sanction_status_code.create_user_id IS 'The id of the user that created the sanction status code.';

COMMENT ON COLUMN investigation.sanction_status_code.create_utc_timestamp IS 'The timestamp when the sanction status code was created. Stored in UTC with no offset.';

COMMENT ON COLUMN investigation.sanction_status_code.update_user_id IS 'The id of the user that last updated the sanction status code.';

COMMENT ON COLUMN investigation.sanction_status_code.update_utc_timestamp IS 'The timestamp when the sanction status code was last updated. Stored in UTC with no offset.';

INSERT INTO
    investigation.sanction_status_code (
        sanction_status_code,
        short_description,
        long_description,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
VALUES
    (
        'APLD',
        'Appealed',
        'Appealed',
        10,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'CNLD',
        'Cancelled',
        'Cancelled',
        20,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'ISUD',
        'Issued',
        'Issued',
        30,
        true,
        'FLYWAY',
        now ()
    );

-- ==========================================
-- ADMINISTRATIVE SANCTION
-- ==========================================
CREATE TABLE
    investigation.administrative_sanction (
        administrative_sanction_guid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        enforcement_action_guid UUID NOT NULL REFERENCES investigation.enforcement_action (enforcement_action_guid),
        sanction_type_code VARCHAR(16) NOT NULL REFERENCES investigation.sanction_type_code (sanction_type_code),
        effective_date DATE NOT NULL,
        end_date DATE NOT NULL,
        sanction_status_code VARCHAR(16) NOT NULL REFERENCES investigation.sanction_status_code (sanction_status_code),
        comment TEXT,
        active_ind BOOLEAN DEFAULT true NOT NULL,
        create_user_id VARCHAR(32) NOT NULL,
        create_utc_timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT now () NOT NULL,
        update_user_id VARCHAR(32),
        update_utc_timestamp TIMESTAMP WITHOUT TIME ZONE
    );

COMMENT ON TABLE investigation.administrative_sanction IS 'Records the details of an administrative sanction issued as part of an enforcement action. Only applicable when the enforcement action is an Administrative Sanction.';

COMMENT ON COLUMN investigation.administrative_sanction.administrative_sanction_guid IS 'Primary key. System generated unique identifier for the administrative sanction.';

COMMENT ON COLUMN investigation.administrative_sanction.enforcement_action_guid IS 'Foreign key to enforcement_action. Unique identifier for the enforcement action the sanction was issued as part of.';

COMMENT ON COLUMN investigation.administrative_sanction.sanction_type_code IS 'Foreign key to sanction_type_code. Code representing the type of sanction issued.';

COMMENT ON COLUMN investigation.administrative_sanction.effective_date IS 'The date the administrative sanction takes effect.';

COMMENT ON COLUMN investigation.administrative_sanction.end_date IS 'The date the administrative sanction ends.';

COMMENT ON COLUMN investigation.administrative_sanction.sanction_status_code IS 'Foreign key to sanction_status_code. Code representing the current status of the sanction.';

COMMENT ON COLUMN investigation.administrative_sanction.comment IS 'Freeform comment about the administrative sanction.';

COMMENT ON COLUMN investigation.administrative_sanction.active_ind IS 'A boolean indicator to determine if the administrative sanction is active. Inactive values are retained for legacy data integrity and history.';

COMMENT ON COLUMN investigation.administrative_sanction.create_user_id IS 'The id of the user that created the administrative sanction.';

COMMENT ON COLUMN investigation.administrative_sanction.create_utc_timestamp IS 'The timestamp when the administrative sanction was created. Stored in UTC with no offset.';

COMMENT ON COLUMN investigation.administrative_sanction.update_user_id IS 'The id of the user that last updated the administrative sanction.';

COMMENT ON COLUMN investigation.administrative_sanction.update_utc_timestamp IS 'The timestamp when the administrative sanction was last updated. Stored in UTC with no offset.';

CREATE TABLE
    investigation.administrative_sanction_h (
        h_administrative_sanction_guid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        target_row_id UUID NOT NULL,
        operation_type CHAR(1) NOT NULL,
        operation_user_id VARCHAR(32) DEFAULT CURRENT_USER NOT NULL,
        operation_executed_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now () NOT NULL,
        data_after_executed_operation JSONB
    );

COMMENT ON TABLE investigation.administrative_sanction_h IS 'History table for administrative_sanction table.';

COMMENT ON COLUMN investigation.administrative_sanction_h.h_administrative_sanction_guid IS 'Primary key. System generated unique identifier for the administrative sanction history record.';

COMMENT ON COLUMN investigation.administrative_sanction_h.target_row_id IS 'The unique key for the administrative sanction that has been created or modified.';

COMMENT ON COLUMN investigation.administrative_sanction_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT ON COLUMN investigation.administrative_sanction_h.operation_user_id IS 'The id of the user that created or modified the data in the administrative_sanction table.';

COMMENT ON COLUMN investigation.administrative_sanction_h.operation_executed_at IS 'The timestamp when the data in the administrative_sanction table was created or modified. Stored in UTC with no offset.';

COMMENT ON COLUMN investigation.administrative_sanction_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.';

CREATE TRIGGER administrative_sanction_history_trigger BEFORE INSERT
OR
UPDATE
OR DELETE ON investigation.administrative_sanction FOR EACH ROW EXECUTE FUNCTION investigation.audit_history (
    'administrative_sanction_h',
    'administrative_sanction_guid'
);

-- ==========================================
-- ORDER TYPE CODE
-- ==========================================
CREATE TABLE
    investigation.order_type_code (
        order_type_code VARCHAR(16) PRIMARY KEY NOT NULL,
        short_description VARCHAR(64) NOT NULL,
        long_description VARCHAR(256),
        display_order INTEGER,
        active_ind BOOLEAN DEFAULT true NOT NULL,
        create_user_id VARCHAR(32) NOT NULL,
        create_utc_timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT now () NOT NULL,
        update_user_id VARCHAR(32),
        update_utc_timestamp TIMESTAMP WITHOUT TIME ZONE
    );

COMMENT ON TABLE investigation.order_type_code IS 'Reference table defining the types of orders that can be issued as an enforcement action.';

COMMENT ON COLUMN investigation.order_type_code.order_type_code IS 'Primary key. Code representing the type of order.';

COMMENT ON COLUMN investigation.order_type_code.short_description IS 'The short description of the order type code.';

COMMENT ON COLUMN investigation.order_type_code.long_description IS 'The long description of the order type code.';

COMMENT ON COLUMN investigation.order_type_code.display_order IS 'The order in which the values should be displayed when presented to a user in a list.';

COMMENT ON COLUMN investigation.order_type_code.active_ind IS 'A boolean indicator to determine if the order type code is active.';

COMMENT ON COLUMN investigation.order_type_code.create_user_id IS 'The id of the user that created the order type code.';

COMMENT ON COLUMN investigation.order_type_code.create_utc_timestamp IS 'The timestamp when the order type code was created. Stored in UTC with no offset.';

COMMENT ON COLUMN investigation.order_type_code.update_user_id IS 'The id of the user that last updated the order type code.';

COMMENT ON COLUMN investigation.order_type_code.update_utc_timestamp IS 'The timestamp when the order type code was last updated. Stored in UTC with no offset.';

INSERT INTO
    investigation.order_type_code (
        order_type_code,
        short_description,
        long_description,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
VALUES
    (
        'DWLP',
        'Dangerous wildlife protection',
        'Dangerous wildlife protection',
        10,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'DECO',
        'Decontamination',
        'Decontamination',
        20,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'EVIC',
        'Eviction',
        'Eviction',
        30,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'REMD',
        'Remediation',
        'Remediation',
        40,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'SEIZ',
        'Seizure',
        'Seizure',
        50,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'STOP',
        'Stop work',
        'Stop work',
        60,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'TRES',
        'Trespass',
        'Trespass',
        70,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'VACA',
        'Vacate',
        'Vacate',
        80,
        true,
        'FLYWAY',
        now ()
    );

-- ==========================================
-- ORDER STATUS CODE
-- ==========================================
CREATE TABLE
    investigation.order_status_code (
        order_status_code VARCHAR(16) PRIMARY KEY NOT NULL,
        short_description VARCHAR(64) NOT NULL,
        long_description VARCHAR(256),
        display_order INTEGER,
        active_ind BOOLEAN DEFAULT true NOT NULL,
        create_user_id VARCHAR(32) NOT NULL,
        create_utc_timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT now () NOT NULL,
        update_user_id VARCHAR(32),
        update_utc_timestamp TIMESTAMP WITHOUT TIME ZONE
    );

COMMENT ON TABLE investigation.order_status_code IS 'Reference table defining the possible statuses of an order.';

COMMENT ON COLUMN investigation.order_status_code.order_status_code IS 'Primary key. Code representing the status of an order.';

COMMENT ON COLUMN investigation.order_status_code.short_description IS 'The short description of the order status code.';

COMMENT ON COLUMN investigation.order_status_code.long_description IS 'The long description of the order status code.';

COMMENT ON COLUMN investigation.order_status_code.display_order IS 'The order in which the values should be displayed when presented to a user in a list.';

COMMENT ON COLUMN investigation.order_status_code.active_ind IS 'A boolean indicator to determine if the order status code is active.';

COMMENT ON COLUMN investigation.order_status_code.create_user_id IS 'The id of the user that created the order status code.';

COMMENT ON COLUMN investigation.order_status_code.create_utc_timestamp IS 'The timestamp when the order status code was created. Stored in UTC with no offset.';

COMMENT ON COLUMN investigation.order_status_code.update_user_id IS 'The id of the user that last updated the order status code.';

COMMENT ON COLUMN investigation.order_status_code.update_utc_timestamp IS 'The timestamp when the order status code was last updated. Stored in UTC with no offset.';

INSERT INTO
    investigation.order_status_code (
        order_status_code,
        short_description,
        long_description,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
VALUES
    (
        'ADHR',
        'Adhered to',
        'Adhered to',
        10,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'APLD',
        'Appealed',
        'Appealed',
        20,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'CNLD',
        'Cancelled',
        'Cancelled',
        30,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'ISUD',
        'Issued',
        'Issued',
        40,
        true,
        'FLYWAY',
        now ()
    );

-- ==========================================
-- ORDER
-- ==========================================
CREATE TABLE
    investigation.enforcement_order (
        enforcement_order_guid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        enforcement_action_guid UUID NOT NULL REFERENCES investigation.enforcement_action (enforcement_action_guid),
        order_type_code VARCHAR(16) REFERENCES investigation.order_type_code (order_type_code),
        remediation_required_ind BOOLEAN,
        appeal_hearing_date DATE,
        order_status_code VARCHAR(16) NOT NULL REFERENCES investigation.order_status_code (order_status_code),
        active_ind BOOLEAN DEFAULT true NOT NULL,
        create_user_id VARCHAR(32) NOT NULL,
        create_utc_timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT now () NOT NULL,
        update_user_id VARCHAR(32),
        update_utc_timestamp TIMESTAMP WITHOUT TIME ZONE
    );

COMMENT ON TABLE investigation.enforcement_order IS 'Records the details of an order issued as part of an enforcement action. Only applicable when the enforcement action is an Order.';

COMMENT ON COLUMN investigation.enforcement_order.enforcement_order_guid IS 'Primary key. System generated unique identifier for the order.';

COMMENT ON COLUMN investigation.enforcement_order.enforcement_action_guid IS 'Foreign key to enforcement_action. Unique identifier for the enforcement action the order was issued as part of.';

COMMENT ON COLUMN investigation.enforcement_order.order_type_code IS 'Foreign key to order_type_code. Code representing the type of order issued.';

COMMENT ON COLUMN investigation.enforcement_order.remediation_required_ind IS 'A boolean indicator to determine if remediation is required as part of the order.';

COMMENT ON COLUMN investigation.enforcement_order.appeal_hearing_date IS 'The date of the appeal hearing for the order, if any.';

COMMENT ON COLUMN investigation.enforcement_order.order_status_code IS 'Foreign key to order_status_code. Code representing the current status of the order.';

COMMENT ON COLUMN investigation.enforcement_order.active_ind IS 'A boolean indicator to determine if the order is active. Inactive values are retained for legacy data integrity and history.';

COMMENT ON COLUMN investigation.enforcement_order.create_user_id IS 'The id of the user that created the order.';

COMMENT ON COLUMN investigation.enforcement_order.create_utc_timestamp IS 'The timestamp when the order was created. Stored in UTC with no offset.';

COMMENT ON COLUMN investigation.enforcement_order.update_user_id IS 'The id of the user that last updated the order.';

COMMENT ON COLUMN investigation.enforcement_order.update_utc_timestamp IS 'The timestamp when the order was last updated. Stored in UTC with no offset.';

CREATE TABLE
    investigation.enforcement_order_h (
        h_enforcement_order_guid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        target_row_id UUID NOT NULL,
        operation_type CHAR(1) NOT NULL,
        operation_user_id VARCHAR(32) DEFAULT CURRENT_USER NOT NULL,
        operation_executed_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now () NOT NULL,
        data_after_executed_operation JSONB
    );

COMMENT ON TABLE investigation.enforcement_order_h IS 'History table for enforcement_order table.';

COMMENT ON COLUMN investigation.enforcement_order_h.h_enforcement_order_guid IS 'Primary key. System generated unique identifier for the order history record.';

COMMENT ON COLUMN investigation.enforcement_order_h.target_row_id IS 'The unique key for the order that has been created or modified.';

COMMENT ON COLUMN investigation.enforcement_order_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT ON COLUMN investigation.enforcement_order_h.operation_user_id IS 'The id of the user that created or modified the data in the enforcement_order table.';

COMMENT ON COLUMN investigation.enforcement_order_h.operation_executed_at IS 'The timestamp when the data in the enforcement_order table was created or modified. Stored in UTC with no offset.';

COMMENT ON COLUMN investigation.enforcement_order_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.';

CREATE TRIGGER enforcement_order_history_trigger BEFORE INSERT
OR
UPDATE
OR DELETE ON investigation.enforcement_order FOR EACH ROW EXECUTE FUNCTION investigation.audit_history ('enforcement_order_h', 'enforcement_order_guid');

-- ==========================================
-- RESTORATIVE JUSTICE
-- ==========================================
CREATE TABLE
    investigation.restorative_justice (
        restorative_justice_guid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        enforcement_action_guid UUID NOT NULL REFERENCES investigation.enforcement_action (enforcement_action_guid),
        hearing_date DATE,
        decision_date DATE,
        remediation_required_ind BOOLEAN,
        comment TEXT,
        active_ind BOOLEAN DEFAULT true NOT NULL,
        create_user_id VARCHAR(32) NOT NULL,
        create_utc_timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT now () NOT NULL,
        update_user_id VARCHAR(32),
        update_utc_timestamp TIMESTAMP WITHOUT TIME ZONE
    );

COMMENT ON TABLE investigation.restorative_justice IS 'Records the details of a restorative justice process issued as part of an enforcement action. Only applicable when the enforcement action is Restorative Justice.';

COMMENT ON COLUMN investigation.restorative_justice.restorative_justice_guid IS 'Primary key. System generated unique identifier for the restorative justice record.';

COMMENT ON COLUMN investigation.restorative_justice.enforcement_action_guid IS 'Foreign key to enforcement_action. Unique identifier for the enforcement action the restorative justice process was issued as part of.';

COMMENT ON COLUMN investigation.restorative_justice.hearing_date IS 'The date of the restorative justice hearing, if any.';

COMMENT ON COLUMN investigation.restorative_justice.decision_date IS 'The date the restorative justice decision was made, if any.';

COMMENT ON COLUMN investigation.restorative_justice.remediation_required_ind IS 'A boolean indicator to determine if remediation is required as part of the restorative justice process.';

COMMENT ON COLUMN investigation.restorative_justice.comment IS 'Freeform comment about the restorative justice process.';

COMMENT ON COLUMN investigation.restorative_justice.active_ind IS 'A boolean indicator to determine if the restorative justice record is active. Inactive values are retained for legacy data integrity and history.';

COMMENT ON COLUMN investigation.restorative_justice.create_user_id IS 'The id of the user that created the restorative justice record.';

COMMENT ON COLUMN investigation.restorative_justice.create_utc_timestamp IS 'The timestamp when the restorative justice record was created. Stored in UTC with no offset.';

COMMENT ON COLUMN investigation.restorative_justice.update_user_id IS 'The id of the user that last updated the restorative justice record.';

COMMENT ON COLUMN investigation.restorative_justice.update_utc_timestamp IS 'The timestamp when the restorative justice record was last updated. Stored in UTC with no offset.';

CREATE TABLE
    investigation.restorative_justice_h (
        h_restorative_justice_guid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        target_row_id UUID NOT NULL,
        operation_type CHAR(1) NOT NULL,
        operation_user_id VARCHAR(32) DEFAULT CURRENT_USER NOT NULL,
        operation_executed_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now () NOT NULL,
        data_after_executed_operation JSONB
    );

COMMENT ON TABLE investigation.restorative_justice_h IS 'History table for restorative_justice table.';

COMMENT ON COLUMN investigation.restorative_justice_h.h_restorative_justice_guid IS 'Primary key. System generated unique identifier for the restorative justice history record.';

COMMENT ON COLUMN investigation.restorative_justice_h.target_row_id IS 'The unique key for the restorative justice record that has been created or modified.';

COMMENT ON COLUMN investigation.restorative_justice_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT ON COLUMN investigation.restorative_justice_h.operation_user_id IS 'The id of the user that created or modified the data in the restorative_justice table.';

COMMENT ON COLUMN investigation.restorative_justice_h.operation_executed_at IS 'The timestamp when the data in the restorative_justice table was created or modified. Stored in UTC with no offset.';

COMMENT ON COLUMN investigation.restorative_justice_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.';

CREATE TRIGGER restorative_justice_history_trigger BEFORE INSERT
OR
UPDATE
OR DELETE ON investigation.restorative_justice FOR EACH ROW EXECUTE FUNCTION investigation.audit_history (
    'restorative_justice_h',
    'restorative_justice_guid'
);

-- ==========================================
-- COURT PROSECUTION STATUS CODE
-- ==========================================
CREATE TABLE
    investigation.court_prosecution_status_code (
        court_prosecution_status_code VARCHAR(16) PRIMARY KEY NOT NULL,
        short_description VARCHAR(64) NOT NULL,
        long_description VARCHAR(256),
        display_order INTEGER,
        active_ind BOOLEAN DEFAULT true NOT NULL,
        create_user_id VARCHAR(32) NOT NULL,
        create_utc_timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT now () NOT NULL,
        update_user_id VARCHAR(32),
        update_utc_timestamp TIMESTAMP WITHOUT TIME ZONE
    );

COMMENT ON TABLE investigation.court_prosecution_status_code IS 'Reference table defining the possible statuses of a court prosecution.';

COMMENT ON COLUMN investigation.court_prosecution_status_code.court_prosecution_status_code IS 'Primary key. Code representing the status of a court prosecution.';

COMMENT ON COLUMN investigation.court_prosecution_status_code.short_description IS 'The short description of the court prosecution status code.';

COMMENT ON COLUMN investigation.court_prosecution_status_code.long_description IS 'The long description of the court prosecution status code.';

COMMENT ON COLUMN investigation.court_prosecution_status_code.display_order IS 'The order in which the values should be displayed when presented to a user in a list.';

COMMENT ON COLUMN investigation.court_prosecution_status_code.active_ind IS 'A boolean indicator to determine if the court prosecution status code is active.';

COMMENT ON COLUMN investigation.court_prosecution_status_code.create_user_id IS 'The id of the user that created the court prosecution status code.';

COMMENT ON COLUMN investigation.court_prosecution_status_code.create_utc_timestamp IS 'The timestamp when the court prosecution status code was created. Stored in UTC with no offset.';

COMMENT ON COLUMN investigation.court_prosecution_status_code.update_user_id IS 'The id of the user that last updated the court prosecution status code.';

COMMENT ON COLUMN investigation.court_prosecution_status_code.update_utc_timestamp IS 'The timestamp when the court prosecution status code was last updated. Stored in UTC with no offset.';

INSERT INTO
    investigation.court_prosecution_status_code (
        court_prosecution_status_code,
        short_description,
        long_description,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
VALUES
    (
        'ABSD',
        'Absolute discharge',
        'Absolute discharge',
        10,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'ACQT',
        'Acquitted',
        'Acquitted',
        20,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'CNDD',
        'Conditional discharge',
        'Conditional discharge',
        30,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'FTA',
        'Fail to appear',
        'Fail to appear',
        40,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'GBEX',
        'Guilty by expiry',
        'Guilty by expiry',
        50,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'GBJU',
        'Guilty by judgement',
        'Guilty by judgement',
        60,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'GBPA',
        'Guilty by payment',
        'Guilty by payment',
        70,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'GBPL',
        'Guilty by plea',
        'Guilty by plea',
        80,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'NOTG',
        'Not guilty',
        'Not guilty',
        90,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'RETR',
        'Retrial',
        'Retrial',
        100,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'STAY',
        'Stay of proceedings',
        'Stay of proceedings',
        110,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'UAPL',
        'Under appeal',
        'Under appeal',
        120,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'WRNT',
        'Warrant',
        'Warrant',
        130,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'WTHD',
        'Withdrawn',
        'Withdrawn',
        140,
        true,
        'FLYWAY',
        now ()
    );

-- ==========================================
-- COURT PROSECUTION
-- ==========================================
CREATE TABLE
    investigation.court_prosecution (
        court_prosecution_guid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        enforcement_action_guid UUID NOT NULL REFERENCES investigation.enforcement_action (enforcement_action_guid),
        approval_ind BOOLEAN,
        remediation_required_ind BOOLEAN,
        court_prosecution_status_code VARCHAR(16) NOT NULL REFERENCES investigation.court_prosecution_status_code (court_prosecution_status_code),
        active_ind BOOLEAN DEFAULT true NOT NULL,
        create_user_id VARCHAR(32) NOT NULL,
        create_utc_timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT now () NOT NULL,
        update_user_id VARCHAR(32),
        update_utc_timestamp TIMESTAMP WITHOUT TIME ZONE
    );

COMMENT ON TABLE investigation.court_prosecution IS 'Records the details of a court prosecution issued as part of an enforcement action. Only applicable when the enforcement action is a Court Prosecution.';

COMMENT ON COLUMN investigation.court_prosecution.court_prosecution_guid IS 'Primary key. System generated unique identifier for the court prosecution.';

COMMENT ON COLUMN investigation.court_prosecution.enforcement_action_guid IS 'Foreign key to enforcement_action. Unique identifier for the enforcement action the court prosecution was issued as part of.';

COMMENT ON COLUMN investigation.court_prosecution.approval_ind IS 'A boolean indicator to determine if the court prosecution was approved.';

COMMENT ON COLUMN investigation.court_prosecution.remediation_required_ind IS 'A boolean indicator to determine if remediation is required as part of the court prosecution.';

COMMENT ON COLUMN investigation.court_prosecution.court_prosecution_status_code IS 'Foreign key to court_prosecution_status_code. Code representing the current status of the court prosecution.';

COMMENT ON COLUMN investigation.court_prosecution.active_ind IS 'A boolean indicator to determine if the court prosecution is active. Inactive values are retained for legacy data integrity and history.';

COMMENT ON COLUMN investigation.court_prosecution.create_user_id IS 'The id of the user that created the court prosecution.';

COMMENT ON COLUMN investigation.court_prosecution.create_utc_timestamp IS 'The timestamp when the court prosecution was created. Stored in UTC with no offset.';

COMMENT ON COLUMN investigation.court_prosecution.update_user_id IS 'The id of the user that last updated the court prosecution.';

COMMENT ON COLUMN investigation.court_prosecution.update_utc_timestamp IS 'The timestamp when the court prosecution was last updated. Stored in UTC with no offset.';

CREATE TABLE
    investigation.court_prosecution_h (
        h_court_prosecution_guid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        target_row_id UUID NOT NULL,
        operation_type CHAR(1) NOT NULL,
        operation_user_id VARCHAR(32) DEFAULT CURRENT_USER NOT NULL,
        operation_executed_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now () NOT NULL,
        data_after_executed_operation JSONB
    );

COMMENT ON TABLE investigation.court_prosecution_h IS 'History table for court_prosecution table.';

COMMENT ON COLUMN investigation.court_prosecution_h.h_court_prosecution_guid IS 'Primary key. System generated unique identifier for the court prosecution history record.';

COMMENT ON COLUMN investigation.court_prosecution_h.target_row_id IS 'The unique key for the court prosecution that has been created or modified.';

COMMENT ON COLUMN investigation.court_prosecution_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT ON COLUMN investigation.court_prosecution_h.operation_user_id IS 'The id of the user that created or modified the data in the court_prosecution table.';

COMMENT ON COLUMN investigation.court_prosecution_h.operation_executed_at IS 'The timestamp when the data in the court_prosecution table was created or modified. Stored in UTC with no offset.';

COMMENT ON COLUMN investigation.court_prosecution_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.';

CREATE TRIGGER court_prosecution_history_trigger BEFORE INSERT
OR
UPDATE
OR DELETE ON investigation.court_prosecution FOR EACH ROW EXECUTE FUNCTION investigation.audit_history ('court_prosecution_h', 'court_prosecution_guid');

-- ==========================================
-- ADMINISTRATIVE PENALTY STATUS CODE
-- ==========================================
CREATE TABLE
    investigation.administrative_penalty_status_code (
        administrative_penalty_status_code VARCHAR(16) PRIMARY KEY NOT NULL,
        short_description VARCHAR(64) NOT NULL,
        long_description VARCHAR(256),
        display_order INTEGER,
        active_ind BOOLEAN DEFAULT true NOT NULL,
        create_user_id VARCHAR(32) NOT NULL,
        create_utc_timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT now () NOT NULL,
        update_user_id VARCHAR(32),
        update_utc_timestamp TIMESTAMP WITHOUT TIME ZONE
    );

COMMENT ON TABLE investigation.administrative_penalty_status_code IS 'Reference table defining the possible statuses of an administrative penalty.';

COMMENT ON COLUMN investigation.administrative_penalty_status_code.administrative_penalty_status_code IS 'Primary key. Code representing the status of an administrative penalty.';

COMMENT ON COLUMN investigation.administrative_penalty_status_code.short_description IS 'The short description of the administrative penalty status code.';

COMMENT ON COLUMN investigation.administrative_penalty_status_code.long_description IS 'The long description of the administrative penalty status code.';

COMMENT ON COLUMN investigation.administrative_penalty_status_code.display_order IS 'The order in which the values should be displayed when presented to a user in a list.';

COMMENT ON COLUMN investigation.administrative_penalty_status_code.active_ind IS 'A boolean indicator to determine if the administrative penalty status code is active.';

COMMENT ON COLUMN investigation.administrative_penalty_status_code.create_user_id IS 'The id of the user that created the administrative penalty status code.';

COMMENT ON COLUMN investigation.administrative_penalty_status_code.create_utc_timestamp IS 'The timestamp when the administrative penalty status code was created. Stored in UTC with no offset.';

COMMENT ON COLUMN investigation.administrative_penalty_status_code.update_user_id IS 'The id of the user that last updated the administrative penalty status code.';

COMMENT ON COLUMN investigation.administrative_penalty_status_code.update_utc_timestamp IS 'The timestamp when the administrative penalty status code was last updated. Stored in UTC with no offset.';

INSERT INTO
    investigation.administrative_penalty_status_code (
        administrative_penalty_status_code,
        short_description,
        long_description,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
VALUES
    (
        'APLD',
        'Appealed',
        'Appealed',
        10,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'CNLD',
        'Cancelled',
        'Cancelled',
        20,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'ISUD',
        'Issued',
        'Issued',
        30,
        true,
        'FLYWAY',
        now ()
    );

-- ==========================================
-- ADMINISTRATIVE PENALTY
-- ==========================================
CREATE TABLE
    investigation.administrative_penalty (
        administrative_penalty_guid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        enforcement_action_guid UUID NOT NULL REFERENCES investigation.enforcement_action (enforcement_action_guid),
        approval_ind BOOLEAN,
        remediation_required_ind BOOLEAN,
        administrative_penalty_status_code VARCHAR(16) NOT NULL REFERENCES investigation.administrative_penalty_status_code (administrative_penalty_status_code),
        comment TEXT,
        active_ind BOOLEAN DEFAULT true NOT NULL,
        create_user_id VARCHAR(32) NOT NULL,
        create_utc_timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT now () NOT NULL,
        update_user_id VARCHAR(32),
        update_utc_timestamp TIMESTAMP WITHOUT TIME ZONE
    );

COMMENT ON TABLE investigation.administrative_penalty IS 'Records the details of an administrative penalty issued as part of an enforcement action. Only applicable when the enforcement action is an Administrative Penalty.';

COMMENT ON COLUMN investigation.administrative_penalty.administrative_penalty_guid IS 'Primary key. System generated unique identifier for the administrative penalty.';

COMMENT ON COLUMN investigation.administrative_penalty.enforcement_action_guid IS 'Foreign key to enforcement_action. Unique identifier for the enforcement action the administrative penalty was issued as part of.';

COMMENT ON COLUMN investigation.administrative_penalty.approval_ind IS 'A boolean indicator to determine if the administrative penalty was approved.';

COMMENT ON COLUMN investigation.administrative_penalty.remediation_required_ind IS 'A boolean indicator to determine if remediation is required as part of the administrative penalty.';

COMMENT ON COLUMN investigation.administrative_penalty.administrative_penalty_status_code IS 'Foreign key to administrative_penalty_status_code. Code representing the current status of the administrative penalty.';

COMMENT ON COLUMN investigation.administrative_penalty.comment IS 'Freeform comment about the administrative penalty.';

COMMENT ON COLUMN investigation.administrative_penalty.active_ind IS 'A boolean indicator to determine if the administrative penalty is active. Inactive values are retained for legacy data integrity and history.';

COMMENT ON COLUMN investigation.administrative_penalty.create_user_id IS 'The id of the user that created the administrative penalty.';

COMMENT ON COLUMN investigation.administrative_penalty.create_utc_timestamp IS 'The timestamp when the administrative penalty was created. Stored in UTC with no offset.';

COMMENT ON COLUMN investigation.administrative_penalty.update_user_id IS 'The id of the user that last updated the administrative penalty.';

COMMENT ON COLUMN investigation.administrative_penalty.update_utc_timestamp IS 'The timestamp when the administrative penalty was last updated. Stored in UTC with no offset.';

CREATE TABLE
    investigation.administrative_penalty_h (
        h_administrative_penalty_guid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        target_row_id UUID NOT NULL,
        operation_type CHAR(1) NOT NULL,
        operation_user_id VARCHAR(32) DEFAULT CURRENT_USER NOT NULL,
        operation_executed_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now () NOT NULL,
        data_after_executed_operation JSONB
    );

COMMENT ON TABLE investigation.administrative_penalty_h IS 'History table for administrative_penalty table.';

COMMENT ON COLUMN investigation.administrative_penalty_h.h_administrative_penalty_guid IS 'Primary key. System generated unique identifier for the administrative penalty history record.';

COMMENT ON COLUMN investigation.administrative_penalty_h.target_row_id IS 'The unique key for the administrative penalty that has been created or modified.';

COMMENT ON COLUMN investigation.administrative_penalty_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT ON COLUMN investigation.administrative_penalty_h.operation_user_id IS 'The id of the user that created or modified the data in the administrative_penalty table.';

COMMENT ON COLUMN investigation.administrative_penalty_h.operation_executed_at IS 'The timestamp when the data in the administrative_penalty table was created or modified. Stored in UTC with no offset.';

COMMENT ON COLUMN investigation.administrative_penalty_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully.';

CREATE TRIGGER administrative_penalty_history_trigger BEFORE INSERT
OR
UPDATE
OR DELETE ON investigation.administrative_penalty FOR EACH ROW EXECUTE FUNCTION investigation.audit_history (
    'administrative_penalty_h',
    'administrative_penalty_guid'
);