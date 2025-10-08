---------------------------------
-- CE-1951 Add location attributes to investigations
-- Add location geometry point to investigation table
---------------------------------
ALTER TABLE investigation.investigation
ADD COLUMN location_geometry_point public.geometry;

CREATE INDEX idx_investigation_location_geometry_point
ON investigation.investigation
USING gist (location_geometry_point);

COMMENT ON COLUMN investigation.investigation.location_geometry_point IS 'The location of the investigation stored as a geometric point.';