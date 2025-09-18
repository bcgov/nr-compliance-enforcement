CREATE TABLE
    case_management.assessment (
        assessment_guid uuid DEFAULT uuid_generate_v4 () NOT NULL,
        case_file_guid uuid not null references case_management.case_file (case_file_guid),
        assessed_by_agency_code varchar(10) NOT NULL,
        inaction_reason_code varchar(10) NULL,
        action_not_required_ind bool NULL,
        complainant_contacted_ind bool NULL,
        attended_ind bool NULL,
        case_location_code varchar(10) NULL,
        case_conflict_history_code varchar(10) NULL,
        case_threat_level_code varchar(10) NULL,
        create_user_id varchar(32) NOT NULL,
        create_utc_timestamp timestamp NOT NULL,
        update_user_id varchar(32) NULL,
        update_utc_timestamp timestamp NULL,
        CONSTRAINT "PK_assessment_guid" PRIMARY KEY (assessment_guid)
    );

ALTER TABLE case_management.assessment ADD CONSTRAINT "FK_assessment__inaction_reason_code" FOREIGN KEY (inaction_reason_code) REFERENCES case_management.inaction_reason_code (inaction_reason_code);

ALTER TABLE case_management.assessment ADD CONSTRAINT "FK_assessment__assessed_by_agency_code" FOREIGN KEY (assessed_by_agency_code) REFERENCES case_management.agency_code (agency_code);

ALTER TABLE case_management.assessment ADD CONSTRAINT fk_assessment__case_conflict_history_code FOREIGN KEY (case_conflict_history_code) REFERENCES case_management.conflict_history_code (conflict_history_code);

ALTER TABLE case_management.assessment ADD CONSTRAINT fk_assessment__case_location_code FOREIGN KEY (case_location_code) REFERENCES case_management.case_location_code (case_location_code);

ALTER TABLE case_management.assessment ADD CONSTRAINT fk_assessment__case_threat_level_code FOREIGN KEY (case_threat_level_code) REFERENCES case_management.threat_level_code (threat_level_code);

CREATE TABLE
    case_management.assessment_h (
        h_assessment_guid uuid NOT NULL DEFAULT uuid_generate_v4 (),
        target_row_id uuid NOT NULL,
        operation_type char(1) NOT NULL,
        operation_user_id varchar(32) NOT NULL DEFAULT current_user,
        operation_executed_at timestamp NOT NULL DEFAULT now (),
        data_after_executed_operation jsonb,
        CONSTRAINT "PK_h_assessment" PRIMARY KEY (h_assessment_guid)
    );

create trigger assessment_history_trigger before insert
or delete
or
update on case_management.assessment for each row execute function case_management.audit_history ('assessment_h', 'assessment_guid');

INSERT INTO
    case_management.assessment (
        case_file_guid,
        assessed_by_agency_code, -- Source: owned_by_agency_code
        inaction_reason_code,
        action_not_required_ind,
        complainant_contacted_ind,
        attended_ind,
        case_location_code,
        case_conflict_history_code,
        case_threat_level_code,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp
    )
SELECT
    case_file_guid,
    owned_by_agency_code, -- Renamed to assessed_by_agency_code
    inaction_reason_code,
    action_not_required_ind,
    complainant_contacted_ind,
    attended_ind,
    case_location_code,
    case_conflict_history_code,
    case_threat_level_code,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
FROM
    case_management.case_file;

ALTER TABLE case_management.action
ADD COLUMN assessment_guid uuid REFERENCES case_management.assessment (assessment_guid);

UPDATE case_management.action a
SET
    assessment_guid = ca.assessment_guid
FROM
    case_management.case_file cf
    JOIN case_management.assessment ca ON cf.case_file_guid = ca.case_file_guid
WHERE
    ca.case_file_guid = cf.case_file_guid
    AND a.assessment_guid IS NULL
    AND a.action_type_action_xref_guid IN (
        SELECT
            action_type_action_xref_guid
        FROM
            case_management.action_type_action_xref
        WHERE
            action_type_code IN ('COMPASSESS', 'CAT1ASSESS')
    );

ALTER TABLE case_management.case_file
DROP COLUMN inaction_reason_code;

ALTER TABLE case_management.case_file
DROP COLUMN action_not_required_ind;

ALTER TABLE case_management.case_file
DROP COLUMN complainant_contacted_ind;

ALTER TABLE case_management.case_file
DROP COLUMN attended_ind;

ALTER TABLE case_management.case_file
DROP COLUMN case_location_code;

ALTER TABLE case_management.case_file
DROP COLUMN case_conflict_history_code;

ALTER TABLE case_management.case_file
DROP COLUMN case_threat_level_code;