UPDATE complaint.complaint
SET complaint_status_code = 'OPEN'
WHERE complaint_status_code IS NULL;

ALTER TABLE complaint.complaint
    ALTER COLUMN complaint_status_code SET NOT NULL;
