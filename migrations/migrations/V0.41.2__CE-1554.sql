-- Add collaborator to code table
insert into public.person_complaint_xref_code (
  person_complaint_xref_code,
	short_description,
  long_description,
  display_order,
  create_user_id,
  create_utc_timestamp,
  update_user_id,
  update_utc_timestamp,
  active_ind
) values(
  'COLLABORAT',
  'Collaborator',
  'A person added as a collaborator on the complaint.',
  2,
  user,
  now(),
  user,
  now(),
  true
);

-- Remake unique index to specify code of ASSIGNEE
drop index if exists person_complaint_xref_complaint_identifier_active_ind_idx;
create unique index on public.person_complaint_xref (complaint_identifier, person_complaint_xref_code, active_ind) 
where active_ind = true
and person_complaint_xref_code = 'ASSIGNEE';

-- Prevent duplicate collaborator records
create unique index on public.person_complaint_xref (complaint_identifier, person_guid, person_complaint_xref_code, active_ind)
where active_ind = true
and person_complaint_xref_code = 'COLLABORAT';

-- Add agency column to officer table
-- Add agency_code column to officer table
alter table public.officer add column agency_code varchar(6);

-- Update existing records with agency code from office table
update public.officer o
set agency_code = (
  select office.agency_code
  from public.office
  where office.office_guid = o.office_guid
);
