CREATE OR REPLACE FUNCTION complaint.insert_complaint_update_from_staging(_complaint_identifier character varying, _update_number integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
   
    -- Variable to hold the JSONB data from staging_complaint. Used to create a new complaint
    update_complaint_data JSONB;
    UPDATE_NUMBER_TXT CONSTANT varchar(13) = 'update_number';
    WEBEOC_USER_ID CONSTANT varchar(6) := 'webeoc';
    WEBEOC_UPDATE_TYPE_INSERT CONSTANT varchar(6) := 'INSERT';
    STAGING_STATUS_CODE_PENDING CONSTANT varchar(7) := 'PENDING';
    STAGING_STATUS_CODE_SUCCESS CONSTANT varchar(7) := 'SUCCESS' ;
    STAGING_STATUS_CODE_UPDATE CONSTANT varchar(6) := 'UPDATE' ;
    STAGING_STATUS_CODE_ERROR CONSTANT varchar(5) := 'ERROR';
   
   
    
BEGIN
    -- Fetch the JSONB data from complaint_staging using the provided identifier
    SELECT sc.complaint_jsonb
    INTO   update_complaint_data
    FROM   complaint.staging_complaint sc
    WHERE  sc.complaint_identifier = _complaint_identifier
    AND    (sc.complaint_jsonb ->> UPDATE_NUMBER_TXT)::INT = _update_number
    AND    sc.staging_status_code = STAGING_STATUS_CODE_PENDING -- meaning that this complaint hasn't yet been moved to the complaint table yet
    AND    sc.staging_activity_code = STAGING_STATUS_CODE_UPDATE;

    -- This means that we're dealing with a new complaint from WebEOC, not an update
    IF update_complaint_data IS NULL THEN
        RETURN;
    END IF;
   
   -- update complaint data based on the incoming webeoc update, if necessary
   perform complaint.update_complaint_using_webeoc_update(_complaint_identifier, update_complaint_data);
   
   -- create an update record if required
   perform complaint.log_complaint_update(_complaint_identifier, update_complaint_data);

   -- Update staging_complaint to mark the process as successful
   UPDATE complaint.staging_complaint
   SET    staging_status_code = STAGING_STATUS_CODE_SUCCESS
   WHERE  complaint_identifier = _complaint_identifier
   AND    (complaint_jsonb ->> UPDATE_NUMBER_TXT)::INT = _update_number
   AND    staging_activity_code = STAGING_STATUS_CODE_UPDATE;

EXCEPTION
WHEN OTHERS THEN
    RAISE NOTICE 'An unexpected error occurred: %', SQLERRM;
    UPDATE complaint.staging_complaint
    SET    staging_status_code = STAGING_STATUS_CODE_ERROR
    WHERE  complaint_identifier = _complaint_identifier
    AND    staging_status_code = STAGING_STATUS_CODE_PENDING
    AND    (complaint_jsonb ->> UPDATE_NUMBER_TXT)::INT = _update_number
    AND    staging_activity_code = STAGING_STATUS_CODE_UPDATE;
END;
$function$
;
