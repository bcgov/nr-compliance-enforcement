-- Arrow
WITH codes AS (
    SELECT unnest(ARRAY['0010']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'Arrow'
ON CONFLICT DO NOTHING;


-- Atlin/Tatshenshini
WITH codes AS (
    SELECT unnest(ARRAY['0523', '0525', '0568', '0593']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'Atlin/Tatshenshini'
ON CONFLICT DO NOTHING;


-- Babine
WITH codes AS (
    SELECT unnest(ARRAY['400-1', '400-2', '400-3', '400-4', '400-5', '400-6', '406-1']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'Babine'
ON CONFLICT DO NOTHING;


-- Bowron
WITH codes AS (
    SELECT unnest(ARRAY['4276']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'Bowron'
ON CONFLICT DO NOTHING;


-- Cape Scott
WITH codes AS (
    SELECT unnest(ARRAY['9471']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'Cape Scott'
ON CONFLICT DO NOTHING;


-- Clayoquot
WITH codes AS (
    SELECT unnest(ARRAY['9964', '9965', '9966', '9967', '9968', '9970', '9971', '9972']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'Clayoquot'
ON CONFLICT DO NOTHING;


-- Grasslands
WITH codes AS (
    SELECT unnest(ARRAY['9730']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'Grasslands'
ON CONFLICT DO NOTHING;


-- Haida Gwaii
WITH codes AS (
    SELECT unnest(ARRAY['9969']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'Haida Gwaii'
ON CONFLICT DO NOTHING;


-- Kootenay Lake
WITH codes AS (
    SELECT unnest(ARRAY['357-1', '357-2', '357-3', '357-4', '357-5']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'Kootenay Lake'
ON CONFLICT DO NOTHING;


-- Liard
WITH codes AS (
    SELECT unnest(ARRAY['0254']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'Liard'
ON CONFLICT DO NOTHING;


-- Miracle Beach
WITH codes AS (
    SELECT unnest(ARRAY['0597']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'Miracle Beach'
ON CONFLICT DO NOTHING;


-- North Chilcotin
WITH codes AS (
    SELECT unnest(ARRAY['0224', '0524']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'North Chilcotin'
ON CONFLICT DO NOTHING;


-- North Fraser Area
WITH codes AS (
    SELECT unnest(ARRAY['3099', '9769']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'North Fraser Area'
ON CONFLICT DO NOTHING;


-- Northern Forests
WITH codes AS (
    SELECT unnest(ARRAY['3875']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'Northern Forests'
ON CONFLICT DO NOTHING;


-- Omineca
WITH codes AS (
    SELECT unnest(ARRAY['406-2', '406-3', '9658-1', '9658-2', '9658-3']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'Omineca'
ON CONFLICT DO NOTHING;


-- Peace
WITH codes AS (
    SELECT unnest(ARRAY['0521', '9956']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'Peace'
ON CONFLICT DO NOTHING;


-- South Chilcotin
WITH codes AS (
    SELECT unnest(ARRAY['273-1', '273-10', '273-2', '273-3', '273-4', '273-5', '273-6', '273-7', '273-8', '273-9']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'South Chilcotin'
ON CONFLICT DO NOTHING;


-- South Fraser Area
WITH codes AS (
    SELECT unnest(ARRAY['3021', '3022', '3106']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'South Fraser Area'
ON CONFLICT DO NOTHING;


-- South Okanagan
WITH codes AS (
    SELECT unnest(ARRAY['0073', '5019']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'South Okanagan'
ON CONFLICT DO NOTHING;


-- Squamish
WITH codes AS (
    SELECT unnest(ARRAY['0556']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'Squamish'
ON CONFLICT DO NOTHING;


-- Strathcona
WITH codes AS (
    SELECT unnest(ARRAY['0001']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'Strathcona'
ON CONFLICT DO NOTHING;


-- Sunshine Coast
WITH codes AS (
    SELECT unnest(ARRAY['0227', '303-1', '303-2', '303-4', '303-5', '303-6', '303-8', '0333', '0095']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'Sunshine Coast'
ON CONFLICT DO NOTHING;


-- Tweedsmuir North
WITH codes AS (
    SELECT unnest(ARRAY['0018']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'Tweedsmuir North'
ON CONFLICT DO NOTHING;


-- North Coast
WITH codes AS (
    SELECT unnest(ARRAY['486-1','486-2','9601-1','9601-2']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'North Coast'
ON CONFLICT DO NOTHING;


-- Skeena-Nass
WITH codes AS (
    SELECT unnest(ARRAY['0386']) AS external_id
)
INSERT INTO shared.park_area_mapping
        (park_area_guid, external_id, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
SELECT pa.park_area_guid, codes.external_id, user, now(), user, now()
FROM   shared.park_area pa
CROSS JOIN codes
WHERE  pa.name ILIKE 'Skeena-Nass'
ON CONFLICT DO NOTHING;
