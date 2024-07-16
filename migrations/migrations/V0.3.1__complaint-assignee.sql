CREATE TABLE public.person_complaint_xref_code (
	person_complaint_xref_code varchar(10) NOT NULL,
	short_description varchar(50) NOT NULL,
    long_description varchar(250) NULL,
    display_order int4 NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_user_guid uuid NULL,
    create_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_user_guid uuid NULL,
    update_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_person_complaint_xref_code" PRIMARY KEY (person_complaint_xref_code)
);

CREATE TABLE public.person_complaint_xref (
	person_complaint_xref_guid uuid NOT NULL DEFAULT uuid_generate_v4(),
	person_guid uuid NOT NULL,
    complaint_identifier varchar(20) NOT NULL,
    person_complaint_xref_code varchar(10) NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_user_guid uuid NULL,
    create_timestamp timestamp NOT NULL,
    update_user_id varchar(32) NOT NULL,
    update_user_guid uuid NULL,
    update_timestamp timestamp NOT NULL,
    active_ind bool NOT NULL,
    CONSTRAINT "PK_person_complaint_xref_guid" PRIMARY KEY (person_complaint_xref_guid),
    CONSTRAINT "FK_person_complaint_xref__person_guid" FOREIGN KEY (person_guid) REFERENCES public.person(person_guid),
    CONSTRAINT "FK_person_complaint_xref__complaint_identifier" FOREIGN KEY (complaint_identifier) REFERENCES public.complaint(complaint_identifier),
    CONSTRAINT "FK_person_complaint_xref__person_complaint_xref_code" FOREIGN KEY (person_complaint_xref_code) REFERENCES public.person_complaint_xref_code(person_complaint_xref_code)
);

-- create unique index to ensure that there is only one active complaint for a given complaint_identifier
create unique index on public.person_complaint_xref (complaint_identifier, active_ind) 
where active_ind = true;

ALTER TABLE public.officer
ADD COLUMN auth_user_guid uuid NULL;

-- populate code table
insert into public.person_complaint_xref_code values('ASSIGNEE','Officer Assigned','The person to whom the complaint is assigned to.',1, user, null, now(), user, null, now());

-- audit table
CREATE TABLE person_complaint_xref_h
(
  h_person_complaint_xref_guid uuid NOT NULL DEFAULT uuid_generate_v4(),
  target_row_id uuid NOT NULL,
  operation_type char(1) NOT NULL,
  operation_user_id varchar(32) NOT NULL DEFAULT current_user,
  operation_executed_at timestamp NOT NULL DEFAULT now(),
  data_after_executed_operation jsonb,
CONSTRAINT "PK_h_person_complaint_xref_guid" PRIMARY KEY (h_person_complaint_xref_guid)
);

-- audit trigger
CREATE or REPLACE TRIGGER person_complaint_xref_trigger
  BEFORE INSERT OR DELETE OR UPDATE ON person_complaint_xref
  FOR EACH ROW EXECUTE PROCEDURE audit_history('person_complaint_xref_h', 'person_complaint_xref_guid');

-- comments
comment on table public.person_complaint_xref_code is 'Used to track the relationship type between person and complaint.  For example: ''ASSIGNEE'' = Assignee';
comment on column public.person_complaint_xref_code.person_complaint_xref_code is 'A human readable code used to identify a relationship type between a person and a complaint.';
comment on column public.person_complaint_xref_code.short_description is 'The short description of the relationship type between a person and a complaint.';
comment on column public.person_complaint_xref_code.long_description is 'The long description of the relationship type between a person and a complaint.';
comment on column public.person_complaint_xref_code.display_order is 'The order in which the values of the relationship type between a person and a complaint code table should be displayed when presented to a user in a list.';
comment on column public.person_complaint_xref_code.create_user_id is 'The id of the user that created the relationship type between a person and a complaint.';
comment on column public.person_complaint_xref_code.create_timestamp is 'The timestamp when the relationship type between a person and a complaint  was created.  The timestamp is stored in UTC with no Offset.';
comment on column public.person_complaint_xref_code.update_user_id is 'The id of the user that updated the relationship type between a person and a complaint .';
comment on column public.person_complaint_xref_code.update_timestamp is 'The timestamp when the relationship type between a person and a complaint  was updated.  The timestamp is stored in UTC with no Offset.';
comment on table public.person_complaint_xref is 'Used to create a relationship between a person and a complaint.   One person can play many roles on a complaint, and many people could be involved in a single complaint.';
comment on column public.person_complaint_xref.person_complaint_xref_guid is 'System generated unique key for a relationship between a person and a complaint. This key should never be exposed to users via any system utilizing the tables.';
comment on column public.person_complaint_xref.person_guid is 'System generated unique key for an person. ';
comment on column public.person_complaint_xref.complaint_identifier is 'Natural key for a complaint generated by webEOC.  Format is YY-###### where the number portion of the sequence resets to 0 on the new year.';
comment on column public.person_complaint_xref.person_complaint_xref_code is 'A human readable code used to identify a relationship type between a person and a complaint.';
comment on column public.person_complaint_xref.create_user_id is 'The id of the user that created the relationship between a person and a complaint.';
comment on column public.person_complaint_xref.create_timestamp is 'The timestamp when the relationship between a person and a complaint  was created.  The timestamp is stored in UTC with no Offset.';
comment on column public.person_complaint_xref.update_user_id is 'The id of the user that updated the relationship between a person and a complaint .';
comment on column public.person_complaint_xref.update_timestamp is 'The timestamp when the relationship between a person and a complaint  was updated.  The timestamp is stored in UTC with no Offset.';
comment on column public.person_complaint_xref.active_ind is 'A boolean indicator to determine if the relationship type between a person and a complaint code is active.';
comment on column public.officer.auth_user_guid is 'The SiteMinder guid returned to the application from KeyCloak.   Used to uniquely identify a user over the course of their lifecycle.';

comment on table public.person_complaint_xref_h is 'History table for person_complaint_xref';
comment on column public.person_complaint_xref_h.h_person_complaint_xref_guid is 'System generated unique key for person assigned to complaint history. This key should never be exposed to users via any system utilizing the tables.';
comment on column public.person_complaint_xref_h.target_row_id is 'The unique key for the person and complaint mapping that has been created or modified.';
comment on column public.person_complaint_xref_h.operation_type is 'The operation performed: I = Insert, U = Update, D = Delete';
comment on column public.person_complaint_xref_h.operation_user_id is 'The id of the user that created or modified the data in complaint table.  Defaults to the logged in user if not passed in by the application.';
comment on column public.person_complaint_xref_h.operation_executed_at is 'The timestamp when the data in the table was created or modified.  The timestamp is stored in UTC with no Offset.';
comment on column public.person_complaint_xref_h.data_after_executed_operation is 'A JSON representation of the row in the table after the operation was completed successfully.   This implies that the latest row in the audit table will always match with the current row in the live table.';