--
-- alter complaint table, drop privacy_request_ind and add new column
-- privacy_request and set default value 'U';
--
alter table complaint
drop column privacy_request_ind;

alter table complaint
add is_privacy_requested CHAR(1) default 'U';

comment on column complaint.is_privacy_requested is 'flag to represent that the caller has asked for special care when handling their personal information';

alter table complaint
add constraint complaint_is_privacy_requested check (complaint.is_privacy_requested in ('Y', 'N', 'U'));