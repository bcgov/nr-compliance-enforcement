-- reported by
INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'reprtdbycd',
    'RCMP',
    'LE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'reprtdbycd',
    'DFO',
    'DFO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'reprtdbycd',
    'NRO',
    'NRO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'reprtdbycd',
    'EPO',
    'EPO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'reprtdbycd',
    'Bylaw',
    'BYLAW',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'reprtdbycd',
    '911',
    '911',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'reprtdbycd',
    'RAPP email',
    'EMAILRAPP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'reprtdbycd',
    'COS HQ',
    'COS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'reprtdbycd',
    'BCWF',
    'BCWF',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'reprtdbycd',
    'Self',
    'SELF',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

-- geo organization unit
INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    '100 Mile House',
    '100MHHS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    '108 Mile Ranch',
    '108MLRNH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    '140 Mile House',
    '140MHHS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    '150 Mile House',
    '150MHHS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    '16 Mile',
    '16MIL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    '40 Mile Flats',
    '40MLFLTZ',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    '70 Mile House',
    '70MLHS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Abbotsford',
    'ABTFRD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Adams Lake',
    'ADMSLKHS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Agassiz',
    'AGSSZHS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Ahousat',
    'AHST',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Ainsworth',
    'ANSWRTH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Aiyansh',
    'AYNSH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Albert Canyon',
    'ALBRTCNY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Albion',
    'ALBION',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Aldergrove',
    'ALDRGRV',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Alert Bay',
    'ALRTBAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Alexandria',
    'ALXNDRIA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Alexis Creek',
    'ALXSCRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Aleza Lake',
    'ALZLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Alice Arm',
    'ALCRM',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Alkali Lake',
    'ALKLLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Alkali Lake (IR)',
    'ALKLLKIR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Alkali Reserve',
    'ALKLLKRV',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Alliford Bay',
    'ALLFRDBY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Altona',
    'ALTONA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Alvin',
    'ALVIN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Anaham (IR)',
    'ANAHAMIR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Anahim Indian Reserve',
    'ANAHIMIR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Anahim Lake',
    'ANHMLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Anchoragein',
    'ANCRGIN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Anglemont',
    'ANGLMNT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Anmore',
    'ANMR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Appledale',
    'APPDLE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Applegrove',
    'APPGRV',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Argenta',
    'ARGENT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Armstrong',
    'ARMSTRNG',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Arras',
    'ARRAS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Arrow Park',
    'ARRWPK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Arrowhead',
    'ARRWHD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Ashcroft',
    'ASHCROF',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Ashton Creek',
    'ASHTNCRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Aspen Grove',
    'ASPNGRV',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Athalmer',
    'ATHALMR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Atlin',
    'ATLN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Attachie',
    'ATTACHI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Avola',
    'AVOLA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Baldonell',
    'BALDNLL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Balfour',
    'BALFOUR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bamfield',
    'BAMFELD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bankier',
    'BNKIER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Barkerville',
    'BARKRVLL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Barriere',
    'BARRIR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Baynes Lake',
    'BAYNSLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bear Flats',
    'BRFLTS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bear Lake',
    'BRLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bear Mountain',
    'BRMTN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Beaton',
    'BEATON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Beattie',
    'BEATIE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Beaver Cove',
    'BVRCV',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Beaver Creek',
    'BVRCRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Beaver Valley',
    'BVRVLY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Beaverdam Lake',
    'BVDMLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Beaverdell',
    'BVRRDL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Beaverly',
    'BVRLLY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bednesti Lake',
    'BDNSTLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Belcarra',
    'BELCARR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bell II North',
    'BLLIINR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bell II South',
    'BLLIISH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bella Bella',
    'BLLABELA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bella Coola',
    'BLLACOOL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Berkin',
    'BERKIN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Beryl Prairie',
    'BRYLPRR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bessborough',
    'BSSBRRGH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Big Bar',
    'BIGBAR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Big Bar Lake',
    'BIGBRLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Big Creek',
    'BIGCRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Big Lake',
    'BIGLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Big White',
    'BIGWHIT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Birch Island',
    'BRISLD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Birken',
    'BRKN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Birkenhead Estates',
    'BRKHES',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Birkenhead Estates - (Whistler)',
    'BRKHES-W',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Black Creek',
    'BLKCRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Black Mountain',
    'BLKMTN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Black Pines',
    'BLKPNS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Black Point',
    'BLKPT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Black Pool',
    'BLKPL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Black Tusk Village',
    'BLKTSK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Blackwater',
    'BLKWT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Blaeberry',
    'BLBRY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Blewett',
    'BLEWT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Blind Bay',
    'BLDBY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bliss Landing',
    'BLSLDG',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Blubber Bay',
    'BLBBAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Blue River',
    'BLURVR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Blueberry',
    'BLUBRY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Blueberry Creek',
    'BLUBYCRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bob Quinn',
    'BBQNN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bonaparte Lake',
    'BNPRTLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bonnington',
    'BNNNGTN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Boston Bar',
    'BSTNBR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Boswell',
    'BSWLL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bouchie Lake',
    'BCHLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bowen Island',
    'BWNISL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bowron Lake',
    'BWROLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bowser',
    'BWSR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Brackendale',
    'BRCKNDL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bralorne',
    'BRLRN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Brennan Creek',
    'BRNANCRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Briar Ridge',
    'BRIRRDG',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bridesville',
    'BRDSL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bridge Lake',
    'BRDGLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Brilliant',
    'BRLNT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Brisco',
    'BRS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Brisco - South',
    'BRSS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Brittania Beach',
    'BRT BCH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Brookmere',
    'BRKMRE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Buckhorn',
    'BCKHRN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Buckinghorse',
    'BCKNGHRS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Buckley Bay',
    'BCKLYBY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Buffalo Creek',
    'BFFLCRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Buick Creek',
    'BKCRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bull River',
    'BLLRVR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Burnaby',
    'BURNBY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Burns Lake',
    'BURNLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Burton',
    'BRTN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Bute Inlet',
    'BTEINLT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Butedale/Princess Royal Island',
    'BTDLPRIN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cache Creek',
    'CCHCRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Caesar''s Landing',
    'CSSRSLDG',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cambie',
    'CMB',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Camborne',
    'CMRNE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Campbell River',
    'CMBLRV',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Canal Flats',
    'CNLFLTS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Canim Lake',
    'CNMLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Canoe Creek (100 Mile)',
    'CNCR100M',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Canoe Creek (Salmon Arm)',
    'CNCRKSA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Canyon',
    'CYN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Canyon City - Gitwinksihlkw',
    'GTWKSLKTRC',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Carcross (Yukon)',
    'CRCRSSYK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Carmi',
    'CRMI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Casino',
    'CNO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cassiar',
    'CSSR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cassidy',
    'CSSDY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Castle River',
    'CTSRVR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Castlegar',
    'CSTLGR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cawston',
    'CWSTN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Caycuse',
    'CYCS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cecil Lake',
    'CSLLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cedar',
    'CDR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cedarvale',
    'CDRVL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Celista',
    'CLSTA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Central Saanich',
    'CNTLSNSH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Centreville',
    'CNTRVL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Chain Lake',
    'CHNLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Charlie Lake',
    'CHRLLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Charlotte City',
    'CHRLTCTY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Chase',
    'CHSE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Chehalias First Nation',
    'CHHLFSTN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Chemainus',
    'CHMNUS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cherry Creek',
    'CHRYCRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cherryville',
    'CHRYVLLE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Chetwynd',
    'CHETWND',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Chief Lake',
    'CHFLAKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Chilako/Mud River',
    'CHLKOMUD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Chilanko Forks',
    'CHLNKFRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Chilko Lake',
    'CHLKLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Chilliwack',
    'CHILLIWK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Christian Valley',
    'CHRSTVAL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Christina Lake',
    'CHRSTNAL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Chuchua',
    'CHCHUA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cinema',
    'CINEMA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Clairmont',
    'CLAIRMNT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Clanwilliam',
    'CLNWLM',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Clayhurst',
    'CLAYHRST',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Clearbrook',
    'CLRBRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Clearwater',
    'CLRWTR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Clemretta',
    'CLEMRTA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Clinton',
    'CLINTON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cloverdale',
    'CLOVRDLE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Clucluz Lake - Brookside Resort West',
    'CLCZLKBW',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cluculz Lake',
    'CLUCLZLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Coal Harbour',
    'COALHARB',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Coal River',
    'COALRIVR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Coalmont',
    'COALMONT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cobble Hill',
    'COBBLHIL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Coldstream',
    'CLDSTRM',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Colleymount',
    'CLLYMNT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Columbia Valley',
    'CLMBVLLY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Columere',
    'CLUMERE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Colwood',
    'CLWOOD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Comox',
    'COMOX',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Contact Creek',
    'CONTCTCK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cook Bay',
    'COOKBAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Coombs',
    'COOMBS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cooper Creek',
    'COOPRCRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Coquitlam',
    'COQUITLM',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cortes Island',
    'CRTSISLD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cottonwood',
    'COTNWOD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Coursier Lake',
    'CRSRLAKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Courtenay',
    'COURTNY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cowichan Bay',
    'CWCHNBY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cowichan Valley',
    'CWCHNVLY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Coyote Creek',
    'COYOTECR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Craig Park',
    'CRAIGPRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Craigellachie',
    'CRGLLACH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cranberry',
    'CRANBRRY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cranbrook',
    'CRANBRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Crawford Bay',
    'CRWFRDBY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Crescent Spur',
    'CRSNTSPR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Crescent Valley',
    'CRSNTVLY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Creston',
    'CRESTON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Crofton',
    'CROFTON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Croyden',
    'CROYDEN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Crystal Lake',
    'CRYSTLLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Crystal Mountain',
    'CRYSTLMN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cultus Lake',
    'CULTSLKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Cumberland',
    'CMBRLAND',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Daajing Giids (Queen Charlotte City)',
    'QUEENCHA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Danskin',
    'DANSKIN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'D''Arcy',
    'DARCY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Darfield',
    'DARFIELD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Davis Bay',
    'DAVISBAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Dawson Creek',
    'DAWSONCR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Dawsons Landing',
    'DAWSONSL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Dease Lake',
    'DEASELAK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Decker Lake',
    'DECKERLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Deep Bay',
    'DEEPBAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Deep Creek (Near Salmon Arm)',
    'DEEPCRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Deep Creek (Near Williams Lake)',
    'DEEPCRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Deer Park',
    'DEERPRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Deka Lake',
    'DEKALAKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Del Rio',
    'DELIO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Delta',
    'DELTA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Denman Island',
    'DENMANIS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Deroche',
    'DEROCHE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Desolation Sound',
    'DESOLATN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Devine',
    'DEVINE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Dewdney',
    'DEWDNEY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Dinan Bay',
    'DINANBAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Doe River',
    'DOERIVER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Dog Cr. (IR)',
    'DOGCRIR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Doig',
    'DOIG',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Dome Creek/Cresent Spur',
    'DOMECRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Donald',
    'DONALD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Douglas Lake',
    'DGLSLAKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Downie Creek',
    'DOWNIECR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Duncan',
    'DUNCAN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Dunkley',
    'DUNKLEY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Dunster',
    'DUNSTER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Durieu',
    'DURIEU',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Eagle Bay',
    'EAGLEBAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Eagle Creek',
    'EAGLECRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Earls Cove',
    'EARLSCOV',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'East Cracroft Island',
    'ECRACRFT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'East Francois Lake',
    'EFRANCLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'East Gate',
    'EASTGATE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'East Pine',
    'EASTGTE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'East Pine (portion West of Pine River)',
    'EASTPINE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'East slope Pine Pass (almost to Azouetta Lake)',
    'ESPINEPW',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'East Sooke',
    'ESLOPPPP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'East Thurlow Island',
    'EASTSKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Eastgate',
    'ETHURLOW',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Edgewater',
    'EDGEWATER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Edgewood',
    'EDGEWOOD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Egmont',
    'EGMONT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Elk Bay',
    'ELKBAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Elkford',
    'ELKFORD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Elko',
    'ELKO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Elsworth Camp',
    'ELSWTHCP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Emmonds Island',
    'EMMDSISL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Empire Valley',
    'EMPRVALY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Endako',
    'ENDAKO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Enderby',
    'ENDERBY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Erickson',
    'ERICKSON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Erie',
    'ERIE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Errington',
    'ERRINGTN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Esquimalt',
    'ESQUIMAL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fairmont',
    'FAIRMONT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fairview',
    'FAIRVIEW',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Falkland',
    'FALKLAND',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fanny Bay',
    'FANNYBAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Farmington',
    'FARMINGT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Farrell Creek',
    'FARRELLC',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Faulder',
    'FAULDER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fauquier',
    'FAUQUIER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fellers Heights',
    'FELLERHT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Ferguson',
    'FERGUSON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Ferndale',
    'FERNDALE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fernie',
    'FERNIE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Finmore',
    'FINMORE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fintry',
    'FINTRY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fireside',
    'FIRESIDE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Firvale',
    'FIRVALE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Flat Rock',
    'FLATROCK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Forest Grove',
    'FORSTGRV',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Forestdale',
    'FORESTDL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fort Babine',
    'FTBABINE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fort Fraser',
    'FORTFRSR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fort Langley',
    'FTLANGLE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fort Nelson',
    'FTNELSON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fort St. James',
    'FTSTJAME',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fort St. John',
    'FTSTJOHN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fort Steele',
    'FTSTEELE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fort Ware',
    'FTWARE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fortress Lake',
    'FTRESSLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fosthall &amp; South',
    'FOSTHS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Francis Peninsula',
    'FRANPENI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Francois Lake',
    'FRNCSLK1',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fraser',
    'FRASER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fraser Lake',
    'FRASERLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fredrick Arm',
    'FREDRMCA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Friendly Lake',
    'FRIENDLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Frosthall And South',
    'FOSTHS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Fruitvale',
    'FRUITVAL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Gabriola Island',
    'GABRIOLAI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Galena Bay',
    'GALENABAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Galiano Island',
    'GALIANOI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Galloway',
    'GALLOWAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Gambier Island',
    'GAMBIERI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Gang Ranch',
    'GANGRANCH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Ganges',
    'GANGES',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Garden Bay',
    'GARDENBY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Garnet Valley',
    'GARNETVL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Genelle',
    'GENELLE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Georgetown Mills',
    'GEORGEMI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Germanson Landing',
    'GERMANSO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Gerrard',
    'GERRARD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Gibsons',
    'GIBSONS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Gillies Bay',
    'GILLIESB',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Giscome',
    'GISCOME',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Giscome/Willow River',
    'GISCOMEW',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Gitanyow',
    'GITANYOW',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Gitwangak',
    'GITWANGA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Glade',
    'GLADE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Gladwin',
    'GLADWIN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Glenannan',
    'GLENANNA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Glendale Cove',
    'GLENDACO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Glenora',
    'GLENORA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Glenrosa',
    'GLENROSA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Glenvowell',
    'GLENVOWL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Gold Creek',
    'GOLDCREK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Gold River',
    'GOLDRIVR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Goldbridge',
    'GOLDBRID',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Golden',
    'GOLDEN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Good Hope',
    'GOODHOPE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Good Hope Lake',
    'GOODHOPL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Goodlow',
    'GOODLOW',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Grand Forks',
    'GRANDFOR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Granisle',
    'GRANISLE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Granthams Landing',
    'GRANTHMS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Grasmere',
    'GRASMERE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Grassy Plains',
    'GRASPLNS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Gray Creek',
    'GRAYCREE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Grease Harbour/Nass Camp',
    'GRSEHRBR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Greely',
    'GREELY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Green Lake - Lillooet',
    'GREENLLO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Green Lake -70 Mile',
    'GREENL70',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Greendale',
    'GREENDAL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Greenville - Laxgalts''ap',
    'GREENVLE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Greenwood',
    'GREENWOD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Griffin Lake',
    'GRIFFNLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Grindrod',
    'GRINDROD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Groundbirch',
    'GROUNDBR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Gun Lake',
    'GUNLAKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Gundy',
    'GUNDY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Hagensborg',
    'HAGENSBG',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Haida Gwaii',
    'HAIDAGWA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Haines Junction',
    'HAINESJU',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Halfmoon Bay',
    'HALFMNB',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Halfway River First Nation',
    'HALFWYRF',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Halls',
    'HALLS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Hammer Lake',
    'HAMMERLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Hammond',
    'HAMMOND',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Hanceville',
    'HANCEVLE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Haney',
    'HANEY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Hansard/Upper Fraser',
    'HANSARDU',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Hardwicke Island',
    'HARDWCKI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Harrison Hot Springs',
    'HARHOTSP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Harrison Lake',
    'HARSLAKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Harrison Mills',
    'HARSMILS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Harrogate',
    'HARROGAT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Harrop',
    'HARROP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Hartley Bay',
    'HARTLYBY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Hasler Flats',
    'HASLERFL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Hat Creek',
    'HATCREEK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Hatzic',
    'HATZIC',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Hazelton',
    'HAZELTON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Hedley',
    'HEDLEY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Heffley Creek',
    'HEFFLCKR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Heffley Lake',
    'HEFFLLAK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Helmet Gas Field',
    'HELMTGAS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Highlands',
    'HIGHLAND',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Highlands Valley',
    'HIGHLAVL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Hills',
    'HILLS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Hixon',
    'HIXON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Holberg',
    'HOLBERG',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Homes River',
    'HOMESRVR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Honeymoon Bay',
    'HNMNBAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Hope',
    'HOPE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Hornby Island',
    'HORNBYIS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Horne Lake',
    'HORNELAK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Horsefly',
    'HORSEFLY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Horseshoe Bay',
    'HORSHOEB',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Hosmer',
    'HOSMER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Hot Springs Cove',
    'HOTSPRCV',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Hotham Sound',
    'HOTHAMS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Houston',
    'HOUSTON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Howser',
    'HOWSER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Hudson''s Hope',
    'HUDSONSH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Hyde Creek',
    'HYDECREE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Illecillewaet',
    'ILLECILL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Indian Arm',
    'INDIANAR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Invermere',
    'INVERMER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Ioco',
    'IOCO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Irvines Landing',
    'IRVSLAND',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Iskut',
    'ISKUT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Isle Pierre',
    'ISLPIERR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Jackfish Lake',
    'JACKFSLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Jade City',
    'JADECITY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Jaffray',
    'JAFFRAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Jesmond',
    'JESMOND',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Joe Rich',
    'JOERICH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Johnsons Landing',
    'JOHNSNLG',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Jordan River',
    'JORDNRVR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Juskatla',
    'JUSKATLA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kaleden',
    'KALEDEN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kamloops',
    'KAMLOOPS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kanaka Bar',
    'KANAKABR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kaslo',
    'KASLOBC',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Keats Island',
    'KEATSISL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kelly Creek',
    'KELLYCRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kelly Lake',
    'KELLYLAK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kelowna',
    'KELOWNA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kelsey Bay',
    'KELSEYBY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kemano',
    'KEMANO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kemess Mine',
    'KEMESSMN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kent',
    'KENT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Keremeos',
    'KEREMEOS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kersley',
    'KERSLEY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kildonan',
    'KILDONAN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kilkerran',
    'KILKERRN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Killiney Beach',
    'KILLNYBC',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kimberley',
    'KIMBERLY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kinabasket Lake',
    'KINABSKT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kincolith - Ginglox',
    'KINCOLTH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kingcome Inlet',
    'KNGCOMEI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kingfisher',
    'KINGFSHR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kingsgate',
    'KINGSGTE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kingsvale',
    'KINGSVAL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kispiox',
    'KISPIOX',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kitchener',
    'KITCHNRR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kitimaat Village, I.R.',
    'KITIMAAT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kitimat',
    'KITIMAT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kitkatla I.R.',
    'KITKATLA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kitsault',
    'KITSAULT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kitseguecla',
    'KITSGCLA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kitwancool',
    'KITWANCL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kitwanga',
    'KITWANGA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kleanza',
    'KLEANZA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kleena Kleene',
    'KLEENAKL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Klemtu',
    'KLEMTU',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kluskus',
    'KLUSKUS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Knouff Lake',
    'KNOUFFLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Knutsford',
    'KNUTSFOR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kootenay Bay',
    'KOOTNAYB',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Krestova',
    'KRESTOVA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kuper Island',
    'KUPERISL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kuskanook',
    'KUSKANOK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Kyuquot',
    'KYUQUOT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lac Des Roche',
    'LACDSRCH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lac Des Roches',
    'LACDSRHS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lac La Hache',
    'LACLACHE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lac Le Jeune',
    'LACLEJUN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Ladner',
    'LADNERBC',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Ladysmith',
    'LADYSMTH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lake Country (Winfield was the original name)',
    'LAKECNRY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lake Cowichan',
    'LKECOWCH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lake Errock',
    'LKEEROCK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lake Revelstoke',
    'LKEREVS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lakelse Lake',
    'LAKELSEK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lang Bay',
    'LANGBAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Langdale',
    'LANGDALE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Langford',
    'LANGFORD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Langley',
    'LANGLEY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lantzville',
    'LANTZVIL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lardeau',
    'LARDEAU',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lasqueti Island',
    'LASQUETI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lauretta',
    'LAURETTA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lavington',
    'LAVINGTON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lawn Hill',
    'LAWNHILL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lebahdo',
    'LEBAHDO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lemoray',
    'LEMORAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Liard Hot Springs',
    'LIARDHSP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Liard River',
    'LIARDRVR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Likely',
    'LIKELY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lillooet',
    'LILLOOET',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lillooet Lake (Pemberton Area)',
    'LILLOLTK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lindell Beach',
    'LINDELLB',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lions Bay',
    'LIONSBAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lister',
    'LISTER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Little Fort',
    'LITTLEFT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Logan Lake',
    'LOGNLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lone Butte',
    'LONEBTTE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lone Prairie',
    'LONEPRAR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Longworth',
    'LONGWORT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Loon Lake',
    'LOONLAKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Loos',
    'LOOS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Loughborough Inlet',
    'LOUGHBOR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Louise Creek',
    'LOUISECR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lovell Cove',
    'LOVELLCO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lower Nicola',
    'LOWERNIC',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lower Post',
    'LOWERPOS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lumby',
    'LUMBY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lund',
    'LUND',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Lytton',
    'LYTTONBC',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Mabel Lake',
    'MABELLAK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Machete Lake',
    'MACHETEL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Mackenzie',
    'MACKENZI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Madeira',
    'MADEIRA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Madeira Park',
    'MADEIRAP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Mahood Falls',
    'MAHOODFA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Malakwa',
    'MALAKWA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Manning Park',
    'MANNINGP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Manson Creek',
    'MANSONCR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Maple Bay',
    'MAPLEBAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Maple Ridge',
    'MAPLERID',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Mara',
    'MARA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Mara Lake',
    'MARALAKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Marguerite',
    'MARGUERI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Marguerite (but not Marguerite IR - Quesnel)',
    'MARGNTIR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Margurite Indian Reserve',
    'MARGIR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Martin Valley',
    'MARTINVA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Marysville',
    'MARYSVIL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Masset',
    'MASSET',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Matsqui',
    'MATSQUI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Mayne Island',
    'MAYNEISL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Mayook',
    'MAYOOK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'McBride',
    'MCBRIDE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Mcculloch',
    'MCCULLOC',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Mcgregor',
    'MCGREGOR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Mckinley Landing',
    'MCKINLEY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'McLeese Lake',
    'MCLEESEL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Mcleod Lake',
    'MCLEODLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'McLure',
    'MCLURE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'McMurdo',
    'MCMURDO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Meadow Creek',
    'MEADOWCR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Meadow Lake',
    'MEADWLAK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Meadowbrook',
    'MEADOWBK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Meldrum Creek',
    'MELDRUMC',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Merritt',
    'MERRITT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Merville',
    'MERVILLE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Mesachie Lake',
    'MESACHLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Messezula Lake',
    'MESSEZLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Metakatla',
    'METAKATL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Metchosin',
    'METCHOSI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Meziadin Junction',
    'MEZIADIN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Mica',
    'MICACREK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Mica Creek',
    'MICACREK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Middlepoint',
    'MIDDLEPT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Midway',
    'MIDWAYBC',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Mile 62.5',
    'MILE625',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Mill Bay',
    'MILLBAYB',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Miller Creek',
    'MILLERCK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Minstrel Island',
    'MINSTREL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Miocene',
    'MIOCENE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Mirror Lake',
    'MIRRLAKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Mission',
    'MISSION',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Miworth',
    'MIWORTH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Moberly Lake',
    'MOBERLYL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Monte Creek',
    'MONTECRE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Monte Lake',
    'MONTELAK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Monticola Lake',
    'MONTICLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Montney',
    'MONTNEYB',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Montrose',
    'MONTROSE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Moricetown',
    'MORICETN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Morrisey',
    'MORRISEY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Mount Currie',
    'MOUNTCUR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Mount Robison',
    'MOUNTROB',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Moyie',
    'MOYIE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Muncho Lake',
    'MUNCHOLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Muskwa Heights',
    'MUSKWHTS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Myrtle Creek',
    'MYRTLCRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Myrtle Point',
    'MYRTLPT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Naden Harbour',
    'NDNHA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Nahun',
    'NAHUN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Nakusp',
    'NAKUSP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Namu',
    'NAMU',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Nanaimo',
    'NANAIMO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Nanoose Bay',
    'NANOBAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Naramata',
    'NARAMA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Nass Camp',
    'NASCA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Nazko',
    'NAZKO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Needles',
    'NEEDL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Nelson',
    'NELSON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Nelson Island',
    'NELISL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Nelway',
    'NELWA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Nemaiah (IR)',
    'NEMAIIR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Nemia Valley',
    'NEMIAVLY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Ness Lake',
    'NESSLAK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'New Aiyansh',
    'NEWAIYA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'New Denver',
    'NEWDEN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'New Hazelton',
    'NEWHAZ',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'New Remo',
    'NEWREMO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'New Westminster',
    'NEWWEST',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Newgate',
    'NEWGAT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Newlands',
    'NEWLAN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Nicholson',
    'NICHOLN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Nicola Reserve',
    'NICORES',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Nicomen Reserve',
    'NICORES2',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Nimpo Lake',
    'NIMPOLAK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Nitinat',
    'NITINA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Nootka Island',
    'NOOTISL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'NoraLee',
    'NORALEE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'North Bend',
    'NORBEN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'North Bonaparte',
    'NORBON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'North Cowichan',
    'NORCOWI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'North Pender Island',
    'NPENDER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'North Pine',
    'NORPINE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'North Saanich',
    'NORSAAN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'North Vancouver',
    'NORVAN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Nukko Lake',
    'NUKKOLA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Oak Bay',
    'OAKBAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Oasis',
    'OASIS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Ocean Falls',
    'OCEAFAL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Okanagan Centre',
    'OKACEN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Okanagan Falls',
    'OKAFALLS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Okanagan Landing',
    'OKALAND',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Okeover Inlet',
    'OKEOVER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Olalla',
    'OLALLA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Old Hazelton',
    'OLDHZLTN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Old Masset',
    'OLDMASST',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Old Remo',
    'OLDREMO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Old Townsite',
    'OLDTWNST',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Oliver',
    'OLIVER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'One Island Lake',
    'ONEISLLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Oona River (Porcher Island)',
    'OONARVR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Ootischenia',
    'OOTISCH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Ootsa Lake',
    'OOTSALAK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Opistat',
    'OPISTAT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Osoyoos',
    'OSOYOOS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Osprey Lake',
    'OSPREYLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Oweekeno',
    'OWEEKENO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Oyama',
    'OYAMA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Oyster Bay',
    'OYSTERBY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Oyster River',
    'OYSTERRV',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Palling',
    'PALLING',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Panorama',
    'PANORAMA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Parker Cove',
    'PARKCOVE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Parkland',
    'PARKLAND',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Parksville',
    'PARKSVLE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Parson',
    'PARSON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Pass Creek',
    'PASSCREE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Passmore',
    'PASSMORE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Patterson',
    'PATTERSN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Pavillion',
    'PAVILLON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Peachland',
    'PEACHLND',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Peejay',
    'PEEJAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Pemberton',
    'PEMBERTN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Pendelton Bay',
    'PENDLTNB',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Pender Harbour',
    'PENDHARB',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Pender Island',
    'PENDERIS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Penny',
    'PENNY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Penticton',
    'PENTICTN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Phillips Arm',
    'PHILLIPS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Pilot Bay',
    'PILOTBAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Pilot Mountain',
    'PILOTMTN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Pinatan Lake',
    'PINATNLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Pinche',
    'PINCHE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Pinchi Reserve',
    'PINCHIRS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Pine Valley',
    'PINEVLLY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Pinecrest',
    'PINECRST',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Pineview',
    'PINEVIEW',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Pink Mountain',
    'PNKMOUNT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Pit Polder',
    'PITPOLDER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Pitt Meadows',
    'PITTMDWS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Playmor Junction',
    'PLAYMJCT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Pleasant Camp',
    'PLSNTCMP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Popkum',
    'POPKUM',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Porcher Island',
    'PORCHERI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Port Alberni',
    'PORTALBR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Port Alice',
    'PORTALIC',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Port Clements',
    'PORTCLEM',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Port Coquitlam',
    'PORTCOQ',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Port Douglas',
    'PORTDOUG',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Port Edward',
    'PORTEDWRD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Port Essington',
    'PORTESG',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Port Hardy',
    'PORTHRDY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Port McNeill',
    'PORTMCNL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Port Mellon',
    'PORTMELN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Port Moody',
    'PORTMDY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Port Neville',
    'PORTNEVL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Port Renfrew',
    'PORTRENF',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Port Simpson',
    'PORTSIMP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Portage Reserve',
    'PORTAGER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Porto Rico',
    'PORTRICO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Pouce Coupe',
    'POUCOUP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Powder King',
    'POWDERKG',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Powell River',
    'POWELLRV',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Prespatou',
    'PRESPATU',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Pressy Lake',
    'PRESSYLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Prevost Island',
    'PREVOSTI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Prince George',
    'PRINGEOR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Prince Rupert',
    'PRINCRUP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Princeton',
    'PRINCETN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Pritchard',
    'PRITCHRD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Proctor',
    'PROCTOR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Progress',
    'PROGRESS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Prophet River',
    'PROPHETR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Puntzi',
    'PUNTZI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Purden Lake',
    'PURDENLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Quadra Island',
    'QUADRAIS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Qualicum Bay',
    'QLICMBAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Qualicum Beach',
    'QLICMBCH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Quatsino',
    'QUATSINO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Quesnel',
    'QUESNEL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Quesnel Forks',
    'QUESFORK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Quilchena',
    'QUILCHNA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Radium Hot Springs',
    'RADHOTSP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Raspberry',
    'RASPBRRY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Rayleigh',
    'RAYLEIGH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Read Island',
    'READISLD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Red Lake',
    'REDLAKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Red Pass',
    'REDPASS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Redfern Lake (Mile 178)',
    'REDFERNL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Redrock/Stoner',
    'RRSTONER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Redstone (IR)',
    'REDSTON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Reid Lake',
    'REIDLAKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Renata',
    'RENATA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Revelstoke',
    'REVELSTO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Richmond',
    'RICHMOND',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Riondel',
    'RIONDEL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Riske Creek',
    'RISKECRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Riverdale',
    'RIVERDAL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Roberts Creek',
    'ROBERTSC',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Roberts Lake',
    'ROBERTSL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Robson',
    'ROBSON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Rock Bay',
    'ROCKBAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Rock Creek',
    'ROCKCRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Roe Lake',
    'ROELAKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Rolla',
    'ROLLA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Roosville',
    'ROOSVLL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Rose Lake',
    'ROSELAK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Rose Prairie',
    'ROSEPRR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Rosebery',
    'ROSEBRY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Rosedale',
    'ROSEDALE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Rosen Lake',
    'ROSENLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Rossland',
    'ROSSLND',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Rosswood',
    'ROSSWOD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Royston',
    'ROYSTON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Ruskin',
    'RUSKINN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Rutland',
    'RUTLAND',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Rykerts',
    'RYKERTS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Saanich',
    'SAANICH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sahtlam',
    'SAHTLAM',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Salmo',
    'SALMO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Salmon Arm',
    'SALMARM',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Salmon Valley',
    'SALMNVY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Salt Spring Island',
    'SALTSPR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Saltery Bay',
    'SALTERYB',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sanca',
    'SANCA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sandon',
    'SANDON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sandspit',
    'SANDSPIT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sandy Hook',
    'SNDYHK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sardis',
    'SARDIS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Saturna Island',
    'SATRNAI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Savary Island',
    'SAVARYIS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Savona',
    'SAVONA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sayward',
    'SAYWARD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Scotch Creek',
    'SCTCHCRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sechelt',
    'SECHELT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Secret Cove',
    'SCRTOCV',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Selma Park',
    'SELMAPRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Seton Portage',
    'SETONPOR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sewell Inlet',
    'SEWELLIN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Seymour Arm',
    'SEYMOURA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Seymour Lakes',
    'SEYMOURL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Shalalth',
    'SHALALTH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sharpe Lake',
    'SHARPELK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Shawnigan Lake',
    'SHWNIGN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Shearer Dale',
    'SHRERDAL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Shell - Glen',
    'SHELLGLN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Shelter Bay',
    'SHELTRBY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sheridan Lake',
    'SHERIDN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Shoreacres',
    'SHOREACR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Shoreholm',
    'SHOREHLM',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Shutty Bench',
    'SHUTTYBN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sicamous',
    'SICAMOUS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sidney',
    'SIDNEY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sikanni (Mile 171)',
    'SIKANNI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Silverdale',
    'SLVRDALE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Silverton',
    'SLVRTN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sinclair Mills',
    'SINCLRM',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sirdar',
    'SIRDAR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Six Mile Point',
    'SIXMILPT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Skeetchestn',
    'SKEETCHE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Skidegate Landing',
    'SKIDGATL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Skidegate Reserve',
    'SKIDEGTR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Skookumchuck',
    'SKOOKUMC',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sliammon',
    'SLIAMMON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Slocan',
    'SLOCAN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Slocan Park',
    'SLOCNPRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Smith River',
    'SMITHRVR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Smithers',
    'SMITHERS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Soda Cr. (IR)',
    'SODACRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sointula',
    'SOINTULA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sonora Island',
    'SONORAI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sooke',
    'SOOKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sorrento',
    'SORRENTO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'South Dawson',
    'SDWNSN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'South Hazelton',
    'SHZLTON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'South Pender Island',
    'SPNDRILN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'South Slocan',
    'STHSLCN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'South Slocan (northern part of town)',
    'STHSLCNN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'South Taylor',
    'STHTYLR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Southbank',
    'STHBNK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Southview',
    'STHVW',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Spallumcheen',
    'SPALLMCHN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sparwood',
    'SPRWOOD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Spences Bridge',
    'SPNCESBR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Spillimacheen',
    'SPLLMCHN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Spring House',
    'SPRNHOUS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Spuzzum',
    'SPUZZUM',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Squamish',
    'SQUMISH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Stave Falls',
    'STAVFLS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Stealhead',
    'STALHEAD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Steamboat',
    'STMBOAT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Steelhead',
    'STELHEAD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Stewart',
    'STWART',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Stillwater',
    'STLLWTR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Stone (IR)',
    'STONEIR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Strathnaver',
    'STRTHNVR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Streatham',
    'STRTHAM',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Stuart Island',
    'STUARTIL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Stuie',
    'STUIE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Stump Lake',
    'STUMPLAK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sugar Cane (IR)',
    'SUGARCIR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Summerland',
    'SMRLAND',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Summit Lake',
    'SMITLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Summit Lake (Provincial Park)',
    'SMITLKPP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sun Peaks',
    'SNPEAKS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sunset Prairie',
    'SNSTPRAR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Surrey',
    'SURRY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Swan Lake (Provincial Park)',
    'SWNLKPP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Swan Lake/Kispiox River (Provincial Park)',
    'SWNLKKRP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Sweetwater',
    'SWTWATR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tabor',
    'TABOR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tachie Reserve',
    'TACHIRSV',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Taft',
    'TAFT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Taghum',
    'TAGHUM',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tahsis',
    'TAHSIS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Takla Landing',
    'TKLALNDG',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Takysie Lake',
    'TKYSLAKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tappen',
    'TAPPEN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tarrys',
    'TARRYS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'TaTa Creek',
    'TATACRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tatla Lake',
    'TATLALAK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tatlayoko Lake',
    'TATLYOKO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Taweel Lake',
    'TAWELK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Taylor',
    'TAYLOR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tchesinkut Lake',
    'TCHSNKUT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Telegraph Cove',
    'TGRPHCOV',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Telegraph Creek',
    'TGRPHCRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Telkwa',
    'TELKWA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Terrace',
    'TERRACE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tete Jaune',
    'TTJUNE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Texada Island',
    'TEXADAIS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Theodosia Inlet',
    'THDSAINL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Thetis Island',
    'THETISIS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Thompson Sound',
    'THMPSNSD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Three Valley Gap/Lake',
    'THRVALGP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Thrums',
    'THRUMS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tie Lake',
    'TIELAKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tintagel',
    'TINTAGEL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tlell',
    'TLELL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Toad River',
    'TOADRVR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Toba Inlet',
    'TOBAINLT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tofino',
    'TOFINO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tomslake',
    'TOMSLAKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Topley',
    'TOPLEY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Topley Landing',
    'TOPLND',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tortoise Lake',
    'TRTSLAKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tower Lake',
    'TWRLAKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Trail',
    'TRAIL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tranquille Valley',
    'TRNQL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Trout Lake',
    'TROUTLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Trutch',
    'TRUTCH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tsawwassen',
    'TSAWWASN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tsay Keh (commonly known as Ingenika)',
    'INGENKA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tulameen',
    'TULAMEEN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tumbler Ridge',
    'TUMBLER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tupper',
    'TUPPER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tuwanek',
    'TUWANEK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Twin Butte',
    'TWINBUTE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Two Rivers',
    'TWORIVR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tyaughton(Tyax)Lake',
    'TYAXLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Tye',
    'TYE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Ucluelet',
    'UCLUELET',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Union Bay',
    'UNIONBAY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Univ Endow''t Lands',
    'UNIVENDW',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Upper Arrow Lake',
    'UPRARRWL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Upper Cutbank',
    'UPRCUTBK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Upper Fraser',
    'UPRFRASR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Usk',
    'USK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Valdes Island',
    'VALDESIS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Valemount',
    'VALEMONT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Valleyview',
    'VLYVIEW',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Vallican',
    'VALLICAN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Vananda',
    'VANANDA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Vancouver',
    'VANCOUVR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Vanderhoof',
    'VANDERHF',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Vavenby',
    'VAVENBY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Venables Valley',
    'VENABLES',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Vernon',
    'VERNON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Victor Lake',
    'VICTORLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Victoria',
    'VICTORIA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'View Royal',
    'VIEWROYL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Walhachin',
    'WALHACHN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Waneta',
    'WANETA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Wardner',
    'WARDNER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Warfield',
    'WARFIELD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Wasa',
    'WASA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Websters Corner',
    'WEBSTRCR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Wells',
    'WELLS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'West Cracroft Island',
    'WCRACRFT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'West Creston',
    'WESTCRST',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'West Kelowna',
    'WSTKELOW',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'West Lake',
    'WESTLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'West Thurlow Island',
    'WSTTHRLW',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'West Vancouver',
    'WSTVANCO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Westbank',
    'WESTBANK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Westbridge',
    'WSTBRDGE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Westbridge (Highway 33 junction only)',
    'WSTBR33',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Westside',
    'WESTSIDE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Westview',
    'WESTVIEW',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Westwold',
    'WESTWOLD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Whatshan Lake',
    'WHTSHANL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Whiskey Creek',
    'WHISKYC',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Whistler',
    'WHISTLER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'White Lake',
    'WHITELK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'White River',
    'WHITERIV',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'White Rock',
    'WHITERCK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Whitecroft',
    'WHITCROF',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Whiteswan Lake',
    'WHITESWN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Whonnock',
    'WHONNOCK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Wildwood',
    'WILDWOOD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Williams Lake',
    'WILLMSLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Willow Flats',
    'WILWFLAT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Willow Point',
    'WILWRPOI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Willow River',
    'WILWRIVR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Willow Valley',
    'WILWVALY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Wilmer',
    'WILMER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Wilson Creek',
    'WILSNCRK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Wilson Lake',
    'WILSLAKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Wilson''s Landing',
    'WLSNLNDG',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Windermere',
    'WINDRMER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Winlaw',
    'WINLAW',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Winter Harbour',
    'WINTRHRB',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Wistaria',
    'WISTARIA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Wonowon',
    'WONOWON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Woss',
    'WOSS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Wycliffe',
    'WYCLIFFE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Wynndel',
    'WYNDEL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Yahk',
    'YAHK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Yale',
    'YALE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Yarrow',
    'YARROW',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Yellowpoint',
    'YLWPOINT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Ymir',
    'YMIR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Youbou',
    'YOUBOU',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Young Lake',
    'YOUNGLK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'geoorgutcd',
    'Zeballos',
    'ZEBALLOS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

