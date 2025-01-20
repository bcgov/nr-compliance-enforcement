--
-- alter complaint table - add 
--
ALTER TABLE complaint ADD comp_last_upd_utc_timestamp TIMESTAMP;

comment on column complaint.comp_last_upd_utc_timestamp is 'The time the complaint was last updated, or null if the complaint has never been touched.  This value might also be updated by business logic that touches sub-tables to indicate that the business object complaint has been updated.';