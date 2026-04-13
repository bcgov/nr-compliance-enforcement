INSERT INTO complaint.feature_agency_xref (feature_agency_xref_guid, feature_code, agency_code_ref, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
VALUES
    (gen_random_uuid(), 'COMPLIMENT', 'NROS', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'EXPERMFTRS', 'NROS', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'GIRCMPLNTS', 'NROS', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'ACTONSTKEN', 'NROS', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'ACT_FLTR', 'NROS', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'COM_FLTR', 'NROS', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'D_L_FLTR', 'NROS', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'GIR_FLTR', 'NROS', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'NAT_FLTR', 'NROS', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'OFF_FLTR', 'NROS', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'REG_FLTR', 'NROS', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'SPEC_FLTR', 'NROS', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'STAT_FLTR', 'NROS', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'VIOL_FLTR', 'NROS', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'ZONE_FLTR', 'NROS', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'PARKCOL', 'NROS', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'AUTHCOL', 'NROS', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'LCTNCOL', 'NROS', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'METH_FLTR', 'NROS', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'CASES', 'NROS', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'COMPREF', 'NROS', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'COMPCOLLAB', 'NROS', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'INVESTIGTN', 'NROS', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'INSPECTION', 'NROS', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'COLEMAIL', 'NROS', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'SECTORVIEW', 'NROS', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'PARTY', 'NROS', false, 'FLYWAY', NOW(), 'FLYWAY', NOW())
ON CONFLICT DO NOTHING;

INSERT INTO complaint.comp_mthd_recv_cd_agcy_cd_xref (comp_mthd_recv_cd_agcy_cd_xref_guid, agency_code_ref, complaint_method_received_code, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
VALUES
    (gen_random_uuid(), 'NROS', 'DGIR_FWD', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'NROS', 'DRCT_CNTCT', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'NROS', 'MIN_OFFICE', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'NROS', 'RAPP', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'NROS', 'RFRL', true, 'FLYWAY', NOW(), 'FLYWAY', NOW())
ON CONFLICT DO NOTHING;

---------------------------------
-- Add violation type mappings for NROS (matching EPO configuration)
---------------------------------

INSERT INTO complaint.violation_agency_xref (violation_agency_xref_guid, violation_code, agency_code_ref, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp, active_ind)
VALUES
    (gen_random_uuid(), 'AINVSPC', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    (gen_random_uuid(), 'BOATING', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    (gen_random_uuid(), 'DUMPING', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    (gen_random_uuid(), 'FISHERY', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    (gen_random_uuid(), 'ORV', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    (gen_random_uuid(), 'OPENBURN', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    (gen_random_uuid(), 'OTHER', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    (gen_random_uuid(), 'RECREATN', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    (gen_random_uuid(), 'WILDLIFE', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    (gen_random_uuid(), 'WINVSPC', 'NROS', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true)
ON CONFLICT DO NOTHING;
