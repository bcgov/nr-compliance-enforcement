INSERT INTO
  feature_code (
    feature_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'COMPLIMENTS',
  'Compliments',
  'Display compliments page with motivational messages',
  500,
  'N',
  'FLYWAY',
  now (),
  'FLYWAY',
  now () ON CONFLICT DO NOTHING;

INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code_ref,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'COMPLIMENTS',
  'EPO',
  'N',
  'FLYWAY',
  now (),
  'FLYWAY',
  now () ON CONFLICT DO NOTHING;

INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code_ref,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'COMPLIMENTS',
  'COS',
  'N',
  'FLYWAY',
  now (),
  'FLYWAY',
  now () ON CONFLICT DO NOTHING;

INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code_ref,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'COMPLIMENTS',
  'PARKS',
  'N',
  'FLYWAY',
  now (),
  'FLYWAY',
  now () ON CONFLICT DO NOTHING;

INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code_ref,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'COMPLIMENTS',
  'CEEB',
  'N',
  'FLYWAY',
  now (),
  'FLYWAY',
  now () ON CONFLICT DO NOTHING;