-- species
INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Black bear',
    'BLKBEAR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Bison',
    'BISON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Bobcat',
    'BOBCAT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Caribou',
    'CARIBOU',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Cougar',
    'COUGAR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Coyote',
    'COYOTE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Deer',
    'DEER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Elk',
    'ELK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Fox',
    'FOX',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Grizzly bear',
    'GRZBEAR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Hog/pig/boar (feral)',
    'FERALHOG',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Lynx',
    'LYNX',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Moose',
    'MOOSE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Mountain goats',
    'MTNGOAT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Racoon',
    'RACCOON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Raptor',
    'RAPTOR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Rattlesnake',
    'RATTLER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'River otter',
    'RVROTTER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Skunk',
    'SKUNK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Wild sheep',
    'WLDSHEEP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Wolf',
    'WOLF',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Wolverine',
    'WOLVERN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Other',
    'OTHER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'speciescd',
    'Unknown',
    'UNKNOWN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

-- complaint nature
INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Sightings',
    'SGHTNGS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Food Conditioned',
    'FOODCOND',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Injured/distressed - not present',
    'INJNP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Damage to property - not present',
    'DAMNP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Aggressive - not present',
    'AGGNOT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Livestock/pets - killed/injured - not present (no cougar suspected)',
    'LIVNCOU',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Livestock/pets - killed/injured - not present (No Black/Grizzly Bear, Wolf, Cougar suspected)',
    'LIVNCOU',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Dead wildlife - no violation suspected',
    'DEADNV',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Orphaned - large carnivores/ungulates only',
    'ORPHANLG',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Human injury/death',
    'HUMINJ',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Aggressive - present/recent',
    'AGGPRES',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Cougar suspected - killed/injured livestock/pets - not present',
    'COUGARN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Livestock/pets - killed/injured - present/recent',
    'LIVPRES',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Livestock/pets - killed/injured - present/recent/suspected (Black/Grizzly Bear, Wolf, Cougar)',
    'LIVPRES',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Livestock/pets - killed/injured - present/recent (Coyote/Bobcat)',
    'LIVPRES',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'School/park/playground - present/recent',
    'SCHPRES',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Confined',
    'CONFINED',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Property damage - present',
    'PROPPRES',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Wildlife in trap',
    'TRAP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Injured/distressed - present',
    'INJPRES',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Dead wildlife - public safety risk',
    'DEADPSR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Sightings of grizzlies/cougars urban/residential areas',
    'SGHTNGS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'cmpltntrcd',
    'Wildlife in leg hold/live trap',
    'TRPLEG',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

