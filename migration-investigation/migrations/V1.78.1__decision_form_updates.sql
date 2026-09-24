ALTER TABLE enforcement_action DROP COLUMN geo_organization_unit_code_ref;

ALTER TABLE administrative_sanction ALTER COLUMN end_date DROP NOT NULL;

ALTER TABLE enforcement_order ALTER COLUMN order_type_code SET NOT NULL;
