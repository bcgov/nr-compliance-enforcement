SELECT
  "source"."Complaint Identifer" AS "Complaint Identifer",
  "source"."Incident Datetime (PDT/PST)" AS "Incident Datetime (PDT/PST)",
  "source"."Equipment Type" AS "Equipment Type",
  "source"."Trap Set No Capture" AS "Trap Set No Capture"
FROM
  (
    -----------------------------------------------------
    -- Monthly HWCR Case Export query to be run for COS statistics
    -- see https://github.com/bcgov/nr-compliance-enforcement-cm/wiki/Data-Exports for more information
    -----------------------------------------------------
    select
      co.complaint_identifier as "Complaint Identifer",
      case
        -- This is a temporary solution as it isn't really scalable.
        when (c.incident_utc_date + c.incident_utc_time) at time zone 'UTC' at time zone 'America/Los_Angeles' between '2025-03-08 02:00:00' and '2025-11-02 01:59:59' -- DST start and end for this year (2025)
        or (c.incident_utc_date + c.incident_utc_time) at time zone 'UTC' at time zone 'America/Los_Angeles' between '2024-03-10 02:00:00' and '2024-11-03 01:59:59' -- DST start and end for last year (2024)
        then (
          (
            (c.incident_utc_date + c.incident_utc_time) at time zone 'UTC'
          ) at time zone 'PDT'
        ) -- PDT if within DST
        else (
          (
            (c.incident_utc_date + c.incident_utc_time) at time zone 'UTC'
          ) at time zone 'PST'
        ) -- PST if outside DST
      end as "Incident Datetime (PDT/PST)",
      ec.short_description as "Equipment Type",
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
          e.equipment_code
        from
          complaint_outcome.action eax
          join complaint_outcome.action_type_action_xref atax on atax.action_type_action_xref_guid = eax.action_type_action_xref_guid
          join complaint_outcome.action_code ac2 on ac2.action_code = atax.action_code
          join complaint_outcome.equipment e on e.equipment_guid = eax.equipment_guid
        where
          ac2.action_code = 'SETEQUIPMT'
          and e.equipment_code not in ('SIGNG', 'TRCAM')
          and -- don't care about these
          e.active_ind is true
      ) eat on eat.complaint_outcome_guid = co.complaint_outcome_guid
      left join complaint_outcome.equipment_code ec on ec.equipment_code = eat.equipment_code
    where
      co.owned_by_agency_code = 'PARKS'
      and c.complaint_type_code in ('HWCR', 'ERS')
    order by
      co.complaint_identifier asc
  ) AS "source"
LIMIT
  1048575