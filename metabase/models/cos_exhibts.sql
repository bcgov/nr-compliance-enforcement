SELECT
  "source"."Investigation ID" AS "Investigation ID",
  "source"."Investigation Status" AS "Investigation Status",
  "source"."Region" AS "Region",
  "source"."Zone" AS "Zone",
  "source"."Office" AS "Office",
  "source"."Community" AS "Community",
  "source"."Primary Investigator" AS "Primary Investigator",
  "source"."Date Opened (Pacific)" AS "Date Opened (Pacific)",
  "source"."Investigation Source" AS "Investigation Source",
  "source"."Task Number" AS "Task Number",
  "source"."Task Category" AS "Task Category",
  "source"."Exhibit Number" AS "Exhibit Number",
  "source"."Property Type" AS "Property Type",
  "source"."First Name" AS "First Name",
  "source"."Last Name" AS "Last Name",
  "source"."Address" AS "Address",
  "source"."Phone Number" AS "Phone Number",
  "source"."Item Description" AS "Item Description",
  "source"."Quantity" AS "Quantity",
  "source"."Date/Time of Intake (Pacific)" AS "Date/Time of Intake (Pacific)",
  "source"."Property Tag Number" AS "Property Tag Number",
  "source"."Location of Intake" AS "Location of Intake",
  "source"."Officer" AS "Officer",
  "source"."Date Logged (Pacific)" AS "Date Logged (Pacific)"
FROM
  (
    select
      inv.name as "Investigation ID",
      isc.short_description as "Investigation Status",
      gfv.region_name as "Region",
      gfv.zone_name as "Zone",
      gfv.offloc_name as "Office",
      gfv.area_name as "Community",
      per.last_name || ', ' || per.first_name as "Primary Investigator",
      inv.investigation_opened_utc_timestamp at time zone 'UTC' at time zone 'America/Vancouver' as "Date Opened (Pacific)",
      src.short_description as "Investigation Source",
      tsk.task_number as "Task Number",
      tcc.short_description as "Task Category",
      exh.exhibit_display_number as "Exhibit Number",
      case
        exh.property_type
        when 'S' then 'Seized'
        when 'F' then 'Found'
        else exh.property_type
      end as "Property Type",
      exh.seized_from_first_name as "First Name",
      exh.seized_from_last_name as "Last Name",
      exh.seized_from_address as "Address",
      case
        when exh.seized_from_phone_number ~ '^[+]1[0-9]{10}$' then '(' || substr(exh.seized_from_phone_number, 3, 3) || ') ' || substr(exh.seized_from_phone_number, 6, 3) || '-' || substr(exh.seized_from_phone_number, 9, 4)
        else exh.seized_from_phone_number
      end as "Phone Number",
      exh.description_text as "Item Description",
      exh.quantity_amount as "Quantity",
      -- a date without a time is shown as entered, as in the exhibit list
      case
        when exh.collected_utc_time is null then to_char(exh.collected_utc_date, 'YYYY-MM-DD')
        else to_char(
          (exh.collected_utc_date + exh.collected_utc_time) at time zone 'UTC' at time zone 'America/Vancouver',
          'YYYY-MM-DD HH24:MI'
        )
      end as "Date/Time of Intake (Pacific)",
      exh.property_tag_number as "Property Tag Number",
      exh.location_of_intake_text as "Location of Intake",
      col.last_name || ', ' || col.first_name as "Officer",
      exh.create_utc_timestamp at time zone 'UTC' at time zone 'America/Vancouver' as "Date Logged (Pacific)"
    from
      investigation.exhibit exh
      join investigation.investigation inv on inv.investigation_guid = exh.investigation_guid
      join investigation.investigation_status_code isc on isc.investigation_status_code = inv.investigation_status
      join investigation.task tsk on tsk.task_guid = exh.task_guid
      left join investigation.task_category_type_code tcc on tcc.task_category_type_code = tsk.task_category_type_code
      left join investigation.investigation_source_code src on src.investigation_source_code = inv.investigation_source
      left join shared.cos_geo_org_unit_flat_mvw gfv on gfv.area_code = inv.geo_organization_unit_code_ref
      left join shared.app_user per on per.app_user_guid = inv.primary_investigator_guid_ref
      left join shared.app_user col on col.app_user_guid = exh.collected_by_app_user_guid_ref
    where
      exh.active_ind = true
      and inv.owned_by_agency_ref = 'COS'
    order by
      inv.name asc,
      tsk.task_number asc,
      exh.exhibit_number asc
  ) AS "source"
LIMIT
  1048575