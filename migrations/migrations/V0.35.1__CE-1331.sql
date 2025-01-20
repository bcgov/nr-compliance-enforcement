DROP VIEW IF EXISTS public.cos_geo_org_unit_flat_vw;
CREATE INDEX "FK_hwcrcmplntguid" ON public.attractant_hwcr_xref USING btree (hwcr_complaint_guid);