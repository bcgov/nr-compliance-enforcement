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
	TO_CHAR (
		(
			(act.action_date at time zone 'UTC') at time zone 'PDT'
		),
		'YYYY-MM-DD'
	) as "Date Action Taken",
	CASE
		WHEN s.site_id is not null THEN 'U' || s.site_id
		when ap.authorization_permit_id is not null then ap.authorization_permit_id
		ELSE ''
	END as "Authorization Number"
from
	case_management.complaint_outcome co
	left join case_management.decision d on d.complaint_outcome_guid = co.complaint_outcome_guid
	and d.active_ind = 'Y'
	left join case_management.ipm_auth_category_code icc on d.ipm_auth_category_code = icc.ipm_auth_category_code
	left join case_management.schedule_sector_xref ssx on d.schedule_sector_xref_guid = ssx.schedule_sector_xref_guid
	and ssx.active_ind = 'Y'
	left join case_management.schedule_code sc on sc.schedule_code = ssx.schedule_code
	left join case_management.sector_code sec on sec.sector_code = ssx.sector_code
	left join case_management.discharge_code dc on dc.discharge_code = d.discharge_code
	left join case_management.site s on s.complaint_outcome_guid = co.complaint_outcome_guid
	and s.active_ind = 'Y'
	left join case_management.authorization_permit ap on ap.complaint_outcome_guid = co.complaint_outcome_guid
	and ap.active_ind = 'Y'
	left join case_management.action act on act.decision_guid = d.decision_guid
	and act.active_ind = 'Y'
	left join case_management.action_type_action_xref atax on atax.action_type_action_xref_guid = act.action_type_action_xref_guid
	left join case_management.action_code ac on ac.action_code = atax.action_code
where
	co.owned_by_agency_code = 'EPO'
order by
	co.complaint_identifier asc