ALTER TABLE inspection.inspection_party
ADD COLUMN party_association_role_ref character varying(16);

COMMENT ON COLUMN inspection.inspection_party.party_association_role_ref IS 'Unenforced Foreign Key to shared.party_association_role_code. The party role in this inspection.';
