INSERT INTO
  violation_code (
    violation_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'FIREARMS',
    'FIREARMS',
    'Firearms',
    '13',
    true,
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'ILLEGALFIR',
    'ILLEGALFIR',
    'Illegal fire',
    '14',
    true,
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'MOTORVEC',
    'MOTORVEC',
    'Motor vehicles',
    '15',
    true,
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'PARKDISTUR',
    'PARKDISTUR',
    'Park disturbance ',
    '16',
    true,
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  )
ON CONFLICT DO NOTHING;


UPDATE violation_code set display_order = 10 WHERE violation_code = 'AINVSPC';
UPDATE violation_code set display_order = 20 WHERE violation_code = 'BOATING';
UPDATE violation_code set display_order = 30 WHERE violation_code = 'DUMPING';
UPDATE violation_code set display_order = 40 WHERE violation_code = 'FIREARMS';
UPDATE violation_code set display_order = 50 WHERE violation_code = 'FISHERY';
UPDATE violation_code set display_order = 60 WHERE violation_code = 'ILLEGALFIR';
UPDATE violation_code set display_order = 70 WHERE violation_code = 'MOTORVEC';
UPDATE violation_code set display_order = 80 WHERE violation_code = 'ORV';
UPDATE violation_code set display_order = 90 WHERE violation_code = 'OPENBURN';
UPDATE violation_code set display_order = 100 WHERE violation_code = 'OTHER';
UPDATE violation_code set display_order = 110 WHERE violation_code = 'PARKDISTUR';
UPDATE violation_code set display_order = 120 WHERE violation_code = 'RECREATN';
UPDATE violation_code set display_order = 130 WHERE violation_code = 'WILDLIFE';
UPDATE violation_code set display_order = 140 WHERE violation_code = 'WINVSPC';
UPDATE violation_code set display_order = 150 WHERE violation_code = 'PESTICDE';
UPDATE violation_code set display_order = 160 WHERE violation_code = 'WASTE';

INSERT INTO
  violation_agency_xref (
    violation_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'FIREARMS',
    'PARKS',
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ),
  (
    'ILLEGALFIR',
    'PARKS',
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ),
  (
    'MOTORVEC',
    'PARKS',
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ),
  (
    'PARKDISTUR',
    'PARKS',
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  )
ON CONFLICT DO NOTHING;

UPDATE violation_agency_xref set active_ind = false WHERE violation_code = 'OPENBURN' AND agency_code = 'PARKS';


UPDATE configuration 
SET    configuration_value = configuration_value::int + 1
WHERE  configuration_code = 'CDTABLEVER';