CREATE OR REPLACE FUNCTION complaint.edit_complaint_using_webeoc_complaint(_complaint_identifier character varying)
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
   
	current_complaint_record complaint; -- record being edited
	allegation_complaint_record allegation_complaint;
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
    from complaint.staging_complaint sc 
    where sc.complaint_identifier  = _complaint_identifier
    and sc.staging_activity_code  = STAGING_STATUS_CODE_EDIT
    and sc.staging_status_code  = STAGING_STATUS_CODE_PENDING
    order by sc.update_utc_timestamp desc
	limit 1;

    -- These fields are retrieved to potentially update an existing complaint record
	_edit_detail_text := edit_complaint_data ->> 'cos_call_details';
    _edit_caller_name := edit_complaint_data ->> 'cos_caller_name';
    _edit_caller_phone_1 := complaint.format_phone_number(edit_complaint_data ->> 'cos_primary_phone');
    _edit_caller_phone_2 := complaint.format_phone_number(edit_complaint_data ->> 'cos_alt_phone');
    _edit_caller_phone_3 := complaint.format_phone_number(edit_complaint_data ->> 'cos_alt_phone_2');
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
	_edit_address_coordinates_lat := complaint.validate_coordinate_field(edit_complaint_data ->> 'address_coordinates_lat');
    _edit_address_coordinates_long := complaint.validate_coordinate_field(edit_complaint_data ->> 'address_coordinates_long');
   
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
    FROM   complaint.insert_and_return_code(_edit_webeoc_reported_by_code, 'reprtdbycd');

   
    -- Get the current state of the complaint
    SELECT *
    INTO   current_complaint_record
    FROM   complaint.complaint
    WHERE  complaint_identifier = _complaint_identifier;

      -- update the complaint data, if the incoming webeoc contains applicable updates
   if (COALESCE(_edit_detail_text, '') <> COALESCE(current_complaint_record.detail_text, '')) then
	    UPDATE complaint.complaint
	    SET detail_text  = _edit_detail_text
	    WHERE complaint_identifier = _complaint_identifier;
	
	    update_edit_ind = true;
  end if;
   
   -- update the complaint data, if the incoming webeoc contains applicable updates
   if (COALESCE(_edit_caller_name, '') <> COALESCE(current_complaint_record.caller_name, '')) then
	    UPDATE complaint.complaint
	    SET caller_name = _edit_caller_name
	    WHERE complaint_identifier = _complaint_identifier;
	
	    update_edit_ind = true;
  end if;
  
  _edit_caller_phone_1 := complaint.format_phone_number(_edit_caller_phone_1);
  if (COALESCE(_edit_caller_phone_1, '') <> COALESCE(current_complaint_record.caller_phone_1, '')) then
        
	    UPDATE complaint.complaint
	    SET caller_phone_1 = _edit_caller_phone_1
	    WHERE complaint_identifier = _complaint_identifier;
	
	    update_edit_ind = true;
  end if;
  
  _edit_caller_phone_2 := complaint.format_phone_number(_edit_caller_phone_2);
  if (COALESCE(_edit_caller_phone_2, '') <> COALESCE(current_complaint_record.caller_phone_2, '')) then
    	
	    UPDATE complaint.complaint
	    SET caller_phone_2 = _edit_caller_phone_2
	    WHERE complaint_identifier = _complaint_identifier;
	
	    update_edit_ind = true;
  end if;
  
  _edit_caller_phone_3 := complaint.format_phone_number(_edit_caller_phone_3);
  if (COALESCE(_edit_caller_phone_3, '') <> COALESCE(current_complaint_record.caller_phone_3, '')) then
    	
	    UPDATE complaint.complaint
	    SET caller_phone_3 = _edit_caller_phone_3
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
  
  if (COALESCE(_edit_caller_email, '') <> COALESCE(current_complaint_record.caller_email, '')) then 
		UPDATE complaint.complaint
		SET caller_email = _edit_caller_email
		WHERE complaint_identifier = _complaint_identifier;
		update_edit_ind = true;
  end if;
  
  if (COALESCE(_edit_caller_address, '') <> COALESCE(current_complaint_record.caller_address, '')) then 
	    UPDATE complaint.complaint
	    SET caller_address = _edit_caller_address
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
 
  if (COALESCE(_edit_address, '') <> COALESCE(current_complaint_record.location_summary_text, '')) then 
	    UPDATE complaint.complaint
	    SET location_summary_text  = _edit_address
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
  
  if (COALESCE(_edit_cos_reffered_by_lst, '') <> COALESCE(current_complaint_record.reported_by_code, '')) then 
	    UPDATE complaint.complaint
	    SET reported_by_code = _edit_cos_reffered_by_lst
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
   
  if (COALESCE(_edit_reported_by_other_text, '') <> COALESCE(current_complaint_record.reported_by_other_text, '')) then 
	    UPDATE complaint.complaint
	    SET reported_by_other_text = _edit_reported_by_other_text
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
 
  if (COALESCE(_edit_location_detailed_text, '') <> COALESCE(current_complaint_record.location_detailed_text, '')) then 
	    UPDATE complaint.complaint
	    SET location_detailed_text  = _edit_location_detailed_text
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
 
  if (_edit_incident_utc_datetime <> current_complaint_record.incident_utc_datetime) then 
	    UPDATE complaint.complaint
	    SET incident_utc_datetime  = _edit_incident_utc_datetime
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
 
  if (_edit_incident_reported_utc_timestmp <> current_complaint_record.incident_reported_utc_timestmp) then 
	    UPDATE complaint.complaint
	    SET incident_reported_utc_timestmp  = _edit_incident_reported_utc_timestmp
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;

  if NOT ST_Equals(_edit_location_geometry_point, current_complaint_record.location_geometry_point) then
	    UPDATE complaint.complaint
	    SET location_geometry_point  = _edit_location_geometry_point
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
  end if;
   
  -- the update caused an edit, set the audit fields
  if (update_edit_ind) then
	update complaint.complaint
	set update_user_id = _edit_update_userid, update_utc_timestamp = _edit_update_utc_timestamp, comp_last_upd_utc_timestamp = _edit_update_utc_timestamp
	where complaint_identifier = _complaint_identifier;
  end if;
  
  if (_edit_report_type = 'HWCR') then
      update_edit_ind = false;
	  select hc.hwcr_complaint_guid 
	  into hwcr_uuid
	  from complaint.hwcr_complaint hc where complaint_identifier  = _complaint_identifier;
	 
	  update complaint.attractant_hwcr_xref
	  set active_ind = false
	  where hwcr_complaint_guid = hwcr_uuid;
	 
      -- Convert the comma-separated list into an array
      attractants_array := string_to_array( edit_complaint_data ->> 'attractants_list', ',' );
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
    FROM   complaint.insert_and_return_code(_edit_webeoc_species, 'speciescd');
   
    -- get the current species code
   	SELECT hc.species_code 
   	INTO _current_species_code
	FROM complaint.hwcr_complaint hc 
	WHERE hc.complaint_identifier = _complaint_identifier;


    if (_edit_species_code <> _current_species_code) then 
    	update complaint.hwcr_complaint
    	set species_code = _edit_species_code
    	where complaint_identifier = _complaint_identifier;
    end if;
   
    -- the update caused an edit, set the audit fields
    if (update_edit_ind) then
		update complaint.hwcr_complaint 
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
     FROM   complaint.allegation_complaint ac
     WHERE  complaint_identifier = _complaint_identifier;

   

     if (_edit_observed_ind_bool != allegation_complaint_record.observed_ind) then 
	    UPDATE complaint.allegation_complaint
	    SET observed_ind  = _edit_observed_ind_bool
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
	 end if;
	
     if (_edit_in_progress_ind_bool != allegation_complaint_record.in_progress_ind) then 
	    UPDATE complaint.allegation_complaint
	    SET in_progress_ind  = _edit_in_progress_ind_bool
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
	 end if;
	
     if (_edit_suspect_witnesss_dtl_text <> allegation_complaint_record.suspect_witnesss_dtl_text) then 
	    UPDATE complaint.allegation_complaint
	    SET suspect_witnesss_dtl_text  = _edit_suspect_witnesss_dtl_text
	    WHERE complaint_identifier = _complaint_identifier;
	    update_edit_ind = true;
	 end if;

  
	 SELECT *
	 FROM   complaint.insert_and_return_code( edit_complaint_data->>'violation_type', 'violatncd' )
	 INTO   _edit_violation_code;
	 
     select ac.violation_code
     into _current_violation_type_code
     from complaint.allegation_complaint ac
     where ac.complaint_identifier = _complaint_identifier;

    if (_edit_violation_code <> _current_violation_type_code) then
	    if _edit_violation_code = 'WASTE' OR _edit_violation_code = 'PESTICDE' then
        UPDATE complaint.complaint
        SET    owned_by_agency_code = 'EPO'
        WHERE  complaint_identifier = _complaint_identifier;
      else
        UPDATE complaint.complaint
        SET    owned_by_agency_code = 'COS'
        WHERE  complaint_identifier = _complaint_identifier;
      end if;  
	    
      update complaint.allegation_complaint
      set violation_code  = _edit_violation_code
      where complaint_identifier = _complaint_identifier;
      update_edit_ind = true;
    end if;

    -- the update caused an edit, set the audit fields
    if (update_edit_ind) then
		update complaint.hwcr_complaint 
		set update_user_id = _edit_update_userid, update_utc_timestamp = _edit_update_utc_timestamp
		where complaint_identifier = _complaint_identifier;
    end if;
  end if;
 
    -- Update staging_complaint to mark the process as successful
   UPDATE complaint.staging_complaint
   SET    staging_status_code = STAGING_STATUS_CODE_SUCCESS
   WHERE  complaint_identifier = _complaint_identifier
   AND    staging_activity_code = STAGING_STATUS_CODE_EDIT
   and 	  staging_status_code = 'PENDING';

EXCEPTION
WHEN OTHERS THEN
    RAISE NOTICE 'An unexpected error occurred: %', SQLERRM;
    UPDATE complaint.staging_complaint
    SET    staging_status_code = STAGING_STATUS_CODE_ERROR
    WHERE  complaint_identifier = _complaint_identifier
    AND    staging_status_code = STAGING_STATUS_CODE_PENDING
    AND    staging_activity_code = STAGING_STATUS_CODE_EDIT;

END;
$function$
;
