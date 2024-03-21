CREATE OR REPLACE FUNCTION public.insert_complaint_from_staging(_complaint_identifier character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
  declare
    non_digit_regex CONSTANT text := '[^\d]'; -- used to strip out non-numeric characters from the phone number fields
    
    -- jsonb attribute names
    jsonb_cos_primary_phone CONSTANT text := 'cos_primary_phone';
    jsonb_cos_alt_phone CONSTANT text := 'cos_alt_phone';
    jsonb_cos_alt_phone_2 CONSTANT text := 'cos_alt_phone_2';
   

   
    complaint_data jsonb;
    -- Variable to hold the JSONB data from staging_complaint.  Used to create a new complaint
    -- Variables for 'complaint' table
    _report_type            VARCHAR(120);
    _detail_text            VARCHAR(4000);
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
    _location_geometry_point geometry;
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
    AND    sc.staging_status_code = 'PENDING';
    
    IF complaint_data IS NULL THEN
      RETURN;
    END IF;
    _report_type := complaint_data ->> 'report_type';

   -- Extract and prepare data for 'complaint' table
    _detail_text := left( complaint_data ->> 'cos_call_details', 3980 )
    ||
    CASE
    WHEN length( complaint_data ->> 'cos_call_details' ) > 3980 THEN
      '… DATA TRUNCATED'
    ELSE
      ''
    END;
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
	
    -- phone numbers must be formatted as +1##########.  
    -- If the numbers from webeoc contain non-numeric characters, strip those and 
    -- add the + (or +1) prefix
   
	_caller_phone_1 := CASE
	    WHEN left(regexp_replace(complaint_data ->> jsonb_cos_primary_phone, non_digit_regex, '', 'g'), 15) ~ '^1'
	    THEN '+' || left(regexp_replace(complaint_data ->> jsonb_cos_primary_phone, non_digit_regex, '', 'g'), 15)
	    ELSE '+1' || regexp_replace(complaint_data ->> jsonb_cos_primary_phone, non_digit_regex, '', 'g')
	END;
	
	_caller_phone_2 := CASE
	    WHEN left(regexp_replace(complaint_data ->> jsonb_cos_alt_phone, non_digit_regex, '', 'g'), 15) ~ '^1'
	    THEN '+' || left(regexp_replace(complaint_data ->> jsonb_cos_alt_phone, non_digit_regex, '', 'g'), 15)
	    ELSE '+1' || regexp_replace(complaint_data ->> jsonb_cos_alt_phone, non_digit_regex, '', 'g')
	END;
	
	_caller_phone_3 := CASE
	    WHEN left(regexp_replace(complaint_data ->> jsonb_cos_alt_phone_2, non_digit_regex, '', 'g'), 15) ~ '^1'
	    THEN '+' || left(regexp_replace(complaint_data ->> jsonb_cos_alt_phone_2, non_digit_regex, '', 'g'), 15)
	    ELSE '+1' || regexp_replace(complaint_data ->> jsonb_cos_alt_phone_2, non_digit_regex, '', 'g')
	END;

   
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
    _location_geometry_point := coalesce( nullif(complaint_data ->> 'location', ''):: geometry, 'POINT(0 0)' :: geometry );
    _create_userid := complaint_data ->> 'username';
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
                            'OPEN',
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
                                  'webeoc',
                                  _create_utc_timestamp,
                                  'webeoc',
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
    SET    staging_status_code = 'SUCCESS'
    WHERE  complaint_identifier = _complaint_identifier;
  
  EXCEPTION
  WHEN OTHERS THEN
    RAISE notice 'An unexpected error occurred: %', SQLERRM;
    UPDATE staging_complaint
    SET    staging_status_code = 'ERROR'
    WHERE  complaint_identifier = _complaint_identifier
    and staging_status_code = 'PENDING';
  
  END;
  $function$
;

CREATE OR REPLACE FUNCTION public.insert_and_return_code(webeoc_value character varying, code_table_type character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_code VARCHAR(10);  -- used in case we're creating a new code
    truncated_code varchar(10); -- if we're creating a new code, base it off of the webeoc_value.  We'll truncate this and get rid of spaces, and possibly append a number to make it unique
    live_code_value VARCHAR;
    current_utc_timestamp TIMESTAMP WITH TIME ZONE := NOW();
    target_code_table VARCHAR;
    column_name VARCHAR;
    code_exists BOOLEAN;
    suffix VARCHAR(10) := ''; -- Suffix for uniqueness
    counter INTEGER := 1; -- Counter for unique code generation
    new_display_order INTEGER; -- used for setting the display_order value of the new code
BEGIN
    -- Truncate and uppercase the webEOC value, get rid of spaces, and truncate to 9 characters to ensure we have room for adding a number for uniqueness
    truncated_code := UPPER(LEFT(regexp_replace(webeoc_value, '\s', '', 'g'), 10));
   
    -- Resolve the target code table and column name based on code_table_type
    CASE code_table_type
        WHEN 'reprtdbycd' THEN
            target_code_table := 'reported_by_code';
            column_name := 'reported_by_code';
        WHEN 'geoorgutcd' THEN
            target_code_table := 'geo_organization_unit_code';
            column_name := 'geo_organization_unit_code';
        WHEN 'speciescd' THEN
            target_code_table := 'species_code';
            column_name := 'species_code';
        WHEN 'cmpltntrcd' THEN
            target_code_table := 'hwcr_complaint_nature_code';
            column_name := 'hwcr_complaint_nature_code';
        WHEN 'atractntcd' THEN
            target_code_table := 'attractant_code';
            column_name := 'attractant_code';
        WHEN 'violatncd' THEN
            target_code_table := 'violation_code';
            column_name := 'violation_code';

        ELSE RAISE EXCEPTION 'Invalid code_table_type provided: %', code_table_type;
    END CASE;
    
    -- Check if the code exists in staging_metadata_mapping
    SELECT live_data_value INTO live_code_value
    FROM staging_metadata_mapping
    WHERE staged_data_value = webEOC_value
    AND entity_code = code_table_type;
    
    -- If the code exists, return the live_data_value
    IF live_code_value IS NOT NULL THEN
        RETURN live_code_value;
    END IF;
   

    -- We're creating a new code because the webeoc code doesn't exist in staging_metadata_mapping.  We want to add this new code to our code tables, as well as the staging_meta_mapping table.
    -- Before we create new codes in our code tables, we want to make sure we're not creating a duplicate.  If the new code doesn't exist
    -- in staging_metamapping, and the code doesn't exist in the code table, then create the code in both tables.
    -- If the code doesn't exist in staging_meta_mapping, but does exist in the code table, then create a new unique code
    -- in both the staging_meta_mapping table and the code table.

    loop

	    -- if a suffix is required, truncate the code to 9 characters so that there's room for the suffix
	    IF suffix <> '' THEN
            truncated_code := LEFT(truncated_code, 9);
        END IF;

        -- Append a numeric suffix if necessary
        new_code := truncated_code || suffix;
        
        -- Check if the new_code exists in the specific code table
        EXECUTE format('SELECT EXISTS(SELECT 1 FROM %I WHERE %I = $1)', target_code_table, column_name)
        INTO code_exists
        USING new_code;
        
        IF NOT code_exists then
        
        	-- Determine the correct display_order for the new code
            EXECUTE format('SELECT COALESCE(MAX(display_order) + 1, 1) FROM %I WHERE %I < $1', target_code_table, column_name)
            INTO new_display_order
            USING new_code;
           
			-- Re-index the display_orders
            EXECUTE format('UPDATE %I SET display_order = display_order + 1 WHERE display_order >= $1', target_code_table)
            USING new_display_order;
           
            -- Insert new code into the specific code table
            EXECUTE format('INSERT INTO %I (%I, short_description, long_description, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp, display_order) VALUES ($1, $2, $3, ''Y'', ''webeoc'', $4, ''webeoc'', $4, $5)', target_code_table, column_name)
            USING new_code, webeoc_value, webeoc_value, current_utc_timestamp, new_display_order;

            -- Update configuration_value by 1 to nofity front-end to update
            UPDATE configuration
            SET    configuration_value = configuration_value::int + 1
            WHERE  configuration_code = 'CDTABLEVER';

            -- Insert into staging_metadata_mapping
            INSERT INTO staging_metadata_mapping (entity_code, staged_data_value, live_data_value, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
            VALUES (code_table_type, webeoc_value, new_code, 'webeoc', current_utc_timestamp, 'webeoc', current_utc_timestamp);

            RETURN new_code; -- Return the new unique code
        ELSE
            -- If the code exists, increment the suffix and try again
            suffix := counter::text;
            counter := counter + 1;
        END IF;
    END LOOP;
   
END;
$function$
;