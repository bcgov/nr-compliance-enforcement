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
    ST_GeomFromText('POINT(-123.1207 49.2827)'),
    'INVESTIGATION1'
  ),
  (
    '66dd3a1f-4bc5-4758-a986-a664b8d8f201',
    'COS',
    'OPEN',
    now (),
    'system',
    now (),
    ST_GeomFromText('POINT(-123.3656 48.4284)'),
    'INVESTIGATION2'
  ),
  (
    '66dd3a1f-4bc5-4758-a986-a664b8d8f202',
    'COS',
    'OPEN',
    now (),
    'system',
    now (),
    ST_GeomFromText('POINT(-123.3656 48.4284)'),
    'INVESTIGATION3'
  ),
  (
    '66dd3a1f-4bc5-4758-a986-a664b8d8f203',
    'COS',
    'OPEN',
    now (),
    'system',
    now (),
    ST_GeomFromText('POINT(-123.3656 48.4284)'),
    'INVESTIGATION4'
  ) on conflict do nothing;
