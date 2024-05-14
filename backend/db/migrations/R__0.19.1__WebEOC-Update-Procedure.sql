CREATE OR REPLACE FUNCTION PUBLIC.insert_complaint_update_from_staging(
    _complaint_identifier CHARACTER VARYING,
    _update_number INT4
) RETURNS VOID LANGUAGE plpgsql
AS $function$
DECLARE
    -- Used to determine if an update comes in that's the same as the previous complaint update
    prev_complaint_update_record PUBLIC.complaint_update;

    -- used to compare an incoming update against the current state of the complaint record
    current_complaint_record PUBLIC.complaint;
   
    -- used to determine if a webeoc update is actually an update.  WebEOC's API will unfortunately default to
    -- the original value of a field if another field is updated.  So, we ignore these as part of updates.  This
    -- means that WebEOC will not be able to update a value to the original value, but that's something the project
    -- team has decided to risk.
    original_complaint_record JSONB;
   
    -- Variable to hold the JSONB data from staging_complaint. Used to create a new complaint
    complaint_data JSONB;
   
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
   
    -- Variables from webeoc that may be used to update a record in the COMPLAINT table
    _update_caller_name VARCHAR(120);
    _update_caller_phone_1 VARCHAR(15);
    _update_caller_phone_2 VARCHAR(15);
    _update_caller_phone_3 VARCHAR(15);
    _update_caller_email VARCHAR(120);
    _update_caller_address VARCHAR(120);
    _update_reported_by_code VARCHAR(10);
    _update_webeoc_reported_by_code VARCHAR(200);
    _update_reported_by_other_text VARCHAR(120);
    _update_webeoc_species VARCHAR(200); -- species code from WebEOC
    _update_species_code VARCHAR(10); -- our species code, based on the code from WebEOC
    
    -- Original complaint values, used to compare against incoming changes
    _original_caller_name VARCHAR(120);
    _original_caller_phone_1 VARCHAR(15);
    _original_caller_phone_2 VARCHAR(15);
    _original_caller_phone_3 VARCHAR(15);
    _original_caller_email VARCHAR(120);
    _original_caller_address VARCHAR(120);
    _original_reported_by_code VARCHAR(10);
    _original_reported_by_other_text VARCHAR(120);
    _original_species_code VARCHAR(10);
   
   
    
