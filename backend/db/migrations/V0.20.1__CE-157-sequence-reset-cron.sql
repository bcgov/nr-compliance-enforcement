--Reset Sequence to 900000
alter sequence complaint_sequence restart with 900000;

CREATE EXTENSION IF NOT EXISTS "pg_cron";

SELECT cron.schedule('restart-complaint-seq', '0 0 1 1 *', 'alter sequence complaint_sequence restart with 900000;');