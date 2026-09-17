INSERT INTO shared.species_code
    (species_code, short_description, long_description, display_order, large_carnivore_ind, create_user_id)
VALUES
    ('BISON', 'Bison', 'Bison', 10, false, 'postgres'),
    ('BLKBEAR', 'Black Bear', 'Black Bear', 20, true, 'postgres'),
    ('BOBCAT', 'Bobcat', 'Bobcat', 30, false, 'postgres'),
    ('CARIBOU', 'Caribou', 'Caribou', 40, false, 'postgres'),
    ('COUGAR', 'Cougar', 'Cougar', 50, true, 'postgres'),
    ('COYOTE', 'Coyote', 'Coyote', 60, true, 'postgres'),
    ('DEER', 'Deer', 'Deer', 70, false, 'postgres'),
    ('ELK', 'Elk', 'Elk', 80, false, 'postgres'),
    ('FOX', 'Fox', 'Fox', 90, false, 'postgres'),
    ('GRZBEAR', 'Grizzly Bear', 'Grizzly Bear', 100, true, 'postgres'),
    ('FERALHOG', 'Hog/Pig/Boar (Feral)', 'Hog/Pig/Boar (Feral)', 110, false, 'postgres'),
    ('LYNX', 'Lynx', 'Lynx', 120, false, 'postgres'),
    ('MOOSE', 'Moose', 'Moose', 130, false, 'postgres'),
    ('MTNGOAT', 'Mountain Goat', 'Mountain Goat', 140, false, 'postgres'),
    ('OTHER', 'Other', 'Other', 150, false, 'postgres'),
    ('RACCOON', 'Racoon', 'Racoon', 160, false, 'postgres'),
    ('RAPTOR', 'Raptor', 'Raptor', 170, false, 'postgres'),
    ('RATTLER', 'Rattlesnake', 'Rattlesnake', 180, false, 'postgres'),
    ('RVROTTER', 'River Otter', 'River Otter', 190, false, 'postgres'),
    ('SKUNK', 'Skunk', 'Skunk', 200, false, 'postgres'),
    ('UNKNOWN', 'Unknown', 'Unknown', 210, false, 'postgres'),
    ('WLDSHEEP', 'Wild Sheep', 'Wild Sheep', 220, false, 'postgres'),
    ('WOLF', 'Wolf', 'Wolf', 230, true, 'postgres'),
    ('WOLVERN', 'Wolverine', 'Wolverine', 240, false, 'postgres')
  ON CONFLICT (species_code) DO UPDATE SET
      short_description = EXCLUDED.short_description,
      long_description = EXCLUDED.long_description,
      display_order = EXCLUDED.display_order,
      active_ind = EXCLUDED.active_ind,
      update_user_id = 'FLYWAY',
      update_utc_timestamp = now();