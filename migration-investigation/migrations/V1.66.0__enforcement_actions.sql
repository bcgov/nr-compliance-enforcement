-- ==========================================
-- ENFORCEMENT ACTION CODE
-- ==========================================
CREATE TABLE enforcement_action_code (
    enforcement_action_code         VARCHAR(16) PRIMARY KEY NOT NULL,
    short_description               VARCHAR(64) NOT NULL,
    long_description                VARCHAR(256),
    display_order                   INTEGER,
    active_ind                      BOOLEAN DEFAULT true NOT NULL,
    create_user_id                  VARCHAR(32) NOT NULL,
    create_utc_timestamp            TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    update_user_id                  VARCHAR(32),
    update_utc_timestamp            TIMESTAMP WITHOUT TIME ZONE
);

COMMENT ON TABLE enforcement_action_code IS
    'Reference table defining the types of enforcement actions that can be taken against a party for a contravention.';

COMMENT ON COLUMN enforcement_action_code.enforcement_action_code IS
    'Primary key. Code representing the type of enforcement action.';

COMMENT ON COLUMN enforcement_action_code.short_description IS
    'The short description of the enforcement action code. Used to store shorter versions of the long description when applicable.';

COMMENT ON COLUMN enforcement_action_code.long_description IS
    'The long description of the enforcement action code. May contain additional detail not typically displayed in the application.';

COMMENT ON COLUMN enforcement_action_code.display_order IS
    'The order in which the values of the enforcement action code should be displayed when presented to a user in a list. Originally incremented by 10s to allow for new values to be easily added.';

COMMENT ON COLUMN enforcement_action_code.active_ind IS
    'A boolean indicator to determine if the enforcement action code is active. Inactive values are retained for legacy data integrity but are not valid choices for new data.';

COMMENT ON COLUMN enforcement_action_code.create_user_id IS
    'The id of the user that created the enforcement action code.';

COMMENT ON COLUMN enforcement_action_code.create_utc_timestamp IS
    'The timestamp when the enforcement action code was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN enforcement_action_code.update_user_id IS
    'The id of the user that last updated the enforcement action code.';

COMMENT ON COLUMN enforcement_action_code.update_utc_timestamp IS
    'The timestamp when the enforcement action code was last updated. The timestamp is stored in UTC with no offset.';

INSERT INTO enforcement_action_code (
    enforcement_action_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
) VALUES
    ('FDVT',  'Federal Violation Ticket',    'Federal Violation Ticket',    10, true, 'SYSTEM', now()),
    ('LIAC',     'License Action',              'License Action',              20, true, 'SYSTEM', now()),
    ('NOAC',      'No Action',                   'No Action',                   30, true, 'SYSTEM', now()),
    ('PRVT',  'Provincial Violation Ticket', 'Provincial Violation Ticket', 40, true, 'SYSTEM', now()),
    ('WARN',       'Warning',                     'Warning',                     50, true, 'SYSTEM', now());


-- ==========================================
-- TICKET OUTCOME CODE
-- ==========================================
CREATE TABLE ticket_outcome_code (
    ticket_outcome_code             VARCHAR(16) PRIMARY KEY NOT NULL,
    short_description               VARCHAR(64) NOT NULL,
    long_description                VARCHAR(256),
    display_order                   INTEGER,
    active_ind                      BOOLEAN DEFAULT true NOT NULL,
    create_user_id                  VARCHAR(32) NOT NULL,
    create_utc_timestamp            TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    update_user_id                  VARCHAR(32),
    update_utc_timestamp            TIMESTAMP WITHOUT TIME ZONE
);

COMMENT ON TABLE ticket_outcome_code IS
    'Reference table defining the possible outcomes of a violation ticket.';

COMMENT ON COLUMN ticket_outcome_code.ticket_outcome_code IS
    'Primary key. Code representing the outcome of a violation ticket.';

COMMENT ON COLUMN ticket_outcome_code.short_description IS
    'The short description of the ticket outcome code. Used to store shorter versions of the long description when applicable.';

