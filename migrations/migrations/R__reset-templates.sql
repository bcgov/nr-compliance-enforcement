---------------------
-- Resets the CDOGS template hashes on every migration to ensure we always upload a new one
--
-- The last line of the comment is where the magic happens, it will refresh the date -
-- even if no changes are made.
--
-- Last Run on: ${flyway:timestamp}
----------------------

UPDATE "configuration"
SET
  configuration_value = ''
WHERE
  configuration_code IN ('ERSTMPLATE', 'HWCTMPLATE', 'CEEBTMPLAT');