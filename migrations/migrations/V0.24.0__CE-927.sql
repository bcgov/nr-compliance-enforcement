alter table public.complaint add privacy_request_ind boolean not null default false;
comment on column public.complaint.privacy_request_ind is 'flag to represent that the caller has asked for special care when handling their personal information';

alter table public.violation_code add agency_code VARCHAR(10) not null default 'COS';
alter table public.violation_code add constraint "FK_violation_code_agency_code" foreign key (agency_code) references agency_code (agency_code);
comment on column public.violation_code.agency_code is 'A human readable code used to identify an agency.';

alter table public.complaint_type_code add agency_code VARCHAR(10) not null default 'COS';
alter table public.complaint_type_code add constraint "FK_complaint_type_code_agency_code" foreign key (agency_code) references agency_code (agency_code);
comment on column public.complaint_type_code.agency_code is 'A human readable code used to identify an agency.';

UPDATE configuration 
SET    configuration_value = configuration_value::int + 1
WHERE  configuration_code = 'CDTABLEVER';

