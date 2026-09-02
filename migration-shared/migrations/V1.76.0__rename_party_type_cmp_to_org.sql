INSERT INTO shared.party_type_code (party_type_code,short_description,long_description,display_order,active_ind,create_user_id,create_utc_timestamp) VALUES
	 ('ORG','Organization','Organization',10,true,'FLYWAY',NOW())
ON CONFLICT (party_type_code) DO NOTHING;

UPDATE shared.party SET party_type = 'ORG' WHERE party_type = 'CMP';

DELETE FROM shared.party_type_code WHERE party_type_code = 'CMP';
