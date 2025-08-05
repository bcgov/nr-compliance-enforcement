CREATE OR REPLACE FUNCTION complaint.update_audit_columns()
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
  
CREATE TRIGGER geoorgutnd_set_default_audit_values
BEFORE update on complaint.geo_organization_unit_code
FOR EACH ROW
EXECUTE FUNCTION complaint.update_audit_columns();

CREATE TRIGGER gorgtypecd_set_default_audit_values
BEFORE update on complaint.geo_org_unit_type_code
FOR EACH ROW
EXECUTE FUNCTION complaint.update_audit_columns();

CREATE TRIGGER atractntcd_set_default_audit_values
BEFORE update on complaint.attractant_code
FOR EACH ROW
EXECUTE FUNCTION complaint.update_audit_columns();

CREATE TRIGGER compmthdr_set_default_audit_values
BEFORE update on complaint.comp_mthd_recv_cd_agcy_cd_xref
FOR EACH ROW
EXECUTE FUNCTION complaint.update_audit_columns();

CREATE TRIGGER compmthdrc_set_default_audit_values
BEFORE update on complaint.complaint_method_received_code
FOR EACH ROW
EXECUTE FUNCTION complaint.update_audit_columns();

CREATE TRIGGER cmpntstscd_set_default_audit_values
BEFORE update on complaint.complaint_status_code
FOR EACH ROW
EXECUTE FUNCTION complaint.update_audit_columns();

CREATE TRIGGER complainttypecode_set_default_audit_values
BEFORE update on complaint.complaint_type_code
FOR EACH ROW
EXECUTE FUNCTION complaint.update_audit_columns();

CREATE TRIGGER emailref_set_default_audit_values
BEFORE update on complaint.email_reference
FOR EACH ROW
EXECUTE FUNCTION complaint.update_audit_columns();

CREATE TRIGGER girtypecd_set_default_audit_values
BEFORE update on complaint.gir_type_code
FOR EACH ROW
EXECUTE FUNCTION complaint.update_audit_columns();

CREATE TRIGGER cmpltntrcd_set_default_audit_values
BEFORE update on complaint.hwcr_complaint_nature_code
FOR EACH ROW
EXECUTE FUNCTION complaint.update_audit_columns();

CREATE TRIGGER reportedbycode_set_default_audit_values
BEFORE update on complaint.reported_by_code
FOR EACH ROW
EXECUTE FUNCTION complaint.update_audit_columns();

CREATE TRIGGER speciescd_set_default_audit_values
BEFORE update on complaint.species_code
FOR EACH ROW
EXECUTE FUNCTION complaint.update_audit_columns();

CREATE TRIGGER team_set_default_audit_values
BEFORE update on complaint.team
FOR EACH ROW
EXECUTE FUNCTION complaint.update_audit_columns();

CREATE TRIGGER teamcode_set_default_audit_values
BEFORE update on complaint.team_code
FOR EACH ROW
EXECUTE FUNCTION complaint.update_audit_columns();

CREATE TRIGGER violatncd_set_default_audit_values
BEFORE update on complaint.violation_code
FOR EACH ROW
EXECUTE FUNCTION complaint.update_audit_columns();

CREATE TRIGGER violationacyxref_set_default_audit_values
BEFORE update on complaint.violation_agency_xref
FOR EACH ROW
EXECUTE FUNCTION complaint.update_audit_columns();