BEGIN
    -- Fetch the JSONB data from complaint_staging using the provided identifier
    SELECT sc.complaint_jsonb
    INTO   complaint_data
    FROM   staging_complaint sc
    WHERE  sc.complaint_identifier = _complaint_identifier
    AND    (sc.complaint_jsonb ->> 'update_number')::INT = _update_number
    AND    sc.staging_status_code = 'PENDING' -- meaning that this complaint hasn't yet been moved to the complaint table yet
    AND    sc.staging_activity_code = 'UPDATE';

    -- This means that we're dealing with a new complaint from WebEOC, not an update
    IF complaint_data IS NULL THEN
        RETURN;
    END IF;

    -- Extract and prepare data for 'complaint_update' table. These will not update an existing complaint record.
    _upd_detail_text := complaint_data ->> 'update_call_details';
    _upd_location_summary_text := complaint_data ->> 'update_address';
    _upd_location_detailed_text := complaint_data ->> 'update_location_decription';
    _update_address_coordinates_lat := complaint_data ->> 'update_address_coordinates_lat';
    _update_address_coordinates_long := complaint_data ->> 'update_address_coordinates_long';
    _create_userid := substring(complaint_data ->> 'username' from 1 for 32);
    _update_userid := substring(complaint_data ->> 'username' from 1 for 32);

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

    -- These fields are retrieved to potentially update an existing complaint record
    _update_caller_name := complaint_data ->> 'update_caller_name';
    _update_caller_phone_1 := complaint_data ->> 'update_primary_phone';
    _update_caller_phone_2 := complaint_data ->> 'update_alternate_phone';
    _update_caller_phone_3 := complaint_data ->> 'update_alternate_2_phone';
    _update_caller_email := complaint_data ->> 'update_caller_email';
    _update_caller_address := complaint_data ->> 'update_caller_address';
    _update_webeoc_reported_by_code := complaint_data ->> 'update_reffered_by_lst';
    _update_reported_by_other_text := complaint_data ->> 'update_reffered_by_txt';
    _update_webeoc_species := complaint_data ->> 'update_species';

   
   

    -- Get the codes from our application (inserting if necessary) for the codes retrieved from WebEOC
    SELECT *
    INTO   _update_reported_by_code
    FROM   PUBLIC.insert_and_return_code(_update_webeoc_reported_by_code, 'reprtdbycd');

    SELECT *
    INTO   _update_species_code
    FROM   PUBLIC.insert_and_return_code(_update_webeoc_species, 'speciescd');

    -- Get the previous update, we want to make sure that this update is actually different
    SELECT *
    INTO   prev_complaint_update_record
    FROM   PUBLIC.complaint_update
    WHERE  complaint_identifier = _complaint_identifier
    AND    update_seq_number = _update_number - 1;
   
    -- Get the current state of the complaint
    SELECT *
    INTO   current_complaint_record
    FROM   PUBLIC.complaint
    WHERE  complaint_identifier = _complaint_identifier;
   
    -- Get the original record via the history table
    select ch.data_after_executed_operation
    into original_complaint_record
    from PUBLIC.complaint_h ch 
    where ch.target_row_id = _complaint_identifier
    and ch.operation_type = 'I';
   
   -- Parse the variables out of the original complaint history record
    _original_caller_name := original_complaint_record ->> 'caller_name';
    _original_caller_phone_1 := original_complaint_record ->> 'caller_phone_1';
    _original_caller_phone_2 := original_complaint_record ->> 'caller_phone_2';
    _original_caller_phone_3 := original_complaint_record ->> 'caller_phone_3';
    _original_caller_email := original_complaint_record ->> 'caller_email';
    _original_caller_address := original_complaint_record ->> 'caller_address';
    -- need to get from hrc/allegation history table
    --_original_reported_by_code := original_complaint_record ->> 'caller_name';
    --_original_reported_by_other_text := original_complaint_record ->> 'caller_name';
    --_original_species_code := original_complaint_record ->> 'caller_name';
   
   -- update the complaint data, if the incoming webeoc contains applicable updates
   
   if ((_update_caller_name <> _original_caller_name) and (_update_caller_name <> current_complaint_record.caller_name)) then
	update complaint
	set caller_name = _update_caller_name, update_user_id = _update_userid, update_utc_timestamp = _update_utc_timestamp
	where complaint_identifier = complaint_identifier;
   end if;
  
  if ((_update_caller_phone_1 <> _original_caller_phone_1) and (_update_caller_phone_1 <> current_complaint_record.caller_phone_1)) then
	update complaint
	set caller_phone_1 = _update_caller_phone_1, update_user_id = _update_userid, update_utc_timestamp = _update_utc_timestamp
	where complaint_identifier = complaint_identifier;
   end if;
  
  if ((_update_caller_phone_2 <> _original_caller_phone_2) and (_update_caller_phone_2 <> current_complaint_record.caller_phone_2)) then
	update complaint
	set caller_phone_2 = _update_caller_phone_2, update_user_id = _update_userid, update_utc_timestamp = _update_utc_timestamp
	where complaint_identifier = complaint_identifier;
   end if;
  
  if ((_update_caller_phone_3 <> _original_caller_phone_3) and (_update_caller_phone_3 <> current_complaint_record.caller_phone_3)) then
	update complaint
	set caller_phone_3 = _update_caller_phone_3, update_user_id = _update_userid, update_utc_timestamp = _update_utc_timestamp
	where complaint_identifier = complaint_identifier;
   end if;
  
  if ((_update_caller_email <> _original_caller_email) and (_update_caller_email <> current_complaint_record.caller_email)) then
	update complaint
	set caller_email = _update_caller_email, update_user_id = _update_userid, update_utc_timestamp = _update_utc_timestamp
	where complaint_identifier = complaint_identifier;
   end if;
  
  if ((_update_caller_address <> _original_caller_address) and (_update_caller_address <> current_complaint_record.caller_address)) then
	update complaint
	set caller_address = _update_caller_address, update_user_id = _update_userid, update_utc_timestamp = _update_utc_timestamp
	where complaint_identifier = complaint_identifier;
   end if;

    -- log the new complaint update
    -- If there is no previous record or if there are changes in any of the columns, insert a new record
    IF NOT FOUND OR
       (prev_complaint_update_record.upd_detail_text <> _upd_detail_text OR
        prev_complaint_update_record.upd_location_summary_text <> _upd_location_summary_text OR
        prev_complaint_update_record.upd_location_detailed_text <> _upd_location_detailed_text OR
        prev_complaint_update_record.upd_location_geometry_point <> _upd_location_geometry_point OR
        prev_complaint_update_record.create_user_id <> _create_userid OR
        prev_complaint_update_record.update_user_id <> _update_userid OR
        prev_complaint_update_record.create_utc_timestamp <> _create_utc_timestamp OR
        prev_complaint_update_record.update_utc_timestamp <> _update_utc_timestamp) THEN
        -- Insert data into 'complaint_update' table
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
            _upd_detail_text,
            _upd_location_summary_text,
            _upd_location_detailed_text,
            _upd_location_geometry_point,
            _create_userid,
            _create_utc_timestamp,
            _update_userid,
            _update_utc_timestamp
        );
    END IF;

    -- Update staging_complaint to mark the process as successful
    UPDATE staging_complaint
    SET    staging_status_code = 'SUCCESS'
    WHERE  complaint_identifier = _complaint_identifier
    AND    (complaint_jsonb ->> 'update_number')::INT = _update_number
    AND    staging_activity_code = 'UPDATE';

EXCEPTION
WHEN OTHERS THEN
    RAISE NOTICE 'An unexpected error occurred: %', SQLERRM;
    UPDATE staging_complaint
    SET    staging_status_code = 'ERROR'
    WHERE  complaint_identifier = _complaint_identifier
    AND    staging_status_code = 'PENDING'
    AND    (complaint_jsonb ->> 'update_number')::INT = _update_number
    AND    staging_activity_code = 'UPDATE';
END;
$function$;
