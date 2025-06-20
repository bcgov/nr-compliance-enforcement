-- Drop all existing park records due to changing the primary ID field of the import job from 'pk' to 'display_id' to match area spreadsheet ids.
TRUNCATE TABLE shared.park;
ALTER TABLE shared.park DROP COLUMN geo_organization_unit_code;

-- Create PARK_AREA table
CREATE TABLE shared.park_area (
    park_area_guid UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    region_name VARCHAR(256),
    create_user_id VARCHAR(32) NOT NULL,
    create_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    update_user_id VARCHAR(32),
    update_utc_timestamp TIMESTAMP,
    CONSTRAINT UK_park_area__name UNIQUE (name)
);

-- Table comments for PARK_AREA
COMMENT ON TABLE shared.park_area IS 'Stores areas that may contain parks, including their names and associated region.';

-- Column comments for PARK_AREA
COMMENT ON COLUMN shared.park_area.park_area_guid IS 'Primary key: System generated unique identifier for a park area.';
COMMENT ON COLUMN shared.park_area.name IS 'Name of the park area.';
COMMENT ON COLUMN shared.park_area.region_name IS 'Region name associated with the park area.';
COMMENT ON COLUMN shared.park_area.create_user_id IS 'The id of the user that created the park area.';
COMMENT ON COLUMN shared.park_area.create_utc_timestamp IS 'The timestamp when the park area was created. The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN shared.park_area.update_user_id IS 'The id of the user that updated the park area.';
COMMENT ON COLUMN shared.park_area.update_utc_timestamp IS 'The timestamp when the park area was updated. The timestamp is stored in UTC with no offset.';

-- Create PARK_AREA_XREF table
CREATE TABLE shared.park_area_xref (
    park_area_guid_xref UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    park_area_guid UUID NOT NULL,
    park_guid UUID NOT NULL,
    create_user_id VARCHAR(32) NOT NULL,
    create_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    update_user_id VARCHAR(32),
    update_utc_timestamp TIMESTAMP,
    CONSTRAINT UK_park_area_xref__park_guid__park_area_guid UNIQUE (park_area_guid, park_guid),
    CONSTRAINT fk_park_area_xref__park FOREIGN KEY (park_area_guid) REFERENCES shared.park_area(park_area_guid),
    CONSTRAINT fk_park_area_xref__park_area FOREIGN KEY (park_guid) REFERENCES shared.park(park_guid)
);

-- Table comments for PARK_AREA_XREF
COMMENT ON TABLE shared.park_area_xref IS 'Stores mapping between park areas and parks.';

-- Column comments for PARK_AREA_XREF
COMMENT ON COLUMN shared.park_area_xref.park_area_guid_xref IS 'Primary key: System generated unique identifier for a park area xref.';
COMMENT ON COLUMN shared.park_area_xref.park_area_guid IS 'Foreign key: References the park area that the xref belongs to.';
COMMENT ON COLUMN shared.park_area_xref.park_guid IS 'Foreign key: References the park that the xref belongs to.';
COMMENT ON COLUMN shared.park_area_xref.create_user_id IS 'The id of the user that created the park area xref.';
COMMENT ON COLUMN shared.park_area_xref.create_utc_timestamp IS 'The timestamp when the park area xref was created. The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN shared.park_area_xref.update_user_id IS 'The id of the user that updated the park area xref.';
COMMENT ON COLUMN shared.park_area_xref.update_utc_timestamp IS 'The timestamp when the park area xref was updated. The timestamp is stored in UTC with no offset.';

-- Create PARK_AREA_MAPPING table
CREATE TABLE shared.park_area_mapping (
    park_area_mapping_guid UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    park_area_guid UUID NOT NULL,
    external_id VARCHAR(32) NOT NULL,
    create_user_id VARCHAR(32) NOT NULL,
    create_utc_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    update_user_id VARCHAR(32),
    update_utc_timestamp TIMESTAMP,
    CONSTRAINT UK_park_area_mapping__park_area_guid__external_id UNIQUE (park_area_guid, external_id)
);

