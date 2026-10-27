SELECT
  "source"."complaint_identifier" AS "complaint_identifier",
  "source"."attractant_codes" AS "attractant_codes",
  "source"."notes" AS "notes"
FROM
  (
    SELECT
      c.complaint_identifier,
      string_agg(distinct ac.short_description :: text, ',') as "attractant_codes",
      string_agg(n.case_note, '\n') as "notes"
    FROM
      complaint.complaint c
      left join complaint.hwcr_complaint hc on c.complaint_identifier = hc.complaint_identifier
      left join complaint.attractant_hwcr_xref axref on hc.hwcr_complaint_guid = axref.hwcr_complaint_guid
      left join complaint.attractant_code ac on ac.attractant_code = axref.attractant_code
      left join complaint_outcome.complaint_outcome co on c.complaint_identifier = co.complaint_identifier
      left join complaint_outcome.case_note n on co.complaint_outcome_guid = n.complaint_outcome_guid
    group by
      c.complaint_identifier,
      ac.short_description
  ) AS "source"
LIMIT
  1048575