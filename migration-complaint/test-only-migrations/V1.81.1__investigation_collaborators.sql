UPDATE complaint.feature_agency_xref
SET active_ind = 'true'
WHERE feature_code = 'INVCOLLAB'
-- Some agencies are party-only or considered "external" where no user access is expected, so do not grant these agencies access to these features
AND agency_code_ref IN (
    SELECT agency_code_ref FROM complaint.feature_agency_xref WHERE feature_code = 'COMPLAINTS' AND active_ind = 'true'
);
