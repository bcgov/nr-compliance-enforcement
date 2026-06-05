INSERT INTO complaint_outcome.inaction_reason_code VALUES ('NRNOSFTYC', 'NROS', 'No public safety concern', 'No public safety concern', 2, true, 'FLYWAY', now(), 'FLYWAY', now()) ON CONFLICT DO NOTHING;
INSERT INTO complaint_outcome.inaction_reason_code VALUES ('NROTHPRTY', 'NROS', 'Other operational priorities', 'Other operational priorities', 3, true, 'FLYWAY', now(), 'FLYWAY', now()) ON CONFLICT DO NOTHING;
INSERT INTO complaint_outcome.inaction_reason_code VALUES ('NROUTSDMT', 'NROS', 'Outside mandate', 'Outside mandate', 40, true, 'FLYWAY', now(), 'FLYWAY', now()) ON CONFLICT DO NOTHING;

INSERT INTO complaint_outcome.inaction_reason_code VALUES ('MNNOSFTYC', 'MINES', 'No public safety concern', 'No public safety concern', 2, true, 'FLYWAY', now(), 'FLYWAY', now()) ON CONFLICT DO NOTHING;
INSERT INTO complaint_outcome.inaction_reason_code VALUES ('MNOTHPRTY', 'MINES', 'Other operational priorities', 'Other operational priorities', 3, true, 'FLYWAY', now(), 'FLYWAY', now()) ON CONFLICT DO NOTHING;
INSERT INTO complaint_outcome.inaction_reason_code VALUES ('MNOUTSDMT', 'MINES', 'Outside mandate', 'Outside mandate', 40, true, 'FLYWAY', now(), 'FLYWAY', now()) ON CONFLICT DO NOTHING;
