ALTER TABLE public.complaint_update
ADD COLUMN upd_caller_name VARCHAR(120) NULL,
ADD COLUMN upd_caller_phone_1 VARCHAR(15) NULL,
ADD COLUMN upd_caller_phone_2 VARCHAR(15) NULL,
ADD COLUMN upd_caller_phone_3 VARCHAR(15) NULL,
ADD COLUMN upd_caller_address VARCHAR(120) NULL,
ADD COLUMN upd_caller_email VARCHAR(120) NULL,
ADD COLUMN upd_reported_by_code VARCHAR(10) NULL;

ALTER TABLE public.complaint_update
ADD CONSTRAINT fk_reported_by_code
FOREIGN KEY (upd_reported_by_code) 
REFERENCES public.reported_by_code (reported_by_code);

comment on column public.complaint_update.upd_caller_name is 'The name provided by the caller to the call centre or entered onto the web form.';
comment on column public.complaint_update.upd_caller_phone_1 is 'The primary phone number provided by the caller to the call centre or entered onto the web form.';
comment on column public.complaint_update.upd_caller_phone_2 is 'An alternate phone number provided by the caller to the call centre or entered onto the web form.';
comment on column public.complaint_update.upd_caller_phone_3 is 'An alternate phone number provided by the caller to the call centre or entered onto the web form.';
comment on column public.complaint_update.upd_caller_address is 'The address provided by the caller to the call centre or entered onto the web form.';
comment on column public.complaint_update.upd_caller_email is 'The email address provided by the caller to the call centre or entered onto the web form.';
comment on column public.complaint_update.upd_reported_by_code is 'A human readable code used to identify an agency.  The agency that originally referred the updated complaint.'