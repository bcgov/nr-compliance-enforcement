UPDATE complaint.feature_code
SET feature_flag = 'true'
WHERE feature_code = 'CREATECASE' 
AND agency_code_ref = 'COS';