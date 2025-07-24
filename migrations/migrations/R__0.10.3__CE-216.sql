--
-- update complaint owner to EPO agency where allegation violation_code is WASTE or PESTICDE
--

--
-- ATTENTION IF THIS FILE IS EVER TOUCHED ON A RELEASE FOR ANY REASON!!!!!!!!!!!!
--
-- If this file is touched causing the checksum to change flyway will execute it in the 
-- various environment, INCLUDING PRODUCTION.  This may not be desired, especially the first two 
-- statements.   Think twice before touching this file.  In retrospect this should have been a versioned script.
--

UPDATE complaint SET owned_by_agency_code_ref = 'EPO'
FROM allegation_complaint
WHERE complaint.complaint_identifier = allegation_complaint.complaint_identifier AND allegation_complaint.violation_code = 'WASTE';

UPDATE complaint SET owned_by_agency_code_ref = 'EPO'
FROM allegation_complaint 
WHERE complaint.complaint_identifier = allegation_complaint.complaint_identifier AND allegation_complaint.violation_code = 'PESTICDE';

UPDATE complaint SET owned_by_agency_code_ref = 'COS'
FROM allegation_complaint 
WHERE complaint.owned_by_agency_code_ref IS NULL
