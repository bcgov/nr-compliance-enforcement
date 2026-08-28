// Instruction for running: from backend directory: node dataloader/bulk-data-loader.js
// Ensure that parameters in main method are updated as required.
require("dotenv").config();
const { Client } = require("pg");
const faker = require("@faker-js/faker");

const client = new Client({
  host: process.env.COMPLAINT_OUTCOME_POSTGRESQL_HOST, //note make sure port not specified in .env file!
  port: 5433,
  database: process.env.COMPLAINT_OUTCOME_POSTGRESQL_DATABASE,
  user: process.env.COMPLAINT_OUTCOME_POSTGRESQL_USER,
  password: process.env.COMPLAINT_OUTCOME_POSTGRESQL_PASSWORD,
});

// Party mode connects as the local superuser so the audit history triggers can be disabled.  Defaults are the compose credentials
const partyClient = new Client({
  host: process.env.PARTY_POSTGRESQL_HOST || "localhost",
  port: process.env.PARTY_POSTGRESQL_PORT || 5432,
  database: process.env.PARTY_POSTGRESQL_DATABASE || "postgres",
  user: process.env.PARTY_POSTGRESQL_USER || "postgres",
  password: process.env.PARTY_POSTGRESQL_PASSWORD || "default",
});

// Builds the "($1, $2), ($3, $4)" placeholder list for a multi-row insert
const valuePlaceholders = (rowCount, columnCount) =>
  Array.from({ length: rowCount }, (_, row) => {
    const placeholders = Array.from({ length: columnCount }, (_, column) => "$" + (row * columnCount + column + 1));
    return "(" + placeholders.join(", ") + ")";
  }).join(", ");

// Generates HWCR data.  Currently only assessment and outcomes are implemented.
const generateHWCRCaseData = () => {
  const action_not_required_ind = faker.datatype.boolean(); // 50% chance of action required / not required.

  let generatedCase = {
    complaint_outcome_guid: faker.datatype.uuid(), // Generates a random GUID (UUID)
    case_code: "HWCR",
    owned_by_agency_code: "COS",
    action_not_required_ind: action_not_required_ind,
    review_required_ind: null, // not implemented
  };

  if (action_not_required_ind) {
    // If No action is required the only assessment data is the inaction reason
    return {
      ...generatedCase,
      inaction_reason_code: faker.random.arrayElement(["DUPLICATE", "NOPUBSFTYC", "OTHOPRPRTY"]), // Random inaction reason
    };
  } else {
    return {
      ...generatedCase,
      complainant_contacted_ind: faker.datatype.boolean(), // True or false
      attended_ind: faker.datatype.boolean(), // True or false
      case_location_code: faker.random.arrayElement(["RURAL", "URBAN", "WLDNS"]), // Random location code
      case_conflict_history_code: faker.random.arrayElement(["L", "M", "H", "U"]), // Random conflict history
      case_threat_level_code: faker.random.arrayElement(["1", "2", "3", "U"]), // Random threat level code
    };
  }
};

// Generates Lead data.
// Params:
//     year = prefix for constructing complaint identifier
//     num = sequence for constructing complaint identifier
//     complaint_outcome_guid = Fk to case table
const generateLeadData = (year, num, complaint_outcome_guid) => {
  return {
    lead_identifier: `${year}-${num.toString().padStart(6, "0")}`, //Format into YY-###### format
    case_identifier: complaint_outcome_guid,
  };
};

// Generates data for the action table.
// Params:
//    complaint_outcome_guid = foreign key to case
//    actions = an array of actions to select from (allows caller to control type they want)
//    wildlife_guid = optional foreign key to wildlife record
const generateActionData = (complaint_outcome_guid, actions, wildlife_guid = null) => {
  return {
    action_guid: faker.datatype.uuid(), // Generates a random GUID (UUID)
    complaint_outcome_guid: complaint_outcome_guid,
    action_type_action_xref_guid: faker.random.arrayElement(actions),
    actor_guid: faker.datatype.uuid(), // Generates a random GUID (UUID) - This won't render properly in the app
    action_date: faker.date.recent().toISOString(),
    active_ind: true,
    equipment_guid: null, // Not implemented
    wildlife_guid: wildlife_guid, // Not implmented
    decision_guid: null, // Not implemented
  };
};

// Generates data for the wildlife table
// Params:
//    complaint_outcome_guid = foreign key to case
const generateWildlifeData = async (complaint_outcome_guid) => {
  return {
    wildlife_guid: faker.datatype.uuid(),
    complaint_outcome_guid: complaint_outcome_guid,
    threat_level_code: faker.random.arrayElement(["1", "2", "3", "U"]), // Random threat level code
    sex_code_ref: faker.random.arrayElement(["M", "F", "U"]), // Random sex code
    age_code: faker.random.arrayElement(["ADLT", "YRLN", "YOFY", "UNKN"]), // Random age code
    hwcr_outcome_code: faker.random.arrayElement([
      "LESSLETHAL",
      "DEADONARR",
      "GONEONARR",
      "REFRTOBIO",
      "SHRTRELOC",
      "TRANSLCTD",
      "TRANSREHB",
    ]), // Random outcome code
    species_code: faker.random.arrayElement([
      "BISON",
      "BLKBEAR",
      "RACCOON",
      "MTNGOAT",
      "MOOSE",
      "WOLVERN",
      "LYNX",
      "FERALHOG",
      "GRZBEAR",
      "FOX",
      "ELK",
    ]), // Random outcome code
    active_ind: true,
    identifying_features: faker.lorem.sentence(),
  };
};

// Generates data for the site table
// Params:
//    complaint_outcome_guid = foreign key to case
const generateSiteData = (complaint_outcome_guid) => {
  return {
    site_guid: faker.datatype.uuid(), // Generates a random GUID (UUID)
    complaint_outcome_guid: complaint_outcome_guid,
    site_id: faker.datatype.number({ min: 1, max: 9999999999 }).toString(),
    active_ind: true,
  };
};

