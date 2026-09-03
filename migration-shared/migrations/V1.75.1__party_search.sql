-- Indexes so the party search page's ILIKE '%term%' filters are handled

CREATE INDEX idx_person_first_name_search
    ON person USING gin (first_name public.gin_trgm_ops);

CREATE INDEX idx_person_last_name_search
    ON person USING gin (last_name public.gin_trgm_ops);

CREATE INDEX idx_business_name_search
    ON business USING gin (name public.gin_trgm_ops);

CREATE INDEX idx_business_identifier_value_search
    ON business_identifier USING gin (identifier_value public.gin_trgm_ops);

CREATE INDEX idx_contact_method_value_search
    ON contact_method USING gin (contact_value public.gin_trgm_ops);

CREATE INDEX idx_address_address_search
    ON address USING gin (address public.gin_trgm_ops);

CREATE INDEX idx_address_city_search
    ON address USING gin (city public.gin_trgm_ops);
