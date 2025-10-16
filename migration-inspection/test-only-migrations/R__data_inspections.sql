-- Create test inspections
insert into
  inspection.inspection (
    inspection_guid,
    owned_by_agency_ref,
    inspection_status,
    inspection_opened_utc_timestamp,
    create_user_id,
    create_utc_timestamp,
    name
  )
values
  (
    '8116f74c-19d2-4903-9dfc-d5607c1fb900',
    'COS',
    'OPEN',
    now (),
    'system',
    now (),
    'INSPECTION1'
  ),
  (
    '8116f74c-19d2-4903-9dfc-d5607c1fb901',
    'COS',
    'OPEN',
    now (),
    'system',
    now (),
    'INSPECTION2'
  ),
  (
    '8116f74c-19d2-4903-9dfc-d5607c1fb902',
    'COS',
    'OPEN',
    now (),
    'system',
    now (),
    'INSPECTION3'
  ),
  (
    '8116f74c-19d2-4903-9dfc-d5607c1fb903',
    'COS',
    'OPEN',
    now (),
    'system',
    now (),
    'INSPECTION4'
  ) on conflict do nothing;