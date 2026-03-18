---------------------------------
-- Inserts code table values into the TASK_TYPE table
-- or if the Code already exists, updates the data
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
        'TEMPTYPE1',
        'Type 1',
        'Type 1',
        10,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPTYPE2',
        'Type 2',
        'Type 2',
        20,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPTYPE3',
        'Type 3',
        'Type 3',
        30,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPTYPE4',
        'Type 4',
        'Type 4',
        40,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPTYPE5',
        'Type 5',
        'Type 5',
        50,
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

---------------------------------
-- Inserts code table values into the TASK_SUB_TYPE table
-- or if the Code already exists, updates the data
---------------------------------
INSERT INTO
    investigation.task_type_code (
        task_type_code,
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
        'TEMPSUBTYPEA',
        'TEMPTYPE1',
        'Type a',
        'Type a',
        10,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPEB',
        'TEMPTYPE1',
        'Type b',
        'Type b',
        20,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPEC',
        'TEMPTYPE1',
        'Type c',
        'Type c',
        30,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPED',
        'TEMPTYPE1',
        'Type d',
        'Type d',
        40,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPEE',
        'TEMPTYPE1',
        'Type e',
        'Type e',
        50,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPEF',
        'TEMPTYPE2',
        'Type f',
        'Type f',
        60,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPEG',
        'TEMPTYPE2',
        'Type g',
        'Type g',
        70,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPEH',
        'TEMPTYPE2',
        'Type h',
        'Type h',
        80,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPEI',
        'TEMPTYPE2',
        'Type i',
        'Type i',
        90,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPEJ',
        'TEMPTYPE2',
        'Type j',
        'Type j',
        100,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPEK',
        'TEMPTYPE3',
        'Type k',
        'Type k',
        110,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPEL',
        'TEMPTYPE3',
        'Type l',
        'Type l',
        120,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPEM',
        'TEMPTYPE3',
        'Type m',
        'Type m',
        130,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPEN',
        'TEMPTYPE3',
        'Type n',
        'Type n',
        140,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPEO',
        'TEMPTYPE3',
        'Type o',
        'Type o',
        150,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPEP',
        'TEMPTYPE4',
        'Type p',
        'Type p',
        160,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPEQ',
        'TEMPTYPE4',
        'Type q',
        'Type q',
        170,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPER',
        'TEMPTYPE4',
        'Type r',
        'Type r',
        180,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPES',
        'TEMPTYPE4',
        'Type s',
        'Type s',
        190,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPET',
        'TEMPTYPE4',
        'Type t',
        'Type t',
        200,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPEU',
        'TEMPTYPE5',
        'Type u',
        'Type u',
        210,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPEV',
        'TEMPTYPE5',
        'Type v',
        'Type v',
        220,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPEW',
        'TEMPTYPE5',
        'Type w',
        'Type w',
        230,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPEX',
        'TEMPTYPE5',
        'Type x',
        'Type x',
        240,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'TEMPSUBTYPEY',
        'TEMPTYPE5',
        'Type y',
        'Type y',
        250,
        TRUE,
        'FLYWAY',
        NOW ()
    ) ON CONFLICT (task_type_code) DO
UPDATE
SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    display_order = EXCLUDED.display_order,
    active_ind = EXCLUDED.active_ind,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW ();

---------------------------------
-- Inserts real values into the TASK_CATEGORY_TYPE_CODE table
-- or if the Code already exists, updates the data
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
        'CANVASS',
        'Canvass',
        'Canvass',
        30,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'COURTDOC',
        'Court document',
        'Court document',
        40,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'EXHIBITS',
        'Exhibits',
        'Exhibits',
        50,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'EXTERNAL',
        'External',
        'External',
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
        'INTERNAL',
        'Internal',
        'Internal',
        80,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'JUDICIALAUTH',
        'Judicial authorization',
        'Judicial authorization',
        90,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'NOTESWILLSAYS',
        'Notes and will says',
        'Notes and will says',
        100,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'OPERATIONAL',
        'Operational',
        'Operational',
        110,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'PROFILE',
        'Profile',
        'Profile',
        120,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'RELEASETRACK',
        'Release tracking',
        'Release tracking',
        130,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'SCENE',
        'Scene',
        'Scene',
        140,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'SENSITIVE',
        'Sensitive',
        'Sensitive',
        150,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'STATEMENT',
        'Statement',
        'Statement',
        160,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'SURVEILLANCE',
        'Surveillance',
        'Surveillance',
        170,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'UNDERCOVEROP',
        'Undercover operation',
        'Undercover operation',
        180,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'WITNESS',
        'Witness',
        'Witness',
        190,
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

