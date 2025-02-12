CREATE TABLE public.violation_agency_xref (
	violation_agency_xref_guid uuid NOT NULL DEFAULT uuid_generate_v4(),
	violation_code varchar(10) NOT NULL,
  agency_code varchar(10) NOT NULL,
  create_user_id varchar(32) NOT NULL,
  create_utc_timestamp timestamp NOT NULL DEFAULT now(),
  update_user_id varchar(32) NOT NULL,
  update_utc_timestamp timestamp NOT NULL DEFAULT now(),
  active_ind bool NOT NULL DEFAULT TRUE,
  CONSTRAINT "PK_violation_agency_xref_guid" PRIMARY KEY (violation_agency_xref_guid),
  CONSTRAINT "FK_violation_agency_xref__violation_code" FOREIGN KEY (violation_code) REFERENCES public.violation_code(violation_code),
  CONSTRAINT "FK_violation_agency_xref__agency_code" FOREIGN KEY (agency_code) REFERENCES public.agency_code(agency_code)
);

comment on table public.violation_agency_xref is 'Used to track the relationship type between an agency and a violation code.  For example: violation code ''WASTE'' is only used by EPO (CEEB) but ''WILDLIFE'' is used by both COS and PARKS';
comment on column public.violation_agency_xref.violation_agency_xref_guid is 'A human readable code used to identify a relationship type between an agency and a violation code.';
comment on column public.violation_agency_xref.violation_code is 'A human readable code used to identify a violation.';
comment on column public.violation_agency_xref.agency_code is 'A human readable code used to identify an agency.';
comment on column public.violation_agency_xref.create_user_id is 'The id of the user that created the relationship between an agency and a violation code.';
comment on column public.violation_agency_xref.create_utc_timestamp is 'The timestamp when the relationship between an agency and a violation code was created.  The timestamp is stored in UTC with no Offset.';
comment on column public.violation_agency_xref.update_user_id is 'The id of the user that updated the relationship between an agency and a violation code.';
comment on column public.violation_agency_xref.update_utc_timestamp is 'The timestamp when the relationship between an agency and a violation code was updated.  The timestamp is stored in UTC with no Offset.';
comment on column public.violation_agency_xref.active_ind is 'A boolean indicator to determine if the relationship type between an agency and a violation code is active.';

---------------
-- insert new BCPARK agency
-- This was moved from the repeatable script as it might not be there in the dev environment.
---------------
INSERT INTO
  agency_code (
    agency_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
SELECT
  'PARKS',
  'BC Parks',
  'BC Parks',
  1,
  'Y',
  user,
  now(),
  user,
  now() ON CONFLICT
DO NOTHING;

-- Copy the data
INSERT into public.violation_agency_xref (violation_code, agency_code, create_user_id, update_user_id, active_ind)
SELECT violation_code, agency_code, 'FLYWAY', 'FLYWAY', TRUE
from public.violation_code
on conflict do nothing;

-- Insert new data for PARKS (clone of COS)
INSERT into public.violation_agency_xref (violation_code, agency_code, create_user_id, update_user_id, active_ind)
SELECT violation_code, 'PARKS', 'FLYWAY', 'FLYWAY', TRUE
from violation_code
where agency_code = 'COS'
on conflict do nothing;

-- Drop the old column
ALTER TABLE public.violation_code
DROP COLUMN agency_code;

