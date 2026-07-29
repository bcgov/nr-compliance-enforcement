-- Clear all existing legislation data and config
DELETE FROM legislation_configuration;
DELETE FROM legislation;

-- Delete the regulations in legislation_source 
DELETE FROM legislation_source
WHERE create_user_id = 'system';

-- ============================================================
-- Table: legislation_version
-- Purpose: One imported snapshot of a legislation source (effective dates, related legislation, and its import state)
-- ============================================================

CREATE TABLE legislation_version (
    legislation_version_guid        UUID PRIMARY KEY DEFAULT public.uuid_generate_v4 (),
    legislation_source_guid         UUID NOT NULL,
    parent_legislation_version_guid UUID,
    effective_date                  DATE NOT NULL,
    expiry_date                     DATE,
    import_status                   VARCHAR(16) NOT NULL,
    source_url                      VARCHAR(512),
    source_effective_date           DATE,
    last_import_timestamp           TIMESTAMP,
    last_import_log                 TEXT,
    create_user_id                  VARCHAR(32) NOT NULL,
    create_utc_timestamp            TIMESTAMP NOT NULL DEFAULT NOW(),
    update_user_id                  VARCHAR(32),
    update_utc_timestamp            TIMESTAMP,
    CONSTRAINT fk_legislation_version_source
        FOREIGN KEY (legislation_source_guid) REFERENCES legislation_source (legislation_source_guid),
    CONSTRAINT fk_legislation_version_parent
        FOREIGN KEY (parent_legislation_version_guid) REFERENCES legislation_version (legislation_version_guid),
    CONSTRAINT chk_legislation_version_import_status
        CHECK (import_status IN ('PENDING', 'SUCCESS', 'FAILED'))
);

-- ---------------------
-- Indexes
-- ---------------------

CREATE INDEX idx_legislation_version_source
    ON legislation_version (legislation_source_guid);

CREATE INDEX idx_legislation_version_parent
    ON legislation_version (parent_legislation_version_guid);

-- ---------------------
-- Comments
-- ---------------------

COMMENT ON TABLE legislation_version IS
    'Stores one imported version of a legislation source. Successful versions of a source form a non-overlapping timeline of effective date windows; the newest has no expiry date.';

COMMENT ON COLUMN legislation_version.legislation_version_guid IS
    'Primary key. Unique identifier for the legislation version.';

COMMENT ON COLUMN legislation_version.legislation_source_guid IS
    'Foreign key to legislation_source. The act or regulation source this version snapshots.';

COMMENT ON COLUMN legislation_version.parent_legislation_version_guid IS
    'Self-referencing FK to represent hierarchy. Null for act versions; regulation versions point at the act version they were imported with.';

COMMENT ON COLUMN legislation_version.effective_date IS
    'Date this version comes into force. Admin set on act versions, mirrored from the act version on regulation versions.';

COMMENT ON COLUMN legislation_version.expiry_date IS
    'Date this version is superseded by the next version, exclusive. Null when the version is the newest for its source.';

COMMENT ON COLUMN legislation_version.import_status IS
    'Status of the import for this version: PENDING, SUCCESS, or FAILED. Only successful versions are visible to the application.';

COMMENT ON COLUMN legislation_version.source_url IS
    'The URL that was fetched when this version was imported.';

COMMENT ON COLUMN legislation_version.source_effective_date IS
    'The date the source document reports for itself (BC Laws assented to / deposited, federal in force start date). Informational only.';

COMMENT ON COLUMN legislation_version.last_import_timestamp IS
    'Timestamp of the last import attempt for this version. NULL if never attempted.';

COMMENT ON COLUMN legislation_version.last_import_log IS
    'Log message or error details from the last import attempt, including the added / removed / skipped regulation diff.';

COMMENT ON COLUMN legislation_version.create_user_id IS
    'The id of the user that created the legislation version.';

COMMENT ON COLUMN legislation_version.create_utc_timestamp IS
    'The timestamp when the legislation version was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN legislation_version.update_user_id IS
    'The id of the user that last updated the legislation version.';

COMMENT ON COLUMN legislation_version.update_utc_timestamp IS
    'The timestamp when the legislation version was last updated. The timestamp is stored in UTC with no offset.';