// Generates data for the authorization_permit table
// Params:
//    complaint_outcome_guid = foreign key to case
const generateAuthorizationData = (complaint_outcome_guid) => {
  return {
    authorization_permit_guid: faker.datatype.uuid(), //Generates a random GUID (UUID)
    complaint_outcome_guid: complaint_outcome_guid,
    authorization_permit_id: faker.datatype.number({ min: 1, max: 9999999999 }).toString(),
    active_ind: true,
  };
};

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
      query += ` AND action_code = '${action}'`; // Assuming 'action' is a column in the table
    }
    const result = await client.query(query);
    return result.rows.map((row) => row.action_type_action_xref_guid); // Return an array of action_type_action_xref_guid
  } catch (err) {
    console.error("Error fetching action types:", err);
    return []; // Return an empty array if there is an error
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

  const assessmentActions = await getActionXrefs("COMPASSESS");
  const outcomeActions = await getActionXrefs("WILDLIFE", "RECOUTCOME");

  if (type === "HWCR") {
    for (let i = startingSequence; i < num + startingSequence; i++) {
      const generatedCase = generateHWCRCaseData();
      const generatedLead = generateLeadData(year, i, generatedCase.complaint_outcome_guid);
      const generatedAssessmentAction = generateActionData(generatedCase.complaint_outcome_guid, assessmentActions);

      let generatedWildlife = null; // Default value if action is not requried
      let generatedWildifeAction = null; // Default value if action is not requried
      if (!generatedCase.action_not_required_ind) {
        generatedWildlife = await generateWildlifeData(generatedCase.complaint_outcome_guid);
        generatedWildifeAction = generateActionData(
          generatedCase.complaint_outcome_guid,
          outcomeActions,
          generatedWildlife.wildlife_guid,
        );
      }

      cases.push({
        case: generatedCase,
        lead: generatedLead,
        assessmentAction: generatedAssessmentAction,
        wildlife: generatedWildlife,
        wildlifeAction: generatedWildifeAction,
      });
    }
  } else if (type === "CEEB") {
    // Intentional repeated code here to avoid needing to do multi-pass inserts
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
        authorization: generatedAuthorization,
      });
    }
  } else {
    console.log(`${type} not supported, please provide either 'HWCR' or 'CEEB'`);
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
    await client.query("BEGIN");

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
        "Bulk Data Load", // create_user_id
        currentTimestamp, // create_utc_timestamp
        "Bulk Data Load", // update_user_id
        currentTimestamp, // update_utc_timestamp
      ]);

      // Prepare lead data
      leadValues.push([
        caseFile.lead.lead_identifier,
        caseFile.lead.case_identifier,
        "Bulk Data Load", // create_user_id
        currentTimestamp, // create_utc_timestamp
        "Bulk Data Load", // update_user_id
        currentTimestamp, // update_utc_timestamp
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
        "Bulk Data Load", // create_user_id
        currentTimestamp, // create_utc_timestamp
        "Bulk Data Load", // update_user_id
        currentTimestamp, // update_utc_timestamp
      ]);

      // Prepare wildlife data (only if it exists)
      if (caseFile.wildlife) {
        wildlifeValues.push([
          caseFile.wildlife.wildlife_guid,
          caseFile.wildlife.complaint_outcome_guid,
          caseFile.wildlife.threat_level_code,
          caseFile.wildlife.sex_code_ref,
          caseFile.wildlife.age_code,
          caseFile.wildlife.hwcr_outcome_code,
          caseFile.wildlife.species_code,
          caseFile.wildlife.active_ind,
          caseFile.wildlife.identifying_features,
          "Bulk Data Load", // create_user_id
          currentTimestamp, // create_utc_timestamp
          "Bulk Data Load", // update_user_id
          currentTimestamp, // update_utc_timestamp
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
          "Bulk Data Load", // create_user_id
          currentTimestamp, // create_utc_timestamp
          "Bulk Data Load", // update_user_id
          currentTimestamp, // update_utc_timestamp
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
        ${valuePlaceholders(caseValues.length, 16)}`,
        caseValues.flat(),
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
        ${valuePlaceholders(leadValues.length, 6)}`,
        leadValues.flat(),
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
        ${valuePlaceholders(assessmentActionValues.length, 13)}`,
        assessmentActionValues.flat(),
      );
    }

    // Bulk insert for wildlife (only if data exists)
    if (wildlifeValues.length > 0) {
      await client.query(
        `INSERT INTO complaint_outcome.wildlife (
          wildlife_guid,
          complaint_outcome_guid,
          threat_level_code,
          sex_code_ref,
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
        ${valuePlaceholders(wildlifeValues.length, 13)}`,
        wildlifeValues.flat(),
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
        ${valuePlaceholders(wildlifeActionValues.length, 13)}`,
        wildlifeActionValues.flat(),
      );
    }

    // Commit transaction
    await client.query("COMMIT");
  } catch (err) {
    console.error("Error loading data:", err);
    await client.query("ROLLBACK");
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
    await client.query("BEGIN");

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
        "Bulk Data Load", // create_user_id
        currentTimestamp, // create_utc_timestamp
        "Bulk Data Load", // update_user_id
        currentTimestamp, // update_utc_timestamp
      ]);

      // Prepare lead data
      leadValues.push([
        caseFile.lead.lead_identifier,
        caseFile.lead.case_identifier,
        "Bulk Data Load", // create_user_id
        currentTimestamp, // create_utc_timestamp
        "Bulk Data Load", // update_user_id
        currentTimestamp, // update_utc_timestamp
      ]);

      // Prepare authorization data (only if it exists)
      if (caseFile.authorization) {
        authorizationValues.push([
          caseFile.authorization.authorization_permit_guid,
          caseFile.authorization.complaint_outcome_guid,
          caseFile.authorization.authorization_permit_id,
          caseFile.authorization.active_ind,
          "Bulk Data Load", // create_user_id
          currentTimestamp, // create_utc_timestamp
          "Bulk Data Load", // update_user_id
          currentTimestamp, // update_utc_timestamp
        ]);
      }

      // Prepare site data (only if it exists)
      if (caseFile.site) {
        siteValues.push([
          caseFile.site.site_guid,
          caseFile.site.complaint_outcome_guid,
          caseFile.site.site_id,
          caseFile.site.active_ind,
          "Bulk Data Load", // create_user_id
          currentTimestamp, // create_utc_timestamp
          "Bulk Data Load", // update_user_id
          currentTimestamp, // update_utc_timestamp
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
        ${valuePlaceholders(caseValues.length, 16)}`,
        caseValues.flat(),
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
        ${valuePlaceholders(leadValues.length, 6)}`,
        leadValues.flat(),
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
        ${valuePlaceholders(authorizationValues.length, 8)}`,
        authorizationValues.flat(),
      );
    }

    // Bulk insert for sites
    if (siteValues.length > 0) {
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
        ${valuePlaceholders(siteValues.length, 8)}`,
        siteValues.flat(),
      );
    }

    // Commit transaction
    await client.query("COMMIT");
  } catch (err) {
    console.error("Error loading data:", err);
    await client.query("ROLLBACK");
  } finally {
    await client.end();
  }
};

