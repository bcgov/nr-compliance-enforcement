-- CE-2719: Replace "No infraction identified" and "No resources available" inaction reasons
-- with 5 new options for COS and PARKS.
-- Deactivate old options
UPDATE complaint_outcome.inaction_reason_code
SET
  active_ind = false,
  update_user_id = 'FLWYAY',
  update_utc_timestamp = NOW ()
WHERE
  inaction_reason_code IN ('NOINFID', 'NORES', 'PKNOINFID', 'PKNORES');

-- Add new options for COS
INSERT INTO
  complaint_outcome.inaction_reason_code
VALUES
  (
    'COMPOPRTY',
    'COS',
    'Competing operational priorities',
    'Competing operational priorities',
    4,
    true,
    'FLWYAY',
    NOW (),
    'FLWYAY',
    NOW ()
  );

INSERT INTO
  complaint_outcome.inaction_reason_code
VALUES
  (
    'DUPLPREV',
    'COS',
    'Duplicate/previously addressed',
    'Duplicate/previously addressed',
    5,
    true,
    'FLWYAY',
    NOW (),
    'FLWYAY',
    NOW ()
  );

INSERT INTO
  complaint_outcome.inaction_reason_code
VALUES
  (
    'LOWINVVIA',
    'COS',
    'Low investigative viability',
    'Low investigative viability',
    6,
    true,
    'FLWYAY',
    NOW (),
    'FLWYAY',
    NOW ()
  );

INSERT INTO
  complaint_outcome.inaction_reason_code
VALUES
  (
    'NOOFFID',
    'COS',
    'No offence identified',
    'No offence identified',
    7,
    true,
    'FLWYAY',
    NOW (),
    'FLWYAY',
    NOW ()
  );

INSERT INTO
  complaint_outcome.inaction_reason_code
VALUES
  (
    'OUTSDJURD',
    'COS',
    'Outside jurisdiction',
    'Outside jurisdiction',
    8,
    true,
    'FLWYAY',
    NOW (),
    'FLWYAY',
    NOW ()
  );

-- Add new options for PARKS
INSERT INTO
  complaint_outcome.inaction_reason_code
VALUES
  (
    'PKCOMPOPR',
    'PARKS',
    'Competing operational priorities',
    'Competing operational priorities',
    4,
    true,
    'FLWYAY',
    NOW (),
    'FLWYAY',
    NOW ()
  );

INSERT INTO
  complaint_outcome.inaction_reason_code
VALUES
  (
    'PKDUPLPRV',
    'PARKS',
    'Duplicate/previously addressed',
    'Duplicate/previously addressed',
    5,
    true,
    'FLWYAY',
    NOW (),
    'FLWYAY',
    NOW ()
  );

INSERT INTO
  complaint_outcome.inaction_reason_code
VALUES
  (
    'PKLOWINV',
    'PARKS',
    'Low investigative viability',
    'Low investigative viability',
    6,
    true,
    'FLWYAY',
    NOW (),
    'FLWYAY',
    NOW ()
  );

INSERT INTO
  complaint_outcome.inaction_reason_code
VALUES
  (
    'PKNOOFFID',
    'PARKS',
    'No offence identified',
    'No offence identified',
    7,
    true,
    'FLWYAY',
    NOW (),
    'FLWYAY',
    NOW ()
  );

INSERT INTO
  complaint_outcome.inaction_reason_code
VALUES
  (
    'PKOUTSDJR',
    'PARKS',
    'Outside jurisdiction',
    'Outside jurisdiction',
    8,
    true,
    'FLWYAY',
    NOW (),
    'FLWYAY',
    NOW ()
  );