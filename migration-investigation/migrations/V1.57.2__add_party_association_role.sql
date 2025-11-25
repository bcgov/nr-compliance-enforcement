ALTER TABLE investigation.investigation_party
ADD COLUMN party_association_role_ref character varying(16);

COMMENT ON COLUMN investigation.investigation_party.party_association_role_ref IS 'Unenforced Foreign Key to shared.party_association_role. The party role in this investigation.';