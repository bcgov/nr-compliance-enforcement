--
-- Data for Name: geo_org_unit_type_code; Type: TABLE DATA; Schema: shared; Owner: -
--
INSERT INTO
  geo_org_unit_type_code
VALUES
  (
    'ZONE',
    'Zone',
    NULL,
    1,
    true,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_type_code
VALUES
  (
    'REGION',
    'Region',
    NULL,
    2,
    true,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_type_code
VALUES
  (
    'OFFLOC',
    'Office Location',
    NULL,
    3,
    true,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_type_code
VALUES
  (
    'AREA',
    'Area',
    NULL,
    4,
    true,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621'
  );

--
-- Data for Name: geo_organization_unit_code; Type: TABLE DATA; Schema: shared; Owner: -
--
INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OKNGN',
    'Okanagan',
    'Okanagan',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'REGION',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OMINECA',
    'Omineca',
    'Omineca',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'REGION',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PCLRD',
    'Peace Liard',
    'Peace Liard',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'REGION',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SKNA',
    'Skeena',
    'Skeena',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'REGION',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'STHCST',
    'South Coast',
    'South Coast',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'REGION',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TMPSNCRBO',
    'Thompson Cariboo',
    'Thompson Cariboo',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'REGION',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WSTCST',
    'West Coast',
    'West Coast',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'REGION',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLKYCSR',
    'Bulkley-Cassiar',
    'Bulkley-Cassiar',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CRBOCHLCTN',
    'Cariboo Chilcotin',
    'Cariboo Chilcotin',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CRBOTMPSN',
    'Cariboo Thompson',
    'Cariboo Thompson',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CENISL',
    'Central Island',
    'Central Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CENOKNGN',
    'Central Okanagan',
    'Central Okanagan',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FRSRN',
    'Fraser North',
    'Fraser North',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FRSRS',
    'Fraser South',
    'Fraser South',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NCHKOLKS',
    'Nechako-Lakes',
    'Nechako-Lakes',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NCST',
    'North Coast',
    'North Coast',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NISL',
    'North Island',
    'North Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NOKNGN',
    'North Okanagan',
    'North Okanagan',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NPCE',
    'North Peace',
    'North Peace',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OMNCA',
    'Omineca',
    'Omineca',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SEA2SKY',
    'Sea to Sky',
    'Sea to Sky',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SISL',
    'South Island',
    'South Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SOKNGN',
    'South Okanagan',
    'South Okanagan',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SPCE',
    'South Peace',
    'South Peace',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SNSHNCST',
    'Sunshine Coast',
    'Sunshine Coast',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TMPSNNCLA',
    'Thompson Nicola',
    'Thompson Nicola',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    '100MLHSE',
    '100 Mile House',
    '100 Mile House',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ATLIN',
    'Atlin',
    'Atlin',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLLACLA',
    'Bella Coola',
    'Bella Coola',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLKCRKCR',
    'Black Creek/Campbell River',
    'Black Creek/Campbell River',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BURNSLK',
    'Burns Lake',
    'Burns Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CSTLGAR',
    'Castlegar',
    'Castlegar',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CHTWD',
    'Chetwynd',
    'Chetwynd',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CLRWTER',
    'Clearwater',
    'Clearwater',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CRNBK',
    'Cranbrook',
    'Cranbrook',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CRSTN',
    'Creston',
    'Creston',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DJNG',
    'Daajing Giids',
    'Daajing Giids',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DWSNCRK',
    'Dawson Creek',
    'Dawson Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DSELK',
    'Dease Lake',
    'Dease Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DNCN',
    'Duncan',
    'Duncan',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FRNIE',
    'Fernie',
    'Fernie',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FRTNLN',
    'Fort Nelson',
    'Fort Nelson',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FRTSTJN',
    'Fort St. John',
    'Fort St. John',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GLDN',
    'Golden',
    'Golden',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GDFKS',
    'Grand Forks',
    'Grand Forks',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'INVRM',
    'Invermere',
    'Invermere',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KMLPS',
    'Kamloops',
    'Kamloops',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KLWNA',
    'Kelowna',
    'Kelowna',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MKNZI',
    'Mackenzie',
    'Mackenzie',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MRRTT',
    'Merritt',
    'Merritt',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MSNCHWK',
    'Mission/Chilliwack',
    'Mission/Chilliwack',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MSNMPLRD',
    'Mission/Maple Ridge',
    'Mission/Maple Ridge',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MSNSR',
    'Mission/Surrey',
    'Mission/Surrey',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NNIMO',
    'Nanaimo',
    'Nanaimo',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NLSON',
    'Nelson',
    'Nelson',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LLT',
    'Lillooet',
    'Lillooet',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PNTCTN',
    'Penticton',
    'Penticton',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PRTALB',
    'Port Alberni',
    'Port Alberni',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PRTMCNL',
    'Port McNeill',
    'Port McNeill',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PWLRV',
    'Powell River',
    'Powell River',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PRCG',
    'Prince George',
    'Prince George',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'QSNL',
    'Quesnel',
    'Quesnel',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SLMONRM',
    'Salmon Arm',
    'Salmon Arm',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SCHLT',
    'Sechelt',
    'Sechelt',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SMITHRS',
    'Smithers',
    'Smithers',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SQMSHWHS',
    'Squamish/Whistler',
    'Squamish/Whistler',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TERRC',
    'Terrace',
    'Terrace',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'VNDHF',
    'Vanderhoof',
    'Vanderhoof',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'VRNON',
    'Vernon',
    'Vernon',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'VICTRA',
    'Victoria',
    'Victoria',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WLMSLK',
    'Williams Lake',
    'Williams Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'OFFLOC',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    '100MHHS',
    '100 Mile House',
    '100 Mile House',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    '108MLRNH',
    '108 Mile Ranch',
    '108 Mile Ranch',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    '140MHHS',
    '140 Mile House',
    '140 Mile House',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    '150MHHS',
    '150 Mile House',
    '150 Mile House',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    '16MIL',
    '16 Mile',
    '16 Mile',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    '40MLFLTZ',
    '40 Mile Flats',
    '40 Mile Flats',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    '70MLHS',
    '70 Mile House',
    '70 Mile House',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ABTFRD',
    'Abbotsford',
    'Abbotsford',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ADMSLKHS',
    'Adams Lake',
    'Adams Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'AGSSZHS',
    'Agassiz',
    'Agassiz',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'AHST',
    'Ahousat',
    'Ahousat',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ANSWRTH',
    'Ainsworth',
    'Ainsworth',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'AYNSH',
    'Aiyansh',
    'Aiyansh',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ALBRTCNY',
    'Albert Canyon',
    'Albert Canyon',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ALBION',
    'Albion',
    'Albion',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ALDRGRV',
    'Aldergrove',
    'Aldergrove',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ALRTBAY',
    'Alert Bay',
    'Alert Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ALXNDRIA',
    'Alexandria',
    'Alexandria',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ALXSCRK',
    'Alexis Creek',
    'Alexis Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ALZLK',
    'Aleza Lake',
    'Aleza Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ALCRM',
    'Alice Arm',
    'Alice Arm',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ALKLLK',
    'Alkali Lake',
    'Alkali Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ALKLLKIR',
    'Alkali Lake (IR)',
    'Alkali Lake (IR)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ALKLLKRV',
    'Alkali Reserve',
    'Alkali Reserve',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ALLFRDBY',
    'Alliford Bay',
    'Alliford Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ALTONA',
    'Altona',
    'Altona',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ALVIN',
    'Alvin',
    'Alvin',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ANAHAMIR',
    'Anaham (IR)',
    'Anaham (IR)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ANAHIMIR',
    'Anahim Indian Reserve',
    'Anahim Indian Reserve',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ANHMLK',
    'Anahim Lake',
    'Anahim Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ANCRGIN',
    'Anchoragein',
    'Anchoragein',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ANGLMNT',
    'Anglemont',
    'Anglemont',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ANMR',
    'Anmore',
    'Anmore',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'APPDLE',
    'Appledale',
    'Appledale',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'APPGRV',
    'Applegrove',
    'Applegrove',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ARGENT',
    'Argenta',
    'Argenta',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ARMSTRNG',
    'Armstrong',
    'Armstrong',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ARRAS',
    'Arras',
    'Arras',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ARRWPK',
    'Arrow Park',
    'Arrow Park',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ARRWHD',
    'Arrowhead',
    'Arrowhead',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ASHCROF',
    'Ashcroft',
    'Ashcroft',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ASHTNCRK',
    'Ashton Creek',
    'Ashton Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ASPNGRV',
    'Aspen Grove',
    'Aspen Grove',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ATHALMR',
    'Athalmer',
    'Athalmer',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ATLN',
    'Atlin',
    'Atlin',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ATTACHI',
    'Attachie',
    'Attachie',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'AVOLA',
    'Avola',
    'Avola',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BALDNLL',
    'Baldonell',
    'Baldonell',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BALFOUR',
    'Balfour',
    'Balfour',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BAMFELD',
    'Bamfield',
    'Bamfield',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BNKIER',
    'Bankier',
    'Bankier',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BARKRVLL',
    'Barkerville',
    'Barkerville',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BARRIR',
    'Barriere',
    'Barriere',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BAYNSLK',
    'Baynes Lake',
    'Baynes Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BRFLTS',
    'Bear Flats',
    'Bear Flats',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BRLK',
    'Bear Lake',
    'Bear Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BRMTN',
    'Bear Mountain',
    'Bear Mountain',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BEATON',
    'Beaton',
    'Beaton',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BEATIE',
    'Beattie',
    'Beattie',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BVRCV',
    'Beaver Cove',
    'Beaver Cove',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BVRCRK',
    'Beaver Creek',
    'Beaver Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BVRVLY',
    'Beaver Valley',
    'Beaver Valley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BVDMLK',
    'Beaverdam Lake',
    'Beaverdam Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BVRRDL',
    'Beaverdell',
    'Beaverdell',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BVRLLY',
    'Beaverly',
    'Beaverly',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BDNSTLK',
    'Bednesti Lake',
    'Bednesti Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BELCARR',
    'Belcarra',
    'Belcarra',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLLIINR',
    'Bell II North',
    'Bell II North',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLLIISH',
    'Bell II South',
    'Bell II South',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLLABELA',
    'Bella Bella',
    'Bella Bella',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLLACOOL',
    'Bella Coola',
    'Bella Coola',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BERKIN',
    'Berkin',
    'Berkin',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BRYLPRR',
    'Beryl Prairie',
    'Beryl Prairie',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BSSBRRGH',
    'Bessborough',
    'Bessborough',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BIGBAR',
    'Big Bar',
    'Big Bar',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BIGBRLK',
    'Big Bar Lake',
    'Big Bar Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BIGCRK',
    'Big Creek',
    'Big Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BIGLK',
    'Big Lake',
    'Big Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BIGWHIT',
    'Big White',
    'Big White',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BRISLD',
    'Birch Island',
    'Birch Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BRKN',
    'Birken',
    'Birken',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BRKHES',
    'Birkenhead Estates',
    'Birkenhead Estates',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLKCRK',
    'Black Creek',
    'Black Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLKMTN',
    'Black Mountain',
    'Black Mountain',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLKPNS',
    'Black Pines',
    'Black Pines',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLKPT',
    'Black Point',
    'Black Point',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLKPL',
    'Black Pool',
    'Black Pool',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLKTSK',
    'Black Tusk Village',
    'Black Tusk Village',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLKWT',
    'Blackwater',
    'Blackwater',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLBRY',
    'Blaeberry',
    'Blaeberry',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLEWT',
    'Blewett',
    'Blewett',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLDBY',
    'Blind Bay',
    'Blind Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLSLDG',
    'Bliss Landing',
    'Bliss Landing',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLBBAY',
    'Blubber Bay',
    'Blubber Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLURVR',
    'Blue River',
    'Blue River',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLUBRY',
    'Blueberry',
    'Blueberry',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLUBYCRK',
    'Blueberry Creek',
    'Blueberry Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BBQNN',
    'Bob Quinn',
    'Bob Quinn',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BNPRTLK',
    'Bonaparte Lake',
    'Bonaparte Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BNNNGTN',
    'Bonnington',
    'Bonnington',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BSTNBR',
    'Boston Bar',
    'Boston Bar',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BSWLL',
    'Boswell',
    'Boswell',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BCHLK',
    'Bouchie Lake',
    'Bouchie Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BWNISL',
    'Bowen Island',
    'Bowen Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BWROLK',
    'Bowron Lake',
    'Bowron Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BWSR',
    'Bowser',
    'Bowser',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BRCKNDL',
    'Brackendale',
    'Brackendale',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BRLRN',
    'Bralorne',
    'Bralorne',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BRNANCRK',
    'Brennan Creek',
    'Brennan Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BRIRRDG',
    'Briar Ridge',
    'Briar Ridge',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BRDSL',
    'Bridesville',
    'Bridesville',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BRDGLK',
    'Bridge Lake',
    'Bridge Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BRLNT',
    'Brilliant',
    'Brilliant',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BRS',
    'Brisco',
    'Brisco',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BRSS',
    'Brisco - South',
    'Brisco - South',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BRT BCH',
    'Brittania Beach',
    'Brittania Beach',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BRKMRE',
    'Brookmere',
    'Brookmere',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BCKHRN',
    'Buckhorn',
    'Buckhorn',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BCKNGHRS',
    'Buckinghorse',
    'Buckinghorse',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BCKLYBY',
    'Buckley Bay',
    'Buckley Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BFFLCRK',
    'Buffalo Creek',
    'Buffalo Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BKCRK',
    'Buick Creek',
    'Buick Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BLLRVR',
    'Bull River',
    'Bull River',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BURNBY',
    'Burnaby',
    'Burnaby',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BURNLK',
    'Burns Lake',
    'Burns Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BRTN',
    'Burton',
    'Burton',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BTEINLT',
    'Bute Inlet',
    'Bute Inlet',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'BTDLPRIN',
    'Butedale/Princess Royal Island',
    'Butedale/Princess Royal Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CCHCRK',
    'Cache Creek',
    'Cache Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CSSRSLDG',
    'Caesar''s Landing',
    'Caesar''s Landing',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CMB',
    'Cambie',
    'Cambie',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CMRNE',
    'Camborne',
    'Camborne',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CMBLRV',
    'Campbell River',
    'Campbell River',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CNLFLTS',
    'Canal Flats',
    'Canal Flats',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CNMLK',
    'Canim Lake',
    'Canim Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CNCR100M',
    'Canoe Creek (100 Mile)',
    'Canoe Creek (100 Mile)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CNCRKSA',
    'Canoe Creek (Salmon Arm)',
    'Canoe Creek (Salmon Arm)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CYN',
    'Canyon',
    'Canyon',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GTWKSLK100',
    'Canyon City - Gitwinksihlkw',
    'Canyon City - Gitwinksihlkw',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GTWKSLKTRC',
    'Canyon City - Gitwinksihlkw',
    'Canyon City - Gitwinksihlkw',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CRCRSSYK',
    'Carcross (Yukon)',
    'Carcross (Yukon)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CRMI',
    'Carmi',
    'Carmi',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CNO',
    'Casino',
    'Casino',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CSSR',
    'Cassiar',
    'Cassiar',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CSSDY',
    'Cassidy',
    'Cassidy',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CTSRVR',
    'Castle River',
    'Castle River',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CSTLGR',
    'Castlegar',
    'Castlegar',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CWSTN',
    'Cawston',
    'Cawston',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CYCS',
    'Caycuse',
    'Caycuse',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CSLLK',
    'Cecil Lake',
    'Cecil Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CDR',
    'Cedar',
    'Cedar',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CDRVL',
    'Cedarvale',
    'Cedarvale',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CLSTA',
    'Celista',
    'Celista',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CNTLSNSH',
    'Central Saanich',
    'Central Saanich',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CNTRVL',
    'Centreville',
    'Centreville',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CHNLK',
    'Chain Lake',
    'Chain Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CHRLLK',
    'Charlie Lake',
    'Charlie Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CHRLTCTY',
    'Charlotte City',
    'Charlotte City',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CHSE',
    'Chase',
    'Chase',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CHHLFSTN',
    'Chehalias First Nation',
    'Chehalias First Nation',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CHMNUS',
    'Chemainus',
    'Chemainus',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CHRYCRK',
    'Cherry Creek',
    'Cherry Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CHRYVLLE',
    'Cherryville',
    'Cherryville',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CHETWND',
    'Chetwynd',
    'Chetwynd',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CHFLAKE',
    'Chief Lake',
    'Chief Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CHLKOMUD',
    'Chilako/Mud River',
    'Chilako/Mud River',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CHLNKFRK',
    'Chilanko Forks',
    'Chilanko Forks',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CHLKLK',
    'Chilko Lake',
    'Chilko Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CHILLIWK',
    'Chilliwack',
    'Chilliwack',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CHRSTVAL',
    'Christian Valley',
    'Christian Valley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CHRSTNAL',
    'Christina Lake',
    'Christina Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CHCHUA',
    'Chuchua',
    'Chuchua',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CINEMA',
    'Cinema',
    'Cinema',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CLAIRMNT',
    'Clairmont',
    'Clairmont',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CLNWLM',
    'Clanwilliam',
    'Clanwilliam',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CLAYHRST',
    'Clayhurst',
    'Clayhurst',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CLRBRK',
    'Clearbrook',
    'Clearbrook',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CLRWTR',
    'Clearwater',
    'Clearwater',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CLEMRTA',
    'Clemretta',
    'Clemretta',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CLINTON',
    'Clinton',
    'Clinton',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CLOVRDLE',
    'Cloverdale',
    'Cloverdale',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CLUCLZLK',
    'Cluculz Lake',
    'Cluculz Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'COALHARB',
    'Coal Harbour',
    'Coal Harbour',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'COALRIVR',
    'Coal River',
    'Coal River',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'COALMONT',
    'Coalmont',
    'Coalmont',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'COBBLHIL',
    'Cobble Hill',
    'Cobble Hill',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CLDSTRM',
    'Coldstream',
    'Coldstream',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CLLYMNT',
    'Colleymount',
    'Colleymount',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CLMBVLLY',
    'Columbia Valley',
    'Columbia Valley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CLUMERE',
    'Columere',
    'Columere',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CLWOOD',
    'Colwood',
    'Colwood',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'COMOX',
    'Comox',
    'Comox',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CONTCTCK',
    'Contact Creek',
    'Contact Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'COOKBAY',
    'Cook Bay',
    'Cook Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'COOMBS',
    'Coombs',
    'Coombs',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'COOPRCRK',
    'Cooper Creek',
    'Cooper Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'COQUITLM',
    'Coquitlam',
    'Coquitlam',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CRTSISLD',
    'Cortes Island',
    'Cortes Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'COTNWOD',
    'Cottonwood',
    'Cottonwood',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CRSRLAKE',
    'Coursier Lake',
    'Coursier Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'COURTNY',
    'Courtenay',
    'Courtenay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CWCHNBY',
    'Cowichan Bay',
    'Cowichan Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CWCHNVLY',
    'Cowichan Valley',
    'Cowichan Valley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'COYOTECR',
    'Coyote Creek',
    'Coyote Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CRAIGPRK',
    'Craig Park',
    'Craig Park',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CRGLLACH',
    'Craigellachie',
    'Craigellachie',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CRANBRRY',
    'Cranberry',
    'Cranberry',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CRANBRK',
    'Cranbrook',
    'Cranbrook',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CRWFRDBY',
    'Crawford Bay',
    'Crawford Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CRSNTSPR',
    'Crescent Spur',
    'Crescent Spur',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CRSNTVLY',
    'Crescent Valley',
    'Crescent Valley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CRESTON',
    'Creston',
    'Creston',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CROFTON',
    'Crofton',
    'Crofton',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CROYDEN',
    'Croyden',
    'Croyden',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CRYSTLLK',
    'Crystal Lake',
    'Crystal Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CRYSTLMN',
    'Crystal Mountain',
    'Crystal Mountain',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CULTSLKE',
    'Cultus Lake',
    'Cultus Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CMBRLAND',
    'Cumberland',
    'Cumberland',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DANSKIN',
    'Danskin',
    'Danskin',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DARCY',
    'D''Arcy',
    'D''Arcy',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DARFIELD',
    'Darfield',
    'Darfield',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DAVISBAY',
    'Davis Bay',
    'Davis Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DAWSONCR',
    'Dawson Creek',
    'Dawson Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DAWSONSL',
    'Dawsons Landing',
    'Dawsons Landing',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DEASELAK',
    'Dease Lake',
    'Dease Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DECKERLK',
    'Decker Lake',
    'Decker Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DEEPBAY',
    'Deep Bay',
    'Deep Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DEERPRK',
    'Deer Park',
    'Deer Park',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DEKALAKE',
    'Deka Lake',
    'Deka Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DELIO',
    'Del Rio',
    'Del Rio',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DELTA',
    'Delta',
    'Delta',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DENMANIS',
    'Denman Island',
    'Denman Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DEROCHE',
    'Deroche',
    'Deroche',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DESOLATN',
    'Desolation Sound',
    'Desolation Sound',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DEVINE',
    'Devine',
    'Devine',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DEWDNEY',
    'Dewdney',
    'Dewdney',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DINANBAY',
    'Dinan Bay',
    'Dinan Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DOERIVER',
    'Doe River',
    'Doe River',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DOGCRIR',
    'Dog Cr. (IR)',
    'Dog Cr. (IR)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DOIG',
    'Doig',
    'Doig',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DOMECRK',
    'Dome Creek/Cresent Spur',
    'Dome Creek/Cresent Spur',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DONALD',
    'Donald',
    'Donald',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DGLSLAKE',
    'Douglas Lake',
    'Douglas Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DOWNIECR',
    'Downie Creek',
    'Downie Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DUNCAN',
    'Duncan',
    'Duncan',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DUNKLEY',
    'Dunkley',
    'Dunkley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DUNSTER',
    'Dunster',
    'Dunster',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DURIEU',
    'Durieu',
    'Durieu',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'EAGLEBAY',
    'Eagle Bay',
    'Eagle Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'EAGLECRK',
    'Eagle Creek',
    'Eagle Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'EARLSCOV',
    'Earls Cove',
    'Earls Cove',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ECRACRFT',
    'East Cracroft Island',
    'East Cracroft Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'EFRANCLK',
    'East Francois Lake',
    'East Francois Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'EASTGATE',
    'East Gate',
    'East Gate',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'EASTGTE',
    'Eastgate',
    'Eastgate',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'EASTPINE',
    'East Pine',
    'East Pine',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ESPINEPW',
    'East Pine (portion West of Pine River)',
    'East Pine (portion West of Pine River)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ESLOPPPP',
    'East slope Pine Pass (almost to Azouetta Lake)',
    'East slope Pine Pass (almost to Azouetta Lake)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'EASTSKE',
    'East Sooke',
    'East Sooke',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ETHURLOW',
    'East Thurlow Island',
    'East Thurlow Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'EDGEWATER',
    'Edgewater',
    'Edgewater',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'EDGEWOOD',
    'Edgewood',
    'Edgewood',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'EGMONT',
    'Egmont',
    'Egmont',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ELKBAY',
    'Elk Bay',
    'Elk Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ELKFORD',
    'Elkford',
    'Elkford',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ELKO',
    'Elko',
    'Elko',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ELSWTHCP',
    'Elsworth Camp',
    'Elsworth Camp',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'EMMDSISL',
    'Emmonds Island',
    'Emmonds Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'EMPRVALY',
    'Empire Valley',
    'Empire Valley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ENDAKO',
    'Endako',
    'Endako',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ENDERBY',
    'Enderby',
    'Enderby',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ERICKSON',
    'Erickson',
    'Erickson',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ERIE',
    'Erie',
    'Erie',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ERRINGTN',
    'Errington',
    'Errington',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ESQUIMAL',
    'Esquimalt',
    'Esquimalt',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FAIRMONT',
    'Fairmont',
    'Fairmont',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FAIRVIEW',
    'Fairview',
    'Fairview',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FALKLAND',
    'Falkland',
    'Falkland',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FANNYBAY',
    'Fanny Bay',
    'Fanny Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FARMINGT',
    'Farmington',
    'Farmington',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FARRELLC',
    'Farrell Creek',
    'Farrell Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FAULDER',
    'Faulder',
    'Faulder',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FAUQUIER',
    'Fauquier',
    'Fauquier',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FELLERHT',
    'Fellers Heights',
    'Fellers Heights',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FERGUSON',
    'Ferguson',
    'Ferguson',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FERNDALE',
    'Ferndale',
    'Ferndale',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FERNIE',
    'Fernie',
    'Fernie',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FINMORE',
    'Finmore',
    'Finmore',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FINTRY',
    'Fintry',
    'Fintry',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FIRESIDE',
    'Fireside',
    'Fireside',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FIRVALE',
    'Firvale',
    'Firvale',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FLATROCK',
    'Flat Rock',
    'Flat Rock',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FORSTGRV',
    'Forest Grove',
    'Forest Grove',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FORESTDL',
    'Forestdale',
    'Forestdale',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FTBABINE',
    'Fort Babine',
    'Fort Babine',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FORTFRSR',
    'Fort Fraser',
    'Fort Fraser',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FTLANGLE',
    'Fort Langley',
    'Fort Langley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FTNELSON',
    'Fort Nelson',
    'Fort Nelson',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FTSTJAME',
    'Fort St. James',
    'Fort St. James',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FTSTJOHN',
    'Fort St. John',
    'Fort St. John',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FTSTEELE',
    'Fort Steele',
    'Fort Steele',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FTWARE',
    'Fort Ware',
    'Fort Ware',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FTRESSLK',
    'Fortress Lake',
    'Fortress Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FOSTHS',
    'Fosthall & South',
    'Fosthall & South',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FRANPENI',
    'Francis Peninsula',
    'Francis Peninsula',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FRNCSLK1',
    'Francois Lake',
    'Francois Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FRASER',
    'Fraser',
    'Fraser',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FRASERLK',
    'Fraser Lake',
    'Fraser Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FREDRMCA',
    'Fredrick Arm',
    'Fredrick Arm',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FRIENDLK',
    'Friendly Lake',
    'Friendly Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FRUITVAL',
    'Fruitvale',
    'Fruitvale',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GABRIOLAI',
    'Gabriola Island',
    'Gabriola Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GALENABAY',
    'Galena Bay',
    'Galena Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GALIANOI',
    'Galiano Island',
    'Galiano Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GALLOWAY',
    'Galloway',
    'Galloway',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GAMBIERI',
    'Gambier Island',
    'Gambier Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GANGRANCH',
    'Gang Ranch',
    'Gang Ranch',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GANGES',
    'Ganges',
    'Ganges',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GARDENBY',
    'Garden Bay',
    'Garden Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GARNETVL',
    'Garnet Valley',
    'Garnet Valley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GENELLE',
    'Genelle',
    'Genelle',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GEORGEMI',
    'Georgetown Mills',
    'Georgetown Mills',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GERMANSO',
    'Germanson Landing',
    'Germanson Landing',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GERRARD',
    'Gerrard',
    'Gerrard',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GIBSONS',
    'Gibsons',
    'Gibsons',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GILLIESB',
    'Gillies Bay',
    'Gillies Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GISCOME',
    'Giscome',
    'Giscome',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GISCOMEW',
    'Giscome/Willow River',
    'Giscome/Willow River',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GITANYOW',
    'Gitanyow',
    'Gitanyow',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GITWANGA',
    'Gitwangak',
    'Gitwangak',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GLADE',
    'Glade',
    'Glade',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GLADWIN',
    'Gladwin',
    'Gladwin',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GLENANNA',
    'Glenannan',
    'Glenannan',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GLENDACO',
    'Glendale Cove',
    'Glendale Cove',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GLENORA',
    'Glenora',
    'Glenora',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GLENROSA',
    'Glenrosa',
    'Glenrosa',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GLENVOWL',
    'Glenvowell',
    'Glenvowell',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GOLDCREK',
    'Gold Creek',
    'Gold Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GOLDRIVR',
    'Gold River',
    'Gold River',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GOLDBRID',
    'Goldbridge',
    'Goldbridge',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GOLDEN',
    'Golden',
    'Golden',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GOODHOPE',
    'Good Hope',
    'Good Hope',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GOODHOPL',
    'Good Hope Lake',
    'Good Hope Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GOODLOW',
    'Goodlow',
    'Goodlow',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GRANDFOR',
    'Grand Forks',
    'Grand Forks',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GRANISLE',
    'Granisle',
    'Granisle',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GRANTHMS',
    'Granthams Landing',
    'Granthams Landing',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GRASMERE',
    'Grasmere',
    'Grasmere',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GRASPLNS',
    'Grassy Plains',
    'Grassy Plains',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GRAYCREE',
    'Gray Creek',
    'Gray Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GRSEHRBR',
    'Grease Harbour/Nass Camp',
    'Grease Harbour/Nass Camp',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GREELY',
    'Greely',
    'Greely',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GREENLLO',
    'Green Lake - Lillooet',
    'Green Lake - Lillooet',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GREENL70',
    'Green Lake -70 Mile',
    'Green Lake -70 Mile',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GREENDAL',
    'Greendale',
    'Greendale',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GREENVLE',
    'Greenville - Laxgalts''ap',
    'Greenville - Laxgalts''ap',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GREENWOD',
    'Greenwood',
    'Greenwood',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GRIFFNLK',
    'Griffin Lake',
    'Griffin Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GRINDROD',
    'Grindrod',
    'Grindrod',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GROUNDBR',
    'Groundbirch',
    'Groundbirch',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GUNLAKE',
    'Gun Lake',
    'Gun Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'GUNDY',
    'Gundy',
    'Gundy',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HAGENSBG',
    'Hagensborg',
    'Hagensborg',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HAIDAGWA',
    'Haida Gwaii',
    'Haida Gwaii',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HAINESJU',
    'Haines Junction',
    'Haines Junction',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HALFMNB',
    'Halfmoon Bay',
    'Halfmoon Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HALFWYRF',
    'Halfway River First Nation',
    'Halfway River First Nation',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HALLS',
    'Halls',
    'Halls',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HAMMERLK',
    'Hammer Lake',
    'Hammer Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HAMMOND',
    'Hammond',
    'Hammond',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HANCEVLE',
    'Hanceville',
    'Hanceville',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HANEY',
    'Haney',
    'Haney',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HANSARDU',
    'Hansard/Upper Fraser',
    'Hansard/Upper Fraser',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HARDWCKI',
    'Hardwicke Island',
    'Hardwicke Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HARHOTSP',
    'Harrison Hot Springs',
    'Harrison Hot Springs',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HARSLAKE',
    'Harrison Lake',
    'Harrison Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HARSMILS',
    'Harrison Mills',
    'Harrison Mills',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HARROGAT',
    'Harrogate',
    'Harrogate',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HARROP',
    'Harrop',
    'Harrop',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HARTLYBY',
    'Hartley Bay',
    'Hartley Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HASLERFL',
    'Hasler Flats',
    'Hasler Flats',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HATCREEK',
    'Hat Creek',
    'Hat Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HATZIC',
    'Hatzic',
    'Hatzic',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HAZELTON',
    'Hazelton',
    'Hazelton',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HEDLEY',
    'Hedley',
    'Hedley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HEFFLCKR',
    'Heffley Creek',
    'Heffley Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HEFFLLAK',
    'Heffley Lake',
    'Heffley Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HELMTGAS',
    'Helmet Gas Field',
    'Helmet Gas Field',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HIGHLAND',
    'Highlands',
    'Highlands',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HIGHLAVL',
    'Highlands Valley',
    'Highlands Valley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HILLS',
    'Hills',
    'Hills',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HIXON',
    'Hixon',
    'Hixon',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HOLBERG',
    'Holberg',
    'Holberg',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HOMESRVR',
    'Homes River',
    'Homes River',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HNMNBAY',
    'Honeymoon Bay',
    'Honeymoon Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HOPE',
    'Hope',
    'Hope',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HORNBYIS',
    'Hornby Island',
    'Hornby Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HORNELAK',
    'Horne Lake',
    'Horne Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HORSEFLY',
    'Horsefly',
    'Horsefly',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HORSHOEB',
    'Horseshoe Bay',
    'Horseshoe Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HOSMER',
    'Hosmer',
    'Hosmer',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HOTSPRCV',
    'Hot Springs Cove',
    'Hot Springs Cove',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HOTHAMS',
    'Hotham Sound',
    'Hotham Sound',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HOUSTON',
    'Houston',
    'Houston',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HOWSER',
    'Howser',
    'Howser',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HUDSONSH',
    'Hudson''s Hope',
    'Hudson''s Hope',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HYDECREE',
    'Hyde Creek',
    'Hyde Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ILLECILL',
    'Illecillewaet',
    'Illecillewaet',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'INDIANAR',
    'Indian Arm',
    'Indian Arm',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'INVERMER',
    'Invermere',
    'Invermere',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'IOCO',
    'Ioco',
    'Ioco',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'IRVSLAND',
    'Irvines Landing',
    'Irvines Landing',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ISKUT',
    'Iskut',
    'Iskut',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ISLPIERR',
    'Isle Pierre',
    'Isle Pierre',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'JACKFSLK',
    'Jackfish Lake',
    'Jackfish Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'JADECITY',
    'Jade City',
    'Jade City',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'JAFFRAY',
    'Jaffray',
    'Jaffray',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'JESMOND',
    'Jesmond',
    'Jesmond',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'JOERICH',
    'Joe Rich',
    'Joe Rich',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'JOHNSNLG',
    'Johnsons Landing',
    'Johnsons Landing',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'JORDNRVR',
    'Jordan River',
    'Jordan River',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'JUSKATLA',
    'Juskatla',
    'Juskatla',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KALEDEN',
    'Kaleden',
    'Kaleden',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KAMLOOPS',
    'Kamloops',
    'Kamloops',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KANAKABR',
    'Kanaka Bar',
    'Kanaka Bar',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KASLOBC',
    'Kaslo',
    'Kaslo',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KEATSISL',
    'Keats Island',
    'Keats Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KELLYCRK',
    'Kelly Creek',
    'Kelly Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KELLYLAK',
    'Kelly Lake',
    'Kelly Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KELOWNA',
    'Kelowna',
    'Kelowna',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KELSEYBY',
    'Kelsey Bay',
    'Kelsey Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KEMANO',
    'Kemano',
    'Kemano',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KEMESSMN',
    'Kemess Mine',
    'Kemess Mine',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KENT',
    'Kent',
    'Kent',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KEREMEOS',
    'Keremeos',
    'Keremeos',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KERSLEY',
    'Kersley',
    'Kersley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KILDONAN',
    'Kildonan',
    'Kildonan',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KILKERRN',
    'Kilkerran',
    'Kilkerran',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KILLNYBC',
    'Killiney Beach',
    'Killiney Beach',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KIMBERLY',
    'Kimberley',
    'Kimberley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KINABSKT',
    'Kinabasket Lake',
    'Kinabasket Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KINCOLTH',
    'Kincolith - Ginglox',
    'Kincolith - Ginglox',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KNGCOMEI',
    'Kingcome Inlet',
    'Kingcome Inlet',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KINGFSHR',
    'Kingfisher',
    'Kingfisher',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KINGSGTE',
    'Kingsgate',
    'Kingsgate',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KINGSVAL',
    'Kingsvale',
    'Kingsvale',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KISPIOX',
    'Kispiox',
    'Kispiox',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KITCHNRR',
    'Kitchener',
    'Kitchener',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KITIMAAT',
    'Kitimaat Village, I.R.',
    'Kitimaat Village, I.R.',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KITIMAT',
    'Kitimat',
    'Kitimat',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KITKATLA',
    'Kitkatla I.R.',
    'Kitkatla I.R.',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KITSAULT',
    'Kitsault',
    'Kitsault',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KITSGCLA',
    'Kitseguecla',
    'Kitseguecla',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KITWANCL',
    'Kitwancool',
    'Kitwancool',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KITWANGA',
    'Kitwanga',
    'Kitwanga',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KLEANZA',
    'Kleanza',
    'Kleanza',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KLEENAKL',
    'Kleena Kleene',
    'Kleena Kleene',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KLEMTU',
    'Klemtu',
    'Klemtu',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KLUSKUS',
    'Kluskus',
    'Kluskus',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KNOUFFLK',
    'Knouff Lake',
    'Knouff Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KNUTSFOR',
    'Knutsford',
    'Knutsford',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KOOTNAYB',
    'Kootenay Bay',
    'Kootenay Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KRESTOVA',
    'Krestova',
    'Krestova',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KUPERISL',
    'Kuper Island',
    'Kuper Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KUSKANOK',
    'Kuskanook',
    'Kuskanook',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KYUQUOT',
    'Kyuquot',
    'Kyuquot',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LACDSRCH',
    'Lac Des Roche',
    'Lac Des Roche',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LACDSRHS',
    'Lac Des Roches',
    'Lac Des Roches',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LACLACHE',
    'Lac La Hache',
    'Lac La Hache',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LACLEJUN',
    'Lac Le Jeune',
    'Lac Le Jeune',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LADNERBC',
    'Ladner',
    'Ladner',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LADYSMTH',
    'Ladysmith',
    'Ladysmith',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LAKECNRY',
    'Lake Country (Winfield was the original name)',
    'Lake Country (Winfield was the original name)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LKECOWCH',
    'Lake Cowichan',
    'Lake Cowichan',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LKEEROCK',
    'Lake Errock',
    'Lake Errock',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LKEREVS',
    'Lake Revelstoke',
    'Lake Revelstoke',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LAKELSEK',
    'Lakelse Lake',
    'Lakelse Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LANGBAY',
    'Lang Bay',
    'Lang Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LANGDALE',
    'Langdale',
    'Langdale',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LANGFORD',
    'Langford',
    'Langford',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LANGLEY',
    'Langley',
    'Langley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LANTZVIL',
    'Lantzville',
    'Lantzville',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LARDEAU',
    'Lardeau',
    'Lardeau',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LASQUETI',
    'Lasqueti Island',
    'Lasqueti Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LAURETTA',
    'Lauretta',
    'Lauretta',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LAVINGTON',
    'Lavington',
    'Lavington',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LAWNHILL',
    'Lawn Hill',
    'Lawn Hill',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LEBAHDO',
    'Lebahdo',
    'Lebahdo',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LEMORAY',
    'Lemoray',
    'Lemoray',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LIARDHSP',
    'Liard Hot Springs',
    'Liard Hot Springs',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LIARDRVR',
    'Liard River',
    'Liard River',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LIKELY',
    'Likely',
    'Likely',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LILLOOET',
    'Lillooet',
    'Lillooet',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LILLOLTK',
    'Lillooet Lake (Pemberton Area)',
    'Lillooet Lake (Pemberton Area)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LINDELLB',
    'Lindell Beach',
    'Lindell Beach',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LIONSBAY',
    'Lions Bay',
    'Lions Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LISTER',
    'Lister',
    'Lister',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LITTLEFT',
    'Little Fort',
    'Little Fort',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LOGNLK',
    'Logan Lake',
    'Logan Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LONEBTTE',
    'Lone Butte',
    'Lone Butte',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LONEPRAR',
    'Lone Prairie',
    'Lone Prairie',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LONGWORT',
    'Longworth',
    'Longworth',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LOONLAKE',
    'Loon Lake',
    'Loon Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LOOS',
    'Loos',
    'Loos',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LOUGHBOR',
    'Loughborough Inlet',
    'Loughborough Inlet',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LOUISECR',
    'Louise Creek',
    'Louise Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LOVELLCO',
    'Lovell Cove',
    'Lovell Cove',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LOWERNIC',
    'Lower Nicola',
    'Lower Nicola',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LOWERPOS',
    'Lower Post',
    'Lower Post',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LUMBY',
    'Lumby',
    'Lumby',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LUND',
    'Lund',
    'Lund',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'LYTTONBC',
    'Lytton',
    'Lytton',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MABELLAK',
    'Mabel Lake',
    'Mabel Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MACHETEL',
    'Machete Lake',
    'Machete Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MACKENZI',
    'Mackenzie',
    'Mackenzie',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MADEIRA',
    'Madeira',
    'Madeira',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MADEIRAP',
    'Madeira Park',
    'Madeira Park',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MAHOODFA',
    'Mahood Falls',
    'Mahood Falls',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MALAKWA',
    'Malakwa',
    'Malakwa',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MANNINGP',
    'Manning Park',
    'Manning Park',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MANSONCR',
    'Manson Creek',
    'Manson Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MAPLEBAY',
    'Maple Bay',
    'Maple Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MAPLERID',
    'Maple Ridge',
    'Maple Ridge',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MARA',
    'Mara',
    'Mara',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MARALAKE',
    'Mara Lake',
    'Mara Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MARGUERI',
    'Marguerite',
    'Marguerite',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MARGNTIR',
    'Marguerite (but not Marguerite IR - Quesnel)',
    'Marguerite (but not Marguerite IR - Quesnel)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MARGIR',
    'Marguerite Indian Reserve',
    'Marguerite Indian Reserve',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MARTINVA',
    'Martin Valley',
    'Martin Valley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MARYSVIL',
    'Marysville',
    'Marysville',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MASSET',
    'Masset',
    'Masset',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MATSQUI',
    'Matsqui',
    'Matsqui',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MAYNEISL',
    'Mayne Island',
    'Mayne Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MAYOOK',
    'Mayook',
    'Mayook',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MCBRIDE',
    'McBride',
    'McBride',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MCCULLOC',
    'McCulloch',
    'McCulloch',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MCGREGOR',
    'McGregor',
    'McGregor',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MCKINLEY',
    'McKinley Landing',
    'McKinley Landing',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MCLEESEL',
    'McLeese Lake',
    'McLeese Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MCLEODLK',
    'Mcleod Lake',
    'Mcleod Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MCLURE',
    'McLure',
    'McLure',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MCMURDO',
    'McMurdo',
    'McMurdo',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MEADOWCR',
    'Meadow Creek',
    'Meadow Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MEADWLAK',
    'Meadow Lake',
    'Meadow Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MEADOWBK',
    'Meadowbrook',
    'Meadowbrook',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MELDRUMC',
    'Meldrum Creek',
    'Meldrum Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MERRITT',
    'Merritt',
    'Merritt',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MERVILLE',
    'Merville',
    'Merville',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MESACHLK',
    'Mesachie Lake',
    'Mesachie Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MESSEZLK',
    'Messezula Lake',
    'Messezula Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'METAKATL',
    'Metakatla',
    'Metakatla',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'METCHOSI',
    'Metchosin',
    'Metchosin',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MEZIADIN',
    'Meziadin Junction',
    'Meziadin Junction',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MIDDLEPT',
    'Middlepoint',
    'Middlepoint',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MIDWAYBC',
    'Midway',
    'Midway',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MILE625',
    'Mile 62.5',
    'Mile 62.5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MILLBAYB',
    'Mill Bay',
    'Mill Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MILLERCK',
    'Miller Creek',
    'Miller Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MINSTREL',
    'Minstrel Island',
    'Minstrel Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MIOCENE',
    'Miocene',
    'Miocene',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MIRRLAKE',
    'Mirror Lake',
    'Mirror Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MISSION',
    'Mission',
    'Mission',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MIWORTH',
    'Miworth',
    'Miworth',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MOBERLYL',
    'Moberly Lake',
    'Moberly Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MONTECRE',
    'Monte Creek',
    'Monte Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MONTELAK',
    'Monte Lake',
    'Monte Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MONTICLK',
    'Monticola Lake',
    'Monticola Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MONTNEYB',
    'Montney',
    'Montney',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MONTROSE',
    'Montrose',
    'Montrose',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MORRISEY',
    'Morrisey',
    'Morrisey',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MOUNTCUR',
    'Mount Currie',
    'Mount Currie',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MOYIE',
    'Moyie',
    'Moyie',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MUNCHOLK',
    'Muncho Lake',
    'Muncho Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MUSKWHTS',
    'Muskwa Heights',
    'Muskwa Heights',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MYRTLCRK',
    'Myrtle Creek',
    'Myrtle Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MYRTLPT',
    'Myrtle Point',
    'Myrtle Point',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NDNHA',
    'Naden Harbour',
    'Naden Harbour',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NAHUN',
    'Nahun',
    'Nahun',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NAKUSP',
    'Nakusp',
    'Nakusp',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NAMU',
    'Namu',
    'Namu',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MOUNTROB',
    'Mount Robson',
    'Mount Robson',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:36.949948',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NANAIMO',
    'Nanaimo',
    'Nanaimo',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NANOBAY',
    'Nanoose Bay',
    'Nanoose Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NARAMA',
    'Naramata',
    'Naramata',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NASCA',
    'Nass Camp',
    'Nass Camp',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NAZKO',
    'Nazko',
    'Nazko',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NEEDL',
    'Needles',
    'Needles',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NELSON',
    'Nelson',
    'Nelson',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NELISL',
    'Nelson Island',
    'Nelson Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NELWA',
    'Nelway',
    'Nelway',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NEMAIIR',
    'Nemaiah (IR)',
    'Nemaiah (IR)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NEMIAVLY',
    'Nemia Valley',
    'Nemia Valley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NESSLAK',
    'Ness Lake',
    'Ness Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NEWAIYA',
    'New Aiyansh',
    'New Aiyansh',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NEWDEN',
    'New Denver',
    'New Denver',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NEWHAZ',
    'New Hazelton',
    'New Hazelton',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NEWREMO',
    'New Remo',
    'New Remo',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NEWWEST',
    'New Westminster',
    'New Westminster',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NEWGAT',
    'Newgate',
    'Newgate',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NEWLAN',
    'Newlands',
    'Newlands',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NICHOLN',
    'Nicholson',
    'Nicholson',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NICORES',
    'Nicola Reserve',
    'Nicola Reserve',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NICORES2',
    'Nicomen Reserve',
    'Nicomen Reserve',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NIMPOLAK',
    'Nimpo Lake',
    'Nimpo Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NITINA',
    'Nitinat',
    'Nitinat',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NOOTISL',
    'Nootka Island',
    'Nootka Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NORALEE',
    'NoraLee',
    'NoraLee',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NORBEN',
    'North Bend',
    'North Bend',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NORBON',
    'North Bonaparte',
    'North Bonaparte',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NORCOWI',
    'North Cowichan',
    'North Cowichan',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NPENDER',
    'North Pender Island',
    'North Pender Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NORPINE',
    'North Pine',
    'North Pine',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NORSAAN',
    'North Saanich',
    'North Saanich',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NORVAN',
    'North Vancouver',
    'North Vancouver',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'NUKKOLA',
    'Nukko Lake',
    'Nukko Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OAKBAY',
    'Oak Bay',
    'Oak Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OASIS',
    'Oasis',
    'Oasis',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OCEAFAL',
    'Ocean Falls',
    'Ocean Falls',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OKACEN',
    'Okanagan Centre',
    'Okanagan Centre',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OKAFALLS',
    'Okanagan Falls',
    'Okanagan Falls',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OKALAND',
    'Okanagan Landing',
    'Okanagan Landing',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OKEOVER',
    'Okeover Inlet',
    'Okeover Inlet',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OLALLA',
    'Olalla',
    'Olalla',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OLDHZLTN',
    'Old Hazelton',
    'Old Hazelton',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OLDMASST',
    'Old Masset',
    'Old Masset',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OLDREMO',
    'Old Remo',
    'Old Remo',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OLDTWNST',
    'Old Townsite',
    'Old Townsite',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OLIVER',
    'Oliver',
    'Oliver',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ONEISLLK',
    'One Island Lake',
    'One Island Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OONARVR',
    'Oona River (Porcher Island)',
    'Oona River (Porcher Island)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OOTISCH',
    'Ootischenia',
    'Ootischenia',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OOTSALAK',
    'Ootsa Lake',
    'Ootsa Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OPISTAT',
    'Opistat',
    'Opistat',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OSOYOOS',
    'Osoyoos',
    'Osoyoos',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OSPREYLK',
    'Osprey Lake',
    'Osprey Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OWEEKENO',
    'Oweekeno',
    'Oweekeno',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OYAMA',
    'Oyama',
    'Oyama',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OYSTERBY',
    'Oyster Bay',
    'Oyster Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'OYSTERRV',
    'Oyster River',
    'Oyster River',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PALLING',
    'Palling',
    'Palling',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PANORAMA',
    'Panorama',
    'Panorama',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SAYWARD',
    'Sayward',
    'Sayward',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PARKCOVE',
    'Parker Cove',
    'Parker Cove',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PARKLAND',
    'Parkland',
    'Parkland',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PARKSVLE',
    'Parksville',
    'Parksville',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PARSON',
    'Parson',
    'Parson',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PASSCREE',
    'Pass Creek',
    'Pass Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PASSMORE',
    'Passmore',
    'Passmore',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PATTERSN',
    'Patterson',
    'Patterson',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PAVILLON',
    'Pavillion',
    'Pavillion',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PEACHLND',
    'Peachland',
    'Peachland',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PEEJAY',
    'Peejay',
    'Peejay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PEMBERTN',
    'Pemberton',
    'Pemberton',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PENDLTNB',
    'Pendelton Bay',
    'Pendelton Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PENDHARB',
    'Pender Harbour',
    'Pender Harbour',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PENDERIS',
    'Pender Island',
    'Pender Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PENNY',
    'Penny',
    'Penny',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PENTICTN',
    'Penticton',
    'Penticton',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PHILLIPS',
    'Phillips Arm',
    'Phillips Arm',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PILOTBAY',
    'Pilot Bay',
    'Pilot Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PILOTMTN',
    'Pilot Mountain',
    'Pilot Mountain',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PINATNLK',
    'Pinatan Lake',
    'Pinatan Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PINCHE',
    'Pinche',
    'Pinche',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PINCHIRS',
    'Pinchi Reserve',
    'Pinchi Reserve',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PINEVLLY',
    'Pine Valley',
    'Pine Valley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PINECRST',
    'Pinecrest',
    'Pinecrest',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PINEVIEW',
    'Pineview',
    'Pineview',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PNKMOUNT',
    'Pink Mountain',
    'Pink Mountain',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PITPOLDER',
    'Pit Polder',
    'Pit Polder',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PITTMDWS',
    'Pitt Meadows',
    'Pitt Meadows',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PLAYMJCT',
    'Playmor Junction',
    'Playmor Junction',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PLSNTCMP',
    'Pleasant Camp',
    'Pleasant Camp',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'POPKUM',
    'Popkum',
    'Popkum',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PORCHERI',
    'Porcher Island',
    'Porcher Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PORTALBR',
    'Port Alberni',
    'Port Alberni',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PORTALIC',
    'Port Alice',
    'Port Alice',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PORTCLEM',
    'Port Clements',
    'Port Clements',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PORTCOQ',
    'Port Coquitlam',
    'Port Coquitlam',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PORTDOUG',
    'Port Douglas',
    'Port Douglas',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PORTEDWRD',
    'Port Edward',
    'Port Edward',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PORTESG',
    'Port Essington',
    'Port Essington',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PORTHRDY',
    'Port Hardy',
    'Port Hardy',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PORTMCNL',
    'Port McNeill',
    'Port McNeill',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PORTMELN',
    'Port Mellon',
    'Port Mellon',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PORTMDY',
    'Port Moody',
    'Port Moody',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PORTNEVL',
    'Port Neville',
    'Port Neville',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PORTRENF',
    'Port Renfrew',
    'Port Renfrew',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PORTSIMP',
    'Port Simpson',
    'Port Simpson',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PORTAGER',
    'Portage Reserve',
    'Portage Reserve',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PORTRICO',
    'Porto Rico',
    'Porto Rico',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'POUCOUP',
    'Pouce Coupe',
    'Pouce Coupe',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'POWDERKG',
    'Powder King',
    'Powder King',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'POWELLRV',
    'Powell River',
    'Powell River',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PRESPATU',
    'Prespatou',
    'Prespatou',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PRESSYLK',
    'Pressy Lake',
    'Pressy Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PREVOSTI',
    'Prevost Island',
    'Prevost Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PRINGEOR',
    'Prince George',
    'Prince George',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PRINCRUP',
    'Prince Rupert',
    'Prince Rupert',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PRINCETN',
    'Princeton',
    'Princeton',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PRITCHRD',
    'Pritchard',
    'Pritchard',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PROCTOR',
    'Proctor',
    'Proctor',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PROGRESS',
    'Progress',
    'Progress',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PROPHETR',
    'Prophet River',
    'Prophet River',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PUNTZI',
    'Puntzi',
    'Puntzi',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'PURDENLK',
    'Purden Lake',
    'Purden Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'QUADRAIS',
    'Quadra Island',
    'Quadra Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'QLICMBAY',
    'Qualicum Bay',
    'Qualicum Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'QLICMBCH',
    'Qualicum Beach',
    'Qualicum Beach',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'QUATSINO',
    'Quatsino',
    'Quatsino',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'QUESNEL',
    'Quesnel',
    'Quesnel',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'QUESFORK',
    'Quesnel Forks',
    'Quesnel Forks',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'QUILCHNA',
    'Quilchena',
    'Quilchena',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'RADHOTSP',
    'Radium Hot Springs',
    'Radium Hot Springs',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'RASPBRRY',
    'Raspberry',
    'Raspberry',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'RAYLEIGH',
    'Rayleigh',
    'Rayleigh',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'READISLD',
    'Read Island',
    'Read Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'REDLAKE',
    'Red Lake',
    'Red Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'REDPASS',
    'Red Pass',
    'Red Pass',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'REDFERNL',
    'Redfern Lake (Mile 178)',
    'Redfern Lake (Mile 178)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'RRSTONER',
    'Redrock/Stoner',
    'Redrock/Stoner',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'REDSTON',
    'Redstone (IR)',
    'Redstone (IR)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'REIDLAKE',
    'Reid Lake',
    'Reid Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'RENATA',
    'Renata',
    'Renata',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'REVELSTO',
    'Revelstoke',
    'Revelstoke',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'RICHMOND',
    'Richmond',
    'Richmond',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'RIONDEL',
    'Riondel',
    'Riondel',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'RISKECRK',
    'Riske Creek',
    'Riske Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'RIVERDAL',
    'Riverdale',
    'Riverdale',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ROBERTSC',
    'Roberts Creek',
    'Roberts Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ROBERTSL',
    'Roberts Lake',
    'Roberts Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ROBSON',
    'Robson',
    'Robson',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ROCKBAY',
    'Rock Bay',
    'Rock Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ROCKCRK',
    'Rock Creek',
    'Rock Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ROELAKE',
    'Roe Lake',
    'Roe Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ROLLA',
    'Rolla',
    'Rolla',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ROOSVLL',
    'Roosville',
    'Roosville',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ROSEPRR',
    'Rose Prairie',
    'Rose Prairie',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ROSEBRY',
    'Rosebery',
    'Rosebery',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ROSEDALE',
    'Rosedale',
    'Rosedale',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ROSENLK',
    'Rosen Lake',
    'Rosen Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ROSSLND',
    'Rossland',
    'Rossland',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ROSSWOD',
    'Rosswood',
    'Rosswood',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ROYSTON',
    'Royston',
    'Royston',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'RUSKINN',
    'Ruskin',
    'Ruskin',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'RUTLAND',
    'Rutland',
    'Rutland',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'RYKERTS',
    'Rykerts',
    'Rykerts',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SAANICH',
    'Saanich',
    'Saanich',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SAHTLAM',
    'Sahtlam',
    'Sahtlam',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SALMO',
    'Salmo',
    'Salmo',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SALMARM',
    'Salmon Arm',
    'Salmon Arm',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SALMNVY',
    'Salmon Valley',
    'Salmon Valley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SALTSPR',
    'Salt Spring Island',
    'Salt Spring Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SALTERYB',
    'Saltery Bay',
    'Saltery Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SANCA',
    'Sanca',
    'Sanca',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SANDON',
    'Sandon',
    'Sandon',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SANDSPIT',
    'Sandspit',
    'Sandspit',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SNDYHK',
    'Sandy Hook',
    'Sandy Hook',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SARDIS',
    'Sardis',
    'Sardis',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SATRNAI',
    'Saturna Island',
    'Saturna Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SAVARYIS',
    'Savary Island',
    'Savary Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SAVONA',
    'Savona',
    'Savona',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SCTCHCRK',
    'Scotch Creek',
    'Scotch Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SECHELT',
    'Sechelt',
    'Sechelt',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SCRTOCV',
    'Secret Cove',
    'Secret Cove',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SELMAPRK',
    'Selma Park',
    'Selma Park',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SETONPOR',
    'Seton Portage',
    'Seton Portage',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SEWELLIN',
    'Sewell Inlet',
    'Sewell Inlet',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SEYMOURA',
    'Seymour Arm',
    'Seymour Arm',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SEYMOURL',
    'Seymour Lakes',
    'Seymour Lakes',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SHALALTH',
    'Shalalth',
    'Shalalth',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SHARPELK',
    'Sharpe Lake',
    'Sharpe Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SHWNIGN',
    'Shawnigan Lake',
    'Shawnigan Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SHRERDAL',
    'Shearer Dale',
    'Shearer Dale',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SHELLGLN',
    'Shell - Glen',
    'Shell - Glen',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SHELTRBY',
    'Shelter Bay',
    'Shelter Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SHERIDN',
    'Sheridan Lake',
    'Sheridan Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SHOREACR',
    'Shoreacres',
    'Shoreacres',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SHOREHLM',
    'Shoreholm',
    'Shoreholm',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SHUTTYBN',
    'Shutty Bench',
    'Shutty Bench',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SICAMOUS',
    'Sicamous',
    'Sicamous',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SIDNEY',
    'Sidney',
    'Sidney',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SIKANNI',
    'Sikanni (Mile 171)',
    'Sikanni (Mile 171)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SLVRDALE',
    'Silverdale',
    'Silverdale',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SLVRTN',
    'Silverton',
    'Silverton',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SINCLRM',
    'Sinclair Mills',
    'Sinclair Mills',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SIRDAR',
    'Sirdar',
    'Sirdar',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SIXMILPT',
    'Six Mile Point',
    'Six Mile Point',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SKEETCHE',
    'Skeetchestn',
    'Skeetchestn',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SKIDGATL',
    'Skidegate Landing',
    'Skidegate Landing',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SKIDEGTR',
    'Skidegate Reserve',
    'Skidegate Reserve',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SKOOKUMC',
    'Skookumchuck',
    'Skookumchuck',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SLIAMMON',
    'Sliammon',
    'Sliammon',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SLOCAN',
    'Slocan',
    'Slocan',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SLOCNPRK',
    'Slocan Park',
    'Slocan Park',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SMITHRVR',
    'Smith River',
    'Smith River',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SMITHERS',
    'Smithers',
    'Smithers',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SODACRK',
    'Soda Cr. (IR)',
    'Soda Cr. (IR)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SOINTULA',
    'Sointula',
    'Sointula',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SONORAI',
    'Sonora Island',
    'Sonora Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SOOKE',
    'Sooke',
    'Sooke',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SORRENTO',
    'Sorrento',
    'Sorrento',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SDWNSN',
    'South Dawson',
    'South Dawson',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SHZLTON',
    'South Hazelton',
    'South Hazelton',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SPNDRILN',
    'South Pender Island',
    'South Pender Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'STHSLCN',
    'South Slocan',
    'South Slocan',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'STHSLCNN',
    'South Slocan (northern part of town)',
    'South Slocan (northern part of town)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'STHTYLR',
    'South Taylor',
    'South Taylor',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'STHBNK',
    'Southbank',
    'Southbank',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'STHVW',
    'Southview',
    'Southview',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SPALLMCHN',
    'Spallumcheen',
    'Spallumcheen',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SPRWOOD',
    'Sparwood',
    'Sparwood',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SPNCESBR',
    'Spences Bridge',
    'Spences Bridge',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SPLLMCHN',
    'Spillimacheen',
    'Spillimacheen',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SPRNHOUS',
    'Spring House',
    'Spring House',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SPUZZUM',
    'Spuzzum',
    'Spuzzum',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SQUMISH',
    'Squamish',
    'Squamish',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'STAVFLS',
    'Stave Falls',
    'Stave Falls',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'STALHEAD',
    'Stealhead',
    'Stealhead',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'STMBOAT',
    'Steamboat',
    'Steamboat',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'STELHEAD',
    'Steelhead',
    'Steelhead',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'STWART',
    'Stewart',
    'Stewart',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'STLLWTR',
    'Stillwater',
    'Stillwater',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'STONEIR',
    'Stone (IR)',
    'Stone (IR)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'STRTHNVR',
    'Strathnaver',
    'Strathnaver',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'STRTHAM',
    'Streatham',
    'Streatham',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'STUARTIL',
    'Stuart Island',
    'Stuart Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'STUIE',
    'Stuie',
    'Stuie',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'STUMPLAK',
    'Stump Lake',
    'Stump Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SUGARCIR',
    'Sugar Cane (IR)',
    'Sugar Cane (IR)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SMRLAND',
    'Summerland',
    'Summerland',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SMITLK',
    'Summit Lake',
    'Summit Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SMITLKPP',
    'Summit Lake (Provincial Park)',
    'Summit Lake (Provincial Park)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SNPEAKS',
    'Sun Peaks',
    'Sun Peaks',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SNSTPRAR',
    'Sunset Prairie',
    'Sunset Prairie',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SURRY',
    'Surrey',
    'Surrey',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SWNLKPP',
    'Swan Lake (Provincial Park)',
    'Swan Lake (Provincial Park)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SWNLKKRP',
    'Swan Lake/Kispiox River (Provincial Park)',
    'Swan Lake/Kispiox River (Provincial Park)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'SWTWATR',
    'Sweetwater',
    'Sweetwater',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TABOR',
    'Tabor',
    'Tabor',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TACHIRSV',
    'Tachie Reserve',
    'Tachie Reserve',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TAFT',
    'Taft',
    'Taft',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TAGHUM',
    'Taghum',
    'Taghum',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TAHSIS',
    'Tahsis',
    'Tahsis',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TKLALNDG',
    'Takla Landing',
    'Takla Landing',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TKYSLAKE',
    'Takysie Lake',
    'Takysie Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TAPPEN',
    'Tappen',
    'Tappen',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TARRYS',
    'Tarrys',
    'Tarrys',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TATACRK',
    'TaTa Creek',
    'TaTa Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TATLALAK',
    'Tatla Lake',
    'Tatla Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TATLYOKO',
    'Tatlayoko Lake',
    'Tatlayoko Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TAWELK',
    'Taweel Lake',
    'Taweel Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TAYLOR',
    'Taylor',
    'Taylor',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TCHSNKUT',
    'Tchesinkut Lake',
    'Tchesinkut Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TGRPHCOV',
    'Telegraph Cove',
    'Telegraph Cove',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TGRPHCRK',
    'Telegraph Creek',
    'Telegraph Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TELKWA',
    'Telkwa',
    'Telkwa',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TERRACE',
    'Terrace',
    'Terrace',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TTJUNE',
    'Tete Jaune',
    'Tete Jaune',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TEXADAIS',
    'Texada Island',
    'Texada Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'THDSAINL',
    'Theodosia Inlet',
    'Theodosia Inlet',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'THETISIS',
    'Thetis Island',
    'Thetis Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'THMPSNSD',
    'Thompson Sound',
    'Thompson Sound',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'THRVALGP',
    'Three Valley Gap/Lake',
    'Three Valley Gap/Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'THRUMS',
    'Thrums',
    'Thrums',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TIELAKE',
    'Tie Lake',
    'Tie Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TINTAGEL',
    'Tintagel',
    'Tintagel',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TLELL',
    'Tlell',
    'Tlell',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TOADRVR',
    'Toad River',
    'Toad River',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TOBAINLT',
    'Toba Inlet',
    'Toba Inlet',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TOFINO',
    'Tofino',
    'Tofino',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TOMSLAKE',
    'Tomslake',
    'Tomslake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TOPLEY',
    'Topley',
    'Topley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TOPLND',
    'Topley Landing',
    'Topley Landing',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TRTSLAKE',
    'Tortoise Lake',
    'Tortoise Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TWRLAKE',
    'Tower Lake',
    'Tower Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TRAIL',
    'Trail',
    'Trail',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TRNQL',
    'Tranquille Valley',
    'Tranquille Valley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TROUTLK',
    'Trout Lake',
    'Trout Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TRUTCH',
    'Trutch',
    'Trutch',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TSAWWASN',
    'Tsawwassen',
    'Tsawwassen',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'INGENKA',
    'Tsay Keh (commonly known as Ingenika)',
    'Tsay Keh (commonly known as Ingenika)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TULAMEEN',
    'Tulameen',
    'Tulameen',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TUMBLER',
    'Tumbler Ridge',
    'Tumbler Ridge',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TUPPER',
    'Tupper',
    'Tupper',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TUWANEK',
    'Tuwanek',
    'Tuwanek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TWINBUTE',
    'Twin Butte',
    'Twin Butte',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TWORIVR',
    'Two Rivers',
    'Two Rivers',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TYAXLK',
    'Tyaughton(Tyax)Lake',
    'Tyaughton(Tyax)Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'TYE',
    'Tye',
    'Tye',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'UCLUELET',
    'Ucluelet',
    'Ucluelet',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'UNIONBAY',
    'Union Bay',
    'Union Bay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'UNIVENDW',
    'Univ Endow''t Lands',
    'Univ Endow''t Lands',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'UPRARRWL',
    'Upper Arrow Lake',
    'Upper Arrow Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'UPRCUTBK',
    'Upper Cutbank',
    'Upper Cutbank',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'UPRFRASR',
    'Upper Fraser',
    'Upper Fraser',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'USK',
    'Usk',
    'Usk',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'VALDESIS',
    'Valdes Island',
    'Valdes Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'VALEMONT',
    'Valemount',
    'Valemount',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'VLYVIEW',
    'Valleyview',
    'Valleyview',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'VALLICAN',
    'Vallican',
    'Vallican',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'VANANDA',
    'Vananda',
    'Vananda',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'VANCOUVR',
    'Vancouver',
    'Vancouver',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'VANDERHF',
    'Vanderhoof',
    'Vanderhoof',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'VAVENBY',
    'Vavenby',
    'Vavenby',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'VENABLES',
    'Venables Valley',
    'Venables Valley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'VERNON',
    'Vernon',
    'Vernon',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'VICTORLK',
    'Victor Lake',
    'Victor Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'VICTORIA',
    'Victoria',
    'Victoria',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'VIEWROYL',
    'View Royal',
    'View Royal',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WALHACHN',
    'Walhachin',
    'Walhachin',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WANETA',
    'Waneta',
    'Waneta',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WARDNER',
    'Wardner',
    'Wardner',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WARFIELD',
    'Warfield',
    'Warfield',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WASA',
    'Wasa',
    'Wasa',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WEBSTRCR',
    'Websters Corner',
    'Websters Corner',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WELLS',
    'Wells',
    'Wells',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WCRACRFT',
    'West Cracroft Island',
    'West Cracroft Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WESTCRST',
    'West Creston',
    'West Creston',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WSTKELOW',
    'West Kelowna',
    'West Kelowna',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WESTLK',
    'West Lake',
    'West Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WSTTHRLW',
    'West Thurlow Island',
    'West Thurlow Island',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WSTVANCO',
    'West Vancouver',
    'West Vancouver',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WESTBANK',
    'Westbank',
    'Westbank',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WSTBRDGE',
    'Westbridge',
    'Westbridge',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WSTBR33',
    'Westbridge (Highway 33 junction only)',
    'Westbridge (Highway 33 junction only)',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WESTSIDE',
    'Westside',
    'Westside',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WESTVIEW',
    'Westview',
    'Westview',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WESTWOLD',
    'Westwold',
    'Westwold',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WHTSHANL',
    'Whatshan Lake',
    'Whatshan Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WHISKYC',
    'Whiskey Creek',
    'Whiskey Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WHISTLER',
    'Whistler',
    'Whistler',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WHITELK',
    'White Lake',
    'White Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WHITERIV',
    'White River',
    'White River',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WHITERCK',
    'White Rock',
    'White Rock',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WHITCROF',
    'Whitecroft',
    'Whitecroft',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WHITESWN',
    'Whiteswan Lake',
    'Whiteswan Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WHONNOCK',
    'Whonnock',
    'Whonnock',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WILDWOOD',
    'Wildwood',
    'Wildwood',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WILLMSLK',
    'Williams Lake',
    'Williams Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WILWFLAT',
    'Willow Flats',
    'Willow Flats',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WILWRPOI',
    'Willow Point',
    'Willow Point',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WILWRIVR',
    'Willow River',
    'Willow River',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WILWVALY',
    'Willow Valley',
    'Willow Valley',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WILMER',
    'Wilmer',
    'Wilmer',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WILSNCRK',
    'Wilson Creek',
    'Wilson Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WILSLAKE',
    'Wilson Lake',
    'Wilson Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WLSNLNDG',
    'Wilson''s Landing',
    'Wilson''s Landing',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WINDRMER',
    'Windermere',
    'Windermere',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WINLAW',
    'Winlaw',
    'Winlaw',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WINTRHRB',
    'Winter Harbour',
    'Winter Harbour',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WISTARIA',
    'Wistaria',
    'Wistaria',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WONOWON',
    'Wonowon',
    'Wonowon',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WOSS',
    'Woss',
    'Woss',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WYCLIFFE',
    'Wycliffe',
    'Wycliffe',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WYNDEL',
    'Wynndel',
    'Wynndel',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'YAHK',
    'Yahk',
    'Yahk',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'YALE',
    'Yale',
    'Yale',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'YARROW',
    'Yarrow',
    'Yarrow',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'YLWPOINT',
    'Yellowpoint',
    'Yellowpoint',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'YMIR',
    'Ymir',
    'Ymir',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'YOUBOU',
    'Youbou',
    'Youbou',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'YOUNGLK',
    'Young Lake',
    'Young Lake',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'ZEBALLOS',
    'Zeballos',
    'Zeballos',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'KTNY',
    'Kootenay',
    'Kootenay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'REGION',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CLMBAKTNY',
    'Columbia/Kootenay',
    'Columbia/Kootenay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'EKTNY',
    'East Kootenay',
    'East Kootenay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WKTNY',
    'West Kootenay',
    'West Kootenay',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'ZONE',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'COSHQ',
    'COS HQ',
    'COS Headquarters',
    '2025-09-08 23:27:33.265905',
    NULL,
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'OFFLOC',
    true
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'FIELD',
    'Field',
    'Field',
    '2025-09-08 23:27:33.265905',
    NULL,
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'CNYNHTSPRN',
    'Canyon Hotsprings',
    'Canyon Hotsprings',
    '2025-09-08 23:27:33.265905',
    NULL,
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DPCRKNRSLM',
    'Deep Creek (Near Salmon Arm)',
    'Deep Creek (Near Salmon Arm)',
    '2025-09-08 23:27:33.265905',
    NULL,
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'HGWLGT',
    'Hagwilget',
    'Hagwilget',
    '2025-09-08 23:27:33.265905',
    NULL,
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'RSLKBNSLK',
    'Rose Lake (Burns Lake)',
    'Rose Lake (Burns Lake)',
    '2025-09-08 23:27:33.265905',
    NULL,
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'MICACREK',
    'Mica Creek',
    'Mica Creek',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'WTSMTMRCTW',
    'Witset (Moricetown)',
    'Witset (Moricetown)',
    '2025-09-08 23:27:33.265905',
    NULL,
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DPCRKNRWLL',
    'Deep Creek (Near Williams Lake)',
    'Deep Creek (Near Williams Lake)',
    '2025-09-08 23:27:33.265905',
    NULL,
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'RSLK150MLH',
    'Rose Lake (150 Mile House)',
    'Rose Lake (150 Mile House)',
    '2025-09-08 23:27:33.265905',
    NULL,
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'AREA',
    false
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_organization_unit_code
VALUES
  (
    'DJNGGDS',
    'Daajing Giids',
    'Daajing Giids',
    '2025-09-08 23:27:33.265905',
    NULL,
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'AREA',
    false
  );

--
-- Data for Name: geo_org_unit_structure; Type: TABLE DATA; Schema: shared; Owner: -
--
INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a7fdc906-738c-44e9-8e02-f7ddc74e09ae',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KTNY',
    'CLMBAKTNY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd60e3787-cb36-4754-808a-c614c9333eb1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KTNY',
    'EKTNY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd95cca52-46b8-426a-9da5-b55a0c3eb699',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KTNY',
    'WKTNY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ea7012aa-6b08-4857-a24d-e5c197163f12',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'OKNGN',
    'CENOKNGN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '764f5964-e15f-43b7-bb5d-20d885f7ce8a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'OKNGN',
    'NOKNGN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '828e2b1c-3473-4119-a118-5c0bd9b8b40c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'OKNGN',
    'SOKNGN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '07111584-377a-416d-bded-a2cdd9ce7e90',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'OMINECA',
    'NCHKOLKS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '48d1be96-c867-47fc-a520-e19d7240ecdf',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'OMINECA',
    'OMNCA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f92fb94e-eb91-479d-a91e-e4455c029e38',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PCLRD',
    'NPCE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9159d242-88b1-4bd0-9ba7-a4888970b529',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PCLRD',
    'SPCE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6ea58fe6-aa8e-4837-8941-478b1ca52cec',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SKNA',
    'BLKYCSR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ad937f34-9e81-48c9-b9ed-f1010a375fd0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SKNA',
    'NCST'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '11346764-c129-45e4-a8e3-4534d1e43941',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'STHCST',
    'FRSRN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4dd3e225-b0fa-4b2b-86ad-f695f577657d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'STHCST',
    'FRSRS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '67608e84-813c-4a18-9f23-deb535f7c2c3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'STHCST',
    'SEA2SKY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0fd0f844-ae88-4e89-850f-e40ed6e865cc',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'STHCST',
    'SNSHNCST'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '184aebfd-8bbb-45d0-af5e-eb2f5929eff5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TMPSNCRBO',
    'CRBOCHLCTN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd79decc0-e9bf-4f28-a880-9aa51d31261d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TMPSNCRBO',
    'CRBOTMPSN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c039458e-8002-497a-8eb8-f1366e613b60',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TMPSNCRBO',
    'TMPSNNCLA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '109256d7-275a-4c78-aec5-72c6521a2e13',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WSTCST',
    'CENISL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e3860998-8864-4494-8d4e-5e478c35ecbf',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WSTCST',
    'NISL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0eb9715f-c274-4e3b-9053-56e264e5658c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WSTCST',
    'SISL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '10595bc2-23b0-4597-b89d-7702a0cb2c1d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLMBAKTNY',
    'GLDN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '52af6732-16a6-4da6-86c5-78f7a570bc35',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLMBAKTNY',
    'INVRM'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '52f4bfa5-b5e1-452d-adc3-8e69adc1a85e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'EKTNY',
    'CRNBK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'fb100ebc-3cc4-468b-8c19-e6a62b528d8d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'EKTNY',
    'FRNIE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7fc5b310-495d-4d84-bb04-4d3c8f20ed11',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WKTNY',
    'CSTLGAR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '21839852-7387-4696-904b-f2ad5e816d25',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WKTNY',
    'CRSTN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '25cd8c5d-42e8-46c3-8df4-510940e37bbe',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WKTNY',
    'NLSON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '54b25495-7f30-4775-a4f4-9c3ee8e8a558',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CENOKNGN',
    'KLWNA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a145acd0-b203-400b-a509-040cbcde4187',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NOKNGN',
    'SLMONRM'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9dc4459f-cda1-43a1-a98e-d7ae73abae1d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NOKNGN',
    'VRNON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9da1c1f1-caf8-4c8c-9abc-bf89227f4344',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SOKNGN',
    'GDFKS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '03284ff6-863a-410e-9157-7815f95965ef',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SOKNGN',
    'PNTCTN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6b5aa133-84e6-4015-b05a-4d353f2b56d8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NCHKOLKS',
    'BURNSLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '378e1865-8a1d-4c50-80f7-5c591c005587',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NCHKOLKS',
    'VNDHF'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0b1e4949-d1e7-4c6a-9987-f48008dca752',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'OMNCA',
    'MKNZI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b466432b-17db-49b2-bfdc-f1dd2edac263',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'OMNCA',
    'PRCG'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3642c105-5b5d-4404-919b-c3789b77d96d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NPCE',
    'FRTNLN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '427b68e7-a3f8-453d-af84-8b88263d8cb5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NPCE',
    'FRTSTJN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9806af64-fe4b-44e1-83ee-88acec11c9e8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SPCE',
    'CHTWD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0b61328b-bd46-4a25-aff1-72eccd8d9853',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SPCE',
    'DWSNCRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8c6c35da-6c77-4507-87ee-f3a52a7d5817',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKYCSR',
    'ATLIN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4bfe5707-66a3-4dc6-9b56-ccc98f611c52',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKYCSR',
    'DSELK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a7d03d66-223c-4501-ab1f-ad1516f8a1c2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKYCSR',
    'SMITHRS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '256a0364-d2ed-4742-a6b0-7b9e39c1fad5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NCST',
    'DJNG'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '20d382c0-9319-49ff-84e1-edca77f545aa',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NCST',
    'TERRC'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ebd95e19-8404-4099-be94-46189df606ac',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRSRN',
    'MSNMPLRD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '47160366-0858-467a-a0b7-b1c93f8832eb',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRSRS',
    'MSNCHWK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9bf4e39b-b645-49d1-9748-d08bc5604409',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRSRS',
    'MSNSR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1171df58-ead6-4bde-82c5-1a7e6fd69e5c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SEA2SKY',
    'SQMSHWHS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9c671a95-a696-4c19-927a-fa0d9b78449d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SNSHNCST',
    'PWLRV'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8d064d0d-8197-4f03-8c2f-4caebe288dea',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SNSHNCST',
    'SCHLT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2eb53b8e-6819-43de-bdfd-e00eac99b7a1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRBOCHLCTN',
    'BLLACLA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '50b06dc6-5b02-4f82-ae33-ed63ae2834b1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRBOCHLCTN',
    'QSNL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6cf3d52c-399d-414b-b56e-2f359f4f92ae',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRBOCHLCTN',
    'WLMSLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3e57e218-84ab-463f-8e3f-add7c3b1e150',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRBOTMPSN',
    '100MLHSE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9fd1f5ba-10c0-4652-bb4f-10383e592513',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRBOTMPSN',
    'CLRWTER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '103d33f2-8357-4b81-9091-6a1b4493a33a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRBOTMPSN',
    'LLT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '441da9a7-42be-4b82-8e0d-e28fe3053252',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TMPSNNCLA',
    'KMLPS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '274d8092-a44c-40f8-8662-149f697cfd00',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TMPSNNCLA',
    'MRRTT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0811f5dd-2d50-4567-b431-8bbfa8d709ec',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CENISL',
    'NNIMO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2ec9105c-0243-403d-acd9-f7a7940bd6c6',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CENISL',
    'PRTALB'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '148e9685-bb73-4b65-a259-5f320c8da43d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NISL',
    'BLKCRKCR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7df3e15f-bbb1-48b2-b7c6-8e2a5ebaf3b9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NISL',
    'PRTMCNL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '85c17d63-6c6f-44f0-91d6-7300020e54cd',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SISL',
    'DNCN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '91192a5e-c8c4-4428-86aa-dfe630cf3191',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SISL',
    'VICTRA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c1497d7e-c9b1-44f3-95c0-618f75987e79',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    '100MHHS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '222d9f9e-dca4-4f45-90ac-c6c53cc9a06b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    '108MLRNH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0695eff1-9192-4b09-a54a-f72ee5c99a27',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    '140MHHS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '526022be-9c15-426a-a179-a47ff7a7787c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    '150MHHS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8ad5a59b-6083-48d3-867f-8f763bbf9806',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    '16MIL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ca74ede8-a761-493e-8adc-7d22ab0ee93d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    '40MLFLTZ'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '09ccf917-d5bf-4c01-9594-384793906294',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    '70MLHS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3dac1f5a-2941-4f12-b4c8-5651d3e6b9ba',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'ABTFRD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8781a801-c3e7-4621-b96d-5154fc34ce0c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'ADMSLKHS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '38a584c5-21b9-4a66-9bca-5f5faf05d854',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'AGSSZHS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'fbc639f6-6bcb-451f-8133-98225fa21de2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTALB',
    'AHST'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e6eb4703-d15c-4bf4-8876-bd519d0e06dc',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'ANSWRTH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c243e1ed-7b51-45a8-a452-049ba188483c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'AYNSH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c212ff15-47b9-4e95-be46-2ae78d99e5c5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'ALBRTCNY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9747c99a-9a0b-4899-a1d2-e5a8db14e019',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'ALBION'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2970db11-5c81-490f-8562-80e4c9e5017d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNSR',
    'ALDRGRV'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '896f3b0d-e868-433c-ab63-953c883d4981',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTMCNL',
    'ALRTBAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b3c906d1-8add-42dd-9af6-64d240dd7d85',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'QSNL',
    'ALXNDRIA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '07207a86-6142-4879-8e21-00dc8cf07d0d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'ALXSCRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'fc7f2c5e-f22d-4789-822d-83a4f6389269',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'ALZLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0104532b-3bb4-4523-9f7d-b28f009e732e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'ALCRM'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ed9275a7-2789-4293-a3de-9f59084d992a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'ALKLLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '26aa66d9-f663-4763-a7b1-1a2366a89fda',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'ALKLLKIR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9ea51985-9e78-409a-8cc9-b5fe8017ac71',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    'ALKLLKRV'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd5809e68-cb4b-4659-bae3-3779ece6a845',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DJNG',
    'ALLFRDBY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '58417387-5051-4159-ae63-86feb6da3863',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'ALTONA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'aaf58fea-2b79-4333-8a19-0ef1e9e3f0a6',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'ALVIN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f201ecda-f9c0-4bce-b3d0-0bd5396525ed',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'ANAHAMIR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd4d8feed-14e7-4425-89a8-9cbd210fda87',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'ANAHIMIR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'aa9ba59b-dd84-4256-b769-1522870ddb5d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLLACLA',
    'ANHMLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b66df349-2ad8-4d91-852f-877d9bd50dc1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DJNG',
    'ANCRGIN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7f316a5b-d911-4e4f-9e21-8f40d0d55244',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'ANGLMNT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'dc529c3b-a81c-4675-8534-2e9b8c61ea28',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'ANMR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0afcb40f-65a0-4370-a029-19ae53bcbab3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'APPDLE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ace24fee-824a-4fed-aa62-0dd33cccc8e7',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'APPGRV'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7bf472d2-4f1c-4203-a4d7-658a42168df6',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'ARGENT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '550a02ed-d543-41e2-b5f8-796f29487f02',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VRNON',
    'ARMSTRNG'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ae3d72d8-21b7-4ce2-bec7-ed6f0dd77ae4',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'ARRAS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4ecff76c-2a83-4f6c-8163-daf74b8c1b0b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'ARRWPK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5f56a1d1-90eb-4e61-94e7-10b5d97cc1a3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'ARRWHD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a2672d32-77fa-4545-829e-08b5fb1719fa',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MRRTT',
    'ASHCROF'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5a421d36-104f-43bf-aa5d-b1b12c918beb',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VRNON',
    'ASHTNCRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '456d4ee2-b715-48ae-ba5f-4f6454474a19',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MRRTT',
    'ASPNGRV'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'eece328c-7741-4f0d-bc76-4e09812a8359',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'INVRM',
    'ATHALMR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e372bd43-1cc4-4a7c-b2ab-bbce77898297',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'ATLIN',
    'ATLN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '111e3f1d-2b9f-449e-b173-3a4aa757e9f4',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'ATTACHI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'fe0fc799-b1bf-40d0-ad1a-1981ec1d7659',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'AVOLA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a36753bf-baba-4b36-a00b-a6832cc51ccb',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'BALDNLL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd93c1fdb-4b20-44db-9ec0-ef1d0f030afe',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'BALFOUR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8751f3c8-e372-48ee-bfea-47b33335cc01',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTALB',
    'BAMFELD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a8afa609-9fe4-4a34-8696-be23908c0e08',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MRRTT',
    'BNKIER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3f001a02-5423-47ea-b256-0896f1227fed',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'QSNL',
    'BARKRVLL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '192b250b-c577-4697-937f-9ea744df7486',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'BARRIR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0542be7d-b290-4d54-b1e2-1457906e2282',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRNIE',
    'BAYNSLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1b41207a-79c9-4337-accb-0824018d6de3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'BRFLTS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '272f8042-55b7-4907-ac7c-7a175aaa98d1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'BRLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c7519973-5da0-487a-bd24-29b416d7939f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'BRMTN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2cead1bf-1445-4def-9765-f35b8450735f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'BEATON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '91f571d9-4ef3-436b-a5c9-c7b51d4c661f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DJNG',
    'BEATIE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '76441444-ce12-4c16-9420-e7cc15b4bb3e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTMCNL',
    'BVRCV'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6fe04bde-7cd3-49c6-90e7-34bfdd915366',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTALB',
    'BVRCRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8380b1e7-1074-408d-ab0b-987a34e1a511',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'BVRVLY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '06895377-17f6-43ab-8b62-ba4ffed788a5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTALB',
    'BVDMLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5c3564aa-96af-4da9-92ed-32d2ce365225',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KLWNA',
    'BVRRDL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '277bb804-936b-4e6d-9659-e1199ff0fbb4',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'BVRLLY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5dcdc638-4335-47da-b957-07097e421dd2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'BDNSTLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '57790c45-0b81-4a0a-8882-4c8f636de921',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'BELCARR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '05b1c46c-0663-4c24-9358-e19cb6d7c4e8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DSELK',
    'BLLIINR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c03e6ece-293a-4218-86da-de96f22f9d40',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SMITHRS',
    'BLLIISH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c2921969-521a-46fe-8e8a-e30436dfabb9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTMCNL',
    'BLLABELA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6b5cdd9c-80e6-49b5-bdf1-2c0afae7aff1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLLACLA',
    'BLLACOOL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '98c6f065-d582-436d-b30b-8ba68245a912',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'BERKIN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a14f32fa-0ba9-4e24-a583-8eb4dd964c31',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'BSSBRRGH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ffaf0987-d571-48dc-8ea6-d640df635428',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'BIGBAR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd3b8c5de-5066-490f-a253-e3ff3afac0aa',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    'BIGBRLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '45f4cf1e-85c6-454e-9efa-36dca44b5487',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'BIGCRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'fcdccdf6-c48c-4468-aec8-11f284d7f5a9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'BIGLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b3db0795-2b8d-4697-aeaa-fefadae04f18',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KLWNA',
    'BIGWHIT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '99a04d1d-de61-482e-bc8e-743bcf4c6a50',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'BRISLD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ec6947a7-c3cd-44be-9cc7-0069fa8d4930',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'BRKN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7acb69fe-1004-4b98-9e98-19b315f15aa8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'BRKHES'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bdc8f353-2854-4fdf-8eed-0d3c50f035d5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'BLKCRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '29f52dff-1f2d-4d58-90a3-46126c14aa96',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KLWNA',
    'BLKMTN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c7d82921-91fc-4f2f-8f40-1e64c65683bb',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'BLKPNS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a1833c4e-29d5-4fcf-b811-9fdcce14df36',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'BLKPT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5eaf6bd2-633a-4893-83ee-bde483958472',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'BLKPL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0de6a567-e24c-4166-a7d0-d54da7e5ae22',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'BLKTSK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4372edac-f0f1-4f09-b874-17c241e60849',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'QSNL',
    'BLKWT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ff54eeca-d343-4df5-9f84-82cc253811d5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GLDN',
    'BLBRY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '157b9e7c-b7cc-42e6-bb0e-887586b13484',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'BLEWT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6b4dcdd1-c14a-4e92-8bd1-3241a1412af5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'BLDBY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '60db928d-c28d-4033-9ea8-73fdb74dab77',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'BLSLDG'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9e6a9d02-336e-4f34-9c20-a83c75388eb9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'BLBBAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '494e6634-c463-4c40-8887-7a53cf8fe7af',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'BLURVR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a54b49a8-4bd3-4c7c-9328-1ce503b5bc9a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'BLUBRY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c2f9298d-4b39-423f-b91a-694e81697db2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'BLUBYCRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3def67e2-52ec-4ce7-be81-7b4bb6402c7e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DSELK',
    'BBQNN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '082d23e5-c806-41fe-aa71-ceaccb3aeffb',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'BNPRTLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9d6269fd-6483-4a36-b181-0a7f90e6e205',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'BNNNGTN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '87e7f33c-2cf5-4f34-aa3b-eab99c28756b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'BSTNBR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f98ac1c4-dd65-481f-951c-5f17cd79bebd',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRSTN',
    'BSWLL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '35684123-2f3d-4ac2-b29d-c41a401c0c00',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'QSNL',
    'BCHLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '216d93a9-4bd6-4962-9404-7cc177f8d747',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'BWNISL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'de39d3c8-ed16-4a5f-b10f-9efa8067ce5d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'QSNL',
    'BWROLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4ccbf5f9-3c28-4ba8-9d4e-93ca3c7ddddd',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NNIMO',
    'BWSR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '78702ccf-8647-4c75-b6ba-56bdef6b957b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'BRCKNDL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'caa5317d-db81-478b-8967-2e7a5517e8e0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'BRLRN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'fc558d2a-b5e4-4307-8d53-ef9be2fef8e0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'BRNANCRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1a662a29-17bf-4acc-8720-3c849d3b7b4a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'BRIRRDG'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7b8c25d4-1ed6-4cfe-9916-6007f948533e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PNTCTN',
    'BRDSL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6bf3f285-9da2-4ab1-868a-cbd0c3ea2037',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    'BRDGLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '37ade0a0-f4bc-4e30-83bf-0d8081e0480f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'BRLNT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8fa8566c-3a25-4333-87c8-85cdd051027d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GLDN',
    'BRS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b28665b2-6a52-44f6-873d-d787e10f8280',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'INVRM',
    'BRSS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5d83c98b-d750-4769-b30c-f11f126da281',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'BRT BCH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b65fa215-73e2-4476-a9f5-b9b45789a0ff',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MRRTT',
    'BRKMRE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c34dfc24-a90c-40da-9112-abcc4b9f02c4',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'BCKHRN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c9360c45-1700-4e2f-92cd-93a4546cf6b9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTNLN',
    'BCKNGHRS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd3671088-581e-4846-968e-3d30b0e7688d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'BCKLYBY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '17f7a65d-4f29-4225-8be8-85bcbb6bdc3e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    'BFFLCRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4d4659fc-8d8a-4213-940f-4eb697dab909',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'BKCRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4c80f60b-b0d3-4b12-b820-4619f5b161f3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRNBK',
    'BLLRVR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a5e927b1-233d-47a9-86bb-aa76d2fcb8f1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'BURNBY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd5f615f9-93d3-4feb-9e42-9a019b1ebd15',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'BURNLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f74e7dcb-c422-4355-9563-e8a8be52b64a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'BRTN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '648d3d69-0b1b-416f-a045-95868970c481',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'BTEINLT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f05fd30e-7ca7-4780-a244-903f1d136853',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'BTDLPRIN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6ba8328b-9aaf-43d7-96d4-d7c4b304c4b7',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'CCHCRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '29c13fc6-8d0d-498a-a66d-cf622cb6dd27',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KLWNA',
    'CSSRSLDG'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '70763c25-6180-4e23-a90f-ff9885af9c22',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GLDN',
    'CMB'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b2fb4daf-b6b6-4423-b5f3-eb68f8d7b009',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GLDN',
    'CMRNE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3c34a741-a6bc-4aac-b772-4fd4eac81e84',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'CMBLRV'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1130079f-8f8a-4e6d-aafd-ad6a3fc3d71a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'INVRM',
    'CNLFLTS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3c5ca1cc-286a-4f11-b7e5-47ba154ac8fc',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    'CNMLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '546babbb-678d-4576-a611-a5cedbe45957',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    'CNCR100M'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'dbac3c70-f6d8-4222-83ac-751f221c40f5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'CNCRKSA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6fadbc77-8b96-4e93-af0c-b624610113a2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRSTN',
    'CYN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '339a4e32-11d1-47b1-86c1-63e458b9f2ec',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    'GTWKSLK100'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b72f33fb-4715-4671-b158-1b6af618d505',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'GTWKSLKTRC'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b75c2539-ee5a-49c7-b417-f76b21633be8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'ATLIN',
    'CRCRSSYK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '22f8d501-ac45-45c9-b443-841dc55b555e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KLWNA',
    'CRMI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c772bbe1-1dd0-42af-82ca-10d3d010eb04',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'CNO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7d081f0c-e75a-421d-8b1e-5a9e1bd48bf5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DSELK',
    'CSSR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1c23ff31-f038-4063-ba2f-211118e8fba8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NNIMO',
    'CSSDY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a1d6e012-9667-4f31-ab0c-cb968e978b24',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'CTSRVR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4353e260-6f66-4eaa-bbfd-e9682db1e06e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'CSTLGR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e4d0eb2d-bcec-42f7-a245-c034f00b5249',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PNTCTN',
    'CWSTN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '475c149c-08d0-4aa1-a08a-65d7cd27b49a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'CYCS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b261eb32-ffd7-4bdf-a905-dc87cc6e48bb',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'CSLLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3d4360a5-13a3-4b08-b52a-d561593305bd',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NNIMO',
    'CDR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2eb5a511-8867-4ab6-834e-582fbea48130',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'CDRVL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5b0adbda-09bd-41e6-97b6-69cf05e292ec',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'CLSTA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b8f59fcf-8da4-4f90-8d5d-b89fe77a7589',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'CNTLSNSH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'cba90847-cea6-48f2-84ac-c681ee5b7407',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DSELK',
    'CNTRVL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '721582f1-c297-47cf-8a5c-5f68bb6c14ba',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MRRTT',
    'CHNLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4a452f64-7c7f-4816-bfa6-eabba22cf703',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'CHRLLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '64de4814-016a-4bca-bbbd-e1486d474825',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DJNG',
    'CHRLTCTY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'fa107491-b0f8-4fce-b9b2-fdcdf94ba522',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'CHSE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '102f9e20-2074-4dd3-ac1a-4e5c901683f6',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'CHHLFSTN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3553f525-3d0c-4241-a326-5bbcd4a0e532',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'CHMNUS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c9cac9d7-fb3d-49d5-8ea0-5431e5ba02d9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'CHRYCRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd78532b7-77e7-4414-a87d-ff92433683b7',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VRNON',
    'CHRYVLLE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '859d5666-8dd3-4881-aadb-c51fd6667988',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CHTWD',
    'CHETWND'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '751e7f4c-d5c4-41fe-b95f-02e6f6b63ec2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'CHFLAKE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5c046bc3-78d1-4c3b-a8a9-755ec60c538b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'CHLKOMUD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3ecd767d-c7bb-41c4-9a79-b54d44c216d7',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'CHLNKFRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '06a595e5-3d93-4e22-b419-cedd95365c55',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'CHLKLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3ad20194-ba2b-4390-ae3a-be95eca02eb1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'CHILLIWK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8c72076e-40dd-455d-9397-04516830382f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GDFKS',
    'CHRSTVAL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '48dede1a-4ca2-41ba-8254-d44c727ea4b1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GDFKS',
    'CHRSTNAL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5fef5245-facf-40bd-ae2f-a20743232299',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'CHCHUA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b32e4036-9f61-4095-88ad-bd39c116dd1e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'QSNL',
    'CINEMA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ad4df027-6cc1-452d-8fd7-1f44cfad731f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'CLAIRMNT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5c8719ee-804d-4775-a4e0-cc0b3f2bbec5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'CLNWLM'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7e69cd7f-b0f4-4a8e-a05b-b2c2691f2ce5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'CLAYHRST'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1bfa49de-6c14-460d-b215-60a34c715de1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNSR',
    'CLRBRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c9d62247-7a9c-42ee-b641-b4b7fb717f7e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'CLRWTR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bf5e7cff-e0b9-4144-85e6-f3f5b7fe147e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'CLEMRTA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '36501c90-867a-4f48-9917-517339fb8794',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'CLINTON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f51f0e2f-c752-459f-b65e-8d6a7323090b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNSR',
    'CLOVRDLE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4c12e07c-bf41-4d1c-a3ce-8048f91dad38',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTMCNL',
    'COALHARB'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'fafb7f88-2d6f-4cf7-9f1a-69b52c5148ee',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTNLN',
    'COALRIVR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '35b36d71-d213-468f-8368-c4cf5324ae82',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MRRTT',
    'COALMONT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '266c26f3-6db0-48a2-a04c-a01dfcc8b178',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'COBBLHIL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9406b7de-0219-4c78-a816-4e44caf814a5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VRNON',
    'CLDSTRM'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5417e634-a5ff-4726-ba3c-4c829881523b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'CLLYMNT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '862de97a-4878-4e8c-ab56-e83fb37e6059',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'CLMBVLLY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd9520334-8298-4751-9d7d-d171cdb11281',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'INVRM',
    'CLUMERE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7646429f-0517-4139-925c-5e3b51a0f1df',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'CLWOOD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '27f60ea0-14d6-4658-b9b3-41c07b97bc08',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'COMOX'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e57a8430-58bc-4076-ac32-f0c880dd0651',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTNLN',
    'CONTCTCK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '974a0cc3-84af-4e04-82d1-097dca6679f2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'COOKBAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ba2ab397-629f-44c1-b330-86bf5306902c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NNIMO',
    'COOMBS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd4ee5d33-b7ee-41da-9f31-2fc6ce7002f1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'COOPRCRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'cc8f8e4c-8db1-41c7-bffc-e91da5726f01',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'COQUITLM'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '177ce7ce-f1a1-49e4-8596-57ad8a0ea3f0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'CRTSISLD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '44163b22-4106-4539-8177-a15fc9996d86',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'QSNL',
    'COTNWOD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0dfc6bc7-c2a3-487f-98ea-68534053b754',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GLDN',
    'CRSRLAKE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4e1e9849-73be-4b97-84bf-221733cc7200',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'COURTNY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c412e2d5-8b3f-483f-a8fa-7c2a7b3e44dc',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'CWCHNBY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1b0c17de-3217-44f1-8de7-d7d78cbf35c7',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'CWCHNVLY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2b85f190-e883-479c-a6de-d08a49af846e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRNBK',
    'COYOTECR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0a183386-28e4-4dee-a368-24ee589d20f8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'CRAIGPRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '28101c2b-7791-4616-a578-6ebc915d4ef3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VRNON',
    'CRGLLACH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '47e54e51-e329-4c11-9f76-ebbe82bd6c9e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'CRANBRRY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd8cf0224-dd22-4e30-80ba-c07c16986e02',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRNBK',
    'CRANBRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '056c5594-36c2-4e43-94c1-7fb6a9ab4c8e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRSTN',
    'CRWFRDBY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a4198c98-d97c-4dde-af0a-9b3fbf62fe8c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'CRSNTSPR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b46992d3-29aa-4933-ae9f-28d28b505be3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'CRSNTVLY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '032be177-fa28-4fba-9d64-b6907258fdcb',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRSTN',
    'CRESTON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '27fcb142-f51f-4ba5-a8a9-bab06fa5ed4a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'CROFTON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '88473f9f-1cef-4a5a-b02a-14b7a3c7e497',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'CROYDEN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '16d8fb13-e914-419e-a756-afd894edc59d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'CRYSTLLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4150245a-fd60-49f9-b78c-27af393bd619',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KLWNA',
    'CRYSTLMN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a07aedbd-2c3c-4bff-b33f-4df6021bd085',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'CULTSLKE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '49682af8-f1c8-4e5f-a4e2-9f5ec6400462',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'CMBRLAND'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'fcd436e6-4964-4d75-a281-1e6f9afc2a93',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'DANSKIN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f555d9ed-cfa1-4d85-affe-3eff7befd701',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'DARCY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b83c9271-0cb2-48ca-9b44-560640f8387f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'DARFIELD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'dc1c4585-4e9a-439e-b2e3-6ee71bde7872',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'DAVISBAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c0d6dc77-f5e3-4cd6-9b3a-0703cac6b8b3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'DAWSONCR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3d6716a5-b911-4a41-ad5a-15a65b56ec1d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'DAWSONSL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9927ceae-1fba-4fb4-a18f-5417c9f0a74f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DSELK',
    'DEASELAK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '684e38d3-105a-4ca1-8f74-37da18ff0dee',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'DECKERLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '214415fc-f098-4d62-a3be-270af30235d5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NNIMO',
    'DEEPBAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '766c9fc3-39bc-4788-af68-7273cb71ca6f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'DEERPRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'cf6c7686-46cf-4af8-a1f4-770100dd8d5e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    'DEKALAKE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1a1290f5-3f03-4a4c-8011-d668bcc7fe4d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CHTWD',
    'DELIO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'db198db0-cc24-4eff-8bf5-5fe851c5f663',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNSR',
    'DELTA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '20d25247-3f9e-4046-8c08-49af25b52f96',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'DENMANIS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '088e308e-94e3-49cc-920c-8fbfbd0497b5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'DEROCHE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '690850b7-6821-4dfe-ad53-7e670aa8fd0d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'DESOLATN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7cfb5c85-6f28-45d1-95c4-deb2f40a3607',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'DEVINE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '764cc2f0-2555-4ae9-9074-7d0b4cd4afb5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'DEWDNEY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'df0ad754-63b9-4b3b-9ca4-fbd92ce4f982',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DJNG',
    'DINANBAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6946645a-9013-4abd-a2c1-721ba43306ba',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'DOERIVER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '82aee292-f191-4914-a267-4a12e14cad17',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'DOGCRIR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '45699870-bf94-47eb-b686-b632cb45f276',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'DOIG'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ab42515e-2924-41ba-acd6-6d914fd4e01f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'DOMECRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '99309b4e-3efb-4bf8-a4e4-4448c5c0a775',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GLDN',
    'DONALD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'fbfdb0fd-9950-4035-9b3f-c41aee329cee',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MRRTT',
    'DGLSLAKE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3384faa4-14a2-401e-992f-fff2c49a286a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'DOWNIECR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3d22421b-c5c7-4498-9100-f985df09dbba',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'DUNCAN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ec8f394d-2823-4ffc-9d80-d0c731c6d8ba',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'QSNL',
    'DUNKLEY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0871fd56-6177-4ad9-a354-347c32477ad2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'DUNSTER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c735265c-6c29-4574-b5c1-73ec8cb87b31',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'DURIEU'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'be9a5618-c2a1-4dd1-814f-cffc8a91de91',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'EAGLEBAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3aaba0c6-271c-4c0a-ac01-a28999711476',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    'EAGLECRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '33839503-a01d-453e-8a87-bb44c6e1ba23',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'EARLSCOV'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b7e9cfe5-70e8-44c9-b978-0508b350b664',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'ECRACRFT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'caa4f8e5-9dda-41f7-9d94-00ad971b8e1b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'EFRANCLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd82ac5a4-7051-4299-91a3-fc7878c6be9d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MRRTT',
    'EASTGATE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f110bf75-48f3-47f7-a430-0d43e324d704',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'EASTPINE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '04c95784-425a-4dcd-ba48-a86d0344f5c8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CHTWD',
    'ESPINEPW'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8bec84da-9443-4cd9-9681-65466f800921',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CHTWD',
    'ESLOPPPP'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd54170e1-36c1-4f6e-a543-55edc53b9bc7',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'EASTSKE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e2159e92-5f70-48a6-af00-f6d543c67360',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'ETHURLOW'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '47585584-1e0e-4a03-9393-a3c448d3e772',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'EASTGTE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '03e4d81a-5caf-47f6-8b74-2c157c615a9d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'INVRM',
    'EDGEWATER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5e04bf11-50b3-4ecc-9776-496f15e00ae3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'EDGEWOOD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8e5e3d06-37be-4053-a179-30ba425ab8eb',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'EGMONT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1bd0fa35-b4d4-4122-ab32-bd87c8222f47',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'ELKBAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3369cb06-7c34-4e42-8978-f41c3c2a3ea3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRNIE',
    'ELKFORD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8e922fc7-c743-47dd-9526-ed6650be4ed1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRNIE',
    'ELKO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '055f13c1-8472-464b-ad0d-a14945963dc1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SMITHRS',
    'ELSWTHCP'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e41bbfae-6d34-492c-96f7-a925f195140c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'EMMDSISL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '968cb886-dba1-497d-a4aa-81da48af8055',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'EMPRVALY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '262102ed-7e98-4b46-b896-aa56a073aa89',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'ENDAKO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f1852158-e692-4d11-a31f-226d786ae02f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VRNON',
    'ENDERBY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e30c502f-1d72-4e54-bb2f-5cf2ef60f9f8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRSTN',
    'ERICKSON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'be6aede7-7e5c-4e1d-83a1-a36d826d5d28',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'ERIE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1368e388-acfe-46c2-bb99-ca84b6614bfb',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NNIMO',
    'ERRINGTN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd9620f97-272b-41f8-928a-066a24230988',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'ESQUIMAL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4597402d-1abe-4d2d-93ec-a090f4eeb897',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'INVRM',
    'FAIRMONT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a8d66de1-d778-4e67-b747-4b9730b252a8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'FAIRVIEW'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ecc1020f-b8b9-46cf-93df-8dc771f0f54d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VRNON',
    'FALKLAND'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '10b0c40c-155a-47dd-a880-9f1ee92d075a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NNIMO',
    'FANNYBAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6859a4d6-938d-4965-9719-bacb4d3aa22f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'FARMINGT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ee90ad14-949f-48e0-b3b1-31c3169a2e2f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PNTCTN',
    'FAULDER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '797ab154-aa46-4149-b1df-c15188228586',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'FAUQUIER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '141ff641-f7d4-466d-abfa-93385f6d7471',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'FELLERHT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c909ab16-32bd-4b78-a05e-b680f770cc2b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'FERGUSON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'dda9be1f-2873-4254-aa11-c002bfa98741',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'FERNDALE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '79e966a9-49ab-4031-9acb-677c30473b42',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRNIE',
    'FERNIE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'df7fef03-6f3d-45cc-afa8-53b2a4dea030',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'FINMORE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '556aaa45-5c62-4bc5-9cae-6f4cff5b965b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KLWNA',
    'FINTRY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'de30426f-18b1-4e8b-bff5-2193109ff56f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTNLN',
    'FIRESIDE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0c66b944-13f7-4345-bbde-cd70d4658522',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLLACLA',
    'FIRVALE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '26635128-6a82-43bd-8d5f-c1852dbe8ee7',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'FLATROCK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2452a5aa-e557-4818-9140-dd91e5b835e7',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    'FORSTGRV'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '955475d3-cbfd-497c-9068-a96867562878',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'FORESTDL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '409326bc-ec2d-4b0b-bae9-bb48401d1542',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SMITHRS',
    'FTBABINE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '865dd161-f00b-4d86-b80d-dff99ace6b9f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VNDHF',
    'FORTFRSR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '775ff8b8-4870-43c1-a473-b560e768b6ae',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNSR',
    'FTLANGLE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8fcbfff4-a206-4a8f-ad2c-a137808881e8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTNLN',
    'FTNELSON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'de9b5056-1c07-49b4-8863-f066921390ec',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VNDHF',
    'FTSTJAME'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ba500a71-47b0-42d0-9627-5ecc7774bcad',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'FTSTJOHN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4ac8f48f-50eb-4f18-b3c9-eefbe82b6338',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRNBK',
    'FTSTEELE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ddbd92bc-1d51-4f93-a803-9a6f8075bdfe',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MKNZI',
    'FTWARE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'abe0312d-d289-4237-9224-3a4d9548d3c7',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GLDN',
    'FTRESSLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '150e3a95-c8a5-4148-b86d-6d8d89e0f70b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'FOSTHS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a17f2b79-b865-4695-94c8-a2921eef8781',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'FRANPENI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '222b0b34-c386-43ba-ab88-7d72b575da91',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'FRNCSLK1'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'cac2fa18-ab3b-413f-96f4-2b3eb4881095',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'ATLIN',
    'FRASER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a45a02e0-0ef9-4186-8803-c8885046b3fa',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VNDHF',
    'FRASERLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '07955eb8-6600-4bff-96ef-ddbe333251dc',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'FREDRMCA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '96766341-3544-4d07-aa5b-26223d58cf80',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'FRIENDLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '503a39c2-3ee8-4797-8a86-3872b14b43c9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'FRUITVAL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c6497b26-2f1c-404b-bc06-12090e119757',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NNIMO',
    'GABRIOLAI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '94239fab-a290-4398-847f-d1754e549024',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'GALENABAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '75f1ad4b-c2ba-4b8c-87aa-4b9f4e23b938',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'GALIANOI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bd8a5317-f60c-44a4-98fd-913821ffbc0a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRNIE',
    'GALLOWAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a4b352d4-3365-4af0-8079-f95c6790cf14',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'GAMBIERI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '92d7fd3e-0ef0-4478-8978-78a917764e5f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'GANGRANCH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '04eb4dea-3186-457f-a805-bbef118591d9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'GANGES'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a9181585-6719-4d92-8a44-029de78cb316',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'GARDENBY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c8300efd-9b2f-4d4a-800b-6a84a253bbff',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PNTCTN',
    'GARNETVL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd08866d2-ddd4-4432-915b-06b2a9ef0f67',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'GENELLE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '44c643e0-b9b0-4c52-a68e-e4726242a2ab',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'GEORGEMI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '04fb2345-677f-40ad-9c33-bbc037484d17',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MKNZI',
    'GERMANSO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1dbc916c-aacc-4f2a-bc79-b0cf1be4468c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'GERRARD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'fa76c430-1bbf-4328-82f7-a26fcb7d7d47',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'GIBSONS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e58014a8-357a-4bd3-8b61-e1ec4c3b3253',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'GILLIESB'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c969cd51-a86f-49b8-8dc6-b6aba2246bda',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'GISCOME'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '65a07b05-f7ed-4e41-9645-ce95a3378b76',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'GISCOMEW'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1211ba95-5fe2-43ef-8c45-857ba7f6d4d5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'GITANYOW'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '452fbfa6-4f5a-42ac-bbaa-4ca148c24ec2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SMITHRS',
    'GITWANGA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '81734e5c-52e8-4265-acd7-8bb162096cca',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'GLADE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '59d28eae-be92-46bf-9913-689148d5dffe',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'GLADWIN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'eb032439-d3b9-451a-b300-5712c8a16370',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'GLENANNA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0dae8c59-2d89-4f56-91ee-a80dd1ce960c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'GLENDACO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'dfae2bba-9919-4170-bc91-af8cc33a933c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DSELK',
    'GLENORA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '28dc7fa7-391c-4182-9783-eb5367d0d787',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KLWNA',
    'GLENROSA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6e7fa2af-fedd-4fc1-a189-7fa24c29a8f3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SMITHRS',
    'GLENVOWL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7891c7f9-0076-455c-acee-97df6ada6feb',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRNBK',
    'GOLDCREK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4d026808-6231-47a9-b1ff-3e67daccbe94',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'GOLDRIVR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b0ea4d8a-cc52-4127-bb7c-4b9dbc3b10a7',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'GOLDBRID'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1c84c8fc-3bbc-44f0-bea6-22b56826372a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GLDN',
    'GOLDEN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a9d739e8-e73c-4526-a3b0-3c666d9b447b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DSELK',
    'GOODHOPE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ffbe55e2-579a-4a10-a3fe-5180aa5c9f5a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DSELK',
    'GOODHOPL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2d883bd8-78b2-4223-9d02-7db8e0ea7e58',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'GOODLOW'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5259c185-7c45-4bbe-a484-5f1f2aa1a2f0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GDFKS',
    'GRANDFOR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0ff8891b-e381-486c-8b67-6f5881c976e2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'GRANISLE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '71e352d0-4ca7-493d-989b-599f05fba9c9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'GRANTHMS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '743b2c10-afd2-4452-a707-bb2acb330be2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRNIE',
    'GRASMERE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'fdca5458-877a-46d7-bd21-38410d74031f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'GRASPLNS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '913e361d-2a59-428d-b972-69565845c05a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRSTN',
    'GRAYCREE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c32bcfb2-198f-4438-be32-30a819efb018',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'GRSEHRBR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '98d9429a-0b1f-4c5b-8809-6ec144ce5fb7',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'GREELY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6dbf08e5-61fd-46b6-bd65-8aefa14bcb9b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'GREENLLO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'cdec432b-a89d-4047-992b-da4f0622d9ee',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    'GREENL70'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '95b5979c-ecc5-4ccf-b5d6-bd5e723a49ef',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'GREENDAL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7127759c-d3f4-410e-b84a-62c2bb4a4462',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'GREENVLE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5914f014-c8fb-43db-b5d3-0c758e64c07d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GDFKS',
    'GREENWOD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '06609e4d-caf1-471c-a2dd-904bc569c0e3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GLDN',
    'GRIFFNLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b5e6d65a-379a-4874-b241-2ef9522c613f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'GRINDROD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b5d4f50a-f334-4fbd-a8fb-f30a366f840a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'GROUNDBR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c9f7feb5-4955-4cc7-95eb-0c0fbe34b0ef',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'GUNLAKE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '618a7e3b-3da8-48b9-bdbf-0d868544b0c6',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'GUNDY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8ad8d20f-b1a8-4691-9eeb-74f65da2c36d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLLACLA',
    'HAGENSBG'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '79402d81-fc0f-4410-a7f4-c58c1871e410',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DJNG',
    'HAIDAGWA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f1587991-4d77-4511-ae99-c0902970ab4c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'ATLIN',
    'HAINESJU'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '160ee40d-2d50-47d8-be3a-30eb963646bc',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'HALFMNB'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c7ebae6e-ae42-4c18-bb3e-bf3d7351d9f5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'HALFWYRF'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '054a3739-ae4f-4688-9afe-5135f028fa72',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'HALLS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '283b9803-ccc5-48da-a404-92c09923546e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'HAMMERLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f0f20371-e5f0-4993-82f6-ba50d9307846',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'HAMMOND'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3541d151-8a94-4050-b6f0-4739a425055d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'HANCEVLE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '377593bb-6087-4bc9-b82d-72fc55b37197',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'HANEY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '341489bb-b53e-44ed-a773-7d5a472ee7ef',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'HANSARDU'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a8242789-3418-4635-a3f0-d7dfc25f7be1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'HARDWCKI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '700331b2-e57f-4dc0-b4f4-f37ec04337c1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'HARHOTSP'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2e2303f7-b241-4b05-8415-f4f788be2d29',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'HARSLAKE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '63cce944-2f44-4279-bc8a-e8d3f2eb0b29',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'HARSMILS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a1472e75-b768-4555-a7ad-e4c8335619b9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GLDN',
    'HARROGAT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8b219280-0adb-4954-b7ef-89c96a98f686',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'HARROP'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a18fff52-408e-4364-87ce-827931ae64a0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'HARTLYBY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '48959166-90f7-43b1-838c-6d64f0807d48',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CHTWD',
    'HASLERFL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f21c8dab-ebcb-45ae-9dfa-6787e80e513c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'HATCREEK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '449a4f6f-51ef-46eb-b57d-333c9c29215f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'HATZIC'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '34f636c5-ab91-44d1-b269-0351985c6e68',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SMITHRS',
    'HAZELTON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3311aa2a-52bd-4a9b-99a2-ec4ba5a07222',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PNTCTN',
    'HEDLEY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f9459b76-e7c6-40a3-801a-d0a29dd49202',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'HEFFLCKR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ba9f68aa-e566-4106-a3c2-f55c9838db4a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'HEFFLLAK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a5bfb48c-34c6-4add-879f-9d56ddb9f73f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTNLN',
    'HELMTGAS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1b8e8686-ec33-4a9c-bb3e-e137756e1a1e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'HIGHLAND'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '51238713-955e-47af-9abc-7eb4aa50c6fa',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MRRTT',
    'HIGHLAVL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '50b15514-6d28-44da-8475-71ea8cd662a3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'HILLS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9e1d9ca6-4919-4e1b-9389-a283e41a580a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'HIXON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '600b86f7-f8c6-477a-a062-cef4fc937992',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTMCNL',
    'HOLBERG'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '30193c54-f13b-4da4-b2f3-0de96c9370ab',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'HOMESRVR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '36c875a8-5dad-473d-a20a-d053f236d0a6',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'HNMNBAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'fa57beab-24af-4354-90e3-24d7226c5478',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'HOPE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6535a7f9-68bb-4f5d-a87b-57f919599d71',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'HORNBYIS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '43a41b6f-90cd-4abf-b65f-2908b5f9eee0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NNIMO',
    'HORNELAK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '45ccfd7e-f85e-441b-ac13-ab123806c63f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'HORSEFLY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '557ea715-dbc0-4c5d-ab55-918832b44b52',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'HORSHOEB'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '01968520-8188-4341-b39e-92a83f7a8745',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRNIE',
    'HOSMER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd84f99c2-d455-4bb8-9446-56a617b254a5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTALB',
    'HOTSPRCV'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bf1675c3-8010-4526-bcae-4815a2cde596',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'HOTHAMS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1bbd602b-b4af-4c78-b713-2ec972d3bdb1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'HOWSER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'be6a1d35-1f02-45cb-a55d-e7f374ef7f1b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTMCNL',
    'HYDECREE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0daae583-a7ed-4d62-90da-d5eb99b1938d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'INDIANAR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c7d8f03a-8bb1-4a35-88f9-5d8cc01920c7',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'INVRM',
    'INVERMER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '02e3753e-f67f-4108-a418-5c05756d375f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'IOCO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '58b2181e-b339-4b7f-9f88-b89f44f85dc6',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'IRVSLAND'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'fec60f8c-309d-4abe-a7b5-58335d8cd7d3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DSELK',
    'ISKUT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3a4b05a8-c5f1-4446-bd4f-aba79f403a8e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'ISLPIERR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e644b256-35a2-46c6-b128-a0ba15081e14',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CHTWD',
    'JACKFSLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ae827a8e-dd7d-4f70-ab81-0f0a0183b783',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DSELK',
    'JADECITY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '38dddbdf-ea31-421c-9276-c9536faa4703',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRNIE',
    'JAFFRAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '91ef9eeb-0148-4385-8f38-1e449bc20fd3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'JESMOND'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '41bf5fd0-35aa-4666-8d4b-f5d7fc174305',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KLWNA',
    'JOERICH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e2506ab0-f003-40ad-85c3-4d57f56e7a41',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'JOHNSNLG'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '16da1053-c914-41cb-9ed8-50db0f94b0b2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'JORDNRVR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'db4d054b-3f50-4750-982e-df41a6eaf768',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DJNG',
    'JUSKATLA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6e23efee-76dd-46c5-b82f-340fe8ceb953',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PNTCTN',
    'KALEDEN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b11c5f1a-1576-49db-88b5-e439fc5646f1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'KAMLOOPS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd82dfdf2-d895-4049-8f54-88ce9959fd7a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'KANAKABR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3a2e6990-0850-4079-b925-4c826be1e2d3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'KASLOBC'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3ce52178-efad-4249-9a71-7e8580b52b87',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'KEATSISL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'cc4196b3-b799-4d0b-b0b5-11fccabb1e7d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'KELLYCRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1934576f-3721-4718-9fc5-4a27fa5ddcf6',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'KELLYLAK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c83a87b8-3484-44d9-833a-0bf11af79f18',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KLWNA',
    'KELOWNA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd246164e-ee43-482f-9bc8-f4dcb4e509dc',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'KELSEYBY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '892231a9-4286-4624-8c7e-825d3d7ccae2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'KEMANO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '26d66dd0-b497-4176-a922-165ec10db973',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MKNZI',
    'KEMESSMN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b17f33cf-756a-42ff-814d-179414de4142',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'KENT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '54f759eb-4be3-45ae-9493-50f7da87fd84',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PNTCTN',
    'KEREMEOS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5fd404d7-e260-43c0-831c-74c3ac81bfe8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'QSNL',
    'KERSLEY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bc51402c-1867-4ee5-b400-f0579cb0a364',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTALB',
    'KILDONAN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd6aa64e3-e92f-49af-b058-4a43d5e3f349',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'KILKERRN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3a767383-11ab-42de-a90a-6da0ff40c23a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VRNON',
    'KILLNYBC'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '128bc400-4f3c-4f7f-a08c-8bddef6aab21',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRNBK',
    'KIMBERLY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '84a8802b-dff1-4f7a-b67a-872ae2895b14',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GLDN',
    'KINABSKT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9648b37e-f2db-4cd7-a246-8bdf6070a74d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'KINCOLTH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5248efb9-8423-47c2-b81e-5f57ddd905fa',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'KNGCOMEI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '157775c1-6f35-4fc3-80ac-26a0929afd6b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VRNON',
    'KINGFSHR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c2992f18-2ca7-4f4c-9885-21d0e8577c8a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRSTN',
    'KINGSGTE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ac8898d1-a3a7-40e1-958e-576084084c9a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MRRTT',
    'KINGSVAL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd8797cec-e142-46aa-b5a8-91b2be697788',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SMITHRS',
    'KISPIOX'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3d6efbd4-57e6-4c22-bb10-132b372f5f49',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRSTN',
    'KITCHNRR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2d3cb739-5bff-41f4-90aa-98904a88b39e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'KITIMAAT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ab25f326-448b-4894-b13c-95ca7e0909e3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'KITIMAT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '59d63cad-1587-4e14-b808-4793a1bd8578',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'KITKATLA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bb017809-8544-4794-ae46-52bb0a41eda8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'KITSAULT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f0426956-672c-475f-beae-b8d5dad602d6',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SMITHRS',
    'KITSGCLA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '74fa75c3-a4d1-4f97-a29e-f38fab5a8c5b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SMITHRS',
    'KITWANCL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3533f81d-ab5b-48f4-9be3-2bd5264c6235',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SMITHRS',
    'KITWANGA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7adf5fab-3e96-4324-9fb2-94957eab4889',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'KLEANZA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6389eb3b-5b0e-4139-ae01-564fa0c41585',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'KLEENAKL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '022f8a22-900c-4335-b9e0-3b74f360c3b0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'KLEMTU'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a338bccd-29a2-42aa-9615-7b33133c7783',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'QSNL',
    'KLUSKUS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '57623ae1-09a8-464d-8cba-132e9d3e1b62',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'KNOUFFLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b8a68721-12c3-4c6b-b065-2f6700a9a9a2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'KNUTSFOR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e60ec2b8-dd3c-462c-b640-93fcf14f089f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRSTN',
    'KOOTNAYB'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7b12290c-bab9-4268-bc8a-63674e756207',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'KRESTOVA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9f72333c-7dc0-4434-9528-b443d8c14ee4',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'KUPERISL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f597691e-1724-42e4-8040-8878f7cb7445',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRSTN',
    'KUSKANOK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '22acc53f-e05b-4d81-bc0d-d9d6440a368c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTMCNL',
    'KYUQUOT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '97b3058b-fecc-4874-9ed5-52cf7d528c7e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    'LACDSRCH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8435e37e-bfee-438f-b1dd-66df0523a8c8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'LACDSRHS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4843b53c-07b0-421c-9661-e3981b1f371f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    'LACLACHE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '63debaa9-c910-4a7d-97ac-8075b47ba3fc',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'LACLEJUN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3329d06b-c7bc-4b8c-bc1c-29cfa2b55dd8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNSR',
    'LADNERBC'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '82081199-e4b0-4cd5-97aa-36bb97f185f5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NNIMO',
    'LADYSMTH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '173b4b6b-dc89-4d8c-beee-6db39f615956',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KLWNA',
    'LAKECNRY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2ca8d9d3-90b7-4d15-87ee-26483f9163b8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'LKECOWCH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '27df4ea4-f535-426f-92bd-3c01ac58dc1a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'LKEEROCK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '77f97f53-3fd5-481a-a20e-b320dd444c9b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'LKEREVS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a8f2d5c1-8f7f-441b-9cc6-390753edbb1d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'LAKELSEK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '52b61432-4dc2-496c-804d-e9ccf3b458a2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'LANGBAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f806f818-4316-46fb-b40c-c436b9da2e97',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'LANGDALE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '135663be-e53b-46de-9fce-9344bfe38027',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'LANGFORD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '416b1447-3793-48c7-9b90-5982a185eff5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNSR',
    'LANGLEY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c97c0527-d257-4245-a76b-de5ef1fc8d6c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NNIMO',
    'LANTZVIL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '399cd846-7c32-4447-9da6-251bbe113135',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'LARDEAU'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '762ec05f-d706-4dbc-ac63-21aa506ef613',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NNIMO',
    'LASQUETI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f4a92318-9494-4566-8934-810e5975cc30',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'LAURETTA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '673dc4d0-fc3d-41e7-8027-2f25ec6dd556',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VRNON',
    'LAVINGTON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd41d70d2-25ae-4525-9ef7-657d73d21168',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DJNG',
    'LAWNHILL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '72ecc8e3-b7e2-406f-b898-327128e4f5d0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'LEBAHDO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1a4552ac-9465-4a68-a3af-2cdbd06ae5cf',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CHTWD',
    'LEMORAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bc9f4bd7-770c-44f5-8584-c25dbf5d4a00',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTNLN',
    'LIARDHSP'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '625c3372-86bc-4d7b-a432-db93fa014c9a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTNLN',
    'LIARDRVR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1e185ba6-073b-4264-acd7-2df236e2db81',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'LIKELY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '72f22782-b13f-46ed-94ad-2f4a9f1d2cfb',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'LILLOOET'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3fc5f565-f651-443e-b8d5-9578a5149be5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'LILLOLTK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '07f592f8-ea77-405c-86ae-396d19d4817b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'LINDELLB'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c8f60b10-9fd3-40c9-a3ef-bf2701fa9ea7',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'LIONSBAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'afe9adfd-e14d-429a-8184-2bc67e6692b9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRSTN',
    'LISTER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '25302b45-323f-4529-bda0-50403e2133b0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'LITTLEFT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '183a2de7-aac5-4b31-bad6-e27f015d584b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MRRTT',
    'LOGNLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7d9b00a8-dd53-4e84-99a2-940105084e64',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    'LONEBTTE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b6271d1b-2f99-4187-b055-21be503cb7d5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CHTWD',
    'LONEPRAR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4702f68b-462a-4292-b4d8-2bc11cb1e45c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'LONGWORT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8715b471-f60b-44c4-ae55-a16a3c175d2f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'LOONLAKE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'afdc2de6-c9e8-4f5e-b983-52efe9aa26b4',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'LOOS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b13a6955-4fdc-47d3-9d73-0b12bcfd63e8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'LOUGHBOR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7acd0c24-ece6-42c2-a8a4-fb33c595f3bb',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'LOUISECR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2ec3fe29-4f01-485e-8f52-3f369622d0a3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VNDHF',
    'LOVELLCO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1b1e73bf-29fd-46ae-b1c6-1a529c0ffb37',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MRRTT',
    'LOWERNIC'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3ffc7c6c-67a4-4941-a81a-fbfb9ed3942c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DSELK',
    'LOWERPOS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1ee5e348-1a0d-406c-87a5-0ad2c291edd0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VRNON',
    'LUMBY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e28ab385-f2ae-4883-b177-763cf5630eec',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'LUND'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '423d04e6-dfd7-4442-aedb-eab7a8ecdb5b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'LYTTONBC'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '60778537-8569-41d7-b158-b28341372be9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VRNON',
    'MABELLAK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'dd61c8d8-6d36-41ff-882f-34cff9be132c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'MACHETEL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b2c3cd9f-7cf0-4b66-8520-f252adabbbe9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MKNZI',
    'MACKENZI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1f361666-2eac-4b20-a73b-2daf4d372f2e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'MADEIRA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e5688c10-b5eb-462c-88c1-720d9da57464',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'MADEIRAP'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4da22319-099b-4a14-b216-a5e469d3a344',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    'MAHOODFA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1d745485-1358-43cb-85a2-45e2bc5f9112',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'MALAKWA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1853e1ec-4fd4-4a79-8492-63cdb7737214',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'MANNINGP'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e3f5e06e-d457-4bd6-95d1-b9bbba7d51fa',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MKNZI',
    'MANSONCR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'becab826-4362-46d0-bca8-cf8541bb6223',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'MAPLEBAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1dc5cc6f-0b4b-4c1a-af4f-7ecd44ded485',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'MAPLERID'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c985777a-ebf4-4608-bd97-9c8e5df1eef1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'MARA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c484e594-e0f0-45f3-a91f-cc6827ac4efc',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'MARALAKE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c15a5494-3e44-426d-86b8-3ce84c177409',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'MARGUERI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3b0fd83f-3b86-40af-9279-952271ce8892',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'MARGNTIR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bdf7addb-018a-4ed3-9f1c-cb8cf6c15796',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'MARGIR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e30da0d5-533c-4d3f-8c49-29e1b7a397ed',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'MARTINVA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bb6f6017-9ded-4b00-8f09-adba9a469641',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRNBK',
    'MARYSVIL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3a5058e9-909b-4aab-b079-ecfc08caec2f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DJNG',
    'MASSET'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f365576d-fe07-45a5-968b-55ae0bd405d7',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'MATSQUI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e99e5e34-1650-4882-8b14-b56e41111c50',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'MAYNEISL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f9815781-f588-4f71-bd59-ff380dbc4a9a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRNBK',
    'MAYOOK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ddfcf22d-5ed8-49f5-b908-93dfed2568f6',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'MCBRIDE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f2316331-89da-42fd-9cca-ad1b1ee8eec1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KLWNA',
    'MCCULLOC'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3fb18914-52fb-4698-ae4a-1c19478f6c2f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'MCGREGOR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b9b250eb-8ad2-4f03-a5f7-60cd2e2d8d94',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KLWNA',
    'MCKINLEY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5a62e484-d2e9-4e1c-8a6f-45fc210666d9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'MCLEESEL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'edbc18cb-ae76-4c42-b99e-3af65836aa9b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MKNZI',
    'MCLEODLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'eba3e3ea-3323-4438-8f0e-0f9b444658c3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'MCLURE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '27bcacf4-d2a0-40db-a5a5-5b08aa311865',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GLDN',
    'MCMURDO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9bf59f01-fd6c-4bc3-a41f-a6e79cb56376',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'MEADOWCR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '42c4e68d-5a02-416e-b942-e1a3e0a7e2ac',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    'MEADWLAK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1fb4c7bf-d996-459f-81a0-299100ea5e78',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRNBK',
    'MEADOWBK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4543b649-95fd-492f-8d5b-845805745930',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'MELDRUMC'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '28dbc368-300f-49d5-a75b-3d84ec2d01a3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MRRTT',
    'MERRITT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4f675235-cceb-43a7-84d8-706f21328ddf',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'MERVILLE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'deccb33d-b4d7-4982-a707-f166290c5277',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'MESACHLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '70ca7fbb-4e8d-43a7-9bf9-457b7797e2ed',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MRRTT',
    'MESSEZLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0f420329-d26b-44ce-9a46-086b129adf77',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'METAKATL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '957b4fd0-1579-49e4-88e8-1433099dad78',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'METCHOSI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c6723f01-fd00-46e3-9386-4f2593b61fc1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SMITHRS',
    'MEZIADIN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0c424671-bf7d-44c0-ad23-db29090b3302',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'MICACREK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ca7e0122-7392-4b94-bd4f-fd541e523048',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNSR',
    'MIDDLEPT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9ac43921-8fc8-4434-8cce-9875d55738fe',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GDFKS',
    'MIDWAYBC'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '94cc72f3-2e62-401a-bea8-1583e5b350f4',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'MILE625'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5f471ef8-b097-4a57-857d-ee8a26e74e84',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'MILLBAYB'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '99ea4eaf-4f36-4d01-aa04-9a5e0fbe003c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DJNG',
    'MILLERCK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'dae1f9fa-1829-4be9-8605-089b963ded8f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'MINSTREL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bc2fda31-bccc-4086-9eeb-dfa2c326b4b2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'MIOCENE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '47decdbe-1b43-4b65-9622-ad25808360a6',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'MIRRLAKE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '98578796-9c35-40e0-8cf2-55ce7805a7d1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'MISSION'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e6b6d855-d7fb-42ab-8155-28b7fc74ec85',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'MIWORTH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b042b292-8589-4d01-b2ff-0938a7e746d6',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CHTWD',
    'MOBERLYL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bba8708c-bb4e-4c10-83f8-a7ca70e9ed7e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'MONTECRE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '67fcb213-9c7c-4846-9d26-1ad0c07e0a50',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'MONTELAK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bb8201af-3e92-4e79-a6c9-4ef1a70992f1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'MONTICLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ef98a8ff-9139-4be4-bce2-b38fadeb023e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'MONTNEYB'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '34b36f08-d3e6-4d80-adf9-4633595f0ef2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'MONTROSE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8bfabe92-bdc2-4cc0-b9c8-c996dfd944bd',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRNIE',
    'MORRISEY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '84ba0a6d-e371-4955-a1d6-9fa5a5af7b6d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'MOUNTCUR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '55f3ba55-0884-428e-ad61-98931e0b2a5d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'MOUNTROB'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8de655b8-3281-40d2-b080-203a94d58f96',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRNBK',
    'MOYIE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '590d1289-a38b-4ee7-a399-00dba9f99266',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTNLN',
    'MUNCHOLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '814482f7-e970-4d10-8060-6ded2f3d7739',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTNLN',
    'MUSKWHTS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bae655df-e25d-45e5-8d47-f93e9a3fdb6a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'MYRTLCRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bf1bed0d-1460-4ee0-b95f-06e30be0dcc0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'MYRTLPT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '97218468-950d-4b6b-91fb-9501b15bc907',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DJNG',
    'NDNHA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e2650020-7035-498e-bfe5-5df5977e2239',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KLWNA',
    'NAHUN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4b6f6e5e-9301-48e6-91be-d40af532b141',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'NAKUSP'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd0c17889-769b-45a4-a715-8fe2543d0c2f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLLACLA',
    'NAMU'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e257c9bb-61b8-48b5-976b-887f91b5046a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NNIMO',
    'NANAIMO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '745da509-a9d3-4c7a-820b-74e5883aa9c1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NNIMO',
    'NANOBAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2a66dd62-eaa1-49ea-b75d-a22e3610a121',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PNTCTN',
    'NARAMA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'dcba1fa4-701f-41e7-b9a5-f89a5b6c393a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'NASCA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3b7fe395-35fa-4fd6-8183-20f023bf8c45',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'QSNL',
    'NAZKO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '59734c93-e4ca-415b-a6d5-2290e11e9678',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'NEEDL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b559f490-8b1d-441f-a37d-9148d02ccb78',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'NELSON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bb6a6d1d-d224-4073-9f78-b39aa14f11bd',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'NELISL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1cf12dce-038f-4a88-87da-bb4a3e6141a0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'NELWA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'aa8d97c2-fb22-4ecb-b844-3a43e83b8d6e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'NEMAIIR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'edb9414c-ecce-4da7-bafc-538c24b438d8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'NEMIAVLY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '496b1584-d361-45d6-a7a9-6aa7c50aa241',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'NESSLAK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ec27353a-62f4-4598-9a99-6d2c931ba369',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'NEWAIYA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8adfcce8-5d92-4122-ad79-9883e36e73f6',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'NEWDEN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '33de11a7-f281-41a3-921b-1827c27d8ce7',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SMITHRS',
    'NEWHAZ'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5e967c5a-5cca-4730-8267-082b10554d41',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'NEWREMO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '16e2dcd0-4f9e-436d-8d1b-341c3eb3a3b0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRNIE',
    'NEWGAT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'dd3c7d0f-a912-41cc-8e00-85d2bf95f9ef',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'NEWLAN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd9ab58c1-20dc-463b-a4d9-d6cb2d2e00ae',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GLDN',
    'NICHOLN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8c7c4bc9-ed5f-4568-b43a-39b141bd9cbe',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MRRTT',
    'NICORES'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '105b57f5-84ba-4cc1-a8c5-b0494803350a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MRRTT',
    'NICORES2'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2b97c0e1-9af9-4c66-a414-868b03568efa',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'NIMPOLAK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6a17f9e6-048b-43f1-9db2-b6f51546ad9d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'NITINA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'faf42a1e-4bb7-4dbe-9433-342e1354db33',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'NOOTISL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '91444e57-965f-4ae2-bab8-6829beb8bc47',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'NORALEE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1e441046-197f-4815-a827-c568fffbcfef',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'NORBEN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3a58ba07-2888-4b4d-a83e-bd34fa6c478a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'NORBON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '67d1a3ba-6899-457c-b6bc-531d52a53c4a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'NORCOWI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9e47592d-0fc7-479d-bbc4-6ce7225cc9b4',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'NPENDER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5232586b-352d-41bd-993d-c3a7825f9974',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'NORPINE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e2d45ad8-aff3-41af-9ddf-4bf20f774384',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'NORSAAN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e949eb2f-5017-4504-8974-bdf4f6485bfc',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'NORVAN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '062143de-0235-4d8f-a33f-3274973dfa3f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'NUKKOLA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4d33dbce-d814-499d-a2ec-c22f3ec2f444',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'OAKBAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'af49aac8-2db4-46db-85dd-692387de2921',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'OASIS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b118305f-5df5-4659-8db0-2acde55988e3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLLACLA',
    'OCEAFAL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '871b1c1e-fd22-45bf-8390-743c56d1b758',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KLWNA',
    'OKACEN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '501742ef-1548-4bee-ac20-4e580049b9c9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PNTCTN',
    'OKAFALLS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bc1e1408-868e-4f99-bdff-abe5b479b9bf',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VRNON',
    'OKALAND'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2201a781-8217-4709-8264-91600dab4582',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'OKEOVER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a338a82f-03a1-4886-81dd-9561b585c9e7',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PNTCTN',
    'OLALLA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd7748887-350b-4d0f-b4b9-c04b2bc0fe25',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SMITHRS',
    'OLDHZLTN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '17320eb3-33b1-481b-b31f-102007db8d2f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DJNG',
    'OLDMASST'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c0e53605-1b7e-426b-bad7-7e3371093640',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'OLDREMO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '34181527-0e83-464c-99bb-a3cdf1a31cb8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'OLDTWNST'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e537e482-6553-45b8-b15c-8bfbac7e8bd0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PNTCTN',
    'OLIVER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'aa2cae6d-8fcc-4bf7-9b2f-39aa1222d90c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'ONEISLLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f8bc1cea-929b-4903-8c43-ab43d4bebc54',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'OONARVR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '954b2632-306d-45e9-8479-dcb23609e26a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'OOTISCH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '762191fd-c4f3-44a4-b1d1-7954696357d1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'OOTSALAK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1f32652d-0b65-4cc4-809e-cc0a8c0dfaff',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTALB',
    'OPISTAT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5ae20968-9a83-48f5-8d91-133e671c0f3e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PNTCTN',
    'OSOYOOS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bb03064c-055b-4839-b043-c5a8435719c5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MRRTT',
    'OSPREYLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '638bc0db-296e-4052-bf90-d4392cb35a8d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTMCNL',
    'OWEEKENO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6a0cf936-460c-4757-8482-f68fd6cffc36',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VRNON',
    'OYAMA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '60b9fc22-c538-49ab-a76b-a22023a2c646',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'OYSTERBY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '436f8a87-e719-47d5-aea2-d3c7842359f0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'OYSTERRV'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '879703b7-44ee-411b-a71b-bbe1b4702ef0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'PALLING'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'dcf809d7-52ee-4824-8067-accf142f7c55',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'INVRM',
    'PANORAMA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'dd29e986-5037-402b-90a6-691b8f520e4e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VRNON',
    'PARKCOVE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '123a1a0e-42e6-4077-987d-874944ce60a2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'PARKLAND'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c664356c-db28-4fb9-bd79-54b0a714a694',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NNIMO',
    'PARKSVLE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bee38a83-8741-40f9-bd68-1e592e5cecfa',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GLDN',
    'PARSON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6ed0af7f-e6f5-43b9-9085-ec08d7b9d623',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'PASSCREE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ab97f6bb-20bc-4cdd-baf0-a846504b40fb',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'PASSMORE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '356ae468-d95b-4302-866a-c97153b996a3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'PATTERSN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '03a348d4-d9b0-4c59-9177-0f9f8e913a91',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'PAVILLON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5483b296-dcc1-4f34-9c69-48b525da2d89',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PNTCTN',
    'PEACHLND'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '09cccd5b-a75a-45c7-bd61-ad81c758b1f5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'PEEJAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '455c9d31-0a1e-4efa-8f07-c6d7cd5d109c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'PEMBERTN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '460771c8-4273-401f-a2f0-9f7e48cf6734',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'PENDLTNB'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b99f26a0-79f8-4604-bc4e-73c6e682b0bd',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'PENDHARB'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e7224fd0-7a77-4363-80b0-4d8a0e8a6ca9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'PENDERIS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '39c4c95d-bd91-4693-9429-78fa67480f2e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'PENNY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3505df65-c3f8-4bc5-a1ab-e07a8094703c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PNTCTN',
    'PENTICTN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '90cc5445-69ee-4b0c-b39a-dad97ba20e28',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'PHILLIPS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '15d8019d-4467-45f3-a570-637a5a941849',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRSTN',
    'PILOTBAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2c07bb87-495d-4fdc-93b0-c2eab3820b75',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'PILOTMTN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8500700e-9290-4e72-9709-41388f91a1b7',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'PINATNLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9a4a17fe-953d-4d81-9a3f-84693072563b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VNDHF',
    'PINCHE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '06f7c367-9816-4989-b6fb-7c318eae61ef',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VNDHF',
    'PINCHIRS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bea3e0dc-9f16-4bec-849d-606a9b249fa5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CHTWD',
    'PINEVLLY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1c7faf71-e0d9-475b-b64f-c516c20702fb',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'PINECRST'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f9dfacd1-e0d3-4afb-b67e-5183fbf5333f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'PINEVIEW'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ffb03724-fc8d-40d4-8515-d70cd20014ac',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'PNKMOUNT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '58f84b33-0ee1-43c2-ae71-259c591958c9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'PITPOLDER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5d5c777c-d3c9-48cf-8730-a1c91ae905bf',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'PITTMDWS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '657d48b9-1c3e-4a03-a805-0c27a3a8cc05',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'PLAYMJCT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '53c1947f-6d20-4167-bd43-600c47cccf44',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'ATLIN',
    'PLSNTCMP'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bbf3f38c-fe1b-4f3c-9bb6-ecd949f2c90c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'POPKUM'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c040cb43-529f-4768-918a-d70e30323173',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'PORCHERI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3596ef44-a8ab-4156-9e26-1aa4fb3296e2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTALB',
    'PORTALBR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '81aed284-44c0-4579-83dd-ecf89b2f438f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTMCNL',
    'PORTALIC'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1260efd0-e2ef-429b-b846-502f0a2c8dcd',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DJNG',
    'PORTCLEM'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0bda0361-0ed6-4d66-9eee-6a3f4f5a8284',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'PORTCOQ'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5361c540-d90f-404a-8e5f-77888367e15d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'PORTDOUG'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2fe7a163-4925-4000-97aa-6fb854acb39c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'PORTEDWRD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b9c8b679-1ce3-4bfe-9e75-b9a4a1811e9b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'PORTESG'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3737eb44-b0eb-4739-83c1-13e36e59ba34',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTMCNL',
    'PORTHRDY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '351b3765-983a-4bab-91ec-39adfc54de3d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTMCNL',
    'PORTMCNL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '534faf27-9f4f-4148-89b1-29951680edb9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'PORTMELN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5e62ddd5-72ec-4184-aa57-d978c08abf06',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'PORTMDY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5622a5d1-ddb0-4927-9b26-c940232e40cf',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'PORTNEVL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd8fd921e-6d99-43cc-ae79-41545a1a6e7d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'PORTRENF'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6a635e72-8875-4ee3-ae67-fe2666f26ab3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'PORTSIMP'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '27367418-de01-42b9-ba21-c3363966cd58',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VNDHF',
    'PORTAGER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '13db3f32-2605-44ac-bc18-dd67e7c2cbfb',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'PORTRICO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '41c90e94-9740-41b5-825a-a49a13ebb9f5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'POUCOUP'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1404d73b-6b52-44b4-9ecc-6109ba59fde7',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MKNZI',
    'POWDERKG'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7ba17808-865d-47e7-9c51-79a1b9a06f06',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'POWELLRV'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '52b19109-8d22-4cdc-8ef6-5df05bc1adee',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'PRESPATU'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd5af708a-6af5-4eeb-9bf7-96731264c002',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'PRESSYLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '92de0e00-aca1-45b5-a2d7-305aba1adbf2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'PREVOSTI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6b282e1c-cd72-4f27-b54c-e424fc2e3bff',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'PRINGEOR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9eaf9939-9d2c-431d-842d-ea4f817dd0aa',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'PRINCRUP'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1ca91f51-919c-443d-a6a3-b67ad91971a9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MRRTT',
    'PRINCETN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '23f120a2-a5a8-4974-b4c2-d8b47b54290a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'PRITCHRD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '507628ed-8192-4c2f-b648-43a289554968',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'PROCTOR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3ad26e9b-f75f-48b3-8937-c811ab906d49',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'PROGRESS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f7f3e28e-171c-490b-bfcd-b964a6093260',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTNLN',
    'PROPHETR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '19880fde-29d8-4efc-bf42-de1d555658df',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'PUNTZI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9b2830f8-9e10-471f-8766-1dc221c2ac27',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'PURDENLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '293d1b00-1ee8-42be-813d-6f48302581c6',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'QUADRAIS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0b54a23f-a0bd-48cf-b3c7-e06d1b0030a7',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NNIMO',
    'QLICMBAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2c5848b5-1b48-41fd-8758-3012809e3022',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NNIMO',
    'QLICMBCH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2f384633-95f3-4f27-83da-3d114d4ee4bf',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTMCNL',
    'QUATSINO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'aec22261-b923-4b4d-a372-8f9b37e8d3cd',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'QSNL',
    'QUESNEL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f0068a0a-c64d-4b2a-ae99-7e6ec07cbe22',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'QUESFORK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ccad21d0-e63d-422f-a211-7de466282c6b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MRRTT',
    'QUILCHNA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '37557983-f302-44c4-8344-ea33ea221dbe',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'INVRM',
    'RADHOTSP'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6fae2b27-e3bc-4588-b9cf-2a5a3e946c27',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'RASPBRRY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '893d791d-1b8b-49a3-82e7-49831cdce3b3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'RAYLEIGH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a18e5ded-dae6-45cd-90d3-461e47dd55d0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'READISLD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4849b4ae-bb03-4a90-913a-b3653698cebe',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'REDLAKE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bdad134b-9d60-40ba-9eb2-5684853fab06',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'REDPASS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8e479440-fd20-46ea-9fba-7a4d6d2a9223',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'REDFERNL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd3bc492c-6282-4890-a352-365b0d6ec243',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'RRSTONER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6b2a17db-4110-4585-b113-668efb6cb172',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'REDSTON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '35006d80-3fbf-45fa-9e11-d2566fc1a955',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'REIDLAKE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '13b284e3-caf2-4859-99b5-ff365a110b03',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'RENATA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9678c64c-2353-4a8f-bb79-67c0b47b7927',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'REVELSTO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b47a4094-707a-435d-b9b4-62a570c1a3dd',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNSR',
    'RICHMOND'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a7d7ba68-18a4-4ef5-8b53-c6d1f332fca3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRSTN',
    'RIONDEL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6b4b0d56-0f94-4f78-b543-10b6802995b0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'RISKECRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'db29f304-0b41-4088-a91d-d7c1c0ab323d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'RIVERDAL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '00067f0c-4077-4de7-a395-cac95dcfcdb3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'ROBERTSC'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c8d10f23-bf05-4507-be34-72d600f9ddd9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'ROBERTSL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd9d3cc5d-174a-4f62-b1e9-0f1a63fc5bd4',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'ROBSON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e1c30a57-8ebd-4273-b079-9fbd4ca6a81c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'ROCKBAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e74b9e39-f848-46e6-bcc6-40f234cc08c6',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GDFKS',
    'ROCKCRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1c92573a-98bb-4595-a44b-e13f232639e1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    'ROELAKE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '92c7a493-e757-4cc7-ac24-27c89140a0f9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'ROLLA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '707b1509-ce27-4220-9ef7-355409982409',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRNIE',
    'ROOSVLL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '60906680-3b1b-415a-9c1c-7973b3f90058',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'ROSEPRR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '48cca7bb-7ebb-47e1-a54c-e6f1cfd4fa25',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'ROSEBRY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0e761247-8ba3-4ebb-8b53-ca0d7bdf854d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'ROSEDALE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6fe32c1a-a8d9-4441-a8ab-d8436d8fe78b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRNIE',
    'ROSENLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'daf334a3-3e0c-4d84-a4b2-d4d8ec63add4',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'ROSSLND'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7178f386-55a7-4bf0-9d2e-ada48f5c2340',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'ROSSWOD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e1df662b-d62c-4b42-a344-ce9bf8e9c574',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'ROYSTON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0fb51f63-84cf-4e4a-a8f8-33a40b96bc7f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'RUSKINN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '282a66d2-c163-455c-ad0a-665c3bfd04b5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KLWNA',
    'RUTLAND'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '52af8489-11d0-43ba-acf3-b8570e908157',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRSTN',
    'RYKERTS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2cccd9fb-db10-4115-b62c-ef7d1686ea84',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'SAANICH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b29fefc8-f54e-4dc1-a224-d7e0d7ed6d70',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'SAHTLAM'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ad266377-22fa-4aa7-9d15-74e54ed2c046',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'SALMO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '00ed40e3-ee52-463d-baed-7a714ecb824b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'SALMARM'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a8578376-de83-4325-bb36-b38b62697fce',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'SALMNVY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f524ee49-c116-40f8-9507-337525873578',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'SALTSPR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e4482017-f776-455e-aca1-e211dd908edf',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'SALTERYB'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '82b4f931-b7fa-4a82-b9a6-5b3168b7df16',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRSTN',
    'SANCA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5ef0d473-abcd-48c5-a98b-0673d7b39eaa',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'SANDON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8747265e-b517-4418-bddc-9b2e15249d97',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DJNG',
    'SANDSPIT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'cee8d556-39e2-43f6-b40b-8f0b55e00151',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'SNDYHK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1215c2f5-910a-4c4a-901e-61b74fff6ed7',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'SARDIS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '181e297d-53ee-4850-b755-f87866af64dd',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'SATRNAI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0cd406c9-c631-41ae-91e5-66a1be28eaa4',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'SAVARYIS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b333943a-06d3-4a5d-b75b-d58dd6033c9b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'SAVONA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c17dc330-4cae-4386-9d57-59a442905570',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'SAYWARD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '642e86ff-dd85-48de-8cd4-9de4907ef29f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'SCTCHCRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9964445d-602a-48f2-a778-c3c38ed8900f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'SECHELT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1c982d0c-0452-4578-97a3-790a13db6016',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'SCRTOCV'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'eb347445-80c4-4e54-a16e-26881a26854c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'SELMAPRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '338498cc-c5ea-4e2c-8b63-2b26ec8ff369',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'SETONPOR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9bd8caa4-5bc6-4761-8edc-51564529eee5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DJNG',
    'SEWELLIN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6c07521e-73f5-46a5-8711-70be5a51037c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'SEYMOURA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f82c0420-8447-4744-99c0-9c77208ca741',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GLDN',
    'SEYMOURL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f41b1f9d-a5dc-4207-b602-46238eb7c1dc',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'SHALALTH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '38e02bd2-8ac1-4450-a564-f3d790875994',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'SHARPELK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '43db6d6e-c2a7-4ecf-bc2c-faa78e353f4c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'SHWNIGN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1189c04e-3723-40c3-ba2e-16d7eb8af7a3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'SHRERDAL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '519ee8fd-bd19-4854-aa2d-68cf9e478952',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'SHELLGLN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '07d61979-bac7-44af-81f4-9916a6c51945',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'SHELTRBY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7ee780b3-0e06-4a5d-9b11-a77c0f418f8a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    'SHERIDN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bc4c9ede-1327-43fa-8146-6194e99660a5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'SHOREACR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5cc98ce4-2b50-43cd-93c4-851782e964db',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'SHOREHLM'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7f54aeb8-2161-445c-9d46-3100c1949f52',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'SHUTTYBN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b859c44e-ffbd-4c4d-a7ad-cee063490713',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'SICAMOUS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6043de63-2493-4685-a499-28f14a7e62a8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'SIDNEY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1ca1924b-5429-47fb-8218-5e8457102db5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'SIKANNI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3211abc9-acdb-4d45-b427-43f4ca7804b0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'SLVRDALE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b3a0681b-b08a-43d2-887b-c75c61bdb26d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'SLVRTN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '925dba3d-77e3-4b04-adf1-afb1966a1826',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'SINCLRM'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ffebf1ac-a600-4b61-ab39-05dfccf9b08c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRSTN',
    'SIRDAR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c8ffe840-4b28-4459-95a4-00c210840132',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GLDN',
    'SIXMILPT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e023a246-39e3-4104-b2cf-60ec83adc20d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'SKEETCHE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '383e8ac5-0675-4240-9d0b-3c96d28c959c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DJNG',
    'SKIDGATL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2142f240-2bba-46cf-8177-d96446aeab64',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DJNG',
    'SKIDEGTR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '34ea0122-169b-4a14-bc72-fb83252e290a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRNBK',
    'SKOOKUMC'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '872c016c-3eb6-421c-8ee6-38da22f5bc90',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'SLIAMMON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ec7dc741-71fe-4ef5-8b16-11733c193170',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'SLOCAN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '50f48dd3-0179-483e-84bf-b3da52e1863a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'SLOCNPRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'cf599088-fa34-4e50-986f-b077bbf36a10',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTNLN',
    'SMITHRVR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a8b559c1-5c13-439b-990c-e2992864d967',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SMITHRS',
    'SMITHERS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '09122ff8-7a80-49f5-84ae-500bf1478eb0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'SODACRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '15f9d702-60a2-454a-8fab-1fbda7347b5c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTMCNL',
    'SOINTULA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c941643d-2234-4645-b75d-d1f509f6e2fe',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'SONORAI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '853bec7d-fa3f-46e6-9dbb-450f9907b9aa',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'SOOKE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2317f74d-c0a3-4038-8adf-f29a9636575e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'SORRENTO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'acbec5f5-c09f-41c3-80e6-2e4eeb941bdd',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'SDWNSN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c5d32451-c21c-43bf-aa4d-e08e9005f428',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SMITHRS',
    'SHZLTON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5d889b3f-07e4-4888-868a-19407145828a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'SPNDRILN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f8fb85b0-1440-4ea6-8fbf-bd9834c2dc2a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'STHSLCN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a766f91c-22ff-4c5b-98b5-9e9439cc16e5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'STHSLCNN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b0eda745-2a52-4015-bec5-7ee021174c7f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'STHTYLR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5deea54d-13d7-4515-838e-55b4ead1fbc5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'STHBNK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '38f6e825-ad69-43e2-a82d-64695ef918c2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'STHVW'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1396d845-9ec3-475b-b3af-8dea813d4cd8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VRNON',
    'SPALLMCHN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '224bb744-bbfb-4a39-aab9-43389f0e7cff',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRNIE',
    'SPRWOOD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c0806fae-a638-4efe-8a66-c07b5f122e59',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'SPNCESBR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3d72b82a-a487-4036-b320-3af5564e373b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GLDN',
    'SPLLMCHN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1f0c6602-f095-407b-81d7-c5f972c340d2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'SPRNHOUS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '982d448f-d54c-4c24-b8e2-bbca3c31bacc',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'SPUZZUM'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a50ecefa-9d6e-4c96-b1cb-af11b89bfe7a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'SQUMISH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c3de63b7-913a-464a-846e-9ca7a5ce31ff',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'STAVFLS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ab5e3218-b4d0-4065-bdc9-69bb451142c1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'STALHEAD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '607001cf-04df-462a-9c90-870f0d7cb77a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTNLN',
    'STMBOAT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a9d991b9-9fd3-42cc-b80f-331e2e9a754a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'STELHEAD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bb520ea4-c24a-4320-996f-ce6557f270ea',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SMITHRS',
    'STWART'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'fa26ac8d-20a6-4a55-9bbe-e3d361740456',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'STLLWTR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e6ecab22-387d-42f8-906b-b7b46b2990a6',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'STONEIR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f6b0fb9c-d96d-4b5a-a52d-6813c13f9f1d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'STRTHNVR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a948cfd5-d08c-4eb7-9b05-632fe7fcaf4f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'STRTHAM'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '65960216-74bd-43a9-8fd5-569c86954243',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'STUARTIL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9111982d-e6f9-48a6-90b7-dfd254a2fc4e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'STUIE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a27a2a62-fa5e-4cae-bd0d-0a0b04423ffa',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'STUMPLAK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd7d9e72e-5055-46c9-8911-21230a4b0903',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'SUGARCIR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0b8d94eb-1de0-41a6-a24c-a59c63dbc2da',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PNTCTN',
    'SMRLAND'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '97d1e91c-feed-436c-9921-834cb348c1a1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'SMITLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8ed645e9-0f2d-440c-bcf1-154d240ec726',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'SMITLKPP'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b2400e1c-1110-484f-a0e2-2082294704fa',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'SNPEAKS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b5c751ed-b5fb-425a-aa5b-0d115aeb3ab1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'SNSTPRAR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '93b3459c-2997-4d0e-8513-059eb2f55e7c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNSR',
    'SURRY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2c3970f5-4077-4780-85ce-5809794d25be',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'SWNLKPP'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a0df705e-e133-4ef3-96f1-153b7ccb43cd',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'ATLIN',
    'SWNLKKRP'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bf1374a7-40c9-4ecc-af2c-c19b0de9c45a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'SWTWATR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1f42acd0-2191-495b-9f74-ff224ba2459c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'TABOR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8b090359-72e7-4650-a953-559ff11d9e0e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VNDHF',
    'TACHIRSV'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bb3264df-9a37-4fb8-b648-9bc1a0cbf7a9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GLDN',
    'TAFT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '528053d7-a97a-4edb-858e-50c72368107e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'TAGHUM'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '286ee83c-d108-4880-bcab-09523fab7ac6',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'TAHSIS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c14f9438-32ec-40a5-aab7-a44a1151e6e5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VNDHF',
    'TKLALNDG'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'fa6f12dc-2525-4873-a6f0-35c214058dd0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'TKYSLAKE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0a1d0af8-b5fc-4074-aaa5-07394e975452',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'TAPPEN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e97423c3-cb54-4224-b0c8-5b555b9af353',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'TARRYS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a78d57e2-2d65-43f9-b13d-8577ea1781b9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRNBK',
    'TATACRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8d53c47b-09b8-4192-9736-c2ab0415eb7b',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'TATLALAK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0ccee9d9-c3d6-4e52-9b78-ea85f6d10450',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'TATLYOKO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6737f4ce-6610-4bec-a520-dda6e69b8e9d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'TAWELK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '87718e76-c2a9-401e-9537-9aa274d45ad0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'TAYLOR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e6e79643-ab28-40e7-b7bf-b737e1e7f753',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'TCHSNKUT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bdab6ae4-8dcc-484f-a1ed-6f3557f34112',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTMCNL',
    'TGRPHCOV'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'fc465db0-6065-489d-8952-7beb7f4cae99',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DSELK',
    'TGRPHCRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e1caee1b-7638-47f4-be45-5a582d875633',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SMITHRS',
    'TELKWA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b29cda3c-0579-468c-a819-9383d41e9157',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'TERRACE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f6b9cae5-e1d7-4ac1-886d-e105b83f77da',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'TTJUNE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ce6ac3c2-7af2-4371-9069-66fe3e91173c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'TEXADAIS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '484b3e28-0a2f-4b78-b441-3523d6eba931',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'THDSAINL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c26b252b-e632-4e58-bc43-e7ad32041207',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'THETISIS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f6923bea-11e8-46c4-9d20-9e1bf1e1a3cc',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'THMPSNSD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '29a79228-c0d0-42c5-bcaa-498e9b6b6c02',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'THRVALGP'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '63a3fb5e-6a78-4523-bcd2-da50b67670fb',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'THRUMS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ab311c68-3a2b-4e7c-ac04-a3a21be77ac6',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRNIE',
    'TIELAKE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'aa965cfb-0ce1-4e7f-b91c-a6cb702d51e4',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'TINTAGEL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b3e4ba65-fb3c-45c0-8ff3-763ad8607456',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DJNG',
    'TLELL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '211a335c-9696-4750-81ac-87da975a9d59',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTNLN',
    'TOADRVR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '61b64c72-6828-493e-9973-a666ff91466e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'TOBAINLT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e0c1b9e9-20cd-499d-9055-300286967ba2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTALB',
    'TOFINO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bae13acf-cff1-40bb-8b77-76509bcd814e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'TOMSLAKE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1b0622e1-694a-403c-92ff-00f70cabf6aa',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'TOPLEY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7b31845f-0130-41a6-8861-df4b2914e110',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'TOPLND'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b6a0b854-e33b-4f5a-8e41-bc90a50a0bae',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'TRTSLAKE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '19673355-6e40-4514-9290-9ac3b7624680',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'TWRLAKE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c3675299-d247-474f-927a-44dc3db907e0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'TRAIL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '98980bb8-8a28-439f-901a-e22986da95d8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'TRNQL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9d6df344-0094-4644-8353-2e03afa9cb14',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'TROUTLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '71e9c3f6-8954-418c-aeaf-f32e62d07183',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTNLN',
    'TRUTCH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '861b54da-c742-4d03-a752-33f4b09deb6a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNSR',
    'TSAWWASN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '18ffc97d-8b4c-4ce2-8042-e85ed1524ea8',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MKNZI',
    'INGENKA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '81c19139-54ce-47ce-aa49-1edd585a3dc1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MRRTT',
    'TULAMEEN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a4a14ca5-4668-4476-89db-1422f3de569d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'TUMBLER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '87407788-eddb-4c4f-b8dc-aed2d574edb9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'TUPPER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '40b28f7b-6c24-4b20-9b14-bd15ba323377',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'TUWANEK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '071149d8-cd9a-4c66-8d3b-7c41e87e475a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'TWINBUTE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '06e26f79-9004-48a3-b7c2-750d078e8184',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'TWORIVR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9d689e94-8b3b-4ffc-966c-6724a6c6efcd',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'TYAXLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '753469c6-f6e9-4dc5-89e3-0f7ced3e2282',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRSTN',
    'TYE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1d4f6561-e8c1-4765-9c8a-fd4dd0a83668',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTALB',
    'UCLUELET'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '18a33f3a-977b-41c0-bd7b-dc82d91f5b35',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'UNIONBAY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7847b536-65e4-42f7-bea9-a20b3b02ce0c',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'UNIVENDW'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3e80e820-5870-44d1-8816-a13d7bb076c1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'UPRARRWL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '044f92ea-e61a-423e-9a19-c436bff550af',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'UPRCUTBK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'bcc8ee4f-f578-403f-ab14-608b15f2d47e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'UPRFRASR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2c861852-e412-459a-92c8-9413d557d7f3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'TERRC',
    'USK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f3c680e4-395f-45e2-95bd-1a43433dc025',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'VALDESIS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a8bd1dc8-4c74-4b96-9ff5-8d745da7bffe',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'VALEMONT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '7fb38f48-0e78-49b4-ae19-024b7ab89521',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'VLYVIEW'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4dc27f4f-c887-4784-aa3f-e53e4718e030',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'VALLICAN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b85cb64b-ad80-4a02-a981-dd5170bf4bfc',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'VANANDA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '348d2ec8-1943-4129-9efc-91623b78e8c5',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'VANCOUVR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2714b7db-5bac-4ad1-9804-17c4a2326009',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VNDHF',
    'VANDERHF'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '363a960e-e9f2-4074-87d6-3d26d8215642',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CLRWTER',
    'VAVENBY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '466a7ccd-d3bd-4e9a-9a63-d68cc23eae08',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'LLT',
    'VENABLES'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'eee84930-b973-468e-86a0-6ff433536002',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VRNON',
    'VERNON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '50c824e5-4652-4a77-a5b5-e1100f9c75c3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GLDN',
    'VICTORLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5dfc2a47-b313-4ae8-8f3a-4bbc2938c1cf',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'VICTORIA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '142491e2-3fdc-460a-a7b8-c7ade7314b19',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'VICTRA',
    'VIEWROYL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '764f2440-32a3-4b43-94de-9725f16765a6',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'WALHACHN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd09860fc-ab21-4d2d-a14c-0b8cfbb3723d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'WANETA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f2629656-5bf8-4b54-b02a-cfa769561d06',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRNBK',
    'WARDNER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1990c2a0-e76c-4ffa-9360-5f6b6c291f6a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'WARFIELD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a46bbe8e-27cf-4413-82f2-62a0779a99d2',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRNBK',
    'WASA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '621f533f-ab58-4736-a2b7-5ee071043325',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'WEBSTRCR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'dfae0095-6a14-44e4-8bd5-54420205ee52',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'QSNL',
    'WELLS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ece28039-163d-4b66-a376-79b345c743ce',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'WCRACRFT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ec4890ba-91b0-4aae-ad1c-5a65a919ae9d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRSTN',
    'WESTCRST'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ef789a21-ca49-4381-90fe-b0b8ca4cb2ee',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KLWNA',
    'WSTKELOW'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd838e502-27fc-47bd-86d5-d6e81705442a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'WESTLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3626b888-059f-425a-a5f5-c2017ea9d595',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BLKCRKCR',
    'WSTTHRLW'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a67f7262-fddc-40d5-a7cf-200b4b3a299d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'WSTVANCO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '13bbdc7d-7684-47d1-a3b0-9684f93f88d3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KLWNA',
    'WESTBANK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '99560bb2-0daf-4556-b057-0339eac7cdd4',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KLWNA',
    'WSTBRDGE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd41ff553-8d63-41ac-8687-ba604007e6ff',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'GDFKS',
    'WSTBR33'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b4c9955e-e664-4174-affd-e61fbcecbb1a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KLWNA',
    'WESTSIDE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'fb658926-c7da-4e37-8843-de82da79040e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'WESTVIEW'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e1058ddb-8d33-488a-b006-fa66d2e8d5b3',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'WESTWOLD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '659a634b-2ee0-4322-ab18-6fbca126fb39',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'WHTSHANL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c704fa47-d4a1-439e-a7b9-b91a1d0feae4',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NNIMO',
    'WHISKYC'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'fd589b6a-6bbe-49fc-8920-3d3c2985bf52',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SQMSHWHS',
    'WHISTLER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1af8520d-4f54-467e-9c3a-c73eeaa19283',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SLMONRM',
    'WHITELK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4903f507-afac-4157-95f8-10780f691dd1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRNBK',
    'WHITERIV'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '64856ec7-5eb8-4cac-af3d-89b0d99796fa',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNSR',
    'WHITERCK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '497b5c99-f09e-45db-831e-dea9c00a71e9',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KMLPS',
    'WHITCROF'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd7ef2d7a-6954-4f63-bbe4-986455ec12dd',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRNBK',
    'WHITESWN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '18ba278b-89be-4e52-950c-268cc099086d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNMPLRD',
    'WHONNOCK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4efe084d-636a-431e-9bce-ab3328f4086d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PWLRV',
    'WILDWOOD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '9feea99c-929d-4e17-82cf-96ae1fd2ad72',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'WLMSLK',
    'WILLMSLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '480bfaa9-4d0e-4f09-b39f-729faf86370e',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CHTWD',
    'WILWFLAT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '1059705f-8028-4c9c-8864-2411ad99c0f0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NLSON',
    'WILWRPOI'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ce8a8394-b907-48b5-b656-be303e1089e0',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRCG',
    'WILWRIVR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '54652b87-4d8b-4de0-bcaf-0e872d599aef',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DWSNCRK',
    'WILWVALY'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '30652c4c-b1f8-4d34-a2df-9b760ce8e001',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'INVRM',
    'WILMER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '28810602-47cf-4766-8b71-9c43c9fe79c4',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'SCHLT',
    'WILSNCRK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c79d63b6-6aed-44d6-bf56-163692d5c874',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    'WILSLAKE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a18dd497-09b6-48ff-aa43-7709f260d4ef',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'KLWNA',
    'WLSNLNDG'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'd3b07c4d-13cf-43bd-8504-13dd53aab792',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'INVRM',
    'WINDRMER'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2cb85823-d8a5-484d-bd28-aa1f63329aca',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'WINLAW'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '42b53ce2-e0a2-42e3-beca-0b33ee5614ff',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTMCNL',
    'WINTRHRB'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f7bc5148-3087-45a9-b4a6-a51bf55d1d0d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'BURNSLK',
    'WISTARIA'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '4cf2c5a9-8d77-4c15-8d5e-4582a0c7a7af',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'FRTSTJN',
    'WONOWON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'c7514433-486a-44a9-bb43-510f9be03010',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTMCNL',
    'WOSS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '364fa798-7fb5-4b1f-a440-b975cff26345',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRNBK',
    'WYCLIFFE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '2fdfd5cf-0bcc-4a89-8f09-77a2ac73f72a',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRSTN',
    'WYNDEL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e8b52c59-3849-4635-9d8a-5973cda67f52',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CRSTN',
    'YAHK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '8c4ce1f1-795a-4222-833f-525e40d936b1',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'YALE'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'b2539de1-f8a9-4c32-b79c-cf0f624a7f01',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'MSNCHWK',
    'YARROW'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '50b89a31-4a3c-42dc-987d-285ddfbc16b4',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'NNIMO',
    'YLWPOINT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'a1db53ec-44a6-40a5-b820-2ebc5a6cd322',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'CSTLGAR',
    'YMIR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '60d39caf-40f4-40db-8ff7-5aadb2595877',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'DNCN',
    'YOUBOU'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '6abed220-d1e0-4f7e-ad9f-f2e626d4ba11',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    '100MLHSE',
    'YOUNGLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f80d2006-b4a3-44f9-99d9-8d7320721586',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:10.251621',
    'COS',
    'PRTMCNL',
    'ZEBALLOS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '30cf84d4-ce78-4705-b01a-16854f094072',
    '2025-09-08 23:27:33.265905',
    NULL,
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'COS',
    'SISL',
    'COSHQ'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ea08965e-a38d-4e60-95d8-62ab213bc84d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'COS',
    'FRTSTJN',
    'HUDSONSH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '017c6e36-4c42-4c2c-aec0-eb16a88db74d',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'COS',
    'SMITHRS',
    'HOUSTON'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ed5d3915-8120-4af6-9d06-268532aa4693',
    '2025-09-08 23:27:33.265905',
    NULL,
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'COS',
    'GLDN',
    'FIELD'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '41b31066-6e97-4911-adf1-a66fe327eaea',
    '2025-09-08 23:27:33.265905',
    NULL,
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'COS',
    'GLDN',
    'CNYNHTSPRN'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '435b29a8-85dc-430f-9dae-08fdd26cb180',
    '2025-09-08 23:27:33.265905',
    NULL,
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'COS',
    'SLMONRM',
    'DPCRKNRSLM'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e22e34f9-a4f7-4fec-a11d-fba1e2482bc9',
    '2025-09-08 23:27:33.265905',
    NULL,
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'COS',
    'SMITHRS',
    'HGWLGT'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '3878f89a-0dd5-448e-ae5c-25e2231864a7',
    '2025-09-08 23:27:33.265905',
    NULL,
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'COS',
    'BURNSLK',
    'RSLKBNSLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'ff73be9e-a0a1-48b3-99e9-2fcf78191337',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'COS',
    'GLDN',
    'ILLECILL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '90649e3b-5b76-45b8-950c-02bb4eebdf2f',
    '2025-09-08 23:27:33.265905',
    NULL,
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'COS',
    'SMITHRS',
    'WTSMTMRCTW'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'f11ecd31-b76f-4a4f-b5e7-86812167dccb',
    '2025-09-08 23:27:33.265905',
    NULL,
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'COS',
    'WLMSLK',
    'DPCRKNRWLL'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '247e395b-0653-45eb-ac8e-753adf757ec0',
    '2025-09-08 23:27:33.265905',
    NULL,
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'COS',
    'WLMSLK',
    'RSLK150MLH'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '77a2dab5-1f32-476c-849c-e47203dd1830',
    '2025-09-08 23:27:33.265905',
    NULL,
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'COS',
    'DJNG',
    'DJNGGDS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'e650baef-d019-4fda-ba12-6a9114000f6f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'COS',
    'FRTSTJN',
    'BRYLPRR'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '0a8642a6-5eac-4e66-a766-8b758e00a98f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'COS',
    'FRTSTJN',
    'FARRELLC'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    '5e886b86-7592-4e0d-8881-647f9b35a6fa',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'COS',
    'VNDHF',
    'CLUCLZLK'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  geo_org_unit_structure
VALUES
  (
    'da9bc5b7-b16a-4680-9679-48e97ccc942f',
    '2025-09-08 23:27:10.251621',
    NULL,
    'postgres',
    '2025-09-08 23:27:10.251621',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'COS',
    'SQMSHWHS',
    'NEWWEST'
  ) ON CONFLICT DO NOTHING;

-------------------------
-- Insert OFFICE records into shared schema
-------------------------
INSERT INTO
  office
VALUES
  (
    'db343458-8eca-42c2-91ec-070b3e6de663',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    '100MLHSE',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '5c7023b9-710e-4333-bbcb-8a95350b747c',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'ATLIN',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    'cdd9964e-7878-44c1-b4a2-0290c6345dec',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'BLLACLA',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '3338cb74-5be4-4ed3-8b11-41f83d72de00',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'BLKCRKCR',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    'ee09bf4d-e5a1-4fb8-9012-c192692dd1bd',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'BURNSLK',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    'aebabfed-cf45-4253-9fbf-f49452190332',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'CSTLGAR',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '92bad201-cccc-4021-9c79-bbdcf13947f2',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'CHTWD',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '79fe321b-7716-413f-b878-c5fd6100317d',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'CLRWTER',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '19addcac-91b2-4ab3-83b9-9a26baa1e635',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'CRNBK',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '2044f08d-b53c-489a-8584-dd867b63514a',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'CRSTN',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '55d7b990-8123-492f-8b5b-7cbbd14ac423',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'DJNG',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '4a5a94b1-bd47-4611-a577-861d97089903',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'DWSNCRK',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    'f30857bf-bab9-491a-b38f-83600238c36d',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'DSELK',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    'f7065a6e-2481-4526-b874-6ab98009481d',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'DNCN',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '784080e4-9674-4c84-ac3e-bf161b09c2de',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'FRNIE',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    'edd4b298-ced7-4b10-9232-87512ec640b3',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'FRTNLN',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    'e0ad7fe3-59da-4e1a-a611-46ccf7ea7396',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'FRTSTJN',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '643a4ff7-9135-4e6d-86ad-f2f8aac195ef',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'GLDN',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    'c8aeb3d9-3718-49d9-b8b5-6c84671546eb',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'GDFKS',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    'a5e2e92e-4928-4dbc-8165-e06234b051c1',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'INVRM',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '3a070028-2c6f-4ea9-a548-271cf076280a',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'KMLPS',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '21855957-521f-4190-b0f9-a7ab7d139978',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'KLWNA',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '33dc58c7-2ebf-4924-93f9-168073058273',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'LLT',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '3a4e8fc8-db72-4f02-b5ee-1f257c74a635',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'MKNZI',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    'e6807e73-f591-459a-b0f7-413f6fb2984e',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'MRRTT',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '8f9e10a8-53b5-4125-8d8f-b7fbfdd6ae47',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'MSNCHWK',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '491941e6-89a7-473f-b246-a2d8cd21b078',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'MSNMPLRD',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '00048dd4-17b0-4fdc-a3fb-54f820970422',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'MSNSR',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '6496f00f-5397-470d-90db-490e6859256a',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'NNIMO',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '4ff0d641-4c60-4a0a-964e-6e0ac5bfa8de',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'NLSON',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    'b494082e-35a3-468f-8955-4aa002066b36',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'PNTCTN',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '305f0ee6-b525-40fd-b2d8-c7a882e8b7fd',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'PRTALB',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '3058b00c-cafd-4eba-a1a4-a989ccff00bf',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'PRTMCNL',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    'cd101564-6114-49e0-9e87-fa6e4925dbb7',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'PWLRV',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '3f474308-68da-450a-b1ab-fb8a5b7a27ce',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'PRCG',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '313f4ec3-e88a-41c2-9956-78c7b18cb71d',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'QSNL',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '19d0f476-0fc4-4fe1-b7aa-b76d3c2c5b9b',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'SLMONRM',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    'b74014cf-1d80-4074-97c0-024a422d24f9',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'SCHLT',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    'cbd8d434-f525-410b-9c3c-119b82a31813',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'SMITHRS',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '38105a68-c83d-44e5-af6e-9cfa40792118',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'SQMSHWHS',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '0f2cdcb7-c4ba-457d-adac-adde1d8c077a',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'TERRC',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '5128179c-f622-499b-b8e5-b39199081f22',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'VNDHF',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '1f4d9042-d6a5-46b6-a860-e1de7edb6add',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'VRNON',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '45abdc96-1b07-4b9c-8b05-e2b0c46c1d1d',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'VICTRA',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '9fc7327b-b206-4a5c-88f1-2875a456eb49',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'WLMSLK',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    'c3d8519c-73cb-48a1-8058-358883d5ef4f',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'nr-compliance-enforcement',
    '2025-09-08 23:27:33.265905',
    'COSHQ',
    'COS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '7a02e89a-74e6-44fa-b030-db1ab0be9eb6',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'NNIMO',
    'EPO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    'fc5eea4b-996b-47a5-91db-ebae8384a65f',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'VICTRA',
    'EPO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '28e5eb22-cdd4-423c-81c7-96911703a255',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'MSNSR',
    'EPO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    'aaf2f236-cd5f-436f-94f6-3fb6c69693bb',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'PNTCTN',
    'EPO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '0d1b9151-51b6-4857-993d-1af34f2ab79a',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'NLSON',
    'EPO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '73f2f0b1-e5ee-4c65-a7a6-7c18847cfb45',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'CRNBK',
    'EPO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    'fb6b6d64-18b4-4b16-82fc-5305eeeb46ba',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'KMLPS',
    'EPO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '2d642d0b-bcbd-4b15-8054-9846828b7ccd',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'WLMSLK',
    'EPO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    'a0981fec-5f23-48e6-8b58-23728f6ddd26',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'SMITHRS',
    'EPO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '1d5a7f50-c0d3-4bd9-bb68-db5477658a03',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'PRCG',
    'EPO'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '19b88b43-7df1-49a5-ab44-dbf116e89d27',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'PRTMCNL',
    'PARKS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    'bbff780d-01a8-4713-ac29-dffdfa71a95a',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'KMLPS',
    'PARKS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '2ab1f5ad-f307-4dfd-8050-6596b60388ae',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'WLMSLK',
    'PARKS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '72752882-0c31-4862-a272-d1df70acc72f',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'PNTCTN',
    'PARKS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '57db2985-f817-4faa-9dc8-91a0cb444c85',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'VRNON',
    'PARKS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '53d3bb21-ea81-4fb8-8f03-cded6e7404f5',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'NLSON',
    'PARKS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '0315efb6-e161-4bde-a74a-496c7db83b2d',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'CRNBK',
    'PARKS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '0303b0a8-0c36-4a37-8ff1-b04d6fad730f',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'SMITHRS',
    'PARKS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '474dbc09-98c0-4a3a-a35d-591397b48cb9',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'ATLIN',
    'PARKS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '0d484904-dc1a-480e-84b9-62ae2c49d56f',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'DSELK',
    'PARKS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '021ff877-d06e-4568-8bbb-f8f0ee487d47',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'PRCG',
    'PARKS'
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  office
VALUES
  (
    '4b358820-7ff1-43e1-b5e4-797a8c9f1d9c',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'postgres',
    '2025-09-08 23:27:33.265905',
    'FRTSTJN',
    'PARKS'
  ) ON CONFLICT DO NOTHING;

;

--------------------------------
-- Scatter our team throughout the province for testing
-- Note that this script runs after the seed data script (which runs in prod) and moves us out of COSH
-- back to the original office
--------------------------------
UPDATE app_user
SET
  office_guid = '79fe321b-7716-413f-b878-c5fd6100317d'
WHERE
  user_id = 'ENCETST1';

UPDATE app_user
SET
  office_guid = '79fe321b-7716-413f-b878-c5fd6100317d'
WHERE
  user_id = 'ADLAI';

UPDATE app_user
SET
  office_guid = '79fe321b-7716-413f-b878-c5fd6100317d'
WHERE
  user_id = 'DKORIN';

UPDATE app_user
SET
  office_guid = '3f474308-68da-450a-b1ab-fb8a5b7a27ce'
WHERE
  user_id = 'STRUONG';

UPDATE app_user
SET
  office_guid = '9fc7327b-b206-4a5c-88f1-2875a456eb49'
WHERE
  user_id = 'AWILCOX';

UPDATE app_user
SET
  office_guid = 'c8aeb3d9-3718-49d9-b8b5-6c84671546eb'
WHERE
  user_id = 'NBASKERV';

UPDATE app_user
SET
  office_guid = 'b494082e-35a3-468f-8955-4aa002066b36'
WHERE
  user_id = 'SKOT';

UPDATE app_user
SET
  office_guid = '313f4ec3-e88a-41c2-9956-78c7b18cb71d'
WHERE
  user_id = 'BFALK';

UPDATE app_user
SET
  office_guid = 'db343458-8eca-42c2-91ec-070b3e6de663'
WHERE
  user_id = 'TSPRADO';

UPDATE app_user
SET
  office_guid = '79fe321b-7716-413f-b878-c5fd6100317d'
WHERE
  user_id = 'GRLAVERY';

UPDATE app_user
SET
  office_guid = '4a5a94b1-bd47-4611-a577-861d97089903'
WHERE
  user_id = 'RRONDEAU';

UPDATE app_user
SET
  office_guid = '4a5a94b1-bd47-4611-a577-861d97089903'
WHERE
  user_id = 'MVESPRIN';

UPDATE app_user
SET
  office_guid = '4a5a94b1-bd47-4611-a577-861d97089903'
WHERE
  user_id = 'JGAMACHE';

-- set user VYates's office to Prince George
UPDATE app_user
SET
  office_guid = '3f474308-68da-450a-b1ab-fb8a5b7a27ce'
WHERE
  user_id = 'VYATES';

-- set user HOLSONs office to Vanderhoof
UPDATE app_user
SET
  office_guid = '5128179c-f622-499b-b8e5-b39199081f22'
WHERE
  user_id = 'HOLSON';

-- Assign Neil to Prince George
UPDATE app_user
SET
  office_guid = '3f474308-68da-450a-b1ab-fb8a5b7a27ce'
WHERE
  user_id = 'NBASKERV';

-- Reset offices to nr-compliance-enforcement values
UPDATE app_user
SET
  office_guid = 'cdd9964e-7878-44c1-b4a2-0290c6345dec'
WHERE
  office_guid = '914f8725-7100-4f56-a39b-1c18b0eccb55';

UPDATE app_user
SET
  office_guid = 'b494082e-35a3-468f-8955-4aa002066b36'
WHERE
  office_guid = '39e7ad0a-20b1-48b4-be70-dfcc5bc01c3c';

UPDATE app_user
SET
  office_guid = 'b494082e-35a3-468f-8955-4aa002066b36'
WHERE
  office_guid = '05633ab9-1502-4566-9364-4b3dac7c1354';

UPDATE app_user
SET
  office_guid = 'b494082e-35a3-468f-8955-4aa002066b36'
WHERE
  office_guid = '7da19946-4525-43ff-b4b6-d243a2addaaa';

UPDATE app_user
SET
  office_guid = 'b494082e-35a3-468f-8955-4aa002066b36'
WHERE
  office_guid = '4b3a8974-1975-4aaf-9e0a-2d3f5d217805';

--- Change Chris' Office to Kamloops to align with Unit tests
UPDATE app_user
SET
  office_guid = '3a070028-2c6f-4ea9-a548-271cf076280a'
WHERE
  user_id = 'CNESMITH';

-- CE-946 Add Auth Guids so people show up properly in assignment modals
UPDATE app_user
SET
  auth_user_guid = 'ef0bc810-58a7-4080-ad7a-b5bbdd0d2efe'
WHERE
  user_id = 'NBASKERV';

UPDATE app_user
SET
  auth_user_guid = '92a81ac4-d767-414f-a759-b0be2373a072'
WHERE
  user_id = 'HOLSON';

UPDATE app_user
SET
  auth_user_guid = 'e6c47d9c-39d2-48c1-a0c9-2c0fa309ac66'
WHERE
  user_id = 'VYATES';

UPDATE app_user
SET
  auth_user_guid = '382e7b5f-57c0-4a89-8836-7dbf8e2bc412'
WHERE
  user_id = 'AGUPTA';

UPDATE app_user
SET
  auth_user_guid = '6def8986-1b18-4205-8283-d6fd633b3eee'
WHERE
  user_id = 'BFALK';

UPDATE app_user
SET
  auth_user_guid = '91959e79-cafa-4b21-bfc6-60012d3e0790'
WHERE
  user_id = 'CNESMITH';

UPDATE app_user
SET
  auth_user_guid = '93a3dee6-6ee6-4f74-8539-69f122648ab1'
WHERE
  user_id = 'MSEARS';

UPDATE app_user
SET
  auth_user_guid = '287d4e72-8409-4dd1-991a-8b1117b8eb2a'
WHERE
  user_id = 'AWILCOX';

UPDATE app_user
SET
  auth_user_guid = '864f2a4a-135e-481c-bec6-2d58d966eb82'
WHERE
  user_id = 'TSPRADO';

UPDATE app_user
SET
  auth_user_guid = 'b4bb40f5-ee23-4c99-b63c-e741ce61b589'
WHERE
  user_id = 'JOCHARTR';

UPDATE app_user
SET
  auth_user_guid = '0a24b8a9-cb08-4ae2-8287-d5caa3d79007'
WHERE
  user_id = 'ADLAI';

UPDATE app_user
SET
  auth_user_guid = 'c3a081db-a974-449c-9947-8ac8522ba3af'
WHERE
  user_id = 'STRUONG';

UPDATE app_user
SET
  auth_user_guid = '87a1058f-97c0-4bd7-a07c-c31fe40a2230'
WHERE
  user_id = 'DVUIA';

UPDATE app_user
SET
  auth_user_guid = 'd072fbaa-8668-412c-8dc1-a19e19cb9622'
WHERE
  user_id = 'DKORIN';

UPDATE app_user
SET
  auth_user_guid = '9b20d8a3-2870-40e3-b8a2-ef76d5f77708'
WHERE
  user_id = 'SROSINSK';

UPDATE app_user
SET
  auth_user_guid = '0730050a-d985-4260-b1e2-fad8f6484ba1'
WHERE
  user_id = 'KNORBERG';

UPDATE app_user
SET
  auth_user_guid = 'fa4fc3b6-346c-401b-8a29-cd76a097e7b2'
WHERE
  user_id = 'SNORRIS';

UPDATE app_user
SET
  auth_user_guid = 'eb1ed21e-2da3-40fa-aa82-ae8e52a337ff'
WHERE
  user_id = 'TARWILLI';

UPDATE app_user
SET
  auth_user_guid = '07a5cdfa-ff86-4755-ad77-4a5d20c66bea'
WHERE
  user_id = 'CELDER';

UPDATE app_user
SET
  auth_user_guid = '0b524c8e-d202-44ae-a5a0-559930f3187e'
WHERE
  user_id = 'NSMIENK';

UPDATE app_user
SET
  auth_user_guid = 'eee4b016-7f48-43cb-bd22-325e91bc52c0'
WHERE
  user_id = 'MAWILSON';

UPDATE app_user
SET
  auth_user_guid = '7ecde23e-9142-4d9b-9e6b-f00b4a549a59'
WHERE
  user_id = 'MGEUZE';

UPDATE app_user
SET
  auth_user_guid = 'f97fcfac-8ff3-407a-be02-a1fac8dcd915'
WHERE
  user_id = 'HDUMAINE';

UPDATE app_user
SET
  auth_user_guid = 'c75021f9-0956-48cf-bde9-20927e56766c'
WHERE
  user_id = 'TBECK';

UPDATE app_user
SET
  auth_user_guid = 'e614ed75-e41b-4a5b-a1d8-c118db970ab8'
WHERE
  user_id = 'LGUGLIEL';

UPDATE app_user
SET
  auth_user_guid = 'c559a49f-1992-4641-b8a5-3302833d3a7e'
WHERE
  user_id = 'AEAGLES';

UPDATE app_user
SET
  auth_user_guid = 'fef9665c-35ee-4caa-88ff-05864f400115'
WHERE
  user_id = 'BCARUTH';

UPDATE app_user
SET
  auth_user_guid = '82e8d3b4-bad0-45e8-ad39-80d426ea781c'
WHERE
  user_id = 'JXDUNSDO';

UPDATE app_user
SET
  auth_user_guid = 'e3ae2a67-83f4-42de-b248-46f217321784'
WHERE
  user_id = 'GRLAVERY';

UPDATE app_user
SET
  auth_user_guid = 'd657346c-8be6-42cd-9864-120034167892'
WHERE
  user_id = 'MITO';

UPDATE app_user
SET
  auth_user_guid = '1432407d-f11b-419c-9c26-96259c0600e2'
WHERE
  user_id = 'JCLAUSEN';

UPDATE app_user
SET
  auth_user_guid = 'a2c7ef60-5ed1-42c2-8a74-6ac1606b4aec'
WHERE
  user_id = 'MCHAYER';

UPDATE app_user
SET
  auth_user_guid = '83fe7ae8-99ad-4153-a459-670c89a954be'
WHERE
  user_id = 'ELPEDERS';

UPDATE app_user
SET
  auth_user_guid = 'ba9f3a7f-9434-4ccb-a861-307622a2d339'
WHERE
  user_id = 'BEPARKER';

UPDATE app_user
SET
  auth_user_guid = 'e7d909cb-57c7-4e3d-b4fc-17a732111070'
WHERE
  user_id = 'JCLANCY';

UPDATE app_user
SET
  auth_user_guid = 'a5354b38-ab6a-4b5d-8046-5f4bd1bc3c4b'
WHERE
  user_id = 'EHARBICH';

UPDATE app_user
SET
  auth_user_guid = 'da2fe7e1-fb07-4679-9e2f-1b66df8e7e1b'
WHERE
  user_id = 'JDAMERT';

UPDATE app_user
SET
  auth_user_guid = '091e810a-c6ac-4754-b762-f10bbc4651e2'
WHERE
  user_id = 'RGROEGER';

UPDATE app_user
SET
  auth_user_guid = 'c7e86014-2cdd-4e87-9a85-efa280842a43'
WHERE
  user_id = 'KMAYOWSK';

UPDATE app_user
SET
  auth_user_guid = '303c6924-2540-4490-8581-70fddf8b3d70'
WHERE
  user_id = 'TYILDIRO';

---------------------
-- Assign users with no office or agency to EPO
---------------------
UPDATE app_user
SET
  agency_code_ref = 'EPO'
WHERE
  office_guid IS NULL
  AND agency_code_ref IS NULL;

-----------------------
-- Default users with a null agency to COS 
-- This really only affects the Dev environment as everyone in test has already been set
-- This may cause some odd display issues if this script conflicts with a role set in CSS
-- In the event of mismatch - just update the user in CSS to be the desired role
-----------------------
UPDATE app_user
SET
  agency_code_ref = 'COS'
WHERE
  agency_code_ref IS NULL;