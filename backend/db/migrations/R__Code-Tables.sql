insert into
    public.staging_activity_code (
        staging_activity_code,
        short_description,
        long_description,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp
    )
values
    (
        'INSERT',
        'Insert',
        'A Record has been created by the source system',
        1,
        true,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        'FLYWAY',
        CURRENT_TIMESTAMP
    ),
    (
        'UPDATE',
        'Update',
        'A Record has been updated by the source system',
        2,
        true,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        'FLYWAY',
        CURRENT_TIMESTAMP
    ) on conflict do nothing;

insert into
    public.staging_status_code (
        staging_status_code,
        short_description,
        long_description,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp
    )
values
    (
        'PENDING',
        'Pending',
        'Complaint is pending loading from the staging table into the transactional tables.',
        1,
        true,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        'FLYWAY',
        CURRENT_TIMESTAMP
    ),
    (
        'SUCCESS',
        'Success',
        'Complaint has been successfully loaded from the staging table into the transactional tables.',
        2,
        true,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        'FLYWAY',
        CURRENT_TIMESTAMP
    ),
    (
        'ERROR',
        'Error',
        'Complaint was unable to be loaded from the staging table into the transactional tables.',
        3,
        true,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        'FLYWAY',
        CURRENT_TIMESTAMP
    ) on conflict (staging_status_code) do nothing;

insert into
    public.staging_activity_code (
        staging_activity_code,
        short_description,
        long_description,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp
    )
values
    (
        'EDIT',
        'Edit',
        'A Record has been edited by the source system',
        3,
        true,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        'FLYWAY',
        CURRENT_TIMESTAMP
    ),
    (
        'UPDATE',
        'Update',
        'A Record has been updated by the source system',
        2,
        true,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        'FLYWAY',
        CURRENT_TIMESTAMP
    ) on conflict do nothing;

insert into
    public.entity_code (
        entity_code,
        short_description,
        long_description,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp
    )
values
    (
        'violatncd',
        'Violation Code',
        'Violation code table',
        5,
        true,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        'FLYWAY',
        CURRENT_TIMESTAMP
    ),
    (
        'reprtdbycd',
        'reported_by_code',
        'Reported By code table',
        4,
        true,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        'FLYWAY',
        CURRENT_TIMESTAMP
    ),
    (
        'geoorgutcd',
        'geo_organization_unit_code',
        'Geo Organization Unit code table',
        2,
        true,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        'FLYWAY',
        CURRENT_TIMESTAMP
    ),
    (
        'speciescd',
        'species_code',
        'Species code table',
        5,
        true,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        'FLYWAY',
        CURRENT_TIMESTAMP
    ),
    (
        'cmpltntrcd',
        'hwcr_complaint_nature_code',
        'HWCR Complaint Nature code table',
        3,
        true,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        'FLYWAY',
        CURRENT_TIMESTAMP
    ),
    (
        'atractntcd',
        'attractant_code',
        'Attractant code table',
        1,
        true,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        'FLYWAY',
        CURRENT_TIMESTAMP
    ) on conflict do nothing;

update geo_organization_unit_code
set
    short_description = 'Daajing Giids (Queen Charlotte City)',
    long_description = 'Daajing Giids (Queen Charlotte City)'
where
    geo_organization_unit_code = 'QUEENCHA';

insert into
    complaint_status_code (
        complaint_status_code,
        short_description,
        long_description,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp,
        manually_assignable_ind
    )
values
    (
        'PENDREV',
        'Pending Review',
        'Pending Review',
        2,
        true,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        false
    ) on conflict do nothing;

update complaint_status_code
set
    display_order = 3,
    short_description = 'Closed'
where
    complaint_status_code = 'CLOSED';

update complaint_status_code
set
    short_description = 'Open'
where
    complaint_status_code = 'OPEN';

UPDATE configuration
            SET    configuration_value = configuration_value::int + 1
            WHERE  configuration_code = 'CDTABLEVER';