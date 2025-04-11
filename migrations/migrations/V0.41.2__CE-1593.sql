UPDATE feature_agency_xref
SET
  active_ind = false
WHERE
  feature_code = 'ENBL_OFF'
  AND agency_code = 'PARKS';