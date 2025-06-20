-- Create PARK table
CREATE TABLE shared.park (
    park_guid UUID NOT NULL DEFAULT uuid_generate_v4 () PRIMARY KEY,
    external_id VARCHAR(10) NOT NULL,
    name VARCHAR(256) NOT NULL,
    legal_name VARCHAR(256),
    geo_organization_unit_code VARCHAR(10),
    create_user_id VARCHAR(32) NOT NULL,
    create_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    update_user_id VARCHAR(32),
    update_utc_timestamp TIMESTAMP
);

ALTER TABLE shared.park
    ADD CONSTRAINT "UK_park__external_id" UNIQUE (external_id);

-- Table comments for PARK
COMMENT ON TABLE shared.park IS 'Stores a set of BC Parks, Conservatories, and Protected Areas. Data is imported from the data.bcparks.ca API.';

-- Column comments for PARK
COMMENT ON COLUMN shared.park.park_guid IS 'Primary key: System generated unique identifier for a park.';
COMMENT ON COLUMN shared.park.external_id IS 'External identifier for the park, this references the data.bcparks.ca API.';
COMMENT ON COLUMN shared.park.name IS 'Name of the park.';
COMMENT ON COLUMN shared.park.legal_name IS 'Legal name of the park.';
COMMENT ON COLUMN shared.park.geo_organization_unit_code IS 'Geographic organization unit code for the park.';
COMMENT ON COLUMN shared.park.create_user_id IS 'The id of the user that created the park.';
COMMENT ON COLUMN shared.park.create_utc_timestamp IS 'The timestamp when the park was created. The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN shared.park.update_user_id IS 'The id of the user that updated the park.';
COMMENT ON COLUMN shared.park.update_utc_timestamp IS 'The timestamp when the park was updated. The timestamp is stored in UTC with no offset.';
