---------------------------------
-- CE-1952 Add location attributes to inspections
-- Add location geometry point to inspection table
---------------------------------

ALTER TABLE inspection
ADD COLUMN location_geometry_point public.geometry;

CREATE INDEX idx_inspection_location_geometry_point
ON inspection
USING gist (location_geometry_point);

COMMENT ON COLUMN inspection.location_geometry_point IS 'The location of the inspection stored as a geometric point.';

ALTER TABLE inspection.inspection
ADD COLUMN location_address VARCHAR(120);

COMMENT ON COLUMN inspection.location_address IS 'Address of the inspection.';

ALTER TABLE inspection.inspection
ADD COLUMN location_description VARCHAR(4000);

COMMENT ON COLUMN inspection.location_description IS 'Description of the inspection location.';
