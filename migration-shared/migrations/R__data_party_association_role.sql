INSERT INTO shared.party_association_role (
    party_association_role,
    case_activity_type_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
) VALUES
   ('PTYOFINTRST', 'INSPECTION', 'Party of Interest','Party of Interest',1,true,'system',NOW(), NULL, NULL),
	 ('WITNESS','INSPECTION', 'Witness','Witness',2,true,'system',NOW(), NULL,NULL),
   ('PTYOFINTRST', 'INVSTGTN', 'Party of Interest','Party of Interest',1,true,'system',NOW(), NULL, NULL),
	 ('WITNESS','INVSTGTN', 'Witness','Witness',2,true,'system',NOW(), NULL,NULL)
ON CONFLICT DO NOTHING;   