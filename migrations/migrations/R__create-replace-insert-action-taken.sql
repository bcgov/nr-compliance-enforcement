-- DROP FUNCTION public.process_staging_activity_taken(uuid, varchar);
CREATE
OR REPLACE FUNCTION public.process_staging_activity_taken (
  staging_id uuid,
  action_taken_type character varying
) RETURNS void LANGUAGE plpgsql AS $function$
DECLARE
  WEBEOC_USER_ID CONSTANT varchar(6) := 'webeoc'; 
  WEBEOC_ACTION_TIMESTAMP CONSTANT timestamp := NOW()::timestamp;

  STAGING_STATUS_CODE_PENDING CONSTANT varchar(7) := 'PENDING';
  STAGING_STATUS_CODE_SUCCESS CONSTANT varchar(7) := 'SUCCESS' ;
  STAGING_STATUS_CODE_ERROR CONSTANT varchar(5) := 'ERROR';
  
  -- select the stage object
  staged_data jsonb;

  _action_taken_id        UUID;
  _complaint_update_id    UUID;
  _complaint_id			  VARCHAR(20);
  _logged_by              VARCHAR(250);
  _action_timestamp       TIMESTAMP;
  _details                TEXT;
  _is_update              BOOL;
 
BEGIN

RAISE notice 'EXECUTING FUNCTION';

  SELECT sc.complaint_jsonb
  INTO   staged_data
  FROM   staging_complaint sc
  WHERE  sc.staging_complaint_guid = staging_id
  AND    sc.staging_status_code = STAGING_STATUS_CODE_PENDING 
  AND    sc.staging_activity_code = action_taken_type; 
    
  IF staged_data IS NULL THEN
	  -- RAISE notice 'NO COMPLAINT FOUND'; No complaint found is expected now for actions taken on complaints prior to Jan 1 2025
    RETURN;
  END IF;

  _action_taken_id := staged_data ->> 'actionTakenId';
  _complaint_id := staged_data ->> 'complaintId';
  _complaint_update_id := staged_data ->> 'complaintUpdateGuid';
  _logged_by := staged_data ->> 'loggedBy';
  _action_timestamp := (staged_data ->> 'actionTimestamp')::timestamp AT TIME ZONE 'America/Vancouver';
  _details := staged_data ->> 'details';
  _is_update := staged_data ->> 'isUpdate';

  -- insert new action-taken
  INSERT INTO public.action_taken (
    action_taken_guid, 
    complaint_identifier, 
    complaint_update_guid, 
    action_details_txt, 
    logged_by_txt, 
    action_utc_timestamp, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp
  )
  VALUES (
    _action_taken_id, 
    _complaint_id, 
    _complaint_update_id, 
    _details, 
    _logged_by, 
    _action_timestamp, 
    WEBEOC_USER_ID, WEBEOC_ACTION_TIMESTAMP, WEBEOC_USER_ID, WEBEOC_ACTION_TIMESTAMP
  );

  -- update the staging table
  UPDATE staging_complaint
  SET    staging_status_code = STAGING_STATUS_CODE_SUCCESS
  WHERE  staging_complaint_guid = staging_id
  AND    staging_status_code = STAGING_STATUS_CODE_PENDING 
  AND    staging_activity_code = action_taken_type;

  EXCEPTION
  WHEN OTHERS THEN
    RAISE notice 'An unexpected error occurred: %', SQLERRM;
    UPDATE staging_complaint
    SET    staging_status_code = STAGING_STATUS_CODE_ERROR
    WHERE  staging_complaint_guid = staging_id
    AND    staging_status_code = STAGING_STATUS_CODE_PENDING 
    AND    staging_activity_code = action_taken_type;
  

END;
$function$;