// Parties generated per transaction, and the maximum rows in any one multi-row INSERT.
// Person rows carry 22 columns, so 1,000 rows per statement stays well under the 65,535 bind parameter limit
const PARTY_CHUNK_SIZE = 1000;

// Surnames on a realistic frequency curve - the weight is the relative share of generated persons.
// Accented, apostrophe/hyphen and short surnames are deliberately represented
const PARTY_SURNAMES = [
  ["Smith", 420],
  ["Johnson", 310],
  ["Brown", 280],
  ["Wilson", 250],
  ["Taylor", 230],
  ["Anderson", 200],
  ["Campbell", 180],
  ["Martin", 170],
  ["Thompson", 160],
  ["MacDonald", 150],
  ["Lee", 140],
  ["Chen", 130],
  ["Wong", 120],
  ["Singh", 115],
  ["Nguyen", 110],
  ["Patel", 100],
  ["Tremblay", 90],
  ["Gagnon", 85],
  ["Roy", 80],
  ["Bouchard", 75],
  ["Li", 70],
  ["Ng", 60],
  ["Yu", 55],
  ["Ho", 50],
  ["Kaur", 48],
  ["O'Brien", 45],
  ["O'Connor", 38],
  ["O'Neill", 28],
  ["D'Amico", 20],
  ["Smith-Jones", 26],
  ["Baker-Reid", 22],
  ["Martin-Roy", 18],
  ["Wong-Taylor", 14],
  ["Côté", 40],
  ["Dubé", 32],
  ["Lévesque", 28],
  ["Gérard", 20],
  ["Muñoz", 18],
  ["Hernández", 16],
  ["Beaulieu", 12],
  ["Okonkwo", 10],
  ["Abdullahi", 9],
  ["Haugen", 8],
];

// First names on a realistic frequency curve, seeded with the spike's typo, similar and sound alike pairs
const PARTY_FIRST_NAMES = [
  ["James", 300],
  ["Robert", 280],
  ["John", 270],
  ["Michael", 260],
  ["Mary", 250],
  ["Jennifer", 220],
  ["Linda", 200],
  ["David", 195],
  ["Sarah", 180],
  ["Susan", 170],
  ["Mark", 90],
  ["Stephen", 85],
  ["Steven", 80],
  ["Frederick", 60],
  ["Fredrick", 25],
  ["Alex", 75],
  ["Alec", 30],
  ["Jon", 45],
  ["Jonathan", 42],
  ["Katherine", 38],
  ["Kathryn", 20],
  ["Frédéric", 30],
  ["José", 28],
  ["Renée", 22],
  ["Zoë", 16],
  ["Ana", 55],
  ["Amrit", 50],
  ["Wei", 60],
  ["Jun", 45],
  ["Mei", 40],
  ["Hiro", 25],
  ["Bo", 20],
  ["Ty", 15],
];

const PARTY_NICKNAMES = ["Bill", "Bob", "Chuck", "Liz", "Kate", "Rick", "Steve", "Tony", "Sandy", "Mick"];
const PARTY_AREA_CODES = ["250", "604", "778", "236"];
const PARTY_CITIES = [
  "Kamloops",
  "Prince George",
  "Nanaimo",
  "Cranbrook",
  "Fort St. John",
  "Williams Lake",
  "Terrace",
  "Vernon",
  "Squamish",
  "Powell River",
  "Smithers",
  "Castlegar",
  "Duncan",
  "Quesnel",
];

// Birth decades, weighted so the birthdate column clusters instead of spreading evenly
const PARTY_BIRTH_DECADES = [
  [1940, 30],
  [1950, 70],
  [1960, 130],
  [1970, 180],
  [1980, 210],
  [1990, 200],
  [2000, 130],
  [2010, 50],
];

const PARTY_BUSINESS_REGIONS = [
  "Cariboo",
  "Skeena",
  "Nechako",
  "Kootenay",
  "Chilcotin",
  "Stikine",
  "Bulkley",
  "Okanagan",
  "Columbia",
  "Peace River",
];
const PARTY_BUSINESS_FEATURES = ["Ridge", "Creek", "Lake", "Bay", "Falls", "Junction", "Valley", "Bluff"];
const PARTY_BUSINESS_SUFFIXES = ["Ltd.", "Inc.", "Corp.", "Ltd."];

