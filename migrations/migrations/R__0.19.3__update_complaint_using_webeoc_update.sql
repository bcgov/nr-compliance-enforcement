CREATE OR REPLACE FUNCTION public.update_complaint_using_webeoc_update(_complaint_identifier character varying, update_complaint_data jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
	current_complaint_record PUBLIC.complaint;
    -- Variables from webeoc that may be used to update a record in the COMPLAINT table
    -- used to determine if a webeoc update is actually an update.  WebEOC's API will unfortunately default to
    -- the original value of a field if another field is updated.  So, we ignore these as part of updates.  This
    -- means that WebEOC will not be able to update a value to the original value, but that's something the project
    -- team has decided to risk.
    original_complaint_record JSONB;
    _update_webeoc_species VARCHAR(200); -- species code from WebEOC
    _update_species_code VARCHAR(10); -- our species code, based on the code from WebEOC
    _parent_report_type VARCHAR(10); -- used to differentiate between HWCR and ERS complaints.  ignore anything else
    _update_violation_code            VARCHAR(10);
    _create_userid VARCHAR(200);
    _update_userid VARCHAR(200);
    _create_utc_timestamp TIMESTAMP := (NOW() AT TIME ZONE 'UTC');
    _update_utc_timestamp TIMESTAMP := (NOW() AT TIME ZONE 'UTC');
    
    -- Original complaint values, used to compare against incoming changes
    _original_species_code VARCHAR(10);
    _original_violation_type_code VARCHAR(10);
   
   _current_species_code VARCHAR(10);
   _current_violation_type_code VARCHAR(10);
   
    USERNAME_TXT CONSTANT varchar(8) = 'username';
   
BEGIN
    -- These fields are retrieved to potentially update an existing complaint record
    _update_webeoc_species := update_complaint_data ->> 'update_species';
    _parent_report_type := update_complaint_data ->> 'parent_report_type';
    _create_userid := substring(update_complaint_data ->> USERNAME_TXT from 1 for 32);
    _update_userid := substring(update_complaint_data ->> USERNAME_TXT from 1 for 32);
   
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
  
  if (_parent_report_type = 'HWCR') then
    -- get the code based on the update from WebEOC
    SELECT *
    INTO   _update_species_code
    FROM   PUBLIC.insert_and_return_code(_update_webeoc_species, 'speciescd');
   
    -- get the current species code
   	SELECT hc.species_code 
   	INTO _current_species_code
	FROM hwcr_complaint hc 
	WHERE hc.complaint_identifier = _complaint_identifier;

    select hch.data_after_executed_operation ->> 'species_code'
    into _original_species_code
    from complaint c inner join hwcr_complaint hc on c.complaint_identifier = hc.complaint_identifier
    inner join hwcr_complaint_h hch on hc.hwcr_complaint_guid = hch.target_row_id
    where c.complaint_identifier = _complaint_identifier
    and hch.operation_type = 'I';

    if ((_update_species_code <> _original_species_code) and (_update_species_code <> _current_species_code)) then 
    	update hwcr_complaint
    	set species_code = _update_species_code
    	where complaint_identifier = _complaint_identifier;
    end if;

  end if;
 
  if (_parent_report_type = 'ERS') then
	 SELECT *
	 FROM   PUBLIC.insert_and_return_code( update_complaint_data->>'update_violation_type', 'violatncd' )
	 INTO   _update_violation_code;
	 
     select ac.violation_code
     into _current_violation_type_code
     from allegation_complaint ac
     where ac.complaint_identifier = _complaint_identifier;

     select ach.data_after_executed_operation ->> 'violation_code'
     into _original_violation_type_code
     from complaint c inner join allegation_complaint ac on c.complaint_identifier = ac.complaint_identifier 
     inner join allegation_complaint_h ach on ac.allegation_complaint_guid = ach.target_row_id
     where c.complaint_identifier  = _complaint_identifier
     and ach.operation_type = 'I';
    
     if ((_update_violation_code <> _original_violation_type_code) and (_update_violation_code <> _current_violation_type_code)) then 
	    if _update_violation_code = 'WASTE' OR _update_violation_code = 'PESTICDE' then
        UPDATE PUBLIC.complaint
        SET    owned_by_agency_code = 'EPO'
        WHERE  complaint_identifier = _complaint_identifier;
      else
        UPDATE PUBLIC.complaint
        SET    owned_by_agency_code = 'COS'
        WHERE  complaint_identifier = _complaint_identifier;
      end if;

    	update allegation_complaint
    	set violation_code  = _update_violation_code
    	where complaint_identifier = _complaint_identifier;
     end if;		    
  end if;

  -- We always want to update the complaint last updated field to indicate an update was received.
  update complaint
	set comp_last_upd_utc_timestamp = _update_utc_timestamp
	where complaint_identifier = _complaint_identifier;
END;
$function$
;