CREATE TABLE
  legislation_version_h (
    h_legislation_version_guid uuid DEFAULT public.uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

COMMENT ON TABLE legislation_version_h IS 'History table for legislation version table';

COMMENT ON COLUMN legislation_version_h.h_legislation_version_guid IS 'System generated unique key for legislation version history. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN legislation_version_h.target_row_id IS 'The unique key for the legislation version that has been created or modified.';

COMMENT ON COLUMN legislation_version_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT ON COLUMN legislation_version_h.operation_user_id IS 'The id of the user that created or modified the data in the legislation version table. Defaults to the logged in user if not passed in by the application.';

COMMENT ON COLUMN legislation_version_h.operation_executed_at IS 'The timestamp when the data in the legislation version table was created or modified. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN legislation_version_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully. This implies that the latest row in the audit table will always match with the current row in the live table.';

ALTER TABLE legislation_version_h ADD CONSTRAINT "PK_h_legislation_version" PRIMARY KEY (h_legislation_version_guid);

CREATE TRIGGER legislation_version_history_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON legislation_version FOR EACH ROW EXECUTE FUNCTION audit_history ('legislation_version_h', 'legislation_version_guid');

-- Update legislation_source to better support regulation relationships and future versioning
ALTER TABLE legislation_source
ADD COLUMN parent_legislation_source_guid UUID;

-- Update legislation_source to include external key for bclaws / federal law source documents
ALTER TABLE legislation_source
ADD COLUMN external_key VARCHAR(64);

-- Add constraints and indexes for the new columns
ALTER TABLE legislation_source
ADD CONSTRAINT fk_legislation_source_parent
    FOREIGN KEY (parent_legislation_source_guid) REFERENCES legislation_source (legislation_source_guid);

CREATE INDEX idx_legislation_source_parent
    ON legislation_source (parent_legislation_source_guid);

CREATE UNIQUE INDEX legislation_source_external_key_unique
    ON legislation_source (parent_legislation_source_guid, external_key)
    WHERE external_key IS NOT NULL;

-- Regulation titles exceeded the previous limit and were truncated
ALTER TABLE legislation_source
ALTER COLUMN short_description TYPE VARCHAR(256);

COMMENT ON COLUMN legislation_source.parent_legislation_source_guid IS
    'Self-referencing FK to the act source. Null for admin-created act sources; set on system-created regulation sources.';

COMMENT ON COLUMN legislation_source.external_key IS
    'The upstream document identity: the CIVIX document id for BC Laws, the AlphaNumber for federal legislation. The key the importer matches regulations on.';

-- ============================================================
-- Table: legislation_source_h
-- Purpose: History table for legislation source
-- ============================================================

CREATE TABLE
  legislation_source_h (
    h_legislation_source_guid uuid DEFAULT public.uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

COMMENT ON TABLE legislation_source_h IS 'History table for legislation source table';

COMMENT ON COLUMN legislation_source_h.h_legislation_source_guid IS 'System generated unique key for legislation source history. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN legislation_source_h.target_row_id IS 'The unique key for the legislation source that has been created or modified.';

COMMENT ON COLUMN legislation_source_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT ON COLUMN legislation_source_h.operation_user_id IS 'The id of the user that created or modified the data in the legislation source table. Defaults to the logged in user if not passed in by the application.';

COMMENT ON COLUMN legislation_source_h.operation_executed_at IS 'The timestamp when the data in the legislation source table was created or modified. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN legislation_source_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully. This implies that the latest row in the audit table will always match with the current row in the live table.';

ALTER TABLE legislation_source_h ADD CONSTRAINT "PK_h_legislation_source" PRIMARY KEY (h_legislation_source_guid);

CREATE TRIGGER legislation_source_history_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON legislation_source FOR EACH ROW EXECUTE FUNCTION audit_history ('legislation_source_h', 'legislation_source_guid');

-- ============================================================
-- Table: legislation_configuration_h
-- Purpose: History table for legislation configuration
-- ============================================================

CREATE TABLE
  legislation_configuration_h (
    h_legislation_configuration_guid uuid DEFAULT public.uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

COMMENT ON TABLE legislation_configuration_h IS 'History table for legislation configuration table';

COMMENT ON COLUMN legislation_configuration_h.h_legislation_configuration_guid IS 'System generated unique key for legislation configuration history. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN legislation_configuration_h.target_row_id IS 'The unique key for the legislation configuration that has been created or modified.';

COMMENT ON COLUMN legislation_configuration_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT ON COLUMN legislation_configuration_h.operation_user_id IS 'The id of the user that created or modified the data in the legislation configuration table. Defaults to the logged in user if not passed in by the application.';

COMMENT ON COLUMN legislation_configuration_h.operation_executed_at IS 'The timestamp when the data in the legislation configuration table was created or modified. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN legislation_configuration_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully. This implies that the latest row in the audit table will always match with the current row in the live table.';

ALTER TABLE legislation_configuration_h ADD CONSTRAINT "PK_h_legislation_configuration" PRIMARY KEY (h_legislation_configuration_guid);

CREATE TRIGGER legislation_configuration_history_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON legislation_configuration FOR EACH ROW EXECUTE FUNCTION audit_history ('legislation_configuration_h', 'legislation_configuration_guid');

-- Add FK to legislation_version and indexes
ALTER TABLE legislation
ADD COLUMN legislation_version_guid UUID NOT NULL;

ALTER TABLE legislation
ADD CONSTRAINT fk_legislation_version
    FOREIGN KEY (legislation_version_guid) REFERENCES legislation_version (legislation_version_guid);

CREATE INDEX idx_legislation_version
    ON legislation (legislation_version_guid);

COMMENT ON COLUMN legislation.legislation_version_guid IS
    'Foreign key to legislation_version. The version this node was imported into; act nodes carry the act version, regulation subtrees their own regulation version.';

-- These are moved to legislation_version
ALTER TABLE legislation
DROP COLUMN legislation_source_guid;

ALTER TABLE legislation
DROP COLUMN effective_date;

ALTER TABLE legislation
DROP COLUMN expiry_date;

-- Seed a pending version for sources that were already awaiting import (eg seeded sources for dev instances)

INSERT INTO legislation_version (
    legislation_source_guid,
    effective_date,
    import_status,
    create_user_id
)
SELECT
    legislation_source_guid,
    '1900-01-01',
    'PENDING',
    'system'
FROM legislation_source
WHERE active_ind
  AND NOT imported_ind;

-- Import state moves to legislation_version

ALTER TABLE legislation_source
DROP COLUMN imported_ind;

ALTER TABLE legislation_source
DROP COLUMN import_status;

ALTER TABLE legislation_source
DROP COLUMN last_import_timestamp;

ALTER TABLE legislation_source
DROP COLUMN last_import_log;
