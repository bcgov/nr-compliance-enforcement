ALTER TABLE agency_code DROP COLUMN IF EXISTS create_user_guid;
ALTER TABLE agency_code DROP COLUMN IF EXISTS update_user_guid;

ALTER TABLE allegation_complaint DROP COLUMN IF EXISTS create_user_guid;
ALTER TABLE allegation_complaint DROP COLUMN IF EXISTS update_user_guid;

ALTER TABLE attractant_code DROP COLUMN IF EXISTS create_user_guid;
ALTER TABLE attractant_code DROP COLUMN IF EXISTS update_user_guid;

ALTER TABLE attractant_hwcr_xref DROP COLUMN IF EXISTS create_user_guid;
ALTER TABLE attractant_hwcr_xref DROP COLUMN IF EXISTS update_user_guid;

ALTER TABLE complaint DROP COLUMN IF EXISTS create_user_guid;
ALTER TABLE complaint DROP COLUMN IF EXISTS update_user_guid;

ALTER TABLE complaint_status_code DROP COLUMN IF EXISTS create_user_guid;
ALTER TABLE complaint_status_code DROP COLUMN IF EXISTS update_user_guid;

ALTER TABLE geo_org_unit_structure DROP COLUMN IF EXISTS create_user_guid;
ALTER TABLE geo_org_unit_structure DROP COLUMN IF EXISTS update_user_guid;

ALTER TABLE geo_org_unit_type_code DROP COLUMN IF EXISTS create_user_guid;
ALTER TABLE geo_org_unit_type_code DROP COLUMN IF EXISTS update_user_guid;

ALTER TABLE geo_organization_unit_code DROP COLUMN IF EXISTS create_user_guid;
ALTER TABLE geo_organization_unit_code DROP COLUMN IF EXISTS update_user_guid;

ALTER TABLE hwcr_complaint DROP COLUMN IF EXISTS create_user_guid;
ALTER TABLE hwcr_complaint DROP COLUMN IF EXISTS update_user_guid;

ALTER TABLE hwcr_complaint_nature_code DROP COLUMN IF EXISTS create_user_guid;
ALTER TABLE hwcr_complaint_nature_code DROP COLUMN IF EXISTS update_user_guid;

ALTER TABLE office DROP COLUMN IF EXISTS create_user_guid;
ALTER TABLE office DROP COLUMN IF EXISTS update_user_guid;

ALTER TABLE officer DROP COLUMN IF EXISTS create_user_guid;
ALTER TABLE officer DROP COLUMN IF EXISTS update_user_guid;

ALTER TABLE person DROP COLUMN IF EXISTS create_user_guid;
ALTER TABLE person DROP COLUMN IF EXISTS update_user_guid;

ALTER TABLE person_complaint_xref DROP COLUMN IF EXISTS create_user_guid;
ALTER TABLE person_complaint_xref DROP COLUMN IF EXISTS update_user_guid;

ALTER TABLE person_complaint_xref_code DROP COLUMN IF EXISTS create_user_guid;
ALTER TABLE person_complaint_xref_code DROP COLUMN IF EXISTS update_user_guid;

ALTER TABLE species_code DROP COLUMN IF EXISTS create_user_guid;
ALTER TABLE species_code DROP COLUMN IF EXISTS update_user_guid;

ALTER TABLE violation_code DROP COLUMN IF EXISTS create_user_guid;
ALTER TABLE violation_code DROP COLUMN IF EXISTS update_user_guid;