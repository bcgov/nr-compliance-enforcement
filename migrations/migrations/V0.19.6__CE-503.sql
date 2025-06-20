ALTER TABLE complaint_status_code ADD manually_assignable_ind boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN complaint_status_code.manually_assignable_ind IS 'Indicates if the stastus code can be manually assigned by a user.';