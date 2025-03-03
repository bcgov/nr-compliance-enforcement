CREATE TABLE
  public.complaint_referral (
    complaint_referral_guid uuid NOT NULL DEFAULT uuid_generate_v4 (),
    complaint_identifier VARCHAR(20) NOT NULL,
    referred_by_agency_code varchar(10) NOT NULL,
    referred_to_agency_code varchar(10) NOT NULL,
    officer_guid uuid NOT NULL,
    referral_date timestamp NOT NULL DEFAULT now (),
    referral_reason varchar(500) NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL DEFAULT now (),
    update_user_id varchar(32) NOT NULL,
    update_utc_timestamp timestamp NOT NULL DEFAULT now (),
    active_ind bool NOT NULL DEFAULT TRUE,
    CONSTRAINT "PK_cmplreferral" PRIMARY KEY (complaint_referral_guid),
    CONSTRAINT "FK_cmplreferral__complaint" FOREIGN KEY (complaint_identifier) REFERENCES public.complaint (complaint_identifier),
    CONSTRAINT "FK_cmplreferral__referred_by_agency_code" FOREIGN KEY (referred_by_agency_code) REFERENCES public.agency_code (agency_code),
    CONSTRAINT "FK_cmplreferral__referred_to_agency_code" FOREIGN KEY (referred_to_agency_code) REFERENCES public.agency_code (agency_code),
    CONSTRAINT "FK_cmplreferral__officer_guid" FOREIGN KEY (officer_guid) REFERENCES public.officer (officer_guid)
  );

comment on table public.complaint_referral is 'Used to track complaint refer actions from an agency to a different agency.';

comment on column public.complaint_referral.complaint_referral_guid is 'System generated unique key for the referral action.';

comment on column public.complaint_referral.complaint_identifier is 'A human readable code used to identify a complaint being referred.';

comment on column public.complaint_referral.referred_by_agency_code is 'The agency that a complaint being reffered from.';

comment on column public.complaint_referral.referred_to_agency_code is 'The agency that a complaint being reffered to.';

comment on column public.complaint_referral.officer_guid is 'Unique key for an officer who refers a complaint. This key should never be exposed to users via any system utilizing the tables.';

comment on column public.complaint_referral.referral_date is 'The timestamp when referring a complaint was created. The timestamp is stored in UTC with no offset.';

comment on column public.complaint_referral.referral_reason is 'The reason why refer a complaint.';

comment on column public.complaint_referral.create_user_id is 'The id of the user that refer a complaint.';

comment on column public.complaint_referral.create_utc_timestamp is 'The timestamp when referring a complaint was created.  The timestamp is stored in UTC with no Offset.';

comment on column public.complaint_referral.update_user_id is 'The id of the user that updated referring a complaint.';

comment on column public.complaint_referral.update_utc_timestamp is 'The timestamp when referring a complaint was updated.  The timestamp is stored in UTC with no Offset.';

comment on column public.complaint_referral.active_ind is 'A boolean indicator to determine if refer complaint feature is active.';