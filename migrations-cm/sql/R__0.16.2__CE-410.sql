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
    'CASEACTION',
    'Miscellaneous Case Actions',
    'Miscellaneous Case Actions',
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
    'COMPLTREVW',
    'Complete Review',
    'Complete Review',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
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
    'CASEACTION',
    'COMPLTREVW',
    1,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;