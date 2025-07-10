-----------------------------------------------------
-- Monthly HWCR Complaint Export query to be run for COS statistics
-- see https://github.com/bcgov/nr-compliance-enforcement/wiki/Data-Exports for more information
-----------------------------------------------------
select distinct
	cmp.complaint_identifier as "Complaint Identifier",
	case 
        	when hwc.complaint_identifier is not null then 'HWCR'
		else 'Unknown' 
    	end as "Complaint Type",
    agt.short_description as "Referred to agency",
    agb.short_description as "Referred by agency",
    to_char(crf.referral_date AT TIME ZONE 'UTC' AT TIME ZONE 'America/Los_Angeles', 'YYYY-MM-DD HH24:MI') as "Referral date",
	case -- This is a temporary solution as it isn't really scalable.
	    when cmp.incident_reported_utc_timestmp at time zone 'UTC' at time zone 'America/Los_Angeles' 
	         between 
	             '2025-03-08 02:00:00' and '2025-11-02 01:59:59' -- DST start and end for this year (2025)
	         or
	         cmp.incident_reported_utc_timestmp at time zone 'UTC' at time zone 'America/Los_Angeles' 
	         between 
	             '2024-03-10 02:00:00' and '2024-11-03 01:59:59' -- DST start and end for last year (2024)
	    then
	        ((cmp.incident_reported_utc_timestmp at time zone 'UTC') at time zone 'PDT')  -- PDT if within DST
	    else
	        ((cmp.incident_reported_utc_timestmp at time zone 'UTC') at time zone 'PST')  -- PST if outside DST
	end as "Date Logged (PDT/PST)",
	case -- This is a temporary solution as it isn't really scalable.
	    when cmp.incident_utc_datetime at time zone 'UTC' at time zone 'America/Los_Angeles' 
	         between 
	             '2025-03-08 02:00:00' and '2025-11-02 01:59:59' -- DST start and end for this year (2025)
	         or
	         cmp.incident_utc_datetime at time zone 'UTC' at time zone 'America/Los_Angeles' 
	         between 
	             '2024-03-10 02:00:00' and '2024-11-03 01:59:59' -- DST start and end for last year (2024)
	    then
	        ((cmp.incident_utc_datetime at time zone 'UTC') at time zone 'PDT')  -- PDT if within DST
	    else
	        ((cmp.incident_utc_datetime at time zone 'UTC') at time zone 'PST')  -- PST if outside DST
	end as "Incident Datetime (PDT/PST)",
	cst.short_description as "Complaint Status",
	spc.short_description as "Species",
	case
        when hch.data_after_executed_operation ->> 'species_code' != hwc.species_code THEN 
        	prev_spc.short_description
        else ''
    END AS "Original Species",
	hnc.long_description as "Nature of Complaint",
	coalesce (cup.update_count, 0) as "Number of Updates",
	cu.create_utc_timestamp as "Update Logged Date",
	goc.short_description as "Area/Community",
	gfv.offloc_name as "District",
	gfv.zone_name as "Zone",
	gfv.region_name as "Region",
	ST_X(cmp.location_geometry_point) AS "Longitude (X)",
    ST_Y(cmp.location_geometry_point) AS "Latitude (Y)",
	per.last_name || ', ' || per.first_name as "Officer Assigned",
	cmp.reference_number as "COORS Number"
from 
	complaint.complaint cmp
join 
	complaint.complaint_status_code cst on cst.complaint_status_code = cmp.complaint_status_code 
join 
	complaint.geo_organization_unit_code goc on goc.geo_organization_unit_code  = cmp.geo_organization_unit_code 
join 
	complaint.cos_geo_org_unit_flat_mvw gfv on gfv.area_code = goc.geo_organization_unit_code 
left join
	complaint.complaint_referral crf on crf.complaint_identifier = cmp.complaint_identifier 
left join
	complaint.agency_code agt on agt.agency_code = crf.referred_to_agency_code 
left join
	complaint.agency_code agb on agb.agency_code = crf.referred_by_agency_code 
left join 
	complaint.person_complaint_xref pcx on pcx.complaint_identifier = cmp.complaint_identifier and pcx.active_ind = true and pcx.person_complaint_xref_code = 'ASSIGNEE'
left join 
	complaint.person per on per.person_guid = pcx.person_guid 
right join 
	complaint.hwcr_complaint hwc on hwc.complaint_identifier = cmp.complaint_identifier 
left join
	complaint.species_code spc on spc.species_code = hwc.species_code
left join 
	complaint.hwcr_complaint_nature_code hnc on hnc.hwcr_complaint_nature_code = hwc.hwcr_complaint_nature_code 
left join (
    select complaint_identifier, count(*) as update_count
    from complaint.complaint_update
    group by complaint_identifier
) cup on cup.complaint_identifier = cmp.complaint_identifier
left join
   complaint.complaint_update cu ON cu.complaint_identifier = cmp.complaint_identifier 
LEFT JOIN 
    complaint.hwcr_complaint_h hch ON hch.target_row_id = hwc.hwcr_complaint_guid
    AND hch.operation_type = 'I'
LEFT JOIN 
    complaint.species_code prev_spc ON prev_spc.species_code = hch.data_after_executed_operation ->> 'species_code' 
where
	cmp.owned_by_agency_code = 'COS' or
	crf.referred_by_agency_code = 'COS'
order by
	cmp.complaint_identifier asc