// Instruction for running: from backend directory: node dataloader/bulk-data-loader.js
// Ensure that parameters in main method are updated as required.
require('dotenv').config();
const { Client } = require('pg');
const faker = require('faker');

const client = new Client({   
  host: process.env.COMPLAINT_OUTCOME_POSTGRESQL_HOST, //note make sure port not specified in .env file!
  port: 5433,
  database: process.env.COMPLAINT_OUTCOME_POSTGRESQL_DATABASE,
  user: process.env.COMPLAINT_OUTCOME_POSTGRESQL_USER,
  password: process.env.COMPLAINT_OUTCOME_POSTGRESQL_PASSWORD,});

client.connect();

// Generates HWCR data.  Currently only assessment and outcomes are implemented.
const generateHWCRCaseData = () => {
  const action_not_required_ind = faker.datatype.boolean(); // 50% chance of action required / not required.

  let generatedCase = {
    complaint_outcome_guid: faker.datatype.uuid(), // Generates a random GUID (UUID)
    case_code: 'HWCR',
    owned_by_agency_code: 'COS',
    action_not_required_ind: action_not_required_ind,
    review_required_ind: null // not implemented
  }

  if(action_not_required_ind){ // If No action is required the only assessment data is the inaction reason
    return {
      ...generatedCase,
      inaction_reason_code: faker.random.arrayElement(['DUPLICATE', 'NOPUBSFTYC', 'OTHOPRPRTY']), // Random inaction reason  
    }
  } else {
    return {
      ...generatedCase,
      complainant_contacted_ind: faker.datatype.boolean(), // True or false
      attended_ind: faker.datatype.boolean(), // True or false
      case_location_code: faker.random.arrayElement(['RURAL', 'URBAN', 'WLDNS']), // Random location code
      case_conflict_history_code: faker.random.arrayElement(['L', 'M', 'H', 'U']), // Random conflict history
      case_threat_level_code: faker.random.arrayElement(['1', '2', '3', 'U']), // Random threat level code
    }
  }
}

// Generates Lead data.   
// Params:
//     year = prefix for constructing complaint identifier
//     num = sequence for constructing complaint identifier
//     complaint_outcome_guid = Fk to case table
const generateLeadData = (year, num, complaint_outcome_guid) => {
  return {
    lead_identifier: `${year}-${num.toString().padStart(6, '0')}`, //Format into YY-###### format
    case_identifier: complaint_outcome_guid
  }
}

// Generates data for the action table.   
// Params:
//    complaint_outcome_guid = foreign key to case
//    actions = an array of actions to select from (allows caller to control type they want)
//    wildlife_guid = optional foreign key to wildlife record
const generateActionData = (complaint_outcome_guid, actions, wildlife_guid = null)  => {
  return {
    action_guid: faker.datatype.uuid(), // Generates a random GUID (UUID)
    complaint_outcome_guid: complaint_outcome_guid,
    action_type_action_xref_guid: faker.random.arrayElement(actions),
    actor_guid: faker.datatype.uuid(), // Generates a random GUID (UUID) - This won't render properly in the app
    action_date: faker.date.recent().toISOString(),
    active_ind: true,
    equipment_guid: null, // Not implemented
    wildlife_guid: wildlife_guid, // Not implmented
    decision_guid: null // Not implemented
  }
}

// Generates data for the wildlife table
// Params:
//    complaint_outcome_guid = foreign key to case
const generateWildlifeData = async (complaint_outcome_guid) => {
  return {
    wildlife_guid: faker.datatype.uuid(), 
    complaint_outcome_guid: complaint_outcome_guid,
    threat_level_code: faker.random.arrayElement(['1', '2', '3', 'U']), // Random threat level code
    sex_code: faker.random.arrayElement(['M', 'F', 'U']), // Random sex code
    age_code: faker.random.arrayElement(['ADLT', 'YRLN', 'YOFY', 'UNKN']), // Random age code
    hwcr_outcome_code: faker.random.arrayElement(['LESSLETHAL', 
      'DEADONARR', 'GONEONARR', 'REFRTOBIO', 'SHRTRELOC', 'TRANSLCTD', 'TRANSREHB']), // Random outcome code
    species_code: faker.random.arrayElement(['BISON', 
      'BLKBEAR', 'RACCOON', 'MTNGOAT', 'MOOSE', 'WOLVERN', 'LYNX', 
      'FERALHOG', 'GRZBEAR', 'FOX', 'ELK']), // Random outcome code
    active_ind: true,
    identifying_features: faker.lorem.sentence(),
  }
}

