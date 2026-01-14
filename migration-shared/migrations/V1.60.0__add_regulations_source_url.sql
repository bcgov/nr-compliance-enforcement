ALTER TABLE shared.legislation_source
ADD COLUMN IF NOT EXISTS regulations_source_url VARCHAR(512);

COMMENT ON COLUMN shared.legislation_source.regulations_source_url IS
  'URL to the BC Laws Content API directory listing regulation documents for this Act';

UPDATE shared.legislation_source SET regulations_source_url = ''
WHERE short_description = 'Environmental Management Act';

UPDATE shared.legislation_source SET regulations_source_url = ''
WHERE short_description = 'Park Act';

ALTER TABLE legislation ALTER COLUMN section_title TYPE VARCHAR(256);

-- Environmental Management Act

UPDATE legislation_source
SET regulations_source_url = 'https://www.bclaws.gov.bc.ca/civix/content/complete/statreg/414786120/03053/reg03053'
WHERE short_description = 'Environmental Management Act';

-- Park Act

UPDATE legislation_source
SET regulations_source_url = 'https://www.bclaws.gov.bc.ca/civix/content/complete/statreg/1922970521/96344/reg96344'
WHERE short_description = 'Park Act';

-- Hertitage Act

INSERT INTO
  legislation_source (
    short_description,
    long_description,
    source_url,
    regulations_source_url,
    agency_code,
    active_ind,
    create_user_id
  )
VALUES
  (
    'Heritage Conservation Act',
    'British Columbia Heritage Conservation Act - [RSBC 1996] CHAPTER 187',
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96187_01/xml',
    'https://www.bclaws.gov.bc.ca/civix/content/complete/statreg/712470149/96187/reg96187',
    'COS',
    FALSE,
    'FLYWAY'
  );

INSERT INTO
  legislation_source (
    short_description,
    long_description,
    source_url,
    regulations_source_url,
    agency_code,
    active_ind,
    create_user_id
  )
VALUES
  (
    'Heritage Conservation Act',
    'British Columbia Heritage Conservation Act - [RSBC 1996] CHAPTER 187',
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96187_01/xml',
    'https://www.bclaws.gov.bc.ca/civix/content/complete/statreg/712470149/96187/reg96187',
    'NROS',
    FALSE,
    'FLYWAY'
  );

INSERT INTO
  legislation_source (
    short_description,
    long_description,
    source_url,
    regulations_source_url,
    agency_code,
    active_ind,
    create_user_id
  )
VALUES
  (
    'Heritage Conservation Act',
    'British Columbia Heritage Conservation Act - [RSBC 1996] CHAPTER 187',
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96187_01/xml',
    'https://www.bclaws.gov.bc.ca/civix/content/complete/statreg/712470149/96187/reg96187',
    'NRS',
    FALSE,
    'FLYWAY'
  );

-- Forest and Range Practices Act

INSERT INTO
  legislation_source (
    short_description,
    long_description,
    source_url,
    regulations_source_url,
    agency_code,
    active_ind,
    create_user_id
  )
VALUES
  (
    'Forest and Range Practices Act',
    'British Columbia Forest and Range Practices Act - [SBC 2002] Chapter 69',
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/02069_01/xml',
    'https://www.bclaws.gov.bc.ca/civix/content/complete/statreg/1198514681/02069/reg02069',
    'COS',
    FALSE,
    'FLYWAY'
  );

INSERT INTO
  legislation_source (
    short_description,
    long_description,
    source_url,
    regulations_source_url,
    agency_code,
    active_ind,
    create_user_id
  )
VALUES
  (
    'Forest and Range Practices Act',
    'British Columbia Forest and Range Practices Act - [SBC 2002] Chapter 69',
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/02069_01/xml',
    'https://www.bclaws.gov.bc.ca/civix/content/complete/statreg/1198514681/02069/reg02069',
    'NROS',
    FALSE,
    'FLYWAY'
  );

-- Wildfire Act

INSERT INTO
  legislation_source (
    short_description,
    long_description,
    source_url,
    regulations_source_url,
    agency_code,
    active_ind,
    create_user_id
  )
VALUES
  (
    'Wildfire Act',
    'British Columbia Wildfire Act - [SBC 2004] Chapter 31',
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/04031_01/xml',
    'https://www.bclaws.gov.bc.ca/civix/content/complete/statreg/901199259/04031/reg04031',
    'COS',
    FALSE,
    'FLYWAY'
  );

INSERT INTO
  legislation_source (
    short_description,
    long_description,
    source_url,
    regulations_source_url,
    agency_code,
    active_ind,
    create_user_id
  )
VALUES
  (
    'Wildfire Act',
    'British Columbia Wildfire Act - [SBC 2004] Chapter 31',
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/04031_01/xml',
    'https://www.bclaws.gov.bc.ca/civix/content/complete/statreg/901199259/04031/reg04031',
    'NROS',
    FALSE,
    'FLYWAY'
  );

-- Land Act

INSERT INTO
  legislation_source (
    short_description,
    long_description,
    source_url,
    regulations_source_url,
    agency_code,
    active_ind,
    create_user_id
  )
