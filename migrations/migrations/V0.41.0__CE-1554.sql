-- Add 
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