// Generates data for the site table
// Params:
//    complaint_outcome_guid = foreign key to case
const generateSiteData = (complaint_outcome_guid) => {
  return {
    site_guid:faker.datatype.uuid(), // Generates a random GUID (UUID)
    complaint_outcome_guid: complaint_outcome_guid,
    site_id: faker.datatype.number({ min: 1, max: 9999999999 }).toString(),
    active_ind: true
  }
}

// Generates data for the authorization_permit table
// Params:
//    complaint_outcome_guid = foreign key to case
const generateAuthorizationData = (complaint_outcome_guid) => {
  return {
    authorization_permit_guid: faker.datatype.uuid(), //Generates a random GUID (UUID)
    complaint_outcome_guid: complaint_outcome_guid,
    authorization_permit_id: faker.datatype.number({ min: 1, max: 9999999999 }).toString(),
    active_ind: true
  }
}

// Return specific action_type_action_xref_guids to ensure logical actions being added to case
// Params:
//   type = Return only actions of the provided action_type_code
//   action = Return a specific action type code (e.g. Record Outcome)
const getActionXrefs = async (type, action = null) => {
  try {
    let query = `
    SELECT action_type_action_xref_guid
    FROM complaint_outcome.action_type_action_xref
    WHERE action_type_code = '${type}'
  `;

  if (action) {
    query += ` AND action_code = '${action}'`;  // Assuming 'action' is a column in the table
  }
    const result = await client.query(query);
    return result.rows.map(row => row.action_type_action_xref_guid);  // Return an array of action_type_action_xref_guid
  } catch (err) {
    console.error('Error fetching action types:', err);
    return [];  // Return an empty array if there is an error
  }
};

// The main driver method for generating the bulk data
// Params:
//     year = prefix for constructing complaint identifier
//     num = sequence for constructing complaint identifier
//     type = the type of case data to generate.  Currently supported: HWCR, CEEB
//     startingSequence = the complaint number to start at.   data will be added incrementally from this value
const generateBulkData = async (year, num, type, startingSequence) => {
  let cases = [];

  const assessmentActions = await getActionXrefs('COMPASSESS');
  const outcomeActions = await getActionXrefs('WILDLIFE', 'RECOUTCOME');

  if(type === 'HWCR') {
    for (let i = startingSequence; i < num + startingSequence; i++) {
      const generatedCase = generateHWCRCaseData();
      const generatedLead = generateLeadData(year, i, generatedCase.complaint_outcome_guid);
      const generatedAssessmentAction = generateActionData(generatedCase.complaint_outcome_guid, assessmentActions);

      let generatedWildlife = null; // Default value if action is not requried
      let generatedWildifeAction = null;  // Default value if action is not requried
      if(!generatedCase.action_not_required_ind)
      {
         generatedWildlife = await generateWildlifeData(generatedCase.complaint_outcome_guid);
         generatedWildifeAction = generateActionData(generatedCase.complaint_outcome_guid, outcomeActions, generatedWildlife.wildlife_guid);
      }

      cases.push({
        case: generatedCase,
        lead: generatedLead,
        assessmentAction: generatedAssessmentAction,
        wildlife: generatedWildlife,
        wildlifeAction: generatedWildifeAction
      });
    } 
  } else if (type === 'CEEB') {  // Intentional repeated code here to avoid needing to do multi-pass inserts
    for (let i = startingSequence; i < num + startingSequence; i++) {
      const generatedCase = generateHWCRCaseData();
      const generatedLead = generateLeadData(year, i, generatedCase.complaint_outcome_guid);
      
      let generatedSite = null;
      let generatedAuthorization = null;
      
      if (i % 2 === 0) {
        // Even iterator - generate site data
        generatedSite = generateSiteData(generatedCase.complaint_outcome_guid);
      } else {
        // Odd iterator - generate authorization data
        generatedAuthorization = generateAuthorizationData(generatedCase.complaint_outcome_guid);
      }
      
      cases.push({
        case: generatedCase,
        lead: generatedLead,
        site: generatedSite,
        authorization: generatedAuthorization
      });
    } 
  } else {
    console.log (`${type} not supported, please provide either 'HWCR' or 'CEEB'`);
  }

  return cases;
};

