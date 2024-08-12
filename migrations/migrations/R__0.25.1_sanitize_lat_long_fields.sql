CREATE OR REPLACE FUNCTION public.validate_coordinate_field(coordinate_field text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
    formatted_coordinate_field TEXT;
BEGIN
    -- Confirm the coordinate_field is a valid value 
    formatted_coordinate_field := regexp_matches(coordinate_field, '^[-+]?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})', 'g');
    IF (formatted_coordinate_field IS NULL or (length(formatted_coordinate_field) = 0)) then
		return NULL;
	-- Valid match so return the value entered
	else return coordinate_field;
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.insert_complaint_from_staging(_complaint_identifier character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
  declare
    WEBEOC_USER_ID CONSTANT varchar(6) := 'webeoc';
    WEBEOC_UPDATE_TYPE_INSERT CONSTANT varchar(6) := 'INSERT';
    STAGING_STATUS_CODE_PENDING CONSTANT varchar(7) := 'PENDING';
    STAGING_STATUS_CODE_SUCCESS CONSTANT varchar(7) := 'SUCCESS' ;
    STAGING_STATUS_CODE_ERROR CONSTANT varchar(5) := 'ERROR';
    
    -- jsonb attribute names
    jsonb_cos_primary_phone CONSTANT text := 'cos_primary_phone';
    jsonb_cos_alt_phone CONSTANT text := 'cos_alt_phone';
    jsonb_cos_alt_phone_2 CONSTANT text := 'cos_alt_phone_2';
   

   
    complaint_data jsonb;
    -- Variable to hold the JSONB data from staging_complaint.  Used to create a new complaint
    -- Variables for 'complaint' table
    _report_type            VARCHAR(120);
    _detail_text            TEXT;
    _caller_name            VARCHAR(120);
    _caller_address         VARCHAR(120);
    _caller_email           VARCHAR(120);
    _caller_phone_1         VARCHAR(15);
    _caller_phone_2         VARCHAR(15);
    _caller_phone_3         VARCHAR(15);
    _location_summary_text  VARCHAR(120);
    _location_detailed_text VARCHAR(4000);
    _incident_utc_datetime timestamp;
    _create_utc_timestamp timestamp := (now() AT TIME zone 'UTC');
    _update_utc_timestamp timestamp := (now() AT TIME zone 'UTC');
    _create_userid              VARCHAR(200);
    _update_userid              VARCHAR(200);
    _geo_organization_unit_code VARCHAR(10);
    _incident_reported_utc_timestmp timestamp;
    _address_coordinates_lat VARCHAR(200);
    _address_coordinates_long VARCHAR(200);
    _location_geometry_point GEOMETRY;
    _complaint_status_code VARCHAR(10);

    -- Variables for 'hwcr_complaint' table
    _webeoc_species                    VARCHAR(200);
    _webeoc_hwcr_complaint_nature_code VARCHAR(200);
    _webeoc_cos_area_community         VARCHAR(200);
    _webeoc_attracts_list              VARCHAR(1000);
    _species_code                      VARCHAR(10);
    _hwcr_complaint_nature_code        VARCHAR(10);
    _other_attractants_text            VARCHAR(4000);
    _cos_reffered_by_txt               VARCHAR(4000);
    _webeoc_cos_reffered_by_lst        VARCHAR(200);
    _cos_reffered_by_lst               VARCHAR(200);
    _in_progress_ind                   VARCHAR(3);
    _observed_ind                      VARCHAR(3);
    _in_progress_ind_bool bool;
    _observed_ind_bool bool;
    _suspect_witnesss_dtl_text VARCHAR(4000);
    _violation_code            VARCHAR(10);
    -- used to generate a uuid.  We use this to create the PK in hwcr_complaint, but
    -- we need to also use it when creating the attractants
    generated_uuid uuid;
    -- parsed attractants from the jsonb object
    attractants_array text[];
    attractant_item text;
    _attractant_code VARCHAR(10);
  BEGIN -- Fetch the JSONB data from complaint_staging using the provided identifier
    SELECT sc.complaint_jsonb
    INTO   complaint_data
    FROM   staging_complaint sc
    WHERE  sc.complaint_identifier = _complaint_identifier
    AND    sc.staging_status_code = STAGING_STATUS_CODE_PENDING -- meaning that this complaint hasn't yet been moved to the complaint table yet
    AND    sc.staging_activity_code = WEBEOC_UPDATE_TYPE_INSERT; -- this means that we're dealing with a new complaint from webeoc, not an update
    
    IF complaint_data IS NULL THEN
      RETURN;
    END IF;
    _report_type := complaint_data ->> 'report_type';

   -- Extract and prepare data for 'complaint' table
   _detail_text := complaint_data ->> 'cos_call_details';
    _caller_name := left( complaint_data ->> 'cos_caller_name', 100 )
    ||
    CASE
    WHEN length( complaint_data ->> 'cos_caller_name' ) > 100 THEN
      '… DATA TRUNCATED'
    ELSE
      ''
    END;
    _caller_address := left( complaint_data ->> 'caller_address', 100 )
    ||
    CASE
    WHEN length( complaint_data ->> 'caller_address' ) > 100 THEN
      '… DATA TRUNCATED'
    ELSE
      ''
    END;
    _caller_email := left( complaint_data ->> 'cos_caller_email', 100 )
    ||
    CASE
    WHEN length( complaint_data ->> 'cos_caller_email' ) > 100 THEN
      '… DATA TRUNCATED'
    ELSE
      ''
    END;

    _detail_text := complaint_data ->> 'cos_call_details';
	
    -- phone numbers must be formatted as +1##########.  
    -- If the numbers from webeoc contain non-numeric characters, strip those and 
    -- add the + (or +1) prefix
   
	_caller_phone_1 := format_phone_number(complaint_data ->> jsonb_cos_primary_phone);
	_caller_phone_2 := format_phone_number(complaint_data ->> jsonb_cos_alt_phone);
	_caller_phone_3 := format_phone_number(complaint_data ->> jsonb_cos_alt_phone_2);
  _complaint_status_code := UPPER(complaint_data ->> 'status');
	   
    _location_summary_text := left(complaint_data ->> 'address', 100)
    ||
    CASE
    WHEN length(complaint_data ->> 'address') > 100 THEN
      '… DATA TRUNCATED'
    ELSE
      ''
    END;
    _location_detailed_text := complaint_data ->> 'cos_location_description';
    _incident_utc_datetime := ( complaint_data ->> 'incident_datetime' ):: timestamp AT            TIME zone 'America/Los_Angeles';
    _incident_reported_utc_timestmp := ( complaint_data ->> 'created_by_datetime' ):: timestamp AT TIME zone 'America/Los_Angeles';
	  _address_coordinates_lat := validate_coordinate_field(complaint_data ->> 'address_coordinates_lat');
    _address_coordinates_long := validate_coordinate_field(complaint_data ->> 'address_coordinates_long');
   
    -- Create a geometry point based on the latitude and longitude
    IF _address_coordinates_lat IS NOT NULL AND _address_coordinates_lat <> '' AND
       _address_coordinates_long IS NOT NULL AND _address_coordinates_long <> '' THEN
        _location_geometry_point := ST_SetSRID(
            ST_MakePoint(
                CAST(_address_coordinates_long AS NUMERIC),
                CAST(_address_coordinates_lat AS NUMERIC)
            ),
            4326
        );
    ELSE
    	_location_geometry_point := ST_SetSRID(ST_MakePoint(0, 0), 4326);
	END IF;

    _create_userid := substring(complaint_data ->> 'username' from 1 for 32);
    _update_userid := _create_userid;
    _webeoc_cos_area_community := complaint_data ->> 'cos_area_community';
    _webeoc_cos_reffered_by_lst := complaint_data ->> 'cos_reffered_by_lst';
    _cos_reffered_by_txt := left(complaint_data ->> '_cos_reffered_by_txt',120);
    SELECT *
    FROM   PUBLIC.insert_and_return_code( _webeoc_cos_reffered_by_lst, 'reprtdbycd' )
    INTO   _cos_reffered_by_lst;
    
    SELECT *
    FROM   PUBLIC.insert_and_return_code( _webeoc_cos_area_community, 'geoorgutcd' )
    INTO   _geo_organization_unit_code;
    
    -- Insert data into 'complaint' table
    INSERT INTO PUBLIC.complaint
                (
                            complaint_identifier,
                            detail_text,
                            caller_name,
                            caller_address,
                            caller_email,
                            caller_phone_1,
                            caller_phone_2,
                            caller_phone_3,
                            location_summary_text,
                            location_detailed_text,
                            incident_utc_datetime,
                            incident_reported_utc_timestmp,
                            create_user_id,
                            create_utc_timestamp,
                            update_user_id,
                            update_utc_timestamp,
                            owned_by_agency_code,
                            complaint_status_code,
                            geo_organization_unit_code,
                            location_geometry_point,
                            reported_by_code,
                            reported_by_other_text
                )
                VALUES
                (
                            _complaint_identifier,
                            _detail_text,
                            _caller_name,
                            _caller_address,
                            _caller_email,
                            _caller_phone_1,
                            _caller_phone_2,
                            _caller_phone_3,
                            _location_summary_text,
                            _location_detailed_text,
                            _incident_utc_datetime,
                            _incident_reported_utc_timestmp,
                            _create_userid,
                            _create_utc_timestamp,
                            _update_userid,
                            _update_utc_timestamp,
                            'COS',
                            _complaint_status_code,
                            _geo_organization_unit_code,
                            _location_geometry_point,
                            _cos_reffered_by_lst,
                            _cos_reffered_by_txt
                );
    
    IF _report_type = 'HWCR' then
    
      -- convert webeoc species to our species code
	  _webeoc_species := complaint_data ->> 'species';
	  SELECT *
	  FROM   PUBLIC.insert_and_return_code(_webeoc_species, 'speciescd')
	  INTO   _species_code;
	    
	  _webeoc_hwcr_complaint_nature_code := complaint_data ->> 'nature_of_complaint';
	  SELECT *
	  FROM   PUBLIC.insert_and_return_code( _webeoc_hwcr_complaint_nature_code, 'cmpltntrcd' )
	  INTO   _hwcr_complaint_nature_code;
    
      -- Prepare data for 'hwcr_complaint' table
      _other_attractants_text := complaint_data ->> 'attractant_other_text';
      SELECT uuid_generate_v4()
      INTO   generated_uuid;
      
      -- Insert data into 'hwcr_complaint' table
      INSERT INTO PUBLIC.hwcr_complaint
                  (
                              hwcr_complaint_guid,
                              other_attractants_text,
                              create_user_id,
                              create_utc_timestamp,
                              update_user_id,
                              update_utc_timestamp,
                              complaint_identifier,
                              species_code,
                              hwcr_complaint_nature_code
                  )
                  VALUES
                  (
                              generated_uuid,
                              _other_attractants_text,
                              _create_userid,
                              _create_utc_timestamp,
                              _create_userid,
                              _update_utc_timestamp,
                              _complaint_identifier,
                              _species_code,
                              _hwcr_complaint_nature_code
                  );
      
      -- Convert the comma-separated list into an array
      attractants_array := string_to_array( complaint_data ->> 'attractants_list', ',' );
      -- Iterate over the array
      foreach attractant_item IN ARRAY attractants_array
      LOOP                                                -- Trim whitespace and check if the item is 'Not Applicable'
        IF trim(attractant_item) <> 'Not Applicable' THEN -- Your insertion logic here
          SELECT *
          FROM   PUBLIC.insert_and_return_code( trim(attractant_item), 'atractntcd' )
          INTO   _attractant_code;
          
          INSERT INTO PUBLIC.attractant_hwcr_xref
                      (
                                  attractant_code,
                                  hwcr_complaint_guid,
                                  create_user_id,
                                  create_utc_timestamp,
                                  update_user_id,
                                  update_utc_timestamp
                      )
                      VALUES
                      (
                                  _attractant_code,
                                  generated_uuid,
                                  WEBEOC_USER_ID,
                                  _create_utc_timestamp,
                                  WEBEOC_USER_ID,
                                  _update_utc_timestamp
                      );
        
        END IF;
      END LOOP;
    ELSIF _report_type = 'ERS' THEN
      -- Extract and prepare data for 'allegation_complaint' table
      _in_progress_ind := (complaint_data->>'violation_in_progress');
      _observed_ind := (complaint_data->>'observe_violation');
      _suspect_witnesss_dtl_text := complaint_data->>'suspect_details';
      SELECT *
      FROM   PUBLIC.insert_and_return_code( complaint_data->>'violation_type', 'violatncd' )
      INTO   _violation_code;
      
      IF _in_progress_ind = 'Yes' THEN
        _in_progress_ind_bool := TRUE;
      ELSE
        _in_progress_ind_bool := FALSE;
      END IF;
      IF _observed_ind = 'Yes' THEN
        _observed_ind_bool := TRUE;
      ELSE
        _observed_ind_bool := FALSE;
      END IF;

      IF _violation_code = 'WASTE' OR _violation_code = 'PESTICDE' THEN
        UPDATE PUBLIC.complaint
        SET    owned_by_agency_code = 'EPO'
        WHERE  complaint_identifier = _complaint_identifier;
      END IF;

      -- Insert data into 'allegation_complaint' table
      INSERT INTO PUBLIC.allegation_complaint
                  (
                  			  allegation_complaint_guid,
                              in_progress_ind,
                              observed_ind,
                              suspect_witnesss_dtl_text,
                              create_user_id,
                              create_utc_timestamp,
                              update_user_id,
                              update_utc_timestamp,
                              complaint_identifier,
                              violation_code
                  )
                  VALUES
                  (
                  			  uuid_generate_v4(),
                              _in_progress_ind_bool,
                              _observed_ind_bool,
                              _suspect_witnesss_dtl_text,
                              _create_userid,
                              _create_utc_timestamp,
                              _update_userid,
                              _update_utc_timestamp,
                              _complaint_identifier,
                              _violation_code
                  );
    
    END IF;
   
    UPDATE staging_complaint
    SET    staging_status_code = STAGING_STATUS_CODE_SUCCESS
    WHERE  complaint_identifier = _complaint_identifier
    AND    staging_activity_code = WEBEOC_UPDATE_TYPE_INSERT;
  
  EXCEPTION
  WHEN OTHERS THEN
    RAISE notice 'An unexpected error occurred: %', SQLERRM;
    UPDATE staging_complaint
    SET    staging_status_code = STAGING_STATUS_CODE_ERROR
    WHERE  complaint_identifier = _complaint_identifier
    and staging_status_code = STAGING_STATUS_CODE_PENDING
    AND    staging_activity_code = WEBEOC_UPDATE_TYPE_INSERT;
  
  END;
  $function$
;

CREATE OR REPLACE FUNCTION public.log_complaint_update(_complaint_identifier character varying, update_complaint_data jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    -- Variables for the current complaint record and the previous update record
    current_complaint_record PUBLIC.complaint;
    prev_complaint_update_record PUBLIC.complaint_update;

    -- Variables for 'complaint_update' table
    _upd_detail_text TEXT;
    _upd_location_summary_text VARCHAR(120);
    _upd_location_detailed_text VARCHAR(4000);
    _update_address_coordinates_lat VARCHAR(200);
    _update_address_coordinates_long VARCHAR(200);
    _upd_location_geometry_point GEOMETRY;
    _create_utc_timestamp TIMESTAMP := (NOW() AT TIME ZONE 'UTC');
    _update_utc_timestamp TIMESTAMP := (NOW() AT TIME ZONE 'UTC');
    _create_userid VARCHAR(200);
    _update_userid VARCHAR(200);
    _update_number INT4 = (update_complaint_data ->> 'update_number') ::INT;
    _update_number_exists BOOLEAN:= false; -- is this an update for a complaint with an update_number that already exists?  if so, edit it
    
    -- Variables for storing the changes to be inserted
    insert_upd_detail_text TEXT;
    insert_upd_location_summary_text VARCHAR(120);
    insert_upd_location_detailed_text VARCHAR(4000);
    insert_upd_location_geometry_point GEOMETRY;
    
    -- Flag to indicate if there's any difference
    has_difference BOOLEAN := FALSE;
   
    USERNAME_TXT CONSTANT varchar(8) = 'username';
BEGIN
    -- Get the current state of the complaint
    SELECT *
    INTO current_complaint_record
    FROM PUBLIC.complaint
    WHERE complaint_identifier = _complaint_identifier;

    -- Get the previous update, if any
    SELECT *
    INTO prev_complaint_update_record
    FROM PUBLIC.complaint_update
    WHERE complaint_identifier = _complaint_identifier
    ORDER BY update_seq_number DESC
    LIMIT 1;
   
   select exists (
     select 1
     from PUBLIC.complaint_update cu
	 where complaint_identifier = _complaint_identifier and update_seq_number = _update_number
   ) into _update_number_exists;

    -- Extract and prepare data for 'complaint_update' table
    _upd_detail_text := update_complaint_data ->> 'update_call_details';
    _upd_location_summary_text := update_complaint_data ->> 'update_address';
    _upd_location_detailed_text := update_complaint_data ->> 'update_location_description';
    _update_address_coordinates_lat := validate_coordinate_field(update_complaint_data ->> 'update_address_coordinates_lat');
    _update_address_coordinates_long := validate_coordinate_field(update_complaint_data ->> 'update_address_coordinates_long');
    _create_userid := substring(update_complaint_data ->> USERNAME_TXT from 1 for 32);
    _update_userid := substring(update_complaint_data ->> USERNAME_TXT from 1 for 32);

    -- Create a geometry point based on the latitude and longitude
    IF _update_address_coordinates_lat IS NOT NULL AND _update_address_coordinates_lat <> '' AND
       _update_address_coordinates_long IS NOT NULL AND _update_address_coordinates_long <> '' THEN
        _upd_location_geometry_point := ST_SetSRID(
            ST_MakePoint(
                CAST(_update_address_coordinates_long AS NUMERIC),
                CAST(_update_address_coordinates_lat AS NUMERIC)
            ),
            4326
        );
    END IF;

    -- Compare update_complaint_data against current_complaint_record and prev_complaint_update_record
    IF (_upd_detail_text IS NOT NULL AND _upd_detail_text <> '' AND
        (_upd_detail_text IS DISTINCT FROM prev_complaint_update_record.upd_detail_text OR prev_complaint_update_record.upd_detail_text IS NULL) AND
        (_upd_detail_text IS DISTINCT FROM current_complaint_record.detail_text OR current_complaint_record.detail_text IS NULL)) THEN
        insert_upd_detail_text := _upd_detail_text;
        has_difference := TRUE;
    ELSE
        insert_upd_detail_text := NULL;
    END IF;

    IF (_upd_location_summary_text IS NOT NULL AND _upd_location_summary_text <> '' AND
        (_upd_location_summary_text IS DISTINCT FROM prev_complaint_update_record.upd_location_summary_text OR prev_complaint_update_record.upd_location_summary_text IS NULL) AND
        (_upd_location_summary_text IS DISTINCT FROM current_complaint_record.location_summary_text OR current_complaint_record.location_summary_text IS NULL)) THEN
        insert_upd_location_summary_text := _upd_location_summary_text;
        has_difference := TRUE;
    ELSE
        insert_upd_location_summary_text := NULL;
    END IF;

    IF (_upd_location_detailed_text IS NOT NULL AND _upd_location_detailed_text <> '' AND
        (_upd_location_detailed_text IS DISTINCT FROM prev_complaint_update_record.upd_location_detailed_text OR prev_complaint_update_record.upd_location_detailed_text IS NULL) AND
        (_upd_location_detailed_text IS DISTINCT FROM current_complaint_record.location_detailed_text OR current_complaint_record.location_detailed_text IS NULL)) THEN
        insert_upd_location_detailed_text := _upd_location_detailed_text;
        has_difference := TRUE;
    ELSE
        insert_upd_location_detailed_text := NULL;
    END IF;

    IF (_upd_location_geometry_point IS NOT NULL AND
        (_upd_location_geometry_point IS DISTINCT FROM prev_complaint_update_record.upd_location_geometry_point OR prev_complaint_update_record.upd_location_geometry_point IS NULL) AND
        (_upd_location_geometry_point IS DISTINCT FROM current_complaint_record.location_geometry_point OR current_complaint_record.location_geometry_point IS NULL)) THEN
        insert_upd_location_geometry_point := _upd_location_geometry_point;
        has_difference := TRUE;
    ELSE
        insert_upd_location_geometry_point := NULL;
    END IF;

    -- Insert the record if there are any differences, either log the complaint or update the previously existing complaint
    IF has_difference then
    	if _update_number_exists then
	    	UPDATE PUBLIC.complaint_update 
	    		set upd_detail_text = insert_upd_detail_text,
		            upd_location_summary_text = insert_upd_location_summary_text,
		            upd_location_detailed_text = insert_upd_location_detailed_text,
		            upd_location_geometry_point = insert_upd_location_geometry_point,
		            update_user_id = _update_userid,
		            update_utc_timestamp = _update_utc_timestamp
		   where complaint_identifier = _complaint_identifier and update_seq_number = _update_number;
    	else
    	
	        INSERT INTO PUBLIC.complaint_update (
	            complaint_identifier,
	            update_seq_number,
	            upd_detail_text,
	            upd_location_summary_text,
	            upd_location_detailed_text,
	            upd_location_geometry_point,
	            create_user_id,
	            create_utc_timestamp,
	            update_user_id,
	            update_utc_timestamp
	        ) VALUES (
	            _complaint_identifier,
	            _update_number,
	            insert_upd_detail_text,
	            insert_upd_location_summary_text,
	            insert_upd_location_detailed_text,
	            insert_upd_location_geometry_point,
	            _create_userid,
	            _create_utc_timestamp,
	            _update_userid,
	            _update_utc_timestamp
	        );
       end if;
       
       -- Update timestamp to latest
       UPDATE PUBLIC.complaint
       SET    update_utc_timestamp = _update_utc_timestamp, update_user_id = _update_userid
       WHERE  complaint_identifier = _complaint_identifier;
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.edit_complaint_using_webeoc_complaint(_complaint_identifier character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    WEBEOC_USER_ID CONSTANT varchar(6) := 'webeoc';
    WEBEOC_UPDATE_TYPE_INSERT CONSTANT varchar(6) := 'INSERT';
    STAGING_STATUS_CODE_PENDING CONSTANT varchar(7) := 'PENDING';
    STAGING_STATUS_CODE_SUCCESS CONSTANT varchar(7) := 'SUCCESS' ;
    STAGING_STATUS_CODE_EDIT CONSTANT varchar(6) := 'EDIT' ;
    STAGING_STATUS_CODE_ERROR CONSTANT varchar(5) := 'ERROR';
   
	current_complaint_record PUBLIC.complaint; -- record being edited
	allegation_complaint_record PUBLIC.allegation_complaint;
	edit_complaint_data JSONB; -- the complaint data containing the edits from webeoc
    original_complaint_record JSONB; -- the complaint data before the edits, used to determine i
   
    -- Variable to hold the JSONB data from staging_complaint.  Used to edit a complaint
    _edit_report_type            VARCHAR(120);
    _edit_detail_text            VARCHAR(4000);
    _edit_caller_name            VARCHAR(120);
    _edit_caller_address         VARCHAR(120);
    _edit_address         		VARCHAR(120);
    _edit_caller_email           VARCHAR(120);
    _edit_caller_phone_1         VARCHAR(15);
    _edit_caller_phone_2         VARCHAR(15);
    _edit_caller_phone_3         VARCHAR(15);
    _edit_location_summary_text  VARCHAR(120);
    _edit_location_detailed_text VARCHAR(4000);
    _edit_incident_utc_datetime timestamp;
    _edit_create_utc_timestamp timestamp := (now() AT TIME zone 'UTC');
    _edit_update_utc_timestamp timestamp := (now() AT TIME zone 'UTC');
    _edit_create_userid              VARCHAR(200);
    _edit_update_userid              VARCHAR(200);
    _edit_geo_organization_unit_code VARCHAR(10);
    _edit_incident_reported_utc_timestmp timestamp;
    _edit_address_coordinates_lat VARCHAR(200);
    _edit_address_coordinates_long VARCHAR(200);
    _edit_location_geometry_point GEOMETRY;
    _edit_complaint_status_code VARCHAR(10);

    -- Variables for 'hwcr_complaint' table
    _edit_webeoc_species                    VARCHAR(200);
    _edit_webeoc_hwcr_complaint_nature_code VARCHAR(200);
    _edit_webeoc_cos_area_community         VARCHAR(200);
    _edit_webeoc_attracts_list              VARCHAR(1000);
    _edit_species_code                      VARCHAR(10);
    _edit_hwcr_complaint_nature_code        VARCHAR(10);
    _edit_other_attractants_text            VARCHAR(4000);
    _edit_reported_by_other_text            VARCHAR(4000);
    _edit_webeoc_reported_by_code           VARCHAR(200);
    _edit_cos_reffered_by_lst               VARCHAR(200);
    _edit_in_progress_ind                   VARCHAR(3);
    _edit_observed_ind                      VARCHAR(3);
    _edit_in_progress_ind_bool bool;
    _edit_observed_ind_bool bool;
    _edit_suspect_witnesss_dtl_text VARCHAR(4000);
    _edit_violation_code            VARCHAR(10);
    -- used to generate a uuid.  We use this to create the PK in hwcr_complaint, but
    -- we need to also use it when creating the attractants
    hwcr_uuid uuid;
    enforcement_uuid uuid;
    -- parsed attractants from the jsonb object
    attractants_array text[];
    attractant_item text;
    _attractant_code VARCHAR(10);


   
   
   _current_species_code VARCHAR(10);
   _current_violation_type_code VARCHAR(10);
   
   -- used to indicate if the update causes an edit to the complaint record
   update_edit_ind boolean = false;
   
   USERNAME_TXT CONSTANT varchar(8) = 'username';
  
  
   
BEGIN
   
   
    -- get the staged edit record.  There may be multiple for a given complaint, we just want the last one since that
    -- will contain all previous edits too
   select sc.complaint_jsonb
    into edit_complaint_data
    from PUBLIC.staging_complaint sc 
    where sc.complaint_identifier  = _complaint_identifier
    and sc.staging_activity_code  = STAGING_STATUS_CODE_EDIT
    and sc.staging_status_code  = STAGING_STATUS_CODE_PENDING
    order by sc.update_utc_timestamp desc
	limit 1;

    -- These fields are retrieved to potentially update an existing complaint record
	_edit_detail_text := edit_complaint_data ->> 'cos_call_details';
    _edit_caller_name := edit_complaint_data ->> 'cos_caller_name';
    _edit_caller_phone_1 := edit_complaint_data ->> 'cos_primary_phone';
    _edit_caller_phone_2 := edit_complaint_data ->> 'cos_alt_phone';
    _edit_caller_phone_3 := edit_complaint_data ->> 'cos_alt_phone_2';
    _edit_caller_email := edit_complaint_data ->> 'cos_caller_email';
    _edit_caller_address := edit_complaint_data ->> 'caller_address';
    _edit_address := edit_complaint_data ->> 'address';
    _edit_webeoc_reported_by_code := edit_complaint_data ->> 'cos_reffered_by_lst';
    _edit_reported_by_other_text := edit_complaint_data ->> 'cos_reffered_by_txt';
    _edit_webeoc_species := edit_complaint_data ->> 'species';
    _edit_report_type := edit_complaint_data ->> 'report_type';
    _edit_update_userid := substring(edit_complaint_data ->> USERNAME_TXT from 1 for 32);
    _edit_complaint_status_code := UPPER(edit_complaint_data ->> 'status');
   
    _edit_location_detailed_text := edit_complaint_data ->> 'cos_location_description';
    _edit_incident_utc_datetime := ( edit_complaint_data ->> 'incident_datetime' ):: timestamp AT            TIME zone 'America/Los_Angeles';
    _edit_incident_reported_utc_timestmp := ( edit_complaint_data ->> 'created_by_datetime' ):: timestamp AT TIME zone 'America/Los_Angeles';
	  _edit_address_coordinates_lat := validate_coordinate_field(edit_complaint_data ->> 'address_coordinates_lat');
    _edit_address_coordinates_long := validate_coordinate_field(edit_complaint_data ->> 'address_coordinates_long');
   
    -- Create a geometry point based on the latitude and longitude
    IF _edit_address_coordinates_lat IS NOT NULL AND _edit_address_coordinates_lat <> '' AND
       _edit_address_coordinates_long IS NOT NULL AND _edit_address_coordinates_long <> '' THEN
        _edit_location_geometry_point := ST_SetSRID(
            ST_MakePoint(
                CAST(_edit_address_coordinates_long AS NUMERIC),
                CAST(_edit_address_coordinates_lat AS NUMERIC)
            ),
            4326
        );
    ELSE
    	_edit_location_geometry_point := ST_SetSRID(ST_MakePoint(0, 0), 4326);
	END IF;



    -- Get the codes from our application (inserting if necessary) for the codes retrieved from WebEOC
    SELECT *
    INTO   _edit_cos_reffered_by_lst
    FROM   PUBLIC.insert_and_return_code(_edit_webeoc_reported_by_code, 'reprtdbycd');

   
    -- Get the current state of the complaint
    SELECT *
    INTO   current_complaint_record
    FROM   PUBLIC.complaint
    WHERE  complaint_identifier = _complaint_identifier;

      -- update the complaint data, if the incoming webeoc contains applicable updates
   if (COALESCE(_edit_detail_text, '') <> COALESCE(current_complaint_record.detail_text, '')) then
	    UPDATE complaint
	    SET detail_text  = _edit_detail_text
	    WHERE complaint_identifier = _complaint_identifier;
	
	    update_edit_ind = true;
  end if;
   
   -- update the complaint data, if the incoming webeoc contains applicable updates
   if (COALESCE(_edit_caller_name, '') <> COALESCE(current_complaint_record.caller_name, '')) then
	    UPDATE complaint
	    SET caller_name = _edit_caller_name
	    WHERE complaint_identifier = _complaint_identifier;
	
	    update_edit_ind = true;
  end if;
  
  _edit_caller_phone_1 := format_phone_number(_edit_caller_phone_1);
  if (COALESCE(_edit_caller_phone_1, '') <> COALESCE(current_complaint_record.caller_phone_1, '')) then
        
	    UPDATE complaint
	    SET caller_phone_1 = _edit_caller_phone_1
	    WHERE complaint_identifier = _complaint_identifier;
	
	    update_edit_ind = true;
  end if;
  
  _edit_caller_phone_2 := format_phone_number(_edit_caller_phone_2);
  if (COALESCE(_edit_caller_phone_2, '') <> COALESCE(current_complaint_record.caller_phone_2, '')) then
    	
	    UPDATE complaint
	    SET caller_phone_2 = _edit_caller_phone_2
	    WHERE complaint_identifier = _complaint_identifier;
	
	    update_edit_ind = true;
  end if;
  
  _edit_caller_phone_3 := format_phone_number(_edit_caller_phone_3);
  if (COALESCE(_edit_caller_phone_3, '') <> COALESCE(current_complaint_record.caller_phone_3, '')) then
    	
	    UPDATE complaint
	    SET caller_phone_3 = _edit_caller_phone_3
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
  
  if (COALESCE(_edit_caller_email, '') <> COALESCE(current_complaint_record.caller_email, '')) then 
		UPDATE complaint
		SET caller_email = _edit_caller_email
		WHERE complaint_identifier = _complaint_identifier;
		update_edit_ind = true;
  end if;
  
  if (COALESCE(_edit_caller_address, '') <> COALESCE(current_complaint_record.caller_address, '')) then 
	    UPDATE complaint
	    SET caller_address = _edit_caller_address
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
 
  if (COALESCE(_edit_address, '') <> COALESCE(current_complaint_record.location_summary_text, '')) then 
	    UPDATE complaint
	    SET location_summary_text  = _edit_address
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
  
  if (COALESCE(_edit_cos_reffered_by_lst, '') <> COALESCE(current_complaint_record.reported_by_code, '')) then 
	    UPDATE complaint
	    SET reported_by_code = _edit_cos_reffered_by_lst
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
   
  if (COALESCE(_edit_reported_by_other_text, '') <> COALESCE(current_complaint_record.reported_by_other_text, '')) then 
	    UPDATE complaint
	    SET reported_by_other_text = _edit_reported_by_other_text
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
 
  if (COALESCE(_edit_location_detailed_text, '') <> COALESCE(current_complaint_record.location_detailed_text, '')) then 
	    UPDATE complaint
	    SET location_detailed_text  = _edit_location_detailed_text
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
 
  if (_edit_incident_utc_datetime <> current_complaint_record.incident_utc_datetime) then 
	    UPDATE complaint
	    SET incident_utc_datetime  = _edit_incident_utc_datetime
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
 
  if (_edit_incident_reported_utc_timestmp <> current_complaint_record.incident_reported_utc_timestmp) then 
	    UPDATE complaint
	    SET incident_reported_utc_timestmp  = _edit_incident_reported_utc_timestmp
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;

  if NOT ST_Equals(_edit_location_geometry_point, current_complaint_record.location_geometry_point) then
	    UPDATE complaint
	    SET location_geometry_point  = _edit_location_geometry_point
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;

  if (_edit_complaint_status_code <> current_complaint_record.complaint_status_code) then 
	    UPDATE complaint
	    SET complaint_status_code  = _edit_complaint_status_code
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
   
  -- the update caused an edit, set the audit fields
  if (update_edit_ind) then
	update complaint
	set update_user_id = _edit_update_userid, update_utc_timestamp = _edit_update_utc_timestamp
	where complaint_identifier = _complaint_identifier;
  end if;
  
  if (_edit_report_type = 'HWCR') then
      update_edit_ind = false;
	  select hc.hwcr_complaint_guid 
	  into hwcr_uuid
	  from hwcr_complaint hc where complaint_identifier  = _complaint_identifier;
	 
	  update attractant_hwcr_xref
	  set active_ind = false
	  where hwcr_complaint_guid = hwcr_uuid;
	 
      -- Convert the comma-separated list into an array
      attractants_array := string_to_array( edit_complaint_data ->> 'attractants_list', ',' );
      -- Iterate over the array
      foreach attractant_item IN ARRAY attractants_array
      LOOP                                                -- Trim whitespace and check if the item is 'Not Applicable'
        IF trim(attractant_item) <> 'Not Applicable' THEN -- Your insertion logic here
          SELECT *
          FROM   PUBLIC.insert_and_return_code( trim(attractant_item), 'atractntcd' )
          INTO   _attractant_code;
          
          INSERT INTO PUBLIC.attractant_hwcr_xref
                      (
                                  attractant_code,
                                  hwcr_complaint_guid,
                                  create_user_id,
                                  create_utc_timestamp,
                                  update_user_id,
                                  update_utc_timestamp
                      )
                      VALUES
                      (
                                  _attractant_code,
                                  hwcr_uuid,
                                  WEBEOC_USER_ID,
                                  _edit_create_utc_timestamp,
                                  WEBEOC_USER_ID,
                                  _edit_update_utc_timestamp
                      );
        
        END IF;
      END LOOP;
    -- get the code based on the update from WebEOC
    SELECT *
    INTO   _edit_species_code
    FROM   PUBLIC.insert_and_return_code(_edit_webeoc_species, 'speciescd');
   
    -- get the current species code
   	SELECT hc.species_code 
   	INTO _current_species_code
	FROM hwcr_complaint hc 
	WHERE hc.complaint_identifier = _complaint_identifier;


    if (_edit_species_code <> _current_species_code) then 
    	update hwcr_complaint
    	set species_code = _edit_species_code
    	where complaint_identifier = _complaint_identifier;
    end if;
   
    -- the update caused an edit, set the audit fields
    if (update_edit_ind) then
		update hwcr_complaint 
		set update_user_id = _edit_update_userid, update_utc_timestamp = _edit_update_utc_timestamp
		where complaint_identifier = _complaint_identifier;
    end if;

  end if;
 
  if (_edit_report_type = 'ERS') then
	  update_edit_ind = false;
  	
  
      _edit_in_progress_ind := (edit_complaint_data->>'violation_in_progress');
      _edit_observed_ind := (edit_complaint_data->>'observe_violation');
      _edit_suspect_witnesss_dtl_text := edit_complaint_data->>'suspect_details';

      IF _edit_in_progress_ind = 'Yes' THEN
        _edit_in_progress_ind_bool := TRUE;
      ELSE
        _edit_in_progress_ind_bool := FALSE;
      END IF; 
      IF _edit_observed_ind = 'Yes' THEN
        _edit_observed_ind_bool := TRUE;
      ELSE
        _edit_observed_ind_bool := FALSE;
      END IF;
     
     -- Get the current state of the complaint
     SELECT *
     INTO   allegation_complaint_record
     FROM   PUBLIC.allegation_complaint ac
     WHERE  complaint_identifier = _complaint_identifier;

   

     if (_edit_observed_ind_bool != allegation_complaint_record.observed_ind) then 
	    UPDATE allegation_complaint
	    SET observed_ind  = _edit_observed_ind_bool
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
	 end if;
	
     if (_edit_in_progress_ind_bool != allegation_complaint_record.in_progress_ind) then 
	    UPDATE allegation_complaint
	    SET in_progress_ind  = _edit_in_progress_ind_bool
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
	 end if;
	
     if (_edit_suspect_witnesss_dtl_text <> allegation_complaint_record.suspect_witnesss_dtl_text) then 
	    UPDATE allegation_complaint
	    SET suspect_witnesss_dtl_text  = _edit_suspect_witnesss_dtl_text
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
	 end if;

  
	 SELECT *
	 FROM   PUBLIC.insert_and_return_code( edit_complaint_data->>'violation_type', 'violatncd' )
	 INTO   _edit_violation_code;
	 
     select ac.violation_code
     into _current_violation_type_code
     from allegation_complaint ac
     where ac.complaint_identifier = _complaint_identifier;

    if (_edit_violation_code <> _current_violation_type_code) then
	    if _edit_violation_code = 'WASTE' OR _edit_violation_code = 'PESTICDE' then
        UPDATE PUBLIC.complaint
        SET    owned_by_agency_code = 'EPO'
        WHERE  complaint_identifier = _complaint_identifier;
      else
        UPDATE PUBLIC.complaint
        SET    owned_by_agency_code = 'COS'
        WHERE  complaint_identifier = _complaint_identifier;
      end if;  
	    
      update allegation_complaint
      set violation_code  = _edit_violation_code
      where complaint_identifier = _complaint_identifier;
      update_edit_ind = true;
    end if;

    -- the update caused an edit, set the audit fields
    if (update_edit_ind) then
		update hwcr_complaint 
		set update_user_id = _edit_update_userid, update_utc_timestamp = _edit_update_utc_timestamp
		where complaint_identifier = _complaint_identifier;
    end if;
  end if;
 
    -- Update staging_complaint to mark the process as successful
   UPDATE staging_complaint
   SET    staging_status_code = STAGING_STATUS_CODE_SUCCESS
   WHERE  complaint_identifier = _complaint_identifier
   AND    staging_activity_code = STAGING_STATUS_CODE_EDIT
   and 	  staging_status_code = 'PENDING';

EXCEPTION
WHEN OTHERS THEN
    RAISE NOTICE 'An unexpected error occurred: %', SQLERRM;
    UPDATE staging_complaint
    SET    staging_status_code = STAGING_STATUS_CODE_ERROR
    WHERE  complaint_identifier = _complaint_identifier
    AND    staging_status_code = STAGING_STATUS_CODE_PENDING
    AND    staging_activity_code = STAGING_STATUS_CODE_EDIT;

END;
$function$
;
