-- Add TABLE legislation type code for OASIS tables in BC Laws documents
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
    'TABLE',
    'Table',
    'An OASIS table element containing tabular data within legislation.',
    18,
    TRUE,
    'FLYWAY',
    NOW ()
  ) ON CONFLICT (legislation_type_code) DO NOTHING;
