INSERT INTO shared.case_file (
    case_file_guid,
    owned_by_agency,
    case_status,
    case_opened_utc_timestamp,
    create_user_id,
    create_utc_timestamp
)
SELECT
    cf.case_file_guid,
    cf.owned_by_agency_code,
    'OPEN',
    cf.create_utc_timestamp,
    'FLYWAY',
    now()
FROM
    case_management.case_file cf;

INSERT INTO shared.case_activity (
    case_file_guid,
    case_activity_type,
    case_activity_identifier_ref,
    effective_utc_timestamp,
    create_user_id,
    create_utc_timestamp
)
SELECT
    l.case_identifier,
    'COMP',
    l.lead_identifier,
    l.create_utc_timestamp,
    'FLYWAY',
    now()
FROM
    case_management.lead l;