-- Table comments for PARK_AREA_MAPPING
COMMENT ON TABLE shared.park_area_mapping IS 'Stores mapping between park areas and their identifiers based on a mapping spreadsheet. This data exists before parks are imported, so it is only loosly related to the park table through external_id.';

-- Column comments for PARK_AREA_MAPPING
COMMENT ON COLUMN shared.park_area_mapping.park_area_mapping_guid IS 'Primary key: System generated unique identifier for a park area mapping.';
COMMENT ON COLUMN shared.park_area_mapping.park_area_guid IS 'Foreign key: References the park area that the mapping belongs to.';
COMMENT ON COLUMN shared.park_area_mapping.external_id IS 'External identifier for the park area mapping.';
COMMENT ON COLUMN shared.park_area.create_user_id IS 'The id of the user that created the park area.';
COMMENT ON COLUMN shared.park_area.create_utc_timestamp IS 'The timestamp when the park area was created. The timestamp is stored in UTC with no offset.';
COMMENT ON COLUMN shared.park_area.update_user_id IS 'The id of the user that updated the park area.';
COMMENT ON COLUMN shared.park_area.update_utc_timestamp IS 'The timestamp when the park area was updated. The timestamp is stored in UTC with no offset.';


-- Initial insert of park areas
INSERT INTO shared.park_area
        (name,
         region_name,
         create_user_id,
         create_utc_timestamp,
         update_user_id,
         update_utc_timestamp)
VALUES
        -- WC South Island
        ('South Gulf Islands',     'WC South Island', user, now(), user, now()),
        ('Cowichan',               'WC South Island', user, now(), user, now()),
        ('Juan de Fuca',           'WC South Island', user, now(), user, now()),

        -- WC Mid Vancouver Island-HG Area
        ('Arrowsmith',             'WC Mid Vancouver Island-HG Area', user, now(), user, now()),
        ('Clayoquot',              'WC Mid Vancouver Island-HG Area', user, now(), user, now()),
        ('Haida Gwaii',            'WC Mid Vancouver Island-HG Area', user, now(), user, now()),
        ('Von Donop',              'WC Mid Vancouver Island-HG Area', user, now(), user, now()),

        -- WC North Island-SCC Area
        ('Strathcona',             'WC North Island-SCC Area', user, now(), user, now()),
        ('Nootka',                 'WC North Island-SCC Area', user, now(), user, now()),
        ('Cape Scott',             'WC North Island-SCC Area', user, now(), user, now()),
        ('South Central Coast',    'WC North Island-SCC Area', user, now(), user, now()),
        ('Miracle Beach',          'WC North Island-SCC Area', user, now(), user, now()),

        -- SC Lower Mainland
        ('North Fraser Area',      'SC Lower Mainland', user, now(), user, now()),
        ('South Fraser Area',      'SC Lower Mainland', user, now(), user, now()),
        ('Vancouver Area',         'SC Lower Mainland', user, now(), user, now()),
        ('Howe Sound Area',        'SC Lower Mainland', user, now(), user, now()),

        -- SC Sea to Sky
        ('Sunshine Coast',         'SC Sea to Sky', user, now(), user, now()),
        ('Pemberton',              'SC Sea to Sky', user, now(), user, now()),
        ('Squamish',               'SC Sea to Sky', user, now(), user, now()),
        ('Garibaldi South',        'SC Sea to Sky', user, now(), user, now()),

        -- Cariboo-Chilcotin Coast
        ('South Chilcotin',        'Cariboo-Chilcotin Coast', user, now(), user, now()),
        ('Bowron',                 'Cariboo-Chilcotin Coast', user, now(), user, now()),
        ('Northern Forests',       'Cariboo-Chilcotin Coast', user, now(), user, now()),
        ('North Chilcotin',        'Cariboo-Chilcotin Coast', user, now(), user, now()),
        ('Central Coast',          'Cariboo-Chilcotin Coast', user, now(), user, now()),
        ('Bella Coola',            'Cariboo-Chilcotin Coast', user, now(), user, now()),

        -- Thompson
        ('Southern Rivers',        'Thompson', user, now(), user, now()),
        ('Grasslands',             'Thompson', user, now(), user, now()),
        ('Western Mountains',      'Thompson', user, now(), user, now()),
        ('Eastern Lakes',          'Thompson', user, now(), user, now()),

        -- Kootenay Region
        ('Arrow',                  'Kootenay Region', user, now(), user, now()),
        ('East Kootenay South',    'Kootenay Region', user, now(), user, now()),
        ('Kootenay Lake',          'Kootenay Region', user, now(), user, now()),
        ('East Kootenay North',    'Kootenay Region', user, now(), user, now()),

        -- Okanagan
        ('East Okanagan',          'Okanagan', user, now(), user, now()),
        ('North Okanagan',         'Okanagan', user, now(), user, now()),
        ('South Okanagan',         'Okanagan', user, now(), user, now()),
        ('West Okanagan',          'Okanagan', user, now(), user, now()),

        -- Skeena East
        ('Babine',                 'Skeena East', user, now(), user, now()),
        ('Tweedsmuir North',       'Skeena East', user, now(), user, now()),
        ('Stikine',                'Skeena East', user, now(), user, now()),
        ('Atlin/Tatshenshini',     'Skeena East', user, now(), user, now()),

        -- Skeena West
        ('Lakelse-Douglas Channel','Skeena West', user, now(), user, now()),
        ('Skeena-Nass',            'Skeena West', user, now(), user, now()),
        ('North Coast',            'Skeena West', user, now(), user, now()),

        -- Omineca
        ('Omineca',                'Omineca', user, now(), user, now()),
        ('Robson',                 'Omineca', user, now(), user, now()),
        ('Upper Fraser',           'Omineca', user, now(), user, now()),

        -- Peace
        ('Liard',                  'Peace', user, now(), user, now()),
        ('Peace',                  'Peace', user, now(), user, now())

