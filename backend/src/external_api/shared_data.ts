import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";

const caseManagementlURL = process.env.CASE_MANAGEMENT_API_URL;

axios.interceptors.response.use(undefined, (error: AxiosError) => {
  console.error(error.response);
  return Promise.reject(error as Error);
});

export const appUserQueryFields: string = `
{
  appUserGuid
  authUserGuid
  userId
  firstName
  lastName
  comsEnrolledIndicator
  deactivateIndicator
  agencyCode
  officeGuid
  parkAreaGuid
}
`;

export const officeQueryFields: string = `
{
  officeGuid
  geoOrganizationUnitCode
  agencyCode
}
`;

export const teamQueryFields: string = `
{
  teamGuid
  teamCode
  agencyCode
  activeIndicator
}
`;

export const teamCodeQueryFields: string = `
{
  teamCode
  shortDescription
  longDescription
  displayOrder
  activeIndicator
}
`;

export const geoOrganizationUnitCodeQueryFields: string = `
{
  geoOrganizationUnitCode
  shortDescription
  longDescription
  effectiveDate
  expiryDate
  geoOrgUnitTypeCode
  administrativeOfficeIndicator
}
`;

export const geoOrgUnitTypeCodeQueryFields: string = `
{
  geoOrgUnitTypeCode
  shortDescription
  longDescription
  displayOrder
  activeIndicator
}
`;

export const cosGeoOrgUnitQueryFields: string = `
{
  regionCode
  regionName
  zoneCode
  zoneName
  officeLocationCode
  officeLocationName
  areaCode
  areaName
  administrativeOfficeIndicator
}
`;

export const caseFileQueryFields: string = `
{
  complaintOutcomeGuid
  complaintId
  assessment {
    id
    outcomeAgencyCode
    actionNotRequired
    actionJustificationCode
    actionJustificationShortDescription
    actionJustificationLongDescription
    actionJustificationActiveIndicator
    actions {
      actionId
      actor
      date
      actionCode
      shortDescription
      longDescription
      activeIndicator
      isLegacy
    }
    contactedComplainant
    attended
    locationType {
      key
      value
    }
    conflictHistory {
      key
      value
    }
    categoryLevel {
      key
      value
    }
    cat1Actions {
      actionId
      actor
      date
      actionCode
      shortDescription
      longDescription
      activeIndicator
    }
  }
  isReviewRequired
  reviewComplete {
    actor
    date
    actionCode
    actionId
    activeIndicator
  }
  prevention {
    id
    outcomeAgencyCode
    actions {
      actionId
      actor
      date
      actionCode
      shortDescription
      longDescription
      activeIndicator
    }
  }
  notes {
    id
    note 
    outcomeAgencyCode
    actions { 
      actor
      actionCode
      date,
      actionId,
      activeIndicator
    }
  }
  equipment {
    id
    typeCode
    typeDescription
    activeIndicator
    address
    xCoordinate
    yCoordinate
    createDate
    actions { 
      actionId
      actor
      actionCode
      date
    }
    wasAnimalCaptured
    quantity
  },
  subject { 
    id
    species
    sex
    sexDescription
    age
    ageDescription
    categoryLevel
    categoryLevelDescription
    identifyingFeatures
    outcome
    outcomeDescription
    outcomeActionedBy
    outcomeActionedByDescription
    tags { 
      id
      ear
      earDescription
      identifier
      order
    }
    drugs { 
      id
      vial
      drug
      drugDescription
      amountUsed
      injectionMethod
      injectionMethodDescription
      remainingUse
      remainingUseDescription
      additionalComments
      order
    }
    actions { 
      actionId
      actor
      actionCode
      date
    }
    order
  }
  decision { 
    id
    schedule
    scheduleLongDescription
    sector
    sectorLongDescription
    discharge
    dischargeLongDescription
    ipmAuthCategory
    ipmAuthCategoryLongDescription
    nonCompliance
    nonComplianceLongDescription
    rationale
    inspectionNumber
    leadAgency
    leadAgencyLongDescription
    assignedTo
    actionTaken
    actionTakenLongDescription
    actionTakenDate
  }
  authorization { 
    id
    type
    value
  }
}
`;

