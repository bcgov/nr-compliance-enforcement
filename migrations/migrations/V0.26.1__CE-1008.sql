--
-- alter the allegation_complaint table to widen the suspect_witnesss_dtl_text
-- column from VARCHAR(4000) char to TEXT to prevent truncating data and data loss
--
ALTER TABLE allegation_complaint
ALTER COLUMN suspect_witnesss_dtl_text
TYPE TEXT USING suspect_witnesss_dtl_text::TEXT;