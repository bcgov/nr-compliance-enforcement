---------------------------------
-- Inserts values into enforcement_action_code_agency_xref
-- or if the entry already exists, updates the data
---------------------------------
INSERT INTO investigation.enforcement_action_code_agency_xref (
    enforcement_action_code, agency_code_ref, active_ind, create_user_id, create_utc_timestamp
) VALUES
    ('FDVT',  'COS',   TRUE, 'FLYWAY', NOW()),
    ('FDVT',  'EPO',   TRUE, 'FLYWAY', NOW()),
    ('FDVT',  'PARKS', TRUE, 'FLYWAY', NOW()),
    ('FDVT',  'NROS',  TRUE, 'FLYWAY', NOW()),
    ('LIAC',     'COS',   TRUE, 'FLYWAY', NOW()),
    ('LIAC',     'EPO',   TRUE, 'FLYWAY', NOW()),
    ('LIAC',     'PARKS', TRUE, 'FLYWAY', NOW()),
    ('LIAC',     'NROS',  TRUE, 'FLYWAY', NOW()),
    ('NOAC',      'COS',   TRUE, 'FLYWAY', NOW()),
    ('NOAC',      'EPO',   TRUE, 'FLYWAY', NOW()),
    ('NOAC',      'PARKS', TRUE, 'FLYWAY', NOW()),
    ('NOAC',      'NROS',  TRUE, 'FLYWAY', NOW()),
    ('PRVT',  'COS',   TRUE, 'FLYWAY', NOW()),
    ('PRVT',  'EPO',   TRUE, 'FLYWAY', NOW()),
    ('PRVT',  'PARKS', TRUE, 'FLYWAY', NOW()),
    ('PRVT',  'NROS',  TRUE, 'FLYWAY', NOW()),
    ('WARN',       'COS',   TRUE, 'FLYWAY', NOW()),
    ('WARN',       'EPO',   TRUE, 'FLYWAY', NOW()),
    ('WARN',       'PARKS', TRUE, 'FLYWAY', NOW()),
    ('WARN',       'NROS',  TRUE, 'FLYWAY', NOW())
ON CONFLICT (enforcement_action_code, agency_code_ref) DO UPDATE SET
    active_ind          = EXCLUDED.active_ind,
    update_user_id      = 'FLYWAY',
    update_utc_timestamp = NOW();