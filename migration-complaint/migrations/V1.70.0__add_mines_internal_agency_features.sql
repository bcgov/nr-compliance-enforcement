INSERT INTO complaint.feature_agency_xref (feature_agency_xref_guid, feature_code, agency_code_ref, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
VALUES
    (gen_random_uuid(), 'COMPLIMENT', 'MINES', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'EXPERMFTRS', 'MINES', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'GIRCMPLNTS', 'MINES', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'ACTONSTKEN', 'MINES', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'ACT_FLTR', 'MINES', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'COM_FLTR', 'MINES', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'D_L_FLTR', 'MINES', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'GIR_FLTR', 'MINES', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'NAT_FLTR', 'MINES', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'OFF_FLTR', 'MINES', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'REG_FLTR', 'MINES', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'SPEC_FLTR', 'MINES', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'STAT_FLTR', 'MINES', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'VIOL_FLTR', 'MINES', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'ZONE_FLTR', 'MINES', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'PARKCOL', 'MINES', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'AUTHCOL', 'MINES', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'LCTNCOL', 'MINES', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'METH_FLTR', 'MINES', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'CASES', 'MINES', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'COMPREF', 'MINES', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'COMPCOLLAB', 'MINES', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'INVESTIGTN', 'MINES', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'INSPECTION', 'MINES', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'COLEMAIL', 'MINES', false, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'SECTORVIEW', 'MINES', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'PARTY', 'MINES', false, 'FLYWAY', NOW(), 'FLYWAY', NOW())
ON CONFLICT DO NOTHING;

INSERT INTO complaint.comp_mthd_recv_cd_agcy_cd_xref (comp_mthd_recv_cd_agcy_cd_xref_guid, agency_code_ref, complaint_method_received_code, active_ind, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
VALUES
    (gen_random_uuid(), 'MINES', 'DGIR_FWD', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'MINES', 'DRCT_CNTCT', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'MINES', 'MIN_OFFICE', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'MINES', 'RAPP', true, 'FLYWAY', NOW(), 'FLYWAY', NOW()),
    (gen_random_uuid(), 'MINES', 'RFRL', true, 'FLYWAY', NOW(), 'FLYWAY', NOW())
ON CONFLICT DO NOTHING;

---------------------------------
-- Add violation type mappings for MINES (matching EPO configuration)
---------------------------------

INSERT INTO complaint.violation_agency_xref (violation_agency_xref_guid, violation_code, agency_code_ref, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp, active_ind)
VALUES
    (gen_random_uuid(), 'AINVSPC', 'MINES', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    (gen_random_uuid(), 'BOATING', 'MINES', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    (gen_random_uuid(), 'DUMPING', 'MINES', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    (gen_random_uuid(), 'FISHERY', 'MINES', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    (gen_random_uuid(), 'ORV', 'MINES', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    (gen_random_uuid(), 'OPENBURN', 'MINES', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    (gen_random_uuid(), 'OTHER', 'MINES', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    (gen_random_uuid(), 'RECREATN', 'MINES', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    (gen_random_uuid(), 'WILDLIFE', 'MINES', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true),
    (gen_random_uuid(), 'WINVSPC', 'MINES', 'FLYWAY', NOW(), 'FLYWAY', NOW(), true)
ON CONFLICT DO NOTHING;
