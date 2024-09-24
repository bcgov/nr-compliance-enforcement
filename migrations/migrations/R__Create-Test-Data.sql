-----------------------
-- HOW TO USE THIS FILE
--
-- Nearly all changes to code tables should go into this file, the exception might be if there is 
-- a high volume (e.g. see staging-metadata-mapping.sql)
--
-- All insert statements MUST end with ON CONFLICT DO NOTHING; in order to make them repeatable
--
-- Update statements could either be placed at the bottom of the file, or if they are an update to an 
-- existing update statement, the original update statement could just be updated.
--
-- The last line of the file that increments the code table versions by one will tell the clients to
-- download new copies of the code table.   It probably doesn't HAVE to be the last line of the file, 
-- but I think it should be just to be safe.
----------------------
-------------------------
-- Insert OFFICE records
-------------------------
INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    'db343458-8eca-42c2-91ec-070b3e6de663'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    '100MLHSE',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '5c7023b9-710e-4333-bbcb-8a95350b747c'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'ATLIN',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    'cdd9964e-7878-44c1-b4a2-0290c6345dec'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'BLLACLA',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '3338cb74-5be4-4ed3-8b11-41f83d72de00'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'BLKCRKCR',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    'ee09bf4d-e5a1-4fb8-9012-c192692dd1bd'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'BURNSLK',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    'aebabfed-cf45-4253-9fbf-f49452190332'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'CSTLGAR',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '92bad201-cccc-4021-9c79-bbdcf13947f2'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'CHTWD',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '79fe321b-7716-413f-b878-c5fd6100317d'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'CLRWTER',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '19addcac-91b2-4ab3-83b9-9a26baa1e635'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'CRNBK',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '2044f08d-b53c-489a-8584-dd867b63514a'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'CRSTN',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '55d7b990-8123-492f-8b5b-7cbbd14ac423'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'DJNG',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '4a5a94b1-bd47-4611-a577-861d97089903'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'DWSNCRK',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    'f30857bf-bab9-491a-b38f-83600238c36d'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'DSELK',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    'f7065a6e-2481-4526-b874-6ab98009481d'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'DNCN',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '784080e4-9674-4c84-ac3e-bf161b09c2de'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'FRNIE',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    'edd4b298-ced7-4b10-9232-87512ec640b3'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'FRTNLN',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    'e0ad7fe3-59da-4e1a-a611-46ccf7ea7396'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'FRTSTJN',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '643a4ff7-9135-4e6d-86ad-f2f8aac195ef'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'GLDN',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    'c8aeb3d9-3718-49d9-b8b5-6c84671546eb'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'GDFKS',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    'a5e2e92e-4928-4dbc-8165-e06234b051c1'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'INVRM',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '3a070028-2c6f-4ea9-a548-271cf076280a'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'KMLPS',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '21855957-521f-4190-b0f9-a7ab7d139978'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'KLWNA',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '33dc58c7-2ebf-4924-93f9-168073058273'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'LLT',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '3a4e8fc8-db72-4f02-b5ee-1f257c74a635'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'MKNZI',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    'e6807e73-f591-459a-b0f7-413f6fb2984e'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'MRRTT',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '8f9e10a8-53b5-4125-8d8f-b7fbfdd6ae47'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'MSNCHWK',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '491941e6-89a7-473f-b246-a2d8cd21b078'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'MSNMPLRD',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '00048dd4-17b0-4fdc-a3fb-54f820970422'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'MSNSR',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '6496f00f-5397-470d-90db-490e6859256a'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'NNIMO',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '4ff0d641-4c60-4a0a-964e-6e0ac5bfa8de'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'NLSON',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    'b494082e-35a3-468f-8955-4aa002066b36'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'PNTCTN',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '305f0ee6-b525-40fd-b2d8-c7a882e8b7fd'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'PRTALB',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '3058b00c-cafd-4eba-a1a4-a989ccff00bf'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'PRTMCNL',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    'cd101564-6114-49e0-9e87-fa6e4925dbb7'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'PWLRV',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '3f474308-68da-450a-b1ab-fb8a5b7a27ce'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'PRCG',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '313f4ec3-e88a-41c2-9956-78c7b18cb71d'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'QSNL',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '19d0f476-0fc4-4fe1-b7aa-b76d3c2c5b9b'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'SLMONRM',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    'b74014cf-1d80-4074-97c0-024a422d24f9'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'SCHLT',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    'cbd8d434-f525-410b-9c3c-119b82a31813'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'SMITHRS',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '38105a68-c83d-44e5-af6e-9cfa40792118'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'SQMSHWHS',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '0f2cdcb7-c4ba-457d-adac-adde1d8c077a'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'TERRC',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '5128179c-f622-499b-b8e5-b39199081f22'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'VNDHF',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '1f4d9042-d6a5-46b6-a860-e1de7edb6add'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'VRNON',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '45abdc96-1b07-4b9c-8b05-e2b0c46c1d1d'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'VICTRA',
    'COS'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    '9fc7327b-b206-4a5c-88f1-2875a456eb49'::uuid,
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'WLMSLK',
    'COS'
  ) ON CONFLICT
DO NOTHING;

