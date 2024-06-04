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
    _report_type            VARCHAR(120);
    _detail_text            VARCHAR(4000);
    _caller_name            VARCHAR(120);
    _caller_address         VARCHAR(120);
    _address         		VARCHAR(120);
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

    -- Variables for 'hwcr_complaint' table
    _webeoc_species                    VARCHAR(200);
    _webeoc_hwcr_complaint_nature_code VARCHAR(200);
    _webeoc_cos_area_community         VARCHAR(200);
    _webeoc_attracts_list              VARCHAR(1000);
    _species_code                      VARCHAR(10);
    _hwcr_complaint_nature_code        VARCHAR(10);
    _other_attractants_text            VARCHAR(4000);
    _reported_by_other_text            VARCHAR(4000);
    _webeoc_reported_by_code           VARCHAR(200);
    _cos_reffered_by_lst               VARCHAR(200);
    _in_progress_ind                   VARCHAR(3);
    _observed_ind                      VARCHAR(3);
    _in_progress_ind_bool bool;
    _observed_ind_bool bool;
    _suspect_witnesss_dtl_text VARCHAR(4000);
    _violation_code            VARCHAR(10);
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
	_detail_text := edit_complaint_data ->> 'cos_call_details';
    _caller_name := edit_complaint_data ->> 'cos_caller_name';
    _caller_phone_1 := edit_complaint_data ->> 'cos_primary_phone';
    _caller_phone_2 := edit_complaint_data ->> 'cos_alt_phone';
    _caller_phone_3 := edit_complaint_data ->> 'cos_alt_phone_2';
    _caller_email := edit_complaint_data ->> 'cos_caller_email';
    _caller_address := edit_complaint_data ->> 'caller_address';
    _address := edit_complaint_data ->> 'address';
    _webeoc_reported_by_code := edit_complaint_data ->> 'cos_reffered_by_lst';
    _reported_by_other_text := edit_complaint_data ->> 'cos_reffered_by_txt';
    _webeoc_species := edit_complaint_data ->> 'species';
    _report_type := edit_complaint_data ->> 'report_type';
    _update_userid := substring(edit_complaint_data ->> USERNAME_TXT from 1 for 32);
   
    _location_detailed_text := edit_complaint_data ->> 'cos_location_description';
    _incident_utc_datetime := ( edit_complaint_data ->> 'incident_datetime' ):: timestamp AT            TIME zone 'America/Los_Angeles';
    _incident_reported_utc_timestmp := ( edit_complaint_data ->> 'created_by_datetime' ):: timestamp AT TIME zone 'America/Los_Angeles';
	_address_coordinates_lat := edit_complaint_data ->> 'address_coordinates_lat';
    _address_coordinates_long := edit_complaint_data ->> 'address_coordinates_long';
   
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



    -- Get the codes from our application (inserting if necessary) for the codes retrieved from WebEOC
    SELECT *
    INTO   _cos_reffered_by_lst
    FROM   PUBLIC.insert_and_return_code(_webeoc_reported_by_code, 'reprtdbycd');

   
    -- Get the current state of the complaint
    SELECT *
    INTO   current_complaint_record
    FROM   PUBLIC.complaint
    WHERE  complaint_identifier = _complaint_identifier;

      -- update the complaint data, if the incoming webeoc contains applicable updates
   if (COALESCE(_detail_text, '') <> COALESCE(current_complaint_record.detail_text, '')) then
	    UPDATE complaint
	    SET detail_text  = _detail_text
	    WHERE complaint_identifier = _complaint_identifier;
	
	    update_edit_ind = true;
  end if;
   
   -- update the complaint data, if the incoming webeoc contains applicable updates
   if (COALESCE(_caller_name, '') <> COALESCE(current_complaint_record.caller_name, '')) then
	    UPDATE complaint
	    SET caller_name = _caller_name
	    WHERE complaint_identifier = _complaint_identifier;
	
	    update_edit_ind = true;
  end if;
  
  _caller_phone_1 := format_phone_number(_caller_phone_1);
  if (COALESCE(_caller_phone_1, '') <> COALESCE(current_complaint_record.caller_phone_1, '')) then
        
	    UPDATE complaint
	    SET caller_phone_1 = _caller_phone_1
	    WHERE complaint_identifier = _complaint_identifier;
	
	    update_edit_ind = true;
  end if;
  
  _caller_phone_2 := format_phone_number(_caller_phone_2);
  if (COALESCE(_caller_phone_2, '') <> COALESCE(current_complaint_record.caller_phone_2, '')) then
    	
	    UPDATE complaint
	    SET caller_phone_2 = _caller_phone_2
	    WHERE complaint_identifier = _complaint_identifier;
	
	    update_edit_ind = true;
  end if;
  
  _caller_phone_3 := format_phone_number(_caller_phone_3);
  if (COALESCE(_caller_phone_3, '') <> COALESCE(current_complaint_record.caller_phone_3, '')) then
    	
	    UPDATE complaint
	    SET caller_phone_3 = _caller_phone_3
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
  
  if (COALESCE(_caller_email, '') <> COALESCE(current_complaint_record.caller_email, '')) then 
		UPDATE complaint
		SET caller_email = _caller_email
		WHERE complaint_identifier = _complaint_identifier;
		update_edit_ind = true;
  end if;
  
  if (COALESCE(_caller_address, '') <> COALESCE(current_complaint_record.caller_address, '')) then 
	    UPDATE complaint
	    SET caller_address = _caller_address
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
 
  if (COALESCE(_address, '') <> COALESCE(current_complaint_record.location_summary_text, '')) then 
	    UPDATE complaint
	    SET location_summary_text  = _address
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
  
  if (COALESCE(_cos_reffered_by_lst, '') <> COALESCE(current_complaint_record.reported_by_code, '')) then 
	    UPDATE complaint
	    SET reported_by_code = _cos_reffered_by_lst
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
   
  if (COALESCE(_reported_by_other_text, '') <> COALESCE(current_complaint_record.reported_by_other_text, '')) then 
	    UPDATE complaint
	    SET reported_by_other_text = _reported_by_other_text
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
 
  if (COALESCE(_location_detailed_text, '') <> COALESCE(current_complaint_record.location_detailed_text, '')) then 
	    UPDATE complaint
	    SET location_detailed_text  = _location_detailed_text
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
 
  if (_incident_utc_datetime <> current_complaint_record.incident_utc_datetime) then 
	    UPDATE complaint
	    SET incident_utc_datetime  = _incident_utc_datetime
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
 
  if (_incident_reported_utc_timestmp <> current_complaint_record.incident_reported_utc_timestmp) then 
	    UPDATE complaint
	    SET incident_reported_utc_timestmp  = _incident_reported_utc_timestmp
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
 
  if (_location_geometry_point <> current_complaint_record.location_geometry_point) then 
	    UPDATE complaint
	    SET location_geometry_point  = _location_geometry_point
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
   
  -- the update caused an edit, set the audit fields
  if (update_edit_ind) then
	update complaint
	set update_user_id = _update_userid, update_utc_timestamp = _update_utc_timestamp
	where complaint_identifier = _complaint_identifier;
  end if;
  
  if (_report_type = 'HWCR') then
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
                                  _create_utc_timestamp,
                                  WEBEOC_USER_ID,
                                  _update_utc_timestamp
                      );
        
        END IF;
      END LOOP;
    -- get the code based on the update from WebEOC
    SELECT *
    INTO   _species_code
    FROM   PUBLIC.insert_and_return_code(_webeoc_species, 'speciescd');
   
    -- get the current species code
   	SELECT hc.species_code 
   	INTO _current_species_code
	FROM hwcr_complaint hc 
	WHERE hc.complaint_identifier = _complaint_identifier;


    if (_species_code <> _current_species_code) then 
    	update hwcr_complaint
    	set species_code = _species_code
    	where complaint_identifier = _complaint_identifier;
    end if;
   
    -- the update caused an edit, set the audit fields
    if (update_edit_ind) then
		update hwcr_complaint 
		set update_user_id = _update_userid, update_utc_timestamp = _update_utc_timestamp
		where complaint_identifier = _complaint_identifier;
    end if;

  end if;
 
  if (_report_type = 'ERS') then
	  update_edit_ind = false;
  	
  
      _in_progress_ind := (edit_complaint_data->>'violation_in_progress');
      _observed_ind := (edit_complaint_data->>'observe_violation');
      _suspect_witnesss_dtl_text := edit_complaint_data->>'suspect_details';

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
     
     -- Get the current state of the complaint
     SELECT *
     INTO   allegation_complaint_record
     FROM   PUBLIC.allegation_complaint ac
     WHERE  complaint_identifier = _complaint_identifier;

   

     if (_observed_ind_bool != allegation_complaint_record.observed_ind) then 
	    UPDATE allegation_complaint
	    SET observed_ind  = _observed_ind_bool
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
	 end if;
	
     if (_in_progress_ind_bool != allegation_complaint_record.in_progress_ind) then 
	    UPDATE allegation_complaint
	    SET in_progress_ind  = _in_progress_ind_bool
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
	 end if;
	
     if (_suspect_witnesss_dtl_text <> allegation_complaint_record.suspect_witnesss_dtl_text) then 
	    UPDATE allegation_complaint
	    SET suspect_witnesss_dtl_text  = _suspect_witnesss_dtl_text
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
	 end if;

  
	 SELECT *
	 FROM   PUBLIC.insert_and_return_code( edit_complaint_data->>'violation_type', 'violatncd' )
	 INTO   _violation_code;
	 
     select ac.violation_code
     into _current_violation_type_code
     from allegation_complaint ac
     where ac.complaint_identifier = _complaint_identifier;
    
    
     if (_violation_code <> _current_violation_type_code) then 
    	update allegation_complaint
    	set violation_code  = _violation_code
    	where complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
     end if;	
    -- the update caused an edit, set the audit fields
    if (update_edit_ind) then
		update hwcr_complaint 
		set update_user_id = _update_userid, update_utc_timestamp = _update_utc_timestamp
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