export const get = (token, params?: {}) => {
  let config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (params) {
    config.params = params;
  }
  return axios
    .get(caseManagementlURL, config)
    .then((response: AxiosResponse) => {
      const { data } = response;
      return data;
    })
    .catch((error: AxiosError) => {
      if (error.response) {
        const data = error.response?.data as any;
        throw new Error(`Shared Data Request Failed: ${JSON.stringify(data?.errors)}`);
      } else if (error.request) {
        throw new Error(`No response received from the Shared Data server: ${caseManagementlURL}`);
      } else {
        throw new Error(`Request setup error to Shared Data: ${error.message}`);
      }
    });
};

export const post = (token, payload?: {}) => {
  let config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return axios
    .post(caseManagementlURL, payload, config)
    .then((response: AxiosResponse) => {
      return { response: response, error: null as AxiosError };
    })
    .catch((error: AxiosError) => {
      return { response: null as AxiosResponse, error: error };
    });
};

export const getAppUsers = async (token: string, officeGuids?: string[], agencyCode?: string) => {
  let queryParams = "";
  if (officeGuids && officeGuids.length > 0) {
    const guidsParam = officeGuids.map((guid) => `"${guid}"`).join(", ");
    queryParams = `officeGuids: [${guidsParam}]`;
  }
  if (agencyCode) queryParams += (queryParams ? ", " : "") + `agencyCode: "${agencyCode}"`;

  const query = queryParams ? `{appUsers(${queryParams}) ${appUserQueryFields}}` : `{appUsers ${appUserQueryFields}}`;

  const { data, errors } = await get(token, { query });

  if (errors) {
    throw new Error(`GraphQL errors occurred while fetching app users: ${JSON.stringify(errors)}`);
  }

  return data?.appUsers || [];
};

export const getAppUserByGuid = async (token: string, appUserGuid: string) => {
  const { data, errors } = await get(token, {
    query: `{appUser(appUserGuid: "${appUserGuid}") ${appUserQueryFields}}`,
  });

  if (errors) {
    throw new Error(`GraphQL errors occurred while fetching app user: ${JSON.stringify(errors)}`);
  }

  return data?.appUser || null;
};

export const getAppUserByUserId = async (token: string, userId: string) => {
  const { data, errors } = await get(token, {
    query: `{appUser(userId: "${userId}") ${appUserQueryFields}}`,
  });

  if (errors) {
    throw new Error(`GraphQL errors occurred while fetching app user by userId: ${JSON.stringify(errors)}`);
  }

  return data?.appUser || null;
};

export const getAppUserByAuthUserGuid = async (token: string, authUserGuid: string) => {
  const { data, errors } = await get(token, {
    query: `{appUser(authUserGuid: "${authUserGuid}") ${appUserQueryFields}}`,
  });

  if (errors) {
    throw new Error(
      `GraphQL errors occurred while fetching app user by authUserGuid (${authUserGuid}): ${JSON.stringify(errors)}`,
    );
  }

  return data?.appUser || null;
};

export const searchAppUsers = async (token: string, searchTerm: string) => {
  const { data, errors } = await get(token, {
    query: `{searchAppUsers(searchTerm: "${searchTerm}") ${appUserQueryFields}}`,
  });

  if (errors) {
    throw new Error(`GraphQL errors occurred while searching app users: ${JSON.stringify(errors)}`);
  }

  return data?.searchAppUsers || [];
};

export const getOffices = async (token: string, geoOrganizationUnitCodes?: string[], agencyCode?: string) => {
  let queryParams = "";
  if (geoOrganizationUnitCodes && geoOrganizationUnitCodes.length > 0) {
    const codesParam = geoOrganizationUnitCodes.map((code) => `"${code}"`).join(", ");
    queryParams = `geoOrganizationUnitCodes: [${codesParam}]`;
  }
  if (agencyCode) queryParams += (queryParams ? ", " : "") + `agencyCode: "${agencyCode}"`;

  const query = queryParams ? `{offices(${queryParams}) ${officeQueryFields}}` : `{offices ${officeQueryFields}}`;

  const { data, errors } = await get(token, { query });

  if (errors) {
    throw new Error(`GraphQL errors occurred while fetching offices: ${JSON.stringify(errors)}`);
  }

  return data?.offices || [];
};

