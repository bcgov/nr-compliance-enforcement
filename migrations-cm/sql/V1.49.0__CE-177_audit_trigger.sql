CREATE OR REPLACE FUNCTION case_management.update_audit_columns()
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

CREATE TRIGGER agecode_set_default_audit_values
BEFORE update on case_management.age_code
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER acttpactxref_set_default_audit_values
BEFORE update on case_management.action_type_action_xref
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER actcd_set_default_audit_values
BEFORE update on case_management.action_code
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER acttpcd_set_default_audit_values
BEFORE update on case_management.action_type_code
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER caselcncd_set_default_audit_values
BEFORE update on case_management.case_location_code
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER cnfthistcd_set_default_audit_values
BEFORE update on case_management.conflict_history_code
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER dischargecd_set_default_audit_values
BEFORE update on case_management.discharge_code
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER drgmethdcd_set_default_audit_values
BEFORE update on case_management.drug_method_code
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER drgrmotmcd_set_default_audit_values
BEFORE update on case_management.drug_remaining_outcome_code
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER drugcd_set_default_audit_values
BEFORE update on case_management.drug_code
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER earcode_set_default_audit_values
BEFORE update on case_management.ear_code
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER equipmntcd_set_default_audit_values
BEFORE update on case_management.equipment_code
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER equipmntstcd_set_default_audit_values
BEFORE update on case_management.equipment_status_code
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER hwcotcmactbycd_set_default_audit_values
BEFORE update on case_management.hwcr_outcome_actioned_by_code
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER agencycd_set_default_audit_values
BEFORE update on case_management.agency_code
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER ipmathctgrcd_set_default_audit_values
BEFORE update on case_management.ipm_auth_category_code
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER inactnrsncd_set_default_audit_values
BEFORE update on case_management.inaction_reason_code
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER noncompdnmtxcd_set_default_audit_values
BEFORE update on case_management.non_compliance_decision_matrix_code
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER schlcd_set_default_audit_values
BEFORE update on case_management.schedule_code
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER shlstrxref_set_default_audit_values
BEFORE update on case_management.schedule_sector_xref
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER strcd_set_default_audit_values
BEFORE update on case_management.sector_code
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER sexcd_set_default_audit_values
BEFORE update on case_management.sex_code
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER thrtlvlcd_set_default_audit_values
BEFORE update on case_management.threat_level_code
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();

CREATE TRIGGER wldlf_set_default_audit_values
BEFORE update on case_management.wildlife
FOR EACH ROW
EXECUTE FUNCTION case_management.update_audit_columns();