// Bulk inserts HWCR data in the database.   Maximum supported data size is 4,000 records per call
// Params:
//   records: all the data
const insertHWCRData = async (records) => {
  try {
    const currentTimestamp = new Date().toISOString(); // Get the current timestamp

    // Begin transaction
    await client.query('BEGIN');

    // Arrays to hold the data for bulk inserts
    const caseValues = [];
    const leadValues = [];
    const assessmentActionValues = [];
    const wildlifeValues = [];
    const wildlifeActionValues = [];

    // Prepare the values for bulk insertion
    records.forEach((caseFile) => {
      // Prepare case data
      caseValues.push([
        caseFile.case.complaint_outcome_guid,
        caseFile.case.case_code,
        caseFile.case.owned_by_agency_code,
        caseFile.case.inaction_reason_code,
        caseFile.case.action_not_required_ind,
        caseFile.case.review_required_ind,
        caseFile.case.complainant_contacted_ind,
        caseFile.case.attended_ind,
        caseFile.case.case_location_code,
        caseFile.case.case_conflict_history_code,
        caseFile.case.case_threat_level_code,
        'Bulk Data Load', // create_user_id
        currentTimestamp, // create_utc_timestamp
        'Bulk Data Load', // update_user_id
        currentTimestamp // update_utc_timestamp
      ]);

      // Prepare lead data
      leadValues.push([
        caseFile.lead.lead_identifier,
        caseFile.lead.case_identifier,
        'Bulk Data Load', // create_user_id
        currentTimestamp, // create_utc_timestamp
        'Bulk Data Load', // update_user_id
        currentTimestamp // update_utc_timestamp
      ]);

      // Prepare assessment action data
      assessmentActionValues.push([
        caseFile.assessmentAction.action_guid,
        caseFile.assessmentAction.complaint_outcome_guid,
        caseFile.assessmentAction.action_type_action_xref_guid,
        caseFile.assessmentAction.actor_guid,
        caseFile.assessmentAction.action_date,
        caseFile.assessmentAction.active_ind,
        caseFile.assessmentAction.equipment_guid,
        caseFile.assessmentAction.wildlife_guid,
        caseFile.assessmentAction.decision_guid,
        'Bulk Data Load', // create_user_id
        currentTimestamp, // create_utc_timestamp
        'Bulk Data Load', // update_user_id
        currentTimestamp // update_utc_timestamp
      ]);

      // Prepare wildlife data (only if it exists)
      if (caseFile.wildlife) {
        wildlifeValues.push([
          caseFile.wildlife.wildlife_guid,
          caseFile.wildlife.complaint_outcome_guid,
          caseFile.wildlife.threat_level_code,
          caseFile.wildlife.sex_code,
          caseFile.wildlife.age_code,
          caseFile.wildlife.hwcr_outcome_code,
          caseFile.wildlife.species_code,
          caseFile.wildlife.active_ind,
          caseFile.wildlife.identifying_features,
          'Bulk Data Load', // create_user_id
          currentTimestamp, // create_utc_timestamp
          'Bulk Data Load', // update_user_id
          currentTimestamp // update_utc_timestamp
        ]);
      }

      // Prepare wildlife action data (only if wildlife exists)
      if (caseFile.wildlife) {
        wildlifeActionValues.push([
          caseFile.wildlifeAction.action_guid,
          caseFile.wildlifeAction.complaint_outcome_guid,
          caseFile.wildlifeAction.action_type_action_xref_guid,
          caseFile.wildlifeAction.actor_guid,
          caseFile.wildlifeAction.action_date,
          caseFile.wildlifeAction.active_ind,
          caseFile.wildlifeAction.equipment_guid,
          caseFile.wildlifeAction.wildlife_guid,
          caseFile.wildlifeAction.decision_guid,
          'Bulk Data Load', // create_user_id
          currentTimestamp, // create_utc_timestamp
          'Bulk Data Load', // update_user_id
          currentTimestamp // update_utc_timestamp
        ]);
      }
    });

    // Bulk insert for case files
    if (caseValues.length > 0) {
      await client.query(
        `INSERT INTO complaint_outcome.case_file (
          complaint_outcome_guid, 
          case_code, 
          owned_by_agency_code, 
          inaction_reason_code, 
          action_not_required_ind, 
          review_required_ind, 
          complainant_contacted_ind, 
          attended_ind, 
          case_location_code, 
          case_conflict_history_code, 
          case_threat_level_code, 
          create_user_id, 
          create_utc_timestamp, 
          update_user_id, 
          update_utc_timestamp
        ) VALUES 
        ${caseValues.map((_, i) => `($${i * 16 + 1}, $${i * 16 + 2}, $${i * 16 + 3}, $${i * 16 + 4}, $${i * 16 + 5}, $${i * 16 + 6}, $${i * 16 + 7}, $${i * 16 + 8}, $${i * 16 + 9}, $${i * 16 + 10}, $${i * 16 + 11}, $${i * 16 + 12}, $${i * 16 + 13}, $${i * 16 + 14}, $${i * 16 + 15}, $${i * 16 + 16})`).join(', ')}`
        , caseValues.flat()
      );
    }

    // Bulk insert for leads
    if (leadValues.length > 0) {
      await client.query(
        `INSERT INTO complaint_outcome.lead (
          lead_identifier,
          case_identifier, 
          create_user_id, 
          create_utc_timestamp, 
          update_user_id, 
          update_utc_timestamp
        ) VALUES 
        ${leadValues.map((_, i) => `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`).join(', ')}`
        , leadValues.flat()
      );
    }

    // Bulk insert for assessment actions
    if (assessmentActionValues.length > 0) {
      await client.query(
        `INSERT INTO complaint_outcome.action (
          action_guid,
          complaint_outcome_guid,
          action_type_action_xref_guid, 
          actor_guid,
          action_date,
          active_ind,
          equipment_guid,
          wildlife_guid,
          decision_guid,
          create_user_id, 
          create_utc_timestamp, 
          update_user_id, 
          update_utc_timestamp
        ) VALUES 
        ${assessmentActionValues.map((_, i) => `($${i * 13 + 1}, $${i * 13 + 2}, $${i * 13 + 3}, $${i * 13 + 4}, $${i * 13 + 5}, $${i * 13 + 6}, $${i * 13 + 7}, $${i * 13 + 8}, $${i * 13 + 9}, $${i * 13 + 10}, $${i * 13 + 11}, $${i * 13 + 12}, $${i * 13 + 13})`).join(', ')}`
        , assessmentActionValues.flat()
      );
    }

    // Bulk insert for wildlife (only if data exists)
    if (wildlifeValues.length > 0) {
      await client.query(
        `INSERT INTO complaint_outcome.wildlife (
          wildlife_guid,
          complaint_outcome_guid,
          threat_level_code,
          sex_code,
          age_code,
          hwcr_outcome_code,
          species_code,
          active_ind,
          identifying_features,
          create_user_id, 
          create_utc_timestamp, 
          update_user_id, 
          update_utc_timestamp
        ) VALUES 
        ${wildlifeValues.map((_, i) => `($${i * 13 + 1}, $${i * 13 + 2}, $${i * 13 + 3}, $${i * 13 + 4}, $${i * 13 + 5}, $${i * 13 + 6}, $${i * 13 + 7}, $${i * 13 + 8}, $${i * 13 + 9}, $${i * 13 + 10}, $${i * 13 + 11}, $${i * 13 + 12}, $${i * 13 + 13})`).join(', ')}`
        , wildlifeValues.flat()
      );
    }

    // Bulk insert for wildlife actions (only if data exists)
    if (wildlifeActionValues.length > 0) {
      await client.query(
        `INSERT INTO complaint_outcome.action (
          action_guid,
          complaint_outcome_guid,
          action_type_action_xref_guid, 
          actor_guid,
          action_date,
          active_ind,
          equipment_guid,
          wildlife_guid,
          decision_guid,
          create_user_id, 
          create_utc_timestamp, 
          update_user_id, 
          update_utc_timestamp
        ) VALUES 
        ${wildlifeActionValues.map((_, i) => `($${i * 13 + 1}, $${i * 13 + 2}, $${i * 13 + 3}, $${i * 13 + 4}, $${i * 13 + 5}, $${i * 13 + 6}, $${i * 13 + 7}, $${i * 13 + 8}, $${i * 13 + 9}, $${i * 13 + 10}, $${i * 13 + 11}, $${i * 13 + 12}, $${i * 13 + 13})`).join(', ')}`
        , wildlifeActionValues.flat()
      );
    }

    // Commit transaction
    await client.query('COMMIT');
  } catch (err) {
    console.error('Error loading data:', err);
    await client.query('ROLLBACK');
  } finally {
    await client.end();
  }
};

