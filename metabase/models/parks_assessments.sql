SELECT
  "source"."Complaint Identifer" AS "Complaint Identifer",
  "source"."Assessment Date (YYYY-MM-DD)" AS "Assessment Date (YYYY-MM-DD)",
  "source"."Assessment Date" AS "Assessment Date",
  "source"."Attended" AS "Attended",
  "source"."Action Required" AS "Action Required"
FROM
  (
    SELECT
      "source"."Complaint Identifer" AS "Complaint Identifer",
      "source"."Assessment Date (YYYY-MM-DD)" AS "Assessment Date (YYYY-MM-DD)",
      "source"."Assessment Date" AS "Assessment Date",
      "source"."Attended" AS "Attended",
      "source"."Action Required" AS "Action Required"
    FROM
      (
        -----------------------------------------------------
        -- Monthly HWCR Case Export query to be run for COS statistics
        -- see https://github.com/bcgov/nr-compliance-enforcement-cm/wiki/Data-Exports for more information
        -----------------------------------------------------
        select
          co.complaint_identifier as "Complaint Identifer",
          to_char (
            asd.action_date AT TIME ZONE 'UTC' AT TIME ZONE 'America/Vancouver',
            'YYYY-MM-DD HH24:MI'
          ) as "Assessment Date (YYYY-MM-DD)",
          asd.action_date AT TIME ZONE 'UTC' AT TIME ZONE 'America/Vancouver' as "Assessment Date",
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
            -- assessment actions
            select
              distinct action_date,
              assessment_guid
            from
              complaint_outcome.action axn
              join complaint_outcome.action_type_action_xref atax on atax.action_type_action_xref_guid = axn.action_type_action_xref_guid
              join complaint_outcome.action_code ac2 on ac2.action_code = atax.action_code
            where
              axn.assessment_guid is not null -- Can be anything here since we are just using it as a hook in to get the assessment date
          ) asd on asd.assessment_guid = asm.assessment_guid
        where
          co.owned_by_agency_code = 'PARKS'
          and c.complaint_type_code in ('HWCR', 'ERS')
        order by
          co.complaint_identifier asc
      ) AS "source"
   
LIMIT
      1048575
  ) AS "source"
LIMIT
  1048575