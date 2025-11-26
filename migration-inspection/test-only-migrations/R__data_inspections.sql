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
  ),
  (
    'c0000000-0000-0000-0000-000000000005',
    'COS',
    'OPEN',
    now () - interval '1 day',
    'system',
    now (),
    'INSPECTION5'
  ),
  (
    'c0000000-0000-0000-0000-000000000006',
    'COS',
    'OPEN',
    now () - interval '2 days',
    'system',
    now (),
    'INSPECTION6'
  ),
  (
    'c0000000-0000-0000-0000-000000000007',
    'COS',
    'CLOSED',
    now () - interval '3 days',
    'system',
    now (),
    'INSPECTION7'
  ),
  (
    'c0000000-0000-0000-0000-000000000008',
    'COS',
    'OPEN',
    now () - interval '4 days',
    'system',
    now (),
    'INSPECTION8'
  ),
  (
    'c0000000-0000-0000-0000-000000000009',
    'COS',
    'OPEN',
    now () - interval '5 days',
    'system',
    now (),
    'INSPECTION9'
  ),
  (
    'c0000000-0000-0000-0000-000000000010',
    'COS',
    'CLOSED',
    now () - interval '6 days',
    'system',
    now (),
    'INSPECTION10'
  ),
  (
    'c0000000-0000-0000-0000-000000000011',
    'COS',
    'OPEN',
    now () - interval '7 days',
    'system',
    now (),
    'INSPECTION11'
  ),
  (
    'c0000000-0000-0000-0000-000000000012',
    'COS',
    'OPEN',
    now () - interval '8 days',
    'system',
    now (),
    'INSPECTION12'
  ),
  (
    'c0000000-0000-0000-0000-000000000013',
    'COS',
    'CLOSED',
    now () - interval '9 days',
    'system',
    now (),
    'INSPECTION13'
  ),
  (
    'c0000000-0000-0000-0000-000000000014',
    'COS',
    'OPEN',
    now () - interval '10 days',
    'system',
    now (),
    'INSPECTION14'
  ),
  (
    'c0000000-0000-0000-0000-000000000015',
    'COS',
    'OPEN',
    now () - interval '11 days',
    'system',
    now (),
    'INSPECTION15'
  ),
  (
    'c0000000-0000-0000-0000-000000000016',
    'COS',
    'CLOSED',
    now () - interval '12 days',
    'system',
    now (),
    'INSPECTION16'
  ),
  (
    'c0000000-0000-0000-0000-000000000017',
    'COS',
    'OPEN',
    now () - interval '13 days',
    'system',
    now (),
    'INSPECTION17'
  ),
  (
    'c0000000-0000-0000-0000-000000000018',
    'COS',
    'OPEN',
    now () - interval '14 days',
    'system',
    now (),
    'INSPECTION18'
  ),
  (
    'c0000000-0000-0000-0000-000000000019',
    'COS',
    'CLOSED',
    now () - interval '15 days',
    'system',
    now (),
    'INSPECTION19'
  ),
  (
    'c0000000-0000-0000-0000-000000000020',
    'COS',
    'OPEN',
    now () - interval '16 days',
    'system',
    now (),
    'INSPECTION20'
  ),
  (
    'c0000000-0000-0000-0000-000000000021',
    'COS',
    'OPEN',
    now () - interval '17 days',
    'system',
    now (),
    'INSPECTION21'
  ),
  (
    'c0000000-0000-0000-0000-000000000022',
    'COS',
    'CLOSED',
    now () - interval '18 days',
    'system',
    now (),
    'INSPECTION22'
  ),
  (
    'c0000000-0000-0000-0000-000000000023',
    'COS',
    'OPEN',
    now () - interval '19 days',
    'system',
    now (),
    'INSPECTION23'
  ),
  (
    'c0000000-0000-0000-0000-000000000024',
    'COS',
    'OPEN',
    now () - interval '20 days',
    'system',
    now (),
    'INSPECTION24'
  ),
  (
    'c0000000-0000-0000-0000-000000000025',
    'COS',
    'CLOSED',
    now () - interval '21 days',
    'system',
    now (),
    'INSPECTION25'
  ),
  (
    'c0000000-0000-0000-0000-000000000026',
    'COS',
    'OPEN',
    now () - interval '22 days',
    'system',
    now (),
    'INSPECTION26'
  ),
  (
    'c0000000-0000-0000-0000-000000000027',
    'COS',
    'OPEN',
    now () - interval '23 days',
    'system',
    now (),
    'INSPECTION27'
  ),
  (
    'c0000000-0000-0000-0000-000000000028',
    'COS',
    'CLOSED',
    now () - interval '24 days',
    'system',
    now (),
    'INSPECTION28'
  ),
  (
    'c0000000-0000-0000-0000-000000000029',
    'COS',
    'OPEN',
    now () - interval '25 days',
    'system',
    now (),
    'INSPECTION29'
  ) on conflict do nothing;