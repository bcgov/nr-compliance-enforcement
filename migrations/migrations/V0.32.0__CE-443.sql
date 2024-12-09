--
-- alter officer table - add large_carnivore_ind 
--
ALTER TABLE officer ADD coms_enrolled_ind boolean DEFAULT false;

comment on column species_code.large_carnivore_ind is
  'A boolean indicator representing if an officer has been enrolled in COMS';