COMMENT ON COLUMN ticket_outcome_code.long_description IS
    'The long description of the ticket outcome code. May contain additional detail not typically displayed in the application.';

COMMENT ON COLUMN ticket_outcome_code.display_order IS
    'The order in which the values of the ticket outcome code should be displayed when presented to a user in a list. Originally incremented by 10s to allow for new values to be easily added.';

COMMENT ON COLUMN ticket_outcome_code.active_ind IS
    'A boolean indicator to determine if the ticket outcome code is active. Inactive values are retained for legacy data integrity but are not valid choices for new data.';

COMMENT ON COLUMN ticket_outcome_code.create_user_id IS
    'The id of the user that created the ticket outcome code.';

COMMENT ON COLUMN ticket_outcome_code.create_utc_timestamp IS
    'The timestamp when the ticket outcome code was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN ticket_outcome_code.update_user_id IS
    'The id of the user that last updated the ticket outcome code.';

COMMENT ON COLUMN ticket_outcome_code.update_utc_timestamp IS
    'The timestamp when the ticket outcome code was last updated. The timestamp is stored in UTC with no offset.';

INSERT INTO ticket_outcome_code (
    ticket_outcome_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
) VALUES
    ('APLD',  'Appealed',  'Appealed',  10, true, 'SYSTEM', now()),
    ('CNLD', 'Cancelled', 'Cancelled', 20, true, 'SYSTEM', now()),
    ('ISUD',    'Issued',    'Issued',    30, true, 'SYSTEM', now()),
    ('PAID',      'Paid',      'Paid',      40, true, 'SYSTEM', now());

-- ==========================================
-- ENFORCEMENT ACTION CODE AGENCY XREF
-- ==========================================
CREATE TABLE enforcement_action_code_agency_xref (
    enforcement_action_code_agency_xref_guid    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enforcement_action_code                     VARCHAR(16) NOT NULL REFERENCES enforcement_action_code (enforcement_action_code),
    agency_code_ref                             VARCHAR(16) NOT NULL,
    active_ind                                  BOOLEAN DEFAULT true NOT NULL,
    create_user_id                              VARCHAR(32) NOT NULL,
    create_utc_timestamp                        TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    update_user_id                              VARCHAR(32),
    update_utc_timestamp                        TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT uq_enforcement_action_code_agency UNIQUE (enforcement_action_code, agency_code_ref)
);

COMMENT ON TABLE enforcement_action_code_agency_xref IS
    'Cross reference table linking enforcement action codes to agencies. Allows different agencies to have different sets of available enforcement actions.';

COMMENT ON COLUMN enforcement_action_code_agency_xref.enforcement_action_code_agency_xref_guid IS
    'Primary key. System generated unique identifier for the enforcement action code and agency cross reference.';

COMMENT ON COLUMN enforcement_action_code_agency_xref.enforcement_action_code IS
    'Foreign key to enforcement_action_code. Code representing the type of enforcement action.';

COMMENT ON COLUMN enforcement_action_code_agency_xref.agency_code_ref IS
    'Cross schema foreign key (unenforced) to shared.agency_code. Code representing the agency that the enforcement action code is available to.';

COMMENT ON COLUMN enforcement_action_code_agency_xref.active_ind IS
    'A boolean indicator to determine if the cross reference is active. Inactive values are retained for legacy data integrity but are not valid choices for new data.';

COMMENT ON COLUMN enforcement_action_code_agency_xref.create_user_id IS
    'The id of the user that created the cross reference.';

COMMENT ON COLUMN enforcement_action_code_agency_xref.create_utc_timestamp IS
    'The timestamp when the cross reference was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN enforcement_action_code_agency_xref.update_user_id IS
    'The id of the user that last updated the cross reference.';

COMMENT ON COLUMN enforcement_action_code_agency_xref.update_utc_timestamp IS
    'The timestamp when the cross reference was last updated. The timestamp is stored in UTC with no offset.';


