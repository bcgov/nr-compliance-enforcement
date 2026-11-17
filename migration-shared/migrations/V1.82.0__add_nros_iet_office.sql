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
VALUES
    (
        'IET',
        'IET',
        'IET',
        NOW (),
        NULL,
        'FLYWAY',
        NOW (),
        'FLYWAY',
        NOW (),
        'OFFLOC',
        false
    ) ON CONFLICT DO NOTHING;

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
    gen_random_uuid (),
    'FLYWAY',
    NOW (),
    'FLYWAY',
    NOW (),
    'IET',
    'NROS'
WHERE
    NOT EXISTS (
        SELECT
            1
        FROM
            shared.office
        WHERE
            geo_organization_unit_code = 'IET'
            AND agency_code_ref = 'NROS'
    );

UPDATE shared.geo_org_unit_structure
SET
    update_utc_timestamp = CURRENT_TIMESTAMP,
    parent_geo_org_unit_code = 'CHTWD'
WHERE
    child_geo_org_unit_code = 'HUDSONSH';

UPDATE shared.geo_org_unit_structure
SET
    update_utc_timestamp = CURRENT_TIMESTAMP,
    parent_geo_org_unit_code = 'CHTWD'
WHERE
    child_geo_org_unit_code = 'BRYLPRR';