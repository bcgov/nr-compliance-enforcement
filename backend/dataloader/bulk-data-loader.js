// Instruction for running: from backend directory: node dataloader/bulk-data-loader.js
// Ensure parameters at the bottom of this file are updated as required
require('dotenv').config();
const faker = require('faker');
const db = require('pg-promise')();
const regions = require('./location-enum');

// Database connection setup
const connection = {
  host: process.env.COMPLAINT_POSTGRESQL_HOST,
  port: 5432,
  database: process.env.COMPLAINT_POSTGRESQL_DATABASE,
  user: process.env.COMPLAINT_POSTGRESQL_USER,
  password: process.env.COMPLAINT_POSTGRESQL_PASSWORD,
};

const pg = db(connection);

// Function to generate a random latitude within the specified range
// Params:
//    min: the minimum latitude
//    max: the maximum latitude
const generateLatitude = (min, max) => {
  return faker.datatype.number({ min: min * 10000, max: max * 10000 }) / 10000;
};

// Function to generate a random longitude within the specified range
// Params:
//    min: the minimum longitude
//    max: the maximum longitude
const generateLongitude = (min, max) => {
  return faker.datatype.number({ min: min * 10000, max: max * 10000 }) / 10000;
};

// Randomly selects a region, a zone within that region, a district within that zone and a community.
// Driven from location-enum.js that is a subset of the location view
// this could be updated to pull from the database in the future
const getRandomLocation = () => {
  // Randomly select a region
  const regionKeys = Object.keys(regions);
  const region = faker.random.arrayElement(regionKeys);

  // Randomly select a zone within that region
  const zoneKeys = Object.keys(regions[region].zones);
  const zone = faker.random.arrayElement(zoneKeys);

  // Randomly select a district within that zone
  const districtKeys = Object.keys(regions[region].zones[zone].districts);
  const district = faker.random.arrayElement(districtKeys);

  // Randomly select a community within that district
  const communities = regions[region].zones[zone].districts[district];
  const community = faker.random.arrayElement(communities);

  return { region, zone, district, community };
};

// Helper for generating random location (region, zone, district, community)
const generateLocation = () => {
  const { region, zone, district, community } = getRandomLocation(); // Reuse the earlier location function
  return { region, zone, district, community };
};

// Helper for generating common fields
// Params:
//    complaint_identifier = the identifer to use for the complaint
const generateCommonFields = (complaint_identifier) => {
  const { region, zone, district, community } = generateLocation();  // Get location from helper

  return {
    tablename: 'Conservation Officer Service Table',
    dataid: faker.datatype.number(),
    username: faker.internet.userName(),
    positionname: 'ECC COS_test',
    entrydate: faker.date.recent().toISOString(),
    prevdataid: '0',
    created_by_datetime: faker.date.recent().toISOString(),
    incident_number: complaint_identifier,
    incident_datetime: faker.date.recent().toISOString(),
    cos_area_community: community,
    cos_district: district,
    cos_zone: zone,
    cos_region: region,
    status: faker.random.arrayElement(['Open', 'Closed', 'Closed', 'Closed', 'Closed', 'Closed', 'Closed', 'Closed', 'Closed', 'Closed' ]), //Close 90% of complaints
    address: faker.address.streetAddress(),
    address_coordinates_lat: generateLatitude(48.2513, 60.0).toString(),
    address_coordinates_long: generateLongitude(-139.0596, -114.0337).toString(),
    cos_location_description: faker.lorem.sentence(),
    cos_caller_name: faker.name.findName(),
    cos_caller_email: faker.internet.email(),
    caller_address: faker.address.streetAddress(),
    cos_call_details: faker.lorem.paragraph(),
    created_by_position: 'ECC COS_test',
    created_by_username: faker.internet.userName(),
    back_number_of_days: faker.datatype.number({ min: 0, max: 365 }).toString(),
    back_number_of_hours: faker.datatype.number({ min: 0, max: 24 }).toString(),
    back_number_of_minutes: faker.datatype.number({ min: 0, max: 60 }).toString(),
    flag_COS: faker.random.arrayElement(['Yes', 'No']),
    flag_AT: faker.random.arrayElement(['Yes', 'No']),
    flag_UAT: faker.random.arrayElement(['Yes', 'No']),
  };
};