-- ==========================================
-- ENFORCEMENT ACTION
-- ==========================================
CREATE TABLE enforcement_action (
    enforcement_action_guid             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contravention_party_xref_guid       UUID NOT NULL REFERENCES contravention_party_xref (contravention_party_xref_guid),
    enforcement_action_code             VARCHAR(16) NOT NULL REFERENCES enforcement_action_code (enforcement_action_code),
    date_issued                         DATE NOT NULL,
    geo_organization_unit_code_ref      VARCHAR(16) NOT NULL,
    app_user_guid_ref                   UUID NOT NULL,
    active_ind                          BOOLEAN DEFAULT true NOT NULL,
    create_user_id                      VARCHAR(32) NOT NULL,
    create_utc_timestamp                TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    update_user_id                      VARCHAR(32),
    update_utc_timestamp                TIMESTAMP WITHOUT TIME ZONE
);

COMMENT ON TABLE enforcement_action IS
    'Records the enforcement action taken against a party for a specific contravention within an investigation.';

COMMENT ON COLUMN enforcement_action.enforcement_action_guid IS
    'Primary key. System generated unique identifier for the enforcement action.';

COMMENT ON COLUMN enforcement_action.contravention_party_xref_guid IS
    'Foreign key to contravention_party_xref. Links the enforcement action to the specific party and contravention pairing it was issued against.';

COMMENT ON COLUMN enforcement_action.enforcement_action_code IS
    'Foreign key to enforcement_action_code. Code representing the type of enforcement action taken.';

COMMENT ON COLUMN enforcement_action.date_issued IS
    'The date the enforcement action was issued. Defaults to the current date.';

COMMENT ON COLUMN enforcement_action.geo_organization_unit_code_ref IS
    'Cross schema foreign key (unenforced) to shared.geo_organization_unit_code. Code representing the community where the enforcement action was issued. Defaults to the community of the associated contravention.';

COMMENT ON COLUMN enforcement_action.app_user_guid_ref IS
    'Cross schema foreign key (unenforced) to shared.app_user. Unique identifier for the application user that served the enforcement action. Defaults to the primary investigator of the investigation.';

COMMENT ON COLUMN enforcement_action.active_ind IS
    'A boolean indicator to determine if the enforcement action is active. Inactive values are retained for legacy data integrity and history.';

COMMENT ON COLUMN enforcement_action.create_user_id IS
    'The id of the user that created the enforcement action.';

COMMENT ON COLUMN enforcement_action.create_utc_timestamp IS
    'The timestamp when the enforcement action was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN enforcement_action.update_user_id IS
    'The id of the user that last updated the enforcement action.';

COMMENT ON COLUMN enforcement_action.update_utc_timestamp IS
    'The timestamp when the enforcement action was last updated. The timestamp is stored in UTC with no offset.';


