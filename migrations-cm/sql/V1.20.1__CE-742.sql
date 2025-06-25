--
-- INSERT INTO hwcr_outcome_code
--
insert into
  case_management.hwcr_outcome_code (
    hwcr_outcome_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
values
  (
    'LESSLETHAL',
    'Less lethal',
    'Less lethal',
    50,
    true,
    'FLYWAY',
    now (),
    'FLYWAY',
    now ()
  );

--
-- UPDATE the display_order to allow future inserts to hwcr_outcome_code
--
UPDATE case_management.hwcr_outcome_code
SET
  display_order = 10
WHERE
  hwcr_outcome_code = 'DEADONARR';

UPDATE case_management.hwcr_outcome_code
SET
  display_order = 20
WHERE
  hwcr_outcome_code = 'DESTRYCOS';

UPDATE case_management.hwcr_outcome_code
SET
  display_order = 30
WHERE
  hwcr_outcome_code = 'DESTRYOTH';

UPDATE case_management.hwcr_outcome_code
SET
  display_order = 40
WHERE
  hwcr_outcome_code = 'GONEONARR';

UPDATE case_management.hwcr_outcome_code
SET
  display_order = 60
WHERE
  hwcr_outcome_code = 'REFRTOBIO';

UPDATE case_management.hwcr_outcome_code
SET
  display_order = 70
WHERE
  hwcr_outcome_code = 'SHRTRELOC';

UPDATE case_management.hwcr_outcome_code
SET
  display_order = 80
WHERE
  hwcr_outcome_code = 'TRANSLCTD';

UPDATE case_management.hwcr_outcome_code
SET
  display_order = 90
WHERE
  hwcr_outcome_code = 'TRANSREHB';

UPDATE case_management.configuration
SET
  configuration_value = cast(configuration_value as INTEGER) + 1
WHERE
  configuration_code = 'CDTABLEVER';