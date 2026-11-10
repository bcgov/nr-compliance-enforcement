ALTER TABLE shared.app_user_activity_xref DISABLE TRIGGER app_user_activity_xref_history_trigger;

-- Role columns had no FK, so skip any guid with no shared.app_user row rather than abort the release
INSERT INTO
    shared.app_user_activity_xref (
        activity_type,
        activity_identifier_ref,
        app_user_guid,
        app_user_activity_xref_code,
        active_ind,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp
    )
SELECT
    'INVSTGTN',
    investigation_guid::text,
    primary_investigator_guid_ref,
    'ASSIGNEE',
    true,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
FROM
    investigation.investigation
WHERE
    primary_investigator_guid_ref IN (SELECT app_user_guid FROM shared.app_user) ON CONFLICT DO NOTHING;

INSERT INTO
    shared.app_user_activity_xref (
        activity_type,
        activity_identifier_ref,
        app_user_guid,
        app_user_activity_xref_code,
        active_ind,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp
    )
SELECT
    'INVSTGTN',
    investigation_guid::text,
    supervisor_guid_ref,
    'SUPERVISOR',
    true,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
FROM
    investigation.investigation
WHERE
    supervisor_guid_ref IN (SELECT app_user_guid FROM shared.app_user) ON CONFLICT DO NOTHING;

INSERT INTO
    shared.app_user_activity_xref (
        activity_type,
        activity_identifier_ref,
        app_user_guid,
        app_user_activity_xref_code,
        active_ind,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp
    )
SELECT
    'INVSTGTN',
    investigation_guid::text,
    file_coordinator_guid_ref,
    'FILECOORD',
    true,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
FROM
    investigation.investigation
WHERE
    file_coordinator_guid_ref IN (SELECT app_user_guid FROM shared.app_user) ON CONFLICT DO NOTHING;

ALTER TABLE shared.app_user_activity_xref ENABLE TRIGGER app_user_activity_xref_history_trigger;
