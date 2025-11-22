-- ============================================================
-- Table: legislation_type_code
-- Purpose: Defines types of legislation (Act, Regulation, Section, etc.)
-- ============================================================

CREATE TABLE legislation_type_code (
    legislation_type_code      VARCHAR(16) PRIMARY KEY,
    short_description          VARCHAR(64) NOT NULL,
    long_description           VARCHAR(128) NOT NULL,
    display_order              INTEGER NOT NULL,
    active_ind                 BOOLEAN NOT NULL DEFAULT TRUE,
    create_user_id             VARCHAR(32) NOT NULL,
    create_utc_timestamp       TIMESTAMP NOT NULL DEFAULT NOW(),
    update_user_id             VARCHAR(32),
    update_utc_timestamp       TIMESTAMP
);

-- ---------------------
-- Comments
-- ---------------------

COMMENT ON TABLE legislation_type_code IS
    'Reference table defining types of legislation (Act, Regulation, Section, Subsection, etc.).';

COMMENT ON COLUMN legislation_type_code.legislation_type_code IS
    'Primary key. Code representing the type of legislation (e.g., ACT, REGULATION, SECTION).';

COMMENT ON COLUMN legislation_type_code.short_description IS
    'The short description of the legislation type code.  Used to store shorter versions of the long description when applicable.';

COMMENT ON COLUMN legislation_type_code.long_description IS
    'The long description of the legislation type code.  May contain additional detail not typically displayed in the application.';

COMMENT ON COLUMN legislation_type_code.display_order IS
    'The order in which the values of the legislation type code should be displayed when presented to a user in a list.  Originally incremented by 10s to allow for new values to be easily added.';

COMMENT ON COLUMN legislation_type_code.active_ind IS
    'A boolean indicator to determine if the legislation type is active.  Inactive values are still retained in the system for legacy data integrity but are not valid choices for new data being added.';

COMMENT ON COLUMN legislation_type_code.create_user_id IS
    'The id of the user that created the legislation type code.';

COMMENT ON COLUMN legislation_type_code.create_utc_timestamp IS
    'The timestamp when the legislation type code was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN legislation_type_code.update_user_id IS
    'The id of the user that last updated the legislation type code.';

COMMENT ON COLUMN legislation_type_code.update_utc_timestamp IS
    'The timestamp when the legislation type code was last updated. The timestamp is stored in UTC with no offset.';

-- ============================================================
-- Table: legislation
-- Purpose: Holds all hierarchical legislation elements (Act, Regulation,
--          Section, Subsection, Paragraph, Subparagraph)
-- ============================================================


CREATE TABLE legislation (
    legislation_guid           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    legislation_type_code      VARCHAR(16) NOT NULL REFERENCES legislation_type_code (legislation_type_code),
    parent_legislation_guid    UUID REFERENCES legislation (legislation_guid) ON DELETE CASCADE,
    citation                   VARCHAR(64),
    full_citation              VARCHAR(512),
    section_title              VARCHAR(64),
    legislation_text           TEXT,
    alternate_text             TEXT,
    display_order              INTEGER NOT NULL,
    effective_date             DATE,
    expiry_date                DATE,
    create_user_id             VARCHAR(32) NOT NULL,
    create_utc_timestamp       TIMESTAMP NOT NULL DEFAULT NOW(),
    update_user_id             VARCHAR(32),
    update_utc_timestamp       TIMESTAMP
);

-- ---------------------
-- Indexes
-- ---------------------

CREATE INDEX idx_legislation_parent
    ON legislation (parent_legislation_guid);

CREATE INDEX idx_legislation_type
    ON legislation (legislation_type_code);

CREATE INDEX idx_legislation_effective
    ON legislation (effective_date);

-- ---------------------
-- Comments
-- ---------------------

COMMENT ON TABLE legislation IS
    'Stores hierarchical legislation. Each row may represent an Act, Regulation, Section, Subsection, Paragraph, or Subparagraph. Self-referencing parent_legislation_guid creates the hierarchy.';

