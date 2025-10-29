-- Only execute if shared schema exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'shared') THEN
    RETURN;
  END IF;
END $$;

ALTER TABLE shared.app_user DISABLE TRIGGER app_user_history_trigger;

ALTER TABLE shared.office DISABLE TRIGGER office_history_trigger;

ALTER TABLE shared.team DISABLE TRIGGER team_history_trigger;

ALTER TABLE shared.app_user_team_xref DISABLE TRIGGER app_user_team_xref_history_trigger;

ALTER TABLE shared.geo_org_unit_structure DISABLE TRIGGER geo_org_unit_structure_history_trigger;

ALTER TABLE shared.geo_org_unit_structure DISABLE TRIGGER geo_org_unit_structure_mvw_refresh_trigger;

ALTER TABLE shared.geo_organization_unit_code DISABLE TRIGGER geo_organization_unit_code_mvw_refresh_trigger;

-- ============================================================================
-- CODE TABLES 
-- ============================================================================
INSERT INTO
    shared.geo_org_unit_type_code (
        geo_org_unit_type_code,
        short_description,
        long_description,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp
    )
SELECT
    geo_org_unit_type_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
FROM
    geo_org_unit_type_code ON CONFLICT DO NOTHING;

INSERT INTO
    shared.team_code (
        team_code,
        short_description,
        long_description,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp
    )
SELECT
    team_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
FROM
    team_code ON CONFLICT DO NOTHING;

INSERT INTO
    shared.geo_organization_unit_code (
        geo_organization_unit_code,
        short_description,
        long_description,
        effective_date,
        expiry_date,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp,
        geo_org_unit_type_code,
        administrative_office_ind
    )
SELECT
    geo_organization_unit_code,
    short_description,
    long_description,
    effective_date,
    expiry_date,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_org_unit_type_code,
    administrative_office_ind
FROM
    geo_organization_unit_code ON CONFLICT DO NOTHING;

INSERT INTO
    shared.geo_org_unit_structure (
        geo_org_unit_structure_guid,
        effective_date,
        expiry_date,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp,
        agency_code_ref,
        parent_geo_org_unit_code,
        child_geo_org_unit_code
    )
SELECT
    geo_org_unit_structure_guid,
    effective_date,
    expiry_date,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    agency_code_ref,
    parent_geo_org_unit_code,
    child_geo_org_unit_code
FROM
    geo_org_unit_structure ON CONFLICT DO NOTHING;

INSERT INTO
    shared.geo_org_unit_structure_h (
        h_gorgustrct_guid,
        target_row_id,
        operation_type,
        operation_user_id,
        operation_executed_at,
        data_after_executed_operation
    )
SELECT
    h_gorgustrct_guid,
    target_row_id,
    operation_type,
    operation_user_id,
    operation_executed_at,
    data_after_executed_operation
FROM
    geo_org_unit_structure_h ON CONFLICT DO NOTHING;

-- ============================================================================
-- OFFICE
-- ============================================================================
INSERT INTO
    shared.office (
        office_guid,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp,
        geo_organization_unit_code,
        agency_code_ref
    )
SELECT
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code_ref
FROM
    office ON CONFLICT DO NOTHING;

INSERT INTO
    shared.office_h (
        h_office_guid,
        target_row_id,
        operation_type,
        operation_user_id,
        operation_executed_at,
        data_after_executed_operation
    )
SELECT
    h_office_guid,
    target_row_id,
    operation_type,
    operation_user_id,
    operation_executed_at,
    data_after_executed_operation
FROM
    office_h ON CONFLICT DO NOTHING;

-- ============================================================================
-- TEAM
-- ============================================================================
INSERT INTO
    shared.team (
        team_guid,
        team_code,
        agency_code_ref,
        active_ind,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp
    )
SELECT
    team_guid,
    team_code,
    agency_code_ref,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
FROM
    team ON CONFLICT DO NOTHING;

INSERT INTO
    shared.team_h (
        h_team_guid,
        target_row_id,
        operation_type,
        operation_user_id,
        operation_executed_at,
        data_after_executed_operation
    )
SELECT
    h_team_guid,
    target_row_id,
    operation_type,
    operation_user_id,
    operation_executed_at,
    data_after_executed_operation
FROM
    team_h ON CONFLICT DO NOTHING;

-- ============================================================================
-- APP_USER
-- ============================================================================
INSERT INTO
    shared.app_user (
        app_user_guid,
        auth_user_guid,
        user_id,
        first_name,
        last_name,
        coms_enrolled_ind,
        deactivate_ind,
        agency_code_ref,
        office_guid,
        park_area_guid,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp
    )
SELECT
    app_user_guid,
    auth_user_guid,
    user_id,
    first_name,
    last_name,
    coms_enrolled_ind,
    deactivate_ind,
    agency_code_ref,
    office_guid,
    park_area_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
FROM
    app_user ON CONFLICT DO NOTHING;

INSERT INTO
    shared.app_user_h (
        h_app_user_guid,
        target_row_id,
        operation_type,
        operation_user_id,
        operation_executed_at,
        data_after_executed_operation
    )
SELECT
    h_app_user_guid,
    target_row_id,
    operation_type,
    operation_user_id,
    operation_executed_at,
    data_after_executed_operation
FROM
    app_user_h ON CONFLICT DO NOTHING;

-- ============================================================================
-- APP_USER_TEAM_XREF
-- ============================================================================
INSERT INTO
    shared.app_user_team_xref (
        app_user_team_xref_guid,
        app_user_guid,
        team_guid,
        active_ind,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp
    )
SELECT
    app_user_team_xref_guid,
    app_user_guid_ref,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
FROM
    app_user_team_xref ON CONFLICT DO NOTHING;

INSERT INTO
    shared.app_user_team_xref_h (
        h_app_user_team_xref_guid,
        target_row_id,
        operation_type,
        operation_user_id,
        operation_executed_at,
        data_after_executed_operation
    )
SELECT
    h_app_user_team_xref_guid,
    target_row_id,
    operation_type,
    operation_user_id,
    operation_executed_at,
    data_after_executed_operation
FROM
    app_user_team_xref_h ON CONFLICT DO NOTHING;

ALTER TABLE shared.app_user ENABLE TRIGGER app_user_history_trigger;

ALTER TABLE shared.office ENABLE TRIGGER office_history_trigger;

ALTER TABLE shared.team ENABLE TRIGGER team_history_trigger;

ALTER TABLE shared.app_user_team_xref ENABLE TRIGGER app_user_team_xref_history_trigger;

ALTER TABLE shared.geo_org_unit_structure ENABLE TRIGGER geo_org_unit_structure_history_trigger;

ALTER TABLE shared.geo_org_unit_structure ENABLE TRIGGER geo_org_unit_structure_mvw_refresh_trigger;

ALTER TABLE shared.geo_organization_unit_code ENABLE TRIGGER geo_organization_unit_code_mvw_refresh_trigger;
