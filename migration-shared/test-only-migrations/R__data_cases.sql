-- Create case files for the investigations to be added to
insert into
  shared.case_file (
    case_file_guid,
    lead_agency,
    case_status,
    opened_utc_timestamp,
    create_user_id,
    create_utc_timestamp,
    name
  )
values
  (
    '77dd3a1f-4bc5-4758-a986-a664b8d8f2ee',
    'COS',
    'OPEN',
    now (),
    'system',
    now (),
    'CASE1'
  ),
  (
    '77dd3a1f-4bc5-4758-a986-a664b8d8f2ef',
    'COS',
    'OPEN',
    now (),
    'system',
    now (),
    'CASE2'
  ),
  (
    '77dd3a1f-4bc5-4758-a986-a664b8d8f2ea',
    'COS',
    'OPEN',
    now (),
    'system',
    now (),
    'CASE3'
  ) on conflict do nothing;

-- Add the investigations to the cases
INSERT INTO
  shared.case_activity (
    case_file_guid,
    activity_type,
    activity_identifier_ref,
    effective_utc_timestamp,
    create_user_id,
    create_utc_timestamp
  )
SELECT
  '77dd3a1f-4bc5-4758-a986-a664b8d8f2ee',
  'INVSTGTN',
  '66dd3a1f-4bc5-4758-a986-a664b8d8f200',
  now (),
  'system',
  now ()
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      shared.case_activity
    WHERE
      activity_identifier_ref = '66dd3a1f-4bc5-4758-a986-a664b8d8f200'
  );

INSERT INTO
  shared.case_activity (
    case_file_guid,
    activity_type,
    activity_identifier_ref,
    effective_utc_timestamp,
    create_user_id,
    create_utc_timestamp
  )
SELECT
  '77dd3a1f-4bc5-4758-a986-a664b8d8f2ef',
  'INVSTGTN',
  '66dd3a1f-4bc5-4758-a986-a664b8d8f201',
  now (),
  'system',
  now ()
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      shared.case_activity
    WHERE
      activity_identifier_ref = '66dd3a1f-4bc5-4758-a986-a664b8d8f201'
  );

INSERT INTO
  shared.case_activity (
    case_file_guid,
    activity_type,
    activity_identifier_ref,
    effective_utc_timestamp,
    create_user_id,
    create_utc_timestamp
  )
SELECT
  '77dd3a1f-4bc5-4758-a986-a664b8d8f2ea',
  'INVSTGTN',
  '66dd3a1f-4bc5-4758-a986-a664b8d8f202',
  now (),
  'system',
  now ()
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      shared.case_activity
    WHERE
      activity_identifier_ref = '66dd3a1f-4bc5-4758-a986-a664b8d8f202'
  );

INSERT INTO
  shared.case_activity (
    case_file_guid,
    activity_type,
    activity_identifier_ref,
    effective_utc_timestamp,
    create_user_id,
    create_utc_timestamp
  )
SELECT
  '77dd3a1f-4bc5-4758-a986-a664b8d8f2ea',
  'INVSTGTN',
  '66dd3a1f-4bc5-4758-a986-a664b8d8f203',
  now (),
  'system',
  now ()
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      shared.case_activity
    WHERE
      activity_identifier_ref = '66dd3a1f-4bc5-4758-a986-a664b8d8f203'
  );

-- Create case files for the inspections to be added to
insert into
  shared.case_file (
    case_file_guid,
    lead_agency,
    case_status,
    opened_utc_timestamp,
    create_user_id,
    create_utc_timestamp,
    name
  )
values
  -- New values
  (
    'd61b99d1-20dd-44e7-a864-6e28c9b3585a',
    'COS',
    'OPEN',
    now (),
    'system',
    now (),
    'CASE4'
  ),
  (
    'd61b99d1-20dd-44e7-a864-6e28c9b3585b',
    'COS',
    'OPEN',
    now (),
    'system',
    now (),
    'CASE5'
  ),
  -- Existing case, redundant insert to avoid ordering issue
  (
    '77dd3a1f-4bc5-4758-a986-a664b8d8f2ea',
    'COS',
    'OPEN',
    now (),
    'system',
    now (),
    'CASE6'
  ) on conflict do nothing;

-- Add the inspections to the cases
INSERT INTO
  shared.case_activity (
    case_file_guid,
    activity_type,
    activity_identifier_ref,
    effective_utc_timestamp,
    create_user_id,
    create_utc_timestamp
  )
SELECT
  'd61b99d1-20dd-44e7-a864-6e28c9b3585a',
  'INSPECTION',
  '8116f74c-19d2-4903-9dfc-d5607c1fb900',
  now (),
  'system',
  now ()
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      shared.case_activity
    WHERE
      activity_identifier_ref = '8116f74c-19d2-4903-9dfc-d5607c1fb900'
  );

INSERT INTO
  shared.case_activity (
    case_file_guid,
    activity_type,
    activity_identifier_ref,
    effective_utc_timestamp,
    create_user_id,
    create_utc_timestamp
  )
SELECT
  'd61b99d1-20dd-44e7-a864-6e28c9b3585b',
  'INSPECTION',
  '8116f74c-19d2-4903-9dfc-d5607c1fb901',
  now (),
  'system',
  now ()
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      shared.case_activity
    WHERE
      activity_identifier_ref = '8116f74c-19d2-4903-9dfc-d5607c1fb901'
  );

INSERT INTO
  shared.case_activity (
    case_file_guid,
    activity_type,
    activity_identifier_ref,
    effective_utc_timestamp,
    create_user_id,
    create_utc_timestamp
  )
