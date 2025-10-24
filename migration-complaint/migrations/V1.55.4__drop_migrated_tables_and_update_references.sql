-- Migration V1.56.1: Drop migrated tables and update references to shared schema
-- This script updates FK constraints to point to shared schema and removes old tables from complaint schema
-- Run this AFTER V1.56.0 (data migration to shared)

-- ============================================================================
-- DROP OLD MATERIALIZED VIEW AND RELATED OBJECTS
-- ============================================================================

-- Drop triggers that refresh the old MVW
DROP TRIGGER IF EXISTS geo_org_unit_structure_insert_update_refresh_mvw ON complaint.geo_org_unit_structure;
DROP TRIGGER IF EXISTS geo_organization_unit_code_insert_update_refresh_mvw ON complaint.geo_organization_unit_code;

-- Drop the old materialized view refresh function
DROP FUNCTION IF EXISTS complaint.cos_geo_org_unit_flat_mvw_refresh();

-- Drop the old materialized view
DROP MATERIALIZED VIEW IF EXISTS complaint.cos_geo_org_unit_flat_mvw CASCADE;

-- ============================================================================
-- DROP EXISTING FOREIGN KEY CONSTRAINTS
-- ============================================================================

-- Drop FK constraints that reference tables being migrated
ALTER TABLE complaint.complaint 
    DROP CONSTRAINT IF EXISTS "FK_complaint_geoorgutnd";

ALTER TABLE complaint.email_reference 
    DROP CONSTRAINT IF EXISTS "FK_emailref__geo_org_unit_code";

-- Drop any existing FK constraints on the _ref columns
ALTER TABLE complaint.complaint_referral 
    DROP CONSTRAINT IF EXISTS "FK_complaint_referral_user";

ALTER TABLE complaint.linked_complaint_xref 
    DROP CONSTRAINT IF EXISTS "FK_link_complaint_xref_user";

ALTER TABLE complaint.person_complaint_xref 
    DROP CONSTRAINT IF EXISTS "FK_person_complaint_xref_user";

-- ============================================================================
-- UPDATE FOREIGN KEY CONSTRAINTS TO POINT TO SHARED SCHEMA
-- ============================================================================

-- Re-add FK constraints pointing to shared schema tables
ALTER TABLE complaint.complaint 
    ADD CONSTRAINT "FK_complaint_geoorgutnd" 
    FOREIGN KEY (geo_organization_unit_code) 
    REFERENCES shared.geo_organization_unit_code(geo_organization_unit_code);

ALTER TABLE complaint.email_reference 
    ADD CONSTRAINT "FK_emailref__geo_org_unit_code" 
    FOREIGN KEY (geo_organization_unit_code) 
    REFERENCES shared.geo_organization_unit_code(geo_organization_unit_code);

-- Update app_user references to point to shared schema
ALTER TABLE complaint.complaint_referral 
    ADD CONSTRAINT "FK_complaint_referral_app_user" 
    FOREIGN KEY (app_user_guid_ref) 
    REFERENCES shared.app_user(app_user_guid);

ALTER TABLE complaint.linked_complaint_xref 
    ADD CONSTRAINT "FK_linked_complaint_xref_app_user" 
    FOREIGN KEY (app_user_guid_ref) 
    REFERENCES shared.app_user(app_user_guid);

ALTER TABLE complaint.person_complaint_xref 
    ADD CONSTRAINT "FK_person_complaint_xref_app_user" 
    FOREIGN KEY (app_user_guid_ref) 
    REFERENCES shared.app_user(app_user_guid);

-- ============================================================================
-- DROP TRIGGERS FROM TABLES BEING REMOVED
-- ============================================================================

