insert into
  case_management.inaction_reason_code (
    inaction_reason_code,
    outcome_agency_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
values
  (
    'DUPLICATE',
    'COS',
    'Duplicate',
    'Duplicate',
    3,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

-- Fix display order
update case_management.inaction_reason_code
set
  display_order = 1
where
  inaction_reason_code = 'DUPLICATE';

update case_management.inaction_reason_code
set
  display_order = 2
where
  inaction_reason_code = 'NOPUBSFTYC';

update case_management.inaction_reason_code
set
  display_order = 3
where
  inaction_reason_code = 'OTHOPRPRTY';

-- CEEB Decision Codes
--
-- INSERT sector_code values
--
INSERT INTO
  case_management.sector_code (
    sector_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'ABRASIVESI',
    'ABRASIVESI',
    'Abrasives Industry',
    10,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'AGRICULOP',
    'AGRICULOP',
    'Agricultural Operations',
    20,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'ALUMINUMPR',
    'ALUMINUMPR',
    'Aluminum and Aluminum Alloy Products Industry',
    30,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'ANTICHEMM',
    'ANTICHEMM',
    'Antisapstain Chemicals Management',
    40,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'AQUALANDI',
    'AQUALANDI',
    'Aquaculture - Land-based Industry',
    50,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'AQUAMARINE',
    'AQUAMARINE',
    'Aquaculture - Marine-based Industry',
    60,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'ASBESTOSMI',
    'ASBESTOSMI',
    'Asbestos Mining Industry',
    70,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'ASPHALTPI',
    'ASPHALTPI',
    'Asphalt Plant Industry',
    80,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'ASPHALTROO',
    'ASPHALTROO',
    'Asphalt Roof Manufacturing Industry',
    90,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'BEVERAGEIN',
    'BEVERAGEIN',
    'Beverage Industry',
    100,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'BIOTECHIN',
    'BIOTECHIN',
    'Biotechnology Industry',
    110,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'BURNVEGED',
    'BURNVEGED',
    'Burning of Vegetative Debris',
    120,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'BURNWASTE',
    'BURNWASTE',
    'Burning or Incineration of Waste',
    130,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'BURNWOODR',
    'BURNWOODR',
    'Burning or Incineration of Wood Residue',
    140,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'CEMENTLIME',
    'CEMENTLIME',
    'Cement and Lime Manufacturing Industry',
    150,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'CHEMPRIND',
    'CHEMPRIND',
    'Chemical and Chemical Products Industry',
    160,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'CLAYINDUST',
    'CLAYINDUST',
    'Clay Industry',
    170,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'COALGASIN',
    'COALGASIN',
    'Coalbed Gas Exploration and Production Industry',
    180,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'COMWASTEIN',
    'COMWASTEIN',
    'Commercial Waste Management or Waste Disposal Industry',
    190,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'COMPOSTIN',
    'COMPOSTIN',
    'Composting Operations',
    200,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'CONCRETEP',
    'CONCRETEP',
    'Concrete and Concrete Products Industry',
    210,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'CONTSITEM',
    'CONTSITEM',
    'Contaminated Site Contaminant Management',
    220,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'DAIRYPROD',
    'DAIRYPROD',
    'Dairy Products Industry',
    230,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'DEEPWELLD',
    'DEEPWELLD',
    'Deep Well Disposal',
    240,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'ELECPRODI',
    'ELECPRODI',
    'Electrical or Electronic Products Industry',
    250,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'ELECPOWER',
    'ELECPOWER',
    'Electrical Power Industry',
    260,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'FISHPRODI',
    'FISHPRODI',
    'Fish Products Industry',
    270,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'FLOURFEED',
    'FLOURFEED',
    'Flour Prepared Cereal Food and Feed Industry',
    280,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'FRUITVEGI',
    'FRUITVEGI',
    'Fruit and Vegetable Processing Industry',
    290,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'GLASSPROD',
    'GLASSPROD',
    'Glass and Glass Products Industry',
    300,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'HAZWASTEM',
    'HAZWASTEM',
    'Hazardous Waste Management',
    310,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'INDFASTEN',
    'INDFASTEN',
    'Industrial Fastener Industry',
    320,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'NONHAZWST',
    'NONHAZWST',
    'Industrial Non-hazardous Waste Landfills',
    330,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'MEATBYPROD',
    'MEATBYPROD',
    'Meat By-product Processing Industry',
    340,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'METALPROC',
    'METALPROC',
    'Metal Processing and Metal Products Manufacturing Industry',
    350,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'METALSMEL',
    'METALSMEL',
    'Metal Smelting Iron and Steel Foundry and Metal Refining Industry',
    360,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'MININGCOA',
    'MININGCOA',
    'Mining and Coal Mining Industry',
    370,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'MUNSEWMAN',
    'MUNSEWMAN',
    'Municipal Sewage Management',
    380,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'MUNSOLWST',
    'MUNSOLWST',
    'Municipal Solid Waste Management',
    390,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'MUNWASTEI',
    'MUNWASTEI',
    'Municipal Waste Incineration or Burning Industry',
    400,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'NORADMATM',
    'NORADMATM',
    'Naturally Occurring Radioactive Materials Management',
    410,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'NONMETMIN',
    'NONMETMIN',
    'Non-Metallic Mineral Products Industry',
    420,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'OILNATGASL',
    'OILNATGASL',
    'Oil and Natural Gas Industry - Large',
    430,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'OILNATGSS',
    'OILNATGSS',
    'Oil and Natural Gas Industry - Small',
    440,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'OZONEMANG',
    'OZONEMANG',
    'Ozone Depleting Substances and other Halocarbons Management',
    450,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'PAPERINDU',
    'PAPERINDU',
    'Paper Industry',
    460,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'PAPERBOAR',
    'PAPERBOAR',
    'Paperboard Industry',
    470,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'PARTWAFAI',
    'PARTWAFAI',
    'Particle and Wafer Board Industry',
    480,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'PETROSTOR',
    'PETROSTOR',
    'Petroleum Storage',
    490,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'PIPETRANA',
    'PIPETRANA',
    'Pipeline Transport Industry with Approved Operating Plan',
    500,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'PIPETRANI',
    'PIPETRANI',
    'Pipeline Transport Industry',
    510,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'PLACERMIN',
    'PLACERMIN',
    'Placer Mining Industry',
    520,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'PLASTRESI',
    'PLASTRESI',
    'Plastic and Synthetic Resin Manufacturing Industry',
    530,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'PLASTCOMP',
    'PLASTCOMP',
    'Plastics and Composite Products Industry',
    540,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'POULTRYPR',
    'POULTRYPR',
    'Poultry Processing Industry',
    550,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'PRODSTORAG',
    'PRODSTORAG',
    'Product Storage - Bulk Solids',
    560,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'PULPINDUST',
    'PULPINDUST',
    'Pulp Industry',
    570,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'REFPETPRO',
    'REFPETPRO',
    'Refined Petroleum and Coal Products Industry',
    580,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'SGENRODEN',
    'SGENRODEN',
    'SECOND-GENERATION ANTICOAGULANT RODENTICIDES-GENERAL',
    590,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'SLAUGHTER',
    'SLAUGHTER',
    'SLAUGHTER Industry',
    600,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'SOILENHAN',
    'SOILENHAN',
    'Soil Enhancement Using Wastes',
    610,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'SUGARPROD',
    'SUGARPROD',
    'Sugar Processing and Refining Industry',
    620,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRAERGEN',
    'USRAERGEN',
    'user/service- AERIAL- GENERAL',
    630,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRAGRGEN',
    'USRAGRGEN',
    'user/service- AGRICULTURE GENERAL',
    640,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRAGRICU',
    'USRAGRICU',
    'user/service- AGRICULTURE',
    650,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRAGGENE',
    'USRAGGENE',
    'user/service- AGRICULTURE-GENERAL',
    660,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRFORENU',
    'USRFORENU',
    'user/service- FORESTRY- NURSERY',
    670,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRFORE50H',
    'USRFORE50H',
    'user/service- FORESTRY PESTICIDE USE LESS THAN 50 HA PER YEAR',
    680,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRFORE500',
    'USRFORE500',
    'user/service- FORESTRY PESTICIDE USE LESS THAN 500 HA PER YEAR',
    690,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRFOREMOR',
    'USRFOREMOR',
    'user/service- FORESTRY PESTICIDE USE ON MORE THAN 500 HA PER YEAR',
    700,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRFUMCON',
    'USRFUMCON',
    'user/service- FUMIGATION- CONTAINER',
    710,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRFUMSHS',
    'USRFUMSHS',
    'user/service- FUMIGATION- SHIPS & STRUCTURESFUMIGATION- SOIL',
    720,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRINDPAVE',
    'USRINDPAVE',
    'user/service- INDUSTRIAL VEGETATION & NOXIOUS WEED- PAVERS',
    730,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRINDGEN',
    'USRINDGEN',
    'user/service- INDUSTRIAL VEGETATION & NOXIOUS WEED-GENERAL',
    740,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRLANDGEN',
    'USRLANDGEN',
    'user/service- LANDSCAPE- GENERAL',
    750,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRMOSBIT',
    'USRMOSBIT',
    'user/service- MOSQUITO & BITING FLY',
    760,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRMOSAEBA',
    'USRMOSAEBA',
    'user/service- MOSQUITO- AERIAL APPLICATION OF GRANULAR BACTERIAL PESTICIDES',
    770,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRMOSGRBA',
    'USRMOSGRBA',
    'user/service- MOSQUITO- GROUND APPLICATION OF BACTERIAL PESTICIDES & GROWTH REGULATORS',
    780,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRNETTRE',
    'USRNETTRE',
    'user/service- NET TREATMENT PRODUCTS',
    790,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRNOXGEN',
    'USRNOXGEN',
    'user/service- NOXIOUS WEED- GENERAL',
    800,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRPESTNS',
    'USRPESTNS',
    'user/service- PESTICIDE USER- NON-SERVICE',
    810,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRPESTPL',
    'USRPESTPL',
    'user/service- PESTICIDE USER- PUBLIC LAND',
    820,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRPESTSE',
    'USRPESTSE',
    'user/service- PESTICIDE USER- SERVICE',
    830,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRRESTBE',
    'USRRESTBE',
    'user/service- RESTRICTED TO COMMERCIAL BEEKEEPING PRODUCTS',
    840,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRSTRGEN',
    'USRSTRGEN',
    'user/service- STRUCTURAL- GENERAL',
    850,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRSTRWOO',
    'USRSTRWOO',
    'user/service- STRUCTURAL- INDUSTRIAL WOOD PRESERVATION',
    860,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRFORMAG',
    'USRFORMAG',
    'user/service-FORESTRY- MANAGEMENT; GENERAL',
    870,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRFORMNB',
    'USRFORMNB',
    'user/service-FORESTRY- MANAGEMENT; NON-BROADCAST',
    880,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRFORNU2',
    'USRFORNU2',
    'user/service-FORESTRY- NURSERY',
    890,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRFORSEO',
    'USRFORSEO',
    'user/service-FORESTRY- SEED ORCHARD',
    900,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USRFUMCO2',
    'USRFUMCO2',
    'user/service-FUMIGATION- C02',
    910,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'VEHDISREC',
    'VEHDISREC',
    'Vehicle Dismantling and Recycling Industry',
    920,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'VEHINDPAR',
    'VEHINDPAR',
    ' Vehicle Industrial Machinery and Parts and Accessories Manufacturing Industry',
    930,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'VENDDOM100',
    'VENDDOM100',
    'vendor- DOMESTIC AND UP TO 100 KG COMMERCIAL PESTICIDES',
    940,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'VENDGENERA',
    'VENDGENERA',
    'vendor- GENERAL',
    950,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'VENDGENCO',
    'VENDGENCO',
    'vendor- GENERAL; COMMERCIAL PESTICIDES',
    960,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'VENDGENDOM',
    'VENDGENDOM',
    'vendor- GENERAL; DOMESTIC PESTICIDES',
    970,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'VENDGENLAN',
    'VENDGENLAN',
    'vendor- GENERAL; DOMESTIC PESTICIDES- LANDSCAPE- GENERAL',
    980,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'VENEERPLY',
    'VENEERPLY',
    'Veneer and Plywood Industry',
    990,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'WOODPRIMA',
    'WOODPRIMA',
    'Wood Processing Industry - Primary',
    1000,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'WOODSECON',
    'WOODSECON',
    'Wood Processing Industry - Secondary',
    1010,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'WOODTREIN',
    'WOODTREIN',
    'Wood Treatment Industry',
    1020,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

--
-- INSERT schedule_code values
--
INSERT INTO
  case_management.schedule_code (
    schedule_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'WDR1',
    'WDR schedule 1',
    'WDR schedule 1',
    10,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'WDR2',
    'WDR schedule 2',
    'WDR schedule 2',
    20,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'OTHER',
    'Other',
    'Other',
    30,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'IPM',
    'IPM sector type',
    'IPM sector type',
    40,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

--
-- INSERT new action_type_code values
--
INSERT INTO
  case_management.action_type_code (
    action_type_code,
    short_description,
    long_description,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
VALUES
  (
    'CEEBACTION',
    'CEEB Actions',
    'CEEB Actions',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

--
-- INSERT new action_code values
--
INSERT INTO
  case_management.action_code (
    action_code,
    short_description,
    long_description,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
VALUES
  (
    'FWDLEADAGN',
    'FWDLEADAGN',
    'Forward to lead agency',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'RESPNFA',
    'RESPNFA',
    'Responded - no further action',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'RESPAUTO',
    'RESPAUTO',
    'Responded - auto-response/ed/promotion',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'RESPREC',
    'RESPREC',
    'Responded - recommend for inspection',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

--
-- INSERT new action_type_action_xref values
--
INSERT INTO
  case_management.action_type_action_xref (
    action_type_code,
    action_code,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
VALUES
  (
    'CEEBACTION',
    'FWDLEADAGN',
    1,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'CEEBACTION',
    'RESPNFA',
    2,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'CEEBACTION',
    'RESPAUTO',
    3,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'CEEBACTION',
    'RESPREC',
    4,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

--
-- INSERT non_compliance_decision_matrix_code values
--
INSERT INTO
  case_management.non_compliance_decision_matrix_code (
    non_compliance_decision_matrix_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'INCOMP',
    '0 In Compliance',
    '0 In Compliance',
    10,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'NOIMPCT',
    '1 No impact likely',
    '1 No impact likely',
    20,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'MINIMPCT',
    '2 Minor temporary impact likely',
    '2 Minor temporary impact likely',
    30,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'MODIMPCT',
    '3 Moderate temporary impact likely',
    '3 Moderate temporary impact likely',
    40,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'SIGIMPCT',
    '4 Significant impact likely',
    '4 Significant impact likely',
    50,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'SVRIMPCT',
    '5 Severe human health impact demonstrated/likely',
    '5 Severe human health impact demonstrated/likely',
    60,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'ND',
    'Not determined',
    'Not determined',
    70,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

--
-- INSERT discharge_code values
--
INSERT INTO
  case_management.discharge_code (
    discharge_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'AIR_BURN',
    'AIR_BURN',
    'Air – burning',
    10,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'AIR_ODOUR',
    'AIR_ODOUR',
    'Air – odour',
    20,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'AIR_EMSSN',
    'AIR_EMSSN',
    'Air – emission',
    30,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'AIR_DST',
    'AIR_DST',
    'Air – dust',
    40,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'EFFLNT',
    'EFFLNT',
    'Effluent',
    50,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'RFS_DMP',
    'RFS_DMP',
    'Refuse – Dumping',
    60,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'RFS_OTHR',
    'RFS_OTHR',
    'Refuse - Other',
    70,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'PSTCD',
    'PSTCD',
    'Pesticides',
    80,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

--
-- add new EPO agency code
--
insert into
  case_management.outcome_agency_code (
    outcome_agency_code,
    short_description,
    long_description,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
values
  (
    'EPO',
    'CEEB',
    'Compliance and Environmental Enforcement Branch',
    true,
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

--
-- INSERT data AGENCY_CODE
--
insert into
  case_management.outcome_agency_code (
    outcome_agency_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
values
  (
    'ALC',
    'Agricultural Land Commission',
    'Agricultural Land Commission',
    10,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'ENERGY',
    'BC Energy Regulator ',
    'BC Energy Regulator',
    20,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'PARKS',
    'BC Parks',
    'BC Parks',
    30,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'CEB',
    'Compliance and Enforcement Branch',
    'Compliance and Enforcement Branch',
    40,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'EPO',
    'CEEB',
    'Compliance and Environmental Enforcement Branch',
    50,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'ECCC',
    'Environment and Climate Change Canada',
    'Environment and Climate Change Canada',
    70,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'EAO',
    'Environmental Assessment Office',
    'Environmental Assessment Office',
    80,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'FSIB',
    'Food Safety Inspection Branch',
    'Food Safety Inspection Branch',
    90,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'HEALTH',
    'Health Authority',
    'Health Authority',
    100,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'MHSED',
    'Mines Health, Safety and Enforcement Division',
    'Mines Health, Safety and Enforcement Division',
    110,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'MUNI',
    'Municipality / Regional District',
    'Municipality / Regional District',
    120,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'MOTI',
    'Transport Canada / MOTI',
    'Transport Canada / MOTI',
    130,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'OTHER',
    'Other',
    'Other',
    140,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

update case_management.outcome_agency_code
set
  display_order = 60
where
  outcome_agency_code = 'COS';

update case_management.outcome_agency_code
set
  display_order = 50
where
  outcome_agency_code = 'EPO';

--------------------
-- CE-1054 Schedule Sector XREFs
--------------------
-- END WDR Schedule 1
INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'ABRASIVESI',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'ALUMINUMPR',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'ASBESTOSMI',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'ASPHALTROO',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'BIOTECHIN',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'BURNVEGED',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'BURNWASTE',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'BURNWOODR',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'CEMENTLIME',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'CHEMPRIND',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'CLAYINDUST',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'COMWASTEIN',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'CONTSITEM',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'DAIRYPROD',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'ELECPRODI',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'ELECPOWER',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'FLOURFEED',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'GLASSPROD',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'HAZWASTEM',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'INDFASTEN',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'METALPROC',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'METALSMEL',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'MININGCOA',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'MUNSEWMAN',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'MUNSOLWST',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'MUNWASTEI',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'NONMETMIN',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'OILNATGASL',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'OZONEMANG',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'PAPERBOAR',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'PAPERINDU',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'PARTWAFAI',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'PIPETRANA',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'PLASTRESI',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'PULPINDUST',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'REFPETPRO',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'MEATBYPROD',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'SUGARPROD',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR1',
    'VENEERPLY',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

-- END WDR Schedule 1
-- START WDR Schedule 2
INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'AGRICULOP',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'ANTICHEMM',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'AQUALANDI',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'AQUAMARINE',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'ASPHALTPI',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'BEVERAGEIN',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'COALGASIN',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'COMPOSTIN',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'CONCRETEP',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'DEEPWELLD',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'FISHPRODI',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'FRUITVEGI',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'NONHAZWST',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'NORADMATM',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'OILNATGSS',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'PETROSTOR',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'PIPETRANI',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'PLACERMIN',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'PLASTCOMP',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'POULTRYPR',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'PRODSTORAG',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'SLAUGHTER',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'SOILENHAN',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'VEHDISREC',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'VEHINDPAR',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'WOODPRIMA',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'WOODSECON',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'WDR2',
    'WOODTREIN',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

-- END WDR Schedule 2
-- START IPM Sector Type
INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRAERGEN',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRAGRGEN',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRFORENU',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRFORE50H',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRFORE500',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRFOREMOR',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRFUMCON',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRFUMSHS',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRINDPAVE',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRINDGEN',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRLANDGEN',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRMOSBIT',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRMOSAEBA',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRMOSGRBA',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRNETTRE',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRNOXGEN',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRPESTNS',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRPESTPL',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRPESTSE',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRRESTBE',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRSTRGEN',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRSTRWOO',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRFORMAG',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRFORMNB',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRFORNU2',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRFORSEO',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USRFUMCO2',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'VENDDOM100',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'VENDGENERA',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'VENDGENCO',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'VENDGENDOM',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'VENDGENLAN',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'SGENRODEN',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

-- END IPM Sector Type
------------
-- CE-1065: Update Sector Drop Down values
------------
-- WDR Schedule 2
update case_management.sector_code
set
  long_description = 'Abrasives industry'
where
  sector_code = 'ABRASIVESI';

update case_management.sector_code
set
  long_description = 'Aluminum and aluminum alloy products industry'
where
  sector_code = 'ALUMINUMPR';

update case_management.sector_code
set
  long_description = 'Asbestos mining industry'
where
  sector_code = 'ASBESTOSMI';

update case_management.sector_code
set
  long_description = 'Asphalt roof manufacturing industry'
where
  sector_code = 'ASPHALTROO';

update case_management.sector_code
set
  long_description = 'Biotechnology industry'
where
  sector_code = 'BIOTECHIN';

update case_management.sector_code
set
  long_description = 'Burning of vegetative debris'
where
  sector_code = 'BURNVEGED';

update case_management.sector_code
set
  long_description = 'Burning or incineration of waste'
where
  sector_code = 'BURNWASTE';

update case_management.sector_code
set
  long_description = 'Burning or incineration of wood residue'
where
  sector_code = 'BURNWOODR';

update case_management.sector_code
set
  long_description = 'Cement and lime manufacturing industry'
where
  sector_code = 'CEMENTLIME';

update case_management.sector_code
set
  long_description = 'Chemical and chemical products industry'
where
  sector_code = 'CHEMPRIND';

update case_management.sector_code
set
  long_description = 'Clay industry'
where
  sector_code = 'CLAYINDUST';

update case_management.sector_code
set
  long_description = 'Commercial waste management or waste disposal industry'
where
  sector_code = 'COMWASTEIN';

update case_management.sector_code
set
  long_description = 'Contaminated site contaminant management'
where
  sector_code = 'CONTSITEM';

update case_management.sector_code
set
  long_description = 'Dairy products industry'
where
  sector_code = 'DAIRYPROD';

update case_management.sector_code
set
  long_description = 'Electrical or electronic products industry'
where
  sector_code = 'ELECPRODI';

update case_management.sector_code
set
  long_description = 'Electrical power industry'
where
  sector_code = 'ELECPOWER';

update case_management.sector_code
set
  long_description = 'Flour, prepared cereal food and feed industry'
where
  sector_code = 'FLOURFEED';

update case_management.sector_code
set
  long_description = 'Glass and glass products industry'
where
  sector_code = 'GLASSPROD';

update case_management.sector_code
set
  long_description = 'Hazardous waste management'
where
  sector_code = 'HAZWASTEM';

update case_management.sector_code
set
  long_description = 'Industrial fastener industry'
where
  sector_code = 'INDFASTEN';

update case_management.sector_code
set
  long_description = 'Metal processing and metal products manufacturing industry'
where
  sector_code = 'METALPROC';

update case_management.sector_code
set
  long_description = 'Metal smelting, iron and steel foundry and metal refining industry'
where
  sector_code = 'METALSMEL';

update case_management.sector_code
set
  long_description = 'Mining and coal mining industry'
where
  sector_code = 'MININGCOA';

update case_management.sector_code
set
  long_description = 'Municipal sewage management'
where
  sector_code = 'MUNSEWMAN';

update case_management.sector_code
set
  long_description = 'Municipal solid waste management'
where
  sector_code = 'MUNSOLWST';

update case_management.sector_code
set
  long_description = 'Municipal waste incineration or burning industry'
where
  sector_code = 'MUNWASTEI';

update case_management.sector_code
set
  long_description = 'Non-metallic mineral products industry'
where
  sector_code = 'NONMETMIN';

update case_management.sector_code
set
  long_description = 'Oil and natural gas industry - large'
where
  sector_code = 'OILNATGASL';

update case_management.sector_code
set
  long_description = 'Ozone depleting substances and other halocarbons management'
where
  sector_code = 'OZONEMANG';

update case_management.sector_code
set
  long_description = 'Paperboard industry'
where
  sector_code = 'PAPERBOAR';

update case_management.sector_code
set
  long_description = 'Paper industry'
where
  sector_code = 'PAPERINDU';

update case_management.sector_code
set
  long_description = 'Particle and wafer board industry'
where
  sector_code = 'PARTWAFAI';

update case_management.sector_code
set
  long_description = 'Pipeline transport industry with approved operating plan'
where
  sector_code = 'PIPETRANA';

update case_management.sector_code
set
  long_description = 'Plastic and synthetic resin manufacturing industry'
where
  sector_code = 'PLASTRESI';

update case_management.sector_code
set
  long_description = 'Pulp industry'
where
  sector_code = 'PULPINDUST';

update case_management.sector_code
set
  long_description = 'Refined petroleum and coal products industry'
where
  sector_code = 'REFPETPRO';

update case_management.sector_code
set
  long_description = 'Meat by-product processing industry',
  display_order = 340
where
  sector_code = 'MEATBYPROD';

update case_management.sector_code
set
  long_description = 'Sugar processing and refining industry'
where
  sector_code = 'SUGARPROD';

update case_management.sector_code
set
  long_description = 'Veneer and plywood industry'
where
  sector_code = 'VENEERPLY';

-- WDR Schedule 2
update case_management.sector_code
set
  long_description = 'Agricultural operations'
where
  sector_code = 'AGRICULOP';

update case_management.sector_code
set
  long_description = 'Antisapstain chemicals management'
where
  sector_code = 'ANTICHEMM';

update case_management.sector_code
set
  long_description = 'Aquaculture - land-based industry'
where
  sector_code = 'AQUALANDI';

update case_management.sector_code
set
  long_description = 'Aquaculture - marine-based industry'
where
  sector_code = 'AQUAMARINE';

update case_management.sector_code
set
  long_description = 'Asphalt plant industry'
where
  sector_code = 'ASPHALTPI';

update case_management.sector_code
set
  long_description = 'Beverage industry'
where
  sector_code = 'BEVERAGEIN';

update case_management.sector_code
set
  long_description = 'Coalbed gas exploration and production industry'
where
  sector_code = 'COALGASIN';

update case_management.sector_code
set
  long_description = 'Composting operations'
where
  sector_code = 'COMPOSTIN';

update case_management.sector_code
set
  long_description = 'Concrete and concrete products industry'
where
  sector_code = 'CONCRETEP';

update case_management.sector_code
set
  long_description = 'Deep well disposal'
where
  sector_code = 'DEEPWELLD';

update case_management.sector_code
set
  long_description = 'Fish products industry'
where
  sector_code = 'FISHPRODI';

update case_management.sector_code
set
  long_description = 'Fruit and vegetable processing industry'
where
  sector_code = 'FRUITVEGI';

update case_management.sector_code
set
  long_description = 'Industrial non-hazardous waste landfills'
where
  sector_code = 'NONHAZWST';

update case_management.sector_code
set
  long_description = 'Naturally occurring radioactive materials management'
where
  sector_code = 'NORADMATM';

update case_management.sector_code
set
  long_description = 'Oil and natural gas industry - small'
where
  sector_code = 'OILNATGSS';

update case_management.sector_code
set
  long_description = 'Petroleum storage'
where
  sector_code = 'PETROSTOR';

update case_management.sector_code
set
  long_description = 'Pipeline transport industry'
where
  sector_code = 'PIPETRANI';

update case_management.sector_code
set
  long_description = 'Placer mining industry'
where
  sector_code = 'PLACERMIN';

update case_management.sector_code
set
  long_description = 'Plastics and composite products industry'
where
  sector_code = 'PLASTCOMP';

update case_management.sector_code
set
  long_description = 'Poultry processing industry'
where
  sector_code = 'POULTRYPR';

update case_management.sector_code
set
  long_description = 'Product storage - bulk solids'
where
  sector_code = 'PRODSTORAG';

update case_management.sector_code
set
  long_description = 'Slaughter industry'
where
  sector_code = 'SLAUGHTER';

update case_management.sector_code
set
  long_description = 'Soil enhancement using wastes'
where
  sector_code = 'SOILENHAN';

update case_management.sector_code
set
  long_description = 'Vehicle dismantling and recycling industry'
where
  sector_code = 'VEHDISREC';

update case_management.sector_code
set
  long_description = 'Vehicle, industrial machinery and parts and accessories manufacturing industry'
where
  sector_code = 'VEHINDPAR';

update case_management.sector_code
set
  long_description = 'Wood processing industry - primary'
where
  sector_code = 'WOODPRIMA';

update case_management.sector_code
set
  long_description = 'Wood processing industry - secondary'
where
  sector_code = 'WOODSECON';

update case_management.sector_code
set
  long_description = 'Wood treatment industry'
where
  sector_code = 'WOODTREIN';

-- IPM/Sector
update case_management.sector_code
set
  long_description = 'User/service - Aerial'
where
  sector_code = 'USRAERGEN';

update case_management.sector_code
set
  long_description = 'User/service - Agriculture',
  display_order = 643
where
  sector_code = 'USRAGRICU';

update case_management.sector_code
set
  long_description = 'User/service - Industrial vegetation and noxious weeds'
where
  sector_code = 'USRINDGEN';

update case_management.sector_code
set
  long_description = 'User/service - Landscape'
where
  sector_code = 'USRLANDGEN';

update case_management.sector_code
set
  long_description = 'User/service - Mosquito'
where
  sector_code = 'USRMOSBIT';

update case_management.sector_code
set
  long_description = 'User/service - Noxious weed'
where
  sector_code = 'USRNOXGEN';

update case_management.sector_code
set
  long_description = 'User/service - Structural'
where
  sector_code = 'USRSTRGEN';

update case_management.sector_code
set
  long_description = 'User/service - Structural – Industrial wood preservation'
where
  sector_code = 'USRSTRWOO';

update case_management.sector_code
set
  long_description = 'Vendor - Commercial pesticides'
where
  sector_code = 'VENDGENCO';

update case_management.sector_code
set
  long_description = 'Vendor - Domestic pesticides'
where
  sector_code = 'VENDGENDOM';

update case_management.sector_code
set
  long_description = 'Vendor - Domestic and up to 100 kg commercial pesticides',
  display_order = 965
where
  sector_code = 'VENDDOM100';

update case_management.sector_code
set
  long_description = 'User/service - Forestry',
  display_order = 675
where
  sector_code = 'USRFORMAG';

update case_management.sector_code
set
  long_description = 'User/service - Commercial beekeeping',
  display_order = 665
where
  sector_code = 'USRRESTBE';

-- New Codes
INSERT INTO
  case_management.sector_code (
    sector_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'USAERIALDR',
    'USAERIALDR',
    'User/service - Aerial - Drones',
    635,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USAGRISGAR',
    'USAGRISGAR',
    'User/service - Agriculture - SGARs',
    645,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USAQUACULT',
    'USAQUACULT',
    'User/service - Aquaculture',
    655,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USAFMGTION',
    'USAFMGTION',
    'User/service - Fumigation',
    695,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USINDSTVEG',
    'USINDSTVEG',
    'User/service - Industrial vegetation',
    710,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'USSTRCSGAR',
    'USSTRCSGAR',
    'User/service - Structural – SGARs',
    865,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

-- add schedule_sector_xrefs
INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'IPM',
    'USAERIALDR',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    uuid_generate_v4 (),
    'IPM',
    'USRAGRICU',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    uuid_generate_v4 (),
    'IPM',
    'USAGRISGAR',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    uuid_generate_v4 (),
    'IPM',
    'USAQUACULT',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    uuid_generate_v4 (),
    'IPM',
    'USAFMGTION',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    uuid_generate_v4 (),
    'IPM',
    'USINDSTVEG',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    uuid_generate_v4 (),
    'IPM',
    'USSTRCSGAR',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

-- The following codes are no longer relevant.  They can be deleted rather than inactivated as 
-- we aren't live yet.
delete from case_management.schedule_sector_xref
where
  sector_code IN (
    'SGENRODEN',
    'USRAGRGEN',
    'USRAGGENE',
    'USRFORENU',
    'USRFORE50H',
    'USRFORE500',
    'USRFOREMOR',
    'USRFUMCON',
    'USRFUMSHS',
    'USRINDPAVE',
    'USRMOSAEBA',
    'USRMOSGRBA',
    'USRNETTRE',
    'USRPESTNS',
    'USRPESTPL',
    'USRPESTSE',
    'USRFORMNB',
    'USRFORNU2',
    'USRFORSEO',
    'USRFUMCO2',
    'VENDGENERA',
    'VENDGENLAN'
  );

delete from case_management.sector_code
where
  sector_code IN (
    'SGENRODEN',
    'USRAGRGEN',
    'USRAGGENE',
    'USRFORENU',
    'USRFORE50H',
    'USRFORE500',
    'USRFOREMOR',
    'USRFUMCON',
    'USRFUMSHS',
    'USRINDPAVE',
    'USRMOSAEBA',
    'USRMOSGRBA',
    'USRNETTRE',
    'USRPESTNS',
    'USRPESTPL',
    'USRPESTSE',
    'USRFORMNB',
    'USRFORNU2',
    'USRFORSEO',
    'USRFUMCO2',
    'VENDGENERA',
    'VENDGENLAN'
  );

--
-- Add Other/None as a schedule/sector code 
-- INSERT sector_code value
--
INSERT INTO
  case_management.sector_code (
    sector_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'NONE',
    'None',
    'None',
    1030,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'OTHER',
    'NONE',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

insert into
  case_management.outcome_agency_code (
    outcome_agency_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
values
  (
    'TRANSPORT',
    'Transport Canada',
    'Transport Canada',
    135,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

update case_management.outcome_agency_code
set
  short_description = 'MOTI',
  long_description = 'MOTI'
where
  outcome_agency_code = 'MOTI';

INSERT INTO
  case_management.action_code (
    action_code,
    short_description,
    long_description,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
VALUES
  (
    'NOACTION',
    'No action',
    'No action',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.action_type_action_xref (
    action_type_code,
    action_code,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
VALUES
  (
    'CEEBACTION',
    'NOACTION',
    20,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

---Insert data to case_location_code 
INSERT INTO
  case_management.case_location_code (
    case_location_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
values
  (
    'RURAL',
    'Rural',
    'Rural',
    10,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'URBAN',
    'Urban',
    'Urban',
    20,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'WLDNS',
    'Wilderness',
    'Wilderness',
    30,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

-- Insert new action_type_code CAT1ASSESS
INSERT INTO
  case_management.action_type_code (
    action_type_code,
    short_description,
    long_description,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
VALUES
  (
    'CAT1ASSESS',
    'Category 1 Assessment',
    'Additional assessment options for large carnivores',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

-- Insert new action_codes for assessment
INSERT INTO
  case_management.action_code (
    action_code,
    short_description,
    long_description,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
VALUES
  (
    'SGHTNGS',
    'Sighting',
    'Sighting',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'FOODCOND',
    'Food conditioned',
    'Food conditioned',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'DAMGPROP',
    'Damage to property',
    'Damage to property',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'INJPRES',
    'Injured, present',
    'Injured, present',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'FSBCHRG',
    'Follow/stalk/bluff charge',
    'Follow/stalk/bluff charge',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'LVSTKILL',
    'Livestock or pet, killed or injured',
    'Livestock or pet, killed or injured',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'ENTRDWLL',
    'Enters dwelling - temporary or permanent',
    'Enters dwelling - temporary or permanent',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'NATPRYCP',
    'Natural prey/crops',
    'Natural prey/crops',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'CONFINED',
    'Confined or treed',
    'Confined or treed',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'SCHPRES',
    'School/park/playground present',
    'School/park/playground present',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'HUMINJ',
    'Human injury/death',
    'Human injury/death',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'COUGNGT',
    'Cougar - sighting at night or tracks found',
    'Cougar - sighting at night or tracks found',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'COUGDAY',
    'Cougar - day time sighting',
    'Cougar - day time sighting',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'UNFNDED',
    'Unfounded',
    'Unfounded',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

-- Update action type descriptions
update case_management.action_code
set
  short_description = 'Present - injured/distressed/deceased',
  long_description = 'Present - injured/distressed/deceased'
where
  action_code = 'INJPRES';

--Insert new xref for above action_codes
INSERT INTO
  case_management.action_type_action_xref (
    action_type_code,
    action_code,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
VALUES
  (
    'COMPASSESS',
    'SGHTNGS',
    10,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'COMPASSESS',
    'FOODCOND',
    20,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'COMPASSESS',
    'DAMGPROP',
    30,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'COMPASSESS',
    'INJPRES',
    40,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'COMPASSESS',
    'FSBCHRG',
    50,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'COMPASSESS',
    'LVSTKILL',
    60,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'COMPASSESS',
    'ENTRDWLL',
    70,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'COMPASSESS',
    'NATPRYCP',
    80,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'COMPASSESS',
    'CONFINED',
    90,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'COMPASSESS',
    'SCHPRES',
    100,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'COMPASSESS',
    'HUMINJ',
    110,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'COMPASSESS',
    'UNFNDED',
    120,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'CAT1ASSESS',
    'COUGNGT',
    10,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'CAT1ASSESS',
    'COUGDAY',
    20,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

update case_management.action_type_action_xref
set
  display_order = 10
where
  action_type_code = 'CEEBACTION'
  and action_code = 'FWDLEADAGN';

update case_management.action_type_action_xref
set
  display_order = 30
where
  action_type_code = 'CEEBACTION'
  and action_code = 'RESPNFA';

update case_management.action_type_action_xref
set
  display_order = 40
where
  action_type_code = 'CEEBACTION'
  and action_code = 'RESPAUTO';

update case_management.action_type_action_xref
set
  display_order = 50
where
  action_type_code = 'CEEBACTION'
  and action_code = 'RESPREC';

UPDATE case_management.action_code
SET
  active_ind = 'N'
WHERE
  action_code = 'ASSESSRISK'
  OR action_code = 'ASSESSHLTH'
  OR action_code = 'ASSESSHIST'
  OR action_code = 'CNFRMIDENT';

UPDATE case_management.action_type_action_xref
SET
  active_ind = 'N'
WHERE
  action_code = 'ASSESSRISK'
  OR action_code = 'ASSESSHLTH'
  OR action_code = 'ASSESSHIST'
  OR action_code = 'CNFRMIDENT';

--
-- INSERT INTO drug_method_code
--
INSERT INTO
  case_management.drug_method_code (
    drug_method_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'ORNA',
    'Oral/nasal',
    'Oral/nasal',
    4,
    true,
    'FLYWAY',
    now (),
    'FLYWAY',
    now ()
  ) on conflict do nothing;

--
-- UPDATE Reverse distribution -> Returned to vet
--
UPDATE case_management.drug_remaining_outcome_code
SET
  short_description = 'Returned to vet',
  long_description = 'Returned to vet',
  update_user_id = 'FLYWAY',
  update_utc_timestamp = now ()
WHERE
  drug_remaining_outcome_code = 'RDIS';

--
-- INSERT INTO hwcr_outcome_code
--
insert into
  hwcr_outcome_code (
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
    'EUTHCOS',
    'Euthanized by COS',
    'Euthanized by COS',
    15,
    true,
    'FLYWAY',
    now (),
    'FLYWAY',
    now ()
  ),
  (
    'EUTHOTH',
    'Euthanized by Other',
    'Euthanized by Other',
    25,
    true,
    'FLYWAY',
    now (),
    'FLYWAY',
    now ()
  ) on conflict do nothing;

update case_management.hwcr_outcome_code
set
  short_description = 'Dispatched by COS',
  long_description = 'Dispatched by COS'
where
  hwcr_outcome_code = 'DESTRYCOS';

update case_management.hwcr_outcome_code
set
  short_description = 'Dispatched by Other',
  long_description = 'Dispatched by Other'
where
  hwcr_outcome_code = 'DESTRYOTH';

--
-- INSERT INTO hwcr_outcome_actioned_by_code
--
insert into
  hwcr_outcome_actioned_by_code (
    hwcr_outcome_actioned_by_code,
    outcome_agency_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
  --     BC Parks, COS, First Nations, Other, Police, Public
values
  (
    'COS',
    'COS',
    'COS',
    'Conservation Officer Service',
    1,
    true,
    'FLYWAY',
    now (),
    'FLYWAY',
    now ()
  ),
  (
    'PARKS',
    'PARKS',
    'BC Parks',
    'BC Parks',
    2,
    true,
    'FLYWAY',
    now (),
    'FLYWAY',
    now ()
  ),
  (
    'FRSTNTNS',
    NULL,
    'First Nations',
    'First Nations',
    3,
    true,
    'FLYWAY',
    now (),
    'FLYWAY',
    now ()
  ),
  (
    'OTHER',
    NULL,
    'Other',
    'Other',
    4,
    true,
    'FLYWAY',
    now (),
    'FLYWAY',
    now ()
  ),
  (
    'POLICE',
    NULL,
    'Police',
    'Police',
    5,
    true,
    'FLYWAY',
    now (),
    'FLYWAY',
    now ()
  ),
  (
    'PUBLIC',
    NULL,
    'Public',
    'Public',
    6,
    true,
    'FLYWAY',
    now (),
    'FLYWAY',
    now ()
  ) on conflict do nothing;

--------------------------
-- Equipment code updates
-------------------------
update case_management.equipment_code
set
  active_ind = 'N'
where
  equipment_code IN ('BRSNR', 'BRLTR', 'CRFTR', 'CRLTR');

insert into
  equipment_code (
    equipment_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp,
    is_trap_ind
  )
values
  (
    'FTRAP',
    'Foothold trap',
    'Foothold trap',
    10,
    true,
    'FLYWAY',
    now (),
    'FLYWAY',
    now (),
    'Y'
  ),
  (
    'LTRAP',
    'Live trap',
    'Live trap',
    20,
    true,
    'FLYWAY',
    now (),
    'FLYWAY',
    now (),
    'Y'
  ),
  (
    'LLTHL',
    'Less lethal',
    'Less lethal',
    60,
    true,
    'FLYWAY',
    now (),
    'FLYWAY',
    now (),
    'N'
  ),
  (
    'K9UNT',
    'K9 unit',
    'K9 unit',
    70,
    true,
    'FLYWAY',
    now (),
    'FLYWAY',
    now (),
    'N'
  ) on conflict do nothing;

update case_management.equipment_code
set
  display_order = 30
where
  equipment_code = 'NKSNR';

update case_management.equipment_code
set
  display_order = 40
where
  equipment_code = 'SIGNG';

update case_management.equipment_code
set
  display_order = 50
where
  equipment_code = 'TRCAM';

INSERT INTO
  equipment_code (
    equipment_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'SNR',
    'Snare',
    'Snare',
    5,
    true,
    'FLYWAY',
    now (),
    'FLYWAY',
    now ()
  ) ON conflict do nothing;

UPDATE equipment
SET
  equipment_code = 'SNR'
WHERE
  equipment_code = 'NKSNR';

DELETE FROM equipment_code
WHERE
  equipment_code = 'NKSNR';

update equipment_code
set
  has_quantity_ind = true
where
  active_ind = true
  and equipment_code in ('FTRAP', 'SNR', 'SIGNG', 'TRCAM', 'LTRAP');

--------------------------
-- Outcome code updates
-------------------------
update case_management.hwcr_outcome_code
set
  short_description = 'Relocated - within home range',
  long_description = 'Relocated - within home range'
where
  hwcr_outcome_code = 'SHRTRELOC';

update case_management.hwcr_outcome_code
set
  short_description = 'Translocated - outside home range',
  long_description = 'Translocated - outside home range'
where
  hwcr_outcome_code = 'TRANSLCTD';

update case_management.hwcr_outcome_code
set
  short_description = 'Euthanized by other',
  long_description = 'Euthanized by other'
where
  hwcr_outcome_code = 'EUTHOTH';

update case_management.hwcr_outcome_code
set
  short_description = 'Dispatched by other',
  long_description = 'Dispatched by other'
where
  hwcr_outcome_code = 'DESTRYOTH';

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
    'RELSITE',
    'Released on-site',
    'Released on-site',
    65,
    true,
    'FLYWAY',
    now (),
    'FLYWAY',
    now ()
  ),
  (
    'NOTRCVD',
    'Not recovered',
    'Not recovered',
    55,
    true,
    'FLYWAY',
    now (),
    'FLYWAY',
    now ()
  ) on conflict do nothing;

update case_management.hwcr_outcome_code
set
  active_ind = 'N'
where
  hwcr_outcome_code = 'LESSLETHAL';

-------------------------
-- Action Code Updates
-------------------------
update case_management.action_code
set
  short_description = 'Explained/directed livestock owner to the Wildlife Act',
  long_description = 'Explained/directed livestock owner to the Wildlife Act'
where
  action_code = 'DIRLOWLACT';

------------------------
-- Sector Code Updates
------------------------
update case_management.sector_code
set
  long_description = 'Aerial'
where
  sector_code = 'USRAERGEN';

update case_management.sector_code
set
  long_description = 'Aerial - Drones'
where
  sector_code = 'USAERIALDR';

update case_management.sector_code
set
  long_description = 'Agriculture'
where
  sector_code = 'USRAGRICU';

update case_management.sector_code
set
  long_description = 'Agriculture - SGARs'
where
  sector_code = 'USAGRISGAR';

update case_management.sector_code
set
  long_description = 'Aquaculture'
where
  sector_code = 'USAQUACULT';

update case_management.sector_code
set
  long_description = 'Commercial beekeeping'
where
  sector_code = 'USRRESTBE';

update case_management.sector_code
set
  long_description = 'Commercial pesticides',
  display_order = 667
where
  sector_code = 'VENDGENCO';

update case_management.sector_code
set
  long_description = 'Domestic and up to 100 kg commercial pesticides',
  display_order = 668
where
  sector_code = 'VENDDOM100';

update case_management.sector_code
set
  long_description = 'Domestic pesticides',
  display_order = 669
where
  sector_code = 'VENDGENDOM';

update case_management.sector_code
set
  long_description = 'Forestry'
where
  sector_code = 'USRFORMAG';

update case_management.sector_code
set
  long_description = 'Fumigation'
where
  sector_code = 'USAFMGTION';

update case_management.sector_code
set
  long_description = 'Industrial vegetation'
where
  sector_code = 'USINDSTVEG';

update case_management.sector_code
set
  long_description = 'Industrial vegetation and noxious weeds'
where
  sector_code = 'USRINDGEN';

update case_management.sector_code
set
  long_description = 'Landscape'
where
  sector_code = 'USRLANDGEN';

update case_management.sector_code
set
  long_description = 'Mosquito'
where
  sector_code = 'USRMOSBIT';

update case_management.sector_code
set
  long_description = 'Noxious weed'
where
  sector_code = 'USRNOXGEN';

update case_management.sector_code
set
  long_description = 'Structural'
where
  sector_code = 'USRSTRGEN';

update case_management.sector_code
set
  long_description = 'Structural – Industrial wood preservation'
where
  sector_code = 'USRSTRWOO';

update case_management.sector_code
set
  long_description = 'Structural – SGARs'
where
  sector_code = 'USSTRCSGAR';

-----------------------------
-- IPM Authorization Categories
-----------------------------
INSERT INTO
  case_management.ipm_auth_category_code (
    ipm_auth_category_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
VALUES
  (
    'CONFHOLDR',
    'Confirmation holder',
    'Confirmation holder',
    10,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'OTHERTYPE',
    'Other',
    'Other',
    20,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'PERMHOLDR',
    'Permit holder',
    'Permit holder',
    30,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'PESUSNSLC',
    'Pesticide user non-service licence',
    'Pesticide user non-service licence',
    40,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'PESUSLICE',
    'Pesticide user service licence',
    'Pesticide user service licence',
    50,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'PESVENLIC',
    'Pesticide vendor licence',
    'Pesticide vendor licence',
    60,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

-- CE-1448 
insert into
  case_management.inaction_reason_code (
    inaction_reason_code,
    outcome_agency_code,
    short_description,
    long_description,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
values
  (
    'OUTSDCOSMT',
    'COS',
    'Outside COS Mandate',
    'Outside COS Mandate',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

update case_management.action_code
set
  short_description = 'Provided advice, attractant management and/or husbandry information to the public',
  long_description = 'Provided advice, attractant management and/or husbandry information to the public'
where
  action_code = 'PROVAMHSIN';

insert into
  case_management.action_code (
    action_code,
    short_description,
    long_description,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
values
  (
    'INJNOTPRES',
    'Not present - Injured/distressed',
    'Not present - Injured/distressed',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

insert into
  case_management.action_type_action_xref (
    action_type_code,
    action_code,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
values
  (
    'COMPASSESS',
    'INJNOTPRES',
    45,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

update case_management.action_code
set
  short_description = 'Contacted/referred to biologist and/or veterinarian',
  long_description = 'Contacted/referred to biologist and/or veterinarian'
where
  action_code = 'CNTCTBIOVT';

update case_management.action_code
set
  short_description = 'Contacted/referred to WildSafeBC or local interest group to deliver education to the public',
  long_description = 'Contacted/referred to WildSafeBC or local interest group to deliver education to the public'
where
  action_code = 'CNTCTGROUP';

update case_management.action_code
set
  short_description = 'Contacted/referred to bylaw to assist with managing attractants',
  long_description = 'Contacted/referred to bylaw to assist with managing attractants'
where
  action_code = 'CNTCTBYLAW';

update case_management.action_code
set
  short_description = 'Contacted/referred to the Livestock Protection Program ("LPP") (cattle and sheep only)',
  long_description = 'Contacted/referred to the Livestock Protection Program ("LPP") (cattle and sheep only)'
where
  action_code = 'CONTACTLPP';

update case_management.hwcr_outcome_code
set
  short_description = 'Transferred to rehab',
  long_description = 'Transferred to rehab'
where
  hwcr_outcome_code = 'TRANSREHB';

-----------------------------
-- Equipment status code - CE-1362
-----------------------------
INSERT INTO
  case_management.equipment_status_code (
    equipment_status_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
VALUES
  (
    'ALLEQUIP',
    'All equipment',
    'All equipment',
    10,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'ACTEQUIP',
    'Active equipment',
    'Active equipment',
    20,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'INACTEQUIP',
    'Inactive equipment',
    'Inactive equipment',
    30,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

--------------------------
-- CE-1579 Update Mandate Wording and alphabetize by adding display order
-------------------------
update case_management.inaction_reason_code
SET
  short_description = 'Outside mandate',
  long_description = 'Outside mandate',
  display_order = '40'
WHERE
  inaction_reason_code = 'OUTSDCOSMT';

-------------------------
-- CE-1573 Add actioned by for applicable HWC outcomes
-- Add a new code for Euthenized and Dispatched
-- Update existing euthenized by... and dispatched by... codes to use the new codes and specify who it was actioned by
-- Set the affected HWCR outcome codes to inactive
-------------------------
insert into
  hwcr_outcome_code (
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
    'EUTHNIZD',
    'Euthanized',
    'Euthanized',
    15,
    true,
    'FLYWAY',
    now (),
    'FLYWAY',
    now ()
  ),
  (
    'DISPTCHD',
    'Dispatched',
    'Dispatched',
    25,
    true,
    'FLYWAY',
    now (),
    'FLYWAY',
    now ()
  ) on conflict do nothing;

-- Update the affected wildlife records to use the new codes and specify actioned by.
update case_management.wildlife
set
  hwcr_outcome_code = 'EUTHNIZD',
  hwcr_outcome_actioned_by_code = 'COS'
where
  hwcr_outcome_code = 'EUTHCOS';

update case_management.wildlife
set
  hwcr_outcome_code = 'EUTHNIZD',
  hwcr_outcome_actioned_by_code = 'OTHER'
where
  hwcr_outcome_code = 'EUTHOTH';

update case_management.wildlife
set
  hwcr_outcome_code = 'DISPTCHD',
  hwcr_outcome_actioned_by_code = 'COS'
where
  hwcr_outcome_code = 'DESTRYCOS';

update case_management.wildlife
set
  hwcr_outcome_code = 'DISPTCHD',
  hwcr_outcome_actioned_by_code = 'OTHER'
where
  hwcr_outcome_code = 'DESTRYOTH';

-- Set the affected HWCR outcome codes to inactive.
update case_management.hwcr_outcome_code
set
  active_ind = 'N'
where
  hwcr_outcome_code in ('EUTHCOS', 'EUTHOTH', 'DESTRYCOS', 'DESTRYOTH');

------------------------
-- CE-1574 Parks Specific Prevention and Education Options
------------------------
insert into
  case_management.action_type_code (
    action_type_code,
    short_description,
    long_description,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
values
  (
    'PRKPRV&EDU',
    'Prevention and Education',
    'Prevention and Education',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

insert into
  case_management.action_type_action_xref (
    action_type_code,
    action_code,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
values
  (
    'PRKPRV&EDU',
    'PROVSFTYIN',
    10,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'PRKPRV&EDU',
    'PROVAMHSIN',
    20,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'PRKPRV&EDU',
    'CNTCTBIOVT',
    30,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ),
  (
    'PRKPRV&EDU',
    'CNTCTGROUP',
    40,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) on conflict do nothing;

update case_management.action_code
set
  short_description = 'Provided advice, attractant management and/or husbandry information',
  long_description = 'Provided advice, attractant management and/or husbandry information'
where
  action_code = 'PROVAMHSIN';

------------------------
-- CE-1742 Add Recycling option in CEEB schedule_code and update display order
------------------------
INSERT INTO
  case_management.schedule_code (
    schedule_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'RECYCLING',
    'Recycling',
    'Recycling',
    50,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

-- Update display order to alphabetical order in schedule_code
UPDATE case_management.schedule_code
SET
  display_order = 10
WHERE
  schedule_code = 'IPM';

UPDATE case_management.schedule_code
SET
  display_order = 20
WHERE
  schedule_code = 'OTHER';

UPDATE case_management.schedule_code
SET
  display_order = 30
WHERE
  schedule_code = 'RECYCLING';

UPDATE case_management.schedule_code
SET
  display_order = 40
WHERE
  schedule_code = 'WDR1';

UPDATE case_management.schedule_code
SET
  display_order = 50
WHERE
  schedule_code = 'WDR2';

INSERT INTO
  case_management.schedule_sector_xref (
    schedule_sector_xref_guid,
    schedule_code,
    sector_code,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    uuid_generate_v4 (),
    'RECYCLING',
    'NONE',
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.discharge_code (
    discharge_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    'NONE',
    'NONE',
    'None',
    90,
    'Y',
    CURRENT_USER,
    CURRENT_TIMESTAMP,
    CURRENT_USER,
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

-- Update display order to alphabetical order in discharge_code with the exception of None being at the top
UPDATE case_management.discharge_code
SET
  display_order = 5
WHERE
  discharge_code = 'NONE';

UPDATE case_management.discharge_code
SET
  display_order = 20
WHERE
  discharge_code = 'AIR_DST';

UPDATE case_management.discharge_code
SET
  display_order = 40
WHERE
  discharge_code = 'AIR_ODOUR';

UPDATE case_management.discharge_code
SET
  display_order = 70
WHERE
  discharge_code = 'PSTCD';

UPDATE case_management.discharge_code
SET
  display_order = 80
WHERE
  discharge_code = 'RFS_DMP';

UPDATE case_management.discharge_code
SET
  display_order = 90
WHERE
  discharge_code = 'RFS_OTHR';

------------------------
-- CE-1708 Changes to Prevention and Education and Outcomes based on user feedback
------------------------
INSERT INTO
  case_management.action_code (
    action_code,
    short_description,
    long_description,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
VALUES
  (
    'CNTCTPOLIC',
    'Contacted/referred to Police',
    'Contacted/referred to Police',
    true,
    'postgres',
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.action_code (
    action_code,
    short_description,
    long_description,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
VALUES
  (
    'CNTCTREHFT',
    'Contacted/referred to rehabilitation facility',
    'Contacted/referred to rehabilitation facility',
    true,
    'postgres',
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.action_type_action_xref (
    action_type_code,
    action_code,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
VALUES
  (
    'COSPRV&EDU',
    'CNTCTPOLIC',
    60,
    true,
    'postgres',
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.action_type_action_xref (
    action_type_code,
    action_code,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
VALUES
  (
    'COSPRV&EDU',
    'CNTCTREHFT',
    70,
    true,
    'postgres',
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

UPDATE case_management.action_type_action_xref
SET
  display_order = 10,
  update_user_id = 'postgres',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  action_type_code = 'COSPRV&EDU'
  AND action_code = 'PROVSFTYIN';

UPDATE case_management.action_type_action_xref
SET
  display_order = 20,
  update_user_id = 'postgres',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  action_type_code = 'COSPRV&EDU'
  AND action_code = 'PROVAMHSIN';

UPDATE case_management.action_type_action_xref
SET
  display_order = 30,
  update_user_id = 'postgres',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  action_type_code = 'COSPRV&EDU'
  AND action_code = 'CNTCTBIOVT';

UPDATE case_management.action_type_action_xref
SET
  display_order = 40,
  update_user_id = 'postgres',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  action_type_code = 'COSPRV&EDU'
  AND action_code = 'CNTCTBYLAW';

UPDATE case_management.action_type_action_xref
SET
  display_order = 50,
  update_user_id = 'postgres',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  action_type_code = 'COSPRV&EDU'
  AND action_code = 'CNTCTGROUP';

UPDATE case_management.action_type_action_xref
SET
  display_order = 80,
  update_user_id = 'postgres',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  action_type_code = 'COSPRV&EDU'
  AND action_code = 'CONTACTLPP';

UPDATE case_management.action_type_action_xref
SET
  display_order = 90,
  update_user_id = 'postgres',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  action_type_code = 'COSPRV&EDU'
  AND action_code = 'CDCTMEDREL';

UPDATE case_management.action_type_action_xref
SET
  display_order = 100,
  update_user_id = 'postgres',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  action_type_code = 'COSPRV&EDU'
  AND action_code = 'DIRLOWLACT';

INSERT INTO
  case_management.action_type_action_xref (
    action_type_code,
    action_code,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
VALUES
  (
    'PRKPRV&EDU',
    'CNTCTPOLIC',
    50,
    true,
    'postgres',
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

INSERT INTO
  case_management.action_type_action_xref (
    action_type_code,
    action_code,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
VALUES
  (
    'PRKPRV&EDU',
    'CNTCTREHFT',
    60,
    true,
    'postgres',
    CURRENT_TIMESTAMP
  ) ON CONFLICT DO NOTHING;

UPDATE case_management.action_type_action_xref
SET
  display_order = 10,
  update_user_id = 'postgres',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  action_type_code = 'PRKPRV&EDU'
  AND action_code = 'PROVSFTYIN';

UPDATE case_management.action_type_action_xref
SET
  display_order = 20,
  update_user_id = 'postgres',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  action_type_code = 'PRKPRV&EDU'
  AND action_code = 'PROVAMHSIN';

UPDATE case_management.action_type_action_xref
SET
  display_order = 30,
  update_user_id = 'postgres',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  action_type_code = 'PRKPRV&EDU'
  AND action_code = 'CNTCTBIOVT';

UPDATE case_management.action_type_action_xref
SET
  display_order = 40,
  update_user_id = 'postgres',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  action_type_code = 'PRKPRV&EDU'
  AND action_code = 'CNTCTGROUP';

UPDATE case_management.hwcr_outcome_code
SET
  active_ind = false,
  update_user_id = 'FLYWAY',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  hwcr_outcome_code = 'REFRTOBIO';

UPDATE case_management.hwcr_outcome_code
SET
  short_description = 'Transferred to rehabilitation facility',
  long_description = 'Transferred to rehabilitation facility',
  display_order = 120,
  update_user_id = 'FLYWAY',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  hwcr_outcome_code = 'TRANSREHB';

UPDATE case_management.hwcr_outcome_code
SET
  display_order = 10,
  update_user_id = 'FLYWAY',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  hwcr_outcome_code = 'DEADONARR';

UPDATE case_management.hwcr_outcome_code
SET
  display_order = 40,
  update_user_id = 'FLYWAY',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  hwcr_outcome_code = 'DISPTCHD';

UPDATE case_management.hwcr_outcome_code
SET
  display_order = 70,
  update_user_id = 'FLYWAY',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  hwcr_outcome_code = 'EUTHNIZD';

UPDATE case_management.hwcr_outcome_code
SET
  display_order = 80,
  update_user_id = 'FLYWAY',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  hwcr_outcome_code = 'GONEONARR';

UPDATE case_management.hwcr_outcome_code
SET
  display_order = 90,
  update_user_id = 'FLYWAY',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  hwcr_outcome_code = 'NOTRCVD';

UPDATE case_management.hwcr_outcome_code
SET
  display_order = 100,
  update_user_id = 'FLYWAY',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  hwcr_outcome_code = 'RELSITE';

UPDATE case_management.hwcr_outcome_code
SET
  display_order = 110,
  update_user_id = 'FLYWAY',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  hwcr_outcome_code = 'SHRTRELOC';

UPDATE case_management.hwcr_outcome_code
SET
  display_order = 130,
  update_user_id = 'FLYWAY',
  update_utc_timestamp = CURRENT_TIMESTAMP
WHERE
  hwcr_outcome_code = 'TRANSLCTD';


DELETE FROM case_management.hwcr_outcome_code 
where hwcr_outcome_code IN ('EUTHCOS', 'DESTRYCOS', 'EUTHOTH', 'DESTRYOTH');

UPDATE case_management.hwcr_outcome_code
SET display_order=85, update_user_id='FLYWAY', update_utc_timestamp=CURRENT_TIMESTAMP
WHERE hwcr_outcome_code='LESSLETHAL';

UPDATE case_management.hwcr_outcome_code
SET display_order=95, update_user_id='FLYWAY', update_utc_timestamp=CURRENT_TIMESTAMP
WHERE hwcr_outcome_code='REFRTOBIO';



DELETE FROM case_management.hwcr_outcome_code 
where hwcr_outcome_code IN ('EUTHCOS', 'DESTRYCOS', 'EUTHOTH', 'DESTRYOTH');

UPDATE case_management.hwcr_outcome_code
SET display_order=85, update_user_id='FLYWAY', update_utc_timestamp=CURRENT_TIMESTAMP
WHERE hwcr_outcome_code='LESSLETHAL';

UPDATE case_management.hwcr_outcome_code
SET display_order=95, update_user_id='FLYWAY', update_utc_timestamp=CURRENT_TIMESTAMP
WHERE hwcr_outcome_code='REFRTOBIO';



DELETE FROM case_management.hwcr_outcome_code 
where hwcr_outcome_code IN ('EUTHCOS', 'DESTRYCOS', 'EUTHOTH', 'DESTRYOTH');

UPDATE case_management.hwcr_outcome_code
SET display_order=85, update_user_id='FLYWAY', update_utc_timestamp=CURRENT_TIMESTAMP
WHERE hwcr_outcome_code='LESSLETHAL';

UPDATE case_management.hwcr_outcome_code
SET display_order=95, update_user_id='FLYWAY', update_utc_timestamp=CURRENT_TIMESTAMP
WHERE hwcr_outcome_code='REFRTOBIO';


--------------------------
-- New Changes above this line
-------------------------
UPDATE case_management.configuration
SET
  configuration_value = cast(configuration_value as INTEGER) + 1
WHERE
  configuration_code = 'CDTABLEVER';