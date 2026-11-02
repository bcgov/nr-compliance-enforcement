---------------------------------
-- Inserts code table values into the AGENCY_CODE table
-- or if the Code already exists, updates the data
---------------------------------
INSERT INTO shared.agency_code (
    agency_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp
) VALUES
    ('PARKS', 'BC Parks', 'BC Parks', 10, TRUE, 'FLYWAY', NOW()),
    ('COS', 'COS', 'Conservation Officer Service', 20, TRUE, 'FLYWAY', NOW()),
    ('EPO', 'CEEB', 'Compliance and Environmental Enforcement Branch', 30, TRUE, 'FLYWAY', NOW()),
    ('ECCC', 'Environment and Climate Change Canada', 'Environment and Climate Change Canada', 40, TRUE, 'FLYWAY', NOW()),
    ('DFO', 'Fisheries and Oceans Canada', 'Fisheries and Oceans Canada', 50, TRUE, 'FLYWAY', NOW()),
    ('NROS', 'NROS', 'Natural Resource Officer Service', 60, TRUE, 'FLYWAY', NOW()),
    ('MINES', 'Mines', 'Mines Health, Safety & Enforcement', 65, TRUE, 'FLYWAY', NOW()),
    ('FCBC', 'Front Counter BC', 'Front Counter BC', 66, TRUE, 'FLYWAY', NOW()),
    ('WEB', 'Wildlife and Ecosystem Branch', 'Wildlife and Ecosystem Branch', 67, TRUE, 'FLYWAY', NOW()),
    ('BCCEA', 'BC CEA', 'BC Compliance and Enforcement Agency', 68, TRUE, 'FLYWAY', NOW()),
    ('NRS', 'Natural Resource Sector', 'Natural Resource Sector', 70, TRUE, 'FLYWAY', NOW()),
    ('POL', 'Police', 'Police', 90, TRUE, 'FLYWAY', NOW()),
    ('OTH', 'Other', 'Other', 100, TRUE, 'FLYWAY', NOW())
ON CONFLICT (agency_code) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    display_order = EXCLUDED.display_order,
    active_ind = EXCLUDED.active_ind,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW();

UPDATE shared.agency_code
SET short_description = 'NROS'
WHERE agency_code = 'NROS';
