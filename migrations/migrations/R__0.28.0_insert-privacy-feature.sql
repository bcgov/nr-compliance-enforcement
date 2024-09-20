--
-- create new feature for privacy-requested
--
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
  'PRIV_REQ',
  'Privacy Requested',
  'Enables the privacy requested field when creating a new complaint',
  150,
  'Y',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

--
-- create new xrefs for new privacy-requested feature
--
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'PRIV_REQ',
  'EPO',
  'Y',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'PRIV_REQ',
  'COS',
  'N',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'PRIV_REQ',
  'PARKS',
  'N',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;