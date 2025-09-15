---------------------
-- Bumps the code table versions to tell the clients to check for fresh data
--
-- The last line of the comment is where the magic happens, it will refresh the date -
-- even if no changes are made.
--
-- Last Run on: ${flyway:timestamp}
----------------------
UPDATE "configuration"
SET
  configuration_value = cast(configuration_value as INTEGER) + 1
WHERE
  configuration_code = 'CDTABLEVER';