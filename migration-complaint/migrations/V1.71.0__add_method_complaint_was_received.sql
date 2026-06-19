INSERT INTO complaint.complaint_method_received_code VALUES ('RAPP_MBECC', 'RAPP_MBECC', 'RAPP - Miscategorized by ECC', 65, true, 'FLYWAY', NOW(), 'FLYWAY', NOW());

INSERT INTO complaint.comp_mthd_recv_cd_agcy_cd_xref VALUES ( uuid_generate_v4(), 'COS', 'RAPP_MBECC', true, 'FLYWAY', NOW(), 'FLYWAY', NOW());
INSERT INTO complaint.comp_mthd_recv_cd_agcy_cd_xref VALUES ( uuid_generate_v4(), 'EPO', 'RAPP_MBECC', true, 'FLYWAY', NOW(), 'FLYWAY', NOW());
INSERT INTO complaint.comp_mthd_recv_cd_agcy_cd_xref VALUES ( uuid_generate_v4(), 'NROS', 'RAPP_MBECC', true, 'FLYWAY', NOW(), 'FLYWAY', NOW());
INSERT INTO complaint.comp_mthd_recv_cd_agcy_cd_xref VALUES ( uuid_generate_v4(), 'MINES', 'RAPP_MBECC', true, 'FLYWAY', NOW(), 'FLYWAY', NOW());