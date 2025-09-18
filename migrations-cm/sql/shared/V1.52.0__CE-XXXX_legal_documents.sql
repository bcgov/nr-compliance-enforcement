-- This migration intentionally does not modify application ORM/Prisma files
-- Source definitions for documents (origin URL and processing timestamps)
CREATE TABLE
  shared.legal_document_source (
    legal_document_source_guid UUID NOT NULL DEFAULT uuid_generate_v4 () PRIMARY KEY,
    source_url TEXT NOT NULL,
    last_processed_utc_timestamp TIMESTAMP,
    create_user_id VARCHAR(32) NOT NULL DEFAULT 'FLYWAY',
    create_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW (),
    update_user_id VARCHAR(32),
    update_utc_timestamp TIMESTAMP
  );

COMMENT ON TABLE shared.legal_document_source IS 'Defines the origin of a legal document including source URL and last processed timestamp.';

COMMENT ON COLUMN shared.legal_document_source.legal_document_source_guid IS 'Primary key: System generated unique identifier for a legal document source.';

COMMENT ON COLUMN shared.legal_document_source.source_url IS 'The source URL from which the document XML is retrieved.';

COMMENT ON COLUMN shared.legal_document_source.last_processed_utc_timestamp IS 'Timestamp of when this source was last processed (UTC, no offset).';

COMMENT ON COLUMN shared.legal_document_source.create_user_id IS 'The id of the user that created the record.';

COMMENT ON COLUMN shared.legal_document_source.create_utc_timestamp IS 'Timestamp when the record was created (UTC, no offset).';

COMMENT ON COLUMN shared.legal_document_source.update_user_id IS 'The id of the user that updated the record.';

COMMENT ON COLUMN shared.legal_document_source.update_utc_timestamp IS 'Timestamp when the record was updated (UTC, no offset).';

CREATE UNIQUE INDEX uq_legaldoc_source_url ON shared.legal_document_source (source_url);

CREATE TRIGGER legaldocsrc_set_default_audit_values BEFORE
update on shared.legal_document_source FOR EACH ROW EXECUTE FUNCTION shared.update_audit_columns ();

-- Top-level document record storing raw XML and minimal metadata
CREATE TABLE
  shared.legal_document (
    legal_document_guid UUID NOT NULL DEFAULT uuid_generate_v4 () PRIMARY KEY,
    legal_document_source_guid UUID NOT NULL,
    document_type VARCHAR(16) NOT NULL, -- ACT | REGULATION | BYLAW
    external_identifier VARCHAR(256), -- e.g., bclaws document identifier or citation
    title TEXT,
    xml_content TEXT NOT NULL,
    create_user_id VARCHAR(32) NOT NULL DEFAULT 'FLYWAY',
    create_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW (),
    update_user_id VARCHAR(32),
    update_utc_timestamp TIMESTAMP,
    CONSTRAINT fk_legaldoc_source FOREIGN KEY (legal_document_source_guid) REFERENCES shared.legal_document_source (legal_document_source_guid)
  );

COMMENT ON TABLE shared.legal_document IS 'Stores source XML and minimal metadata for Acts, Regulations, and Bylaws.';

COMMENT ON COLUMN shared.legal_document.legal_document_guid IS 'Primary key: System generated unique identifier for a legal document.';

COMMENT ON COLUMN shared.legal_document.legal_document_source_guid IS 'Foreign key to shared.legal_document_source indicating the origin of this document.';

COMMENT ON COLUMN shared.legal_document.document_type IS 'Type of document: ACT, REGULATION, or BYLAW.';

COMMENT ON COLUMN shared.legal_document.external_identifier IS 'External identifier such as BCLaws citation or document key.';

COMMENT ON COLUMN shared.legal_document.title IS 'Optional title from the XML metadata.';

COMMENT ON COLUMN shared.legal_document.xml_content IS 'Full source XML content of the legal document stored as text for ORM compatibility.';

COMMENT ON COLUMN shared.legal_document.create_user_id IS 'The id of the user that created the record.';

COMMENT ON COLUMN shared.legal_document.create_utc_timestamp IS 'Timestamp when the record was created (UTC, no offset).';

