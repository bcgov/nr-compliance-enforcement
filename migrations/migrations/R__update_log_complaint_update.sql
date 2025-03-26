CREATE
OR REPLACE FUNCTION public.log_complaint_update (
    _complaint_identifier character varying,
    update_complaint_data jsonb
) RETURNS void LANGUAGE plpgsql AS $function$
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
    _upd_caller_name VARCHAR(120);
    _upd_caller_phone_1 VARCHAR(15);
    _upd_caller_phone_2 VARCHAR(15);
    _upd_caller_phone_3 VARCHAR(15);
    _upd_caller_address VARCHAR(120);
    _upd_caller_email VARCHAR(120);
    _upd_reported_by_code VARCHAR(10);
    _upd_reported_by_other_text VARCHAR(120);
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
    insert_upd_caller_name VARCHAR(120);
    insert_upd_caller_phone_1 VARCHAR(15);
    insert_upd_caller_phone_2 VARCHAR(15);
    insert_upd_caller_phone_3 VARCHAR(15);
    insert_upd_caller_address VARCHAR(120);
    insert_upd_caller_email VARCHAR(120);
    insert_upd_reported_by_code VARCHAR(10);
    insert_upd_reported_by_other_text VARCHAR(120);
    
    -- Flag to indicate if there's any difference
    has_difference BOOLEAN := FALSE;
   
    USERNAME_TXT CONSTANT varchar(8) = 'username';

	_webeoc_identifier VARCHAR(20);

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
    _update_address_coordinates_lat := update_complaint_data ->> 'update_address_coordinates_lat';
    _update_address_coordinates_long := update_complaint_data ->> 'update_address_coordinates_long';
    _upd_caller_name := update_complaint_data ->> 'update_caller_name';
    _upd_caller_phone_1 := update_complaint_data ->> 'update_primary_phone';
    _upd_caller_phone_2 := update_complaint_data ->> 'update_alt_phone';
    _upd_caller_phone_3 := update_complaint_data ->> 'update_alt_phone_2';
    _upd_caller_address := update_complaint_data ->> 'update_caller_address';
    _upd_caller_email := update_complaint_data ->> 'update_caller_email';
    _upd_reported_by_code := update_complaint_data ->> 'update_reffered_by_lst';
    _upd_reported_by_other_text := update_complaint_data ->> 'update_reffered_by_txt';
    _create_userid := substring(update_complaint_data ->> USERNAME_TXT from 1 for 32);
    _update_userid := substring(update_complaint_data ->> USERNAME_TXT from 1 for 32);
	_webeoc_identifier := update_complaint_data ->> 'dataid'; 

    -- Get the codes from our application (inserting if necessary) for the codes retrieved from WebEOC
    SELECT *
    INTO   _upd_reported_by_code
    FROM   PUBLIC.insert_and_return_code(_upd_reported_by_code, 'reprtdbycd');

    -- Format Phone Numbers
    _upd_caller_phone_1 := format_phone_number(_upd_caller_phone_1);
    _upd_caller_phone_2 := format_phone_number(_upd_caller_phone_2);
    _upd_caller_phone_3 := format_phone_number(_upd_caller_phone_3);

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
    ELSE IF _update_number_exists THEN
        insert_upd_detail_text := prev_complaint_update_record.upd_detail_text;
    ELSE
        insert_upd_detail_text := NULL;
    END IF;

    IF (_upd_location_summary_text IS NOT NULL AND _upd_location_summary_text <> '' AND
        (_upd_location_summary_text IS DISTINCT FROM prev_complaint_update_record.upd_location_summary_text OR prev_complaint_update_record.upd_location_summary_text IS NULL) AND
        (_upd_location_summary_text IS DISTINCT FROM current_complaint_record.location_summary_text OR current_complaint_record.location_summary_text IS NULL)) THEN
        insert_upd_location_summary_text := _upd_location_summary_text;
        has_difference := TRUE;
    ELSE IF _update_number_exists THEN
        insert_upd_location_summary_text := prev_complaint_update_record.upd_location_summary_text;
    ELSE
        insert_upd_location_summary_text := NULL;
    END IF;

    IF (_upd_location_detailed_text IS NOT NULL AND _upd_location_detailed_text <> '' AND
        (_upd_location_detailed_text IS DISTINCT FROM prev_complaint_update_record.upd_location_detailed_text OR prev_complaint_update_record.upd_location_detailed_text IS NULL) AND
        (_upd_location_detailed_text IS DISTINCT FROM current_complaint_record.location_detailed_text OR current_complaint_record.location_detailed_text IS NULL)) THEN
        insert_upd_location_detailed_text := _upd_location_detailed_text;
        has_difference := TRUE;
    ELSE IF _update_number_exists THEN
        insert_upd_location_detailed_text := prev_complaint_update_record.upd_location_detailed_text;
    ELSE
        insert_upd_location_detailed_text := NULL;
    END IF;

    IF (_upd_location_geometry_point IS NOT NULL AND
        (_upd_location_geometry_point IS DISTINCT FROM prev_complaint_update_record.upd_location_geometry_point OR prev_complaint_update_record.upd_location_geometry_point IS NULL) AND
        (_upd_location_geometry_point IS DISTINCT FROM current_complaint_record.location_geometry_point OR current_complaint_record.location_geometry_point IS NULL)) THEN
        insert_upd_location_geometry_point := _upd_location_geometry_point;
        has_difference := TRUE;
    ELSE IF _update_number_exists THEN
        insert_upd_location_geometry_point := prev_complaint_update_record.upd_location_geometry_point;
    ELSE
        insert_upd_location_geometry_point := NULL;
    END IF;

    IF (_upd_caller_name IS NOT NULL AND _upd_caller_name <> '' AND
        (_upd_caller_name IS DISTINCT FROM prev_complaint_update_record.upd_caller_name OR prev_complaint_update_record.upd_caller_name IS NULL) AND
        (_upd_caller_name IS DISTINCT FROM current_complaint_record.caller_name OR current_complaint_record.caller_name IS NULL)) THEN
        insert_upd_caller_name := _upd_caller_name;
        has_difference := TRUE;
    ELSE IF _update_number_exists THEN
        insert_upd_caller_name := prev_complaint_update_record.upd_caller_name;
    ELSE
        insert_upd_caller_name := NULL;
    END IF;

    IF (_upd_caller_phone_1 IS NOT NULL AND _upd_caller_phone_1 <> '' AND
        (_upd_caller_phone_1 IS DISTINCT FROM prev_complaint_update_record.upd_caller_phone_1 OR prev_complaint_update_record.upd_caller_phone_1 IS NULL) AND
        (_upd_caller_phone_1 IS DISTINCT FROM current_complaint_record.caller_phone_1 OR current_complaint_record.caller_phone_1 IS NULL)) THEN
        insert_upd_caller_phone_1 := _upd_caller_phone_1;
        has_difference := TRUE;
    ELSE IF _update_number_exists THEN
        insert_upd_caller_phone_1 := prev_complaint_update_record.upd_caller_phone_1;
    ELSE
        insert_upd_caller_phone_1 := NULL;
    END IF;

    IF (_upd_caller_phone_2 IS NOT NULL AND _upd_caller_phone_2 <> '' AND
        (_upd_caller_phone_2 IS DISTINCT FROM prev_complaint_update_record.upd_caller_phone_2 OR prev_complaint_update_record.upd_caller_phone_2 IS NULL) AND
        (_upd_caller_phone_2 IS DISTINCT FROM current_complaint_record.caller_phone_2 OR current_complaint_record.caller_phone_2 IS NULL)) THEN
        insert_upd_caller_phone_2 := _upd_caller_phone_2;
        has_difference := TRUE;
    ELSE IF _update_number_exists THEN
        insert_upd_caller_phone_2 := prev_complaint_update_record.upd_caller_phone_2;
    ELSE
        insert_upd_caller_phone_2 := NULL;
    END IF;

    IF (_upd_caller_phone_3 IS NOT NULL AND _upd_caller_phone_3 <> '' AND
        (_upd_caller_phone_3 IS DISTINCT FROM prev_complaint_update_record.upd_caller_phone_3 OR prev_complaint_update_record.upd_caller_phone_3 IS NULL) AND
        (_upd_caller_phone_3 IS DISTINCT FROM current_complaint_record.caller_phone_3 OR current_complaint_record.caller_phone_3 IS NULL)) THEN
        insert_upd_caller_phone_3 := _upd_caller_phone_3;
        has_difference := TRUE;
    ELSE IF _update_number_exists THEN
        insert_upd_caller_phone_3 := prev_complaint_update_record.upd_caller_phone_3;
    ELSE
        insert_upd_caller_phone_3 := NULL;
    END IF;

    IF (_upd_caller_address IS NOT NULL AND _upd_caller_address <> '' AND
        (_upd_caller_address IS DISTINCT FROM prev_complaint_update_record.upd_caller_address OR prev_complaint_update_record.upd_caller_address IS NULL) AND
        (_upd_caller_address IS DISTINCT FROM current_complaint_record.caller_address OR current_complaint_record.caller_address IS NULL)) THEN
        insert_upd_caller_address := _upd_caller_address;
        has_difference := TRUE;
    ELSE IF _update_number_exists THEN
        insert_upd_caller_address := prev_complaint_update_record.upd_caller_address;
    ELSE
        insert_upd_caller_address := NULL;
    END IF;

    IF (_upd_caller_email IS NOT NULL AND _upd_caller_email <> '' AND
        (_upd_caller_email IS DISTINCT FROM prev_complaint_update_record.upd_caller_email OR prev_complaint_update_record.upd_caller_email IS NULL) AND
        (_upd_caller_email IS DISTINCT FROM current_complaint_record.caller_email OR current_complaint_record.caller_email IS NULL)) THEN
        insert_upd_caller_email := _upd_caller_email;
        has_difference := TRUE;
    ELSE IF _update_number_exists THEN
        insert_upd_caller_email := prev_complaint_update_record.upd_caller_email;
    ELSE
        insert_upd_caller_email := NULL;
    END IF;

    IF (_upd_reported_by_code IS NOT NULL AND _upd_reported_by_code <> '' AND
        (_upd_reported_by_code IS DISTINCT FROM prev_complaint_update_record.upd_reported_by_code OR prev_complaint_update_record.upd_reported_by_code IS NULL) AND
        (_upd_reported_by_code IS DISTINCT FROM current_complaint_record.reported_by_code OR current_complaint_record.reported_by_code IS NULL)) THEN
        insert_upd_reported_by_code := _upd_reported_by_code;
        has_difference := TRUE;
    ELSE IF _update_number_exists THEN
        insert_upd_reported_by_code := prev_complaint_update_record.upd_reported_by_code;
    ELSE
        insert_upd_reported_by_code := NULL;
    END IF;

    IF (_upd_reported_by_other_text IS NOT NULL AND _upd_reported_by_other_text <> '' AND
        (_upd_reported_by_other_text IS DISTINCT FROM prev_complaint_update_record.upd_reported_by_other_text OR prev_complaint_update_record.upd_reported_by_other_text IS NULL) AND
        (_upd_reported_by_other_text IS DISTINCT FROM current_complaint_record.reported_by_other_text OR current_complaint_record.reported_by_other_text IS NULL)) THEN
        insert_upd_reported_by_other_text := _upd_reported_by_other_text;
        has_difference := TRUE;
    ELSE IF _update_number_exists THEN
        insert_upd_reported_by_other_text := prev_complaint_update_record.upd_reported_by_other_text;
    ELSE
        insert_upd_reported_by_other_text := NULL;
    END IF;

    -- Insert the record if there are any differences, either log the complaint or update the previously existing complaint
    IF has_difference then
    	if _update_number_exists then
	    	UPDATE PUBLIC.complaint_update 
	    		set upd_detail_text = insert_upd_detail_text,
		            upd_location_summary_text = insert_upd_location_summary_text,
		            upd_location_detailed_text = insert_upd_location_detailed_text,
		            upd_location_geometry_point = insert_upd_location_geometry_point,
                    upd_caller_name = insert_upd_caller_name,	
                    upd_caller_phone_1 = insert_upd_caller_phone_1,
                    upd_caller_phone_2 = insert_upd_caller_phone_2,
                    upd_caller_phone_3 = insert_upd_caller_phone_3,
                    upd_caller_address = insert_upd_caller_address,
                    upd_caller_email = insert_upd_caller_email,
                    upd_reported_by_code = insert_upd_reported_by_code,
                    upd_reported_by_other_text = insert_upd_reported_by_other_text,
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
                upd_caller_name,
                upd_caller_phone_1,
                upd_caller_phone_2,
                upd_caller_phone_3,
                upd_caller_address,
                upd_caller_email,
                upd_reported_by_code,
                upd_reported_by_other_text,
	            create_user_id,
	            create_utc_timestamp,
	            update_user_id,
	            update_utc_timestamp,
				webeoc_identifier
	        ) VALUES (
	            _complaint_identifier,
	            _update_number,
	            insert_upd_detail_text,
	            insert_upd_location_summary_text,
	            insert_upd_location_detailed_text,
	            insert_upd_location_geometry_point,
                insert_upd_caller_name,
                insert_upd_caller_phone_1,
                insert_upd_caller_phone_2,
                insert_upd_caller_phone_3,
                insert_upd_caller_address,
                insert_upd_caller_email,
                insert_upd_reported_by_code,
                insert_upd_reported_by_other_text,
	            _create_userid,
	            _create_utc_timestamp,
	            _update_userid,
	            _update_utc_timestamp,
				_webeoc_identifier
	        );
       end if;
       
       -- Update timestamp to latest
       UPDATE PUBLIC.complaint
       SET    update_utc_timestamp = _update_utc_timestamp, update_user_id = _update_userid
       WHERE  complaint_identifier = _complaint_identifier;
    END IF;
END;
$function$;
