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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  office (
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
  person (
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
  person (
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
  person (
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
  person (
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
  person (
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
  person (
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
    '97f3cee5-6f4a-410f-810f-d431595fccee'::uuid,
    'Jonathan',
    NULL,
    NULL,
    'Funk',
    'FLYWAY',
    '2023-06-29 22:16:16.754',
    'FLYWAY',
    '2023-06-29 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
  person (
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
  person (
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
  person (
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
  person (
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
  person (
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
    '141ebe0c-84c5-487d-8676-caee5de53b36'::uuid,
    'Mike',
    NULL,
    NULL,
    'Vesprini',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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

INSERT INTO
  person (
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
    '0c002922-d315-4fda-8fc5-3793dac12be8'::uuid,
    'Joshua',
    NULL,
    NULL,
    'Gamache',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:16:16.754'
  ) ON CONFLICT
DO NOTHING;

-- Peace Pilot Users: Fort St. John --
INSERT INTO
  person (
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
  person (
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
  person (
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
  person (
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
  person (
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
  person (
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
  person (
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
  person (
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
  person (
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
  person (
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
  person (
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
  person (
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
  person (
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

INSERT INTO
  person (
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
    '0667495f-61a5-4d3b-b756-1ee58cb38e23'::uuid,
    'Ryan',
    NULL,
    NULL,
    'Rondeau',
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
  office (
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
  officer (
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
  officer (
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
  officer (
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
  officer (
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
  officer (
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
  officer (
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
    'b17ee2c1-a26b-4911-ac6f-810b8fdfaab3'::uuid,
    'JFUNK',
    'FLYWAY',
    '2023-06-29 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:20:48.186',
    '97f3cee5-6f4a-410f-810f-d431595fccee'::uuid,
    'c3d8519c-73cb-48a1-8058-358883d5ef4f'::uuid,
    'f896cbb2d5254e54a4ad581dc80681d1'::uuid
  ) ON CONFLICT
DO NOTHING;
-- Fix keycloak name
UPDATE
  officer
SET
  user_id = 'JONFUNK'
WHERE
  (
    officer_guid = 'b17ee2c1-a26b-4911-ac6f-810b8fdfaab3'
    AND user_id = 'JFUNK'
  );

INSERT INTO
  officer (
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
  officer (
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
  officer (
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
  officer (
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
  officer (
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
    '44123934-a2cf-4eae-88af-f682f7548f89'::uuid,
    'MVESPRIN',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:20:48.186',
    '141ebe0c-84c5-487d-8676-caee5de53b36'::uuid,
    'c3d8519c-73cb-48a1-8058-358883d5ef4f'::uuid,
    '01a5ad69-0675-4359-a0a7-909f55e2c67a'::uuid
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
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
    '236fb546-fae1-47fd-b4c7-d108c0030ee2'::uuid,
    'JGAMACHE',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:20:48.186',
    '0c002922-d315-4fda-8fc5-3793dac12be8'::uuid,
    'c3d8519c-73cb-48a1-8058-358883d5ef4f'::uuid,
    '13D3F179-F4CE-4464-A981-141061FD4E58'::uuid
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
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
  officer (
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
  officer (
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
  officer (
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
  officer (
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
  officer (
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
  officer (
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
  officer (
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
  officer (
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
  officer (
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
  officer (
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
  officer (
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
  officer (
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
  officer (
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

INSERT INTO
  officer (
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
    '06ff894b-3895-4d32-8a4a-1fcc0be23e47'::uuid,
    'RRONDEAU',
    'FLYWAY',
    '2024-01-22 22:16:16.754',
    'FLYWAY',
    '2024-01-22 22:20:48.186',
    '0667495f-61a5-4d3b-b756-1ee58cb38e23'::uuid,
    'c3d8519c-73cb-48a1-8058-358883d5ef4f'::uuid,
    '77c6040d69b74757903f1cba37404db4'::uuid
  ) ON CONFLICT
DO NOTHING;

-- Reset offices to nr-compliance-enforcement values
UPDATE officer
SET
  office_guid = 'cdd9964e-7878-44c1-b4a2-0290c6345dec'
WHERE
  office_guid = '914f8725-7100-4f56-a39b-1c18b0eccb55';

UPDATE officer
SET
  office_guid = 'b494082e-35a3-468f-8955-4aa002066b36'
WHERE
  office_guid = '39e7ad0a-20b1-48b4-be70-dfcc5bc01c3c';

UPDATE officer
SET
  office_guid = 'b494082e-35a3-468f-8955-4aa002066b36'
WHERE
  office_guid = '05633ab9-1502-4566-9364-4b3dac7c1354';

UPDATE officer
SET
  office_guid = 'b494082e-35a3-468f-8955-4aa002066b36'
WHERE
  office_guid = '7da19946-4525-43ff-b4b6-d243a2addaaa';

UPDATE officer
SET
  office_guid = 'b494082e-35a3-468f-8955-4aa002066b36'
WHERE
  office_guid = '4b3a8974-1975-4aaf-9e0a-2d3f5d217805';

-- Fixing spelling issue
UPDATE attractant_code
SET
  long_description = 'Barbeque'
WHERE
  short_description = 'BBQ'
  AND attractant_code = 'BBQ';

UPDATE attractant_code
SET
  short_description = 'Fruit/Berries'
WHERE
  long_description = 'Residential Fruit/Berries'
  AND attractant_code = 'RESFRUIT';

UPDATE attractant_code
SET
  short_description = 'Hunter Kill'
WHERE
  long_description = 'Wildlife:Hunter Kill'
  AND attractant_code = 'WLDLFEHK';

-- Changing display order of attractants
UPDATE attractant_code
SET
  display_order = 8
WHERE
  attractant_code = 'RESFRUIT';

UPDATE attractant_code
SET
  display_order = 9
WHERE
  attractant_code = 'GARBAGE';

UPDATE attractant_code
SET
  display_order = 10
WHERE
  attractant_code = 'WLDLFEHK';

UPDATE attractant_code
SET
  display_order = 11
WHERE
  attractant_code = 'INDCAMP';

UPDATE attractant_code
SET
  display_order = 12
WHERE
  attractant_code = 'LIVESTCK';

UPDATE attractant_code
SET
  display_order = 13
WHERE
  attractant_code = 'LVSFEED';

UPDATE attractant_code
SET
  display_order = 14
WHERE
  attractant_code = 'NA';

UPDATE attractant_code
SET
  display_order = 15
WHERE
  attractant_code = 'OTHER';

UPDATE attractant_code
SET
  display_order = 16
WHERE
  attractant_code = 'PETFOOD';

UPDATE attractant_code
SET
  display_order = 17
WHERE
  attractant_code = 'PETS';

UPDATE attractant_code
SET
  display_order = 18
WHERE
  attractant_code = 'VEGGARD';

UPDATE attractant_code
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

-- CE-1594 update display order in species_code
UPDATE species_code SET display_order = 10 WHERE species_code = 'BISON';
UPDATE species_code SET display_order = 20 WHERE species_code = 'BLKBEAR';
UPDATE species_code SET display_order = 30 WHERE species_code = 'BOBCAT';
UPDATE species_code SET display_order = 40 WHERE species_code = 'CARIBOU';
UPDATE species_code SET display_order = 50 WHERE species_code = 'COUGAR';
UPDATE species_code SET display_order = 60 WHERE species_code = 'COYOTE';
UPDATE species_code SET display_order = 70 WHERE species_code = 'DEER';
UPDATE species_code SET display_order = 80 WHERE species_code = 'ELK';
UPDATE species_code SET display_order = 90 WHERE species_code = 'FOX';
UPDATE species_code SET display_order = 100 WHERE species_code = 'GRZBEAR';
UPDATE species_code SET display_order = 110 WHERE species_code = 'FERALHOG';
UPDATE species_code SET display_order = 120 WHERE species_code = 'LYNX';
UPDATE species_code SET display_order = 130 WHERE species_code = 'MOOSE';
UPDATE species_code SET display_order = 140 WHERE species_code = 'MTNGOAT';
UPDATE species_code SET display_order = 150 WHERE species_code = 'OTHER';
UPDATE species_code SET display_order = 160 WHERE species_code = 'RACCOON';
UPDATE species_code SET display_order = 170 WHERE species_code = 'RAPTOR';
UPDATE species_code SET display_order = 180 WHERE species_code = 'RATTLER';
UPDATE species_code SET display_order = 190 WHERE species_code = 'RVROTTER';
UPDATE species_code SET display_order = 200 WHERE species_code = 'SKUNK';
UPDATE species_code SET display_order = 210 WHERE species_code = 'UNKNOWN';
UPDATE species_code SET display_order = 220 WHERE species_code = 'WLDSHEEP';
UPDATE species_code SET display_order = 230 WHERE species_code = 'WOLF';
UPDATE species_code SET display_order = 240 WHERE species_code = 'WOLVERN';

--------------------------
-- Staging Activities for webEOC load
-------------------------
insert into
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
  staging_status_code (
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
  entity_code (
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
update geo_organization_unit_code
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

-------------------------
-- Update GIR type code
-------------------------

UPDATE gir_type_code SET short_description = 'Contact', long_description = 'Contact' WHERE gir_type_code = 'COCNT';
UPDATE gir_type_code SET short_description = 'Disposition', long_description = 'Disposition' WHERE gir_type_code = 'CODSP';


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
  entity_code (
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
  'COM_FLTR',
  'Community Filter',
  'Community Filter',
  50,
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
  'D_L_FLTR',
  'Date Logged Filter',
  'Date Logged Filter',
  60,
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
  'GIR_FLTR',
  'GIR Type Filter',
  'GIR Type Filter',
  70,
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
  'METH_FLTR',
  'Method Filter',
  'Method Filter',
  80,
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
  'NAT_FLTR',
  'Nature of Complaint Filter',
  'Nature of Complaint Filter',
  90,
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
  'OFF_FLTR',
  'Officer Assigned Filter',
  'Officer Assigned Filter',
  100,
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
  'REG_FLTR',
  'Region Filter',
  'Region Filter',
  110,
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
  'SPEC_FLTR',
  'Species Filter',
  'Species Filter',
  120,
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
  'STAT_FLTR',
  'Status Filter',
  'Status Filter',
  130,
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
  'VIOL_FLTR',
  'Violation Type Filter',
  'Violation Type Filter',
  140,
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
  'ZONE_FLTR',
  'Zone Filter',
  'Zone Filter',
  60,
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
  'OUT_A_FLTR',
  'Outcome Animal Filter',
  'Outcome Animal Filter',
  180,
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
  'OUT_D_FLTR',
  'Outcome Animal Date Filter',
  'Outcome Animal Date Filter',
  190,
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
  'PARKCOL',
  'Park Column',
  'Displays the Park column in the list view',
  250,
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
  'AUTHCOL',
  'Authorization Column',
  'Displays the Authorization column in the list view',
  250,
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
  'LCTNCOL',
  'Location/address Column',
  'Displays the Location/address column in the list view',
  260,
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
  'AC_BY_FLTR',
  'Outcome actioned by filter',
  'Displays actioned by option for certain HWCR outcomes',
  270,
  'Y',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;


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
  'OUT_A_FLTR',
  'COS',
  'Y',
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
  'OUT_A_FLTR',
  'PARKS',
  'Y',
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
  'OUT_D_FLTR',
  'COS',
  'Y',
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
  'OUT_D_FLTR',
  'PARKS',
  'Y',
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
  'AC_BY_FLTR',
  'COS',
  'Y',
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
  'AC_BY_FLTR',
  'PARKS',
  'Y',
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
  'COM_FLTR',
  'COS',
  'Y',
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
  'D_L_FLTR',
  'COS',
  'Y',
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
  'GIR_FLTR',
  'COS',
  'Y',
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
  'METH_FLTR',
  'COS',
  'Y',
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
  'NAT_FLTR',
  'COS',
  'Y',
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
  'OFF_FLTR',
  'COS',
  'Y',
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
  'REG_FLTR',
  'COS',
  'Y',
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
  'SPEC_FLTR',
  'COS',
  'Y',
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
  'STAT_FLTR',
  'COS',
  'Y',
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
  'VIOL_FLTR',
  'COS',
  'Y',
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
  'ZONE_FLTR',
  'COS',
  'Y',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

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
  'COM_FLTR',
  'EPO',
  'Y',
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
  'D_L_FLTR',
  'EPO',
  'Y',
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
  'GIR_FLTR',
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
  'METH_FLTR',
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
  'NAT_FLTR',
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
  'OFF_FLTR',
  'EPO',
  'Y',
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
  'REG_FLTR',
  'EPO',
  'Y',
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
  'SPEC_FLTR',
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
  'STAT_FLTR',
  'EPO',
  'Y',
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
  'VIOL_FLTR',
  'EPO',
  'Y',
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
  'ZONE_FLTR',
  'EPO',
  'N',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

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
  'COM_FLTR',
  'PARKS',
  'Y',
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
  'D_L_FLTR',
  'PARKS',
  'Y',
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
  'GIR_FLTR',
  'PARKS',
  'Y',
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
  'METH_FLTR',
  'PARKS',
  'Y',
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
  'NAT_FLTR',
  'PARKS',
  'Y',
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
  'OFF_FLTR',
  'PARKS',
  'Y',
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
  'REG_FLTR',
  'PARKS',
  'Y',
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
  'SPEC_FLTR',
  'PARKS',
  'Y',
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
  'STAT_FLTR',
  'PARKS',
  'Y',
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
  'VIOL_FLTR',
  'PARKS',
  'Y',
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
  'ZONE_FLTR',
  'PARKS',
  'Y',
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
  'PARKCOL',
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
  'PARKCOL',
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
  'PARKCOL',
  'PARKS',
  'Y',
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
  'AUTHCOL',
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
  'AUTHCOL',
  'EPO',
  'Y',
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
  'AUTHCOL',
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
  'LCTNCOL',
  'COS',
  'Y',
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
  'LCTNCOL',
  'EPO',
  'Y',
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
  'LCTNCOL',
  'PARKS',
  'N',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;




-------------------------
-- Insert Team Codes
-------------------------
insert into
  team_code (
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
  team_code (
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
  team_code (
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
  team_code (
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
  team_code (
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
  team_code (
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
    'EPD',
    'Environmental Protection Division',
    'Environmental Protection Division',
    5,
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;


insert into
  team (
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
  team (
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
  team (
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
  team (
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
  team (
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

insert into
  team (
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
    'EPD',
    'EPO',
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

--------------------------
-- Table entities for method_complaint_received_code load
-------------------------
insert into
  complaint_method_received_code (
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
  ) on conflict
do nothing;

INSERT INTO
  comp_mthd_recv_cd_agcy_cd_xref (
    agency_code,
    complaint_method_received_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'COS',
    'BC_WLD_FD',
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  comp_mthd_recv_cd_agcy_cd_xref (
    agency_code,
    complaint_method_received_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'COS',
    'DRCT_CNTCT',
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  comp_mthd_recv_cd_agcy_cd_xref (
    agency_code,
    complaint_method_received_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'COS',
    'OBSRVD_FLD',
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  comp_mthd_recv_cd_agcy_cd_xref (
    agency_code,
    complaint_method_received_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'COS',
    'RAPP',
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  comp_mthd_recv_cd_agcy_cd_xref (
    agency_code,
    complaint_method_received_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'COS',
    'RFRL',
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  comp_mthd_recv_cd_agcy_cd_xref (
    agency_code,
    complaint_method_received_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'EPO',
    'DGIR_FWD',
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  comp_mthd_recv_cd_agcy_cd_xref (
    agency_code,
    complaint_method_received_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'EPO',
    'DRCT_CNTCT',
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  comp_mthd_recv_cd_agcy_cd_xref (
    agency_code,
    complaint_method_received_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'EPO',
    'MIN_OFFICE',
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  comp_mthd_recv_cd_agcy_cd_xref (
    agency_code,
    complaint_method_received_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'EPO',
    'RAPP',
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  comp_mthd_recv_cd_agcy_cd_xref (
    agency_code,
    complaint_method_received_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'EPO',
    'RFRL',
    true,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

--
-- create new feature for privacy-requested
--
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
  'PRIV_REQ',
  'Privacy Requested',
  'Enables the privacy requested field when creating a new complaint',
  150,
  'Y',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

--
-- create new xrefs for new privacy-requested feature
--
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
  'PRIV_REQ',
  'EPO',
  'Y',
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
  'PRIV_REQ',
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
  'PRIV_REQ',
  'PARKS',
  'N',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

--------------------------
-- CE-951 CEEB Initial Users
-------------------------
-- Person Records
INSERT INTO
  person (
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
    '5469db87-a942-4b52-825d-c808da1ef531',
    'Bryan',
    NULL,
    NULL,
    'Vroom',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'e8c85e50-c123-4c45-a5d2-10348d423d78',
    'Gina',
    NULL,
    NULL,
    'Tamm',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'ea43cf10-72ac-43f8-80ea-89dd4917ae7d',
    'Connor',
    NULL,
    NULL,
    'Fraleigh',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'f4d24021-b73f-4aa8-82b2-f291052fca1b',
    'Rebecca ',
    NULL,
    NULL,
    'Benham',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'dc9d810b-5c42-4648-aa4a-8da17a141059',
    'Taryn',
    NULL,
    NULL,
    'Angus',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'd09d10d9-e431-431d-bf39-31504fd403d2',
    'Oana',
    NULL,
    NULL,
    'Enick',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'c5faeeb4-e9dd-47b3-8f97-b53f57de9fbf',
    'Katie',
    NULL,
    NULL,
    'Howett',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    '9327da85-9b1f-47b0-8b5e-22b4f8734c2f',
    'Kyle',
    NULL,
    NULL,
    'Lynch',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    '5771827b-1e24-4292-aaac-562ef00f5e08',
    'Jurgen',
    NULL,
    NULL,
    'Deagle',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'b59b956b-deae-4d7f-883b-edaf0869ed90',
    'Ross',
    NULL,
    NULL,
    'Blake',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    '246e5454-7984-4d30-943a-fc1c0a1c14d8',
    'Michael',
    NULL,
    NULL,
    'Lapham',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    '98472f43-cfa3-4cd4-983d-4abd9efa0b0b',
    'Rafiullah',
    NULL,
    NULL,
    'Sahibzada',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'c8836549-3174-4ec0-bbaa-5a4d00ce1595',
    'Alexis',
    NULL,
    NULL,
    'Friesen',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'bf7ff57d-6add-42c6-b081-c56432b07eb7',
    'Linda',
    NULL,
    NULL,
    'Pawson',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    '7fc49d76-3f74-44bc-96dd-e909175a7e6c',
    'Darren',
    NULL,
    NULL,
    'Stewart',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    '25f40438-46cb-4166-8dcc-42439bc8e87a',
    'Keith',
    NULL,
    NULL,
    'Connolly',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'fa98adab-1f52-4078-a828-ecaa2abc02e5',
    'Anthony',
    NULL,
    NULL,
    'Sarraino',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    '4ef0b568-d3fd-498a-8b08-1f48dcbe898a',
    'Jamie',
    NULL,
    NULL,
    'Mercier',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    '6cd37458-61db-4c4a-857f-8eb71c438f5f',
    'Travis',
    NULL,
    NULL,
    'Kurinka',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    '30a85846-92ce-48a8-90dd-136f43453300',
    'Michael',
    NULL,
    NULL,
    'Jeffery',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'c69de99d-96f1-4296-ba16-5884a16f749c',
    'Vahab',
    NULL,
    NULL,
    'Nazeri',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    '94ba6186-fe58-451b-a954-44332e20bad9',
    'Jiabin',
    NULL,
    NULL,
    'Liu',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'b1db7648-5393-4be0-a968-913e475a695e',
    'Chris',
    NULL,
    NULL,
    'White',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    '6399a3fa-44ef-414b-a001-e62c9b33863b',
    'Christine',
    NULL,
    NULL,
    'Combe',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    '4b909d1b-43a8-4f4a-95d5-3dc8e5c5bb26',
    'Haylea',
    NULL,
    NULL,
    'Van Vaals',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'b08e71ee-86e4-4dcd-8d74-e382ac5a7bd3',
    'Kristan Robinson',
    NULL,
    NULL,
    'Robinson',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    '69353a89-2df4-4bc9-bd14-eb55d656c4c5',
    'Kelly',
    NULL,
    NULL,
    'Mills',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    '0296cff1-4d54-4527-b064-8cb0ae42f2b4',
    'Jack',
    NULL,
    NULL,
    'Green',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'd8b51060-421a-4e32-9d7b-22ce1ed8dad5',
    'Katelyn',
    NULL,
    NULL,
    'Dick',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'ac7f8da7-0490-44f7-a5d0-68e34332b1e3',
    'Natasha',
    NULL,
    NULL,
    'Olsoff',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'eb6bfe40-cd2d-4b81-a1af-315b49dc3640',
    'Ben',
    NULL,
    NULL,
    'McKinnon',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    '0448033a-0e0d-4a23-a496-7111b7b8edd9',
    'Steven',
    NULL,
    NULL,
    'Pasichnuk',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    '7d2649d9-69ab-452f-b6d4-593786db0ebd',
    'Jenna',
    NULL,
    NULL,
    'Rathman',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'c3c2ae30-33b5-41ac-b389-70d372e5c67f',
    'Patricia',
    NULL,
    NULL,
    'Burley',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'cbf2eb1c-bfc4-4a0c-ad96-86e313e5e4c5',
    'Jason',
    NULL,
    NULL,
    'Bourgeois',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    '083b09d1-61ce-4a57-9ca2-8f04a53416c1',
    'Nadine',
    NULL,
    NULL,
    'Schwager',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'a0e23621-ae6f-4919-a837-51ae93249721',
    'Kevin',
    NULL,
    NULL,
    'Vu',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'c4ec0073-d6e5-420e-929c-45406d7f658b',
    'Laura',
    NULL,
    NULL,
    'Hunse',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'd8b4d7f6-9805-4805-928d-cb23be9f5478',
    'Christine',
    NULL,
    NULL,
    'Turlet',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    '83105952-7fb0-4386-a099-8499fbc41905',
    'Jennifer',
    NULL,
    NULL,
    'Mayberry',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    '373aa5b1-5f7c-47e8-8df3-e8c6b912d73f',
    'Stephanie',
    NULL,
    NULL,
    'Little',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    '0bf8b025-987c-4dd3-a1b5-e7c89a649aef',
    'Ashly',
    NULL,
    NULL,
    'Dixon',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'e92834d3-7851-4f63-a90c-4810405971fb',
    'Tamara',
    NULL,
    NULL,
    'Mickel',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  person (
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
    'd22dbeeb-c1e7-43a6-9ea3-1df8f2c2067b',
    'Brady',
    NULL,
    NULL,
    'Nelless',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

-- Officer Records
INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '8518cda0-9d3f-47aa-a5f9-75b4a7675841',
    'BVROOM',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    '5469db87-a942-4b52-825d-c808da1ef531',
    '55B94622685C4E67BCF2591CCBA92A52',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '7a3289fe-a2cd-4644-80c9-c8977b79fb87',
    'GTAMM',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'e8c85e50-c123-4c45-a5d2-10348d423d78',
    '83ec53d2d54d4aa1ab2547deed10c5cf',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '41544626-9ff0-4c99-871e-8563635682fb',
    'CFRALEIG',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'ea43cf10-72ac-43f8-80ea-89dd4917ae7d',
    'e8bdb58f3712472a83a4b9ca0bd77c4b',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '0d39faf9-5827-41f6-9e57-9a2eb9215825',
    'RBENHAM',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'f4d24021-b73f-4aa8-82b2-f291052fca1b',
    '12a5f2137403481d903e2279a02b4b08',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '7a31605b-ab01-49b8-ab21-868d7236baae',
    'TANGUS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'dc9d810b-5c42-4648-aa4a-8da17a141059',
    '67479601dc8048a58cb30bf7cadcb3a2',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    'abe6518a-ad86-4644-98f4-d1fea03dbfe9',
    'OANENICK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'd09d10d9-e431-431d-bf39-31504fd403d2',
    '1fdf2193b0dd4c1fbe3e0ac83ef06fa0',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '513aadd9-ee44-443c-b45f-43f7c76f8382',
    'KHOWETT',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'c5faeeb4-e9dd-47b3-8f97-b53f57de9fbf',
    'f069ec7672a04b17bca66bad643b73eb',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    'be0a2ff8-7a03-451e-ad7a-1d504db887be',
    'KYLYNCH',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    '9327da85-9b1f-47b0-8b5e-22b4f8734c2f',
    '6b2dc57fc73b40a082dbf09ee209ba34',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '255bba5a-505d-4b91-a9e8-182589ee2054',
    'JDEAGLE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    '5771827b-1e24-4292-aaac-562ef00f5e08',
    '0b3087a03733425293233e2fa2186ffc',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '900b2f22-5143-4a16-ab58-a1553852c1ac',
    'RBLAKE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'b59b956b-deae-4d7f-883b-edaf0869ed90',
    '69afcc605c384205a3ddb60146596a16',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '5223b623-b500-42ca-8d12-4cb870a7fc99',
    'MLAPHAM',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    '246e5454-7984-4d30-943a-fc1c0a1c14d8',
    '97ffa5c2bb0049cbb1f9fac3cabe235d',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '655c39e5-41ce-4e13-836f-e3a8d0466271',
    'RSAHIBZA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    '98472f43-cfa3-4cd4-983d-4abd9efa0b0b',
    '2193bc014ff54f7994827d46c39a6b89',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '49089e00-50df-4686-ad73-d82216432ef9',
    'AFRIESEN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'c8836549-3174-4ec0-bbaa-5a4d00ce1595',
    'cf2b42274ef248c08136e5df138ff8ae',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '4a2a60e1-7710-4be4-b905-6f7ff4f62fd3',
    'LPAWSON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'bf7ff57d-6add-42c6-b081-c56432b07eb7',
    '5e3a744cb3aa4db8900dbd4d700dab32',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    'cf80b4a1-4d23-4c1d-a8e3-b1b5006126dd',
    'DARSTEWA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    '7fc49d76-3f74-44bc-96dd-e909175a7e6c',
    '5eadbd98caef41c880785aa2b4bf4f0e',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    'b42da2be-e651-402e-a506-bf70688fea37',
    'KCONNOLL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    '25f40438-46cb-4166-8dcc-42439bc8e87a',
    '7ba21b59eed342ecbc88657aacd34cd5',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '07412e24-b076-47a0-8521-80fd42c2a8d4',
    'ASARRAIN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'fa98adab-1f52-4078-a828-ecaa2abc02e5',
    '2255b48444c8400b8857052081c49be6',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '3da8314c-7c16-4848-8cf8-0fbdf2b9c0ff',
    'JAMMERCI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    '4ef0b568-d3fd-498a-8b08-1f48dcbe898a',
    '1da450c8e0f14873bfe11c158adff270',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '2fd165c8-6178-4ae3-99c0-ce10425577de',
    'TKURINKA',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    '6cd37458-61db-4c4a-857f-8eb71c438f5f',
    '548cde0952294f898f932cd79f2f3db4',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '8217f895-3865-4256-af5f-e536577fc9f9',
    'MIJEFFER',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    '30a85846-92ce-48a8-90dd-136f43453300',
    '8323d5a207ca403a993c9c91c1f702db',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '2c7a0705-129d-49e2-abee-66a53a8baaf6',
    'VNAZERI',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'c69de99d-96f1-4296-ba16-5884a16f749c',
    'b2a780a21d2542d4bee05bb7634712bb',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '7d589cd2-e796-45bb-bb12-62fbd13c9f03',
    'JILIU',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    '94ba6186-fe58-451b-a954-44332e20bad9',
    'c2a44e0ecabd4affaac9ca423c5a0145',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '4d6bce0e-34db-4e07-ba2b-387a9775077d',
    'CJWHITE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'b1db7648-5393-4be0-a968-913e475a695e',
    '6f837618f9ae4b96938b0b6673e714e4',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    'fc649352-5e0d-4ea0-a5a4-3f6f7855451f',
    'CCOMBE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    '6399a3fa-44ef-414b-a001-e62c9b33863b',
    '6ea94fdddf3a439eaa51ef61824e99b0',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    'fd427bc5-fddf-47bb-90be-7725ada5d913',
    'HVANVAAL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    '4b909d1b-43a8-4f4a-95d5-3dc8e5c5bb26',
    '276ddb03437649c1a3f43689cf254840',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '55f91b30-ab61-4374-8ec8-669bc85fc744',
    'KROBINSO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'b08e71ee-86e4-4dcd-8d74-e382ac5a7bd3',
    'b8ad0911fd3445bfbc7c629f468d19c4',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    'd46b8a99-216a-4b5d-9ba0-0643c254b5ae',
    'KEMILLS',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    '69353a89-2df4-4bc9-bd14-eb55d656c4c5',
    '86911022CBAD4B71AC8DD11C12BC841D',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    'fed45857-9323-496e-84a5-d96b7b032bc3',
    'JEGREEN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    '0296cff1-4d54-4527-b064-8cb0ae42f2b4',
    '300e8e5b85df4888b0c39b08d48ca094',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    'a96d4c1b-7f0c-40fc-8406-004a836498d7',
    'KDICK',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'd8b51060-421a-4e32-9d7b-22ce1ed8dad5',
    'c45a224494eb44b8adb5d3e0102ca93a',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    'bf896bea-8d0e-4bc1-ace8-726e8d3ada7e',
    'NOLSOFF',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'ac7f8da7-0490-44f7-a5d0-68e34332b1e3',
    '268c43eaaf0f47dc8b92447b2d4e167f',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    'd31dff78-997b-4229-b3b2-6c8735567c02',
    'BENMCKIN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'eb6bfe40-cd2d-4b81-a1af-315b49dc3640',
    '7756f1f0ff744160a5c57bd27edd2e5b',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '66dfe65a-c7c7-459c-8405-d6447d6c261c',
    'SPASICHN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    '0448033a-0e0d-4a23-a496-7111b7b8edd9',
    '9547910ec4ad4bd98c79293ab8207143',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '2d3e6d63-c987-4ed8-95d4-5b9a82d01a8c',
    ' JRATHMAN',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    '7d2649d9-69ab-452f-b6d4-593786db0ebd',
    '703d8cfe75814626a4cc60a11d9c9448',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '541feb53-1c53-48be-b2e1-933c79861e99',
    'PBURLEY',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'c3c2ae30-33b5-41ac-b389-70d372e5c67f',
    'abce6f98d40d43558b13d4a6e11cbbf4',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '82848fe9-b648-4a80-8701-7759e85fe922',
    'JBOURGEO',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'cbf2eb1c-bfc4-4a0c-ad96-86e313e5e4c5',
    '49426B8E696A43A992C13ACBCC82151A',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    'f1384e56-b033-44d2-8514-c8700531b2bf',
    'NSCHWAGE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    '083b09d1-61ce-4a57-9ca2-8f04a53416c1',
    '5981920cfcb844269ce42cf5c451e8b8',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '3bb5dfa2-c22c-48ac-8fb5-7afc522d8dab',
    'KEVINVU',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'a0e23621-ae6f-4919-a837-51ae93249721',
    'f9a49ae5b4ba47c1b35c419a3586f991',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '8a87a8b7-6f57-4d2a-a156-60c6bb284887',
    'LAHUNSE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'c4ec0073-d6e5-420e-929c-45406d7f658b',
    '89b8b7f2b8a947cd8b11b8c96f94e00a',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '11a40b42-74ad-4ae2-95ce-52e020f7b426',
    'CTURLET',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'd8b4d7f6-9805-4805-928d-cb23be9f5478',
    'dce57bffaf064f77b46882cb480888ab',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    'c535ef38-b191-4ae6-897f-dcc0d1a1421d',
    'JMAYBERR',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    '83105952-7fb0-4386-a099-8499fbc41905',
    'e26ee5bf3a1f4cb8ac3e499eb0a88fb3',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '43af02a8-e5b7-434f-b72e-d68d4680b473',
    'STLITTLE',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    '373aa5b1-5f7c-47e8-8df3-e8c6b912d73f',
    '836cfc9bc31549219c418cdf5a8f8e7b',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    'd3c1de9b-a041-4d11-ad50-70a4c81f87d0',
    'ASDIXON',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    '0bf8b025-987c-4dd3-a1b5-e7c89a649aef',
    '68fcb16abe3945bfbd601a4f7e302ebc',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '2f7c7aca-2249-4cb1-b3ac-01a92ccb6b4d',
    'TMICKEL',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'e92834d3-7851-4f63-a90c-4810405971fb',
    'bd01c32ad91d45ce91505d4275e15fe3',
    NULL
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer (
    officer_guid,
    user_id,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    person_guid,
    auth_user_guid,
    office_guid
  )
VALUES
  (
    '7ba9a601-dc1e-46f4-a3c2-9a4a002303e8',
    'BNELLES',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'd22dbeeb-c1e7-43a6-9ea3-1df8f2c2067b',
    'cf4993216c2a42ef8e6005f0ea7e55bf',
    NULL
  ) ON CONFLICT
DO NOTHING;

-- Teams
INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '40d57eab-9864-4553-9b87-f54814c6bb07',
    '8518cda0-9d3f-47aa-a5f9-75b4a7675841',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'REACTIVE'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '1a7bf5dd-128c-4062-8f0c-200a5d7ffa84',
    '7a3289fe-a2cd-4644-80c9-c8977b79fb87',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'REACTIVE'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'f1509605-3cdd-466c-8c4b-435de93e9cd6',
    '41544626-9ff0-4c99-871e-8563635682fb',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'REACTIVE'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'b628a551-5e55-4203-91dc-d8d77b947bab',
    '0d39faf9-5827-41f6-9e57-9a2eb9215825',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'REACTIVE'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'abd07a80-1feb-4a72-a9b5-a35670e6ad0a',
    '7a31605b-ab01-49b8-ab21-868d7236baae',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'REACTIVE'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '4055351d-d3c6-41fb-ae5d-bd94fa9ec9d5',
    'abe6518a-ad86-4644-98f4-d1fea03dbfe9',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'REACTIVE'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'e8226bdd-28a5-403a-ae85-c1869fb702e2',
    '513aadd9-ee44-443c-b45f-43f7c76f8382',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'REACTIVE'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'be928882-0336-4a80-973d-c800cb945c06',
    'be0a2ff8-7a03-451e-ad7a-1d504db887be',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'REACTIVE'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '28aaa821-a6ac-435f-bd00-59763bd6f4f2',
    '255bba5a-505d-4b91-a9e8-182589ee2054',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'REACTIVE'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '7109d8b7-5154-4935-86d1-305e8a532ead',
    '900b2f22-5143-4a16-ab58-a1553852c1ac',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'REACTIVE'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'fad3dd51-774b-4079-a6c3-116cadadb1ff',
    '5223b623-b500-42ca-8d12-4cb870a7fc99',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'RIPM'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'abbc44ff-78dd-41e5-bf87-4941e3b7d28a',
    '655c39e5-41ce-4e13-836f-e3a8d0466271',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'RIPM'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'cef4a487-2db2-4658-a62e-7990467a0cf7',
    '49089e00-50df-4686-ad73-d82216432ef9',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'RIPM'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '30cf398c-6714-4920-85a5-76063f8b1a63',
    '4a2a60e1-7710-4be4-b905-6f7ff4f62fd3',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'RIPM'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'c4465d85-af74-4d7d-9a15-4c3e0964b452',
    'cf80b4a1-4d23-4c1d-a8e3-b1b5006126dd',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'PLAN'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'c4f58470-fd05-4c75-b40f-83596425dbfd',
    'b42da2be-e651-402e-a506-bf70688fea37',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'PLAN'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '931a6336-c4c3-44ea-9811-119a4d70f3cc',
    '07412e24-b076-47a0-8521-80fd42c2a8d4',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'PLAN'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'a74c026f-7c7c-47ae-bf69-7c541aaf1640',
    '3da8314c-7c16-4848-8cf8-0fbdf2b9c0ff',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'PLAN'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '9bf8813e-a174-4e28-90d8-ddc8c679196d',
    '2fd165c8-6178-4ae3-99c0-ce10425577de',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'PLAN'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'f3e6c599-715c-4870-929f-e67c123f165f',
    '8217f895-3865-4256-af5f-e536577fc9f9',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'PLAN'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '974f76a2-7bb5-46f4-85cc-6dd0e441bf40',
    '2c7a0705-129d-49e2-abee-66a53a8baaf6',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'PLAN'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'abcf1c51-d977-4d7c-8a22-21a6ab39e518',
    '7d589cd2-e796-45bb-bb12-62fbd13c9f03',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'PLAN'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'db3a3dd9-2d8d-47de-9a4f-c792bdbc9bd7',
    '4d6bce0e-34db-4e07-ba2b-387a9775077d',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'PLAN'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '471f75dc-0dca-455a-9705-2dfa271d93ec',
    'fc649352-5e0d-4ea0-a5a4-3f6f7855451f',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'PLAN'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'aab90bd7-2b4f-4d43-8c1b-326657de8583',
    'fd427bc5-fddf-47bb-90be-7725ada5d913',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'PLAN'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '914ba2d1-ec43-4509-ac44-96b22ffa1b27',
    '55f91b30-ab61-4374-8ec8-669bc85fc744',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'PLAN'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '914ba2d1-ec43-4509-ac44-96b22ffa1b27',
    '55f91b30-ab61-4374-8ec8-669bc85fc744',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'HI'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'b1a48533-e304-4834-8fe6-79f36cd0732b',
    'd46b8a99-216a-4b5d-9ba0-0643c254b5ae',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'HI'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '56911779-fa15-4def-b641-d7c4cc646559',
    'fed45857-9323-496e-84a5-d96b7b032bc3',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'HI'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'e7959748-8287-4d97-bc20-c37a07d20ac2',
    'a96d4c1b-7f0c-40fc-8406-004a836498d7',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'HI'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'f16cc618-46c6-4347-8bdc-3ba76915e313',
    'bf896bea-8d0e-4bc1-ace8-726e8d3ada7e',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'HI'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'f2972204-0f3a-4782-81bb-ac19b6542ef1',
    'd31dff78-997b-4229-b3b2-6c8735567c02',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'HI'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '30d770b9-988f-43df-9b44-2bdac5799313',
    '66dfe65a-c7c7-459c-8405-d6447d6c261c',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'HI'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '876685ee-cc61-48f4-9c7a-81116a658a49',
    '2d3e6d63-c987-4ed8-95d4-5b9a82d01a8c',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'HI'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'bd5970a6-3824-4958-bff0-6c0486fa53ce',
    '541feb53-1c53-48be-b2e1-933c79861e99',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'HI'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '7f388d4a-bc69-47ea-83c4-cd4809decbc2',
    '82848fe9-b648-4a80-8701-7759e85fe922',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'OPS'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'b69cc067-3146-43c8-ae9f-c6329b0fe163',
    'f1384e56-b033-44d2-8514-c8700531b2bf',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'OPS'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '891e5df1-d352-4f08-af50-60207a181391',
    '3bb5dfa2-c22c-48ac-8fb5-7afc522d8dab',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'OPS'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '82ec0202-aa7a-4b66-807f-bc5265c5784e',
    '8a87a8b7-6f57-4d2a-a156-60c6bb284887',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'OPS'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '829370c7-b4f1-471b-97dc-64888e21362a',
    '11a40b42-74ad-4ae2-95ce-52e020f7b426',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'OPS'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '5951f821-849f-45ef-8267-8ccb32bce11a',
    'c535ef38-b191-4ae6-897f-dcc0d1a1421d',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'OPS'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '63bc2b3a-c8fa-449b-9ef0-bf9e4fbff0f5',
    '43af02a8-e5b7-434f-b72e-d68d4680b473',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'OPS'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'a07aba96-2525-473e-bca1-7bf70a0323fc',
    'd3c1de9b-a041-4d11-ad50-70a4c81f87d0',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'OPS'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '40cdcdba-2510-4686-8534-66a9b0a7b46f',
    '2f7c7aca-2249-4cb1-b3ac-01a92ccb6b4d',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'OPS'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

INSERT INTO
  officer_team_xref (
    officer_team_xref_guid,
    officer_guid,
    team_guid,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '1baa6327-872e-4a39-b769-79a1b606d599',
    '7ba9a601-dc1e-46f4-a3c2-9a4a002303e8',
    (
      SELECT
        team_guid
      from
        team
      where
        team_code = 'OPS'
        and active_ind = 'Y'
    ),
    'Y',
    'FLYWAY',
    CURRENT_TIMESTAMP,
    'FLYWAY',
    CURRENT_TIMESTAMP
  ) ON CONFLICT
DO NOTHING;

--
-- create new feature for Enable Office
--
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
  'ENBL_OFF',
  'Enable Office',
  'Enables the ability to render the office input and field on a complaint',
  150,
  'Y',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;


--
-- create new xrefs for new enable office feature
--
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
  'ENBL_OFF',
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
  'ENBL_OFF',
  'COS',
  'Y',
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
  'ENBL_OFF',
  'PARKS',
  'Y',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;


UPDATE feature_agency_xref SET active_ind = false WHERE feature_code = 'METH_FLTR' AND agency_code = 'COS';
UPDATE feature_agency_xref SET active_ind = false WHERE feature_code = 'METH_FLTR' AND agency_code = 'PARKS';
UPDATE feature_agency_xref SET active_ind = true WHERE feature_code = 'METH_FLTR' AND agency_code = 'EPO';
UPDATE feature_agency_xref SET active_ind = false WHERE feature_code = 'ENBL_OFF' AND agency_code = 'PARKS';

--
-- create new feature for External Reference
--

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
  'EXTRNALREF',
  'Enable External Reference Number',
  'Enables the ability to display the External Reference Number section on a complaint.',
  150,
  'Y',
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
  'EXTRNALREF',
  'COS',
  'Y',
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
  'EXTRNALREF',
  'PARKS',
  'Y',
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
  'EXTRNALREF',
  'EPO',
  'N',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

--
-- create new feature for Complaint Referrals
--

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
  'COMPREF',
  'Enable Complaint Referrals',
  'Enables the ability to refer the complaint to other agencies.',
  150,
  'Y',
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
  'COMPREF',
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
  'COMPREF',
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
  'COMPREF',
  'EPO',
  'N',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

------------------------
-- New Template: CEEB
------------------------
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
VALUES
  (
    'CEEBTMPLAT',
    '',
    'CDOGS Hash for CEEB Template',
    true,
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

UPDATE hwcr_complaint SET hwcr_complaint_nature_code = 'LIVNCOU' WHERE hwcr_complaint_nature_code = 'COUGARN';
DELETE FROM hwcr_complaint_nature_code WHERE hwcr_complaint_nature_code = 'COUGARN';
DELETE FROM hwcr_complaint_nature_code WHERE long_description = 'Livestock/pets - killed/injured - present/recent (Coyote/Bobcat)';
DELETE FROM hwcr_complaint_nature_code WHERE long_description = 'Livestock/pets - killed/injured - present/recent/suspected (Black/Grizzly Bear, Wolf, Cougar)';
DELETE FROM hwcr_complaint_nature_code WHERE long_description = 'Livestock/pets - killed/injured - not present (No Black/Grizzly Bear, Wolf, Cougar suspected)';
DELETE FROM hwcr_complaint_nature_code WHERE long_description = 'Livestock/pets - killed/injured - (No Black/Grizzly Bear, Wolf, Cougar suspected)';

-------------------------
-- Move Houston in Location Hierarchy
-------------------------

UPDATE geo_org_unit_structure set parent_geo_org_unit_code='SMITHRS' where child_geo_org_unit_code='HOUSTON';

------------------------
-- Add Field under Golden office
------------------------

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
    administrative_office_ind)
values (
    'FIELD',
    'Field',
    'Field', 
    now(), 
    null, 
    user, 
    now(), 
    user, 
    now(), 
    'AREA', 
    'N') ON CONFLICT DO NOTHING;

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
    'GLDN',
    'FIELD'
  ) ON CONFLICT
DO NOTHING;


------------------------
-- Add Canyon Hotsprings under Golden office
------------------------

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
    administrative_office_ind)
values (
    'CNYNHTSPRN',
    'Canyon Hotsprings',
    'Canyon Hotsprings', 
    now(), 
    null, 
    user, 
    now(), 
    user, 
    now(), 
    'AREA', 
    'N') ON CONFLICT DO NOTHING;

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
    'GLDN',
    'CNYNHTSPRN'
  ) ON CONFLICT
DO NOTHING;

------------------------
-- Add Deep Creek (Near Salmon Arm) under Salmon Arm office
------------------------

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
    administrative_office_ind)
values (
    'DPCRKNRSLM',
    'Deep Creek (Near Salmon Arm)',
    'Deep Creek (Near Salmon Arm)', 
    now(), 
    null, 
    user, 
    now(), 
    user, 
    now(), 
    'AREA', 
    'N') ON CONFLICT DO NOTHING;

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
    'SLMONRM',
    'DPCRKNRSLM'
  ) ON CONFLICT
DO NOTHING;

------------------------
-- Add Hagwilget under Smithers office
------------------------

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
    administrative_office_ind)
values (
    'HGWLGT',
    'Hagwilget',
    'Hagwilget', 
    now(), 
    null, 
    user, 
    now(), 
    user, 
    now(), 
    'AREA', 
    'N') ON CONFLICT DO NOTHING;

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
    'SMITHRS',
    'HGWLGT'
  ) ON CONFLICT
DO NOTHING;

------------------------
-- Add Rose Lake (Burns Lake) under Burns Lake office
------------------------

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
    administrative_office_ind)
values (
    'RSLKBNSLK',
    'Rose Lake (Burns Lake)',
    'Rose Lake (Burns Lake)', 
    now(), 
    null, 
    user, 
    now(), 
    user, 
    now(), 
    'AREA', 
    'N') ON CONFLICT DO NOTHING;

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
    'BURNSLK',
    'RSLKBNSLK'
  ) ON CONFLICT
DO NOTHING;


------------------------
-- Assign Illecillewaet to Golden office
------------------------

UPDATE geo_org_unit_structure set parent_geo_org_unit_code='GLDN' where child_geo_org_unit_code='ILLECILL';

------------------------
-- Move complaints from  Birkenhead Estates - (Whistler) to Birkenhead Estates area and delete Birkenhead Estates - (Whistler) area
------------------------

UPDATE complaint SET geo_organization_unit_code='BRKHES' WHERE geo_organization_unit_code='BRKHES-W';

DELETE FROM geo_org_unit_structure WHERE child_geo_org_unit_code='BRKHES-W';

DELETE FROM geo_organization_unit_code WHERE geo_organization_unit_code='BRKHES-W';


------------------------
-- Update area text for Mica Creek
------------------------
UPDATE geo_organization_unit_code SET short_description='Mica Creek', long_description='Mica Creek' 
WHERE  geo_organization_unit_code = 'MICACREK';


------------------------
-- Rename Moricetown area to Witset (Moricetown)
------------------------

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
    administrative_office_ind)
values (
    'WTSMTMRCTW',
    'Witset (Moricetown)',
    'Witset (Moricetown)', 
    now(), 
    null, 
    user, 
    now(), 
    user, 
    now(), 
    'AREA', 
    'N') ON CONFLICT DO NOTHING;

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
    'SMITHRS',
    'WTSMTMRCTW'
  ) ON CONFLICT
DO NOTHING;

UPDATE complaint SET geo_organization_unit_code='WTSMTMRCTW' WHERE geo_organization_unit_code='MORICETN';

DELETE FROM geo_org_unit_structure WHERE child_geo_org_unit_code='MORICETN';

DELETE FROM geo_organization_unit_code WHERE geo_organization_unit_code='MORICETN';

------------------------
-- Rename Deep Creek to Deep Creek (Near Williams Lake)
------------------------

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
    administrative_office_ind)
values (
    'DPCRKNRWLL',
    'Deep Creek (Near Williams Lake)',
    'Deep Creek (Near Williams Lake)', 
    now(), 
    null, 
    user, 
    now(), 
    user, 
    now(), 
    'AREA', 
    'N') ON CONFLICT DO NOTHING;

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
    'WLMSLK',
    'DPCRKNRWLL'
  ) ON CONFLICT
DO NOTHING;

UPDATE complaint SET geo_organization_unit_code='DPCRKNRWLL' WHERE geo_organization_unit_code='DEEPCRK';

DELETE FROM geo_org_unit_structure WHERE child_geo_org_unit_code='DEEPCRK';

DELETE FROM geo_organization_unit_code WHERE geo_organization_unit_code='DEEPCRK';


------------------------
-- Rename Rose Lake (Williams Lake) to Rose Lake (150 Mile House)
------------------------

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
    administrative_office_ind)
values (
    'RSLK150MLH',
    'Rose Lake (150 Mile House)',
    'Rose Lake (150 Mile House)', 
    now(), 
    null, 
    user, 
    now(), 
    user, 
    now(), 
    'AREA', 
    'N') ON CONFLICT DO NOTHING;

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
    'WLMSLK',
    'RSLK150MLH'
  ) ON CONFLICT
DO NOTHING;

UPDATE complaint SET geo_organization_unit_code='RSLK150MLH' WHERE geo_organization_unit_code='ROSELAK';

DELETE FROM geo_org_unit_structure WHERE child_geo_org_unit_code='ROSELAK';

DELETE FROM geo_organization_unit_code WHERE geo_organization_unit_code='ROSELAK';

------------------------
-- Rename Daajing Giids (Queen Charlotte City) to Daajing Giids
------------------------

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
    administrative_office_ind)
values (
    'DJNGGDS',
    'Daajing Giids',
    'Daajing Giids', 
    now(), 
    null, 
    user, 
    now(), 
    user, 
    now(), 
    'AREA', 
    'N') ON CONFLICT DO NOTHING;

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
    'DJNG',
    'DJNGGDS'
  ) ON CONFLICT
DO NOTHING;

UPDATE complaint SET geo_organization_unit_code='DJNGGDS' WHERE geo_organization_unit_code='QUEENCHA';

DELETE FROM geo_org_unit_structure WHERE child_geo_org_unit_code='QUEENCHA';

DELETE FROM geo_organization_unit_code WHERE geo_organization_unit_code='QUEENCHA';


-------------------------
-- Move Beryl Prairie in Location Hierarchy
-------------------------

UPDATE geo_org_unit_structure set parent_geo_org_unit_code='FRTSTJN' where child_geo_org_unit_code='BRYLPRR';


-------------------------
-- Move Farrell Creek in Location Hierarchy
-------------------------

UPDATE geo_org_unit_structure set parent_geo_org_unit_code='FRTSTJN' where child_geo_org_unit_code='FARRELLC';

------------------------
-- Move Cluculz Lake in Location Hierachy
-- Delete Clucluz Lake - Brookside Resort West.
------------------------

UPDATE geo_org_unit_structure set parent_geo_org_unit_code='VNDHF' where child_geo_org_unit_code='CLUCLZLK';
DO $$
BEGIN
    -- Check if no record exists with complaint.geo_organization_unit_code = 'CLCZLKBW' 
    IF NOT EXISTS (SELECT 1 FROM complaint WHERE geo_organization_unit_code = 'CLCZLKBW') THEN
        -- Perform delete operations if the record does not exist
        DELETE FROM geo_org_unit_structure WHERE child_geo_org_unit_code = 'CLCZLKBW';
        DELETE FROM geo_organization_unit_code WHERE geo_organization_unit_code = 'CLCZLKBW';
    END IF;
END $$; -- Comment to trigger this to run again in test


-------------------------
-- Create new feature for Complaint Collaboration
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
  'COMPCOLLAB',
  'Enable Complaint Collaboration',
  'Enables the ability to add collaborators from other agencies.',
  270,
  'Y',
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
  'COMPCOLLAB',
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
  'COMPCOLLAB',
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
  'COMPCOLLAB',
  'EPO',
  'N',
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
VALUES
  (
    'PRKHWCTMPT',
    '',
    'CDOGS Hash for Parks HWCR Template',
    true,
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

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
VALUES
  (
    'PRKERSTMPT',
    '',
    'CDOGS Hash for Parks ERS Template',
    true,
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

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
VALUES
  (
    'PRKGIRTMPT',
    '',
    'CDOGS Hash for Parks GIR Template',
    true,
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

-------------------------
-- Create new feature for Referral emails
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
  'REFEMAIL',
  'Enable Referral Email Notifications',
  'Enables the sending of email notifications when a complaint is referred.',
  280,
  'Y',
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
  'REFEMAIL',
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
  'REFEMAIL',
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
  'REFEMAIL',
  'EPO',
  'N',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

-------------------------
-- Create new feature for Collaborator emails
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
  'COLEMAIL',
  'Enable Collaborator Email Notifications',
  'Enables the sending of email notifications when a collaborator is added to a complaint.',
  290,
  'Y',
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
  'COLEMAIL',
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
  'COLEMAIL',
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
  'COLEMAIL',
  'EPO',
  'N',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;


UPDATE feature_agency_xref SET active_ind = false WHERE feature_code = 'ZONE_FLTR' AND agency_code = 'PARKS';
UPDATE feature_agency_xref SET active_ind = false WHERE feature_code = 'REG_FLTR' AND agency_code = 'PARKS';

---------------------------
-- CE-225 Add external agencies
---------------------------

insert into agency_code (agency_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp, external_agency_ind)
values ('DFO', 'Fisheries and Oceans Canada', 'Fisheries and Oceans Canada', 20, true, user, now(), user, now(), 'Y'),
      ('ECCC', 'Environment and Climate Change Canada', 'Environment and Climate Change Canada', 10, true, user, now(), user, now(), 'Y'),
      ('POL', 'Police', 'Police', 50, true, user, now(), user, now(), 'Y'),
      ('NROS', 'Natural Resource Officer Service', 'Natural Resource Officer Service', 30, true, user, now(), user, now(), 'Y'),
      ('OTH', 'Other', 'Other', 40, true, user, now(), user, now(), 'Y')
on conflict do nothing;

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
values ('REFEMAIL','DFO','N',user,now(),user,now()),
('REFEMAIL','ECCC','N',user,now(),user,now()),
('REFEMAIL','POL','N',user,now(),user,now()),
('REFEMAIL','NROS','N',user,now(),user,now()),
('REFEMAIL','OTH','N',user,now(),user,now())
ON CONFLICT DO NOTHING;

---------------------------
-- CE-1659 Sector View of Complaints
---------------------------

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
  'SECTORVIEW',
  'Enable Sector View of Complaints',
  'Enables a Sector View of all NatCom complaints in one single view.',
  300,
  'Y',
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
  'SECTORVIEW',
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
  'SECTORVIEW',
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
  'SECTORVIEW',
  'EPO',
  'N',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

-------------------------
-- Move New Westminster in Location Hierarchy
-------------------------
UPDATE geo_org_unit_structure SET parent_geo_org_unit_code = 'SQMSHWHS' WHERE child_geo_org_unit_code  = 'NEWWEST';

-------------------------
-- Remove Unused Feature Flags
-------------------------
DELETE from feature_agency_xref where feature_code = 'PRIV_REQ';
DELETE from feature_code where feature_code = 'PRIV_REQ';
DELETE from feature_agency_xref where feature_code = 'ENBL_OFF';
DELETE from feature_code where feature_code = 'ENBL_OFF';
DELETE from feature_agency_xref where feature_code = 'EXTRNALREF';
DELETE from feature_code where feature_code = 'EXTRNALREF';

-------------------------
-- Add Sector Agency Type and enable filters
-------------------------

insert into agency_code (agency_code, short_description, long_description, display_order, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp, external_agency_ind)
values ('NRS', 'Natural Resource Sector', 'Natural Resource Sector', 35, true, user, now(), user, now(), 'N')
on conflict do nothing;

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
VALUES 
('REG_FLTR', 'NRS', 'Y', user, now(), user, now()),
('ZONE_FLTR', 'NRS', 'Y', user, now(), user, now()),
('COM_FLTR', 'NRS', 'Y', user, now(), user, now()),
('D_L_FLTR', 'NRS', 'Y', user, now(), user, now()),
('STAT_FLTR', 'NRS', 'Y', user, now(), user, now()),
('SECTORVIEW', 'NRS', 'Y', user, now(), user, now())
 ON CONFLICT DO NOTHING;

--------------------------
-- New Changes above this line
-------------------------
UPDATE configuration
SET
  configuration_value = configuration_value::int + 1
WHERE
  configuration_code = 'CDTABLEVER';
