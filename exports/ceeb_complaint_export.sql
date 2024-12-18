-----------------------------------------------------
-- Quarterly CEEB Complaint Export query to be run for CEEB statistics
-- see https://github.com/bcgov/nr-compliance-enforcement/wiki/Data-Exports for more information
--
-- Note some extra fields are commented out of the query as these are currently part of the 
-- NRIS export however they are not currently being used for reporting
-----------------------------------------------------
select 
	cmp.complaint_identifier as "Record ID",
    TO_CHAR(((cmp.incident_reported_utc_timestmp at time zone 'UTC') at time zone 'PDT'), 'MM/DD/YYYY') as "Date Received",
	CASE 
	    WHEN cst.short_description = 'Open' THEN 'Incomplete'
	    WHEN cst.short_description = 'Pending Review' THEN 'Incomplete'
    	WHEN cst.short_description = 'Closed' THEN 'Complete'
    	ELSE cst.short_description 
	END as "Complaint Status",
	cmrc.long_description as "Method Received",
	--'IDIR\' || ofc.user_id  as "Officer Assigned",
	gfv.region_name as "Region",
	--gfv.offloc_name as "Office",
	goc.short_description as "City/Town",
	--cmp.caller_name  as "Complainant Contact",
	--CASE 
	--    WHEN cmp.is_privacy_requested = 'Y' THEN 'Yes'
  --  	ELSE 'No'
	--END as "Privacy Requested",
	--cmp.caller_email as "Email",
	--cmp.caller_phone_1 as "Telephone No.",
	--cmp.location_summary_text as "Facility/Site Location",
	--ST_Y(cmp.location_geometry_point) as "Latitude",
	--ST_X(cmp.location_geometry_point) as "Longitude",
	ac.suspect_witnesss_dtl_text as "Alleged Contravener"
from 
	complaint cmp
join 
	complaint_status_code cst on cst.complaint_status_code = cmp.complaint_status_code 
join 
	geo_organization_unit_code goc on goc.geo_organization_unit_code  = cmp.geo_organization_unit_code 
join 
	cos_geo_org_unit_flat_vw gfv on gfv.area_code = goc.geo_organization_unit_code 
left join
	comp_mthd_recv_cd_agcy_cd_xref cmrcacx on cmrcacx.comp_mthd_recv_cd_agcy_cd_xref_guid = cmp.comp_mthd_recv_cd_agcy_cd_xref_guid
left join 
	complaint_method_received_code cmrc on cmrc.complaint_method_received_code = cmrcacx.complaint_method_received_code
left join 
	person_complaint_xref pcx on pcx.complaint_identifier = cmp.complaint_identifier and pcx.active_ind = true
left join 
	person per on per.person_guid = pcx.person_guid 
left join 
	officer ofc on ofc.person_guid = per.person_guid 
right join 
	allegation_complaint ac on ac.complaint_identifier = cmp.complaint_identifier 
where
	cmp.incident_reported_utc_timestmp BETWEEN 'YYYY-MM-DD' AND 'YYYY-MM-DD' -- replace placeholders with actual values
order by
	cmp.complaint_identifier asc