// Legal name vocabulary neighbours - the pair shares a stem and differs by one word, which trigram scores highly
const PARTY_BUSINESS_CATEGORY_PAIRS = [
  ["Contracting", "Consulting"],
  ["Logging", "Lodging"],
  ["Transport", "Transportation"],
  ["Aggregates", "Aggregate Services"],
  ["Holdings", "Holding Group"],
];

// True pct percent of the time
const chance = (pct) => faker.datatype.number({ min: 1, max: 100 }) <= pct;

// Picks a value from a pool of [value, weight] entries
const pickWeighted = (pool) => {
  let roll = faker.datatype.number({ min: 1, max: pool.reduce((total, [, weight]) => total + weight, 0) });
  for (const [value, weight] of pool) {
    roll -= weight;
    if (roll <= 0) return value;
  }
  return pool[pool.length - 1][0];
};

// The weighted pools are the head of the name curve, faker supplies the long tail
const pickFirstName = () => (chance(20) ? faker.name.firstName() : pickWeighted(PARTY_FIRST_NAMES));
const pickSurname = () => (chance(18) ? faker.name.lastName() : pickWeighted(PARTY_SURNAMES));

// Generates a BC phone number in the E.164 form the phone input stores
const generatePhone = () =>
  `+1${faker.random.arrayElement(PARTY_AREA_CODES)}${faker.datatype.number({ min: 2000000, max: 9999999 })}`;

const generatePostalCode = () => faker.address.zipCode("V#? #?#");

// Generates a date of birth.   Some are missing, the rest cluster by decade with a first of January data entry spike
const generateBirthDate = () => {
  if (chance(12)) return null;
  const year = pickWeighted(PARTY_BIRTH_DECADES) + faker.datatype.number({ min: 0, max: 9 });
  if (chance(20)) return `${year}-01-01`;
  return `${year}-${faker.datatype.number({ min: 1, max: 12 }).toString().padStart(2, "0")}-${faker.datatype.number({ min: 1, max: 28 }).toString().padStart(2, "0")}`;
};

// Sparse physical descriptors - most people carry only a few, and the booleans are mostly unrecorded
const generateDescriptors = () => ({
  sex_code: chance(55) ? faker.random.arrayElement(["M", "F", "U", "X"]) : null,
  approximate_age_code: chance(15) ? faker.random.arrayElement(["18UNDER", "19TO39", "40TO59", "60OVER"]) : null,
  height_cm: chance(30) ? faker.datatype.number({ min: 1400, max: 2000 }) / 10 : null,
  weight_kg: chance(25) ? faker.datatype.number({ min: 450, max: 1300 }) / 10 : null,
  complexion_code: chance(8)
    ? faker.random.arrayElement([
        "ALB",
        "BLK",
        "LBR",
        "MBR",
        "DBR",
        "DRK",
        "FAR",
        "LGT",
        "MED",
        "OLV",
        "RUD",
        "SAL",
        "YEL",
      ])
    : null,
  build_code: chance(18) ? faker.random.arrayElement(["SL", "MD", "LG"]) : null,
  hair_colour_code: chance(25)
    ? faker.random.arrayElement(["BLK", "BLN", "BRO", "GRY", "RED", "SDY", "WHI", "OTH"])
    : null,
  hair_length_code: chance(12) ? faker.random.arrayElement(["BALD", "BUZZ", "SHORT", "MEDIUM", "LONG"]) : null,
  eye_colour_code: chance(20)
    ? faker.random.arrayElement(["AMBER", "BLU", "BRO", "GRY", "GRN", "HAZ", "MUL", "OTH"])
    : null,
  facial_hair_ind: chance(20) ? chance(60) : null,
  tattoo_ind: chance(15) ? chance(55) : null,
});

// Generates an address row.   Household members are passed the household so they share the same address values
const generateAddressRow = (party_guid, address_name, household = null) => ({
  address_guid: faker.datatype.uuid(),
  party_guid: party_guid,
  address_name: address_name,
  address: household ? household.address : faker.address.streetAddress(),
  city: household ? household.city : faker.random.arrayElement(PARTY_CITIES),
  country_subdivision_code: "CA-BC",
  postal_code: household ? household.postal_code : generatePostalCode(),
  country_code: "CA",
  is_primary: true,
});

// Generates a contact method row.   Only one row per party and type may be primary
const generateContactMethodRow = (party_guid, contact_method_type, contact_value, is_primary) => ({
  contact_method_guid: faker.datatype.uuid(),
  party_guid: party_guid,
  contact_method_type: contact_method_type,
  contact_value: contact_value,
  is_primary: is_primary,
});

// Generates an alias row - a nickname, alone or with the surname, or an initialled name
const generateAliasRow = (party_guid, person) => ({
  alias_guid: faker.datatype.uuid(),
  party_guid: party_guid,
  name: faker.random.arrayElement([
    faker.random.arrayElement(PARTY_NICKNAMES),
    `${faker.random.arrayElement(PARTY_NICKNAMES)} ${person.last_name}`,
    `${person.first_name.charAt(0)} ${person.last_name}`,
  ]),
});

// Sequential so the partial unique constraints on active identifier values hold
let nextBusinessNumber = 100000000;
let nextWsbcNumber = 100000;

const generateBusinessIdentifierRow = (business_guid, business_identifier_code, identifier_value) => ({
  business_identifier_guid: faker.datatype.uuid(),
  business_guid: business_guid,
  business_identifier_code: business_identifier_code,
  identifier_value: identifier_value,
});

// Generates the address and home phone shared by the members of one household
const generateHousehold = () => ({
  last_name: pickSurname(),
  address: faker.address.streetAddress(),
  city: faker.random.arrayElement(PARTY_CITIES),
  postal_code: generatePostalCode(),
  phone: generatePhone(),
});

