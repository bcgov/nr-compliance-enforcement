SELECT
  "source"."Complaint Identifier" AS "Complaint Identifier",
  "source"."Park" AS "Park",
  "source"."Complaint Type" AS "Complaint Type",
  "source"."Referred to agency" AS "Referred to agency",
  "source"."Referred by agency" AS "Referred by agency",
  "source"."Referral date" AS "Referral date",
  "source"."Date Logged (Pacific)" AS "Date Logged (Pacific)",
  "source"."Incident Datetime (Pacific)" AS "Incident Datetime (Pacific)",
  "source"."Complaint Status" AS "Complaint Status",
  "source"."Species" AS "Species",
  "source"."Original Species" AS "Original Species",
  "source"."Nature of Complaint" AS "Nature of Complaint",
  "source"."Number of Updates" AS "Number of Updates",
  "source"."Update Logged Date" AS "Update Logged Date",
  "source"."Area/Community" AS "Area/Community",
  "source"."District" AS "District",
  "source"."Zone" AS "Zone",
  "source"."Region" AS "Region",
  "source"."Longitude (X)" AS "Longitude (X)",
  "source"."Latitude (Y)" AS "Latitude (Y)",
  "source"."Officer Assigned" AS "Officer Assigned",
  "source"."COORS Number" AS "COORS Number"
FROM
  (
    -----------------------------------------------------
    -- Monthly HWCR Complaint Export query to be run for COS statistics
    -- see https://github.com/bcgov/nr-compliance-enforcement/wiki/Data-Exports for more information
    -----------------------------------------------------
    select
      distinct cmp.complaint_identifier as "Complaint Identifier",
      p.name as "Park",
      case
        when hwc.complaint_identifier is not null then 'HWCR'
        else 'Unknown'
      end as "Complaint Type",
      case
        when crf.referred_to_agency_code_ref = 'EPO' then 'CEEB'
        else crf.referred_to_agency_code_ref
      end as "Referred to agency",
      case
        when crf.referred_by_agency_code_ref = 'EPO' then 'CEEB'
        else crf.referred_by_agency_code_ref
      end as "Referred by agency",
      to_char(
        crf.referral_date AT TIME ZONE 'UTC' AT TIME ZONE 'America/Vancouver',
        'YYYY-MM-DD HH24:MI'
      ) as "Referral date",
		  cmp.incident_reported_utc_timestmp at time zone 'UTC' at time zone 'America/Vancouver' as "Date Logged (Pacific)",
		  (cmp.incident_utc_date + cmp.incident_utc_time) at time zone 'UTC' at time zone 'America/Vancouver' as "Incident Datetime (Pacific)",
		  cmp.update_utc_timestamp at time zone 'UTC' at time zone 'America/Vancouver' as "Last Updated (Pacific)",
      cst.short_description as "Complaint Status",
      spc.short_description as "Species",
      case
        when coalesce(
          hch.data_after_executed_operation ->> 'species_code_ref',
          hch.data_after_executed_operation ->> 'species_code'
        ) != hwc.species_code_ref THEN prev_spc.short_description
        else ''
      END AS "Original Species",
      hnc.long_description as "Nature of Complaint",
      coalesce (cup.update_count, 0) as "Number of Updates",
      cu.create_utc_timestamp as "Update Logged Date",
      goc.short_description as "Area/Community",
      gfv.offloc_name as "District",
      gfv.zone_name as "Zone",
      gfv.region_name as "Region",
      ST_X(cmp.location_geometry_point) AS "Longitude (X)",
      -- Note when running locally postgis is installed in the public schema
      ST_Y(cmp.location_geometry_point) AS "Latitude (Y)",
      per.last_name || ', ' || per.first_name as "Officer Assigned",
      cmp.reference_number as "COORS Number"
    from
      complaint.complaint cmp
      join complaint.complaint_status_code cst on cst.complaint_status_code = cmp.complaint_status_code
      join shared.geo_organization_unit_code goc on goc.geo_organization_unit_code = cmp.geo_organization_unit_code
      join shared.cos_geo_org_unit_flat_mvw gfv on gfv.area_code = goc.geo_organization_unit_code
      left join complaint.complaint_referral crf on crf.complaint_identifier = cmp.complaint_identifier
      left join complaint.app_user_complaint_xref pcx on pcx.complaint_identifier = cmp.complaint_identifier
      and pcx.active_ind = true
      and pcx.app_user_complaint_xref_code = 'ASSIGNEE'
      left join shared.app_user per on per.app_user_guid = pcx.app_user_guid_ref
      right join complaint.hwcr_complaint hwc on hwc.complaint_identifier = cmp.complaint_identifier
      left join shared.species_code spc on spc.species_code = hwc.species_code_ref
      left join complaint.hwcr_complaint_nature_code hnc on hnc.hwcr_complaint_nature_code = hwc.hwcr_complaint_nature_code
      left join (
        select
          complaint_identifier,
          count(*) as update_count
        from
          complaint.complaint_update
        group by
          complaint_identifier
      ) cup on cup.complaint_identifier = cmp.complaint_identifier
      left join complaint.complaint_update cu ON cu.complaint_identifier = cmp.complaint_identifier
     
LEFT JOIN complaint.hwcr_complaint_h hch ON hch.target_row_id = hwc.hwcr_complaint_guid
     
   AND hch.operation_type = 'I'
      LEFT JOIN shared.species_code prev_spc ON prev_spc.species_code = coalesce(
        hch.data_after_executed_operation ->> 'species_code_ref',
        hch.data_after_executed_operation ->> 'species_code'
      )
      LEFT JOIN shared.park p on cmp.park_guid = p.park_guid
    where
      cmp.owned_by_agency_code_ref = 'PARKS'
      or crf.referred_by_agency_code_ref = 'PARKS'
    order by
      cmp.complaint_identifier asc
  ) AS "source"
LIMIT
  1048575