SELECT
  '77dd3a1f-4bc5-4758-a986-a664b8d8f2ea',
  'INSPECTION',
  '8116f74c-19d2-4903-9dfc-d5607c1fb902',
  now (),
  'system',
  now ()
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      shared.case_activity
    WHERE
      activity_identifier_ref = '8116f74c-19d2-4903-9dfc-d5607c1fb902'
  );

INSERT INTO
  shared.case_activity (
    case_file_guid,
    activity_type,
    activity_identifier_ref,
    effective_utc_timestamp,
    create_user_id,
    create_utc_timestamp
  )
SELECT
  '77dd3a1f-4bc5-4758-a986-a664b8d8f2ea',
  'INSPECTION',
  '8116f74c-19d2-4903-9dfc-d5607c1fb903',
  now (),
  'system',
  now ()
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      shared.case_activity
    WHERE
      activity_identifier_ref = '8116f74c-19d2-4903-9dfc-d5607c1fb903'
  );

-- Additional cases for e2e tests
insert into
  shared.case_file (
    case_file_guid,
    lead_agency,
    case_status,
    opened_utc_timestamp,
    create_user_id,
    create_utc_timestamp,
    name
  )
values
  (
    'a0000000-0000-0000-0000-000000000007',
    'COS',
    'CLOSED',
    now () - interval '1 day',
    'system',
    now (),
    'CASE7'
  ),
  (
    'a0000000-0000-0000-0000-000000000008',
    'COS',
    'OPEN',
    now () - interval '2 days',
    'system',
    now (),
    'CASE8'
  ),
  (
    'a0000000-0000-0000-0000-000000000009',
    'COS',
    'CLOSED',
    now () - interval '3 days',
    'system',
    now (),
    'CASE9'
  ),
  (
    'a0000000-0000-0000-0000-000000000010',
    'COS',
    'OPEN',
    now () - interval '4 days',
    'system',
    now (),
    'CASE10'
  ),
  (
    'a0000000-0000-0000-0000-000000000011',
    'COS',
    'OPEN',
    now () - interval '5 days',
    'system',
    now (),
    'CASE11'
  ),
  (
    'a0000000-0000-0000-0000-000000000012',
    'COS',
    'CLOSED',
    now () - interval '6 days',
    'system',
    now (),
    'CASE12'
  ),
  (
    'a0000000-0000-0000-0000-000000000013',
    'COS',
    'OPEN',
    now () - interval '7 days',
    'system',
    now (),
    'CASE13'
  ),
  (
    'a0000000-0000-0000-0000-000000000014',
    'COS',
    'OPEN',
    now () - interval '8 days',
    'system',
    now (),
    'CASE14'
  ),
  (
    'a0000000-0000-0000-0000-000000000015',
    'COS',
    'OPEN',
    now () - interval '9 days',
    'system',
    now (),
    'CASE15'
  ),
  (
    'a0000000-0000-0000-0000-000000000016',
    'COS',
    'CLOSED',
    now () - interval '10 days',
    'system',
    now (),
    'CASE16'
  ),
  (
    'a0000000-0000-0000-0000-000000000017',
    'COS',
    'OPEN',
    now () - interval '11 days',
    'system',
    now (),
    'CASE17'
  ),
  (
    'a0000000-0000-0000-0000-000000000018',
    'COS',
    'OPEN',
    now () - interval '12 days',
    'system',
    now (),
    'CASE18'
  ),
  (
    'a0000000-0000-0000-0000-000000000019',
    'COS',
    'OPEN',
    now () - interval '13 days',
    'system',
    now (),
    'CASE19'
  ),
  (
    'a0000000-0000-0000-0000-000000000020',
    'COS',
    'CLOSED',
    now () - interval '14 days',
    'system',
    now (),
    'CASE20'
  ),
  (
    'a0000000-0000-0000-0000-000000000021',
    'COS',
    'OPEN',
    now () - interval '15 days',
    'system',
    now (),
    'CASE21'
  ),
  (
    'a0000000-0000-0000-0000-000000000022',
    'COS',
    'OPEN',
    now () - interval '16 days',
    'system',
    now (),
    'CASE22'
  ),
  (
    'a0000000-0000-0000-0000-000000000023',
    'COS',
    'OPEN',
    now () - interval '17 days',
    'system',
    now (),
    'CASE23'
  ),
  (
    'a0000000-0000-0000-0000-000000000024',
    'COS',
    'CLOSED',
    now () - interval '18 days',
    'system',
    now (),
    'CASE24'
  ),
  (
    'a0000000-0000-0000-0000-000000000025',
    'COS',
    'OPEN',
    now () - interval '19 days',
    'system',
    now (),
    'CASE25'
  ),
  (
    'a0000000-0000-0000-0000-000000000026',
    'COS',
    'OPEN',
    now () - interval '20 days',
    'system',
    now (),
    'CASE26'
  ),
  (
    'a0000000-0000-0000-0000-000000000027',
    'COS',
    'OPEN',
    now () - interval '21 days',
    'system',
    now (),
    'CASE27'
  ),
  (
    'a0000000-0000-0000-0000-000000000028',
    'COS',
    'CLOSED',
    now () - interval '22 days',
    'system',
    now (),
    'CASE28'
  ),
  (
    'a0000000-0000-0000-0000-000000000029',
    'COS',
    'OPEN',
    now () - interval '23 days',
    'system',
    now (),
    'CASE29'
  ),
  (
    'a0000000-0000-0000-0000-000000000030',
    'COS',
    'OPEN',
    now () - interval '24 days',
    'system',
    now (),
    'CASE30'
  ) on conflict do nothing;