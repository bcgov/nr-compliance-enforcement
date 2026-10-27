SELECT
  "source"."Record ID" AS "Record ID",
  "source"."Date Received (Pacific)" AS "Date Received  (Pacific)",
  "source"."Complaint Status" AS "Complaint Status",
  "source"."Method Received" AS "Method Received",
  "source"."Officer Assigned" AS "Officer Assigned",
  "source"."Region" AS "Region",
  "source"."City/Town" AS "City/Town",
  "source"."Alleged Contravener" AS "Alleged Contravener",
  "source"."Complaint Description" AS "Complaint Description",
  "CEEB Quarterly Cases - Record"."Sector" AS "Sector",
  "CEEB Quarterly Cases - Record"."IPM Auth. Category Code" AS "IPM Auth. Category Code",
  "CEEB Quarterly Cases - Record"."Discharge Type" AS "Discharge Type",
  "CEEB Quarterly Cases - Record"."Action Taken" AS "Action Taken",
  "CEEB Quarterly Cases - Record"."Date Action Taken" AS "Date Action Taken",
  "CEEB Quarterly Cases - Record"."Authorization Number" AS "Authorization Number",
  "CEEB Assessments - Record"."Assessment Date" AS "Assessment Date",
  "CEEB Assessments - Record"."Attended" AS "Attended",
  "CEEB Assessments - Record"."Action Required" AS "Action Required"
