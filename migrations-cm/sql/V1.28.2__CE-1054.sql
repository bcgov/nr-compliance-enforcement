-- PURGE all the decision data that may have been stored to this point to avoid any issue with
-- the uniqueness constraint to be added here.
DELETE from case_management.action
where
  action.decision_guid is not null;

DELETE from case_management.decision;

DELETE from case_management.schedule_sector_xref;

-- end PURGE of decision data
-- Add uniqueness constraint to avoid repeatable seed data script from filling the DB with copies
ALTER TABLE case_management.schedule_sector_xref ADD CONSTRAINT UK_schedule_sector_xref__schedule_sector UNIQUE (schedule_code, sector_code);