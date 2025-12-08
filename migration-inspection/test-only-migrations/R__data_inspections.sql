-- Create test inspections
insert into
  inspection.inspection (
    inspection_guid,
    owned_by_agency_ref,
    inspection_status,
    inspection_opened_utc_timestamp,
    create_user_id,
    create_utc_timestamp,
    location_geometry_point,
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
    ST_GeomFromText ('POINT(-123.1207 49.2827)'),
    'INSPECTION1'
  ),
  (
    '8116f74c-19d2-4903-9dfc-d5607c1fb901',
    'COS',
    'OPEN',
    now (),
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.3656 48.4284)'),
    'INSPECTION2'
  ),
  (
    '8116f74c-19d2-4903-9dfc-d5607c1fb902',
    'COS',
    'OPEN',
    now (),
    'system',
    now (),
    ST_GeomFromText ('POINT(-122.9574 49.1666)'),
    'INSPECTION3'
  ),
  (
    '8116f74c-19d2-4903-9dfc-d5607c1fb903',
    'COS',
    'OPEN',
    now (),
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.0848 49.3043)'),
    'INSPECTION4'
  ),
  (
    'c0000000-0000-0000-0000-000000000005',
    'COS',
    'OPEN',
    now () - interval '1 day',
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.1207 49.2827)'),
    'INSPECTION5'
  ),
  (
    'c0000000-0000-0000-0000-000000000006',
    'COS',
    'OPEN',
    now () - interval '2 days',
    'system',
    now (),
    NULL,
    'INSPECTION6'
  ),
  (
    'c0000000-0000-0000-0000-000000000007',
    'COS',
    'CLOSED',
    now () - interval '3 days',
    'system',
    now (),
    NULL,
    'INSPECTION7'
  ),
  (
    'c0000000-0000-0000-0000-000000000008',
    'COS',
    'OPEN',
    now () - interval '4 days',
    'system',
    now (),
    NULL,
    'INSPECTION8'
  ),
  (
    'c0000000-0000-0000-0000-000000000009',
    'COS',
    'OPEN',
    now () - interval '5 days',
    'system',
    now (),
    NULL,
    'INSPECTION9'
  ),
  (
    'c0000000-0000-0000-0000-000000000010',
    'COS',
    'CLOSED',
    now () - interval '6 days',
    'system',
    now (),
    NULL,
    'INSPECTION10'
  ),
  (
    'c0000000-0000-0000-0000-000000000011',
    'COS',
    'OPEN',
    now () - interval '7 days',
    'system',
    now (),
    NULL,
    'INSPECTION11'
  ),
  (
    'c0000000-0000-0000-0000-000000000012',
    'COS',
    'OPEN',
    now () - interval '8 days',
    'system',
    now (),
    NULL,
    'INSPECTION12'
  ),
  (
    'c0000000-0000-0000-0000-000000000013',
    'COS',
    'CLOSED',
    now () - interval '9 days',
    'system',
    now (),
    NULL,
    'INSPECTION13'
  ),
  (
    'c0000000-0000-0000-0000-000000000014',
    'COS',
    'OPEN',
    now () - interval '10 days',
    'system',
    now (),
    NULL,
    'INSPECTION14'
  ),
  (
    'c0000000-0000-0000-0000-000000000015',
    'COS',
    'OPEN',
    now () - interval '11 days',
    'system',
    now (),
    NULL,
    'INSPECTION15'
  ),
  (
    'c0000000-0000-0000-0000-000000000016',
    'COS',
    'CLOSED',
    now () - interval '12 days',
    'system',
    now (),
    NULL,
    'INSPECTION16'
  ),
  (
    'c0000000-0000-0000-0000-000000000017',
    'COS',
    'OPEN',
    now () - interval '13 days',
    'system',
    now (),
    NULL,
    'INSPECTION17'
  ),
  (
    'c0000000-0000-0000-0000-000000000018',
    'COS',
    'OPEN',
    now () - interval '14 days',
    'system',
    now (),
    NULL,
    'INSPECTION18'
  ),
  (
    'c0000000-0000-0000-0000-000000000019',
    'COS',
    'CLOSED',
    now () - interval '15 days',
    'system',
    now (),
    NULL,
    'INSPECTION19'
  ),
  (
    'c0000000-0000-0000-0000-000000000020',
    'COS',
    'OPEN',
    now () - interval '16 days',
    'system',
    now (),
    NULL,
    'INSPECTION20'
  ),
  (
    'c0000000-0000-0000-0000-000000000021',
    'COS',
    'OPEN',
    now () - interval '17 days',
    'system',
    now (),
    NULL,
    'INSPECTION21'
  ),
  (
    'c0000000-0000-0000-0000-000000000022',
    'COS',
    'CLOSED',
    now () - interval '18 days',
    'system',
    now (),
    NULL,
    'INSPECTION22'
  ),
  (
    'c0000000-0000-0000-0000-000000000023',
    'COS',
    'OPEN',
    now () - interval '19 days',
    'system',
    now (),
    NULL,
    'INSPECTION23'
  ),
  (
    'c0000000-0000-0000-0000-000000000024',
    'COS',
    'OPEN',
    now () - interval '20 days',
    'system',
    now (),
    NULL,
    'INSPECTION24'
  ),
  (
    'c0000000-0000-0000-0000-000000000025',
    'COS',
    'CLOSED',
    now () - interval '21 days',
    'system',
    now (),
    NULL,
    'INSPECTION25'
  ),
  (
    'c0000000-0000-0000-0000-000000000026',
    'COS',
    'OPEN',
    now () - interval '22 days',
    'system',
    now (),
    NULL,
    'INSPECTION26'
  ),
  (
    'c0000000-0000-0000-0000-000000000027',
    'COS',
    'OPEN',
    now () - interval '23 days',
    'system',
    now (),
    NULL,
    'INSPECTION27'
  ),
  (
    'c0000000-0000-0000-0000-000000000028',
    'COS',
    'CLOSED',
    now () - interval '24 days',
    'system',
    now (),
    NULL,
    'INSPECTION28'
  ),
  (
    'c0000000-0000-0000-0000-000000000029',
    'COS',
    'OPEN',
    now () - interval '25 days',
    'system',
    now (),
    NULL,
    'INSPECTION29'
  ) on conflict do nothing;