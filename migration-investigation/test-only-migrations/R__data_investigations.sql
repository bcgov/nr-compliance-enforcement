-- Create test investigations
insert into
  investigation.investigation (
    investigation_guid,
    owned_by_agency_ref,
    investigation_status,
    investigation_opened_utc_timestamp,
    create_user_id,
    create_utc_timestamp,
    location_geometry_point,
    name
  )
values
  (
    '66dd3a1f-4bc5-4758-a986-a664b8d8f200',
    'COS',
    'OPEN',
    now (),
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.1207 49.2827)'),
    'INVESTIGATION1'
  ),
  (
    '66dd3a1f-4bc5-4758-a986-a664b8d8f201',
    'COS',
    'OPEN',
    now (),
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.3656 48.4284)'),
    'INVESTIGATION2'
  ),
  (
    '66dd3a1f-4bc5-4758-a986-a664b8d8f202',
    'COS',
    'OPEN',
    now (),
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.3656 48.4284)'),
    'INVESTIGATION3'
  ),
  (
    '66dd3a1f-4bc5-4758-a986-a664b8d8f203',
    'COS',
    'OPEN',
    now (),
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.3656 48.4284)'),
    'INVESTIGATION4'
  ),
  (
    'b0000000-0000-0000-0000-000000000005',
    'COS',
    'OPEN',
    now () - interval '1 day',
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.1207 49.2827)'),
    'INVESTIGATION5'
  ),
  (
    'b0000000-0000-0000-0000-000000000006',
    'COS',
    'OPEN',
    now () - interval '2 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.3656 48.4284)'),
    'INVESTIGATION6'
  ),
  (
    'b0000000-0000-0000-0000-000000000007',
    'COS',
    'CLOSED',
    now () - interval '3 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-122.9574 49.1666)'),
    'INVESTIGATION7'
  ),
  (
    'b0000000-0000-0000-0000-000000000008',
    'COS',
    'OPEN',
    now () - interval '4 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.0848 49.3043)'),
    'INVESTIGATION8'
  ),
  (
    'b0000000-0000-0000-0000-000000000009',
    'COS',
    'OPEN',
    now () - interval '5 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.1139 49.2609)'),
    'INVESTIGATION9'
  ),
  (
    'b0000000-0000-0000-0000-000000000010',
    'COS',
    'CLOSED',
    now () - interval '6 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.1207 49.2827)'),
    'INVESTIGATION10'
  ),
  (
    'b0000000-0000-0000-0000-000000000011',
    'COS',
    'OPEN',
    now () - interval '7 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.3656 48.4284)'),
    'INVESTIGATION11'
  ),
  (
    'b0000000-0000-0000-0000-000000000012',
    'COS',
    'OPEN',
    now () - interval '8 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-122.9574 49.1666)'),
    'INVESTIGATION12'
  ),
  (
    'b0000000-0000-0000-0000-000000000013',
    'COS',
    'CLOSED',
    now () - interval '9 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.0848 49.3043)'),
    'INVESTIGATION13'
  ),
  (
    'b0000000-0000-0000-0000-000000000014',
    'COS',
    'OPEN',
    now () - interval '10 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.1139 49.2609)'),
    'INVESTIGATION14'
  ),
  (
    'b0000000-0000-0000-0000-000000000015',
    'COS',
    'OPEN',
    now () - interval '11 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.1207 49.2827)'),
    'INVESTIGATION15'
  ),
  (
    'b0000000-0000-0000-0000-000000000016',
    'COS',
    'CLOSED',
    now () - interval '12 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.3656 48.4284)'),
    'INVESTIGATION16'
  ),
  (
    'b0000000-0000-0000-0000-000000000017',
    'COS',
    'OPEN',
    now () - interval '13 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-122.9574 49.1666)'),
    'INVESTIGATION17'
  ),
  (
    'b0000000-0000-0000-0000-000000000018',
    'COS',
    'OPEN',
    now () - interval '14 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.0848 49.3043)'),
    'INVESTIGATION18'
  ),
  (
    'b0000000-0000-0000-0000-000000000019',
    'COS',
    'CLOSED',
    now () - interval '15 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.1139 49.2609)'),
    'INVESTIGATION19'
  ),
  (
    'b0000000-0000-0000-0000-000000000020',
    'COS',
    'OPEN',
    now () - interval '16 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.1207 49.2827)'),
    'INVESTIGATION20'
  ),
  (
    'b0000000-0000-0000-0000-000000000021',
    'COS',
    'OPEN',
    now () - interval '17 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.3656 48.4284)'),
    'INVESTIGATION21'
  ),
  (
    'b0000000-0000-0000-0000-000000000022',
    'COS',
    'CLOSED',
    now () - interval '18 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-122.9574 49.1666)'),
    'INVESTIGATION22'
  ),
  (
    'b0000000-0000-0000-0000-000000000023',
    'COS',
    'OPEN',
    now () - interval '19 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.0848 49.3043)'),
    'INVESTIGATION23'
  ),
  (
    'b0000000-0000-0000-0000-000000000024',
    'COS',
    'OPEN',
    now () - interval '20 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.1139 49.2609)'),
    'INVESTIGATION24'
  ),
  (
    'b0000000-0000-0000-0000-000000000025',
    'COS',
    'CLOSED',
    now () - interval '21 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.1207 49.2827)'),
    'INVESTIGATION25'
  ),
  (
    'b0000000-0000-0000-0000-000000000026',
    'COS',
    'OPEN',
    now () - interval '22 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.3656 48.4284)'),
    'INVESTIGATION26'
  ),
  (
    'b0000000-0000-0000-0000-000000000027',
    'COS',
    'OPEN',
    now () - interval '23 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-122.9574 49.1666)'),
    'INVESTIGATION27'
  ),
  (
    'b0000000-0000-0000-0000-000000000028',
    'COS',
    'CLOSED',
    now () - interval '24 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.0848 49.3043)'),
    'INVESTIGATION28'
  ),
  (
    'b0000000-0000-0000-0000-000000000029',
    'COS',
    'OPEN',
    now () - interval '25 days',
    'system',
    now (),
    ST_GeomFromText ('POINT(-123.1139 49.2609)'),
    'INVESTIGATION29'
  ) on conflict do nothing;