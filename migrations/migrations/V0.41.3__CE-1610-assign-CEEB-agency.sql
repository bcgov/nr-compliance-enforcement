-- Update records with no assigned office to have EPO agency code
-- 0.41.2 assigns all officers to the agency associated with their office,
-- however CEEB users do not have an assigned office.
update officer
set agency_code = 'EPO'
where office_guid is null;