ON CONFLICT DO NOTHING;


-- Initial load of park area mappings

-- Cariboo-Chilcotin Coast - BELLA COOLA
WITH codes AS (
    SELECT unnest(ARRAY['0006', '0019', '1067', '1124', '1027', '1030', '1032', '1044', '1108', '1074', '1040', '1046', '1054', '1033']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Cariboo-Chilcotin Coast'
  AND  pa.name ILIKE 'BELLA COOLA'
ON CONFLICT DO NOTHING;


-- Cariboo-Chilcotin Coast - BOWRON
WITH codes AS (
    SELECT unnest(ARRAY['0582', '0129', '9622', '0170', '9679', '0060', '0587', '4275', '7458', '0211', '0302', '0136', '0592', '0032', '3070']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Cariboo-Chilcotin Coast'
  AND  pa.name ILIKE 'BOWRON'
ON CONFLICT DO NOTHING;


-- Cariboo-Chilcotin Coast - CENTRAL COAST
WITH codes AS (
    SELECT unnest(ARRAY['0396', '0394', '0344', '0393', '0395', '0389', '1005', '1029', '1034', '1073', '1035', '1036', '1037', '0343', '1042', '1043', '0547', '1045', '1013', '1016', '1020', '1050', '1051', '1056', '1052', '1053', '0549', '1055', '1057', '1071', '1019', '1060', '1061', '1063', '1048', '1066', '3103', '3023']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Cariboo-Chilcotin Coast'
  AND  pa.name ILIKE 'CENTRAL COAST'
ON CONFLICT DO NOTHING;


-- Cariboo-Chilcotin Coast - NORTH CHILCOTIN
WITH codes AS (
    SELECT unnest(ARRAY['0398', '0585', '0588', '9456', '9489', '7668', '1084', '0590', '1087', '0409', '224', '9481', '3055', '3101', '3064', '3053', '3035']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Cariboo-Chilcotin Coast'
  AND  pa.name ILIKE 'NORTH CHILCOTIN'
ON CONFLICT DO NOTHING;


-- Cariboo-Chilcotin Coast - NORTHERN FORESTS
WITH codes AS (
    SELECT unnest(ARRAY['9713', '9714', '9716', '6818', '9722', '9728', '9729', '9732', '9731', '0195', '9733', '9735', '9698', '0024', '9740']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Cariboo-Chilcotin Coast'
  AND  pa.name ILIKE 'NORTHERN FORESTS'
ON CONFLICT DO NOTHING;


-- Cariboo-Chilcotin Coast - SOUTH CHILCOTIN
WITH codes AS (
    SELECT unnest(ARRAY['0583', '0213', '9563', '0057', '0059', '0135', '0026', '0628', '0629', '0586', '0217', '9557', '9682', '0625', '0273', '0268', '9482', '0068', '0589', '9485', '9480', '0591', '0584', '0111', '9483', '9590', '3127', '3065']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Cariboo-Chilcotin Coast'
  AND  pa.name ILIKE 'SOUTH CHILCOTIN'
ON CONFLICT DO NOTHING;


-- Kootenay Region - ARROW
WITH codes AS (
    SELECT unnest(ARRAY['0308', '0323', '0051', '9553', '0010', '0017', '0404', '0324', '0232', '0110', '0156', '0202', '0327', '9960', '3032', '3031']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Kootenay Region'
  AND  pa.name ILIKE 'ARROW'
ON CONFLICT DO NOTHING;


-- Kootenay Region - EAST KOOTENAY NORTH
WITH codes AS (
    SELECT unnest(ARRAY['0206', '0172', '0362', '9681', '0061', '0034', '0293', '0130', '0005', '0098', '0025', '0114', '0247', '0053', '0287', '7211', '4984', '3020', '3056', '3019', '3026']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Kootenay Region'
  AND  pa.name ILIKE 'EAST KOOTENAY NORTH'
ON CONFLICT DO NOTHING;


-- Kootenay Region - EAST KOOTENAY SOUTH
WITH codes AS (
    SELECT unnest(ARRAY['0338', '0120', '0102', '0253', '0121', '9680', '9185', '0065', '0235', '0144', '0105', '0108', '9434', '0112', '0256', '0282', '0079', '9773', '3104']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Kootenay Region'
  AND  pa.name ILIKE 'EAST KOOTENAY SOUTH'
ON CONFLICT DO NOTHING;


-- Kootenay Region - KOOTENAY LAKE
WITH codes AS (
    SELECT unnest(ARRAY['0169', '0185', '0216', '0174', '0311', '9551', '0052', '0004', '0357', '0012', '9550', '0163', '9435', '0164', '9552']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Kootenay Region'
  AND  pa.name ILIKE 'KOOTENAY LAKE'
ON CONFLICT DO NOTHING;


-- Okanagan - EAST OKANAGAN
WITH codes AS (
    SELECT unnest(ARRAY['0527', '0056', '0456', '0225', '0244', '0528', '9549', '9548', '0442', '0319', '0066', '0236', '0446', '0259', '0153', '9711', '0440', '5024', '0471', '3034', '3051', '3006', '3005']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Okanagan'
  AND  pa.name ILIKE 'EAST OKANAGAN'
ON CONFLICT DO NOTHING;


-- Okanagan - NORTH OKANAGAN
WITH codes AS (
    SELECT unnest(ARRAY['4104', '0086', '0139', '8697', '0277', '0378', '0453', '0241', '0020', '0468', '0143', '0445', '9335', '0027', '0463', '0467', '6610', '9518', '3077', '3108', '3049', '3042', '3043', '3061', '3030']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Okanagan'
  AND  pa.name ILIKE 'NORTH OKANAGAN'
ON CONFLICT DO NOTHING;


-- Okanagan - SOUTH OKANAGAN
WITH codes AS (
    SELECT unnest(ARRAY['0307', '0035', '0201', '9213', '0142', '0064', '0218', '0073', '0054', '0474', '0272', '0462', '0204', '6547', '0077', '9587', '5018', '0464', '6624', '3033', '3100', '3130', '3007']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Okanagan'
  AND  pa.name ILIKE 'SOUTH OKANAGAN'
ON CONFLICT DO NOTHING;


-- Okanagan - WEST OKANAGAN
WITH codes AS (
    SELECT unnest(ARRAY['0119', '0058', '0199', '0033', '0011', '0022', '0146', '0076', '4982', '0598', '0448', '3027']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Okanagan'
  AND  pa.name ILIKE 'WEST OKANAGAN'
ON CONFLICT DO NOTHING;


-- Omineca - OMINECA
WITH codes AS (
    SELECT unnest(ARRAY['0055', '0251', '0435', '0177', '9597', '0436', '0437', '9808', '9809', '9810', '9864', '0518', '9812', '0234', '9793', '0370', '9658', '0230', '0406', '9118', '0317', '0078', '9796', '5027', '3071', '3087', '3036', '3085', '3091', '3041', '3038']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Omineca'
  AND  pa.name ILIKE 'OMINECA'
ON CONFLICT DO NOTHING;


-- Omineca - ROBSON
WITH codes AS (
    SELECT unnest(ARRAY['0415', '0416', '9802', '0002', '0325', '9034', '0385', '0425', '4214', '0422', '9461', '4983', '9794', '9801', '9805', '0509', '5043', '5029', '9821', '5037', '3084', '3082', '3039']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Omineca'
  AND  pa.name ILIKE 'ROBSON'
ON CONFLICT DO NOTHING;


-- Omineca - UPPER FRASER
WITH codes AS (
    SELECT unnest(ARRAY['9453', '3931', '0115', '9855', '0318', '0355', '9792', '9780', '8053', '9795', '8796', '0345', '0229', '9815', '0305', '9953', '9779', '5044', '5031', '3086', '3079', '3060', '3134', '3078', '3072']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Omineca'
  AND  pa.name ILIKE 'UPPER FRASER'
ON CONFLICT DO NOTHING;


-- Peace - LIARD
WITH codes AS (
    SELECT unnest(ARRAY['9828', '8297', '0426', '9797', '9829', '9820', '254', '8969', '0092', '5034', '0328', '0093', '0341', '8288', '0280', '8299', '9830', '9843', '8277', '0094', '8284', '4985', '5015', '9790', '4041', '9799', '9803', '8330', '5022', '5023', '5026', '5028', '9819', '5035', '3062', '8325', '8312', '8291', '3047', '4232', '3046', '3080']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Peace'
  AND  pa.name ILIKE 'LIARD'
ON CONFLICT DO NOTHING;


-- Peace - PEACE
WITH codes AS (
    SELECT unnest(ARRAY['9783', '0014', '8094', '9785', '0214', '9786', '0161', '0326', '0222', '9800', '0140', '8097', '0421', '9806', '0181', '0315', '0289', '9633', '9510', '4351', '9813', '9842', '0316', '0016', '0286', '8109', '4981', '9958', '521', '8306', '3050', '3107', '3008', '8123', '9955']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Peace'
  AND  pa.name ILIKE 'PEACE'
ON CONFLICT DO NOTHING;


-- SC Lower Mainland - HOWE SOUND AREA
WITH codes AS (
    SELECT unnest(ARRAY['0049', '0278', '0365', '0116', '9508', '0314', '3048']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'SC Lower Mainland'
  AND  pa.name ILIKE 'HOWE SOUND AREA'
ON CONFLICT DO NOTHING;


-- SC Lower Mainland - NORTH FRASER AREA
WITH codes AS (
    SELECT unnest(ARRAY['0330', '0150', '0081', '0008', '0245', '9824', '6998', '0122', '0200', '5025', '0555', '3076', '3131']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'SC Lower Mainland'
  AND  pa.name ILIKE 'NORTH FRASER AREA'
ON CONFLICT DO NOTHING;


-- SC Lower Mainland - SOUTH FRASER AREA
WITH codes AS (
    SELECT unnest(ARRAY['0166', '0258', '0124', '0335', '0336', '0351', '0041', '0151', '0290', '0072', '0158', '0261', '3098', '3116', '9841', '3089']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'SC Lower Mainland'
  AND  pa.name ILIKE 'SOUTH FRASER AREA'
ON CONFLICT DO NOTHING;


-- SC Lower Mainland - VANCOUVER AREA
WITH codes AS (
    SELECT unnest(ARRAY['9509', '0015', '0023', '9508']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'SC Lower Mainland'
  AND  pa.name ILIKE 'VANCOUVER AREA'
ON CONFLICT DO NOTHING;


-- SC Sea to Sky - GARIBALDI SOUTH
WITH codes AS (
    SELECT unnest(ARRAY['0007', '0090']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'SC Sea to Sky'
  AND  pa.name ILIKE 'GARIBALDI SOUTH'
ON CONFLICT DO NOTHING;


-- SC Sea to Sky - PEMBERTON
WITH codes AS (
    SELECT unnest(ARRAY['0152', '9565', '0381', '0402', '0007', '0363', '0179', '9556', '0561', '0552', '0557', '0546', '0553', '0558']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'SC Sea to Sky'
  AND  pa.name ILIKE 'PEMBERTON'
ON CONFLICT DO NOTHING;


-- SC Sea to Sky - SQUAMISH
WITH codes AS (
    SELECT unnest(ARRAY['0414', '0242', '9451', '9768', '0141', '0331', '6328', '9764', '0616', '0545', '0554', '556', '3069']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'SC Sea to Sky'
  AND  pa.name ILIKE 'SQUAMISH'
ON CONFLICT DO NOTHING;


-- SC Sea to Sky - SUNSHINE COAST
WITH codes AS (
    SELECT unnest(ARRAY['6301', '0372', '0228', '0252', '0469', '0203', '0388', '0392', '9825', '6197', '6268', '9761', '9765', '0294', '0221', '0173', '0040', '0373', '0145', '0379', '0303', '9763', '9544', '0375', '9460', '0376', '9762', '3028', '3002', '0475']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'SC Sea to Sky'
  AND  pa.name ILIKE 'SUNSHINE COAST'
ON CONFLICT DO NOTHING;


-- Skeena East - ATLIN/TATSHENSHINI
WITH codes AS (
    SELECT unnest(ARRAY['0246', '0178', '0159', '0266', '0410', '1081', '1083', '1077', '525', '523', '593', '9522', '1080', '9123', '1079', '568', '3058', '3102']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Skeena East'
  AND  pa.name ILIKE 'ATLIN/TATSHENSHINI'
ON CONFLICT DO NOTHING;


-- Skeena East - BABINE
WITH codes AS (
    SELECT unnest(ARRAY['0530', '0400', '0329', '5038', '9584', '9851', '9571', '0532', '9847', '0192', '9848', '8509', '9849', '0263', '0074', '9822', '0084', '0533', '9604', '5032', '9846', '4448', '0477', '3073']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Skeena East'
  AND  pa.name ILIKE 'BABINE'
ON CONFLICT DO NOTHING;


-- Skeena East - STIKINE
WITH codes AS (
    SELECT unnest(ARRAY['0427', '0428', '0431', '0432', '0356', '8642', '0238', '0433', '0470', '0279', '0347', '0257', '0434', '0438', '0429', '0430', '8645', '9957', '3057', '3068', '3059']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Skeena East'
  AND  pa.name ILIKE 'STIKINE'
ON CONFLICT DO NOTHING;


-- Skeena East - TWEEDSMUIR NORTH
WITH codes AS (
    SELECT unnest(ARRAY['0531', '0400', '8555', '0013', '9781', '0047', '9778', '0380', '0535', '0536', '0534', '0537', '0288', '9777', '0160', '0019', '9866', '0320', '5020', '5033', '5036', '0543', '0541', '0544', '0539', '0542', '0538', '0540', '3081']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Skeena East'
  AND  pa.name ILIKE 'TWEEDSMUIR NORTH'
ON CONFLICT DO NOTHING;


-- Skeena West - LAKELSE-DOUGLAS CHANNEL
WITH codes AS (
    SELECT unnest(ARRAY['0482', '0483', '0484', '0485', '8350', '4382', '0067', '0070', '8966', '0405', '0488', '0489', '9601', '0407', '8379', '0481', '5040', '8345', '0492', '1094', '1003', '1125', '1007', '1092', '1091', '9457', '1118', '1014', '1017', '1001', '1012', '1105', '1123', '1006', '1009', '1116', '1010', '1018', '1015', '1110', '1111', '1113', '3025', '3114']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Skeena West'
  AND  pa.name ILIKE 'LAKELSE-DOUGLAS CHANNEL'
ON CONFLICT DO NOTHING;


-- Skeena West - NORTH COAST
WITH codes AS (
    SELECT unnest(ARRAY['0299', '0397', '0401', '0403', '0162', '1002', '1122', '1095', '1089', '1011', '1096', '1097', '1100', '1078', '1093', '1099', '1114', '1101', '1022', '1102', '1103', '1004', '1090', '1104', '1106', '1109', '1112', '1115', '1119', '1120', '1117', '1121', '3133']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Skeena West'
  AND  pa.name ILIKE 'NORTH COAST'
ON CONFLICT DO NOTHING;


-- Skeena West - SKEENA-NASS
WITH codes AS (
    SELECT unnest(ARRAY['386', '8814', '0062', '0340', '0038', '9782', '0486', '0358', '8741', '9077', '0490', '5039', '5041', '0491', '0487', '1088', '0577', '3932', '5030', '0596', '1098', '3115', '3063']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Skeena West'
  AND  pa.name ILIKE 'SKEENA-NASS'
ON CONFLICT DO NOTHING;


-- Thompson - EASTERN LAKES
WITH codes AS (
    SELECT unnest(ARRAY['0361', '6648', '9582', '0085', '0551', '0457', '0276', '9693', '0447', '0281', '0089', '0300', '0212', '0449', '0123', '0167', '0080']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Thompson'
  AND  pa.name ILIKE 'EASTERN LAKES'
ON CONFLICT DO NOTHING;


-- Thompson - GRASSLANDS
WITH codes AS (
    SELECT unnest(ARRAY['9755', '6860', '9719', '9720', '9691', '9687', '9726', '0071', '0275', '9731', '0127', '9710', '9383', '9695', '9218', '6892', '9696', '9715', '9596', '4433', '3110', '3029']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Thompson'
  AND  pa.name ILIKE 'GRASSLANDS'
ON CONFLICT DO NOTHING;


-- Thompson - SOUTHERN RIVERS
WITH codes AS (
    SELECT unnest(ARRAY['9712', '6900', '0334', '9688', '6987', '0063', '9723', '0306', '0069', '6865', '0046', '9694', '0075', '6878', '0353', '3092', '3088', '3003', '9458']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Thompson'
  AND  pa.name ILIKE 'SOUTHERN RIVERS'
ON CONFLICT DO NOTHING;


-- Thompson - WESTERN MOUNTAINS
WITH codes AS (
    SELECT unnest(ARRAY['9689', '9567', '0623', '9717', '9690', '0624', '9721', '0626', '0369', '0082', '0183', '9727', '9734', '0233', '9066', '0408', '9738', '9739', '0627', '9736', '0500']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'Thompson'
  AND  pa.name ILIKE 'WESTERN MOUNTAINS'
ON CONFLICT DO NOTHING;


-- WC Mid Vancouver Island-HG Area - ARROWSMITH
WITH codes AS (
    SELECT unnest(ARRAY['0186', '0226', '0029', '0118', '0635', '0310', '0030', '0039', '0231', '0133', '0043', '0193', '0301', '0366', '3117', '9743', '4455', '4471']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'WC Mid Vancouver Island-HG Area'
  AND  pa.name ILIKE 'ARROWSMITH'
ON CONFLICT DO NOTHING;


-- WC Mid Vancouver Island-HG Area - CLAYOQUOT
WITH codes AS (
    SELECT unnest(ARRAY['9502', '9507', '9500', '9499', '9497', '0269', '0196', '9493', '9494', '9504', '9503', '0050', '0182', '0031', '9540', '9495', '9501', '0296', '9498', '5042', '0517', '3024', '3001', '3105', '3090']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'WC Mid Vancouver Island-HG Area'
  AND  pa.name ILIKE 'CLAYOQUOT'
ON CONFLICT DO NOTHING;


-- WC Mid Vancouver Island-HG Area - HAIDA GWAII
WITH codes AS (
    SELECT unnest(ARRAY['0255', '0321', '0562', '0569', '0559', '0563', '0564', '0566', '0567', '0570', '0571', '0572', '0560', '3052', '3093', '3010', '3009', '3045']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'WC Mid Vancouver Island-HG Area'
  AND  pa.name ILIKE 'HAIDA GWAII'
ON CONFLICT DO NOTHING;


-- WC Mid Vancouver Island-HG Area - VON DONOP
WITH codes AS (
    SELECT unnest(ARRAY['0371', '0633', '0048', '0187', '0292', '0632', '0634', '9870']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'WC Mid Vancouver Island-HG Area'
  AND  pa.name ILIKE 'VON DONOP'
ON CONFLICT DO NOTHING;


-- WC North Island-SCC Area - CAPE SCOTT
WITH codes AS (
    SELECT unnest(ARRAY['0250', '9469', '8774', '0450', '9747', '9466', '0472', '9465', '9532', '9464', '0377', '0283', '2115', '3013', '3012', '3126', '9744', '3123', '3125', '3118', '3011', '3122', '3124']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'WC North Island-SCC Area'
  AND  pa.name ILIKE 'CAPE SCOTT'
ON CONFLICT DO NOTHING;


-- WC North Island-SCC Area - MIRACLE BEACH
WITH codes AS (
    SELECT unnest(ARRAY['0411', '9512', '6093', '0264', '0045', '0131', '0265', '9750', '0109', '9767', '9476', '9506', '0412', '9754', '0243', '0367', '9751', '3004']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'WC North Island-SCC Area'
  AND  pa.name ILIKE 'MIRACLE BEACH'
ON CONFLICT DO NOTHING;


-- WC North Island-SCC Area - NOOTKA
WITH codes AS (
    SELECT unnest(ARRAY['9745', '8779', '9209', '0339', '8778', '9147', '0028', '9746', '0189', '0190', '9749', '0374', '6111', '9459', '9752', '8782', '9753', '0631', '0511', '3109', '3075', '3129', '3014', '3119']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'WC North Island-SCC Area'
  AND  pa.name ILIKE 'NOOTKA'
ON CONFLICT DO NOTHING;


-- WC North Island-SCC Area - SOUTH CENTRAL COAST
WITH codes AS (
    SELECT unnest(ARRAY['0520', '0391', '0390', '0223', '0215', '1086', '1024', '1025', '1026', '1023', '1028', '1031', '1065', '1008', '1049', '1068', '1038', '1039', '1041', '1000', '1075', '1058', '1059', '1062', '1021', '1064', '1069', '1070', '1072', '3120', '3040', '3111']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'WC North Island-SCC Area'
  AND  pa.name ILIKE 'SOUTH CENTRAL COAST'
ON CONFLICT DO NOTHING;


-- WC North Island-SCC Area - STRATHCONA
WITH codes AS (
    SELECT unnest(ARRAY['0220', '0087', '0313', '0001', '0348', '0188', '0036', '0180', '4337', '6081']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'WC North Island-SCC Area'
  AND  pa.name ILIKE 'STRATHCONA'
ON CONFLICT DO NOTHING;


-- WC South Island - COWICHAN
WITH codes AS (
    SELECT unnest(ARRAY['0117', '0383', '0113', '6161', '0210', '9229', '9959', '9474', '0003', '0106', '0037', '9748', '0154', '0295', '0137', '3113', '4460', '3112', '3054']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'WC South Island'
  AND  pa.name ILIKE 'COWICHAN'
ON CONFLICT DO NOTHING;


-- WC South Island - JUAN de FUCA
WITH codes AS (
    SELECT unnest(ARRAY['0262', '0096', '9398', '0240', '0009', '3097', '4361', '3083', '3066']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'WC South Island'
  AND  pa.name ILIKE 'JUAN de FUCA'
ON CONFLICT DO NOTHING;


-- WC South Island - SOUTH GULF ISLANDS
WITH codes AS (
    SELECT unnest(ARRAY['0165', '9554', '9868', '9869', '0384', '0237', '0104', '0529', '0021', '0198', '0267', '9867', '0382', '0322', '0044', '0155', '3017', '3128', '3037', '3016', '3094', '3018', '3067', '3132']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.region_name = 'WC South Island'
  AND  pa.name ILIKE 'SOUTH GULF ISLANDS'
ON CONFLICT DO NOTHING;

