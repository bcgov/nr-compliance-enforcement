-- Create case files for the investigations to be added to
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
  (
    '77dd3a1f-4bc5-4758-a986-a664b8d8f2ee',
    'COS',
    'OPEN',
    now (),
    'system',
    now ()
  ),
  (
    '77dd3a1f-4bc5-4758-a986-a664b8d8f2ef',
    'COS',
    'OPEN',
    now (),
    'system',
    now ()
  ),
  (
    '77dd3a1f-4bc5-4758-a986-a664b8d8f2ea',
    'COS',
    'OPEN',
    now (),
    'system',
    now ()
  ) on conflict do nothing;

-- Create test investigations
insert into
  investigation.investigation (
    investigation_guid,
    owned_by_agency_ref,
    investigation_status,
    investigation_opened_utc_timestamp,
    create_user_id,
    create_utc_timestamp
  )
values
  (
    '66dd3a1f-4bc5-4758-a986-a664b8d8f200',
    'COS',
    'OPEN',
    now (),
    'system',
    now ()
  ),
  (
    '66dd3a1f-4bc5-4758-a986-a664b8d8f201',
    'COS',
    'OPEN',
    now (),
    'system',
    now ()
  ),
  (
    '66dd3a1f-4bc5-4758-a986-a664b8d8f202',
    'COS',
    'OPEN',
    now (),
    'system',
    now ()
  ),
  (
    '66dd3a1f-4bc5-4758-a986-a664b8d8f203',
    'COS',
    'OPEN',
    now (),
    'system',
    now ()
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