export const getOfficeByGuid = async (token: string, officeGuid: string) => {
  const { data, errors } = await get(token, {
    query: `{office(officeGuid: "${officeGuid}") ${officeQueryFields}}`,
  });

  if (errors) {
    throw new Error(`GraphQL errors occurred while fetching office: ${JSON.stringify(errors)}`);
  }

  return data?.office || null;
};

export const getOfficeByGeoCode = async (token: string, geoOrganizationUnitCode: string, agencyCode?: string) => {
  let queryParams = `geoOrganizationUnitCode: "${geoOrganizationUnitCode}"`;
  if (agencyCode) {
    queryParams += `, agencyCode: "${agencyCode}"`;
  }

  const { data, errors } = await get(token, {
    query: `{office(${queryParams}) ${officeQueryFields}}`,
  });

  if (errors) {
    throw new Error(`GraphQL errors occurred while fetching office by geo code: ${JSON.stringify(errors)}`);
  }

  return data?.office || null;
};

const officeWithrelatedDataFields = `{
  officeGuid
  geoOrganizationUnitCode
  agencyCode
  createUserId
  createTimestamp
  updateUserId
  updateTimestamp
  cosGeoOrgUnit {
    regionCode
    regionName
    zoneCode
    zoneName
    officeLocationCode
    officeLocationName
    areaCode
    areaName
    administrativeOfficeIndicator
  }
  appUsers {
    appUserGuid
    authUserGuid
    userId
    firstName
    lastName
    agencyCode
    officeGuid
    comsEnrolledIndicator
    deactivateIndicator
  }
}`;

export const getOfficesByZone = async (token: string, zoneCode: string) => {
  const { data, errors } = await get(token, {
    query: `{officesByZone(zoneCode: "${zoneCode}") ${officeWithrelatedDataFields}}`,
  });

  if (errors) {
    throw new Error(`GraphQL errors occurred while fetching offices by zone: ${JSON.stringify(errors)}`);
  }

  return data?.officesByZone || [];
};

export const getTeams = async (token: string, teamCode?: string, agencyCode?: string) => {
  let queryParams = "";
  if (teamCode) queryParams = `teamCode: "${teamCode}"`;
  if (agencyCode) queryParams += (queryParams ? ", " : "") + `agencyCode: "${agencyCode}"`;

  const query = queryParams ? `{teams(${queryParams}) ${teamQueryFields}}` : `{teams ${teamQueryFields}}`;

  const { data, errors } = await get(token, { query });

  if (errors) {
    throw new Error(`GraphQL errors occurred while fetching teams: ${JSON.stringify(errors)}`);
  }

  return data?.teams || [];
};

export const getTeamByGuid = async (token: string, teamGuid: string) => {
  const { data, errors } = await get(token, {
    query: `{team(teamGuid: "${teamGuid}") ${teamQueryFields}}`,
  });

  if (errors) {
    throw new Error(`GraphQL errors occurred while fetching team: ${JSON.stringify(errors)}`);
  }

  return data?.team || null;
};

export const getTeamCodes = async (token: string) => {
  const { data, errors } = await get(token, {
    query: `{teamCodes ${teamCodeQueryFields}}`,
  });

  if (errors) {
    throw new Error(`GraphQL errors occurred while fetching team codes: ${JSON.stringify(errors)}`);
  }

  return data?.teamCodes || [];
};

export const getGeoOrganizationUnitCodes = async (token: string) => {
  const { data, errors } = await get(token, {
    query: `{geoOrganizationUnitCodes ${geoOrganizationUnitCodeQueryFields}}`,
  });

  if (errors) {
    throw new Error(`GraphQL errors occurred while fetching geo organization unit codes: ${JSON.stringify(errors)}`);
  }

  return data?.geoOrganizationUnitCodes || [];
};

export const getGeoOrgUnitTypeCodes = async (token: string) => {
  const { data, errors } = await get(token, {
    query: `{geoOrgUnitTypeCodes ${geoOrgUnitTypeCodeQueryFields}}`,
  });

  if (errors) {
    throw new Error(`GraphQL errors occurred while fetching geo org unit type codes: ${JSON.stringify(errors)}`);
  }

  return data?.geoOrgUnitTypeCodes || [];
};