// Generates a party row, its person row and its child rows
// Params:
//    party_type = PRS for a person party, CNT for a business contact
//    household = optional household whose address and home phone the person shares
const generatePersonParty = (party_type, household = null) => {
  const party_guid = faker.datatype.uuid();
  const first_name = pickFirstName();
  const last_name = household && chance(80) ? household.last_name : pickSurname();

  const person = {
    person_guid: faker.datatype.uuid(),
    party_guid: party_guid,
    first_name: first_name,
    middle_names: chance(30) ? pickFirstName() : null,
    last_name: last_name,
    date_of_birth: generateBirthDate(),
    drivers_license_number: chance(60) ? faker.datatype.number({ min: 1000000, max: 9999999 }).toString() : null,
    ...generateDescriptors(),
  };

  const addresses = [];
  const contactMethods = [];
  if (household) {
    addresses.push(generateAddressRow(party_guid, "Home", household));
    contactMethods.push(generateContactMethodRow(party_guid, "PHONE", household.phone, true));
  } else if (chance(70)) {
    addresses.push(generateAddressRow(party_guid, "Home"));
    contactMethods.push(generateContactMethodRow(party_guid, "PHONE", generatePhone(), true));
  }
  if (chance(35)) contactMethods.push(generateContactMethodRow(party_guid, "PHONE", generatePhone(), false));
  if (chance(45))
    contactMethods.push(
      generateContactMethodRow(party_guid, "EMAILADDR", faker.internet.email(first_name, last_name), true),
    );

  return {
    party_guid: party_guid,
    party_type: party_type,
    person: person,
    aliases: chance(12) ? [generateAliasRow(party_guid, person)] : [],
    addresses: addresses,
    contactMethods: contactMethods,
  };
};

// Generates a business contact - a CNT party that always carries its own phone and email
const generateContactParty = () => {
  const contact = generatePersonParty("CNT");
  contact.aliases = [];
  contact.addresses = [];
  contact.contactMethods = [
    generateContactMethodRow(contact.party_guid, "PHONE", generatePhone(), true),
    generateContactMethodRow(
      contact.party_guid,
      "EMAILADDR",
      faker.internet.email(contact.person.first_name, contact.person.last_name),
      true,
    ),
  ];
  return contact;
};

// Generates a party row, its business row, its identifiers and its contact people
// Params:
//    stem = the leading words of the legal name, shared by vocabulary neighbours
//    category = the category word that distinguishes the legal name from its neighbour
const generateBusinessParty = (stem, category) => {
  const party_guid = faker.datatype.uuid();
  const business_guid = faker.datatype.uuid();
  const name = `${stem} ${category} ${faker.random.arrayElement(PARTY_BUSINESS_SUFFIXES)}`;

  const identifiers = [];
  if (chance(80))
    identifiers.push(generateBusinessIdentifierRow(business_guid, "BNUM", (nextBusinessNumber++).toString()));
  if (chance(50)) identifiers.push(generateBusinessIdentifierRow(business_guid, "WSBC", (nextWsbcNumber++).toString()));

  const contacts = [];
  const contactCount = chance(40) ? 2 : 1;
  for (let i = 0; i < contactCount; i++) {
    const contact = generateContactParty();
    contact.xref = {
      business_person_xref_guid: faker.datatype.uuid(),
      business_guid: business_guid,
      person_guid: contact.person.person_guid,
      business_person_xref_code: "CONT",
      is_primary: i === 0,
    };
    contacts.push(contact);
  }

  const contactMethods = [];
  if (chance(70)) contactMethods.push(generateContactMethodRow(party_guid, "PHONE", generatePhone(), true));
  if (chance(60))
    contactMethods.push(
      generateContactMethodRow(party_guid, "EMAILADDR", faker.internet.email("info", stem.replace(/\W/g, "")), true),
    );

  return {
    party_guid: party_guid,
    party_type: "CMP",
    business: { business_guid: business_guid, party_guid: party_guid, name: name },
    aliases: [],
    addresses: chance(80) ? [generateAddressRow(party_guid, "Business")] : [],
    contactMethods: contactMethods,
    identifiers: identifiers,
    contacts: contacts,
  };
};

// Generates the next group of parties - a business (sometimes with its vocabulary neighbour), a household, or a lone person
const generatePartyRecords = () => {
  if (chance(10)) {
    const stem = `${faker.random.arrayElement(PARTY_BUSINESS_REGIONS)} ${faker.random.arrayElement(PARTY_BUSINESS_FEATURES)}`;
    const categories = faker.random.arrayElement(PARTY_BUSINESS_CATEGORY_PAIRS);
    if (chance(30)) return [generateBusinessParty(stem, categories[0]), generateBusinessParty(stem, categories[1])];
    return [generateBusinessParty(stem, faker.random.arrayElement(categories))];
  }
  if (chance(35)) {
    const household = generateHousehold();
    return Array.from({ length: faker.datatype.number({ min: 2, max: 4 }) }, () =>
      generatePersonParty("PRS", household),
    );
  }
  return [generatePersonParty("PRS")];
};

// Every fixture row takes its guid from this sequence, so the whole planted set is
// SELECT ... WHERE party_guid LIKE '00000000-0000-4000-8000-%'
let fixtureSequence = 0;
const fixtureGuid = () => `00000000-0000-4000-8000-${(++fixtureSequence).toString().padStart(12, "0")}`;

// Fixtures score on names and identifiers only
const FIXTURE_DESCRIPTORS = {
  sex_code: null,
  approximate_age_code: null,
  height_cm: null,
  weight_kg: null,
  complexion_code: null,
  build_code: null,
  hair_colour_code: null,
  hair_length_code: null,
  eye_colour_code: null,
  facial_hair_ind: null,
  tattoo_ind: null,
};

