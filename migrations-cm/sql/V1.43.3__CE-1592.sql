CREATE TABLE case_management.prevention_education (
	prevention_education_guid uuid DEFAULT case_management.uuid_generate_v4() NOT NULL,
	case_file_guid uuid NOT NULL,
	agency_code varchar(10) NOT NULL,
	active_ind bool DEFAULT true NOT NULL,
	create_user_id varchar(32) NOT NULL,
	create_utc_timestamp timestamp NOT NULL,
	update_user_id varchar(32) NULL,
	update_utc_timestamp timestamp NULL,
	CONSTRAINT "PK_prevention_education_guid" PRIMARY KEY (prevention_education_guid)
);

ALTER TABLE case_management.prevention_education ADD CONSTRAINT "FK_prevention_education__case_file_guid" FOREIGN KEY (case_file_guid) REFERENCES case_management.case_file(case_file_guid);
ALTER TABLE case_management.prevention_education ADD CONSTRAINT "FK_prevention_education__agency_code" FOREIGN KEY (agency_code) REFERENCES case_management.agency_code(agency_code);

COMMENT ON COLUMN case_management.prevention_education.prevention_education_guid IS 'System generated unique key prevention education record.';
COMMENT ON COLUMN case_management.prevention_education.case_file_guid IS 'Foreign key to the case that these actions are for.';
COMMENT ON COLUMN case_management.prevention_education.agency_code IS 'The agency that recorded these actions.';
COMMENT ON COLUMN case_management.prevention_education.active_ind IS 'Indicates whether the note is active (true) or inactive (false).';
COMMENT ON COLUMN case_management.prevention_education.create_user_id IS 'The identifier (e.g., username) of the user who created the entry.';
COMMENT ON COLUMN case_management.prevention_education.create_utc_timestamp IS 'The date and time (UTC) when the entry was created.';
COMMENT ON COLUMN case_management.prevention_education.update_user_id IS 'The identifier (e.g., username) of the user who last updated the entry.';
COMMENT ON COLUMN case_management.prevention_education.update_utc_timestamp IS 'The date and time (UTC) when the entry was last updated.';

-- Create a single prevention_education record for each case file that has COSPRV&EDU or PRKPRV&EDU action types.
INSERT INTO case_management.prevention_education
(
	case_file_guid,
  agency_code,
  create_user_id,
  create_utc_timestamp,
  update_user_id,
  update_utc_timestamp
)
SELECT case_guid, 'COS' AS agency_code, create_user_id, create_utc_timestamp, update_user_id , update_utc_timestamp 
FROM case_management."action" a 
WHERE a.action_type_action_xref_guid IN (
  SELECT action_type_action_xref_guid FROM case_management.action_type_action_xref WHERE action_type_code IN ('COSPRV&EDU')
)
GROUP BY a.case_guid, a.create_user_id, a.create_utc_timestamp, a.update_user_id, a.update_utc_timestamp;

INSERT INTO case_management.prevention_education
(
	case_file_guid,
  agency_code,
  create_user_id,
  create_utc_timestamp,
  update_user_id,
  update_utc_timestamp
)
SELECT case_guid, 'PARKS' AS agency_code, create_user_id, create_utc_timestamp, update_user_id , update_utc_timestamp 
FROM case_management."action" a 
WHERE a.action_type_action_xref_guid IN (
  SELECT action_type_action_xref_guid FROM case_management.action_type_action_xref WHERE action_type_code IN ('PRKPRV&EDU')
)
GROUP BY a.case_guid, a.create_user_id, a.create_utc_timestamp, a.update_user_id, a.update_utc_timestamp;

ALTER TABLE case_management.action ADD COLUMN prevention_education_guid uuid REFERENCES case_management.prevention_education(prevention_education_guid);

-- Update the action table to set the prevention_education_guid for actions that have a corresponding prevention_education record.
UPDATE case_management."action" a1 SET prevention_education_guid = pe.prevention_education_guid
FROM case_management."action" a2 
JOIN case_management.case_file cf ON a2.case_guid = cf.case_file_guid 
JOIN case_management.prevention_education pe ON cf.case_file_guid = pe.case_file_guid 
WHERE a1.action_guid = a2.action_guid AND a1.case_guid = cf.case_file_guid AND a1.case_guid = pe.case_file_guid
AND a1.action_type_action_xref_guid IN (
  SELECT action_type_action_xref_guid FROM case_management.action_type_action_xref WHERE action_type_code IN ('COSPRV&EDU','PRKPRV&EDU')
);