VALUES
  (
    'Land Act',
    'British Columbia Land Act - [RSBC 1996] CHAPTER 245',
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96245_01/xml',
    'https://www.bclaws.gov.bc.ca/civix/content/complete/statreg/76470131/96245/reg96245',
    'COS',
    FALSE,
    'FLYWAY'
  );

INSERT INTO
  legislation_source (
    short_description,
    long_description,
    source_url,
    regulations_source_url,
    agency_code,
    active_ind,
    create_user_id
  )
VALUES
  (
    'Land Act',
    'British Columbia Land Act - [RSBC 1996] CHAPTER 245',
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96245_01/xml',
    'https://www.bclaws.gov.bc.ca/civix/content/complete/statreg/76470131/96245/reg96245',
    'NROS',
    FALSE,
    'FLYWAY'
  );

-- Wildlife Act

INSERT INTO
  legislation_source (
    short_description,
    long_description,
    source_url,
    regulations_source_url,
    agency_code,
    active_ind,
    create_user_id
  )
VALUES
  (
    'Wildlife Act',
    'British Columbia Wildlife Act - [RSBC 1996] CHAPTER 488',
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96488_01/xml',
    'https://www.bclaws.gov.bc.ca/civix/content/complete/statreg/901199259/96488/reg96488',
    'COS',
    FALSE,
    'FLYWAY'
  );

INSERT INTO
  legislation_source (
    short_description,
    long_description,
    source_url,
    regulations_source_url,
    agency_code,
    active_ind,
    create_user_id
  )
VALUES
  (
    'Wildlife Act',
    'British Columbia Wildlife Act - [RSBC 1996] CHAPTER 488',
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96488_01/xml',
    'https://www.bclaws.gov.bc.ca/civix/content/complete/statreg/901199259/96488/reg96488',
    'NROS',
    FALSE,
    'FLYWAY'
  );

-- Mines Act

INSERT INTO
  legislation_source (
    short_description,
    long_description,
    source_url,
    regulations_source_url,
    agency_code,
    active_ind,
    create_user_id
  )
VALUES
  (
    'Mines Act',
    'British Columbia Mines Act - [RSBC 1996] CHAPTER 293',
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96293_01/xml',
    'https://www.bclaws.gov.bc.ca/civix/content/complete/statreg/1325524918/96293/reg96293',
    'COS',
    FALSE,
    'FLYWAY'
  );

INSERT INTO
  legislation_source (
    short_description,
    long_description,
    source_url,
    regulations_source_url,
    agency_code,
    active_ind,
    create_user_id
  )
VALUES
  (
    'Mines Act',
    'British Columbia Mines Act - [RSBC 1996] CHAPTER 293',
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96293_01/xml',
    'https://www.bclaws.gov.bc.ca/civix/content/complete/statreg/1325524918/96293/reg96293',
    'NRS',
    FALSE,
    'FLYWAY'
  );

-- Water Sustainability Act

INSERT INTO
  legislation_source (
    short_description,
    long_description,
    source_url,
    regulations_source_url,
    agency_code,
    active_ind,
    create_user_id
  )
VALUES
  (
    'Water Sustainability Act',
    'British Columbia Water Sustainability Act - [SBC 2014] Chapter 15',
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/14015/xml',
    'https://www.bclaws.gov.bc.ca/civix/content/complete/statreg/901199259/1401584569/67751641',
    'COS',
    FALSE,
    'FLYWAY'
  );

INSERT INTO
  legislation_source (
    short_description,
    long_description,
    source_url,
    regulations_source_url,
    agency_code,
    active_ind,
    create_user_id
  )
VALUES
  (
    'Water Sustainability Act',
    'British Columbia Water Sustainability Act - [SBC 2014] Chapter 15',
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/14015/xml',
    'https://www.bclaws.gov.bc.ca/civix/content/complete/statreg/901199259/1401584569/67751641',
    'NROS',
    FALSE,
    'FLYWAY'
  );

--- Forest Act

INSERT INTO
  legislation_source (
    short_description,
    long_description,
    source_url,
    regulations_source_url,
    agency_code,
    active_ind,
    create_user_id
  )
VALUES
  (
    'Forest Act',
    'British Columbia Forest Act - [RSBC 1996] CHAPTER 157',
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96157_00_multi/xml',
    'https://www.bclaws.gov.bc.ca/civix/content/complete/statreg/1198514681/96157/reg96157',
    'COS',
    FALSE,
    'FLYWAY'
  );

INSERT INTO
  legislation_source (
    short_description,
    long_description,
    source_url,
    regulations_source_url,
    agency_code,
    active_ind,
    create_user_id
  )
VALUES
  (
    'Forest Act',
    'British Columbia Forest Act - [RSBC 1996] CHAPTER 157',
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96157_00_multi/xml',
    'https://www.bclaws.gov.bc.ca/civix/content/complete/statreg/1198514681/96157/reg96157',
    'NROS',
    FALSE,
    'FLYWAY'
  );

