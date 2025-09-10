---------------------------------
-- Inserts code table values into the AGENCY_CODE table
-- or if the Code already exists, updates the data
---------------------------------
INSERT INTO shared.agency_code (
    agency_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, external_agency_ind
) VALUES
    ('PARKS', 'BC Parks', 'BC Parks', 10, TRUE, 'FLYWAY', NOW(), false),
    ('COS', 'COS', 'Conservation Officer Service', 20, TRUE, 'FLYWAY', NOW(), false),
    ('EPO', 'CEEB', 'Compliance and Environmental Enforcement Branch', 30, TRUE, 'FLYWAY', NOW(), false),
    ('ECCC', 'Environment and Climate Change Canada', 'Environment and Climate Change Canada', 40, TRUE, 'FLYWAY', NOW(), true),
    ('DFO', 'Fisheries and Oceans Canada', 'Fisheries and Oceans Canada', 50, TRUE, 'FLYWAY', NOW(), true),
    ('NROS', 'Natural Resource Officer Service', 'Natural Resource Officer Service', 60, TRUE, 'FLYWAY', NOW(), true),
    ('NRS', 'Natural Resource Sector', 'Natural Resource Sector', 70, TRUE, 'FLYWAY', NOW(), false),
    ('OTH', 'Other', 'Other', 80, TRUE, 'FLYWAY', NOW(), true),
    ('POL', 'Police', 'Police', 90, TRUE, 'FLYWAY', NOW(), true)
ON CONFLICT (agency_code) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    display_order = EXCLUDED.display_order,
    active_ind = EXCLUDED.active_ind,
    external_agency_ind = EXCLUDED.external_agency_ind,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW();
