CREATE
OR REPLACE FUNCTION complaint.insert_complaint_from_staging (_complaint_identifier character varying) RETURNS void LANGUAGE plpgsql AS $function$
  declare
    WEBEOC_USER_ID CONSTANT varchar(6) := 'webeoc';
    WEBEOC_UPDATE_TYPE_INSERT CONSTANT varchar(6) := 'INSERT';
    STAGING_STATUS_CODE_PENDING CONSTANT varchar(7) := 'PENDING';
    STAGING_STATUS_CODE_SUCCESS CONSTANT varchar(7) := 'SUCCESS' ;
    STAGING_STATUS_CODE_ERROR CONSTANT varchar(5) := 'ERROR';
    METHOD_OF_COMPLAINT_RAPP CONSTANT varchar(5) := 'RAPP';
    
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
    _webeoc_identifier VARCHAR(20);

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
    _suspect_witnesss_dtl_text TEXT;
    _violation_code            VARCHAR(10);
    _gir_type_code             VARCHAR(10);
    _gir_type_description      VARCHAR(50);
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
    FROM   complaint.staging_complaint sc
    WHERE  sc.complaint_identifier = _complaint_identifier
    AND    sc.staging_status_code = STAGING_STATUS_CODE_PENDING -- meaning that this complaint hasn't yet been moved to the complaint table yet
    AND    sc.staging_activity_code = WEBEOC_UPDATE_TYPE_INSERT; -- this means that we're dealing with a new complaint from webeoc, not an update
    
    IF complaint_data IS NULL THEN
      RETURN;
    END IF;

    _report_type := complaint_data ->> 'report_type';
    -- to link actions-taken to a complaint the dataid needs to be used
    _webeoc_identifier := complaint_data ->> 'dataid'; 

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
   
	_caller_phone_1 := complaint.format_phone_number(complaint_data ->> jsonb_cos_primary_phone);
	_caller_phone_2 := complaint.format_phone_number(complaint_data ->> jsonb_cos_alt_phone);
	_caller_phone_3 := complaint.format_phone_number(complaint_data ->> jsonb_cos_alt_phone_2);
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
	_address_coordinates_lat := complaint.validate_coordinate_field(complaint_data ->> 'address_coordinates_lat');
    _address_coordinates_long := complaint.validate_coordinate_field(complaint_data ->> 'address_coordinates_long');
   
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
    FROM   complaint.insert_and_return_code( _webeoc_cos_reffered_by_lst, 'reprtdbycd' )
    INTO   _cos_reffered_by_lst;
    
    -- Select from staging_metadata_mapping directly for the geo_organization_unit_code
    -- If it doesn't exist, will return null instead of creating a new code. We will address
    -- the missing code case in CE-568
    SELECT live_data_value
    FROM   complaint.staging_metadata_mapping
    WHERE  staged_data_value = _webeoc_cos_area_community
    AND    entity_code = 'geoorgutcd'
    INTO   _geo_organization_unit_code;
    
    -- Insert data into 'complaint' table
    INSERT INTO complaint.complaint
                (
                            complaint_identifier,
                            complaint_type_code,
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
                            owned_by_agency_code_ref,
                            complaint_status_code,
                            geo_organization_unit_code,
                            location_geometry_point,
                            reported_by_code,
                            reported_by_other_text,
                            webeoc_identifier
                )
                VALUES
                (
                            _complaint_identifier,
                            _report_type,
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
                            _cos_reffered_by_txt,
                            _webeoc_identifier
                );
    
    IF _report_type = 'HWCR' then
    
      -- convert webeoc species to our species code
	  _webeoc_species := complaint_data ->> 'species';
	  SELECT *
	  FROM   complaint.insert_and_return_code(_webeoc_species, 'speciescd')
	  INTO   _species_code;
	    
	  _webeoc_hwcr_complaint_nature_code := complaint_data ->> 'nature_of_complaint';
	  SELECT *
	  FROM   complaint.insert_and_return_code( _webeoc_hwcr_complaint_nature_code, 'cmpltntrcd' )
	  INTO   _hwcr_complaint_nature_code;
    
      -- Prepare data for 'hwcr_complaint' table
      _other_attractants_text := complaint_data ->> 'attractant_other_text';
      SELECT uuid_generate_v4()
      INTO   generated_uuid;
      
      -- Insert data into 'hwcr_complaint' table
      INSERT INTO complaint.hwcr_complaint
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
          FROM   complaint.insert_and_return_code( trim(attractant_item), 'atractntcd' )
          INTO   _attractant_code;
          
          INSERT INTO complaint.attractant_hwcr_xref
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

    ELSIF _report_type = 'GIR' then
    
      -- Prepare data for 'gir_complaint' table
      _gir_type_description := complaint_data ->> 'call_type_gir';
      SELECT *
      FROM   complaint.insert_and_return_code( _gir_type_description, 'girtypecd' )
      INTO   _gir_type_code;
      -- Insert data into 'gir_complaint' table
      INSERT INTO complaint.gir_complaint
                  (
                              gir_complaint_guid,
                              create_user_id,
                              create_utc_timestamp,
                              update_user_id,
                              update_utc_timestamp,
                              complaint_identifier,
                              gir_type_code
                  )
                  VALUES
                  (
                              uuid_generate_v4(),
                              _create_userid,
                              _create_utc_timestamp,
                              _create_userid,
                              _update_utc_timestamp,
                              _complaint_identifier,
                              _gir_type_code
                  );
      
    ELSIF _report_type = 'ERS' THEN
      -- Extract and prepare data for 'allegation_complaint' table
      _in_progress_ind := (complaint_data->>'violation_in_progress');
      _observed_ind := (complaint_data->>'observe_violation');
      _suspect_witnesss_dtl_text := complaint_data->>'suspect_details';
      SELECT *
      FROM   complaint.insert_and_return_code( complaint_data->>'violation_type', 'violatncd' )
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
        UPDATE complaint.complaint
        SET    owned_by_agency_code_ref = 'EPO', complaint_status_code = 'OPEN'
        WHERE  complaint_identifier = _complaint_identifier;
      END IF;

      -- Insert data into 'allegation_complaint' table
      INSERT INTO complaint.allegation_complaint
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
   
    UPDATE complaint.complaint com
    SET comp_mthd_recv_cd_agcy_cd_xref_guid = (
        SELECT comp_mthd_recv_cd_agcy_cd_xref_guid 
        FROM complaint.comp_mthd_recv_cd_agcy_cd_xref cmrcacx 
        WHERE complaint_method_received_code = METHOD_OF_COMPLAINT_RAPP
        AND cmrcacx.agency_code_ref = com.owned_by_agency_code_ref
    )
    WHERE complaint_identifier = _complaint_identifier;
    UPDATE complaint.staging_complaint
    SET    staging_status_code = STAGING_STATUS_CODE_SUCCESS
    WHERE  complaint_identifier = _complaint_identifier
    AND    staging_activity_code = WEBEOC_UPDATE_TYPE_INSERT;
  
  EXCEPTION
  WHEN OTHERS THEN
    RAISE notice 'An unexpected error occurred: %', SQLERRM;
    UPDATE complaint.staging_complaint
    SET    staging_status_code = STAGING_STATUS_CODE_ERROR
    WHERE  complaint_identifier = _complaint_identifier
    and staging_status_code = STAGING_STATUS_CODE_PENDING
    AND    staging_activity_code = WEBEOC_UPDATE_TYPE_INSERT;
  
  END;
  $function$;