-------------------------
-- Insert PERSON records
-------------------------
-- COS HQ / Application Team --
INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '6fd73cad-cbc7-49f1-888a-b24dc8abd824'::uuid,
    'Neil',
    NULL,
    NULL,
    'Baskerville-Bridges',
    'FLYWAY',
    '2023-06-29 22:16:16.754',
    'FLYWAY',
    '2023-06-29 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '5169b4e9-4d93-42bf-b7f4-70f329bfd22c'::uuid,
    'Steve',
    NULL,
    NULL,
    'Kot',
    'FLYWAY',
    '2023-06-29 22:16:16.754',
    'FLYWAY',
    '2023-06-29 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '659f8758-1b64-4d23-b371-d4c4333c2787'::uuid,
    'Barrett',
    NULL,
    NULL,
    'Falk',
    'FLYWAY',
    '2023-06-29 22:16:16.754',
    'FLYWAY',
    '2023-06-29 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '5b9bcbf6-73b4-4b56-8fc3-d979bb3c1ff7'::uuid,
    'Mike',
    NULL,
    NULL,
    'Sears',
    'FLYWAY',
    '2023-06-29 22:16:16.754',
    'FLYWAY',
    '2023-06-29 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '666c0f30-d707-4ade-b67f-9b888fe234e6'::uuid,
    'Alec',
    NULL,
    NULL,
    'Wilcox',
    'FLYWAY',
    '2023-06-29 22:16:16.754',
    'FLYWAY',
    '2023-06-29 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '7de151c1-ae52-41c3-834d-d538bbb50cda'::uuid,
    'Tobe',
    NULL,
    NULL,
    'Sprado',
    'FLYWAY',
    '2023-06-29 22:16:16.754',
    'FLYWAY',
    '2023-06-29 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '5a724b5e-aa64-439d-a76d-3aa7320409a0'::uuid,
    'Scarlett',
    NULL,
    NULL,
    'Truong',
    'FLYWAY',
    '2024-01-10 22:16:16.754',
    'FLYWAY',
    '2024-01-10 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'f67e52f5-ac3f-48e0-ad64-cab1eae51a18'::uuid,
    'Dmitri',
    NULL,
    NULL,
    'Korin',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'b9d79ff2-8ec4-4f35-bfa6-d19dbdd2d58e'::uuid,
    'Adrienne',
    NULL,
    NULL,
    'Lai',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'b48487c2-055a-4711-bba8-282a28e52e69'::uuid,
    'Greg',
    NULL,
    NULL,
    'Lavery',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '73e2a6f1-f438-495f-a5e7-12e850a5e4e3'::uuid,
    'Miwa',
    NULL,
    NULL,
    'Ito',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

-- Peace Pilot Users: Fort St. John --
INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '87035f8e-d01a-4c8e-80ec-868fd386605d'::uuid,
    'Jacob',
    NULL,
    NULL,
    'Clausen',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'd6d2021f-8c9e-4086-b915-068e935a7fac'::uuid,
    'Mitchell',
    NULL,
    NULL,
    'Chayer',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '2bc18e7f-1f9a-4c8f-a47c-85399294e172'::uuid,
    'Ellen',
    NULL,
    NULL,
    'Pedersen',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '02cae56f-21e6-4c64-9a9f-d8e77ca1f77c'::uuid,
    'Blake',
    NULL,
    NULL,
    'Parker',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '52f69f9b-8766-4fe7-9fa3-844808d78bd5'::uuid,
    'Anthony',
    NULL,
    NULL,
    'Eagles',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'd19893fa-0af9-4646-9def-1312e8d67202'::uuid,
    'Darryl',
    NULL,
    NULL,
    'Struthers',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '1c64cc35-f5f7-4cf5-84b3-4e4233f9c6a1'::uuid,
    'Breanna',
    NULL,
    NULL,
    'Caruth',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

-- Peace Pilot Users: Fort Nelson --
INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '1db006c7-221e-47fa-a795-c5529258d090'::uuid,
    'Jeff',
    NULL,
    NULL,
    'Clancy',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'b08e0fe2-f829-4ea1-a7e6-070a2ebc968c'::uuid,
    'Erich',
    NULL,
    NULL,
    'Harbich',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

