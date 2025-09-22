-----------------------------------------------------
-- Monthly HWCR Case Export query to be run for COS statistics
-- see https://github.com/bcgov/nr-compliance-enforcement-cm/wiki/Data-Exports for more information
-----------------------------------------------------
select
	le.lead_identifier as "Complaint Identifer",
	wl.species_code as "Outcome Species",
	case
		when wlh.data_after_executed_operation - > > 'species_code' != wl.species_code THEN wlh.data_after_executed_operation - > > 'species_code'
		else ''
	END AS "Original Outcome Species",
	ac.short_description as "Age",
	hoc.short_description as "Outcome",
	to_char (
		oat.action_date AT TIME ZONE 'UTC' AT TIME ZONE 'America/Vancouver',
		'YYYY-MM-DD'
	) as "Outcome Date",
	case
		when wlh.data_after_executed_operation - > > 'hwcr_outcome_code' != wl.hwcr_outcome_code THEN prv_hoc.short_description
		else ''
	END AS "Original Outcome",
	abc.short_description as "Outcome actioned by",
	case
		when pat.prev_count >= 1 then 'Yes'
		else 'No'
	end as "Advice Provided"
from
	case_management.lead le
	left join case_management.case_file cf on cf.complaint_outcome_guid = le.case_identifier
	left join case_management.wildlife wl on wl.complaint_outcome_guid = cf.complaint_outcome_guid
	and wl.active_ind = true
	left join case_management.wildlife_h wlh ON wlh.target_row_id = wl.wildlife_guid
	AND wlh.operation_type = 'I'
	left join case_management.age_code ac on ac.age_code = wl.age_code
	left join case_management.hwcr_outcome_code hoc on hoc.hwcr_outcome_code = wl.hwcr_outcome_code
	left join case_management.hwcr_outcome_code prv_hoc on prv_hoc.hwcr_outcome_code = wlh.data_after_executed_operation - > > 'hwcr_outcome_code'
	left join case_management.hwcr_outcome_actioned_by_code abc on abc.hwcr_outcome_actioned_by_code = wl.hwcr_outcome_actioned_by_code
	left join ( -- wildlife actions
		select
			action_date,
			wildlife_guid
		from
			case_management.action axn
			join case_management.action_type_action_xref atax on atax.action_type_action_xref_guid = axn.action_type_action_xref_guid
			join case_management.action_code ac2 on ac2.action_code = atax.action_code
		where
			ac2.action_code = 'RECOUTCOME' -- has to be the outcome date
	) oat on oat.wildlife_guid = wl.wildlife_guid
	left join ( -- Advide Provided
		select
			count(axn.complaint_outcome_guid) as prev_count,
			complaint_outcome_guid
		from
			case_management.action axn
			join case_management.action_type_action_xref atax on atax.action_type_action_xref_guid = axn.action_type_action_xref_guid
			join case_management.action_type_code atc on atax.action_type_code = atc.action_type_code
		where
			atc.action_type_code = 'COSPRV&EDU'
			and axn.active_ind = true
		group by
			complaint_outcome_guid
	) pat on pat.complaint_outcome_guid = cf.complaint_outcome_guid
where
	cf.owned_by_agency_code = 'COS'
	and cf.case_code in ('HWCR', 'ERS')
	AND NOT ( -- filter out the case where there is no Advice and no Animal.  Don't want a row for this.
		(
			pat.prev_count IS NULL
			OR pat.prev_count = 0
		)
		AND wl.hwcr_outcome_code IS NULL
		AND wl.hwcr_outcome_actioned_by_code IS NULL
		AND oat.action_date IS NULL
	)
order by
	le.lead_identifier asc