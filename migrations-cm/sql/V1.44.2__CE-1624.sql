ALTER TABLE case_management.case_note ADD COLUMN agency_code varchar(10) NULL;

COMMENT ON COLUMN case_note.agency_code IS 'The agency that recorded these actions.';

UPDATE case_management.case_note AS n
SET agency_code = f.owned_by_agency_code 
FROM case_management.case_file AS f
WHERE n.case_file_guid = f.case_file_guid;

ALTER TABLE case_management.case_note 
ADD CONSTRAINT "FK_case_note__agency_code" FOREIGN KEY (agency_code) REFERENCES case_management.agency_code(agency_code);

ALTER TABLE case_management.case_note ALTER COLUMN agency_code SET NOT NULL;