// Function to generate a single Complaint record - Note optional fields are not included in order to keep payload size down
// Params:
//    complaint_identifier = the identifer to use for the complaint
const generateHWCRData = (complaint_identifier) => {
  
  const commonFields = generateCommonFields(complaint_identifier);  // Get common fields

  return {
    ...commonFields,
    report_type: 'HWCR',
    nature_of_complaint: faker.random.arrayElement(['Sightings', 'Food Conditioned', 'Confined', 'Human injury/death', 'Wildlife in trap']),
    species: faker.random.arrayElement(['Black bear', 'Deer', 'Wolf', 'Moose', 'Cougar', 'Wolverine', 'Elk', 'Rattlesnake']),
    attractants_list: faker.random.arrayElement(['BBQ', 'Crops', 'Pet Food', 'Beehive', 'Freezer', 'Pets', 'Garbage', 'Industrial Camp']),
  };
};

// Function to generate a single Complaint record - Note optional fields are not included in order to keep payload size down
// Params:
//    complaint_identifier = the identifer to use for the complaint
const generateERSData = (complaint_identifier, owner) => {

  const commonFields = generateCommonFields(complaint_identifier);  // Get common fields
  let violationType = faker.random.arrayElement(['Boating', 'Dumping', 'Fisheries ', 'Open Burning', 'Off-road vehicles (ORV)', 'Aquatic: Invasive Species'])

  if(owner === 'CEEB') {
    violationType = faker.random.arrayElement(['Waste', 'Pesticide'])
  }

  return {
    ...commonFields,
    report_type: 'ERS',
    violation_type: violationType,
    suspect_details: faker.lorem.paragraph(),
    observe_violation: faker.random.arrayElement(['Yes', 'No']),
    violation_in_progress: faker.random.arrayElement(['Yes', 'No']),
  };
};

// Function to generate a single Complaint record - Note optional fields are not included in order to keep payload size down
// Params:
//    complaint_identifier = the identifer to use for the complaint
const generateGIRData = (complaint_identifier) => {

  const commonFields = generateCommonFields(complaint_identifier);  // Get common fields

return {
  ...commonFields,
  report_type: 'GIR',
  call_type_gir: faker.random.arrayElement(['Contact', 'Disposition', 'General Advice', 'Media', 'Query']),
};
};

// Function to generate bulk data.  Sequentially inserts complaints starting at a given number: HWCRs first, then ERS, the CEEB ERS, finally GIRs
// Params:
//    year = the year prefix for the complaint
//    num = the number of complaints to generate
//    startingRecord = the sequence number to start at
const generateBulkData = (year, num, startingRecord) => {
  let bulkData = [];

  //Distrubte the counts according to a realistic business breakdown
  const HWCRcount = num*0.7;
  const ERScountCOS = num*0.15;
  const ERScountCEEB = num*0.10;
  const GIRcount = num*0.05;

  for (let i = 0; i < HWCRcount; i++) {
    let identifer = i + startingRecord;
    let complaint_identifier = `${year}-${identifer.toString().padStart(6, '0')}`;
    if(i === 0) {
      console.log (`HWCR Complaint Series starts at: ${complaint_identifier}`)
    }
    bulkData.push(generateHWCRData(complaint_identifier));
  }
  for (let i = 0; i < ERScountCOS; i++) {
    let identifer = i + startingRecord + HWCRcount;  // Add Starting Record and HWCRcount to i
    let complaint_identifier = `${year}-${identifer.toString().padStart(6, '0')}`;
    if(i === 0) {
      console.log (`COS ERS Complaint Series starts at: ${complaint_identifier}`)
    }
    bulkData.push(generateERSData(complaint_identifier, 'COS'));
  }
  for (let i = 0; i < ERScountCEEB; i++) {
    let identifer = i + startingRecord+ HWCRcount + ERScountCOS;  // Add Starting Record, HWCRcount and ERScountCOS to i
    let complaint_identifier = `${year}-${identifer.toString().padStart(6, '0')}`;
    if(i === 0) {
      console.log (`CEEB ERS Complaint Series starts at: ${complaint_identifier}`)
    }
    bulkData.push(generateERSData(complaint_identifier, 'CEEB'));
  }
  for (let i = 0; i < GIRcount; i++) {
    let identifer = i + startingRecord + HWCRcount + ERScountCOS + ERScountCEEB;  // Add Starting Record, HWCRcount and both ERScounts to i
    let complaint_identifier = `${year}-${identifer.toString().padStart(6, '0')}`;
    if(i === 0) {
      console.log (`GIR Complaint Series starts at: ${complaint_identifier}`)
    }
    bulkData.push(generateGIRData(complaint_identifier));
  }
  return bulkData;
};

