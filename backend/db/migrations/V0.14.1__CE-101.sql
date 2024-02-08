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
AS $function$
DECLARE
    complaint_data jsonb; -- Variable to hold the JSONB data from staging_complaint.  Used to create a new complaint

    -- Variables for 'complaint' table
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
    _species_code varchar(10);
    _hwcr_complaint_nature_code varchar(10);
    _other_attractants_text varchar(4000);
BEGIN
    -- Fetch the JSONB data from complaint_staging using the provided identifier
    SELECT sc.complaint_jsonb  INTO complaint_data
    FROM staging_complaint sc
    WHERE sc.complaint_identifier = _complaint_identifier;

    IF complaint_data IS NULL THEN
        RAISE EXCEPTION 'No data found for complaint identifier %', _complaint_identifier;
    END IF;

    -- Extract and prepare data for 'complaint' table
    _detail_text := LEFT(complaint_data->>'cos_call_details', 3980) || CASE WHEN LENGTH(complaint_data->>'cos_call_details') > 3980 THEN '… DATA TRUNCATED' ELSE '' END;
    _caller_name := LEFT(complaint_data->>'cos_caller_name', 100) || CASE WHEN LENGTH(complaint_data->>'cos_caller_name') > 100 THEN '… DATA TRUNCATED' ELSE '' END;
    _caller_address := LEFT(complaint_data->>'caller_address', 100) || CASE WHEN LENGTH(complaint_data->>'caller_address') > 100 THEN '… DATA TRUNCATED' ELSE '' END;
    _caller_email := LEFT(complaint_data->>'cos_caller_email', 100) || CASE WHEN LENGTH(complaint_data->>'cos_caller_email') > 100 THEN '… DATA TRUNCATED' ELSE '' END;
    _caller_phone_1 := LEFT(complaint_data->>'cos_primary_phone', 100) || CASE WHEN LENGTH(complaint_data->>'cos_primary_phone') > 100 THEN '… DATA TRUNCATED' ELSE '' END;
    _caller_phone_2 := LEFT(complaint_data->>'cos_alt_phone', 100) || CASE WHEN LENGTH(complaint_data->>'cos_alt_phone') > 100 THEN '… DATA TRUNCATED' ELSE '' END;
    _caller_phone_3 := LEFT(complaint_data->>'cos_alt_phone_2', 100) || CASE WHEN LENGTH(complaint_data->>'cos_alt_phone_2') > 100 THEN '… DATA TRUNCATED' ELSE '' END;
    _location_summary_text := LEFT(complaint_data->>'address', 100) || CASE WHEN LENGTH(complaint_data->>'address') > 100 THEN '… DATA TRUNCATED' ELSE '' END;
    _location_detailed_text := complaint_data->>'cos_location_description';
    _incident_utc_datetime := (complaint_data->>'incident_datetime')::timestamp AT TIME ZONE 'UTC';
    _incident_reported_utc_timestmp := (complaint_data->>'created_by_datetime')::timestamp AT TIME ZONE 'UTC';
    _location_geometry_point := (complaint_data->>'location')::geometry;
    
    _create_userid := complaint_data->>'username';
    _update_userid := _create_userid;

    _webeoc_cos_area_community := complaint_data->>'cos_area_community';
    SELECT smm.live_data_value INTO _geo_organization_unit_code
    FROM staging_metadata_mapping smm 
    WHERE smm.entity_code = 'geoorgutcd' and smm.staged_data_value = _webeoc_cos_area_community;

   
    -- Insert data into 'complaint' table
    INSERT INTO public.complaint (
        complaint_identifier, detail_text, caller_name, caller_address, caller_email,
        caller_phone_1, caller_phone_2, caller_phone_3, location_summary_text,
        location_detailed_text, incident_utc_datetime, incident_reported_utc_timestmp, create_user_id, create_utc_timestamp, update_user_id ,update_utc_timestamp, owned_by_agency_code, complaint_status_code, geo_organization_unit_code, location_geometry_point
    ) VALUES (
        _complaint_identifier, _detail_text, _caller_name, _caller_address, _caller_email,
        _caller_phone_1, _caller_phone_2, _caller_phone_3, _location_summary_text,
        _location_detailed_text, _incident_utc_datetime, _incident_reported_utc_timestmp, _create_userid, _create_utc_timestamp, _update_userid, _update_utc_timestamp, 'COS', 'OPEN', _geo_organization_unit_code, _location_geometry_point
    );

    -- Prepare data for 'hwcr_complaint' table
 
   
    -- convert webeoc species to our species code	
    _webeoc_species := complaint_data->>'species';
    SELECT smm.live_data_value INTO _species_code
    FROM staging_metadata_mapping smm 
    WHERE smm.entity_code = 'speciescd' and smm.staged_data_value = _webeoc_species;
    
    _webeoc_hwcr_complaint_nature_code := complaint_data->>'nature_of_complaint';
    SELECT smm.live_data_value INTO _hwcr_complaint_nature_code
    FROM staging_metadata_mapping smm 
    WHERE smm.entity_code = 'cmpltntrcd' and smm.staged_data_value = _webeoc_hwcr_complaint_nature_code;
   
   
    _other_attractants_text := complaint_data->>'attractant_other_text';

    -- Insert data into 'hwcr_complaint' table
    INSERT INTO public.hwcr_complaint (
        hwcr_complaint_guid, other_attractants_text, create_user_id, create_utc_timestamp,
        update_user_id, update_utc_timestamp, complaint_identifier, species_code, hwcr_complaint_nature_code
    ) VALUES (
        uuid_generate_v4(), _other_attractants_text, _create_userid, _create_utc_timestamp,
        _create_userid, _update_utc_timestamp, _complaint_identifier, _species_code, _hwcr_complaint_nature_code
    );
END;
$function$
;



-- comments
