-- Matching functions and indexes for party match scoring. Requires the pg_trgm, fuzzystrmatch
-- and unaccent extensions in the public schema, created per environment outside Flyway.

CREATE OR REPLACE FUNCTION shared.f_unaccent(text) RETURNS text AS
  $$ SELECT public.unaccent('public.unaccent', $1) $$
  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT;

CREATE OR REPLACE FUNCTION shared.f_match_norm(text) RETURNS text AS
  $$ SELECT regexp_replace(shared.f_unaccent(lower($1)), '[^a-z0-9]', '', 'g') $$
  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT;

CREATE OR REPLACE FUNCTION shared.f_person_full_name(first_name text, middle_names text, last_name text) RETURNS text AS
  $$ SELECT shared.f_unaccent(lower(first_name || ' ' || coalesce(middle_names, '') || ' ' || last_name)) $$
  LANGUAGE sql IMMUTABLE PARALLEL SAFE;

UPDATE shared.contact_method SET contact_method_type = 'PHONE' WHERE contact_method_type IN ('ALTPHONE1','ALTPHONE2','PRIMPHONE');

CREATE INDEX idx_person_drivers_license_number_norm
    ON person (shared.f_match_norm(drivers_license_number));

CREATE INDEX idx_person_first_name_norm
    ON person (shared.f_match_norm(first_name));

CREATE INDEX idx_person_last_name_norm
    ON person (shared.f_match_norm(last_name));

CREATE INDEX idx_person_first_last_name_norm
    ON person (shared.f_match_norm(first_name || last_name));

CREATE INDEX idx_person_date_of_birth
    ON person (date_of_birth);

CREATE INDEX idx_person_full_name_trgm
    ON person USING gist (shared.f_person_full_name(first_name, middle_names, last_name) public.gist_trgm_ops (siglen = 128));

CREATE INDEX idx_person_first_name_dmetaphone
    ON person (public.dmetaphone(first_name));

CREATE INDEX idx_person_last_name_dmetaphone
    ON person (public.dmetaphone(last_name));

CREATE INDEX idx_business_name_norm
    ON business (shared.f_match_norm(name));

CREATE INDEX idx_business_name_trgm
    ON business USING gist (shared.f_unaccent(lower(name)) public.gist_trgm_ops (siglen = 128));

CREATE INDEX idx_alias_name_norm
    ON alias (shared.f_match_norm(name))
    WHERE active_ind = true;

CREATE INDEX idx_alias_name_trgm
    ON alias USING gist (shared.f_unaccent(lower(name)) public.gist_trgm_ops (siglen = 128))
    WHERE active_ind = true;

CREATE INDEX idx_business_identifier_value_norm
    ON business_identifier (shared.f_match_norm(identifier_value))
    WHERE active_ind = true;

CREATE INDEX idx_contact_method_phone_norm
    ON contact_method (right(shared.f_match_norm(contact_value), 10))
    WHERE contact_method_type = 'PHONE' AND active_ind = true;

CREATE INDEX idx_contact_method_emailaddr_lower
    ON contact_method (lower(contact_value))
    WHERE contact_method_type = 'EMAILADDR' AND active_ind = true;

CREATE INDEX idx_address_address_norm
    ON address (shared.f_match_norm(address))
    WHERE active_ind = true;

CREATE INDEX idx_address_postal_code_norm
    ON address (shared.f_match_norm(postal_code))
    WHERE active_ind = true;

CREATE INDEX idx_alias_party
    ON alias (party_guid)
    WHERE active_ind = true;

CREATE INDEX idx_address_party
    ON address (party_guid)
    WHERE active_ind = true;

CREATE INDEX idx_contact_method_party
    ON contact_method (party_guid)
    WHERE active_ind = true;

CREATE INDEX idx_business_identifier_business
    ON business_identifier (business_guid)
    WHERE active_ind = true;

CREATE INDEX idx_business_person_xref_person
    ON business_person_xref (person_guid)
    WHERE active_ind = true;

CREATE INDEX idx_business_person_xref_business
    ON business_person_xref (business_guid)
    WHERE active_ind = true;