-- ==========================================
-- ENFORCEMENT ACTION HISTORY
-- ==========================================
CREATE TABLE enforcement_action_h (
    h_enforcement_action_guid           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_row_id                       UUID NOT NULL,
    operation_type                      CHAR(1) NOT NULL,
    operation_user_id                   VARCHAR(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at               TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    data_after_executed_operation       JSONB
);

COMMENT ON TABLE enforcement_action_h IS
    'History table for enforcement_action table.';

COMMENT ON COLUMN enforcement_action_h.h_enforcement_action_guid IS
    'Primary key. System generated unique identifier for the enforcement action history record.';

COMMENT ON COLUMN enforcement_action_h.target_row_id IS
    'The unique key for the enforcement action that has been created or modified.';

COMMENT ON COLUMN enforcement_action_h.operation_type IS
    'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT ON COLUMN enforcement_action_h.operation_user_id IS
    'The id of the user that created or modified the data in the enforcement action table. Defaults to the logged in user if not passed in by the application.';

COMMENT ON COLUMN enforcement_action_h.operation_executed_at IS
    'The timestamp when the data in the enforcement action table was created or modified. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN enforcement_action_h.data_after_executed_operation IS
    'A JSON representation of the row in the table after the operation was completed successfully. This implies that the latest row in the audit table will always match with the current row in the live table.';

CREATE TRIGGER enforcement_action_history_trigger
    BEFORE INSERT OR UPDATE OR DELETE ON enforcement_action
    FOR EACH ROW EXECUTE FUNCTION investigation.audit_history('enforcement_action_h', 'enforcement_action_guid');

-- ==========================================
-- TICKET
-- ==========================================
CREATE TABLE ticket (
    ticket_guid                         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enforcement_action_guid             UUID NOT NULL REFERENCES enforcement_action (enforcement_action_guid),
    ticket_outcome_code                 VARCHAR(16) NOT NULL REFERENCES ticket_outcome_code (ticket_outcome_code),
    ticket_amount                       NUMERIC(10,2) NOT NULL,
    active_ind                          BOOLEAN DEFAULT true NOT NULL,
    create_user_id                      VARCHAR(32) NOT NULL,
    create_utc_timestamp                TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    update_user_id                      VARCHAR(32),
    update_utc_timestamp                TIMESTAMP WITHOUT TIME ZONE
);

COMMENT ON TABLE ticket IS
    'Records the details of a violation ticket issued as part of an enforcement action. Only applicable when the enforcement action is a provincial or federal violation ticket.';

COMMENT ON COLUMN ticket.ticket_guid IS
    'Primary key. System generated unique identifier for the ticket.';

COMMENT ON COLUMN ticket.enforcement_action_guid IS
    'Foreign key to enforcement_action. Unique identifier for the enforcement action that the ticket was issued as part of.';

COMMENT ON COLUMN ticket.ticket_outcome_code IS
    'Foreign key to ticket_outcome_code. Code representing the current outcome of the ticket. Defaults to Issued.';

COMMENT ON COLUMN ticket.ticket_amount IS
    'The monetary amount of the violation ticket.';

COMMENT ON COLUMN ticket.active_ind IS
    'A boolean indicator to determine if the ticket is active. Inactive values are retained for legacy data integrity and history.';

COMMENT ON COLUMN ticket.create_user_id IS
    'The id of the user that created the ticket.';

COMMENT ON COLUMN ticket.create_utc_timestamp IS
    'The timestamp when the ticket was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN ticket.update_user_id IS
    'The id of the user that last updated the ticket.';

COMMENT ON COLUMN ticket.update_utc_timestamp IS
    'The timestamp when the ticket was last updated. The timestamp is stored in UTC with no offset.';


-- ==========================================
-- TICKET HISTORY
-- ==========================================
CREATE TABLE ticket_h (
    h_ticket_guid                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_row_id                       UUID NOT NULL,
    operation_type                      CHAR(1) NOT NULL,
    operation_user_id                   VARCHAR(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at               TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    data_after_executed_operation       JSONB
);

COMMENT ON TABLE ticket_h IS
    'History table for ticket table.';

COMMENT ON COLUMN ticket_h.h_ticket_guid IS
    'Primary key. System generated unique identifier for the ticket history record.';

COMMENT ON COLUMN ticket_h.target_row_id IS
    'The unique key for the ticket that has been created or modified.';

COMMENT ON COLUMN ticket_h.operation_type IS
    'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT ON COLUMN ticket_h.operation_user_id IS
    'The id of the user that created or modified the data in the ticket table. Defaults to the logged in user if not passed in by the application.';

COMMENT ON COLUMN ticket_h.operation_executed_at IS
    'The timestamp when the data in the ticket table was created or modified. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN ticket_h.data_after_executed_operation IS
    'A JSON representation of the row in the table after the operation was completed successfully. This implies that the latest row in the audit table will always match with the current row in the live table.';

CREATE TRIGGER ticket_history_trigger
    BEFORE INSERT OR UPDATE OR DELETE ON ticket
    FOR EACH ROW EXECUTE FUNCTION investigation.audit_history('ticket_h', 'ticket_guid');