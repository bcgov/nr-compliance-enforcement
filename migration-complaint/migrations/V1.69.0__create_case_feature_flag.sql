INSERT INTO
  complaint.feature_code
VALUES
  (
    'CREATECASE',
    'Create Case',
    'Enables the ability to create a case on its own',
    410,
    true,
    'FLYWAY',
    NOW (),
    'FLYWAY',
    NOW ()
  );

INSERT INTO
  complaint.feature_agency_xref (
    feature_code,
    agency_code_ref,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'CREATECASE',
    'COS',
    false,
    'FLWYAY',
    NOW (),
    'FLWYAY',
    NOW ()
  );

INSERT INTO
  complaint.feature_agency_xref (
    feature_code,
    agency_code_ref,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'CREATECASE',
    'EPO',
    false,
    'FLWYAY',
    NOW (),
    'FLWYAY',
    NOW ()
  );

INSERT INTO
  complaint.feature_agency_xref (
    feature_code,
    agency_code_ref,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'CREATECASE',
    'PARKS',
    false,
    'FLWYAY',
    NOW (),
    'FLWYAY',
    NOW ()
  );

INSERT INTO
  complaint.feature_agency_xref (
    feature_code,
    agency_code_ref,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'CREATECASE',
    'NRS',
    false,
    'FLWYAY',
    NOW (),
    'FLWYAY',
    NOW ()
  );

INSERT INTO
  complaint.feature_agency_xref (
    feature_code,
    agency_code_ref,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'CREATECASE',
    'NRO',
    false,
    'FLWYAY',
    NOW (),
    'FLWYAY',
    NOW ()
  );