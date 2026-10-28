---------------------
-- Resets the feature codes for dev and test for every migration and updates emails to ceds
--
-- The last line of the comment is where the magic happens, it will refresh the date -
-- even if no changes are made.
--
-- Last Run on: ${flyway:timestamp}
----------------------


---------------------
-- Overwrite all referred email addresses in dev and test to avoid accidents
---------------------
UPDATE email_reference
SET email_address = 'ceds@gov.bc.ca'
WHERE true;

---------------------
-- Enable referrals in dev/test for agencies with complaints enabled
---------------------

UPDATE feature_agency_xref
SET active_ind = 'Y'
WHERE feature_code = 'COMPREF'
AND agency_code_ref IN (
    SELECT agency_code_ref FROM feature_agency_xref WHERE feature_code = 'COMPLAINTS' AND active_ind = 'Y'
);

---------------------
-- Enable collaboration in dev/test for agencies with complaints enabled
---------------------

UPDATE feature_agency_xref
SET active_ind = 'Y'
WHERE feature_code = 'COMPCOLLAB'
AND agency_code_ref IN (
    SELECT agency_code_ref FROM feature_agency_xref WHERE feature_code = 'COMPLAINTS' AND active_ind = 'Y'
);

---------------------
-- Enable investigations in dev/test for agencies with complaints enabled
---------------------

UPDATE feature_agency_xref
SET active_ind = 'Y'
WHERE feature_code = 'INVESTIGTN'
AND agency_code_ref IN (
    SELECT agency_code_ref FROM feature_agency_xref WHERE feature_code = 'COMPLAINTS' AND active_ind = 'Y'
);

---------------------
-- Enable inspections in dev/test for agencies with complaints enabled
---------------------

UPDATE feature_agency_xref
SET active_ind = 'Y'
WHERE feature_code = 'INSPECTION'
AND agency_code_ref IN (
    SELECT agency_code_ref FROM feature_agency_xref WHERE feature_code = 'COMPLAINTS' AND active_ind = 'Y'
);

---------------------
-- Disable referral emails in dev and test for all users
---------------------

UPDATE feature_agency_xref
SET active_ind = 'N'
WHERE feature_code = 'REFEMAIL';

---------------------
-- Disable collaborator emails in dev/test for all users
---------------------

UPDATE feature_agency_xref
SET active_ind = 'N'
WHERE feature_code = 'COLEMAIL';

---------------------
-- Enable sector view and parties in dev/test for agencies with complaints enabled
---------------------

UPDATE feature_agency_xref
SET active_ind = 'Y'
WHERE feature_code = 'SECTORVIEW'
AND agency_code_ref IN (
    SELECT agency_code_ref FROM feature_agency_xref WHERE feature_code = 'COMPLAINTS' AND active_ind = 'Y'
);

UPDATE feature_agency_xref
SET active_ind = 'Y'
WHERE feature_code = 'PARTY'
AND agency_code_ref IN (
    SELECT agency_code_ref FROM feature_agency_xref WHERE feature_code = 'COMPLAINTS' AND active_ind = 'Y'
);

---------------------
-- Enable cases in dev/test for agencies with complaints enabled
---------------------

UPDATE feature_agency_xref
SET active_ind = 'Y'
WHERE feature_code = 'CASES'
AND agency_code_ref IN (
    SELECT agency_code_ref FROM feature_agency_xref WHERE feature_code = 'COMPLAINTS' AND active_ind = 'Y'
);

---------------------
-- Enable assessment comments in dev/test for agencies with complaints enabled
---------------------

UPDATE feature_agency_xref
SET active_ind = 'Y'
WHERE feature_code = 'ASMTCOMNTS'
AND agency_code_ref IN (
    SELECT agency_code_ref FROM feature_agency_xref WHERE feature_code = 'COMPLAINTS' AND active_ind = 'Y'
);

---------------------
-- Disable Case Creation for all agencies
---------------------

UPDATE feature_agency_xref
SET active_ind = 'N'
WHERE feature_code = 'CREATECASE';

