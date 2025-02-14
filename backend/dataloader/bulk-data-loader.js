// Instruction for running: from backend directory: node dataloader/bulk-data-loader.js
// Ensure parameters at the bottom of this file are updated as required
require('dotenv').config();
const faker = require('faker');
const db = require('pg-promise')();
const regions = require('./location-enum');

// Database connection setup
const connection = {
  host: process.env.POSTGRESQL_HOST,
  port: 5432,
  database: process.env.POSTGRESQL_DATABASE,
  user: process.env.POSTGRESQL_USER,
  password: process.env.POSTGRESQL_PASSWORD,
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
  call_type_gir: faker.random.arrayElement(['CO Contact', 'CO Disposition', 'General Advice', 'Media', 'Query']),
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
    INSERT INTO staging_complaint (
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
  const query = `DO $$
    DECLARE
      complaint_record RECORD;
    BEGIN
      -- Loop through each pending complaint
      FOR complaint_record IN
          SELECT complaint_identifier
          FROM staging_complaint
          WHERE staging_status_code = 'PENDING'
      LOOP
          -- Call the insert_complaint_from_staging function for each complaint
          PERFORM public.insert_complaint_from_staging(complaint_record.complaint_identifier);
      END LOOP;
    
      TRUNCATE TABLE staging_complaint;

      -- Optional: Add a message indicating completion
      RAISE NOTICE 'All pending complaints processed successfully.';
    END;
    $$;`;
    
  try {
    // Perform the bulk insert
    await pg.none(query);
    console.log('Data processing complete.');
  } catch (error) {
    console.error('Error processing data:', error);
  }
};

const bulkDataLoad = async () => {

  // Adjust these as required.
  const processAfterInsert = true // Will move complaints from staging to the live table after each iteration
  const numRecords = 10000; // Records created per iteration, no more than 10k at a time or the insert will blow up.
  const yearPrefix = 10; // Year will increment per iteration
  const startingRecord = 110000;
  const iterations = 100;

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
    const startingRecordForIteration = startingRecord + (i * numRecords);
    const records = generateBulkData(yearPrefix + i, numRecords, startingRecordForIteration);
    // Insert the staging data
    await insertData(records);
    // Process the staging data
    if (processAfterInsert)
    {
      await processPendingComplaints();
    }
    console.log(`Inserted records ${startingRecordForIteration} through ${startingRecordForIteration + numRecords}.`);
  }
};

bulkDataLoad();
