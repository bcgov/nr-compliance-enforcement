ALTER TABLE complaint DROP CONSTRAINT "FK_complaint_owned_by_agencycode";
ALTER TABLE complaint_type_code DROP CONSTRAINT "FK_complaint_type_code_agency_code";
ALTER TABLE comp_mthd_recv_cd_agcy_cd_xref DROP CONSTRAINT "FK_comp_mthd_recv_cd_agcy_cd_xref_agencycode";
ALTER TABLE email_reference DROP CONSTRAINT "FK_emailref__agency_code";
ALTER TABLE complaint_referral DROP CONSTRAINT "FK_cmplreferral__referred_to_agency_code";
ALTER TABLE complaint_referral DROP CONSTRAINT "FK_cmplreferral__referred_by_agency_code";
ALTER TABLE violation_agency_xref DROP CONSTRAINT "FK_violation_agency_xref__agency_code";
ALTER TABLE feature_agency_xref DROP CONSTRAINT "FK_agencycode";
ALTER TABLE team DROP CONSTRAINT "team_agency_code_fk";
ALTER TABLE geo_org_unit_structure DROP CONSTRAINT "FK_gorgustrct_agencycode";

ALTER TABLE complaint RENAME COLUMN owned_by_agency_code TO owned_by_agency_code_ref;
ALTER TABLE complaint_type_code RENAME COLUMN agency_code TO agency_code_ref;
ALTER TABLE comp_mthd_recv_cd_agcy_cd_xref RENAME COLUMN agency_code TO agency_code_ref;
ALTER TABLE email_reference RENAME COLUMN agency_code TO agency_code_ref;
ALTER TABLE complaint_referral RENAME COLUMN referred_by_agency_code TO referred_by_agency_code_ref;
ALTER TABLE complaint_referral RENAME COLUMN referred_to_agency_code TO referred_to_agency_code_ref;
ALTER TABLE violation_agency_xref RENAME COLUMN agency_code TO agency_code_ref;
ALTER TABLE feature_agency_xref RENAME COLUMN agency_code TO agency_code_ref;
ALTER TABLE team RENAME COLUMN agency_code TO agency_code_ref;
ALTER TABLE geo_org_unit_structure RENAME COLUMN agency_code TO agency_code_ref;
ALTER TABLE office RENAME COLUMN agency_code TO agency_code_ref;
ALTER TABLE officer RENAME COLUMN agency_code TO agency_code_ref;

comment on column complaint.owned_by_agency_code_ref is 'Key representing an agency stored in the agency_code table of the shared schema.  The agency that currently owns the complaint.';
comment on column complaint_type_code.agency_code_ref is 'Key representing an agency stored in the agency_code table of the shared schema.  The agency that defines the complaint type';
comment on column comp_mthd_recv_cd_agcy_cd_xref.agency_code_ref is 'Key representing an agency stored in the agency_code table of the shared schema.  Used to map methods complaints are received to NatSuite agencies as the users were not able to standardize on a common list.';
comment on column email_reference.agency_code_ref is 'Key representing an agency stored in the agency_code table of the shared schema.  The agency that the email address belongs to.';
comment on column complaint_referral.referred_by_agency_code_ref is 'Key representing an agency stored in the agency_code table of the shared schema.  The agency that a complaint being referred from.';
comment on column complaint_referral.referred_to_agency_code_ref is 'Key representing an agency stored in the agency_code table of the shared schema.  The agency that a complaint is referred to.';
comment on column violation_agency_xref.agency_code_ref is 'Key representing an agency stored in the agency_code table of the shared schema.  Used to map violation types to the NatSuite agency responsible for compliance.';
comment on column feature_agency_xref.agency_code_ref is 'Key representing an agency stored in the agency_code table of the shared schema.  The agency for which the feature is either enabled or disabled.';
comment on column team.agency_code_ref is 'Key representing an agency stored in the agency_code table of the shared schema.  The agency for which the team is defined.';
comment on column geo_org_unit_structure.agency_code_ref is 'Key representing an agency stored in the agency_code table of the shared schema.  Used to map geographic organization structures to individual agencies as different structures are used throughout the sector.';
comment on column office.agency_code_ref is 'Key representing an agency stored in the agency_code table of the shared schema.  The agency that owns the office.';
comment on column officer.agency_code_ref is 'Key representing an agency stored in the agency_code table of the shared schema.  The agency that employs the Officer.';

--DROP table agency_code
