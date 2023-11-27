--
-- update complaint owner to EPO agency where allegation violation_code is WASTE or PESTICDE
--
UPDATE complaint SET owned_by_agency_code = 'EPO'
FROM allegation_complaint
WHERE complaint.complaint_identifier = allegation_complaint.complaint_identifier AND allegation_complaint.violation_code = 'WASTE';

UPDATE complaint SET owned_by_agency_code = 'EPO'
FROM allegation_complaint 
WHERE complaint.complaint_identifier = allegation_complaint.complaint_identifier AND allegation_complaint.violation_code = 'PESTICDE';