-- Peace Pilot Users: Dawson Creek --
INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '644be5aa-993b-4e77-a4f4-ab3087c34fb7'::uuid,
    'Juliana',
    NULL,
    NULL,
    'Damert',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '5e75ed5a-5c40-45ea-b28e-383a56c5ec0a'::uuid,
    'Rob',
    NULL,
    NULL,
    'Groeger',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'b136509d-0e1c-4c81-99b5-2ca3236f6f54'::uuid,
    'Kevin',
    NULL,
    NULL,
    'Mayowski',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.person (
    person_guid,
    first_name,
    middle_name_1,
    middle_name_2,
    last_name,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '2eaffabd-720d-48ed-aa82-b31f828487c4'::uuid,
    'Brad',
    NULL,
    NULL,
    'Lacey',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

-------------------------
-- INSERT OFFICER RECORDS
-------------------------
-- insert COSHQ and move project team into it
insert into
  geo_organization_unit_code (
    geo_organization_unit_code,
    short_description,
    long_description,
    effective_date,
    expiry_date,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_org_unit_type_code,
    administrative_office_ind
  )
values
  (
    'COSHQ',
    'COS HQ',
    'COS Headquarters',
    now(),
    null,
    user,
    now(),
    user,
    now(),
    'OFFLOC',
    true
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.office (
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    geo_organization_unit_code,
    agency_code
  )
VALUES
  (
    'c3d8519c-73cb-48a1-8058-358883d5ef4f'::uuid,
    'nr-compliance-enforcement',
    '2024-06-06 22:16:16.754',
    'nr-compliance-enforcement',
    '2023-06-29 22:16:16.754',
    'COSHQ',
    'COS'
  ) ON CONFLICT
DO NOTHING;

insert into
  geo_org_unit_structure (
    effective_date,
    expiry_date,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    agency_code,
    parent_geo_org_unit_code,
    child_geo_org_unit_code
  )
values
  (
    now(),
    null,
    user,
    now(),
    user,
    now(),
    'COS',
    'SISL',
    'COSHQ'
  ) ON CONFLICT
DO NOTHING;

-- COS HQ / Application Team --
INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid,
    auth_user_guid
  )
VALUES
  (
    '65dbad8b-790a-43cb-b394-c8019f4c86e2'::uuid,
    'M2SEARS',
    'FLYWAY',
    '2023-06-29 22:16:16.754',
    'FLYWAY',
    '2023-06-29 22:16:16.754',
    '5b9bcbf6-73b4-4b56-8fc3-d979bb3c1ff7'::uuid,
    'c3d8519c-73cb-48a1-8058-358883d5ef4f'::uuid,
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid,
    auth_user_guid
  )
VALUES
  (
    '54892583-7013-48f5-87c8-90c19f95b395'::uuid,
    'BFALK',
    'FLYWAY',
    '2023-06-29 22:16:16.754',
    'FLYWAY',
    '2023-06-29 22:16:16.754',
    '659f8758-1b64-4d23-b371-d4c4333c2787'::uuid,
    'c3d8519c-73cb-48a1-8058-358883d5ef4f'::uuid,
    '6def8986-1b18-4205-8283-d6fd633b3eee'::uuid
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid,
    auth_user_guid
  )
VALUES
  (
    'b762fbc2-344f-4c53-a8c2-6b0b9f605d4b'::uuid,
    'SKOT',
    'FLYWAY',
    '2023-06-29 22:16:16.754',
    'FLYWAY',
    '2023-06-29 22:16:16.754',
    '5169b4e9-4d93-42bf-b7f4-70f329bfd22c'::uuid,
    'c3d8519c-73cb-48a1-8058-358883d5ef4f'::uuid,
    '98b121c7-873a-45bf-b465-749870896eb9'::uuid
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid,
    auth_user_guid
  )
VALUES
  (
    'efcbaae4-505b-4db3-b036-7ec8b8dd8c6d'::uuid,
    'NBASKERV',
    'FLYWAY',
    '2023-06-29 22:16:16.754',
    'FLYWAY',
    '2023-06-29 22:16:16.754',
    '6fd73cad-cbc7-49f1-888a-b24dc8abd824'::uuid,
    'c3d8519c-73cb-48a1-8058-358883d5ef4f'::uuid,
    'ef0bc810-58a7-4080-ad7a-b5bbdd0d2efe'::uuid
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid,
    auth_user_guid
  )
VALUES
  (
    '9d171865-aab6-43d1-bbf2-93b4d4c5ba02'::uuid,
    'AWILCOX',
    'FLYWAY',
    '2023-06-29 22:16:16.754',
    'FLYWAY',
    '2023-06-29 22:16:16.754',
    '666c0f30-d707-4ade-b67f-9b888fe234e6'::uuid,
    'c3d8519c-73cb-48a1-8058-358883d5ef4f'::uuid,
    '287d4e72-8409-4dd1-991a-8b1117b8eb2a'::uuid
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid
  )
VALUES
  (
    'a534a1e0-bebc-499d-ba4b-eb5ed0726f26'::uuid,
    'STRUONG',
    'FLYWAY',
    '2024-01-10 22:16:16.754',
    'FLYWAY',
    '2024-01-10 22:20:48.186',
    '5a724b5e-aa64-439d-a76d-3aa7320409a0'::uuid,
    'c3d8519c-73cb-48a1-8058-358883d5ef4f'::uuid
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid
  )
VALUES
  (
    '56582c3c-6819-43c8-8d89-8e43823500c3'::uuid,
    'DKORIN',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:20:48.186',
    'f67e52f5-ac3f-48e0-ad64-cab1eae51a18'::uuid,
    'c3d8519c-73cb-48a1-8058-358883d5ef4f'::uuid
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid
  )
VALUES
  (
    'd148bfc7-b41a-474c-a04e-7218a840daea'::uuid,
    'ADLAI',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:20:48.186',
    'b9d79ff2-8ec4-4f35-bfa6-d19dbdd2d58e'::uuid,
    'c3d8519c-73cb-48a1-8058-358883d5ef4f'::uuid
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid
  )
VALUES
  (
    '880e237a-a422-4443-a58d-22e5380be86a'::uuid,
    'GRLAVERY',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:20:48.186',
    'b48487c2-055a-4711-bba8-282a28e52e69'::uuid,
    'c3d8519c-73cb-48a1-8058-358883d5ef4f'::uuid
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid
  )
VALUES
  (
    'd6a7dd4f-3b5a-41bd-aef5-d47a0510f3c7'::uuid,
    'MITO',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:20:48.186',
    '73e2a6f1-f438-495f-a5e7-12e850a5e4e3'::uuid,
    'c3d8519c-73cb-48a1-8058-358883d5ef4f'::uuid
  ) ON CONFLICT
DO NOTHING;

-- Peace Pilot Users: Fort St. John --
INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid
  )
VALUES
  (
    'd2551008-e00a-4187-80b0-5657d0b5da46'::uuid,
    'JCLAUSEN',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:20:48.186',
    '87035f8e-d01a-4c8e-80ec-868fd386605d'::uuid,
    'e0ad7fe3-59da-4e1a-a611-46ccf7ea7396'::uuid
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid
  )
VALUES
  (
    '3af641d9-9218-49ba-8b83-543a98522eec'::uuid,
    'MCHAYER',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:20:48.186',
    'd6d2021f-8c9e-4086-b915-068e935a7fac'::uuid,
    'e0ad7fe3-59da-4e1a-a611-46ccf7ea7396'::uuid
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid
  )
VALUES
  (
    '164d289f-06d9-42c8-98c0-5383d9697612'::uuid,
    'ELPEDERS',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:20:48.186',
    '2bc18e7f-1f9a-4c8f-a47c-85399294e172'::uuid,
    'e0ad7fe3-59da-4e1a-a611-46ccf7ea7396'::uuid
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid
  )
VALUES
  (
    'f824bcf0-3762-4f81-b5f3-347b2f1b2117'::uuid,
    'BEPARKER',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:20:48.186',
    '02cae56f-21e6-4c64-9a9f-d8e77ca1f77c'::uuid,
    'e0ad7fe3-59da-4e1a-a611-46ccf7ea7396'::uuid
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid
  )
VALUES
  (
    'b9d95788-f62b-4408-b865-3de86a5b049b'::uuid,
    'AEAGLES',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:20:48.186',
    '52f69f9b-8766-4fe7-9fa3-844808d78bd5'::uuid,
    'e0ad7fe3-59da-4e1a-a611-46ccf7ea7396'::uuid
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid
  )
VALUES
  (
    '8d4316b8-b690-493e-bebb-0f4205e48a8b'::uuid,
    'DJSTRUTH',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:20:48.186',
    'd19893fa-0af9-4646-9def-1312e8d67202'::uuid,
    'e0ad7fe3-59da-4e1a-a611-46ccf7ea7396'::uuid
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid
  )
