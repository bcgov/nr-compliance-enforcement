-- CE-101 - WebEOC Staging Tables

CREATE TABLE public.staging_activity_code (
	staging_activity_code varchar(10) NOT NULL,
	short_description varchar(50) NOT NULL,
  long_description varchar(250) NULL,
  display_order int4 NOT NULL,
  active_ind bool NOT NULL,
  create_user_id varchar(32) NOT NULL,
  create_utc_timestamp timestamp NOT NULL,
  update_user_id varchar(32) NOT NULL,
  update_utc_timestamp timestamp NOT null,
  CONSTRAINT "PK_staging_activity_code" PRIMARY KEY (staging_activity_code)
);

CREATE TABLE public.staging_status_code (
	staging_status_code varchar(10) NOT NULL,
	short_description varchar(50) NOT NULL,
  long_description varchar(250) NULL,
  display_order int4 NOT NULL,
  active_ind bool NOT NULL,
  create_user_id varchar(32) NOT NULL,
  create_utc_timestamp timestamp NOT NULL,
  update_user_id varchar(32) NOT NULL,
  update_utc_timestamp timestamp NOT NULL,
  CONSTRAINT "PK_staging_status_code" PRIMARY KEY (staging_status_code)
);

CREATE TABLE public.entity_code (
	entity_code varchar(10) NOT NULL,
	short_description varchar(50) NOT NULL,
  long_description varchar(250) NULL,
  display_order int4 NOT NULL,
  active_ind bool NOT NULL,
  create_user_id varchar(32) NOT NULL,
  create_utc_timestamp timestamp NOT NULL,
  update_user_id varchar(32) NOT NULL,
  update_utc_timestamp timestamp NOT null,
  CONSTRAINT "PK_entity_code" PRIMARY KEY (entity_code)
);

create table public.staging_complaint (
	staging_complaint_guid uuid NOT NULL DEFAULT uuid_generate_v4(),
	staging_status_code varchar(10) NOT NULL,
	staging_activity_code varchar(10) NOT NULL,
	complaint_identifier varchar(20) NOT NULL,
	complaint_jsonb jsonb NOT NULL,
  create_user_id varchar(32) NOT NULL,
  create_utc_timestamp timestamp NOT NULL,
  update_user_id varchar(32) NOT NULL,
  update_utc_timestamp timestamp NOT null,
  CONSTRAINT "PK_staging_complaint" PRIMARY KEY (staging_complaint_guid),
  CONSTRAINT "staging_complaint_staging_status_code" FOREIGN KEY (staging_status_code) REFERENCES public.staging_status_code(staging_status_code),
  CONSTRAINT "staging_complaint_staging_staging_activity_code" FOREIGN KEY (staging_activity_code) REFERENCES public.staging_activity_code(staging_activity_code)
);

create table public.staging_metadata_mapping (
	staging_metadata_mapping_guid uuid NOT NULL DEFAULT uuid_generate_v4(),
	entity_code varchar(10) NOT NULL,
	staged_data_value varchar(120) NOT NULL,
	live_data_value varchar(10) NOT NULL,
  create_user_id varchar(32) NOT NULL,
  create_utc_timestamp timestamp NOT NULL,
  update_user_id varchar(32) NOT NULL,
  update_utc_timestamp timestamp NOT null,
  CONSTRAINT "PK_staging_metadata_mapping_guid" PRIMARY KEY (staging_metadata_mapping_guid),
  CONSTRAINT "staging_staging_metadata_mapping_entity_code" FOREIGN KEY (entity_code) REFERENCES public.entity_code(entity_code)
);

