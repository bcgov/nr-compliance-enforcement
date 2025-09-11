-- Create case files for the inspections to be added to
insert into
  shared.case_file (
    case_file_guid,
    lead_agency,
    case_status,
    opened_utc_timestamp,
    create_user_id,
    create_utc_timestamp
  )
values
-- New values
  (
    'd61b99d1-20dd-44e7-a864-6e28c9b3585a',
    'COS',
    'OPEN',
    now (),
    'system',
    now ()
  ),
  (
    'd61b99d1-20dd-44e7-a864-6e28c9b3585b',
    'COS',
    'OPEN',
    now (),
    'system',
    now ()
  ),
-- Existing case, redundant insert to avoid ordering issue
  (
    '77dd3a1f-4bc5-4758-a986-a664b8d8f2ea',
    'COS',
    'OPEN',
    now (),
    'system',
    now ()
  ) on conflict do nothing;

-- Create test inspections
insert into
  inspection.inspection (
    inspection_guid,
    owned_by_agency_ref,
    inspection_status,
    inspection_opened_utc_timestamp,
    create_user_id,
    create_utc_timestamp
  )
values
  (
    '8116f74c-19d2-4903-9dfc-d5607c1fb900',
    'COS',
    'OPEN',
    now (),
    'system',
    now ()
  ),
  (
    '8116f74c-19d2-4903-9dfc-d5607c1fb901',
    'COS',
    'OPEN',
    now (),
    'system',
    now ()
  ),
  (
    '8116f74c-19d2-4903-9dfc-d5607c1fb902',
    'COS',
    'OPEN',
    now (),
    'system',
    now ()
  ),
  (
    '8116f74c-19d2-4903-9dfc-d5607c1fb903',
    'COS',
    'OPEN',
    now (),
    'system',
    now ()
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