VALUES
  (
    'a2b20131-5f9e-455e-87fb-acadfce83e54'::uuid,
    'BCARUTH',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:20:48.186',
    '1c64cc35-f5f7-4cf5-84b3-4e4233f9c6a1'::uuid,
    'e0ad7fe3-59da-4e1a-a611-46ccf7ea7396'::uuid
  ) ON CONFLICT
DO NOTHING;

-- Peace Pilot Users: Fort Nelson --
INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid
  )
VALUES
  (
    '33e113c0-a199-4bb4-b6c4-6b3ceb52b04c'::uuid,
    'JCLANCY',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:20:48.186',
    '1db006c7-221e-47fa-a795-c5529258d090'::uuid,
    'edd4b298-ced7-4b10-9232-87512ec640b3'::uuid
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid
  )
VALUES
  (
    'b31620b8-e8d0-4a62-aba9-5ace33e89a28'::uuid,
    'EHARBICH',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:20:48.186',
    'b08e0fe2-f829-4ea1-a7e6-070a2ebc968c'::uuid,
    'edd4b298-ced7-4b10-9232-87512ec640b3'::uuid
  ) ON CONFLICT
DO NOTHING;

-- Peace Pilot Users: Dawson Creek --
INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid
  )
VALUES
  (
    '40643de5-e6f3-46aa-915e-ede5d2cfcf9d'::uuid,
    'JDAMERT',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:20:48.186',
    '644be5aa-993b-4e77-a4f4-ab3087c34fb7'::uuid,
    '4a5a94b1-bd47-4611-a577-861d97089903'::uuid
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid
  )
VALUES
  (
    '5887b91a-daa1-4473-89bb-841f097f825d'::uuid,
    'RGROEGER',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:20:48.186',
    '5e75ed5a-5c40-45ea-b28e-383a56c5ec0a'::uuid,
    '4a5a94b1-bd47-4611-a577-861d97089903'::uuid
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid
  )
VALUES
  (
    '8117a02b-a032-42fe-b5b0-16c68c1e44c4'::uuid,
    'KMAYOWSK',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:20:48.186',
    'b136509d-0e1c-4c81-99b5-2ca3236f6f54'::uuid,
    '4a5a94b1-bd47-4611-a577-861d97089903'::uuid
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  public.officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    office_guid
  )
VALUES
  (
    '9989f64b-27ee-49bb-9a90-35546223f87f'::uuid,
    'BALACEY',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:20:48.186',
    '2eaffabd-720d-48ed-aa82-b31f828487c4'::uuid,
    '4a5a94b1-bd47-4611-a577-861d97089903'::uuid
  ) ON CONFLICT
DO NOTHING;

-- Reset offices to nr-compliance-enforcement values
UPDATE public.officer
SET
  office_guid = 'cdd9964e-7878-44c1-b4a2-0290c6345dec'
WHERE
  office_guid = '914f8725-7100-4f56-a39b-1c18b0eccb55';

UPDATE public.officer
SET
  office_guid = 'b494082e-35a3-468f-8955-4aa002066b36'
WHERE
  office_guid = '39e7ad0a-20b1-48b4-be70-dfcc5bc01c3c';

UPDATE public.officer
SET
  office_guid = 'b494082e-35a3-468f-8955-4aa002066b36'
WHERE
  office_guid = '05633ab9-1502-4566-9364-4b3dac7c1354';

UPDATE public.officer
SET
  office_guid = 'b494082e-35a3-468f-8955-4aa002066b36'
WHERE
  office_guid = '7da19946-4525-43ff-b4b6-d243a2addaaa';

UPDATE public.officer
SET
  office_guid = 'b494082e-35a3-468f-8955-4aa002066b36'
WHERE
  office_guid = '4b3a8974-1975-4aaf-9e0a-2d3f5d217805';

-- Fixing spelling issue
UPDATE public.attractant_code
SET
  long_description = 'Barbeque'
WHERE
  short_description = 'BBQ'
  AND attractant_code = 'BBQ';

UPDATE public.attractant_code
SET
  short_description = 'Fruit/Berries'
WHERE
  long_description = 'Residential Fruit/Berries'
  AND attractant_code = 'RESFRUIT';

UPDATE public.attractant_code
SET
  short_description = 'Hunter Kill'
WHERE
  long_description = 'Wildlife:Hunter Kill'
  AND attractant_code = 'WLDLFEHK';

-- Changing display order of attractants
UPDATE public.attractant_code
SET
  display_order = 8
WHERE
  attractant_code = 'RESFRUIT';

UPDATE public.attractant_code
SET
  display_order = 9
WHERE
  attractant_code = 'GARBAGE';

UPDATE public.attractant_code
SET
  display_order = 10
WHERE
  attractant_code = 'WLDLFEHK';

UPDATE public.attractant_code
SET
  display_order = 11
WHERE
  attractant_code = 'INDCAMP';

UPDATE public.attractant_code
SET
  display_order = 12
WHERE
  attractant_code = 'LIVESTCK';

UPDATE public.attractant_code
SET
  display_order = 13
WHERE
  attractant_code = 'LVSFEED';

UPDATE public.attractant_code
SET
  display_order = 14
WHERE
  attractant_code = 'NA';

UPDATE public.attractant_code
SET
  display_order = 15
WHERE
  attractant_code = 'OTHER';

UPDATE public.attractant_code
SET
  display_order = 16
WHERE
  attractant_code = 'PETFOOD';

UPDATE public.attractant_code
SET
  display_order = 17
WHERE
  attractant_code = 'PETS';

UPDATE public.attractant_code
SET
  display_order = 18
WHERE
  attractant_code = 'VEGGARD';

UPDATE public.attractant_code
SET
  display_order = 19
WHERE
  attractant_code = 'VNYDORCH';

-- CE-326 Adding Caribou
UPDATE species_code
SET
  display_order = 24
where
  display_order = 23;

UPDATE species_code
SET
  display_order = 23
where
  display_order = 22;

UPDATE species_code
SET
  display_order = 22
