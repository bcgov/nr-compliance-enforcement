-- Given a complaint identifier and an update record from WebEOC, create a complaint_update record
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

    -- Extract and prepare data for 'complaint_update' table
    _upd_detail_text := update_complaint_data ->> 'update_call_details';
    _upd_location_summary_text := update_complaint_data ->> 'update_address';
    _upd_location_detailed_text := update_complaint_data ->> 'update_location_description';
    _update_address_coordinates_lat := update_complaint_data ->> 'update_address_coordinates_lat';
    _update_address_coordinates_long := update_complaint_data ->> 'update_address_coordinates_long';
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

    -- Insert the record if there are any differences
    IF has_difference THEN
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
    END IF;
END;
$function$;