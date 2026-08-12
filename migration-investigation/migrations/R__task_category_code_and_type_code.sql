---------------------------------
-- CE-2337 Remove task sub-categories and rebuild the task category list
-- Upsert new formalized task category types into code tables
---------------------------------
INSERT INTO
    investigation.task_category_type_code (
        task_category_type_code,
        short_description,
        long_description,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
VALUES
    (
        'ADMIN',
        'Admin',
        'Admin',
        10,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'ANALYSIS',
        'Analysis',
        'Analysis',
        20,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'ARREST',
        'Arrest',
        'Arrest',
        30,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'CANVASS',
        'Canvass',
        'Canvass',
        40,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'COURTDOCUMENTS',
        'Court documents',
        'Court documents',
        50,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'EXHIBITS',
        'Exhibits',
        'Exhibits',
        60,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'EXPERT',
        'Expert',
        'Expert',
        70,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'EXTERNAL',
        'External agency',
        'External agency',
        80,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'INTERNAL',
        'Internal agency',
        'Internal agency',
        90,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'JUDICIALAUTH',
        'Judicial authorization',
        'Judicial authorization',
        100,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'NOTESWILLSAYS',
        'Notes and will says',
        'Notes and will says',
        110,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'OPERATIONAL',
        'Operational',
        'Operational',
        120,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'PARTNERAGENCY',
        'Partner agency',
        'Partner agency',
        130,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'PROFILE',
        'Profile',
        'Profile',
        140,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'REGULATORY',
        'Regulatory order',
        'Regulatory order',
        150,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'RELEASETRACK',
        'Release tracking',
        'Release tracking',
        160,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'SCENE',
        'Scene',
        'Scene',
        170,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'SENSITIVE',
        'Sensitive',
        'Sensitive',
        180,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'STMTWARNED',
        'Statement (warned)',
        'Statement (warned)',
        190,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'STMTWITNESS',
        'Statement (witness, victim, person)',
        'Statement (witness, victim, person)',
        200,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'SURVEILLANCE',
        'Surveillance',
        'Surveillance',
        210,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'UNDERCOVEROP',
        'Undercover operation',
        'Undercover operation',
        220,
        TRUE,
        'FLYWAY',
        NOW ()
    ) ON CONFLICT (task_category_type_code) DO
UPDATE
SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    display_order = EXCLUDED.display_order,
    active_ind = EXCLUDED.active_ind,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW ();