export const getCosGeoOrgUnits = async (
  token: string,
  zoneCode?: string,
  regionCode?: string,
  distinctOfficeLocations?: boolean,
) => {
  let queryParams = "";
  if (zoneCode) queryParams = `zoneCode: "${zoneCode}"`;
  if (regionCode) queryParams += (queryParams ? ", " : "") + `regionCode: "${regionCode}"`;
  if (distinctOfficeLocations)
    queryParams += (queryParams ? ", " : "") + `distinctOfficeLocations: ${distinctOfficeLocations}`;

  const query = queryParams
    ? `{cosGeoOrgUnits(${queryParams}) ${cosGeoOrgUnitQueryFields}}`
    : `{cosGeoOrgUnits ${cosGeoOrgUnitQueryFields}}`;

  const { data, errors } = await get(token, { query });

  if (errors) {
    throw new Error(`GraphQL errors occurred while fetching COS geo org units: ${JSON.stringify(errors)}`);
  }

  return data?.cosGeoOrgUnits || [];
};

export const getCosGeoOrgUnitsByZone = async (token: string, zoneCode: string) => {
  return getCosGeoOrgUnits(token, zoneCode); // Now uses server-side filtering
};

export const searchCosGeoOrgUnitsByNames = async (
  token: string,
  zoneName?: string,
  regionName?: string,
  areaName?: string,
  officeLocationName?: string,
  distinctOfficeLocations?: boolean,
) => {
  let queryParams = "";
  if (zoneName) queryParams = `zoneName: "${zoneName}"`;
  if (regionName) queryParams += (queryParams ? ", " : "") + `regionName: "${regionName}"`;
  if (areaName) queryParams += (queryParams ? ", " : "") + `areaName: "${areaName}"`;
  if (officeLocationName) queryParams += (queryParams ? ", " : "") + `officeLocationName: "${officeLocationName}"`;
  if (distinctOfficeLocations)
    queryParams += (queryParams ? ", " : "") + `distinctOfficeLocations: ${distinctOfficeLocations}`;

  const query = queryParams
    ? `{searchCosGeoOrgUnitsByNames(${queryParams}) ${cosGeoOrgUnitQueryFields}}`
    : `{searchCosGeoOrgUnitsByNames ${cosGeoOrgUnitQueryFields}}`;

  const { data, errors } = await get(token, { query });

  if (errors) {
    throw new Error(`Error fetching cos geo org units by names: ${JSON.stringify(errors)}`);
  }

  return data?.searchCosGeoOrgUnitsByNames || [];
};

export const getCosGeoOrgUnitsByRegion = async (token: string, regionCode: string) => {
  const units = await getCosGeoOrgUnits(token);
  return units.filter((unit: any) => unit.regionCode === regionCode);
};

export const getCosGeoOrgUnitRegions = async (token: string) => {
  const units = await getCosGeoOrgUnits(token);
  const regionMap = new Map();

  for (const unit of units) {
    if (!regionMap.has(unit.regionCode)) {
      regionMap.set(unit.regionCode, {
        code: unit.regionCode,
        name: unit.regionName,
      });
    }
  }

  return Array.from(regionMap.values()).sort((a, b) => a.name.localeCompare(b.name));
};

export const getCosGeoOrgUnitZones = async (token: string) => {
  const units = await getCosGeoOrgUnits(token);
  const zoneMap = new Map();

  for (const unit of units) {
    if (!zoneMap.has(unit.zoneCode)) {
      zoneMap.set(unit.zoneCode, {
        code: unit.zoneCode,
        name: unit.zoneName,
        region: unit.regionCode,
      });
    }
  }

  return Array.from(zoneMap.values()).sort((a, b) => a.name.localeCompare(b.name));
};

export const getCosGeoOrgUnitCommunities = async (token: string) => {
  const units = await getCosGeoOrgUnits(token);
  const communityMap = new Map();

  for (const unit of units) {
    if (unit.areaCode && !communityMap.has(unit.areaCode)) {
      communityMap.set(unit.areaCode, {
        code: unit.areaCode,
        name: unit.areaName,
        zone: unit.zoneCode,
        region: unit.regionCode,
      });
    }
  }

  return Array.from(communityMap.values()).sort((a, b) => a.name.localeCompare(b.name));
};

