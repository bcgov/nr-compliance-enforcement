ALTER TABLE case_management.equipment
  ADD COLUMN IF NOT EXISTS was_animal_captured char(1) NOT NULL DEFAULT 'U';

ALTER TABLE case_management.equipment_code
  ADD COLUMN IF NOT EXISTS is_trap_ind boolean NOT NULL DEFAULT true;

UPDATE case_management.configuration
SET configuration_value = cast(configuration_value as INTEGER)+1 WHERE configuration_code = 'CDTABLEVER';

comment on column case_management.equipment.was_animal_captured is 'Indicates if an animal was captured by the EQUIPMENT. Values are limited to ''Y'' (Yes) ''N'' (No) and ''U'' (Unknown - Not Specified Yet). The default is ''U''';
comment on column case_management.equipment_code.is_trap_ind is 'Indicates if the EQUIPMENT_CODE value represents a trap.   Default to ''true''.   For EQUIPMENT_CODE values such as Signage or Trail cameras the value is ''false''';