// Bulk inserts CEEB data in the database.   Maximum supported data size is 4,000 records per call
// Params:
//   records: all the data
const insertCEEBData = async (records) => {
  try {
    const currentTimestamp = new Date().toISOString(); // Get the current timestamp

    // Begin transaction
    await client.query('BEGIN');

    // Arrays to hold the data for bulk inserts
    const caseValues = [];
    const leadValues = [];
    const authorizationValues = [];
    const siteValues = [];

    // Prepare the values for bulk insertion
    records.forEach((caseFile) => {
      // Prepare case data
      caseValues.push([
        caseFile.case.complaint_outcome_guid,
        caseFile.case.case_code,
        caseFile.case.owned_by_agency_code,
        caseFile.case.inaction_reason_code,
        caseFile.case.action_not_required_ind,
        caseFile.case.review_required_ind,
        caseFile.case.complainant_contacted_ind,
        caseFile.case.attended_ind,
        caseFile.case.case_location_code,
        caseFile.case.case_conflict_history_code,
        caseFile.case.case_threat_level_code,
        'Bulk Data Load', // create_user_id
        currentTimestamp, // create_utc_timestamp
        'Bulk Data Load', // update_user_id
        currentTimestamp // update_utc_timestamp
      ]);

      // Prepare lead data
      leadValues.push([
        caseFile.lead.lead_identifier,
        caseFile.lead.case_identifier,
        'Bulk Data Load', // create_user_id
        currentTimestamp, // create_utc_timestamp
        'Bulk Data Load', // update_user_id
        currentTimestamp // update_utc_timestamp
      ]);

      // Prepare authorization data (only if it exists)
      if (caseFile.authorization) {
        authorizationValues.push([
          caseFile.authorization.authorization_permit_guid,
          caseFile.authorization.complaint_outcome_guid,
          caseFile.authorization.authorization_permit_id,
          caseFile.authorization.active_ind,
          'Bulk Data Load', // create_user_id
          currentTimestamp, // create_utc_timestamp
          'Bulk Data Load', // update_user_id
          currentTimestamp // update_utc_timestamp
        ]);
      }

    // Prepare site data (only if it exists)
    if (caseFile.site) {
      siteValues.push([
        caseFile.site.site_guid,
        caseFile.site.complaint_outcome_guid,
        caseFile.site.site_id,
        caseFile.site.active_ind,
        'Bulk Data Load', // create_user_id
        currentTimestamp, // create_utc_timestamp
        'Bulk Data Load', // update_user_id
        currentTimestamp // update_utc_timestamp
      ]);
    }


    });

    // Bulk insert for case files
    if (caseValues.length > 0) {
      await client.query(
        `INSERT INTO complaint_outcome.case_file (
          complaint_outcome_guid, 
          case_code, 
          owned_by_agency_code, 
          inaction_reason_code, 
          action_not_required_ind, 
          review_required_ind, 
          complainant_contacted_ind, 
          attended_ind, 
          case_location_code, 
          case_conflict_history_code, 
          case_threat_level_code, 
          create_user_id, 
          create_utc_timestamp, 
          update_user_id, 
          update_utc_timestamp
        ) VALUES 
        ${caseValues.map((_, i) => `($${i * 16 + 1}, $${i * 16 + 2}, $${i * 16 + 3}, $${i * 16 + 4}, $${i * 16 + 5}, $${i * 16 + 6}, $${i * 16 + 7}, $${i * 16 + 8}, $${i * 16 + 9}, $${i * 16 + 10}, $${i * 16 + 11}, $${i * 16 + 12}, $${i * 16 + 13}, $${i * 16 + 14}, $${i * 16 + 15}, $${i * 16 + 16})`).join(', ')}`
        , caseValues.flat()
      );
    }

    // Bulk insert for leads
    if (leadValues.length > 0) {
      await client.query(
        `INSERT INTO complaint_outcome.lead (
          lead_identifier,
          case_identifier, 
          create_user_id, 
          create_utc_timestamp, 
          update_user_id, 
          update_utc_timestamp
        ) VALUES 
        ${leadValues.map((_, i) => `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`).join(', ')}`
        , leadValues.flat()
      );
    }

    // Bulk insert for authorizations
    if (authorizationValues.length > 0) {
      await client.query(
        `INSERT INTO complaint_outcome.authorization_permit (
          authorization_permit_guid,
          complaint_outcome_guid,
          authorization_permit_id, 
          active_ind,
          create_user_id, 
          create_utc_timestamp, 
          update_user_id, 
          update_utc_timestamp
        ) VALUES 
        ${authorizationValues.map((_, i) => `($${i * 8 + 1}, $${i * 8 + 2}, $${i * 8 + 3}, $${i * 8 + 4}, $${i * 8 + 5}, $${i * 8 + 6}, $${i * 8 + 7}, $${i * 8 + 8})`).join(', ')}`
        , authorizationValues.flat()
      );
    }

    // Bulk insert for sites
    if (siteValues.length >0) {
      await client.query(
        `INSERT INTO complaint_outcome.site (
          site_guid,
          complaint_outcome_guid,
          site_id, 
          active_ind,
          create_user_id, 
          create_utc_timestamp, 
          update_user_id, 
          update_utc_timestamp
        ) VALUES
        ${siteValues.map((_, i) => `($${i * 8 + 1}, $${i * 8 + 2}, $${i * 8 + 3}, $${i * 8 + 4}, $${i * 8 + 5}, $${i * 8 + 6}, $${i * 8 + 7}, $${i * 8 + 8})`).join(', ')}`
        , siteValues.flat()
      );
    }

    // Commit transaction
    await client.query('COMMIT');
  } catch (err) {
    console.error('Error loading data:', err);
    await client.query('ROLLBACK');
  } finally {
    await client.end();
  }
};

// Main method.   Exists in order to synchronously handle data dependencies (e.g. make sure cases are inserted first, then wildlife, then everything else.)
const main = async () => {
  // Adjust these as required.
  // This script assumes requisite complaint data exists and that there are no conflicts in the case management database
  const yearPrefix = 25; // The year prefix of the complaint
  const startingSequence = 0 // The complaint sequence number you want to start at
  const numRecords = 4000; // How many records are being generated.  4K Max
  const type = 'HWCR'; // The Type of case to generate.   Currently supported: HWCR, CEEB

  // Validate parameters
  if (numRecords > 4000) {
    console.log ("Please adjust the numRecords parameter to be less than 4000");
    client.end();
    return;
  }
  // Ensure that the bulk data is generated before starting insertion
  const records = await generateBulkData(yearPrefix, numRecords, type, startingSequence);
  if(type === 'HWCR'){
    await insertHWCRData(records);
  } else {
    await insertCEEBData(records);
  }
};

main().catch((err) => {
  console.error('Error running the main process:', err);
});

  

    
    

