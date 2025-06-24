ALTER TABLE agency_code ADD column "external_agency_ind" boolean DEFAULT false;

comment on column agency_code.external_agency_ind is 'Flag to indicate if an agency has been onboarded to Natcom or is external.';