CREATE OR REPLACE FUNCTION public.insert_complaint_from_staging(_complaint_identifier character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$ declare complaint_data jsonb;
-- Variable to hold the JSONB data from staging_complaint.  Used to create a new complaint
-- Variables for 'complaint' table
_report_type varchar(120);
_detail_text varchar(4000);
_caller_name varchar(120);
_caller_address varchar(120);
_caller_email varchar(120);
_caller_phone_1 varchar(15);
_caller_phone_2 varchar(15);
_caller_phone_3 varchar(15);
_location_summary_text varchar(120);
_location_detailed_text varchar(4000);
_incident_utc_datetime timestamp;
_create_utc_timestamp timestamp := NOW();
_update_utc_timestamp timestamp := NOW();
_create_userid varchar(200);
_update_userid varchar(200);
_geo_organization_unit_code varchar(10);
_incident_reported_utc_timestmp timestamp;
_location_geometry_point geometry;
-- Variables for 'hwcr_complaint' table
_webeoc_species varchar(200);
_webeoc_hwcr_complaint_nature_code varchar(200);
_webeoc_cos_area_community varchar(200);
_webeoc_attracts_list varchar(1000);
_species_code varchar(10);
_hwcr_complaint_nature_code varchar(10);
_other_attractants_text varchar(4000);
-- used to generate a uuid.  We use this to create the PK in hwcr_complaint, but
-- we need to also use it when creating the attractants
generated_uuid uuid;
-- parsed attractants from the jsonb object
attractants_array text[];
attractant_item text;
_attractant_code varchar(10);
begin -- Fetch the JSONB data from complaint_staging using the provided identifier
select 
  sc.complaint_jsonb into complaint_data 
from 
  staging_complaint sc 
where 
  sc.complaint_identifier = _complaint_identifier 
  and sc.staging_status_code = 'PENDING';
if complaint_data is null then return;
end if;
_report_type := complaint_data ->> 'report_type';
if _report_type is null 
or _report_type <> 'HWCR' then --        raise exception 'Data is not a HWCR complaint for complaint identifier %', _complaint_identifier;
return;
end if;
-- Extract and prepare data for 'complaint' table
_detail_text := left(
  complaint_data ->> 'cos_call_details', 
  3980
) || case when LENGTH(
  complaint_data ->> 'cos_call_details'
) > 3980 then '… DATA TRUNCATED' else '' end;
_caller_name := left(
  complaint_data ->> 'cos_caller_name', 
  100
) || case when LENGTH(
  complaint_data ->> 'cos_caller_name'
) > 100 then '… DATA TRUNCATED' else '' end;
_caller_address := left(
  complaint_data ->> 'caller_address', 
  100
) || case when LENGTH(
  complaint_data ->> 'caller_address'
) > 100 then '… DATA TRUNCATED' else '' end;
_caller_email := left(
  complaint_data ->> 'cos_caller_email', 
  100
) || case when LENGTH(
  complaint_data ->> 'cos_caller_email'
) > 100 then '… DATA TRUNCATED' else '' end;
_caller_phone_1 := left(
  complaint_data ->> 'cos_primary_phone', 
  100
) || case when LENGTH(
  complaint_data ->> 'cos_primary_phone'
) > 100 then '… DATA TRUNCATED' else '' end;
_caller_phone_2 := left(
  complaint_data ->> 'cos_alt_phone', 
  100
) || case when LENGTH(
  complaint_data ->> 'cos_alt_phone'
) > 100 then '… DATA TRUNCATED' else '' end;
_caller_phone_3 := left(
  complaint_data ->> 'cos_alt_phone_2', 
  100
) || case when LENGTH(
  complaint_data ->> 'cos_alt_phone_2'
) > 100 then '… DATA TRUNCATED' else '' end;
_location_summary_text := left(complaint_data ->> 'address', 100) || case when LENGTH(complaint_data ->> 'address') > 100 then '… DATA TRUNCATED' else '' end;
_location_detailed_text := complaint_data ->> 'cos_location_description';
_incident_utc_datetime := (
  complaint_data ->> 'incident_datetime'
):: timestamp at TIME zone 'UTC';
_incident_reported_utc_timestmp := (
  complaint_data ->> 'created_by_datetime'
):: timestamp at TIME zone 'UTC';
_location_geometry_point := coalesce(
  nullif(complaint_data ->> 'location', ''):: geometry, 
  'POINT(0 0)' :: geometry
);
_create_userid := complaint_data ->> 'username';
_update_userid := _create_userid;
_webeoc_cos_area_community := complaint_data ->> 'cos_area_community';
select 
  * 
from 
  public.insert_and_return_code(
    _webeoc_cos_area_community, 'geoorgutcd'
  ) into _geo_organization_unit_code;
-- convert webeoc species to our species code  
_webeoc_species := complaint_data ->> 'species';
select 
  * 
from 
  public.insert_and_return_code(_webeoc_species, 'speciescd') into _species_code;
_webeoc_hwcr_complaint_nature_code := complaint_data ->> 'nature_of_complaint';
select 
  * 
from 
  public.insert_and_return_code(
    _webeoc_hwcr_complaint_nature_code, 
    'cmpltntrcd'
  ) into _hwcr_complaint_nature_code;
-- Insert data into 'complaint' table
insert into public.complaint (
  complaint_identifier, detail_text, 
  caller_name, caller_address, caller_email, 
  caller_phone_1, caller_phone_2, 
  caller_phone_3, location_summary_text, 
  location_detailed_text, incident_utc_datetime, 
  incident_reported_utc_timestmp, 
  create_user_id, create_utc_timestamp, 
  update_user_id, update_utc_timestamp, 
  owned_by_agency_code, complaint_status_code, 
  geo_organization_unit_code, location_geometry_point
) 
values 
  (
    _complaint_identifier, _detail_text, 
    _caller_name, _caller_address, _caller_email, 
    _caller_phone_1, _caller_phone_2, 
    _caller_phone_3, _location_summary_text, 
    _location_detailed_text, _incident_utc_datetime, 
    _incident_reported_utc_timestmp, 
    _create_userid, _create_utc_timestamp, 
    _update_userid, _update_utc_timestamp, 
    'COS', 'OPEN', _geo_organization_unit_code, 
    _location_geometry_point
  );
-- Prepare data for 'hwcr_complaint' table
_other_attractants_text := complaint_data ->> 'attractant_other_text';
select 
  uuid_generate_v4() into generated_uuid;
-- Insert data into 'hwcr_complaint' table
insert into public.hwcr_complaint (
  hwcr_complaint_guid, other_attractants_text, 
  create_user_id, create_utc_timestamp, 
  update_user_id, update_utc_timestamp, 
  complaint_identifier, species_code, 
  hwcr_complaint_nature_code
) 
values 
  (
    generated_uuid, _other_attractants_text, 
    _create_userid, _create_utc_timestamp, 
    _create_userid, _update_utc_timestamp, 
    _complaint_identifier, _species_code, 
    _hwcr_complaint_nature_code
  );
-- Convert the comma-separated list into an array
attractants_array := string_to_array(
  complaint_data ->> 'attractants_list', 
  ','
);
-- Iterate over the array
foreach attractant_item in array attractants_array loop -- Trim whitespace and check if the item is 'Not Applicable'
if TRIM(attractant_item) <> 'Not Applicable' then -- Your insertion logic here

select 
  * 
from 
  public.insert_and_return_code(
    TRIM(attractant_item), 'atractntcd'
  ) into _attractant_code;


insert into public.attractant_hwcr_xref (
  attractant_code, hwcr_complaint_guid, 
  create_user_id, create_utc_timestamp, 
  update_user_id, update_utc_timestamp
) 
values 
  (
    _attractant_code, 
    generated_uuid, 
    'webeoc', 
    _create_utc_timestamp, 
    'webeoc', 
    _update_utc_timestamp
  );
end if;
end loop;
update 
  staging_complaint 
set 
  staging_status_code = 'SUCCESS' 
where 
  complaint_identifier = _complaint_identifier;
exception when others then raise notice 'An unexpected error occurred: %', 
sqlerrm;
update 
  staging_complaint 
set 
  staging_status_code = 'ERROR' 
where 
  complaint_identifier = _complaint_identifier;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.insert_and_return_code(webeoc_value character varying, code_table_type character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    truncated_code VARCHAR(10);
    live_code_value VARCHAR;
    current_utc_timestamp TIMESTAMP WITH TIME ZONE := NOW();
    target_code_table VARCHAR;
    column_name VARCHAR;
BEGIN
    -- Truncate and uppercase the webEOC value
    truncated_code := UPPER(LEFT(webEOC_value, 10));
   
    IF truncated_code IS NULL OR truncated_code = '' THEN
        RETURN NULL;
    END IF;
    
    -- Resolve the target code table and column name based on code_table_type
    CASE code_table_type
        WHEN 'reprtdbycd' THEN
            target_code_table := 'reported_by_code';
            column_name := 'reported_by_code'; -- Adjust as necessary
        WHEN 'geoorgutcd' THEN
            target_code_table := 'geo_organization_unit_code';
            column_name := 'geo_organization_unit_code'; -- Adjust as necessary
        WHEN 'speciescd' THEN
            target_code_table := 'species_code';
            column_name := 'species_code'; -- Adjust as necessary
        WHEN 'cmpltntrcd' THEN
            target_code_table := 'hwcr_complaint_nature_code';
            column_name := 'hwcr_complaint_nature_code'; -- Adjust as necessary
        WHEN 'atractntcd' THEN
            target_code_table := 'attractant_code';
            column_name := 'attractant_code'; -- Adjust as necessary
        ELSE RAISE EXCEPTION 'Invalid code_table_type provided: %', code_table_type;
    END CASE;
    
    -- Check if the code exists in staging_metadata_mapping
    SELECT live_data_value INTO live_code_value
    FROM staging_metadata_mapping
    WHERE UPPER(LEFT(staged_data_value, 10)) = truncated_code
    AND entity_code = code_table_type;
    
    -- If the code exists, return the live_data_value
    IF live_code_value IS NOT NULL THEN
        RETURN live_code_value;
    END IF;

    -- Insert the new code into the specified code table
    EXECUTE format('INSERT INTO %I (%I, short_description, long_description, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp, display_order) VALUES ($1, $2, $3, ''Y'', ''webeoc'', $4, ''webeoc'', $4, $5)', target_code_table, column_name)
    USING truncated_code, webEOC_value, webEOC_value, current_utc_timestamp, 2;
    
    -- Insert the new code into staging_metadata_mapping
    INSERT INTO staging_metadata_mapping (entity_code, staged_data_value, live_data_value, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
    VALUES (code_table_type, truncated_code, truncated_code, 'webeoc', current_utc_timestamp, 'webeoc', current_utc_timestamp);
    
    -- Return the newly created code
    RETURN truncated_code;
END;
$function$
;
