--
-- update complaint owner to EPO agency where allegation violation_code is WASTE or PESTICDE
--

UPDATE complaint SET owned_by_agency_code_ref = 'EPO'
FROM allegation_complaint
WHERE complaint.complaint_identifier = allegation_complaint.complaint_identifier 
   AND allegation_complaint.violation_code = 'WASTE'
   AND complaint.owened_by_agency_code_ref IS NULL;

UPDATE complaint SET owned_by_agency_code_ref = 'EPO'
FROM allegation_complaint 
WHERE complaint.complaint_identifier = allegation_complaint.complaint_identifier 
   AND allegation_complaint.violation_code = 'PESTICDE'
   AND complaint.owened_by_agency_code_ref IS NULL;

UPDATE complaint SET owned_by_agency_code_ref = 'COS'
FROM allegation_complaint 
WHERE complaint.owned_by_agency_code_ref IS NULL
