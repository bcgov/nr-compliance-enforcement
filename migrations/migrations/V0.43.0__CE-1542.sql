-- Add park_area_guid column to officer table
ALTER TABLE officer
ADD column "park_area_guid" UUID DEFAULT NULL;

comment on column officer.park_area_guid is 'System generated unique identifier for a park area.';