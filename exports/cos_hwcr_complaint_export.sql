-----------------------------------------------------
-- Monthly HWCR Complaint Export query to be run for COS statistics
-- see https://github.com/bcgov/nr-compliance-enforcement/wiki/Data-Exports for more information
-----------------------------------------------------
select 
	cmp.complaint_identifier as "Complaint Identifier",
	case 
        	when hwc.complaint_identifier is not null then 'HWCR'
		else 'Unknown' 
    	end as "Complaint Type",
        ((cmp.incident_reported_utc_timestmp at time zone 'UTC') at time zone 'PDT') as "Date Logged (PDT)",
	    ((cmp.incident_utc_datetime at time zone 'UTC') at time zone 'PDT') as "Incident Datetime (PDT)",
	cst.short_description as "Complaint Status",
	spc.short_description as "Species",
	case
        when hch.data_after_executed_operation ->> 'species_code' != hwc.species_code THEN 'YES!'
        else ''
    END AS "Was species changed?",
	hnc.long_description as "Nature of Complaint",
	coalesce (cup.update_count, 0) as "Number of Updates",
	goc.short_description as "Area/Community",
	gfv.offloc_name as "District",
	gfv.zone_name as "Zone",
	gfv.region_name as "Region",
	ST_X(cmp.location_geometry_point) AS "Longitude (X)",
    ST_Y(cmp.location_geometry_point) AS "Latitude (Y)",
	per.last_name || ', ' || per.first_name as "Officer Assigned"
from 
	complaint cmp
join 
	complaint_status_code cst on cst.complaint_status_code = cmp.complaint_status_code 
join 
	geo_organization_unit_code goc on goc.geo_organization_unit_code  = cmp.geo_organization_unit_code 
join 
	cos_geo_org_unit_flat_mvw gfv on gfv.area_code = goc.geo_organization_unit_code 
left join 
	person_complaint_xref pcx on pcx.complaint_identifier = cmp.complaint_identifier and pcx.active_ind = true
left join 
	person per on per.person_guid = pcx.person_guid 
right join 
	hwcr_complaint hwc on hwc.complaint_identifier = cmp.complaint_identifier 
left join
	species_code spc on spc.species_code = hwc.species_code
left join 
	hwcr_complaint_nature_code hnc on hnc.hwcr_complaint_nature_code = hwc.hwcr_complaint_nature_code 
left join (
    select complaint_identifier, count(*) as update_count
    from complaint_update
    group by complaint_identifier
) cup on cup.complaint_identifier = cmp.complaint_identifier
LEFT JOIN 
    hwcr_complaint_h hch ON hch.target_row_id = hwc.hwcr_complaint_guid
    AND hch.operation_type = 'I'
order by
	cmp.complaint_identifier asc