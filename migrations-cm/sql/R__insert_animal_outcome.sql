--
-- INSERT New animal outcome action type codes
--
INSERT INTO
  case_management.action_type_code (
    action_type_code,
    short_description,
    long_description,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'WILDLIFE',
    'Wildlife',
    'For actions related to the wildlife section',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

--
-- INSERT New animal outcome action codes
--
INSERT INTO
  case_management.action_code (
    action_code,
    short_description,
    long_description,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'ADMNSTRDRG',
    'Drug administered by an officer',
    'Drug administered by an officer',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.action_code (
    action_code,
    short_description,
    long_description,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'RECOUTCOME',
    'Outcome recorded by an officer',
    'Outcome recorded by an officer',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

--
-- INSERT New animal outcome action xref
--
INSERT INTO
  case_management.action_type_action_xref (
    action_type_code,
    action_code,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
VALUES
  (
    'WILDLIFE',
    'ADMNSTRDRG',
    1,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.action_type_action_xref (
    action_type_code,
    action_code,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
VALUES
  (
    'WILDLIFE',
    'RECOUTCOME',
    2,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;