DROP TRIGGER IF EXISTS geoorgutnd_set_default_audit_values ON complaint.geo_organization_unit_code;
DROP TRIGGER IF EXISTS gorgtypecd_set_default_audit_values ON complaint.geo_org_unit_type_code;
DROP TRIGGER IF EXISTS gorgustrct_history_trigger ON complaint.geo_org_unit_structure;
DROP TRIGGER IF EXISTS office_history_trigger ON complaint.office;
DROP TRIGGER IF EXISTS team_history_trigger ON complaint.team;
DROP TRIGGER IF EXISTS team_set_default_audit_values ON complaint.team;
DROP TRIGGER IF EXISTS teamcode_set_default_audit_values ON complaint.team_code;
DROP TRIGGER IF EXISTS app_user_history_trigger ON complaint.app_user;
DROP TRIGGER IF EXISTS app_user_team_xref_history_trigger ON complaint.app_user_team_xref;

-- ============================================================================
-- DROP MIGRATED TABLES FROM COMPLAINT SCHEMA
-- ============================================================================

-- Drop the tables that have been migrated to shared schema
-- Use CASCADE to handle any remaining dependencies
DROP TABLE IF EXISTS complaint.app_user_team_xref_h CASCADE;
DROP TABLE IF EXISTS complaint.app_user_team_xref CASCADE;
DROP TABLE IF EXISTS complaint.app_user_h CASCADE;
DROP TABLE IF EXISTS complaint.app_user CASCADE;
DROP TABLE IF EXISTS complaint.team_h CASCADE;
DROP TABLE IF EXISTS complaint.team CASCADE;
DROP TABLE IF EXISTS complaint.team_code CASCADE;
DROP TABLE IF EXISTS complaint.office_h CASCADE;
DROP TABLE IF EXISTS complaint.office CASCADE;
DROP TABLE IF EXISTS complaint.geo_org_unit_structure_h CASCADE;
DROP TABLE IF EXISTS complaint.geo_org_unit_structure CASCADE;
DROP TABLE IF EXISTS complaint.geo_organization_unit_code CASCADE;
DROP TABLE IF EXISTS complaint.geo_org_unit_type_code CASCADE;

-- ============================================================================
-- CREATE VIEW TO REFERENCE SHARED SCHEMA MVW
-- ============================================================================

-- Create a view in complaint schema that references the shared schema materialized view
-- This maintains backward compatibility for any code expecting complaint.cos_geo_org_unit_flat_mvw
CREATE OR REPLACE VIEW complaint.cos_geo_org_unit_flat_mvw AS
SELECT * FROM shared.cos_geo_org_unit_flat_mvw;

COMMENT ON VIEW complaint.cos_geo_org_unit_flat_mvw IS 'View referencing the COS geo org unit flat materialized view in the shared schema for backward compatibility.';

-- ============================================================================
-- VALIDATION
-- ============================================================================

-- Verify that tables have been dropped
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'complaint'
    AND table_type = 'BASE TABLE'
    AND table_name IN (
        'app_user', 'app_user_h',
        'app_user_team_xref', 'app_user_team_xref_h',
        'office', 'office_h',
        'team', 'team_h', 'team_code',
        'geo_org_unit_structure', 'geo_org_unit_structure_h',
        'geo_organization_unit_code', 'geo_org_unit_type_code'
    );
    
    IF table_count > 0 THEN
        RAISE EXCEPTION 'Migration failed: % tables were not dropped from complaint schema', table_count;
    END IF;
    
    RAISE NOTICE 'All migrated tables successfully removed from complaint schema';
END $$;

-- Verify that foreign keys are correctly pointing to shared schema
DO $$
DECLARE
    fk_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO fk_count
    FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu 
        ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_schema = 'complaint'
    AND tc.constraint_type = 'FOREIGN KEY'
    AND ccu.table_schema = 'shared'
    AND ccu.table_name IN (
        'app_user', 'geo_organization_unit_code'
    );
    
    IF fk_count < 3 THEN
        RAISE WARNING 'Expected at least 3 foreign keys to shared schema, found %', fk_count;
    ELSE
        RAISE NOTICE 'Foreign key constraints successfully updated to reference shared schema (% constraints)', fk_count;
    END IF;
END $$;

-- Verify the view works
DO $$
DECLARE
    view_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO view_count FROM complaint.cos_geo_org_unit_flat_mvw;
    RAISE NOTICE 'Compatibility view complaint.cos_geo_org_unit_flat_mvw is accessible with % rows', view_count;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Could not verify compatibility view: %', SQLERRM;
END $$;

