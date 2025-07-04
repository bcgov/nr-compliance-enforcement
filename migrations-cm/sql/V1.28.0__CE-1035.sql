ALTER TABLE case_management.decision
RENAME COLUMN lead_agency TO lead_agency_code;

ALTER TABLE case_management.decision ADD CONSTRAINT FK_decision__lead_agency_code FOREIGN KEY (lead_agency_code) REFERENCES case_management.agency_code (agency_code);

ALTER TABLE case_management.agency_code ADD display_order int4;

--comment
COMMENT ON COLUMN case_management.agency_code.display_order is 'The order in which the values of the agency should be displayed when presented to a user in a list.';