INSERT INTO
  shared.event_entity_type_code (
    event_entity_type_code,
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
    'COMPLAINT',
    'Complaint',
    'Complaint',
    10,
    true,
    'system',
    now (),
    null,
    null
  ) ON CONFLICT (event_entity_type_code) DO
UPDATE
SET
  short_description = EXCLUDED.short_description,
  long_description = EXCLUDED.long_description,
  display_order = EXCLUDED.display_order,
  active_ind = EXCLUDED.active_ind,
  update_user_id = 'system',
  update_utc_timestamp = now ();

INSERT INTO
  shared.event_entity_type_code (
    event_entity_type_code,
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
    'CASE',
    'Case',
    'Case',
    20,
    true,
    'system',
    now (),
    null,
    null
  ) ON CONFLICT (event_entity_type_code) DO
UPDATE
SET
  short_description = EXCLUDED.short_description,
  long_description = EXCLUDED.long_description,
  display_order = EXCLUDED.display_order,
  active_ind = EXCLUDED.active_ind,
  update_user_id = 'system',
  update_utc_timestamp = now ();

INSERT INTO
  shared.event_entity_type_code (
    event_entity_type_code,
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
    'INVESTIGATION',
    'Investigation',
    'Investigation',
    30,
    true,
    'system',
    now (),
    null,
    null
  ) ON CONFLICT (event_entity_type_code) DO
UPDATE
SET
  short_description = EXCLUDED.short_description,
  long_description = EXCLUDED.long_description,
  display_order = EXCLUDED.display_order,
  active_ind = EXCLUDED.active_ind,
  update_user_id = 'system',
  update_utc_timestamp = now ();

INSERT INTO
  shared.event_entity_type_code (
    event_entity_type_code,
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
    'INSPECTION',
    'Inspection',
    'Inspection',
    40,
    true,
    'system',
    now (),
    null,
    null
  ) ON CONFLICT (event_entity_type_code) DO
UPDATE
SET
  short_description = EXCLUDED.short_description,
  long_description = EXCLUDED.long_description,
  display_order = EXCLUDED.display_order,
  active_ind = EXCLUDED.active_ind,
  update_user_id = 'system',
  update_utc_timestamp = now ();

INSERT INTO
  shared.event_entity_type_code (
    event_entity_type_code,
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
    'INVESTIGATION',
    'Investigation',
    'Investigation',
    30,
    true,
    'system',
    now (),
    null,
    null
  ) ON CONFLICT (event_entity_type_code) DO
UPDATE
SET
  short_description = EXCLUDED.short_description,
  long_description = EXCLUDED.long_description,
  display_order = EXCLUDED.display_order,
  active_ind = EXCLUDED.active_ind,
  update_user_id = 'system',
  update_utc_timestamp = now ();

INSERT INTO
  shared.event_entity_type_code (
    event_entity_type_code,
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
    'PARTY',
    'Party',
    'Party',
    40,
    true,
    'system',
    now (),
    null,
    null
  ) ON CONFLICT (event_entity_type_code) DO
UPDATE
SET
  short_description = EXCLUDED.short_description,
  long_description = EXCLUDED.long_description,
  display_order = EXCLUDED.display_order,
  active_ind = EXCLUDED.active_ind,
  update_user_id = 'system',
  update_utc_timestamp = now ();

-- User
INSERT INTO
  shared.event_entity_type_code (
    event_entity_type_code,
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
    'USER',
    'User',
    'User',
    50,
    true,
    'system',
    now (),
    null,
    null
  ) ON CONFLICT (event_entity_type_code) DO
UPDATE
SET
  short_description = EXCLUDED.short_description,
  long_description = EXCLUDED.long_description,
  display_order = EXCLUDED.display_order,
  active_ind = EXCLUDED.active_ind,
  update_user_id = 'system',
  update_utc_timestamp = now ();