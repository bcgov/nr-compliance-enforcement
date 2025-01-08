--
-- alter officer table - add deactivate_ind
--
ALTER TABLE officer ADD deactivate_ind boolean DEFAULT false;

comment on column officer.deactivate_ind is 'A boolean indicator representing if an officer has been deactivated';