INSERT INTO
  complaint.feature_code
VALUES
  (
    'ASMTCOMNTS',
    'Assessment Comments',
    'Adds an optional Comments field to assessments and quick close',
    412,
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
    'ASMTCOMNTS',
    'COS',
    false,
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
    'ASMTCOMNTS',
    'EPO',
    false,
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
    'ASMTCOMNTS',
    'PARKS',
    false,
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
    'ASMTCOMNTS',
    'MINES',
    false,
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
    'ASMTCOMNTS',
    'NROS',
    false,
    'FLYWAY',
    NOW (),
    'FLYWAY',
    NOW ()
  );
