select 
	cmp.complaint_identifier as "Record ID",
	-- agt.short_description as "Referred to agency",
	-- agb.short_description as "Referred by agency",
	-- to_char(crf.referral_date AT TIME ZONE 'UTC' AT TIME ZONE 'America/Los_Angeles', 'YYYY-MM-DD HH24:MI') as "Referral date",
	-- Try and use the Incident Date if it doesn't exist use the Date Received
	TO_CHAR(((cmp.incident_reported_utc_timestmp at time zone 'UTC') at time zone 'PDT'), 'YYYY-MM-DD') as "Date Received",
	CASE 
	    WHEN cst.short_description = 'Open' THEN 'Incomplete'
	    WHEN cst.short_description = 'Pending Review' THEN 'Incomplete'
    	WHEN cst.short_description = 'Closed' THEN 'Complete'
    	ELSE cst.short_description 
	END as "Complaint Status",
	cmrc.long_description as "Method Received",
	'IDIR\' || ofc.user_id  as "Officer Assigned",
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
	complaint.complaint cmp
join 
	complaint.complaint_status_code cst on cst.complaint_status_code = cmp.complaint_status_code 
join 
	complaint.geo_organization_unit_code goc on goc.geo_organization_unit_code  = cmp.geo_organization_unit_code 
join 
	complaint.cos_geo_org_unit_flat_mvw gfv on gfv.area_code = goc.geo_organization_unit_code 
left join
	complaint.comp_mthd_recv_cd_agcy_cd_xref cmrcacx on cmrcacx.comp_mthd_recv_cd_agcy_cd_xref_guid = cmp.comp_mthd_recv_cd_agcy_cd_xref_guid
left join 
	complaint.complaint_method_received_code cmrc on cmrc.complaint_method_received_code = cmrcacx.complaint_method_received_code
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
left join 
	complaint.officer ofc on ofc.person_guid = per.person_guid 
right join 
	complaint.allegation_complaint ac on ac.complaint_identifier = cmp.complaint_identifier 
where
	cmp.owned_by_agency_code = 'EPO'
	-- or crf.referred_by_agency_code = 'EPO'
order by
	cmp.complaint_identifier asc