// Uses bulk insert statements to put all the data into a single statement.  Limit of 10K records
// Params:
//    data = all the data to insert
const insertData = async (data) => {
  // Create an insert query with placeholders for each value 
  const insertQuery = `
    INSERT INTO complaint.staging_complaint (
      staging_complaint_guid, 
      staging_status_code, 
      staging_activity_code,
      complaint_identifier, 
      complaint_jsonb, 
      create_user_id, 
      create_utc_timestamp, 
      update_user_id, 
      update_utc_timestamp
    ) 
    VALUES
    ${data.map((_, i) => `($${i * 9 + 1}, $${i * 9 + 2}, $${i * 9 + 3}, $${i * 9 + 4}, $${i * 9 + 5}, $${i * 9 + 6}, $${i * 9 + 7}, $${i * 9 + 8}, $${i * 9 + 9})`).join(',')}
  `;

  const queryValues = data.flatMap((item) => {
    const currentTimestamp = new Date().toISOString(); // Get the current timestamp

    return [
      faker.datatype.uuid(),  // Unique ID for the complaint (staging_complaint_guid)
      'PENDING',              // Placeholder for status (staging_status_code)
      'INSERT',               // Placeholder for activity (staging_activity_code)
      item.incident_number,   // Complaint identifier
      item,                   // Complaint JSON data
      'Bulk Data Load',       // Created by user ID
      currentTimestamp,       // Created timestamp
      'Bulk Data Load',       // Updated by user ID
      currentTimestamp        // Updated timestamp
    ];
  });

  try {
    // Perform the bulk insert
    await pg.none(insertQuery, queryValues);
    console.log('Data insertion complete.');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
};

// Process any pending complaints
const processPendingComplaints = async () => {
  const query = `DO $do$
    DECLARE
      complaint_record RECORD;
    BEGIN
      -- Loop through each pending complaint
      FOR complaint_record IN
          SELECT complaint_identifier
          FROM complaint.staging_complaint
          WHERE staging_status_code = 'PENDING'
      LOOP
          -- Call the insert_complaint_from_staging function for each complaint
          PERFORM complaint.insert_complaint_from_staging(complaint_record.complaint_identifier);
      END LOOP;
    
      TRUNCATE TABLE complaint.staging_complaint;

      -- Optional: Add a message indicating completion
      RAISE NOTICE 'All pending complaints processed successfully.';
    END;
    $do$;`;
    
  try {
    // Perform the bulk insert
    await pg.none(query);
    console.log('Data processing complete.');
  } catch (error) {
    console.error('Error processing data:', error);
  }
};

// populates the entities the search joins (updates, actions, referrals, links)
// ---------------------------------------------------------------------------------------

// simple logging
const run = async (label, sql) => {
  try {
    await pg.none(sql);
    console.log(`  ✓ ${label}`);
  } catch (error) {
    console.error(`  ✗ ${label}:`, error.message || error);
    throw error;
  }
};

// Seed a pool of app_users
const seedAppUsers = async (poolSize) =>
  run(`seed ${poolSize} app_users`, `
    INSERT INTO shared.app_user
      (app_user_guid, auth_user_guid, user_id, first_name, last_name, agency_code_ref,
       create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
    SELECT public.uuid_generate_v4(), public.uuid_generate_v4(), 'perfuser' || g,
           'First' || g, 'Last' || g,
           (ARRAY['COS','EPO','NROS','MINES'])[1 + floor(random() * 4)::int],
           'Bulk Data Load', now(), 'Bulk Data Load', now()
    FROM generate_series(1, ${poolSize}) AS g
    WHERE NOT EXISTS (SELECT 1 FROM shared.app_user au WHERE au.user_id = 'perfuser' || g);
  `);

// change distribution for CEEB complaints
const redistributeAgenciesAndStatus = async (closedFraction) => {
  await run("redistribute CEEB ownership across EPO/NROS/MINES", `
    UPDATE complaint.complaint
    SET    owned_by_agency_code_ref = (ARRAY['EPO','NROS','MINES'])[1 + (abs(hashtext(complaint_identifier)) % 3)]
    WHERE  owned_by_agency_code_ref = 'EPO';
  `);
  await run(`close ~${Math.round(closedFraction * 100)}% of CEEB complaints`, `
    UPDATE complaint.complaint
    SET    complaint_status_code = 'CLOSED'
    WHERE  owned_by_agency_code_ref IN ('EPO','NROS','MINES')
      AND  complaint_status_code = 'OPEN'
      AND  (abs(hashtext(complaint_identifier)) % 100) < ${Math.round(closedFraction * 100)};
  `);
};

// Assign a user for each complaint
const assignAssignees = async () =>
  run("assign one ASSIGNEE per complaint", `
    DO $do$
    DECLARE
      user_ids uuid[];
      n int;
    BEGIN
      SELECT array_agg(app_user_guid) INTO user_ids FROM shared.app_user WHERE user_id LIKE 'perfuser%';
      n := array_length(user_ids, 1);
      IF n IS NULL THEN RAISE EXCEPTION 'No perf app_users found - run seedAppUsers first'; END IF;

      INSERT INTO complaint.app_user_complaint_xref
        (app_user_complaint_xref_guid, complaint_identifier, app_user_complaint_xref_code,
         app_user_guid_ref, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp, active_ind)
      SELECT public.uuid_generate_v4(), c.complaint_identifier, 'ASSIGNEE', u.g,
             'Bulk Data Load', now(), 'Bulk Data Load', now(), true
      FROM complaint.complaint c
      CROSS JOIN LATERAL (SELECT user_ids[1 + floor(random() * n)::int] AS g) u
      WHERE NOT EXISTS (
        SELECT 1 FROM complaint.app_user_complaint_xref x WHERE x.complaint_identifier = c.complaint_identifier
      );
    END $do$;
  `);

// Assign a collaborator for some complaints
const assignCollaborators = async (fraction) =>
  run(`add COLLABORAT to ~${Math.round(fraction * 100)}% of complaints`, `
    DO $do$
    DECLARE
      user_ids uuid[];
      n int;
    BEGIN
      SELECT array_agg(app_user_guid) INTO user_ids FROM shared.app_user WHERE user_id LIKE 'perfuser%';
      n := array_length(user_ids, 1);
      IF n IS NULL THEN RAISE EXCEPTION 'No perf app_users found - run seedAppUsers first'; END IF;

      INSERT INTO complaint.app_user_complaint_xref
        (app_user_complaint_xref_guid, complaint_identifier, app_user_complaint_xref_code,
         app_user_guid_ref, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp, active_ind)
      SELECT public.uuid_generate_v4(), c.complaint_identifier, 'COLLABORAT', u.g,
             'Bulk Data Load', now(), 'Bulk Data Load', now(), true
      FROM complaint.complaint c
      CROSS JOIN LATERAL (SELECT user_ids[1 + floor(random() * n)::int] AS g) u
      WHERE random() < ${fraction}
        AND NOT EXISTS (
          SELECT 1 FROM complaint.app_user_complaint_xref x
          WHERE x.complaint_identifier = c.complaint_identifier AND x.app_user_complaint_xref_code = 'COLLABORAT'
        );
    END $do$;
  `);

// Create updates
const addUpdates = async (maxUpdates) =>
  run(`add 0-${maxUpdates} complaint_update rows per complaint`, `
    INSERT INTO complaint.complaint_update
      (complaint_update_guid, complaint_identifier, update_seq_number, upd_detail_text,
       create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
    SELECT public.uuid_generate_v4(), c.complaint_identifier, gs.seq,
           'Bulk update ' || gs.seq || ' for ' || c.complaint_identifier || ' ' || md5(random()::text),
           'Bulk Data Load', now(), 'Bulk Data Load', now()
    FROM complaint.complaint c
    CROSS JOIN LATERAL generate_series(1, floor(random() * ${maxUpdates + 1})::int) AS gs(seq)
    WHERE NOT EXISTS (SELECT 1 FROM complaint.complaint_update u WHERE u.complaint_identifier = c.complaint_identifier);
  `);

// Create actions 
const addActions = async (maxActions) =>
  run(`add 0-${maxActions} action_taken rows per complaint`, `
    INSERT INTO complaint.action_taken
      (action_taken_guid, complaint_identifier, action_details_txt, logged_by_txt, action_utc_timestamp,
       create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
    SELECT public.uuid_generate_v4(), c.complaint_identifier,
           'Bulk action ' || gs.seq || ' ' || md5(random()::text), 'Bulk Loader', now(),
           'Bulk Data Load', now(), 'Bulk Data Load', now()
    FROM complaint.complaint c
    CROSS JOIN LATERAL generate_series(1, floor(random() * ${maxActions + 1})::int) AS gs(seq)
    WHERE NOT EXISTS (SELECT 1 FROM complaint.action_taken a WHERE a.complaint_identifier = c.complaint_identifier);
  `);

// Create some referrals
const addReferrals = async (fraction) =>
  run(`add referrals to ~${Math.round(fraction * 100)}% of complaints`, `
    DO $do$
    DECLARE
      user_ids uuid[];
      n int;
    BEGIN
      SELECT array_agg(app_user_guid) INTO user_ids FROM shared.app_user WHERE user_id LIKE 'perfuser%';
      n := array_length(user_ids, 1);
      IF n IS NULL THEN RAISE EXCEPTION 'No perf app_users found - run seedAppUsers first'; END IF;

      INSERT INTO complaint.complaint_referral
        (complaint_referral_guid, complaint_identifier, referred_by_agency_code_ref, referred_to_agency_code_ref,
         referral_date, referral_reason, create_user_id, create_utc_timestamp,
         update_user_id, update_utc_timestamp, active_ind, app_user_guid_ref)
      SELECT public.uuid_generate_v4(), c.complaint_identifier,
             (ARRAY['COS','EPO','NROS','MINES'])[1 + floor(random() * 4)::int],
             (ARRAY['COS','EPO','NROS','MINES'])[1 + floor(random() * 4)::int],
             now(), 'Bulk referral ' || md5(random()::text),
             'Bulk Data Load', now(), 'Bulk Data Load', now(), true, u.g
      FROM complaint.complaint c
      CROSS JOIN LATERAL (SELECT user_ids[1 + floor(random() * n)::int] AS g) u
      WHERE random() < ${fraction}
        AND NOT EXISTS (SELECT 1 FROM complaint.complaint_referral r WHERE r.complaint_identifier = c.complaint_identifier);
    END $do$;
  `);

// Link some complaints
const addLinks = async (fraction) =>
  run(`link ~${Math.round(fraction * 100)}% of complaints to another complaint`, `
    DO $do$
    DECLARE
      ids varchar[];
      n int;
    BEGIN
      SELECT array_agg(complaint_identifier) INTO ids
      FROM (SELECT complaint_identifier FROM complaint.complaint ORDER BY random() LIMIT 5000) s;
      n := array_length(ids, 1);
      IF n IS NULL THEN RETURN; END IF;

      INSERT INTO complaint.linked_complaint_xref
        (linked_complaint_xref_guid, complaint_identifier, linked_complaint_identifier, active_ind, link_type,
         create_user_id, create_utc_timestamp)
      SELECT public.uuid_generate_v4(), c.complaint_identifier, t.lid, true, 'DUPLICATE', 'Bulk Data Load', now()
      FROM complaint.complaint c
      CROSS JOIN LATERAL (SELECT ids[1 + floor(random() * n)::int] AS lid) t
      WHERE random() < ${fraction}
        AND t.lid <> c.complaint_identifier
        AND NOT EXISTS (SELECT 1 FROM complaint.linked_complaint_xref l WHERE l.complaint_identifier = c.complaint_identifier);
    END $do$;
  `);

// Add outcomes
const addComplaintOutcomes = async (fraction) => {
  const pct = Math.round(fraction * 100);
  // one outcome per selected complaint
  await run(`add complaint_outcome to ~${pct}% of complaints`, `
    INSERT INTO complaint_outcome.complaint_outcome
      (complaint_outcome_guid, complaint_identifier, owned_by_agency_code, create_user_id, create_utc_timestamp)
    SELECT public.uuid_generate_v4(), c.complaint_identifier, c.owned_by_agency_code_ref, 'Bulk Data Load', now()
    FROM complaint.complaint c
    WHERE (abs(hashtext(c.complaint_identifier)) % 100) < ${pct}
      AND NOT EXISTS (SELECT 1 FROM complaint_outcome.complaint_outcome o WHERE o.complaint_identifier = c.complaint_identifier);
  `);

  await run("add complaint_outcome.authorization_permit", `
    INSERT INTO complaint_outcome.authorization_permit
      (complaint_outcome_guid, authorization_permit_id, create_user_id, create_utc_timestamp)
    SELECT co.complaint_outcome_guid, 'AUTH-' || substr(md5(co.complaint_outcome_guid::text), 1, 8), 'Bulk Data Load', now()
    FROM complaint_outcome.complaint_outcome co
    WHERE (abs(hashtext(co.complaint_outcome_guid::text || 'auth')) % 100) < 50
      AND NOT EXISTS (SELECT 1 FROM complaint_outcome.authorization_permit x WHERE x.complaint_outcome_guid = co.complaint_outcome_guid);
  `);

  await run("add complaint_outcome.action", `
    INSERT INTO complaint_outcome.action
      (complaint_outcome_guid, action_type_action_xref_guid, actor_guid, action_date, create_user_id, create_utc_timestamp)
    SELECT co.complaint_outcome_guid,
           (SELECT action_type_action_xref_guid FROM complaint_outcome.action_type_action_xref LIMIT 1),
           public.uuid_generate_v4(), now(), 'Bulk Data Load', now()
    FROM complaint_outcome.complaint_outcome co
    CROSS JOIN LATERAL generate_series(1, (abs(hashtext(co.complaint_outcome_guid::text || 'action')) % 3)) gs
    WHERE NOT EXISTS (SELECT 1 FROM complaint_outcome.action x WHERE x.complaint_outcome_guid = co.complaint_outcome_guid);
  `);

  await run("add complaint_outcome.assessment", `
    INSERT INTO complaint_outcome.assessment
      (complaint_outcome_guid, outcome_agency_code, create_user_id, create_utc_timestamp)
    SELECT co.complaint_outcome_guid, co.owned_by_agency_code, 'Bulk Data Load', now()
    FROM complaint_outcome.complaint_outcome co
    WHERE (abs(hashtext(co.complaint_outcome_guid::text || 'assess')) % 100) < 40
      AND NOT EXISTS (SELECT 1 FROM complaint_outcome.assessment x WHERE x.complaint_outcome_guid = co.complaint_outcome_guid);
  `);

  await run("add complaint_outcome.case_note", `
    INSERT INTO complaint_outcome.case_note
      (complaint_outcome_guid, case_note, outcome_agency_code, create_user_id, create_utc_timestamp)
    SELECT co.complaint_outcome_guid, 'Bulk note ' || gs || ' ' || md5(random()::text), co.owned_by_agency_code, 'Bulk Data Load', now()
    FROM complaint_outcome.complaint_outcome co
    CROSS JOIN LATERAL generate_series(1, (abs(hashtext(co.complaint_outcome_guid::text || 'note')) % 3)) gs
    WHERE NOT EXISTS (SELECT 1 FROM complaint_outcome.case_note x WHERE x.complaint_outcome_guid = co.complaint_outcome_guid);
  `);

  await run("add complaint_outcome.decision", `
    INSERT INTO complaint_outcome.decision
      (complaint_outcome_guid, schedule_sector_xref_guid, discharge_code, active_ind,
       create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
    SELECT co.complaint_outcome_guid,
           (SELECT schedule_sector_xref_guid FROM complaint_outcome.schedule_sector_xref LIMIT 1),
           'NONE', true, 'Bulk Data Load', now(), 'Bulk Data Load', now()
    FROM complaint_outcome.complaint_outcome co
    WHERE (abs(hashtext(co.complaint_outcome_guid::text || 'decision')) % 100) < 30
      AND NOT EXISTS (SELECT 1 FROM complaint_outcome.decision x WHERE x.complaint_outcome_guid = co.complaint_outcome_guid);
  `);

  await run("add complaint_outcome.prevention_education", `
    INSERT INTO complaint_outcome.prevention_education
      (complaint_outcome_guid, outcome_agency_code, create_user_id, create_utc_timestamp)
    SELECT co.complaint_outcome_guid, co.owned_by_agency_code, 'Bulk Data Load', now()
    FROM complaint_outcome.complaint_outcome co
    WHERE (abs(hashtext(co.complaint_outcome_guid::text || 'preved')) % 100) < 20
      AND NOT EXISTS (SELECT 1 FROM complaint_outcome.prevention_education x WHERE x.complaint_outcome_guid = co.complaint_outcome_guid);
  `);

  await run("add complaint_outcome.site", `
    INSERT INTO complaint_outcome.site
      (complaint_outcome_guid, site_id, create_user_id, create_utc_timestamp)
    SELECT co.complaint_outcome_guid, 'SITE-' || substr(md5(co.complaint_outcome_guid::text), 1, 8), 'Bulk Data Load', now()
    FROM complaint_outcome.complaint_outcome co
    WHERE (abs(hashtext(co.complaint_outcome_guid::text || 'site')) % 100) < 30
      AND NOT EXISTS (SELECT 1 FROM complaint_outcome.site x WHERE x.complaint_outcome_guid = co.complaint_outcome_guid);
  `);

  await run("add complaint_outcome.wildlife", `
    INSERT INTO complaint_outcome.wildlife
      (complaint_outcome_guid, species_code, create_user_id, create_utc_timestamp, update_user_id, update_utc_timestamp)
    SELECT co.complaint_outcome_guid, 'BISON', 'Bulk Data Load', now(), 'Bulk Data Load', now()
    FROM complaint_outcome.complaint_outcome co
    WHERE (abs(hashtext(co.complaint_outcome_guid::text || 'wildlife')) % 100) < 30
      AND NOT EXISTS (SELECT 1 FROM complaint_outcome.wildlife x WHERE x.complaint_outcome_guid = co.complaint_outcome_guid);
  `);
};

// Refresh statistics
const analyzeTables = async () => {
  const tables = [
    "complaint.complaint",
    "complaint.complaint_update",
    "complaint.action_taken",
    "complaint.app_user_complaint_xref",
    "complaint.complaint_referral",
    "complaint.linked_complaint_xref",
    "shared.app_user",
    "complaint_outcome.complaint_outcome",
    "complaint_outcome.action",
    "complaint_outcome.assessment",
    "complaint_outcome.authorization_permit",
    "complaint_outcome.case_note",
    "complaint_outcome.decision",
    "complaint_outcome.prevention_education",
    "complaint_outcome.site",
    "complaint_outcome.wildlife",
  ];
  for (const table of tables) {
    await run(`ANALYZE ${table}`, `ANALYZE ${table};`);
  }
};

// Add related data to complaints
const addRelatedData = async (cfg) => {
  console.log("Adding related data");
  await seedAppUsers(cfg.userPoolSize);
  await redistributeAgenciesAndStatus(cfg.ceebClosedFraction);
  await assignAssignees();
  await assignCollaborators(cfg.collaboratorFraction);
  await addUpdates(cfg.maxUpdatesPerComplaint);
  await addActions(cfg.maxActionsPerComplaint);
  await addReferrals(cfg.referralFraction);
  await addLinks(cfg.linkFraction);
  await addComplaintOutcomes(cfg.outcomeFraction);
  await analyzeTables();
  console.log("Related data add complete.");
};

const bulkDataLoad = async () => {

  // Adjust these as required.
  const processAfterInsert = true // Will move complaints from staging to the live table after each iteration
  const numRecords = 10000; // Records created per iteration, no more than 10k at a time or the insert will blow up.
  const yearPrefix = 35; // bumped past existing years 10-34 so the next 250k don't collide
  const startingRecord = 100000;
  const iterations = 25; // 25 x 10k = 250k base complaints. Raise for a heavier dataset (<= 100 keeps under 1M).

  // Ratios for related data, adjust as required.
  const relatedDataConfig = {
    userPoolSize: 250,
    ceebClosedFraction: 0.5, // portion of CEEB complaints flipped to CLOSED (rest stay OPEN)
    collaboratorFraction: 0.3,
    maxUpdatesPerComplaint: 8,
    maxActionsPerComplaint: 5,
    referralFraction: 0.2,
    linkFraction: 0.05,
    outcomeFraction: 0.5, // portion of complaints given a complaint_outcome (+ child rows)
  };

  // Validate parameters
  if (numRecords > 10000) {
    console.log ("Please adjust the numRecords parameter to be less than 10000");
    return;
  }
  if (iterations * numRecords > 1000000) {
    console.log ("Please adjust the iterations so that fewer than 1000000 records are inserted");
    return;
  }

  for (let i = 0; i < iterations; i++) {
    const startingOffset = startingRecord + (i * numRecords);
    const records = generateBulkData(yearPrefix + i, numRecords, startingOffset);
    // Insert the staging data
    await insertData(records);
    // Process the staging data
    if (processAfterInsert)
    {
      await processPendingComplaints();
    }
    console.log(`Inserted records ${startingOffset} through ${startingOffset + numRecords}.`);
  }

  await addRelatedData(relatedDataConfig);

  await pg.$pool.end();
};

bulkDataLoad();
