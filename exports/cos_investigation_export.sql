-----------------------------------------------------
-- COS Investigations model used by the COS Investigation Export dashboard in Metabase
-- see https://github.com/bcgov/nr-compliance-enforcement/wiki/Data-Exports for more information
-----------------------------------------------------
select
  inv.name as "Investigation ID",
  inv.investigation_opened_utc_timestamp at time zone 'UTC' at time zone 'America/Vancouver' as "Date Opened (PDT/PST)",
  gfv.region_name as "Region",
  gfv.zone_name as "Zone",
  gfv.offloc_name as "District",
  gfv.area_name as "Area/Community",
  per.last_name || ', ' || per.first_name as "Primary Investigator",
  isc.short_description as "Status"
from
  investigation.investigation inv
  join investigation.investigation_status_code isc on isc.investigation_status_code = inv.investigation_status
  left join shared.cos_geo_org_unit_flat_mvw gfv on gfv.area_code = inv.geo_organization_unit_code_ref
  left join shared.app_user per on per.app_user_guid = inv.primary_investigator_guid_ref
where
  inv.owned_by_agency_ref = 'COS'
order by
  inv.name asc
