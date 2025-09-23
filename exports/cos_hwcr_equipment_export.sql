-----------------------------------------------------
-- Monthly HWCR Case Export query to be run for COS statistics
-- see https://github.com/bcgov/nr-compliance-enforcement-cm/wiki/Data-Exports for more information
-----------------------------------------------------
select
	le.lead_identifier as "Complaint Identifer",
	ec.short_description as "Equipment Type",
	case
		when eat.was_animal_captured = 'N' then 'Yes'
		else 'No'
	end as "Trap Set No Capture"
from
	case_management.lead le
	left join case_management.case_file cf on cf.complaint_outcome_guid = le.case_identifier
	join (
		select distinct
			complaint_outcome_guid,
			e.was_animal_captured, -- distinct should not be required here, this is a bug in the code where equipment actions are not being inactivated
			e.equipment_code
		from
			case_management.action eax
			join case_management.action_type_action_xref atax on atax.action_type_action_xref_guid = eax.action_type_action_xref_guid
			join case_management.action_code ac2 on ac2.action_code = atax.action_code
			join case_management.equipment e on e.equipment_guid = eax.equipment_guid
		where
			ac2.action_code = 'SETEQUIPMT'
			and e.equipment_code not in ('SIGNG', 'TRCAM')
			and -- don't care about these
			e.active_ind is true
	) eat on eat.complaint_outcome_guid = cf.complaint_outcome_guid
	left join equipment_code ec on ec.equipment_code = eat.equipment_code
where
	cf.owned_by_agency_code = 'COS'
	and cf.case_code in ('HWCR', 'ERS')
order by
	le.lead_identifier asc