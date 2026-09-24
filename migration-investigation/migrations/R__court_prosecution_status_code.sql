INSERT INTO
    investigation.court_prosecution_status_code (
        court_prosecution_status_code,
        short_description,
        long_description,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
VALUES
    (
        'ABSD',
        'Absolute discharge',
        'Absolute discharge',
        10,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'ACQT',
        'Acquitted',
        'Acquitted',
        20,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'CNDD',
        'Conditional discharge',
        'Conditional discharge',
        30,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'FTA',
        'Fail to appear',
        'Fail to appear',
        40,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'GBEX',
        'Guilty by expiry',
        'Guilty by expiry',
        50,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'GBJU',
        'Guilty by judgement',
        'Guilty by judgement',
        60,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'GBPA',
        'Guilty by payment',
        'Guilty by payment',
        70,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'GBPL',
        'Guilty by plea',
        'Guilty by plea',
        80,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'INPR',
        'In progress',
        'In progress',
        85,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'NOTG',
        'Not guilty',
        'Not guilty',
        90,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'RETR',
        'Retrial',
        'Retrial',
        100,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'STAY',
        'Stay of proceedings',
        'Stay of proceedings',
        110,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'UAPL',
        'Under appeal',
        'Under appeal',
        120,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'WRNT',
        'Warrant',
        'Warrant',
        130,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'WTHD',
        'Withdrawn',
        'Withdrawn',
        140,
        true,
        'FLYWAY',
        now ()
    ) 
    ON CONFLICT (court_prosecution_status_code) DO UPDATE SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    display_order = EXCLUDED.display_order,
    active_ind = EXCLUDED.active_ind,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW();