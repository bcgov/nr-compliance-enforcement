ALTER TABLE enforcement_action DROP COLUMN geo_organization_unit_code_ref;

ALTER TABLE administrative_sanction ALTER COLUMN end_date DROP NOT NULL;

-- 'Evict' any blank rows from the table before making column mandatory.
UPDATE enforcement_order SET order_type_code = 'EVIC' WHERE order_type_code IS NULL;

ALTER TABLE enforcement_order ALTER COLUMN order_type_code SET NOT NULL;
