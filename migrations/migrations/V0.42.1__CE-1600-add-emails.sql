-- Support email notifications
CREATE TABLE
  public.email_reference (
    email_reference_guid uuid NOT NULL DEFAULT uuid_generate_v4 (),
    email_address varchar(256) NOT NULL,
    agency_code varchar(10),
    geo_organization_unit_code varchar(10),
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL DEFAULT now (),
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL DEFAULT now (),
    active_ind bool NOT NULL DEFAULT TRUE,
    CONSTRAINT "PK_emailref" PRIMARY KEY (email_reference_guid),
    CONSTRAINT "FK_emailref__agency_code" FOREIGN KEY (agency_code) REFERENCES public.agency_code (agency_code),
    CONSTRAINT "FK_emailref__geo_org_unit_code" FOREIGN KEY (geo_organization_unit_code) REFERENCES public.geo_organization_unit_code (geo_organization_unit_code)
  );

comment on table public.email_reference is 'Used to track shared email addresses used by various agencies.';

comment on column public.email_reference.email_reference_guid is 'System generated unique key for the referral action.';

comment on column public.email_reference.email_address is 'The email address used by parties referenced by this record.';

comment on column public.email_reference.agency_code is 'The agency that the email address belongs to.';

comment on column public.email_reference.geo_organization_unit_code is 'The geographic organization code that the email address belongs to.';

comment on column public.email_reference.create_user_id is 'The id of the user that created the email reference record.';

comment on column public.email_reference.create_utc_timestamp is 'The timestamp when email reference was created.  The timestamp is stored in UTC with no Offset.';

comment on column public.email_reference.update_user_id is 'The id of the user that updated email reference.';

comment on column public.email_reference.update_utc_timestamp is 'The timestamp when email reference was updated.  The timestamp is stored in UTC with no Offset.';

comment on column public.email_reference.active_ind is 'A boolean indicator to determine if the email reference is active.';