COMMENT ON COLUMN legislation.legislation_guid IS
    'Primary key. Unique identifier for the legislation element.';

COMMENT ON COLUMN legislation.legislation_type_code IS
    'Foreign key to legislation_type_code. Defines the type of this legislative element.';

COMMENT ON COLUMN legislation.parent_legislation_guid IS
    'Self-referencing FK to represent hierarchy (e.g., Act -> Regulation -> Section -> Subsection). Null for top-level items.';

COMMENT ON COLUMN legislation.citation IS
    'Short citation for the legislative provision (e.g., "10(3)(a)").';

COMMENT ON COLUMN legislation.full_citation IS
    'Full citation string including Act/Reg and all hierarchy if needed.';

COMMENT ON COLUMN legislation.section_title IS
    'Title of the section, if applicable. Sections may have titles; subsections often do not.';

COMMENT ON COLUMN legislation.legislation_text IS
    'The actual legislative text.';

COMMENT ON COLUMN legislation.alternate_text IS
    'Analyst-provided summary text for usability (e.g., "Accept delivery without manifest").   This value might come from a document such as the COS Field Operations Guide.';

COMMENT ON COLUMN legislation.display_order IS
    'The order in which the legislation should be displayed when presented to a user in a list.  Originally incremented by 10s to allow for new values to be easily added.  May contain duplicates to allow for hierarchical ordering.';

COMMENT ON COLUMN legislation.effective_date IS
    'Date when this legislation becomes effective.';

COMMENT ON COLUMN legislation.expiry_date IS
    'Date when this legislation expires, if applicable.';

COMMENT ON COLUMN legislation.create_user_id IS
    'The id of the user that created the legislation.';

COMMENT ON COLUMN legislation.create_utc_timestamp IS
    'The timestamp when the legislation was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN legislation.update_user_id IS
    'The id of the user that last updated the legislation.';

COMMENT ON COLUMN legislation.update_utc_timestamp IS
    'The timestamp when the legislation was last updated. The timestamp is stored in UTC with no offset.';


CREATE TABLE legislation_agency_xref (
    legislation_agency_xref_guid    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    legislation_guid                UUID NOT NULL REFERENCES legislation (legislation_guid),
    agency_code                     VARCHAR(10) NOT NULL REFERENCES agency_code (agency_code),
    create_user_id                  VARCHAR(32) NOT NULL,
    create_utc_timestamp            TIMESTAMP NOT NULL DEFAULT NOW(),
    update_user_id                  VARCHAR(32),
    update_utc_timestamp            TIMESTAMP
);

COMMENT ON TABLE legislation_agency_xref IS
    'Stores a mapping of which agencies are responsible for enforcing which legislative provisions.';

COMMENT ON COLUMN legislation_agency_xref.legislation_agency_xref_guid IS
    'Primary key. Unique identifier for the agency/legislation mapping.';

COMMENT ON COLUMN legislation_agency_xref.legislation_guid IS
    'Foreign key to legislation.   Defines a specific piece of legislation.';

COMMENT ON COLUMN legislation_agency_xref.agency_code IS
    'Foreign key to agency_code.   Defines a specific agency that uses the app.';

COMMENT ON COLUMN legislation_agency_xref.create_user_id IS
    'The id of the user that created the legislation/agency mapping.';

COMMENT ON COLUMN legislation_agency_xref.create_utc_timestamp IS
    'The timestamp when the legislation/agency mapping was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN legislation_agency_xref.update_user_id IS
    'The id of the user that last updated the legislation/agency mapping.';

COMMENT ON COLUMN legislation_agency_xref.update_utc_timestamp IS
    'The timestamp when the legislation/agency mapping was last updated. The timestamp is stored in UTC with no offset.';

-----------------------
-- History Tables
-----------------------

