CREATE
OR REPLACE FUNCTION complaint.insert_and_return_code (
  webeoc_value character varying,
  code_table_type character varying
) RETURNS character varying LANGUAGE plpgsql AS $function$
DECLARE
    new_code VARCHAR(10);  -- used in case we're creating a new code
    truncated_code varchar(10); -- if we're creating a new code, base it off of the webeoc_value.  We'll truncate this and get rid of spaces, and possibly append a number to make it unique
    truncated_short_description varchar(50); -- if we're creating a new short description, truncate this to 50 characters just in case it is too long
    live_code_value VARCHAR;
    current_utc_timestamp TIMESTAMP WITH TIME ZONE := NOW();
    target_code_table VARCHAR;
    column_name VARCHAR;
    code_exists BOOLEAN;
    suffix VARCHAR(10) := ''; -- Suffix for uniqueness
    counter INTEGER := 1; -- Counter for unique code generation
    new_display_order INTEGER; -- used for setting the display_order value of the new code
    webeoc_user_id CONSTANT varchar(6) := 'webeoc';
   
BEGIN
    -- Truncate and uppercase the webEOC value, get rid of spaces, and truncate to 9 characters to ensure we have room for adding a number for uniqueness
    truncated_code := UPPER(LEFT(regexp_replace(webeoc_value, '\s', '', 'g'), 10));
   
    -- Return null if truncated_code is empty or null
    IF truncated_code IS NULL OR truncated_code = '' THEN
        RETURN NULL;
    END IF;

    truncated_short_description := LEFT(webeoc_value, 50);

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
        WHEN 'girtypecd' THEN
            target_code_table := 'gir_type_code';
            column_name := 'gir_type_code';

        ELSE RAISE EXCEPTION 'Invalid code_table_type provided: %', code_table_type;
    END CASE;
    
    -- Check if the code exists in staging_metadata_mapping
    SELECT live_data_value INTO live_code_value
    FROM complaint.staging_metadata_mapping
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
        EXECUTE format('SELECT EXISTS(SELECT 1 FROM "complaint".%I WHERE %I = $1)', target_code_table, column_name)
        INTO code_exists
        USING new_code;
        
        IF NOT code_exists then
        
        	-- Determine the correct display_order for the new code
            EXECUTE format('SELECT COALESCE(MAX(display_order) + 1, 1) FROM "complaint".%I WHERE %I < $1', target_code_table, column_name)
            INTO new_display_order
            USING new_code;
           
			-- Re-index the display_orders
            EXECUTE format('UPDATE "complaint".%I SET display_order = display_order + 1 WHERE display_order >= $1', target_code_table)
            USING new_display_order;
           
            -- Insert new code into the specific code table
            EXECUTE format('INSERT INTO "complaint".%I (%I, short_description, long_description, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp, display_order) VALUES ($1, $2, $3, ''Y'', $6, $4, $6, $4, $5)', target_code_table, column_name)
            USING new_code, truncated_short_description, webeoc_value, current_utc_timestamp, new_display_order, webeoc_user_id;

            -- Update configuration_value by 1 to nofity front-end to update
            UPDATE complaint.configuration
            SET    configuration_value = configuration_value::int + 1
            WHERE  configuration_code = 'CDTABLEVER';

            -- Insert into staging_metadata_mapping
            INSERT INTO complaint.staging_metadata_mapping (entity_code, staged_data_value, live_data_value, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
            VALUES (code_table_type, webeoc_value, new_code, webeoc_user_id, current_utc_timestamp, webeoc_user_id, current_utc_timestamp);

            RETURN new_code; -- Return the new unique code
        ELSE
            -- If the code exists, increment the suffix and try again
            suffix := counter::text;
            counter := counter + 1;
        END IF;
    END LOOP;
   
END;
$function$;

CREATE
OR REPLACE FUNCTION complaint.format_phone_number (phone_number text) RETURNS text LANGUAGE plpgsql AS $function$
DECLARE
    formatted_phone_number TEXT;
BEGIN
    -- Remove all non-digit characters
    formatted_phone_number := regexp_replace(phone_number, '[^0-9]', '', 'g');
    IF (formatted_phone_number IS NULL or (length(formatted_phone_number) = 0)) then
		return null;
    END IF;
    -- Check if the first character is '1'
    IF left(formatted_phone_number, 1) = '1' THEN
        -- Add '+' in front of the phone number
        RETURN '+' || left(formatted_phone_number, 14);
    ELSE
        -- Add '+1' in front of the phone number
        RETURN '+1' || left(formatted_phone_number,13);
    END IF;
END;
$function$;

CREATE
OR REPLACE FUNCTION complaint.validate_coordinate_field (coordinate_field text) RETURNS text LANGUAGE plpgsql AS $function$
DECLARE
    formatted_coordinate_field TEXT;
BEGIN
    -- Confirm the coordinate_field is a valid value 
    formatted_coordinate_field := regexp_substr(coordinate_field, '^[-+]?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})');
    IF (formatted_coordinate_field IS NULL or (length(formatted_coordinate_field) = 0)) then
		return NULL;
	-- Valid match so return the formatted_coordinate_field
	else return formatted_coordinate_field;
    END IF;
END;
$function$;