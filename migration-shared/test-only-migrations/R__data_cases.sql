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
values
  (
    '77dd3a1f-4bc5-4758-a986-a664b8d8f2ee',
    'INVSTGTN',
    '66dd3a1f-4bc5-4758-a986-a664b8d8f200',
    now (),
    'system',
    now ()
  ),
  (
    '77dd3a1f-4bc5-4758-a986-a664b8d8f2ef',
    'INVSTGTN',
    '66dd3a1f-4bc5-4758-a986-a664b8d8f201',
    now (),
    'system',
    now ()
  ),
  (
    '77dd3a1f-4bc5-4758-a986-a664b8d8f2ea',
    'INVSTGTN',
    '66dd3a1f-4bc5-4758-a986-a664b8d8f202',
    now (),
    'system',
    now ()
  ),
  (
    '77dd3a1f-4bc5-4758-a986-a664b8d8f2ea',
    'INVSTGTN',
    '66dd3a1f-4bc5-4758-a986-a664b8d8f203',
    now (),
    'system',
    now ()
  ) on conflict do nothing;

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
values
  (
    'd61b99d1-20dd-44e7-a864-6e28c9b3585a',
    'INSPECTION',
    '8116f74c-19d2-4903-9dfc-d5607c1fb900',
    now (),
    'system',
    now ()
  ),
  (
    'd61b99d1-20dd-44e7-a864-6e28c9b3585b',
    'INSPECTION',
    '8116f74c-19d2-4903-9dfc-d5607c1fb901',
    now (),
    'system',
    now ()
  ),
  (
    '77dd3a1f-4bc5-4758-a986-a664b8d8f2ea',
    'INSPECTION',
    '8116f74c-19d2-4903-9dfc-d5607c1fb902',
    now (),
    'system',
    now ()
  ),
  (
    '77dd3a1f-4bc5-4758-a986-a664b8d8f2ea',
    'INSPECTION',
    '8116f74c-19d2-4903-9dfc-d5607c1fb903',
    now (),
    'system',
    now ()
  ) on conflict do nothing;