ALTER TABLE complaint ADD COLUMN complaint_type_code VARCHAR(10) REFERENCES complaint_type_code(complaint_type_code);

comment on column complaint.complaint_type_code is 'The type of the complaint, such as HWCR, GIR, or ERS.';

UPDATE complaint c1 SET complaint_type_code = 
CASE WHEN a.allegation_complaint_guid IS NOT NULL THEN 'ERS'
	 WHEN hc.hwcr_complaint_guid IS NOT NULL THEN 'HWCR'
	 WHEN gc.gir_complaint_guid IS NOT NULL THEN 'GIR'
END
FROM complaint c2
LEFT JOIN allegation_complaint a ON c2.complaint_identifier = a.complaint_identifier
LEFT JOIN hwcr_complaint hc ON c2.complaint_identifier = hc.complaint_identifier
LEFT JOIN gir_complaint gc ON c2.complaint_identifier = gc.complaint_identifier
WHERE c1.complaint_identifier = c2.complaint_identifier;