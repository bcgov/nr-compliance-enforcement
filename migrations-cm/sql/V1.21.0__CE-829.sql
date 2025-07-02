--
-- UPDATE display_order for Prevention and Education actions
--
UPDATE case_management.action_type_action_xref
SET
  display_order = 4
WHERE
  action_code = 'CDCTMEDREL';

UPDATE case_management.action_type_action_xref
SET
  display_order = 3
WHERE
  action_code = 'CNTCTBIOVT';

UPDATE case_management.configuration
SET
  configuration_value = cast(configuration_value as INTEGER) + 1
WHERE
  configuration_code = 'CDTABLEVER';