-- attractants
INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'atractntcd',
    'BBQ',
    'BBQ',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'atractntcd',
    'Crops',
    'CROPS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'atractntcd',
    'Pet Food',
    'PETFOOD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'atractntcd',
    'Beehive',
    'BEEHIVE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'atractntcd',
    'Freezer',
    'FREEZER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'atractntcd',
    'Pets',
    'PETS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'atractntcd',
    'Bird Feeder',
    'BIRD FDR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'atractntcd',
    'Garbage',
    'GARBAGE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'atractntcd',
    'Residential Fruit/Berries',
    'RESFRUIT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'atractntcd',
    'Campground food',
    'CAMP FD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'atractntcd',
    'Industrial Camp',
    'INDCAMP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'atractntcd',
    'Vegetable Garden',
    'VEGGARD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'atractntcd',
    'Vineyard/Orchid',
    'VNYDORCH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'atractntcd',
    'Livestock',
    'LIVESTCK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'atractntcd',
    'Wildlife: hunter kill',
    'WLDLFEHK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'atractntcd',
    'Compost',
    'COMPOST',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'atractntcd',
    'Livestock feed',
    'LVSFEED',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'atractntcd',
    'Other',
    'OTHER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

-- violation
INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'violatncd',
    'Wildlife',
    'WILDLIFE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'violatncd',
    'Wildlife: Invasive Species',
    'WINVSPC',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'violatncd',
    'Aquatic: Invasive Species',
    'AINVSPC',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'violatncd',
    'Fisheries',
    'FISHERY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'violatncd',
    'Open Burning',
    'OPENBURN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'violatncd',
    'Dumping',
    'DUMPING',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'violatncd',
    'Off-road vehicles (ORV)',
    'ORV',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'violatncd',
    'Recreation sites/ trails',
    'RECREATN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'violatncd',
    'Boating',
    'BOATING',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'violatncd',
    'Waste',
    'WASTE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'violatncd',
    'Other',
    'OTHER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'violatncd',
    'Pesticide',
    'PESTICDE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'girtypecd',
    'CO Contact',
    'COCNT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'girtypecd',
    'CO Disposition',
    'CODSP',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'girtypecd',
    'General Advice',
    'GENAD',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'girtypecd',
    'Media',
    'MEDIA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

INSERT INTO
  public.staging_metadata_mapping (
    staging_metadata_mapping_guid,
    entity_code,
    staged_data_value,
    live_data_value,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'girtypecd',
    'Query',
    'QUERY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict do nothing;
