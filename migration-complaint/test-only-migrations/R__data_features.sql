---------------------
-- Overwrite all referred email addresses in dev and test to avoid accidents
---------------------
UPDATE email_reference
SET email_address = 'ceds@gov.bc.ca'
WHERE true;

---------------------
-- Enable referrals in dev/test for all users
---------------------

UPDATE feature_agency_xref
SET active_ind = 'Y'
WHERE feature_code = 'COMPREF';

---------------------
-- Enable collaboration in dev/test for all users
---------------------

UPDATE feature_agency_xref
SET active_ind = 'Y'
WHERE feature_code = 'COMPCOLLAB';

---------------------
-- Enable investigations in dev/test for all users
---------------------

UPDATE feature_agency_xref
SET active_ind = 'Y'
WHERE feature_code = 'INVESTIGTN';

---------------------
-- Enable inspections in dev/test for all users
---------------------

UPDATE feature_agency_xref
SET active_ind = 'Y'
WHERE feature_code = 'INSPECTION';

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
-- Disable sector view in dev/test for all users
---------------------

UPDATE feature_agency_xref
SET active_ind = 'N'
WHERE feature_code = 'SECTORVIEW';