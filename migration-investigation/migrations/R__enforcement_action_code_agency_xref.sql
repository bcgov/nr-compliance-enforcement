---------------------------------
-- Inserts values into enforcement_action_code_agency_xref
-- or if the entry already exists, updates the data
---------------------------------
INSERT INTO
    investigation.enforcement_action_code_agency_xref (
        enforcement_action_code,
        agency_code_ref,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
VALUES
    ('UNFD', 'COS', TRUE, 'FLYWAY', NOW ()),
    ('UNFD', 'EPO', TRUE, 'FLYWAY', NOW ()),
    ('UNFD', 'PARKS', TRUE, 'FLYWAY', NOW ()),
    ('UNFD', 'NROS', TRUE, 'FLYWAY', NOW ()),
    ('UNRS', 'COS', TRUE, 'FLYWAY', NOW ()),
    ('UNRS', 'EPO', TRUE, 'FLYWAY', NOW ()),
    ('UNRS', 'PARKS', TRUE, 'FLYWAY', NOW ()),
    ('UNRS', 'NROS', TRUE, 'FLYWAY', NOW ()),
    ('ADPN', 'COS', TRUE, 'FLYWAY', NOW ()),
    ('ADPN', 'EPO', TRUE, 'FLYWAY', NOW ()),
    ('ADPN', 'PARKS', TRUE, 'FLYWAY', NOW ()),
    ('ADPN', 'NROS', TRUE, 'FLYWAY', NOW ()),
    ('ADSN', 'COS', TRUE, 'FLYWAY', NOW ()),
    ('ADSN', 'EPO', TRUE, 'FLYWAY', NOW ()),
    ('ADSN', 'PARKS', TRUE, 'FLYWAY', NOW ()),
    ('ADSN', 'NROS', TRUE, 'FLYWAY', NOW ()),
    ('CTPR', 'COS', TRUE, 'FLYWAY', NOW ()),
    ('CTPR', 'EPO', TRUE, 'FLYWAY', NOW ()),
    ('CTPR', 'PARKS', TRUE, 'FLYWAY', NOW ()),
    ('CTPR', 'NROS', TRUE, 'FLYWAY', NOW ()),
    ('ORDR', 'COS', TRUE, 'FLYWAY', NOW ()),
    ('ORDR', 'EPO', TRUE, 'FLYWAY', NOW ()),
    ('ORDR', 'PARKS', TRUE, 'FLYWAY', NOW ()),
    ('ORDR', 'NROS', TRUE, 'FLYWAY', NOW ()),
    ('RJUS', 'COS', TRUE, 'FLYWAY', NOW ()),
    ('RJUS', 'EPO', TRUE, 'FLYWAY', NOW ()),
    ('RJUS', 'PARKS', TRUE, 'FLYWAY', NOW ()),
    ('RJUS', 'NROS', TRUE, 'FLYWAY', NOW ()),
    ('FDVT', 'COS', TRUE, 'FLYWAY', NOW ()),
    ('FDVT', 'EPO', TRUE, 'FLYWAY', NOW ()),
    ('FDVT', 'PARKS', TRUE, 'FLYWAY', NOW ()),
    ('FDVT', 'NROS', TRUE, 'FLYWAY', NOW ()),
    ('WARN', 'COS', TRUE, 'FLYWAY', NOW ()),
    ('WARN', 'EPO', TRUE, 'FLYWAY', NOW ()),
    ('WARN', 'PARKS', TRUE, 'FLYWAY', NOW ()),
    ('WARN', 'NROS', TRUE, 'FLYWAY', NOW ()) ON CONFLICT (enforcement_action_code, agency_code_ref) DO
UPDATE
SET
    active_ind = EXCLUDED.active_ind,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW ();