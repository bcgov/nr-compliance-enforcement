-- Add PART and DEF legislation type codes for BC Laws import
INSERT INTO
  legislation_type_code (
    legislation_type_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
VALUES
  (
    'PART',
    'Part',
    'A major division of an Act or Regulation, typically numbered Part 1, Part 2, etc.',
    25,
    TRUE,
    'FLYWAY',
    NOW ()
  ),
  (
    'DEF',
    'Definition',
    'A defined term within an Act or Regulation, typically found in a definitions section.',
    35,
    TRUE,
    'FLYWAY',
    NOW ()
  ) ON CONFLICT (legislation_type_code) DO NOTHING;