where
  display_order = 21;

UPDATE species_code
SET
  display_order = 21
where
  display_order = 20;

UPDATE species_code
SET
  display_order = 20
where
  display_order = 19;

UPDATE species_code
SET
  display_order = 19
where
  display_order = 18;

UPDATE species_code
SET
  display_order = 18
where
  display_order = 17;

UPDATE species_code
SET
  display_order = 17
where
  display_order = 16;

UPDATE species_code
SET
  display_order = 16
where
  display_order = 15;

UPDATE species_code
SET
  display_order = 15
where
  display_order = 14;

UPDATE species_code
SET
  display_order = 14
where
  display_order = 13;

UPDATE species_code
SET
  display_order = 13
where
  display_order = 12;

UPDATE species_code
SET
  display_order = 12
where
  display_order = 11;

UPDATE species_code
SET
  display_order = 11
where
  display_order = 10;

UPDATE species_code
SET
  display_order = 10
where
  display_order = 9;

UPDATE species_code
SET
  display_order = 9
where
  display_order = 8;

UPDATE species_code
SET
  display_order = 8
where
  display_order = 7;

UPDATE species_code
SET
  display_order = 7
where
  display_order = 6;

UPDATE species_code
SET
  display_order = 6
where
  display_order = 5;

UPDATE species_code
SET
  display_order = 5
where
  display_order = 4;

UPDATE species_code
SET
  display_order = 4
where
  display_order = 3;