FROM
  (
    SELECT
      "source"."Record ID" AS "Record ID",
      "source"."Date Received (Pacific)" AS "Date Received (Pacific)",
      "source"."Complaint Status" AS "Complaint Status",
      "source"."Method Received" AS "Method Received",
      "source"."Officer Assigned" AS "Officer Assigned",
      "source"."Region" AS "Region",
      "source"."City/Town" AS "City/Town",
      "source"."Alleged Contravener" AS "Alleged Contravener",
	  "source"."Complaint Description" AS "Complaint Description"
    FROM
      (
        select
          cmp.complaint_identifier as "Record ID",
          -- agt.short_description as "Referred to agency",
          -- agb.short_description as "Referred by agency",
          -- to_char(crf.referral_date AT TIME ZONE 'UTC' AT TIME ZONE 'America/Los_Angeles', 'YYYY-MM-DD HH24:MI') as "Referral date",
          -- Try and use the Incident Date if it doesn't exist use the Date Received
		      (cmp.incident_reported_utc_timestmp at time zone 'UTC' at time zone 'America/Vancouver')::date as "Date Received (Pacific)",
          CASE
            WHEN cst.short_description = 'Open' THEN 'Incomplete'
            WHEN cst.short_description = 'Pending Review' THEN 'Incomplete'
            WHEN cst.short_description = 'Closed' THEN 'Complete'
            ELSE cst.short_description
          END as "Complaint Status",
          cmrc.long_description as "Method Received",
          'IDIR\' || per.user_id  as "Officer Assigned",
	gfv.region_name as "Region",
	--gfv.offloc_name as "Office",
	goc.short_description as "City/Town",
	--cmp.caller_name  as "Complainant Contact",
	--CASE 
	--    WHEN cmp.is_privacy_requested = ' Y ' THEN ' Yes '
  --  	ELSE ' No '
	--END as "Privacy Requested",
	--cmp.caller_email as "Email",
	--cmp.caller_phone_1 as "Telephone No.",
	--cmp.location_summary_text as "Facility/Site Location",
	--ST_Y(cmp.location_geometry_point) as "Latitude",
	--ST_X(cmp.location_geometry_point) as "Longitude",
	ac.suspect_witnesss_dtl_text as "Alleged Contravener",
	cmp.detail_text as "Complaint Description"
from 
	complaint.complaint cmp
join 
	complaint.complaint_status_code cst on cst.complaint_status_code = cmp.complaint_status_code 
join 
	shared.geo_organization_unit_code goc on goc.geo_organization_unit_code  = cmp.geo_organization_unit_code 
join 
	shared.cos_geo_org_unit_flat_mvw gfv on gfv.area_code = goc.geo_organization_unit_code 
left join
	complaint.comp_mthd_recv_cd_agcy_cd_xref cmrcacx on cmrcacx.comp_mthd_recv_cd_agcy_cd_xref_guid = cmp.comp_mthd_recv_cd_agcy_cd_xref_guid
left join 
	complaint.complaint_method_received_code cmrc on cmrc.complaint_method_received_code = cmrcacx.complaint_method_received_code
left join
	complaint.complaint_referral crf on crf.complaint_identifier = cmp.complaint_identifier 
--left join
--	complaint.agency_code agt on agt.agency_code = crf.referred_to_agency_code 
--left join
--	complaint.agency_code agb on agb.agency_code = crf.referred_by_agency_code 
left join 
	complaint.app_user_complaint_xref pcx on pcx.complaint_identifier = cmp.complaint_identifier and pcx.active_ind = true and pcx.app_user_complaint_xref_code = 'ASSIGNEE'
left join 
	shared.app_user per on per.app_user_guid = pcx.app_user_guid_ref 
right join 
	complaint.allegation_complaint ac on ac.complaint_identifier = cmp.complaint_identifier 
where
	cmp.owned_by_agency_code_ref = 'EPO'
	-- or crf.referred_by_agency_code = ' EPO '
order by
	cmp.complaint_identifier asc) AS "source"
LIMIT 1048575) AS "source"
LEFT JOIN (SELECT
  "source"."Record ID" AS "Record ID",
  "source"."Sector" AS "Sector",
  "source"."IPM Auth. Category Code" AS "IPM Auth. Category Code",
  "source"."Discharge Type" AS "Discharge Type",
  "source"."Action Taken" AS "Action Taken",
  "source"."Date Action Taken" AS "Date Action Taken",
  "source"."Authorization Number" AS "Authorization Number"
FROM
  (
    -----------------------------------------------------
    -- Quarterly CEEB Case Export query to be run for CEEB statistics
    -- see https://github.com/bcgov/nr-compliance-enforcement-cm/wiki/Data-Exports for more information
    -----------------------------------------------------
    select
      co.complaint_identifier as "Record ID",
      --sc.long_description as "WDR Schedule/IPM Sector Type",
      sec.long_description as "Sector",
      icc.long_description as "IPM Auth. Category Code",
      dc.long_description as "Discharge Type",
      ac.long_description as "Action Taken",
	  to_char(act.action_date, 'YYYY-MM-DD') as "Date Action Taken",
      CASE
        WHEN s.site_id is not null THEN 'U' || s.site_id
        when ap.authorization_permit_id is not null then ap.authorization_permit_id
        ELSE ''
      END as "Authorization Number"
    from
      complaint_outcome.complaint_outcome co
      left join complaint_outcome.decision d on d.complaint_outcome_guid = co.complaint_outcome_guid
      and d.active_ind = 'Y'
      left join complaint_outcome.ipm_auth_category_code icc on d.ipm_auth_category_code = icc.ipm_auth_category_code
      left join complaint_outcome.schedule_sector_xref ssx on d.schedule_sector_xref_guid = ssx.schedule_sector_xref_guid
      and ssx.active_ind = 'Y'
      left join complaint_outcome.schedule_code sc on sc.schedule_code = ssx.schedule_code
      left join complaint_outcome.sector_code sec on sec.sector_code = ssx.sector_code
      left join complaint_outcome.discharge_code dc on dc.discharge_code = d.discharge_code
      left join complaint_outcome.site s on s.complaint_outcome_guid = co.complaint_outcome_guid
      and s.active_ind = 'Y'
      left join complaint_outcome.authorization_permit ap on ap.complaint_outcome_guid = co.complaint_outcome_guid
      and ap.active_ind = 'Y'
      left join complaint_outcome.action act on act.decision_guid = d.decision_guid
      and act.active_ind = 'Y'
      left join complaint_outcome.action_type_action_xref atax on atax.action_type_action_xref_guid = act.action_type_action_xref_guid
      left join complaint_outcome.action_code ac on ac.action_code = atax.action_code
    where
      co.owned_by_agency_code = 'EPO'
    order by
      co.complaint_identifier asc
  ) AS "source"
LIMIT
  1048575) AS "CEEB Quarterly Cases - Record" ON "source"."Record ID" = "CEEB Quarterly Cases - Record"."Record ID" LEFT JOIN (SELECT
  "source"."Complaint Identifer" AS "Complaint Identifer",
  "source"."Assessment Date" AS "Assessment Date",
  "source"."Attended" AS "Attended",
  "source"."Action Required" AS "Action Required"
FROM
  (
    -- Only the oldest assessment
	select distinct on (co.complaint_identifier)
	  co.complaint_identifier as "Complaint Identifer",
      to_char(asd.action_date, 'YYYY-MM-DD') as "Assessment Date",
	  case
		when asm.attended_ind is true then 'Yes'
		when asm.attended_ind is false then 'No'
		else 'Unknown'
	  end as "Attended",
	  case
		when asm.action_not_required_ind is true then 'No'
		when asm.action_not_required_ind is false then 'Yes'
		else 'Unknown'
	  end as "Action Required"
	from
	  complaint_outcome.complaint_outcome co
	  left join complaint.complaint c on co.complaint_identifier = c.complaint_identifier
	  left join complaint_outcome.assessment asm on asm.complaint_outcome_guid = co.complaint_outcome_guid
	  right join (
		select distinct action_date, assessment_guid
		from complaint_outcome.action axn
		join complaint_outcome.action_type_action_xref atax on atax.action_type_action_xref_guid = axn.action_type_action_xref_guid
		join complaint_outcome.action_code ac2 on ac2.action_code = atax.action_code
		where axn.assessment_guid is not null
	  ) asd on asd.assessment_guid = asm.assessment_guid
	where
	  co.owned_by_agency_code = 'EPO'
	  and c.complaint_type_code in ('HWCR', 'ERS')
	order by
	  co.complaint_identifier asc,
	  asd.action_date asc

  ) AS "source"
LIMIT
  1048575) AS "CEEB Assessments - Record" ON "source"."Record ID" = "CEEB Assessments - Record"."Complaint Identifer" LIMIT 1048575