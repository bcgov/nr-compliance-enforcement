-----------------------------------------------------
-- Contraventions model used by the Investigation Export dashboard in Metabase
-----------------------------------------------------
with recursive ancestors as (
  select
    con.contravention_guid,
    leg.parent_legislation_guid,
    leg.legislation_type_code,
    leg.citation,
    leg.section_title,
    leg.legislation_version_guid
  from
    investigation.contravention con
    join shared.legislation leg on leg.legislation_guid = con.legislation_guid_ref
  where
    con.active_ind = true
  union all
  select
    anc.contravention_guid,
    leg.parent_legislation_guid,
    leg.legislation_type_code,
    leg.citation,
    leg.section_title,
    leg.legislation_version_guid
  from
    ancestors anc
    join shared.legislation leg on leg.legislation_guid = anc.parent_legislation_guid
),
contravention_legislation as (
  select
    contravention_guid,
    max(section_title) filter (where legislation_type_code = 'ACT') as act,
    max(lv.effective_date) filter (where legislation_type_code = 'ACT') as act_effective_date,
    max(section_title) filter (where legislation_type_code = 'REG') as regulation,
    max(lv.effective_date) filter (where legislation_type_code = 'REG') as regulation_effective_date,
    max(citation) filter (where legislation_type_code = 'SEC') as section,
    coalesce(
      max(section_title) filter (where legislation_type_code = 'SEC'),
      max(section_title) filter (where legislation_type_code = 'SUBSEC')
    ) as section_title,
    -- an unnumbered subsection is shown as '1' in the frontend
    max(coalesce(citation, '1')) filter (where legislation_type_code = 'SUBSEC') as subsection,
    max(section_title) filter (where legislation_type_code = 'DEF') as definition,
    max(citation) filter (where legislation_type_code = 'PAR') as paragraph,
    max(citation) filter (where legislation_type_code = 'SUBPAR') as subparagraph,
    max(citation) filter (where legislation_type_code = 'CL') as clause,
    max(citation) filter (where legislation_type_code = 'SUBCL') as subclause
  from
    ancestors anc
    join shared.legislation_version lv on lv.legislation_version_guid = anc.legislation_version_guid
  group by
    contravention_guid
)
select
  inv.name as "Investigation ID",
  inv.investigation_opened_utc_timestamp at time zone 'UTC' at time zone 'America/Vancouver' as "Date Opened (PDT/PST)",
  gfv.region_name as "Region",
  gfv.zone_name as "Zone",
  per.last_name || ', ' || per.first_name as "Primary Investigator",
  con.contravention_date as "Contravention Date",
  goc.short_description as "Contravention Community",
  wmu.short_description as "Wildlife Management Unit",
  cl.act as "Act",
  -- an unset effective date is stored as 1900-01-01
  nullif(cl.act_effective_date, '1900-01-01') as "Act Effective Date",
  cl.regulation as "Regulation",
  nullif(cl.regulation_effective_date, '1900-01-01') as "Regulation Effective Date",
  cl.section as "Section",
  cl.section_title as "Section Title",
  cl.subsection as "Subsection",
  cl.definition as "Definition",
  cl.paragraph as "Paragraph",
  cl.subparagraph as "Subparagraph",
  cl.clause as "Clause",
  cl.subclause as "Subclause",
  leg.full_citation as "Full Citation",
  case
    when cpx.investigation_party_guid is null then 'Unknown party'
    else coalesce(
      nullif(concat_ws(', ', upper(nullif(trim(ipe.last_name), '')), nullif(concat_ws(' ', nullif(trim(ipe.first_name), ''), nullif(trim(ipe.middle_names), '')), '')), ''),
      ibu.name,
      ipa.placeholder_name || coalesce(' ' || ipa.placeholder_number, ''),
      '-'
    )
  end as "Party",
  eac.short_description as "Decision",
  -- set date issued for Unfounded/Unsolved so the Decision Date Issued filter includes them
  case
    when ea.enforcement_action_code not in ('UNFD', 'UNSL') then ea.date_issued
  end as "Date Issued",
  ea.date_issued as "Decision Date Issued",
  iss.last_name || ', ' || iss.first_name as "Issuing Officer",
  ttc.short_description as "Ticket Type",
  tkt.ticket_number as "Ticket Number",
  tkt.ticket_amount as "Ticket Amount",
  tkt.notice_of_cancellation_number as "Notice of Cancellation Number",
  toc.short_description as "Ticket Status",
  wrn.warning_number as "Warning Number",
  stc.short_description as "Sanction Type",
  ssc.short_description as "Sanction Status",
  asn.effective_date as "Sanction Effective Date",
  asn.end_date as "Sanction End Date"
from
  investigation.investigation inv
  join investigation.contravention con on con.investigation_guid = inv.investigation_guid
  and con.active_ind = true
  left join contravention_legislation cl on cl.contravention_guid = con.contravention_guid
  left join shared.legislation leg on leg.legislation_guid = con.legislation_guid_ref
  left join shared.geo_organization_unit_code goc on goc.geo_organization_unit_code = con.geo_organization_unit_code_ref
  left join shared.wildlife_management_unit_code wmu on wmu.wildlife_management_unit_code = con.wildlife_management_unit_code_ref
  left join shared.cos_geo_org_unit_flat_mvw gfv on gfv.area_code = inv.geo_organization_unit_code_ref
  left join shared.app_user per on per.app_user_guid = inv.primary_investigator_guid_ref
  left join investigation.contravention_party_xref cpx on cpx.contravention_guid = con.contravention_guid
  and cpx.active_ind = true
  left join investigation.investigation_party ipa on ipa.investigation_party_guid = cpx.investigation_party_guid
  left join investigation.investigation_person ipe on ipe.investigation_party_guid = ipa.investigation_party_guid
  and ipe.active_ind = true
  left join investigation.investigation_business ibu on ibu.investigation_party_guid = ipa.investigation_party_guid
  and ibu.active_ind = true
  left join investigation.enforcement_action ea on ea.contravention_party_xref_guid = cpx.contravention_party_xref_guid
  and ea.active_ind = true
  left join investigation.enforcement_action_code eac on eac.enforcement_action_code = ea.enforcement_action_code
  left join shared.app_user iss on iss.app_user_guid = ea.issuing_officer_guid_ref
  left join investigation.ticket tkt on tkt.enforcement_action_guid = ea.enforcement_action_guid
  and tkt.active_ind = true
  left join investigation.ticket_type_code ttc on ttc.ticket_type_code = tkt.ticket_type_code
  left join investigation.ticket_outcome_code toc on toc.ticket_outcome_code = tkt.ticket_outcome_code
  left join investigation.warning wrn on wrn.enforcement_action_guid = ea.enforcement_action_guid
  and wrn.active_ind = true
  left join investigation.administrative_sanction asn on asn.enforcement_action_guid = ea.enforcement_action_guid
  and asn.active_ind = true
  left join investigation.sanction_type_code stc on stc.sanction_type_code = asn.sanction_type_code
  left join investigation.sanction_status_code ssc on ssc.sanction_status_code = asn.sanction_status_code
where
  inv.owned_by_agency_ref = 'COS'
order by
  inv.name asc,
  con.contravention_date asc
