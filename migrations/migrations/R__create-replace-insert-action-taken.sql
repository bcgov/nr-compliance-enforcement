-- DROP FUNCTION public.process_staging_activity_taken;
SET
  TIMEZONE = 'America/Vancouver';

CREATE
OR REPLACE FUNCTION process_staging_activity_taken (complaint_id character varying) RETURNS void LANGUAGE PLPGSQL AS $$
DECLARE
  WEBEOC_USER_ID CONSTANT varchar(6) := 'webeoc'; 
  WEBEOC_ACTION_TIMESTAMP CONSTANT timestamp := NOW()::timestamp;

  STAGING_STATUS_CODE_PENDING CONSTANT varchar(7) := 'PENDING';
  STAGING_STATUS_CODE_SUCCESS CONSTANT varchar(7) := 'SUCCESS' ;
  STAGING_STATUS_CODE_ERROR CONSTANT varchar(5) := 'ERROR';

  STAGING_ACTIVITY_CODE_ACTION_TAKEN CONSTANT varchar(9) := 'ACTIONCTE';

  -- select the stage object
  staged_data jsonb;

  _action_taken_id        UUID;
  _complaint_update_id    UUID;
  _logged_by              VARCHAR(250);
  _action_timestamp       TIMESTAMP;
  _details                TEXT;
  _is_update              BOOL;
 
BEGIN

  SELECT sc.complaint_jsonb
  INTO   staged_data
  FROM   staging_complaint sc
  WHERE  sc.complaint_identifier = complaint_id
  AND    sc.staging_status_code = STAGING_STATUS_CODE_PENDING 
  AND    sc.staging_activity_code = STAGING_ACTIVITY_CODE_ACTION_TAKEN; 
    
  IF staged_data IS NULL THEN
    RETURN;
  END IF;

  _action_taken_id := staged_data ->> 'actionTakenId';
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
    complaint_id, 
    _complaint_update_id, 
    _details, 
    _logged_by, 
    _action_timestamp, 
    WEBEOC_USER_ID, WEBEOC_ACTION_TIMESTAMP, WEBEOC_USER_ID, WEBEOC_ACTION_TIMESTAMP
  );

  -- update the staging table
  UPDATE staging_complaint
  SET    staging_status_code = STAGING_STATUS_CODE_SUCCESS
  WHERE  complaint_identifier = complaint_id
  AND    staging_status_code = STAGING_STATUS_CODE_PENDING 
  AND    staging_activity_code = STAGING_ACTIVITY_CODE_ACTION_TAKEN;

  EXCEPTION
  WHEN OTHERS THEN
    RAISE notice 'An unexpected error occurred: %', SQLERRM;
    UPDATE staging_complaint
    SET    staging_status_code = STAGING_STATUS_CODE_ERROR
    WHERE  complaint_identifier = complaint_id
    AND    staging_status_code = STAGING_STATUS_CODE_PENDING 
    AND    staging_activity_code = STAGING_ACTIVITY_CODE_ACTION_TAKEN;
  

RAISE notice 'complaint_id: %', complaint_id;
RAISE notice '_action_taken_id: %', _action_taken_id;
RAISE notice '_complaint_update_id: %', _complaint_update_id;
RAISE notice '_details: %', _details;
RAISE notice '_logged_by: %', _logged_by;
RAISE notice '_action_timestamp: %', _action_timestamp;

END;
$$;