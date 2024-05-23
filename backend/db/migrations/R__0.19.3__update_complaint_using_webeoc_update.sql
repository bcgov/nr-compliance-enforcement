-- Given a complaint identifer and an incoming webeoc complaint update record, update the related complaint if necessary
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
    _parent_report_type VARCHAR(10); -- used to differentiate between HWCR and ERS complaints.  ignore anything else
    _update_violation_code            VARCHAR(10);
    _create_userid VARCHAR(200);
    _update_userid VARCHAR(200);
    _create_utc_timestamp TIMESTAMP := (NOW() AT TIME ZONE 'UTC');
    _update_utc_timestamp TIMESTAMP := (NOW() AT TIME ZONE 'UTC');
    
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
    _original_violation_type_code VARCHAR(10);
   
   _current_species_code VARCHAR(10);
   _current_violation_type_code VARCHAR(10);
   
    -- used to indicate if the update causes an edit to the complaint record
    update_edit_ind boolean = false;
   
    USERNAME_TXT CONSTANT varchar(8) = 'username';
   
BEGIN
    -- These fields are retrieved to potentially update an existing complaint record
    _update_caller_name := update_complaint_data ->> 'update_caller_name';
    _update_caller_phone_1 := update_complaint_data ->> 'update_primary_phone';
    _update_caller_phone_2 := update_complaint_data ->> 'update_alt_phone';
    _update_caller_phone_3 := update_complaint_data ->> 'update_alt_phone_2';
    _update_caller_email := update_complaint_data ->> 'update_caller_email';
    _update_caller_address := update_complaint_data ->> 'update_caller_address';
    _update_webeoc_reported_by_code := update_complaint_data ->> 'update_reffered_by_lst';
    _update_reported_by_other_text := update_complaint_data ->> 'update_reffered_by_txt';
    _update_webeoc_species := update_complaint_data ->> 'update_species';
    _parent_report_type := update_complaint_data ->> 'parent_report_type';
    _create_userid := substring(update_complaint_data ->> USERNAME_TXT from 1 for 32);
    _update_userid := substring(update_complaint_data ->> USERNAME_TXT from 1 for 32);


    -- Get the codes from our application (inserting if necessary) for the codes retrieved from WebEOC
    SELECT *
    INTO   _update_reported_by_code
    FROM   PUBLIC.insert_and_return_code(_update_webeoc_reported_by_code, 'reprtdbycd');

   
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
    _original_reported_by_code := original_complaint_record ->> 'referred_by_agency_code';
    _original_reported_by_other_text := original_complaint_record ->> 'referred_by_agency_other_text';
   
   -- update the complaint data, if the incoming webeoc contains applicable updates
   
   if ((_update_caller_name <> _original_caller_name) and (_update_caller_name <> current_complaint_record.caller_name)) then
	update complaint
	set caller_name = _update_caller_name
	where complaint_identifier = _complaint_identifier;

	update_edit_ind = true;
   end if;
  
  if ((_update_caller_phone_1 <> _original_caller_phone_1) and (_update_caller_phone_1 <> current_complaint_record.caller_phone_1)) then
    _update_caller_phone_1 := format_phone_number(_update_caller_phone_1);

  
	update complaint
	set caller_phone_1 = _update_caller_phone_1
	where complaint_identifier = _complaint_identifier;

	update_edit_ind = true;
   end if;
  
  if ((_update_caller_phone_2 <> _original_caller_phone_2) and (_update_caller_phone_2 <> current_complaint_record.caller_phone_2)) then
  
    _update_caller_phone_2 := format_phone_number(_update_caller_phone_2);

	update complaint
	set caller_phone_2 = _update_caller_phone_2
	where complaint_identifier = _complaint_identifier;

	update_edit_ind = true;
   end if;
  
  if ((_update_caller_phone_3 <> _original_caller_phone_3) and (_update_caller_phone_3 <> current_complaint_record.caller_phone_3)) then
  
    _update_caller_phone_3 := format_phone_number(_update_caller_phone_3);

	update complaint
	set caller_phone_3 = _update_caller_phone_3
	where complaint_identifier = _complaint_identifier;
	update_edit_ind = true;
   end if;
  
  if ((_update_caller_email <> _original_caller_email) and (_update_caller_email <> current_complaint_record.caller_email)) then
	update complaint
	set caller_email = _update_caller_email
	where complaint_identifier = _complaint_identifier;
	update_edit_ind = true;
   end if;
  
  if ((_update_caller_address <> _original_caller_address) and (_update_caller_address <> current_complaint_record.caller_address)) then
	update complaint
	set caller_address = _update_caller_address
	where complaint_identifier = _complaint_identifier;
	update_edit_ind = true;
   end if;
  
  if ((_update_reported_by_code <> _original_reported_by_code) and (_update_reported_by_code <> current_complaint_record.reported_by_code)) then
	update complaint
	set reported_by_code = _update_reported_by_code
	where complaint_identifier = _complaint_identifier;
	update_edit_ind = true;
   end if;
  
  if ((_update_reported_by_other_text <> _original_reported_by_other_text) and (_update_reported_by_other_text <> current_complaint_record.reported_by_other_text)) then
	update complaint
	set reported_by_other_text = _update_reported_by_other_text
	where complaint_identifier = _complaint_identifier;
	update_edit_ind = true;
   end if;
  
  -- the update caused an edit, set the audit fields
  if (update_edit_ind) then
	update complaint
	set update_user_id = _update_userid, update_utc_timestamp = _update_utc_timestamp
	where complaint_identifier = _complaint_identifier;
  
  end if;
  
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
    	update allegation_complaint
    	set violation_code  = _update_violation_code
    	where complaint_identifier = _complaint_identifier;
     end if;		    
  end if;
END;
$function$
;
