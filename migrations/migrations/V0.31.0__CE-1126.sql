--
-- alter species_code table - add large_carnivore_ind 
--
ALTER TABLE species_code ADD large_carnivore_ind boolean DEFAULT 'N';

comment on column species_code.large_carnivore_ind is 'A boolean indicator to determine if the species is in Catergory 1 - large carnivore.';

UPDATE species_code
SET
  large_carnivore_ind = 'Y'
WHERE
  species_code = 'BLKBEAR'
  OR species_code = 'GRZBEAR'
  OR species_code = 'COUGAR'
  OR species_code = 'COYOTE'
  OR species_code = 'WOLF';