---------------------------------
-- Inserts real values into the TASK_TYPE_CODE table
-- or if the Code already exists, updates the data
---------------------------------
INSERT INTO
    investigation.task_type_code (
        task_type_code,
        task_category_type_code,
        short_description,
        long_description,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
VALUES
    -- Admin
    (
        'ADMINBUSRULE',
        'ADMIN',
        'Business rule',
        'Business rule',
        10,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'ADMINEMAIL',
        'ADMIN',
        'Email',
        'Email',
        20,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'ADMINEQUIPMENT',
        'ADMIN',
        'Equipment',
        'Equipment',
        30,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'ADMINEXPENSE',
        'ADMIN',
        'Expense',
        'Expense',
        40,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'ADMINMEDIA',
        'ADMIN',
        'Media',
        'Media',
        50,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'ADMINMCNEIL',
        'ADMIN',
        'McNeil',
        'McNeil',
        60,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'ADMINMOU',
        'ADMIN',
        'Memorandum of Understanding',
        'Memorandum of Understanding',
        70,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'ADMINOPTRAVEL',
        'ADMIN',
        'Operational travel',
        'Operational travel',
        80,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'ADMINOPPROC',
        'ADMIN',
        'Operational procedures',
        'Operational procedures',
        90,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    -- Analysis
    (
        'ANALYSISGIS',
        'ANALYSIS',
        'GIS',
        'GIS',
        100,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'ANALYSISFIN',
        'ANALYSIS',
        'Financial',
        'Financial',
        110,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'ANALYSISFORREV',
        'ANALYSIS',
        'Forestry revenue',
        'Forestry revenue',
        120,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    -- Canvass
    (
        'CANVASSBUSNAME',
        'CANVASS',
        'Business name',
        'Business name',
        130,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'CANVASSLOCATION',
        'CANVASS',
        'Location',
        'Location',
        140,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    -- Court document
    (
        'COURTDOCNONE',
        'COURTDOC',
        'None',
        'None',
        150,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    -- Exhibits
    (
        'EXHIBDETORDER',
        'EXHIBITS',
        'Detention order',
        'Detention order',
        160,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'EXHIBRPTJUST',
        'EXHIBITS',
        'Report to Justice',
        'Report to Justice',
        170,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'EXHIBDISPOSIT',
        'EXHIBITS',
        'Disposition',
        'Disposition',
        180,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'EXHIBMANAGEMENT',
        'EXHIBITS',
        'Management',
        'Management',
        190,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'EXHIBSEIZURE',
        'EXHIBITS',
        'Seizure',
        'Seizure',
        200,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    -- External
    (
        'EXTERNALNONE',
        'EXTERNAL',
        'None',
        'None',
        210,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    -- Expert
    (
        'EXPERTNONE',
        'EXPERT',
        'None',
        'None',
        220,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    -- Internal
    (
        'INTERNALNONE',
        'INTERNAL',
        'None',
        'None',
        230,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    -- Judicial authorization
    (
        'JAOBTSRCHWARR',
        'JUDICIALAUTH',
        'Obtain search warrant',
        'Obtain search warrant',
        240,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'JAEXESRCHWARR',
        'JUDICIALAUTH',
        'Execute search warrant',
        'Execute search warrant',
        250,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'JAOBTPRODORD',
        'JUDICIALAUTH',
        'Obtain production order',
        'Obtain production order',
        260,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'JAEXEPRODORD',
        'JUDICIALAUTH',
        'Execute production order',
        'Execute production order',
        270,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    -- Notes and will says
    (
        'NWSOFFNOTES',
        'NOTESWILLSAYS',
        'Officer notes',
        'Officer notes',
        280,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'NWSWILLSAY',
        'NOTESWILLSAYS',
        'Will say',
        'Will say',
        290,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    -- Operational
    (
        'OPBRIEFMIN',
        'OPERATIONAL',
        'Briefing minutes',
        'Briefing minutes',
        300,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'OPBRIEFNOTE',
        'OPERATIONAL',
        'Briefing note',
        'Briefing note',
        310,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'OPDECISIONLOG',
        'OPERATIONAL',
        'Decision log',
        'Decision log',
        320,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'OPOPPLAN',
        'OPERATIONAL',
        'Operational plan',
        'Operational plan',
        330,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'OPINVPLAN',
        'OPERATIONAL',
        'Investigation plan',
        'Investigation plan',
        340,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'OPSEARCHPLAN',
        'OPERATIONAL',
        'Search Plan',
        'Search Plan',
        350,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'OPRPTCROWN',
        'OPERATIONAL',
        'Report to Crown Counsel',
        'Report to Crown Counsel',
        360,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'OPINVREPORT',
        'OPERATIONAL',
        'Investigative report',
        'Investigative report',
        370,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'OPVIOTICKET',
        'OPERATIONAL',
        'Violation Ticket',
        'Violation Ticket',
        380,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'OPWARNING',
        'OPERATIONAL',
        'Warning',
        'Warning',
        390,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'OPRESTJUSTICE',
        'OPERATIONAL',
        'Restorative justice',
        'Restorative justice',
        400,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'OPTRESPASS',
        'OPERATIONAL',
        'Trespass',
        'Trespass',
        410,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'OPSEIZURENTCE',
        'OPERATIONAL',
        'Seizure notice',
        'Seizure notice',
        420,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'OPSTOPWORK',
        'OPERATIONAL',
        'Stop work order',
        'Stop work order',
        430,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'OPDRONEPRE',
        'OPERATIONAL',
        'Drone preflight assessment',
        'Drone preflight assessment',
        440,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'OPINTENFREQ',
        'OPERATIONAL',
        'Integrated enforcement requests',
        'Integrated enforcement requests',
        450,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'OPSUPUPDATE',
        'OPERATIONAL',
        'Supervisor update',
        'Supervisor update',
        460,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'OPINTCOMMS',
        'OPERATIONAL',
        'Internal communications',
        'Internal communications',
        470,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    -- Profile
    (
        'PROFILECOMPANY',
        'PROFILE',
        'Company',
        'Company',
        480,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'PROFILELOCATION',
        'PROFILE',
        'Location',
        'Location',
        490,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'PROFILEPERSON',
        'PROFILE',
        'Person',
        'Person',
        500,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'PROFILEVEHICLE',
        'PROFILE',
        'Vehicle',
        'Vehicle',
        510,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'PROFILEVESSEL',
        'PROFILE',
        'Vessel',
        'Vessel',
        520,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    -- Release tracking
    (
        'RTFOIREQUEST',
        'RELEASETRACK',
        'Freedom of information request',
        'Freedom of information request',
        530,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'RTMEDIA',
        'RELEASETRACK',
        'Media',
        'Media',
        540,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    -- Scene
    (
        'SCENEINSPECTION',
        'SCENE',
        'Inspection',
        'Inspection',
        550,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    -- Sensitive
    (
        'SENSCRIMESTOP',
        'SENSITIVE',
        'Crimestoppers report',
        'Crimestoppers report',
        560,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    -- Statement
    (
        'STMTWITNESS',
        'STATEMENT',
        'Witness',
        'Witness',
        570,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'STMTWARNED',
        'STATEMENT',
        'Warned',
        'Warned',
        580,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    -- Surveillance
    (
        'SURVNONE',
        'SURVEILLANCE',
        'None',
        'None',
        590,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    -- Undercover operation
    (
        'UCONONE',
        'UNDERCOVEROP',
        'None',
        'None',
        600,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    -- Witness
    (
        'WITNESSNOTES',
        'WITNESS',
        'Notes',
        'Notes',
        610,
        TRUE,
        'FLYWAY',
        NOW ()
    ),
    (
        'WITNESSMGMT',
        'WITNESS',
        'Witness management',
        'Witness management',
        620,
        TRUE,
        'FLYWAY',
        NOW ()
    ) ON CONFLICT (task_type_code) DO
UPDATE
SET
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    display_order = EXCLUDED.display_order,
    active_ind = EXCLUDED.active_ind,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW ();

---------------------------------
-- Deletes temporary data
---------------------------------
UPDATE investigation.task
SET
    task_type_code = 'ADMINBUSRULE',
    task_category_type_code = 'ADMIN',
    update_user_id = 'FLYWAY',
    update_utc_timestamp = NOW ()
WHERE
    task_type_code LIKE 'TEMPSUBTYPE%';

DELETE FROM investigation.task_type_code
WHERE
    task_type_code LIKE 'TEMPSUBTYPE%';

DELETE FROM investigation.task_category_type_code
WHERE
    task_category_type_code LIKE 'TEMPTYPE%';