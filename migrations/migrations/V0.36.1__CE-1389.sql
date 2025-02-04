-- 
-- Insert new configuration values for CDOGS API for document generation
-- 

INSERT INTO
  configuration (
    configuration_code,
    configuration_value,
    long_description,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'GIRTMPLATE',
    '',
    'CDOGS Hash for GIR Template',
    true,
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;