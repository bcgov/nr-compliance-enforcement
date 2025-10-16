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
SET active_ind = 'Y'
WHERE feature_code = 'SECTORVIEW';

UPDATE feature_agency_xref
SET active_ind = 'Y'
WHERE feature_code = 'PARTY';

---------------------
-- Enable cases in dev/test for all users
---------------------

UPDATE feature_agency_xref
SET active_ind = 'Y'
WHERE feature_code = 'CASES';
