DROP VIEW IF EXISTS cos_geo_org_unit_flat_vw;
CREATE INDEX "FK_hwcrcmplntguid" ON attractant_hwcr_xref USING btree (hwcr_complaint_guid);