// The crowd of a saturation fixture, cycled so the planted rows stay deterministic
const FIXTURE_CROWD_NAMES = [
  "Robert",
  "Mary",
  "James",
  "Patricia",
  "Michael",
  "Linda",
  "David",
  "Barbara",
  "Richard",
  "Susan",
];

// Builds one fixture person party from literal values
// Params:
//    attributes = the optional literals this fixture needs: party_type, date_of_birth, drivers_license_number, phone, email
const fixturePerson = (first_name, last_name, attributes = {}) => {
  const party_guid = fixtureGuid();
  const contactMethods = [];
  if (attributes.phone)
    contactMethods.push({
      contact_method_guid: fixtureGuid(),
      party_guid: party_guid,
      contact_method_type: "PHONE",
      contact_value: attributes.phone,
      is_primary: true,
    });
  if (attributes.email)
    contactMethods.push({
      contact_method_guid: fixtureGuid(),
      party_guid: party_guid,
      contact_method_type: "EMAILADDR",
      contact_value: attributes.email,
      is_primary: true,
    });

  return {
    party_guid: party_guid,
    party_type: attributes.party_type || "PRS",
    person: {
      person_guid: fixtureGuid(),
      party_guid: party_guid,
      first_name: first_name,
      middle_names: null,
      last_name: last_name,
      date_of_birth: attributes.date_of_birth || null,
      drivers_license_number: attributes.drivers_license_number || null,
      ...FIXTURE_DESCRIPTORS,
    },
    aliases: [],
    addresses: [],
    contactMethods: contactMethods,
  };
};

// Builds one fixture business party from literal values
// Params:
//    attributes = the optional literals this fixture needs: bnum, wsbc, phone, contact
const fixtureBusiness = (name, attributes = {}) => {
  const party_guid = fixtureGuid();
  const business_guid = fixtureGuid();

  const identifiers = [];
  if (attributes.bnum)
    identifiers.push({
      business_identifier_guid: fixtureGuid(),
      business_guid: business_guid,
      business_identifier_code: "BNUM",
      identifier_value: attributes.bnum,
    });
  if (attributes.wsbc)
    identifiers.push({
      business_identifier_guid: fixtureGuid(),
      business_guid: business_guid,
      business_identifier_code: "WSBC",
      identifier_value: attributes.wsbc,
    });

  const contacts = [];
  if (attributes.contact) {
    const contact = fixturePerson(attributes.contact.first_name, attributes.contact.last_name, {
      ...attributes.contact,
      party_type: "CNT",
    });
    contact.xref = {
      business_person_xref_guid: fixtureGuid(),
      business_guid: business_guid,
      person_guid: contact.person.person_guid,
      business_person_xref_code: "CONT",
      is_primary: true,
    };
    contacts.push(contact);
  }

  return {
    party_guid: party_guid,
    party_type: "CMP",
    business: { business_guid: business_guid, party_guid: party_guid, name: name },
    aliases: [],
    addresses: [],
    contactMethods: attributes.phone
      ? [
          {
            contact_method_guid: fixtureGuid(),
            party_guid: party_guid,
            contact_method_type: "PHONE",
            contact_value: attributes.phone,
            is_primary: true,
          },
        ]
      : [],
    identifiers: identifiers,
    contacts: contacts,
  };
};

// The planted recall fixtures - one deterministic case per entry on the recall checklist
const generatePartyFixtures = () => {
  const records = [
    // Typo, similar and sound alike name pairs
    fixturePerson("Fredrick", "Aldergrove"),
    fixturePerson("Frederick", "Aldergrove"),
    fixturePerson("Alex", "Kispiox"),
    fixturePerson("Alec", "Kispiox"),
    fixturePerson("Stephen", "Nechako"),
    fixturePerson("Steven", "Nechako"),

    // Accent variants - the pair must match exactly, not fuzzily
    fixturePerson("Frédéric", "Kootenay"),
    fixturePerson("Frederic", "Kootenay"),

    // Special character variants, and the worked example's three ranked O'Brien candidates
    fixturePerson("Jon", "O'Brien", { date_of_birth: "1985-03-12" }),
    fixturePerson("Jon", "OBrien", { date_of_birth: "1985-03-12" }),
    fixturePerson("Jon", "O Brien", { date_of_birth: "1985-03-12" }),
    fixturePerson("John", "O'Brien", { phone: "+12505551234" }),
    fixturePerson("Jon", "Obrien"),
  ];

  // Identifier crowd out - one drivers licence hidden behind twelve hundred identical names
  for (let i = 0; i < 1200; i++) {
    records.push(fixturePerson("Dale", "Quesnel"));
  }
  records.push(fixturePerson("Dale", "Quesnel", { drivers_license_number: "CROWDOUT1" }));

  // Last name and birthdate saturation - the target sits behind four hundred parties sharing both
  for (let i = 0; i < 400; i++) {
    records.push(
      fixturePerson(FIXTURE_CROWD_NAMES[i % FIXTURE_CROWD_NAMES.length], "Chilcotin", { date_of_birth: "1990-06-15" }),
    );
  }
  records.push(
    fixturePerson("Marguerite", "Chilcotin", { date_of_birth: "1990-06-15" }),

    // Email match
    fixturePerson("Priya", "Similkameen", { email: "party.match.email@fixture.test" }),

    // Business number and WorkSafeBC number match
    fixtureBusiness("Skeena Falls Contracting Ltd.", { bnum: "BNUMFIXTURE1", wsbc: "WSBCFIXTURE1" }),

    // Contact phone and email reach the business, and outrank the business's own phone
    fixtureBusiness("Nechako Valley Consulting Ltd.", {
      phone: "+16045550100",
      contact: {
        first_name: "Marcel",
        last_name: "Bouchard",
        phone: "+12365550147",
        email: "party.match.contact@fixture.test",
      },
    }),

    // Short names, where the trigram branches are skipped
    fixturePerson("Wei", "Li", { date_of_birth: "1979-04-08" }),
    fixturePerson("Jun", "Li", { date_of_birth: "1988-09-22" }),
    fixturePerson("Anna", "Ng", { date_of_birth: "1995-02-11" }),

    // Combination ranking - the name pair alone against the full first, last and birthdate triple
    fixturePerson("Nadia", "Okanagan"),
    fixturePerson("Nadia", "Okanagan", { date_of_birth: "1978-11-02" }),
  );

  return records;
};

