// Instruction for running: from backend directory: node dataloader/bulk-data-loader.js
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
const generateLatitude = (min, max) => {
  return faker.datatype.number({ min: min * 10000, max: max * 10000 }) / 10000;
};

// Function to generate a random longitude within the specified range
const generateLongitude = (min, max) => {
  return faker.datatype.number({ min: min * 10000, max: max * 10000 }) / 10000;
};

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
const generateERSData = (year) => {

  const commonFields = generateCommonFields(year);  // Get common fields

return {
  ...commonFields,
  report_type: 'ERS',
  violation_type: faker.random.arrayElement(['Boating', 'Dumping', 'Fisheries ', 'Open Burning', 'Waste', 'Pesticide']),
  suspect_details: faker.lorem.paragraph(),
  observe_violation: faker.random.arrayElement(['Yes', 'No']),
  violation_in_progress: faker.random.arrayElement(['Yes', 'No']),
};
};


// Function to generate a single Complaint record - Note optional fields are not included in order to keep payload size down
const generateGIRData = (year) => {

  const commonFields = generateCommonFields(year);  // Get common fields

return {
  ...commonFields,
  report_type: 'GIR',
  call_type_gir: faker.random.arrayElement(['CO Contact', 'CO Disposition', 'General Advice', 'Media', 'Query']),
};
};

// Function to generate bulk data 
const generateBulkData = (year, num) => {
  let bulkData = [];

  //Distrubte the counts according to a realistic business breakdown
  const HWCRcount = num*0.7;
  const ERScount = num*0.25;
  const GIRcount = num*0.05;

  for (let i = 0; i < HWCRcount; i++) {
    let complaint_identifier = `${year}-${i.toString().padStart(6, '0')}`;
    bulkData.push(generateHWCRData(complaint_identifier));
  }
  for (let i = 0; i < ERScount; i++) {
    let identifer = i + HWCRcount;  // Add HWCRcount to i
    let complaint_identifier = `${year}-${identifer.toString().padStart(6, '0')}`;
    bulkData.push(generateERSData(complaint_identifier));
  }
  for (let i = 0; i < GIRcount; i++) {
    let identifer = i + HWCRcount + ERScount;  // Add HWCRcount and ERScount to i
    let complaint_identifier = `${year}-${identifer.toString().padStart(6, '0')}`;
    bulkData.push(generateGIRData(complaint_identifier));
  }
  return bulkData;
};

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

// Adjust these as required.
// No more than 10k at a time or the insert will blow up.
const yearPrefix = 16;
const numRecords = 10000;

const records = generateBulkData(yearPrefix, numRecords);
insertData(records);
