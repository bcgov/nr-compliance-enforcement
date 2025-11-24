ALTER TABLE inspection.inspection_party
ADD COLUMN party_association_role character varying(16);

COMMENT ON COLUMN inspection.inspection_party.party_association_role IS 'The party role in this inspection.';