const PARTY_COLUMNS = [
  "party_guid",
  "party_type",
  "create_user_id",
  "create_utc_timestamp",
  "update_user_id",
  "update_utc_timestamp",
];
const PERSON_COLUMNS = [
  "person_guid",
  "party_guid",
  "first_name",
  "middle_names",
  "last_name",
  "date_of_birth",
  "drivers_license_number",
  "sex_code",
  "approximate_age_code",
  "height_cm",
  "weight_kg",
  "complexion_code",
  "build_code",
  "hair_colour_code",
  "hair_length_code",
  "eye_colour_code",
  "facial_hair_ind",
  "tattoo_ind",
  "create_user_id",
  "create_utc_timestamp",
  "update_user_id",
  "update_utc_timestamp",
];
const BUSINESS_COLUMNS = [
  "business_guid",
  "party_guid",
  "name",
  "create_user_id",
  "create_utc_timestamp",
  "update_user_id",
  "update_utc_timestamp",
];
const ALIAS_COLUMNS = [
  "alias_guid",
  "party_guid",
  "name",
  "active_ind",
  "create_user_id",
  "create_utc_timestamp",
  "update_user_id",
  "update_utc_timestamp",
];
const ADDRESS_COLUMNS = [
  "address_guid",
  "party_guid",
  "address_name",
  "address",
  "city",
  "country_subdivision_code",
  "postal_code",
  "country_code",
  "is_primary",
  "active_ind",
  "create_user_id",
  "create_utc_timestamp",
  "update_user_id",
  "update_utc_timestamp",
];
const CONTACT_METHOD_COLUMNS = [
  "contact_method_guid",
  "party_guid",
  "contact_method_type",
  "contact_value",
  "is_primary",
  "active_ind",
  "create_user_id",
  "create_utc_timestamp",
  "update_user_id",
  "update_utc_timestamp",
];
const BUSINESS_IDENTIFIER_COLUMNS = [
  "business_identifier_guid",
  "business_guid",
  "business_identifier_code",
  "identifier_value",
  "active_ind",
  "create_user_id",
  "create_utc_timestamp",
  "update_user_id",
  "update_utc_timestamp",
];
const BUSINESS_PERSON_XREF_COLUMNS = [
  "business_person_xref_guid",
  "business_guid",
  "person_guid",
  "business_person_xref_code",
  "active_ind",
  "is_primary",
  "create_user_id",
  "create_utc_timestamp",
  "update_user_id",
  "update_utc_timestamp",
];

// Bulk inserts one table's rows, split into statements of PARTY_CHUNK_SIZE rows to stay under the bind parameter limit
// Params:
//   table = the schema qualified table name
//   columns = the ordered column list every value array matches
//   values = the value arrays
const insertPartyRows = async (table, columns, values) => {
  for (let offset = 0; offset < values.length; offset += PARTY_CHUNK_SIZE) {
    const rows = values.slice(offset, offset + PARTY_CHUNK_SIZE);
    await partyClient.query(
      `INSERT INTO ${table} (
        ${columns.join(",\n        ")}
      ) VALUES
      ${valuePlaceholders(rows.length, columns.length)}`,
      rows.flat(),
    );
  }
};

