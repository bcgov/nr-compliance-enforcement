--
-- alter complaint table - add 
--
ALTER TABLE complaint ADD complaint_last_upd_timestamp TIMESTAMP;

comment on column complaint.complaint_last_upd_timestamp is 'The time the complaint was last updated, or null if the complaint has never been touched.  This value might also be updated by business logic that touches sub-tables to indicate that the business object complaint has been updated.';