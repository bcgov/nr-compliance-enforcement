--
-- alter complaint table, drop privacy_request_ind and add new column
-- privacy_request and set default value 'U';
--
alter table complaint
drop column privacy_request_ind;

alter table complaint
add privacy_request CHAR(1) default 'U';

comment on column complaint.privacy_request is 'flag to represent that the caller has asked for special care when handling their personal information';