// Bulk inserts party data in the database.   One transaction per call, no maximum data size
// Params:
//   records: all the data
const insertPartyData = async (records) => {
  const currentTimestamp = new Date().toISOString(); // Get the current timestamp

  // Arrays to hold the data for bulk inserts
  const partyValues = [];
  const personValues = [];
  const businessValues = [];
  const aliasValues = [];
  const addressValues = [];
  const contactMethodValues = [];
  const businessIdentifierValues = [];
  const businessPersonXrefValues = [];

  // Prepare the values for bulk insertion.   Business contacts recurse - they are parties in their own right
  const collectRecord = (record) => {
    partyValues.push([
      record.party_guid,
      record.party_type,
      "Bulk Data Load", // create_user_id
      currentTimestamp, // create_utc_timestamp
      "Bulk Data Load", // update_user_id
      currentTimestamp, // update_utc_timestamp
    ]);

    if (record.person) {
      personValues.push([
        record.person.person_guid,
        record.person.party_guid,
        record.person.first_name,
        record.person.middle_names,
        record.person.last_name,
        record.person.date_of_birth,
        record.person.drivers_license_number,
        record.person.sex_code,
        record.person.approximate_age_code,
        record.person.height_cm,
        record.person.weight_kg,
        record.person.complexion_code,
        record.person.build_code,
        record.person.hair_colour_code,
        record.person.hair_length_code,
        record.person.eye_colour_code,
        record.person.facial_hair_ind,
        record.person.tattoo_ind,
        "Bulk Data Load", // create_user_id
        currentTimestamp, // create_utc_timestamp
        "Bulk Data Load", // update_user_id
        currentTimestamp, // update_utc_timestamp
      ]);
    }

    if (record.business) {
      businessValues.push([
        record.business.business_guid,
        record.business.party_guid,
        record.business.name,
        "Bulk Data Load", // create_user_id
        currentTimestamp, // create_utc_timestamp
        "Bulk Data Load", // update_user_id
        currentTimestamp, // update_utc_timestamp
      ]);
    }

    record.aliases.forEach((alias) => {
      aliasValues.push([
        alias.alias_guid,
        alias.party_guid,
        alias.name,
        true, // active_ind
        "Bulk Data Load", // create_user_id
        currentTimestamp, // create_utc_timestamp
        "Bulk Data Load", // update_user_id
        currentTimestamp, // update_utc_timestamp
      ]);
    });

    record.addresses.forEach((address) => {
      addressValues.push([
        address.address_guid,
        address.party_guid,
        address.address_name,
        address.address,
        address.city,
        address.country_subdivision_code,
        address.postal_code,
        address.country_code,
        address.is_primary,
        true, // active_ind
        "Bulk Data Load", // create_user_id
        currentTimestamp, // create_utc_timestamp
        "Bulk Data Load", // update_user_id
        currentTimestamp, // update_utc_timestamp
      ]);
    });

    record.contactMethods.forEach((contactMethod) => {
      contactMethodValues.push([
        contactMethod.contact_method_guid,
        contactMethod.party_guid,
        contactMethod.contact_method_type,
        contactMethod.contact_value,
        contactMethod.is_primary,
        true, // active_ind
        "Bulk Data Load", // create_user_id
        currentTimestamp, // create_utc_timestamp
        "Bulk Data Load", // update_user_id
        currentTimestamp, // update_utc_timestamp
      ]);
    });

    (record.identifiers || []).forEach((identifier) => {
      businessIdentifierValues.push([
        identifier.business_identifier_guid,
        identifier.business_guid,
        identifier.business_identifier_code,
        identifier.identifier_value,
        true, // active_ind
        "Bulk Data Load", // create_user_id
        currentTimestamp, // create_utc_timestamp
        "Bulk Data Load", // update_user_id
        currentTimestamp, // update_utc_timestamp
      ]);
    });

    (record.contacts || []).forEach((contact) => {
      collectRecord(contact);
      businessPersonXrefValues.push([
        contact.xref.business_person_xref_guid,
        contact.xref.business_guid,
        contact.xref.person_guid,
        contact.xref.business_person_xref_code,
        true, // active_ind
        contact.xref.is_primary,
        "Bulk Data Load", // create_user_id
        currentTimestamp, // create_utc_timestamp
        "Bulk Data Load", // update_user_id
        currentTimestamp, // update_utc_timestamp
      ]);
    });
  };

  records.forEach(collectRecord);

  try {
    // Begin transaction
    await partyClient.query("BEGIN");

    // Bulk inserts in foreign key order
    await insertPartyRows("shared.party", PARTY_COLUMNS, partyValues);
    await insertPartyRows("shared.person", PERSON_COLUMNS, personValues);
    await insertPartyRows("shared.business", BUSINESS_COLUMNS, businessValues);
    await insertPartyRows("shared.alias", ALIAS_COLUMNS, aliasValues);
    await insertPartyRows("shared.address", ADDRESS_COLUMNS, addressValues);
    await insertPartyRows("shared.contact_method", CONTACT_METHOD_COLUMNS, contactMethodValues);
    await insertPartyRows("shared.business_identifier", BUSINESS_IDENTIFIER_COLUMNS, businessIdentifierValues);
    await insertPartyRows("shared.business_person_xref", BUSINESS_PERSON_XREF_COLUMNS, businessPersonXrefValues);

    // Commit transaction
    await partyClient.query("COMMIT");
  } catch (err) {
    console.error("Error loading data:", err);
    await partyClient.query("ROLLBACK");
    throw err;
  }

  return partyValues.length;
};

// The main driver method for generating party data.   Loops chunks so there is no cap on numRecords
// Params:
//     numRecords = how many parties to generate.   Business contacts are generated on top of this count
//     disableTriggers = skip the audit history triggers for the load.   Requires the superuser connection
const generatePartyData = async (numRecords, disableTriggers) => {
  await partyClient.connect();

  try {
    if (disableTriggers) {
      await partyClient.query("SET session_replication_role = replica");
      console.log("Audit history triggers disabled for this session");
    }

    const fixtureRows = await insertPartyData(generatePartyFixtures());
    console.log(`Inserted ${fixtureRows} recall fixture parties`);

    let generated = 0;
    while (generated < numRecords) {
      const chunk = [];
      while (chunk.length < PARTY_CHUNK_SIZE && generated + chunk.length < numRecords) {
        chunk.push(...generatePartyRecords());
      }
      const inserted = await insertPartyData(chunk);
      generated += chunk.length;
      console.log(`Inserted ${inserted} party rows, ${generated} of ${numRecords} parties generated`);
    }
  } finally {
    await partyClient.end();
  }
};

// Main method.   Exists in order to synchronously handle data dependencies (e.g. make sure cases are inserted first, then wildlife, then everything else.)
const main = async () => {
  // Adjust these as required.
  // This script assumes requisite complaint data exists and that there are no conflicts in the case management database
  const yearPrefix = 25; // The year prefix of the complaint
  const startingSequence = 0; // The complaint sequence number you want to start at
  const numRecords = 4000; // How many records are being generated.  4K Max for HWCR and CEEB, no maximum for PARTY
  const type = "HWCR"; // The Type of case to generate.   Currently supported: HWCR, CEEB, PARTY
  const disableTriggers = false; // PARTY only.  Turns off the audit history triggers for the load

  // Party data is generated and inserted in chunks, so it takes neither the complaint parameters nor the cap
  if (type === "PARTY") {
    await generatePartyData(numRecords, disableTriggers);
    return;
  }

  // Validate parameters
  if (numRecords > 4000) {
    console.log("Please adjust the numRecords parameter to be less than 4000");
    return;
  }

  client.connect();

  // Ensure that the bulk data is generated before starting insertion
  const records = await generateBulkData(yearPrefix, numRecords, type, startingSequence);
  if (type === "HWCR") {
    await insertHWCRData(records);
  } else {
    await insertCEEBData(records);
  }
};

main().catch((err) => {
  console.error("Error running the main process:", err);
});