insert into
  species_code (
    species_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    legacy_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
values
  (
    'CARIBOU',
    'Caribou',
    'Caribou',
    3,
    true,
    null,
    user,
    now(),
    user,
    now()
  ) ON CONFLICT
DO NOTHING;

-- CE-326 Opps
UPDATE species_code
SET
  display_order = 4
where
  species_code = 'CARIBOU';

UPDATE species_code
SET
  display_order = 3
where
  species_code = 'BOBCAT';

--------------------------
-- Staging Activities for webEOC load
-------------------------
insert into
  public.staging_activity_code (
    staging_activity_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
values
  (
    'INSERT',
    'Insert',
    'A Record has been created by the source system',
    1,
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ),
  (
    'UPDATE',
    'Update',
    'A Record has been updated by the source system',
    2,
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ),
  (
    'EDIT',
    'Edit',
    'A Record has been edited by the source system',
    3,
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict
do nothing;

--------------------------
-- Staging Status for webEOC load
-------------------------
insert into
  public.staging_status_code (
    staging_status_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
values
  (
    'PENDING',
    'Pending',
    'Complaint is pending loading from the staging table into the transactional tables.',
    1,
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ),
  (
    'SUCCESS',
    'Success',
    'Complaint has been successfully loaded from the staging table into the transactional tables.',
    2,
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ),
  (
    'ERROR',
    'Error',
    'Complaint was unable to be loaded from the staging table into the transactional tables.',
    3,
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict (staging_status_code)
do nothing;

--------------------------
-- Table entities for webEOC load
-------------------------
insert into
  public.entity_code (
    entity_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
values
  (
    'violatncd',
    'Violation Code',
    'Violation code table',
    5,
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ),
  (
    'reprtdbycd',
    'reported_by_code',
    'Reported By code table',
    4,
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ),
  (
    'geoorgutcd',
    'geo_organization_unit_code',
    'Geo Organization Unit code table',
    2,
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ),
  (
    'speciescd',
    'species_code',
    'Species code table',
    5,
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ),
  (
    'cmpltntrcd',
    'hwcr_complaint_nature_code',
    'HWCR Complaint Nature code table',
    3,
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ),
  (
    'atractntcd',
    'attractant_code',
    'Attractant code table',
    1,
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) on conflict
do nothing;

--------------------------
-- Rename location
-------------------------
update geo_organization_unit_code
set
  short_description = 'Daajing Giids (Queen Charlotte City)',
  long_description = 'Daajing Giids (Queen Charlotte City)'
where
  geo_organization_unit_code = 'QUEENCHA';

--------------------------
-- Add Pending Review Status
-------------------------
insert into
  complaint_status_code (
    complaint_status_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    manually_assignable_ind
  )
values
  (
    'PENDREV',
    'Pending Review',
    'Pending Review',
    2,
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    false
  ) on conflict
do nothing;

update complaint_status_code
set
  display_order = 3,
  short_description = 'Closed'
where
  complaint_status_code = 'CLOSED';

update complaint_status_code
set
  short_description = 'Open'
where
  complaint_status_code = 'OPEN';

----------------------------
-- Configuration Values
----------------------------
insert into
  configuration (
    configuration_code,
    configuration_value,
    long_description,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
values
  (
    'DFLTPAGNUM',
    '50',
    'The default number of rows per page when displaying lists within the application.',
    true,
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

insert into
  configuration (
    configuration_code,
    configuration_value,
    long_description,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
values
  (
    'MAXFILESZ',
    '5000',
    'The maximum file size (in Megabytes) supported for upload.',
    true,
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

---------------------------------------
-- Species Updates
---------------------------------------
UPDATE species_code
set
  short_description = 'Grizzly Bear',
  long_description = 'Grizzly Bear'
WHERE
  species_code = 'GRZBEAR';

UPDATE species_code
set
  short_description = 'Hog/Pig/Boar (Feral)',
  long_description = 'Hog/Pig/Boar (Feral)'
WHERE
  species_code = 'FERALHOG';

UPDATE species_code
set
  short_description = 'Mountain Goat',
  long_description = 'Mountain Goat'
WHERE
  species_code = 'MTNGOAT';

UPDATE species_code
set
  short_description = 'River Otter',
  long_description = 'River Otter'
WHERE
  species_code = 'RVROTTER';

-------------------------------------
-- insert new office records
-------------------------------------
INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'NNIMO',
  'EPO',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'VICTRA',
  'EPO',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'MSNSR',
  'EPO',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'PNTCTN',
  'EPO',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'NLSON',
  'EPO',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'CRNBK',
  'EPO',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'KMLPS',
  'EPO',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'WLMSLK',
  'EPO',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'SMITHRS',
  'EPO',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'PRCG',
  'EPO',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'PRTMCNL',
  'PARKS',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'KMLPS',
  'PARKS',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'WLMSLK',
  'PARKS',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'PNTCTN',
  'PARKS',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'VRNON',
  'PARKS',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'NLSON',
  'PARKS',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'CRNBK',
  'PARKS',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'SMITHRS',
  'PARKS',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'ATLIN',
  'PARKS',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'DSELK',
  'PARKS',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'PRCG',
  'PARKS',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  office (
    geo_organization_unit_code,
    agency_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'FRTSTJN',
  'PARKS',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

---------------
-- insert new BCPARK agency
---------------
INSERT INTO
  agency_code (
    agency_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'PARKS',
  'BC Parks',
  'BC Parks',
  1,
  'Y',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

------------------------------
-- update agency table with updated EPO -> CEEB short description and display order
------------------------------
UPDATE agency_code
SET
  short_description = 'CEEB',
  long_description = 'Compliance and Environmental Enforcement Branch'
where
  agency_code = 'EPO';

UPDATE agency_code
SET
  display_order = 2
WHERE
  agency_code = 'BCWF';

UPDATE agency_code
SET
  display_order = 3
WHERE
  agency_code = 'BYLAW';

UPDATE agency_code
SET
  display_order = 4
WHERE
  agency_code = 'COS';

UPDATE agency_code
SET
  display_order = 5
WHERE
  agency_code = 'DOF';

UPDATE agency_code
SET
  display_order = 6
WHERE
  agency_code = 'EPO';

UPDATE agency_code
SET
  display_order = 7
WHERE
  agency_code = 'CEB';

UPDATE agency_code
SET
  display_order = 8
WHERE
  agency_code = 'LE';

UPDATE agency_code
SET
  display_order = 9
WHERE
  agency_code = 'OTHER';

------------------------------
-- Update Administrative Office Indicator for COS HQ office
------------------------------
update public.geo_organization_unit_code
set
  administrative_office_ind = true
where
  geo_organization_unit_code = 'COSHQ';

----------------------------------------------
-- update staging_activity_code display_order
----------------------------------------------
UPDATE staging_activity_code
SET
  display_order = 10
WHERE
  staging_activity_code = 'INSERT';

UPDATE staging_activity_code
SET
  display_order = 20
WHERE
  staging_activity_code = 'UPDATE';

UPDATE staging_activity_code
SET
  display_order = 30
WHERE
  staging_activity_code = 'EDIT';

-------------------------------------
-- new staging_activity_code records
-------------------------------------
INSERT INTO
  staging_activity_code (
    staging_activity_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'ACTIONCTE',
  'Action Taken',
  'An action taken was created by a call centre agent',
  40,
  true,
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  staging_activity_code (
    staging_activity_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'ACTIONUPD',
  'Action Taken - Update',
  'An action taken was updated by a call centre agent',
  50,
  true,
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

-----------------------------
-- new configuration records
-----------------------------
INSERT INTO
  configuration (
    configuration_code,
    configuration_value,
    long_description,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'ATINCPK',
  'fk_table_345',
  'The name of the field in the webEOC Action Taken API that refers to the webEOC internal PK of the parent incident record',
  true,
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  configuration (
    configuration_code,
    configuration_value,
    long_description,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'AUINCPK',
  'fk_table_346',
  'The name of the field in the webEOC Action Taken Update API that refers to the webEOC internal PK of the parent incident record',
  true,
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

-----------------------
-- Move Hudson's Hope to Fort St. John Office in North Peace
-- This is temporary and will likely need to be removed in the future
-----------------------
update geo_org_unit_structure
set
  parent_geo_org_unit_code = 'FRTSTJN'
where
  parent_geo_org_unit_code = 'CHTWD'
  and child_geo_org_unit_code = 'HUDSONSH';

INSERT INTO
  gir_type_code (
    gir_type_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'COCNT',
  'CO Contact',
  'CO Contact',
  10,
  'Y',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  gir_type_code (
    gir_type_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'CODSP',
  'CO Disposition',
  'CO Disposition',
  20,
  'Y',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  gir_type_code (
    gir_type_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'GENAD',
  'General Advice',
  'General Advice',
  30,
  'Y',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  gir_type_code (
    gir_type_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'MEDIA',
  'Media',
  'Media',
  40,
  'Y',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  gir_type_code (
    gir_type_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'QUERY',
  'Query',
  'Query',
  50,
  'Y',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

UPDATE complaint_type_code
SET
  display_order = 10
where
  display_order = 1;

UPDATE complaint_type_code
SET
  display_order = 20
where
  display_order = 2;

insert into
  complaint_type_code (
    complaint_type_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_user_guid,
    create_utc_timestamp,
    update_user_id,
    update_user_guid,
    update_utc_timestamp
  )
values
  (
    'GIR',
    'GIR',
    'General Incident Report',
    30,
    false,
    user,
    null,
    now(),
    user,
    null,
    now()
  ) ON CONFLICT
DO NOTHING;

UPDATE entity_code
SET
  display_order = 10
where
  display_order = 1;

UPDATE entity_code
SET
  display_order = 20
where
  display_order = 2;

UPDATE entity_code
SET
  display_order = 30
where
  display_order = 3;

UPDATE entity_code
SET
  display_order = 40
where
  display_order = 4;

UPDATE entity_code
SET
  display_order = 50
where
  display_order = 5;

insert into
  public.entity_code (
    entity_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
values
  (
    'girtypecd',
    'gir_type_code',
    'GIR Type Code Table',
    60,
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

-------------------------
-- Insert Feature Codes
-------------------------
INSERT INTO
  feature_code (
    feature_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'EXPERMFTRS',
  'Experimental Features',
  'Features that were included as early prototypes or placeholders , may be used to solicit feedback from user groups.',
  10,
  'Y',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  feature_code (
    feature_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'GIRCMPLNTS',
  'GIR Complaints',
  'Load and display general Incident Report (GIR)  incidents from webEOC.',
  20,
  'Y',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  feature_code (
    feature_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'ACTONSTKEN',
  'Actions Taken',
  'Load and display actions taken for incidents and updates from webEOC.',
  30,
  'Y',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;
INSERT INTO
  feature_code (
    feature_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'ACT_FLTR',
  'Actions Taken Filter',
  'Actions Taken Filter',
  40,
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
INSERT INTO
  feature_code (
    feature_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'COM_FLTR',
  'Community Filter',
  'Community Filter',
  50,
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;

INSERT INTO
  feature_code (
    feature_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'D_L_FLTR',
  'Date Logged Filter',
  'Date Logged Filter',
  60,
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;

  
INSERT INTO
  feature_code (
    feature_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'GIR_FLTR',
  'GIR Type Filter',
  'GIR Type Filter',
  70,
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;

  
INSERT INTO
  feature_code (
    feature_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'METH_FLTR',
  'Method Filter',
  'Method Filter',
  80,
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
  
INSERT INTO
  feature_code (
    feature_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'NAT_FLTR',
  'Nature of Complaint Filter',
  'Nature of Complaint Filter',
  90,
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
  
INSERT INTO
  feature_code (
    feature_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'OFF_FLTR',
  'Officer Assigned Filter',
  'Officer Assigned Filter',
  100,
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;

INSERT INTO
  feature_code (
    feature_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'REG_FLTR',
  'Region Filter',
  'Region Filter',
  110,
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;

INSERT INTO
  feature_code (
    feature_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'SPEC_FLTR',
  'Species Filter',
  'Species Filter',
  120,
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
  
INSERT INTO
  feature_code (
    feature_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'STAT_FLTR',
  'Status Filter',
  'Status Filter',
  130,
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
  
INSERT INTO
  feature_code (
    feature_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'VIOL_FLTR',
  'Violation Type Filter',
  'Violation Type Filter',
  140,
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;


INSERT INTO
  feature_code (
    feature_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'ZONE_FLTR',
  'Zone Filter',
  'Zone Filter',
  60,
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
-------------------------
-- Insert Feature / Agency XREF
-------------------------
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'EXPERMFTRS',
  'COS',
  'N',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'EXPERMFTRS',
  'EPO',
  'N',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'EXPERMFTRS',
  'PARKS',
  'N',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'GIRCMPLNTS',
  'COS',
  'N',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'GIRCMPLNTS',
  'PARKS',
  'N',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'GIRCMPLNTS',
  'EPO',
  'N',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'ACTONSTKEN',
  'COS',
  'N',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'ACTONSTKEN',
  'EPO',
  'N',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'ACTONSTKEN',
  'PARKS',
  'N',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

 -- SET UP COS FILTERS

INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'ACT_FLTR',
  'COS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;  
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'COM_FLTR',
  'COS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
  
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'D_L_FLTR',
  'COS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'GIR_FLTR',
  'COS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'METH_FLTR',
  'COS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;

INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'NAT_FLTR',
  'COS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'OFF_FLTR',
  'COS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'REG_FLTR',
  'COS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'SPEC_FLTR',
  'COS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'STAT_FLTR',
  'COS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'VIOL_FLTR',
  'COS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'ZONE_FLTR',
  'COS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;

-- SET UP CEEB FILTERS
  
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'ACT_FLTR',
  'EPO',
  'N',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;  
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'COM_FLTR',
  'EPO',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
  
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'D_L_FLTR',
  'EPO',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'GIR_FLTR',
  'EPO',
  'N',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;  
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'COM_FLTR',
  'COS',
  'Y',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

INSERT INTO
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'METH_FLTR',
  'EPO',
  'N',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;

INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'NAT_FLTR',
  'EPO',
  'N',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'OFF_FLTR',
  'EPO',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'REG_FLTR',
  'EPO',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'SPEC_FLTR',
  'EPO',
  'N',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'STAT_FLTR',
  'EPO',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'VIOL_FLTR',
  'EPO',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'ZONE_FLTR',
  'EPO',
  'N',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;

-- SET UP PARKS FILTERS
  
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'ACT_FLTR',
  'PARKS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;  
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'COM_FLTR',
  'PARKS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
  
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'D_L_FLTR',
  'PARKS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'GIR_FLTR',
  'PARKS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'METH_FLTR',
  'PARKS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;

INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'NAT_FLTR',
  'PARKS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'OFF_FLTR',
  'PARKS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'REG_FLTR',
  'PARKS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'SPEC_FLTR',
  'PARKS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'STAT_FLTR',
  'PARKS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'VIOL_FLTR',
  'PARKS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
    
INSERT INTO
  feature_agency_xref (
    feature_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'ZONE_FLTR',
  'PARKS',
  'Y',
  user,
  now (),
  user,
  now () ON CONFLICT DO NOTHING;
  
-------------------------
-- Insert Team Codes
-------------------------
insert into
  public.team_code (
    team_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
values
  (
    'HI',
    'Heavy Industry',
    'Heavy Industry',
    10,
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

insert into
  public.team_code (
    team_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
values
  (
    'OPS',
    'Operations',
    'Operations',
    20,
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

insert into
  public.team_code (
    team_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
values
  (
    'REACTIVE',
    'REACTIVE',
    'REACTIVE',
    30,
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

insert into
  public.team_code (
    team_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
values
  (
    'RIPM',
    'Recycling Integrated Pest Management',
    'Recycling Integrated Pest Management',
    40,
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

insert into
  public.team_code (
    team_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
values
  (
    'PLAN',
    'Planned',
    'Planned',
    50,
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

insert into
  public.team (
    team_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
values
  (
    'HI',
    'EPO',
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

insert into
  public.team (
    team_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
values
  (
    'OPS',
    'EPO',
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

insert into
  public.team (
    team_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
values
  (
    'PLAN',
    'EPO',
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

insert into
  public.team (
    team_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
values
  (
    'REACTIVE',
    'EPO',
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

insert into
  public.team (
    team_code,
    agency_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
values
  (
    'RIPM',
    'EPO',
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

--
-- insert new agency codes
--
insert into
  agency_code (
    agency_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
values
  (
    'FLNRO',
    'FLNRO',
    'FLNRO',
    10,
    true,
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'EAO',
    'EAO',
    'Environmental Assessment Office',
    20,
    true,
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'OIL_GAS',
    'OIL_GAS',
    'Oil and Gas Commision',
    30,
    true,
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'AGR_LAND',
    'AGR_LAND',
    'Agriculture Lands Commission',
    40,
    true,
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'MINES',
    'MINES',
    'Ministry of Energy and Mines',
    50,
    true,
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

--------------------------
-- Table entities for method_complaint_received_code load
-------------------------

insert into
    public.complaint_method_received_code (
        complaint_method_received_code,
        short_description,
        long_description,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp
    )
values
    (
        'BC_WLD_FD',
        'BC_WLD_FD',
        'BC wildlife federation app',
        10,
        true,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        'FLYWAY',
        CURRENT_TIMESTAMP
    ),
    (
        'DGIR_FWD',
        'DGIR_FWD',
        'DGIR forward',
        20,
        true,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        'FLYWAY',
        CURRENT_TIMESTAMP
    ),
    (
        'DRCT_CNTCT',
        'DRCT_CNTCT',
        'Direct contact',
        30,
        true,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        'FLYWAY',
        CURRENT_TIMESTAMP
    ),
    (
        'MIN_OFFICE',
        'MIN_OFFICE',
        'Minister''s office',
        40,
        true,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        'FLYWAY',
        CURRENT_TIMESTAMP
    ),
    (
        'OBSRVD_FLD',
        'OBSRVD_FLD',
        'Observed in field ',
        50,
        true,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        'FLYWAY',
        CURRENT_TIMESTAMP
    ),
    (
        'RAPP',
        'RAPP',
        'RAPP',
        60,
        true,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        'FLYWAY',
        CURRENT_TIMESTAMP
    ),
    (
        'RFRL',
        'RFRL',
        'Referral',
        70,
        true,
        'FLYWAY',
        CURRENT_TIMESTAMP,
        'FLYWAY',
        CURRENT_TIMESTAMP
    ) on conflict do nothing;

INSERT INTO public.comp_mthd_recv_cd_agcy_cd_xref (agency_code,complaint_method_received_code,active_ind,create_user_id,create_utc_timestamp,update_user_id,update_utc_timestamp)
	VALUES ('COS','BC_WLD_FD',true,'FLYWAY',CURRENT_TIMESTAMP,'FLYWAY',CURRENT_TIMESTAMP);
INSERT INTO public.comp_mthd_recv_cd_agcy_cd_xref (agency_code,complaint_method_received_code,active_ind,create_user_id,create_utc_timestamp,update_user_id,update_utc_timestamp)
	VALUES ('COS','DRCT_CNTCT',true,'FLYWAY',CURRENT_TIMESTAMP,'FLYWAY',CURRENT_TIMESTAMP);
INSERT INTO public.comp_mthd_recv_cd_agcy_cd_xref (agency_code,complaint_method_received_code,active_ind,create_user_id,create_utc_timestamp,update_user_id,update_utc_timestamp)
	VALUES ('COS','OBSRVD_FLD',true,'FLYWAY',CURRENT_TIMESTAMP,'FLYWAY',CURRENT_TIMESTAMP);
INSERT INTO public.comp_mthd_recv_cd_agcy_cd_xref (agency_code,complaint_method_received_code,active_ind,create_user_id,create_utc_timestamp,update_user_id,update_utc_timestamp)
	VALUES ('COS','RAPP',true,'FLYWAY',CURRENT_TIMESTAMP,'FLYWAY',CURRENT_TIMESTAMP);
INSERT INTO public.comp_mthd_recv_cd_agcy_cd_xref (agency_code,complaint_method_received_code,active_ind,create_user_id,create_utc_timestamp,update_user_id,update_utc_timestamp)
	VALUES ('COS','RFRL',true,'FLYWAY',CURRENT_TIMESTAMP,'FLYWAY',CURRENT_TIMESTAMP);
INSERT INTO public.comp_mthd_recv_cd_agcy_cd_xref (agency_code,complaint_method_received_code,active_ind,create_user_id,create_utc_timestamp,update_user_id,update_utc_timestamp)
	VALUES ('EPO','DGIR_FWD',true,'FLYWAY',CURRENT_TIMESTAMP,'FLYWAY',CURRENT_TIMESTAMP);
INSERT INTO public.comp_mthd_recv_cd_agcy_cd_xref (agency_code,complaint_method_received_code,active_ind,create_user_id,create_utc_timestamp,update_user_id,update_utc_timestamp)
	VALUES ('EPO','DRCT_CNTCT',true,'FLYWAY',CURRENT_TIMESTAMP,'FLYWAY',CURRENT_TIMESTAMP);
INSERT INTO public.comp_mthd_recv_cd_agcy_cd_xref (agency_code,complaint_method_received_code,active_ind,create_user_id,create_utc_timestamp,update_user_id,update_utc_timestamp)
	VALUES ('EPO','MIN_OFFICE',true,'FLYWAY',CURRENT_TIMESTAMP,'FLYWAY',CURRENT_TIMESTAMP);
INSERT INTO public.comp_mthd_recv_cd_agcy_cd_xref (agency_code,complaint_method_received_code,active_ind,create_user_id,create_utc_timestamp,update_user_id,update_utc_timestamp)
	VALUES ('EPO','RAPP',true,'FLYWAY',CURRENT_TIMESTAMP,'FLYWAY',CURRENT_TIMESTAMP);
INSERT INTO public.comp_mthd_recv_cd_agcy_cd_xref (agency_code,complaint_method_received_code,active_ind,create_user_id,create_utc_timestamp,update_user_id,update_utc_timestamp)
	VALUES ('EPO','RFRL',true,'FLYWAY',CURRENT_TIMESTAMP,'FLYWAY',CURRENT_TIMESTAMP);


--------------------------
-- New Changes above this line
-------------------------
UPDATE configuration
SET
  configuration_value = configuration_value::int + 1
WHERE
  configuration_code = 'CDTABLEVER';