export const createAppUser = async (token: string, input: any) => {
  const { response, error } = await post(token, {
    query: `mutation CreateAppUser($input: CreateAppUserInput!) {
      createAppUser(input: $input) ${appUserQueryFields}
    }`,
    variables: { input },
  });

  if (error) {
    throw new Error(`GraphQL errors occurred while creating app user: ${JSON.stringify(error)}`);
  }

  return response?.data?.data?.createAppUser || null;
};

export const updateAppUser = async (token: string, appUserGuid: string, input: any) => {
  const { response, error } = await post(token, {
    query: `mutation UpdateAppUser($appUserGuid: String!, $input: UpdateAppUserInput!) {
      updateAppUser(appUserGuid: $appUserGuid, input: $input) ${appUserQueryFields}
    }`,
    variables: { appUserGuid, input },
  });

  if (error) {
    throw new Error(`GraphQL errors occurred while updating app user: ${JSON.stringify(error)}`);
  }

  return response?.data?.data?.updateAppUser || null;
};

export const getAppUserTeamXref = async (token: string, appUserGuid: string) => {
  const { data, errors } = await get(token, {
    query: `{appUserTeamXref(appUserGuid: "${appUserGuid}") {
      appUserTeamXrefGuid
      appUserGuid
      teamGuid
      activeIndicator
    }}`,
  });

  if (errors) {
    throw new Error(`GraphQL errors occurred while fetching app user team xref: ${JSON.stringify(errors)}`);
  }

  return data?.appUserTeamXref || null;
};

export const createAppUserTeamXref = async (token: string, input: any) => {
  const { response, error } = await post(token, {
    query: `mutation CreateAppUserTeamXref($input: CreateAppUserTeamXrefInput!) {
      createAppUserTeamXref(input: $input) {
        appUserTeamXrefGuid
        appUserGuid
        teamGuid
        activeIndicator
      }
    }`,
    variables: { input },
  });

  if (error) {
    throw new Error(`GraphQL errors occurred while creating app user team xref: ${JSON.stringify(error)}`);
  }

  return response?.data?.data?.createAppUserTeamXref || null;
};

export const updateAppUserTeamXref = async (token: string, appUserGuid: string, input: any) => {
  const { response, error } = await post(token, {
    query: `mutation UpdateAppUserTeamXref($appUserGuid: String!, $input: UpdateAppUserTeamXrefInput!) {
      updateAppUserTeamXref(appUserGuid: $appUserGuid, input: $input) {
        appUserTeamXrefGuid
        appUserGuid
        teamGuid
        activeIndicator
      }
    }`,
    variables: { appUserGuid, input },
  });

  if (error) {
    throw new Error(`GraphQL errors occurred while updating app user team xref: ${JSON.stringify(error)}`);
  }

  return response?.data?.data?.updateAppUserTeamXref || null;
};

export const deleteAppUserTeamXref = async (token: string, appUserTeamXrefGuid: string) => {
  const { response, error } = await post(token, {
    query: `mutation DeleteAppUserTeamXref($appUserTeamXrefGuid: String!) {
      deleteAppUserTeamXref(appUserTeamXrefGuid: $appUserTeamXrefGuid)
    }`,
    variables: { appUserTeamXrefGuid },
  });

  if (error) {
    throw new Error(`GraphQL errors occurred while deleting app user team xref: ${JSON.stringify(error)}`);
  }

  return response?.data?.data?.deleteAppUserTeamXref || false;
};

export const createOffice = async (token: string, input: any) => {
  const { response, error } = await post(token, {
    query: `mutation CreateOffice($input: CreateOfficeInput!) {
      createOffice(input: $input) ${officeQueryFields}
    }`,
    variables: { input },
  });

  if (error) {
    throw new Error(`GraphQL errors occurred while creating office: ${JSON.stringify(error)}`);
  }

  return response?.data?.data?.createOffice || null;
};

export const updateOffice = async (token: string, officeGuid: string, input: any) => {
  const { response, error } = await post(token, {
    query: `mutation UpdateOffice($officeGuid: String!, $input: UpdateOfficeInput!) {
      updateOffice(officeGuid: $officeGuid, input: $input) ${officeQueryFields}
    }`,
    variables: { officeGuid, input },
  });

  if (error) {
    throw new Error(`GraphQL errors occurred while updating office: ${JSON.stringify(error)}`);
  }

  return response?.data?.data?.updateOffice || null;
};
