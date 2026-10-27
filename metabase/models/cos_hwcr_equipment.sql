SELECT
  "source"."Complaint Identifer" AS "Complaint Identifer",
  "source"."Incident Datetime (Pacific)" AS "Incident Datetime (Pacific)",
  "source"."Equipment Type" AS "Equipment Type",
  "source"."Set/used Date" AS "Set/used Date",
  "source"."Trap Set No Capture" AS "Trap Set No Capture"
FROM
  (
    -----------------------------------------------------
    -- Monthly HWCR Case Export query to be run for COS statistics
    -- see https://github.com/bcgov/nr-compliance-enforcement-cm/wiki/Data-Exports for more information
    -----------------------------------------------------
    select
      co.complaint_identifier as "Complaint Identifer",
      (c.incident_utc_date + c.incident_utc_time) at time zone 'UTC' at time zone 'America/Vancouver' as "Incident Datetime (Pacific)",
      ec.short_description as "Equipment Type",
      to_char(eat.action_date, 'YYYY-MM-DD' ) as "Set/used Date",
      case
        when eat.was_animal_captured = 'N' then 'Yes'
        else 'No'
      end as "Trap Set No Capture"
    from
      complaint_outcome.complaint_outcome co
      left join complaint.complaint c on co.complaint_identifier = c.complaint_identifier
      join (
        select
          distinct complaint_outcome_guid,
          e.was_animal_captured,
          -- distinct should not be required here, this is a bug in the code where equipment actions are not being inactivated
          e.equipment_code,
          eax.action_date
        from
          complaint_outcome.action eax
          join complaint_outcome.action_type_action_xref atax on atax.action_type_action_xref_guid = eax.action_type_action_xref_guid
          join complaint_outcome.action_code ac2 on ac2.action_code = atax.action_code
          join complaint_outcome.equipment e on e.equipment_guid = eax.equipment_guid
        where
          ac2.action_code = 'SETEQUIPMT'
          and e.equipment_code not in ('SIGNG', 'TRCAM')
          -- don't care about these
          and e.active_ind is true
          and eax.active_ind is true
      ) eat on eat.complaint_outcome_guid = co.complaint_outcome_guid
      left join complaint_outcome.equipment_code ec on ec.equipment_code = eat.equipment_code
    where
      co.owned_by_agency_code = 'COS'
      and c.complaint_type_code in ('HWCR', 'ERS')
    order by
      co.complaint_identifier asc
  ) AS "source"
LIMIT
  1048575