CREATE TABLE
  legislation_h (
    h_legislation_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

COMMENT ON TABLE legislation_h IS 'History table for legislation table';

COMMENT ON COLUMN legislation_h.h_legislation_guid IS 'System generated unique key for legislation history. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN legislation_h.target_row_id IS 'The unique key for the legislation that has been created or modified.';

COMMENT ON COLUMN legislation_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT ON COLUMN legislation_h.operation_user_id IS 'The id of the user that created or modified the data in the legislation table. Defaults to the logged in user if not passed in by the application.';

COMMENT ON COLUMN legislation_h.operation_executed_at IS 'The timestamp when the data in the legislation table was created or modified. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN legislation_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully. This implies that the latest row in the audit table will always match with the current row in the live table.';

ALTER TABLE legislation_h ADD CONSTRAINT "PK_h_legislation" PRIMARY KEY (h_legislation_guid);

CREATE TRIGGER legislation_history_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON legislation FOR EACH ROW EXECUTE FUNCTION audit_history ('legislation_h', 'legislation_guid');

CREATE TABLE
  legislation_agency_xref_h (
    h_legislation_agency_xref_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
    target_row_id uuid NOT NULL,
    operation_type character(1) NOT NULL,
    operation_user_id character varying(32) DEFAULT CURRENT_USER NOT NULL,
    operation_executed_at timestamp without time zone DEFAULT now () NOT NULL,
    data_after_executed_operation jsonb
  );

COMMENT ON TABLE legislation_agency_xref_h IS 'History table for legislation agency xref table';

COMMENT ON COLUMN legislation_agency_xref_h.h_legislation_agency_xref_guid IS 'System generated unique key for legislation history. This key should never be exposed to users via any system utilizing the tables.';

COMMENT ON COLUMN legislation_agency_xref_h.target_row_id IS 'The unique key for the legislation that has been created or modified.';

COMMENT ON COLUMN legislation_agency_xref_h.operation_type IS 'The operation performed: I = Insert, U = Update, D = Delete';

COMMENT ON COLUMN legislation_agency_xref_h.operation_user_id IS 'The id of the user that created or modified the data in the legislation table. Defaults to the logged in user if not passed in by the application.';

COMMENT ON COLUMN legislation_agency_xref_h.operation_executed_at IS 'The timestamp when the data in the legislation table was created or modified. The timestamp is stored in UTC with no Offset.';

COMMENT ON COLUMN legislation_agency_xref_h.data_after_executed_operation IS 'A JSON representation of the row in the table after the operation was completed successfully. This implies that the latest row in the audit table will always match with the current row in the live table.';

ALTER TABLE legislation_agency_xref_h ADD CONSTRAINT "PK_h_legislation_agency_xref" PRIMARY KEY (h_legislation_agency_xref_guid);

CREATE TRIGGER legislation_agency_xref_history_trigger BEFORE INSERT
OR DELETE
OR
UPDATE ON legislation_agency_xref FOR EACH ROW EXECUTE FUNCTION audit_history ('legislation_agency_xref_h', 'legislation_agency_xref_guid');

INSERT INTO legislation_type_code (
    legislation_type_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
) VALUES
    ('ACT', 'Act', 'A statute enacted by the legislature; the highest level of legislation.', 10, TRUE, 'FLYWAY', NOW()),
    ('REG', 'Regulation', 'A regulation created under the authority of an Act.', 20, TRUE, 'FLYWAY', NOW()),
    ('SEC', 'Section', 'A numbered section of an Act or Regulation, often with a title.', 30, TRUE, 'FLYWAY', NOW()),
    ('SUBSEC', 'Subsection', 'A lower-level provision under a section, typically numbered (1), (2), etc.', 40, TRUE, 'FLYWAY', NOW()),
    ('PAR', 'Paragraph', 'A paragraph under a subsection, typically labeled (a), (b), (c).', 50, TRUE, 'FLYWAY', NOW()),
    ('SUBPAR', 'Subparagraph', 'A clause under a paragraph, typically labeled (i), (ii), (iii).', 60, TRUE, 'FLYWAY', NOW());
