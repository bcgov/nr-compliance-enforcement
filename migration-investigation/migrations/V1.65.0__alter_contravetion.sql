ALTER TABLE contravention
    ADD COLUMN contravention_date date,
    ADD COLUMN geo_organization_unit_code_ref character varying(10);

COMMENT ON COLUMN contravention.contravention_date IS 'The date the contravention was suspected to have occurred.';

COMMENT ON COLUMN contravention.geo_organization_unit_code_ref IS 'Unenforced foreign key to shared.geo_organization_unit_code.  The community where the contravention was suspected to have taken place.';