UPDATE complaint_outcome.inaction_reason_code
SET
  active_ind = false,
  update_user_id = 'FLWYAY',
  update_utc_timestamp = NOW ()
WHERE
  inaction_reason_code IN ('DUPLPREV', 'PKDUPLPRV');
