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
  'COMPLIMENT',
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
  'COMPLIMENT',
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
  'COMPLIMENT',
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
  'COMPLIMENT',
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
  'COMPLIMENT',
  'CEEB',
  'N',
  'FLYWAY',
  now (),
  'FLYWAY',
  now () ON CONFLICT DO NOTHING;