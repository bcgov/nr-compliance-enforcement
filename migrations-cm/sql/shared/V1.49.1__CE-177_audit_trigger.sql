CREATE OR REPLACE FUNCTION shared.update_audit_columns()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
calling_query TEXT;
update_user_id_found BOOL;
BEGIN
        IF NEW.update_utc_timestamp IS NOT DISTINCT FROM OLD.update_utc_timestamp THEN
            NEW.update_utc_timestamp := CURRENT_TIMESTAMP;
        END IF;
        SELECT current_query() INTO calling_query;
        SELECT POSITION('update_user_id' IN calling_query) > 0 INTO update_user_id_found;
        IF update_user_id_found = 'f' THEN
            NEW.update_user_id := CURRENT_USER;
        END IF;
        RETURN NEW;
    END; 
$function$
;

CREATE TRIGGER parkarea_set_default_audit_values
BEFORE update on shared.park_area
FOR EACH ROW
EXECUTE FUNCTION shared.update_audit_columns();  
