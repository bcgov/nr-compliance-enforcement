---------------------------------
-- CE-1951 Add location attributes to investigations
-- Add location geometry point to investigation table
---------------------------------

ALTER TABLE investigation
ADD COLUMN location_geometry_point public.geometry;

CREATE INDEX idx_investigation_location_geometry_point
ON investigation
USING gist (location_geometry_point);

COMMENT ON COLUMN investigation.location_geometry_point IS 'The location of the investigation stored as a geometric point.';

ALTER TABLE investigation.investigation
ADD COLUMN location_address VARCHAR(120);

COMMENT ON COLUMN investigation.location_address IS 'Address of the investigation.';

ALTER TABLE investigation.investigation
ADD COLUMN location_description VARCHAR(4000);

COMMENT ON COLUMN investigation.location_description IS 'Description of the investigation location.';
