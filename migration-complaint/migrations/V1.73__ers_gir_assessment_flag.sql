INSERT INTO
  complaint.feature_code
VALUES
  (
    'ERSGIRASMT',
    'ERS & GIR Assessments',
    'Requires an assessment to close Enforcement and GIR complaints; adds quick close and auto-creates an assessment when an investigation is started, the complaint is added to a case, 
  or a COORS number is saved',
    411,
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
    'ERSGIRASMT',
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
    'ERSGIRASMT',
    'PARKS',
    false,
    'FLWYAY',
    NOW (),
    'FLWYAY',
    NOW ()
  );
