-- Add inaction reasons needed for COS and PARK assessments
INSERT INTO complaint_outcome.inaction_reason_code VALUES ('NOINFID', 'COS', 'No infraction identified', 'No infraction identified', 4, true, 'FLWYAY', NOW (), 'FLWYAY', NOW ());
INSERT INTO complaint_outcome.inaction_reason_code VALUES ('NORES', 'COS', 'No resources available', 'No resources available', 5, true, 'FLWYAY', NOW (), 'FLWYAY', NOW ());
INSERT INTO complaint_outcome.inaction_reason_code VALUES ('PKNOINFID', 'PARKS', 'No infraction identified', 'No infraction identified', 4, true, 'FLWYAY', NOW (), 'FLWYAY', NOW ());
INSERT INTO complaint_outcome.inaction_reason_code VALUES ('PKNORES', 'PARKS', 'No resources available', 'No resources available', 5, true, 'FLWYAY', NOW (), 'FLWYAY', NOW ());
