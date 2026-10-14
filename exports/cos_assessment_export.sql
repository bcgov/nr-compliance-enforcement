is-----------------------------------------------------
-- Monthly HWCR Case Export query to be run for COS statistics
-- see https://github.com/bcgov/nr-compliance-enforcement-cm/wiki/Data-Exports for more information
-----------------------------------------------------
select
	le.lead_identifier as "Complaint Identifer",
	to_char (asd.action_date, 'YYYY-MM-DD') as "Assessment Date",
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
	complaint_outcome.lead le
	left join complaint_outcome.case_file cf on cf.complaint_outcome_guid = le.case_identifier
	left join complaint_outcome.assessment asm on asm.complaint_outcome_guid = cf.complaint_outcome_guid
	right join ( -- assessment actions
		select distinct
			action_date,
			assessment_guid
		from
			complaint_outcome.action axn
			join complaint_outcome.action_type_action_xref atax on atax.action_type_action_xref_guid = axn.action_type_action_xref_guid
			join complaint_outcome.action_code ac2 on ac2.action_code = atax.action_code
		where
			axn.assessment_guid is not null -- Can be anything here since we are just using it as a hook in to get the assessment date
	) asd on asd.assessment_guid = asm.assessment_guid
where
	cf.owned_by_agency_code = 'COS'
	and cf.case_code in ('HWCR', 'ERS')
order by
	le.lead_identifier asc