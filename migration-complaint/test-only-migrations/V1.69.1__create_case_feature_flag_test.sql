UPDATE complaint.feature_agency_xref
SET active_ind = 'true'
WHERE feature_code = 'CREATECASE' 
AND agency_code_ref = 'COS';