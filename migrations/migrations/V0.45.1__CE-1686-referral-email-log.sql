-- Referral Email log
CREATE TABLE
  public.complaint_referral_email_log (
    complaint_referral_email_log_guid uuid NOT NULL DEFAULT uuid_generate_v4 (),
    complaint_referral_guid uuid NOT NULL,
    email_address varchar(256) NOT NULL,
    email_sent_utc_timestamp timestamp NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL DEFAULT now (),
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL DEFAULT now (),
    CONSTRAINT "PK_refemailog" PRIMARY KEY (complaint_referral_email_log_guid),
    CONSTRAINT "FK_refemailog__complaint_referral_guid" FOREIGN KEY (complaint_referral_guid) REFERENCES public.complaint_referral (complaint_referral_guid)
  );

comment on table public.complaint_referral_email_log is 'Used to track additional emails that were added to a specific complaint referral in order to maintain an audit trail.  This table does not track emails sent to the default email for an agency which is stored in the email reference table as this can be inferred from the complaint referral table.';

comment on column public.complaint_referral_email_log.complaint_referral_email_log_guid is 'System generated unique key for the referral email log action.';

comment on column public.complaint_referral_email_log.complaint_referral_guid is 'Foreign key to system generated unique key for the complaint referral.';

comment on column public.complaint_referral_email_log.email_address is 'An additional email address entered by a user that they have indicated the complaint should be referred to.';

comment on column public.complaint_referral_email_log.email_sent_utc_timestamp is 'The date and time the email was sent.  The timestamp is stored in UTC with no Offset';

comment on column public.complaint_referral_email_log.create_user_id is 'The id of the user that created the email reference record.';

comment on column public.complaint_referral_email_log.create_utc_timestamp is 'The timestamp when email reference was created.  The timestamp is stored in UTC with no Offset.';

comment on column public.complaint_referral_email_log.update_user_id is 'The id of the user that updated email reference.';

comment on column public.complaint_referral_email_log.update_utc_timestamp is 'The timestamp when email reference was updated.  The timestamp is stored in UTC with no Offset.';
