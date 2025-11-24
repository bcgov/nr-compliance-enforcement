ALTER TABLE investigation.investigation_party
ADD COLUMN party_association_role character varying(16);

COMMENT ON COLUMN investigation.investigation_party.party_association_role IS 'The party role in this investigation.';