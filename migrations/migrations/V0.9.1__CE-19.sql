alter table complaint
rename incident_reported_datetime to incident_reported_utc_timestmp;

-- rename audit timestamp columns
alter table geo_org_unit_type_code
rename create_timestamp to create_utc_timestamp;

alter table geo_org_unit_type_code rename update_timestamp to update_utc_timestamp;

alter table geo_organization_unit_code
rename create_timestamp to create_utc_timestamp;

alter table geo_organization_unit_code rename update_timestamp to update_utc_timestamp;

alter table office
rename create_timestamp to create_utc_timestamp;

alter table office rename update_timestamp to update_utc_timestamp;

alter table person
rename create_timestamp to create_utc_timestamp;

alter table person rename update_timestamp to update_utc_timestamp;

alter table officer
rename create_timestamp to create_utc_timestamp;

alter table officer rename update_timestamp to update_utc_timestamp;

alter table complaint
rename create_timestamp to create_utc_timestamp;

alter table complaint rename update_timestamp to update_utc_timestamp;

alter table agency_code
rename create_timestamp to create_utc_timestamp;

alter table agency_code rename update_timestamp to update_utc_timestamp;

alter table complaint_status_code
rename create_timestamp to create_utc_timestamp;

alter table complaint_status_code rename update_timestamp to update_utc_timestamp;

alter table geo_org_unit_structure
rename create_timestamp to create_utc_timestamp;

alter table geo_org_unit_structure rename update_timestamp to update_utc_timestamp;

alter table allegation_complaint
rename create_timestamp to create_utc_timestamp;

alter table allegation_complaint rename update_timestamp to update_utc_timestamp;

alter table violation_code
rename create_timestamp to create_utc_timestamp;

alter table violation_code rename update_timestamp to update_utc_timestamp;

alter table hwcr_complaint
rename create_timestamp to create_utc_timestamp;

alter table hwcr_complaint rename update_timestamp to update_utc_timestamp;

alter table species_code
rename create_timestamp to create_utc_timestamp;

alter table species_code rename update_timestamp to update_utc_timestamp;

alter table hwcr_complaint_nature_code
rename create_timestamp to create_utc_timestamp;

alter table hwcr_complaint_nature_code rename update_timestamp to update_utc_timestamp;

alter table attractant_code
rename create_timestamp to create_utc_timestamp;

alter table attractant_code rename update_timestamp to update_utc_timestamp;

alter table person_complaint_xref
rename create_timestamp to create_utc_timestamp;

alter table person_complaint_xref rename update_timestamp to update_utc_timestamp;

alter table person_complaint_xref_code
rename create_timestamp to create_utc_timestamp;

alter table person_complaint_xref_code rename update_timestamp to update_utc_timestamp;

alter table attractant_hwcr_xref
rename create_timestamp to create_utc_timestamp;

alter table attractant_hwcr_xref rename update_timestamp to update_utc_timestamp;

alter table configuration
rename create_timestamp to create_utc_timestamp;

alter table configuration rename update_timestamp to update_utc_timestamp;

CREATE OR REPLACE FUNCTION audit_history() RETURNS trigger AS $BODY$
  DECLARE

	target_history_table TEXT;
	target_pk TEXT;

  BEGIN
    target_history_table := TG_ARGV[0];
    target_pk := TG_ARGV[1];

    IF TG_OP ='INSERT' THEN 
        
      -- Don't trust the caller not to manipulate any of these fields
      NEW.create_utc_timestamp := current_timestamp; -- create timestamp must be the current time
      NEW.update_utc_timestamp := current_timestamp; -- update timestamp must be the current time
      NEW.update_user_id := NEW.create_user_id;  -- the update user must be the same as the create user

      EXECUTE
        format( 
            'INSERT INTO %I (target_row_id, operation_type, operation_user_id, data_after_executed_operation) VALUES ($1.%I,  ''I'', $1.create_user_id, to_jsonb($1))',  target_history_table, target_pk
        )
        USING NEW;
      RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN 

      -- Don't trust the caller not to manipulate any of these fields
      NEW.update_utc_timestamp := current_timestamp;  -- update timestamp must be the current time
      NEW.create_user_id := OLD.create_user_id; -- create userId can't be altered
      NEW.create_utc_timestamp := OLD.create_utc_timestamp; -- update timestamp can't be altered

      EXECUTE
        format(
            'INSERT INTO %I (target_row_id, operation_type, operation_user_id, data_after_executed_operation) VALUES ($1.%I, ''U'', $1.update_user_id, to_jsonb($1))', target_history_table, target_pk
          )
        USING NEW;
      RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN

      EXECUTE
        format(
                'INSERT INTO %I (target_row_id, operation_type) VALUES ($1.%I, ''D'')', target_history_table, target_pk
        )
        USING OLD;
      RETURN OLD;

    END IF;
  END;
$BODY$
LANGUAGE plpgsql;