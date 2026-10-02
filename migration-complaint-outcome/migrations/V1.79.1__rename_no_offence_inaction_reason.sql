UPDATE complaint_outcome.inaction_reason_code
SET
  short_description = 'No offence',
  long_description = 'No offence',
  update_user_id = 'FLWYAY',
  update_utc_timestamp = NOW ()
WHERE
  inaction_reason_code IN ('NOOFFID', 'PKNOOFFID');
