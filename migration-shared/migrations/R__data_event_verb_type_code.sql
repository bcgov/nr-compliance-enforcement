INSERT INTO
  shared.event_verb_type_code (
    event_verb_type_code,
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
    'OPENED',
    'Opened',
    'Opened',
    10,
    true,
    'system',
    now (),
    null,
    null
  ) ON CONFLICT (event_verb_type_code) DO
UPDATE
SET
  short_description = EXCLUDED.short_description,
  long_description = EXCLUDED.long_description,
  display_order = EXCLUDED.display_order,
  active_ind = EXCLUDED.active_ind,
  update_user_id = 'system',
  update_utc_timestamp = now ();

;

INSERT INTO
  shared.event_verb_type_code (
    event_verb_type_code,
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
    'CLOSED',
    'Closed',
    'Closed',
    20,
    true,
    'system',
    now (),
    null,
    null
  ) ON CONFLICT (event_verb_type_code) DO
UPDATE
SET
  short_description = EXCLUDED.short_description,
  long_description = EXCLUDED.long_description,
  display_order = EXCLUDED.display_order,
  active_ind = EXCLUDED.active_ind,
  update_user_id = 'system',
  update_utc_timestamp = now ();

;

INSERT INTO
  shared.event_verb_type_code (
    event_verb_type_code,
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
    'ADDED',
    'Added',
    'Added',
    30,
    true,
    'system',
    now (),
    null,
    null
  ) ON CONFLICT (event_verb_type_code) DO
UPDATE
SET
  short_description = EXCLUDED.short_description,
  long_description = EXCLUDED.long_description,
  display_order = EXCLUDED.display_order,
  active_ind = EXCLUDED.active_ind,
  update_user_id = 'system',
  update_utc_timestamp = now ();

;

INSERT INTO
  shared.event_verb_type_code (
    event_verb_type_code,
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
    'REMOVED',
    'Removed',
    'Removed',
    40,
    true,
    'system',
    now (),
    null,
    null
  ) ON CONFLICT (event_verb_type_code) DO
UPDATE
SET
  short_description = EXCLUDED.short_description,
  long_description = EXCLUDED.long_description,
  display_order = EXCLUDED.display_order,
  active_ind = EXCLUDED.active_ind,
  update_user_id = 'system',
  update_utc_timestamp = now ();

INSERT INTO
  shared.event_verb_type_code (
    event_verb_type_code,
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
    'CREATED',
    'Created',
    'Created',
    50,
    true,
    'system',
    now (),
    null,
    null
  ) ON CONFLICT (event_verb_type_code) DO
UPDATE
SET
  short_description = EXCLUDED.short_description,
  long_description = EXCLUDED.long_description,
  display_order = EXCLUDED.display_order,
  active_ind = EXCLUDED.active_ind,
  update_user_id = 'system',
  update_utc_timestamp = now ();

;