COMMENT ON COLUMN shared.legal_document.update_user_id IS 'The id of the user that updated the record.';

COMMENT ON COLUMN shared.legal_document.update_utc_timestamp IS 'Timestamp when the record was updated (UTC, no offset).';

CREATE INDEX idx_legal_document_type ON shared.legal_document (document_type);

CREATE INDEX idx_legal_document_source ON shared.legal_document (legal_document_source_guid);

CREATE UNIQUE INDEX uq_legal_document_extid ON shared.legal_document (external_identifier)
WHERE
  external_identifier IS NOT NULL;

-- Hierarchical nodes extracted from XML for precise referencing
CREATE TABLE
  shared.legal_document_node (
    legal_document_node_guid UUID NOT NULL DEFAULT uuid_generate_v4 () PRIMARY KEY,
    legal_document_guid UUID NOT NULL,
    parent_node_guid UUID NULL,
    element_name VARCHAR(64) NOT NULL, -- e.g., part, division, section, subsection, paragraph
    element_id VARCHAR(256), -- XML @id attribute for direct reference (when present)
    element_number VARCHAR(64), -- number/label attribute/text (e.g., 1, 1.1, (a)) when applicable
    element_text TEXT, -- concatenated text content of this node (optional)
    attributes JSONB, -- other attributes preserved generically
    sort_order INT NOT NULL, -- preserves document order among siblings
    create_user_id VARCHAR(32) NOT NULL DEFAULT 'FLYWAY',
    create_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW (),
    update_user_id VARCHAR(32),
    update_utc_timestamp TIMESTAMP,
    CONSTRAINT fk_ldn_document FOREIGN KEY (legal_document_guid) REFERENCES shared.legal_document (legal_document_guid) ON DELETE CASCADE,
    CONSTRAINT fk_ldn_parent FOREIGN KEY (parent_node_guid) REFERENCES shared.legal_document_node (legal_document_node_guid) ON DELETE CASCADE
  );

COMMENT ON TABLE shared.legal_document_node IS 'Generic hierarchical nodes parsed from legal document XML to enable section-level referencing.';

COMMENT ON COLUMN shared.legal_document_node.legal_document_node_guid IS 'Primary key: System generated unique identifier for a node.';

COMMENT ON COLUMN shared.legal_document_node.legal_document_guid IS 'Foreign key to shared.legal_document.';

COMMENT ON COLUMN shared.legal_document_node.parent_node_guid IS 'Self-referencing parent to reconstruct hierarchy.';

COMMENT ON COLUMN shared.legal_document_node.element_name IS 'XML element local-name (e.g., section, subsection, para).';

COMMENT ON COLUMN shared.legal_document_node.element_id IS 'XML id attribute value (if present) retained for direct linking.';

COMMENT ON COLUMN shared.legal_document_node.element_number IS 'Human-readable number/label extracted from element attributes or text.';

COMMENT ON COLUMN shared.legal_document_node.element_text IS 'Optional text content flattened for quick search; full fidelity remains in xml_content.';

COMMENT ON COLUMN shared.legal_document_node.attributes IS 'All other element attributes serialized as JSON.';

COMMENT ON COLUMN shared.legal_document_node.sort_order IS 'Sibling order starting at 1 to preserve original document order.';

CREATE INDEX idx_ldn_document ON shared.legal_document_node (legal_document_guid);

CREATE INDEX idx_ldn_parent ON shared.legal_document_node (parent_node_guid);

CREATE INDEX idx_ldn_element_name ON shared.legal_document_node (element_name);

CREATE INDEX idx_ldn_element_id ON shared.legal_document_node (element_id);

CREATE INDEX idx_ldn_sort ON shared.legal_document_node (legal_document_guid, parent_node_guid, sort_order);

-- Optional: triggers to maintain audit timestamps
CREATE TRIGGER legaldoc_set_default_audit_values BEFORE
update on shared.legal_document FOR EACH ROW EXECUTE FUNCTION shared.update_audit_columns ();

CREATE TRIGGER legaldocnode_set_default_audit_values BEFORE
update on shared.legal_document_node FOR EACH ROW EXECUTE FUNCTION shared.update_audit_columns ();