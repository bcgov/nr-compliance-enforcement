const agencyCollection = [
  {
    agency_code: "PARKS",
    short_description: "BC Parks",
    long_description: "BC Parks",
    display_order: 1,
    active_ind: true,
  },
  {
    agency_code: "COS",
    short_description: "COS",
    long_description: "Conservation Officer Service",
    display_order: 2,
    active_ind: true,
  },
  {
    agency_code: "EPO",
    short_description: "EPO",
    long_description: "Compliance and Environmental Enforcement Branch",
    display_order: 3,
    active_ind: true,
  },
];

const reportedByCollection = [
  { reported_by_code: "911", short_description: "911", long_description: "911", display_order: 1, active_ind: true },
  {
    reported_by_code: "BCWF",
    short_description: "BCWF",
    long_description: "BC Wildlife Federation",
    display_order: 2,
    active_ind: true,
  },
  {
    reported_by_code: "BYLAW",
    short_description: "Bylaw Enforcement",
    long_description: "Bylaw Enforcement",
    display_order: 3,
    active_ind: true,
  },
  {
    reported_by_code: "CEB",
    short_description: "FOR",
    long_description: "Forestry Compliance and Enforcement Branch",
    display_order: 4,
    active_ind: true,
  },
  {
    reported_by_code: "COS",
    short_description: "COS",
    long_description: "Conservation Officer Service",
    display_order: 5,
    active_ind: true,
  },
  {
    reported_by_code: "DFO",
    short_description: "DFO",
    long_description: "Department of Fisheries and Oceans",
    display_order: 6,
    active_ind: true,
  },
  {
    reported_by_code: "EMAILRAPP",
    short_description: "RAPP Email",
    long_description: "RAPP Email",
    display_order: 7,
    active_ind: true,
  },
  {
    reported_by_code: "EPO",
    short_description: "Other",
    long_description: "Other",
    display_order: 8,
    active_ind: true,
  },
  { reported_by_code: "LE", short_description: "Police", long_description: "RCMP", display_order: 9, active_ind: true },
  {
    reported_by_code: "NRO",
    short_description: "Natural Resource Officer",
    long_description: "Natural Resource Officer",
    display_order: 10,
    active_ind: true,
  },
  {
    reported_by_code: "OTHER",
    short_description: "Other",
    long_description: "Other",
    display_order: 11,
    active_ind: true,
  },
  {
    reported_by_code: "SELF",
    short_description: "Self",
    long_description: "Self",
    display_order: 12,
    active_ind: true,
  },
];

const attractants = [
  {
    attractant_code: "BEEHIVE",
    short_description: "Beehive",
    long_description: "Beehive",
    display_order: 2,
    active_ind: true,
  },
  {
    attractant_code: "BIRD FDR",
    short_description: "Bird Feeder",
    long_description: "Bird Feeder",
    display_order: 3,
    active_ind: true,
  },
  {
    attractant_code: "CAMP FD",
    short_description: "Campground Food",
    long_description: "Campground Food",
    display_order: 4,
    active_ind: true,
  },
  {
    attractant_code: "COMPOST",
    short_description: "Compost",
    long_description: "Compost",
    display_order: 5,
    active_ind: true,
  },
  {
    attractant_code: "CROPS",
    short_description: "Crops",
    long_description: "Crops",
    display_order: 6,
    active_ind: true,
  },
  {
    attractant_code: "FREEZER",
    short_description: "Freezer",
    long_description: "Freezer",
    display_order: 7,
    active_ind: true,
  },
  {
    attractant_code: "BBQ",
    short_description: "BBQ",
    long_description: "Barbeque",
    display_order: 1,
    active_ind: true,
  },
  {
    attractant_code: "RESFRUIT",
    short_description: "Fruit/Berries",
    long_description: "Residential Fruit/Berries",
    display_order: 8,
    active_ind: true,
  },
];

const complaitStatus = [
  {
    complaint_status_code: "OPEN",
    short_description: "OPEN",
    long_description: "Open",
    display_order: 1,
    active_ind: true,
  },
  {
    complaint_status_code: "CLOSED",
    short_description: "CLOSED",
    long_description: "Closed",
    display_order: 1,
    active_ind: true,
  },
];

const natureOfComplaints = [
  {
    hwcr_complaint_nature_code: "AGGNOT",
    short_description: "AGGNOT",
    long_description: "Aggressive - not present",
    display_order: 1,
    active_ind: true,
  },
  {
    hwcr_complaint_nature_code: "AGGPRES",
    short_description: "AGGPRES",
    long_description: "Aggressive - present/recent",
    display_order: 2,
    active_ind: true,
  },
  {
    hwcr_complaint_nature_code: "CONFINED",
    short_description: "CONFINED",
    long_description: "Confined",
    display_order: 3,
    active_ind: true,
  },
  {
    hwcr_complaint_nature_code: "DAMNP",
    short_description: "DAMNP",
    long_description: "Damage to property - not present",
    display_order: 5,
    active_ind: true,
  },
  {
    hwcr_complaint_nature_code: "DEADNV",
    short_description: "DEADNV",
    long_description: "Dead wildlife - no violation suspected",
    display_order: 6,
    active_ind: true,
  },
];

const organizationUnitTypes = [
  {
    geo_org_unit_type_code: "ZONE",
    short_description: "Zone",
    long_description: null,
    display_order: 1,
    active_ind: true,
  },
  {
    geo_org_unit_type_code: "REGION",
    short_description: "Region",
    long_description: null,
    display_order: 2,
    active_ind: true,
  },
  {
    geo_org_unit_type_code: "OFFLOC",
    short_description: "Office Location",
    long_description: null,
    display_order: 3,
    active_ind: true,
  },
  {
    geo_org_unit_type_code: "AREA",
    short_description: "Area",
    long_description: null,
    display_order: 4,
    active_ind: true,
  },
];

const organizationUnits = [
  {
    organizationUnit: "OKNGN",
    shortDescription: "Okanagan",
    longDescription: "Okanagan",
    organizationUnitType: "REGION",
  },
  {
    organizationUnit: "OMINECA",
    shortDescription: "Omineca",
    longDescription: "Omineca",
    organizationUnitType: "REGION",
  },
  {
    organizationUnit: "BLKYCSR",
    shortDescription: "Bulkley-Cassiar",
    longDescription: "Bulkley-Cassiar",
    organizationUnitType: "ZONE",
  },
  {
    organizationUnit: "CRBOCHLCTN",
    shortDescription: "Cariboo Chilcotin",
    longDescription: "Cariboo Chilcotin",
    organizationUnitType: "ZONE",
  },
  {
    organizationUnit: "CHTWD",
    shortDescription: "Chetwynd",
    longDescription: "Chetwynd",
    organizationUnitType: "OFFLOC",
  },
];

const personTypes = [
  {
    person_complaint_xref_code: "ASSIGNEE",
    short_description: "Officer Assigned",
    long_description: "The person to whom the complaint is assigned to.",
    display_order: 1,
  },
  {
    person_complaint_xref_code: "TEST",
    short_description: "TEST",
    long_description: "Test person type",
    display_order: 2,
  },
];

const species = [
  {
    species_code: "BISON",
    short_description: "Bison",
    long_description: "Bison",
    display_order: 1,
    active_ind: true,
    legacy_code: null,
  },
  {
    species_code: "BLKBEAR",
    short_description: "Black Bear",
    long_description: "Black Bear",
    display_order: 2,
    active_ind: true,
    legacy_code: null,
  },
  {
    species_code: "BOBCAT",
    short_description: "Bobcat",
    long_description: "Bobcat",
    display_order: 3,
    active_ind: true,
    legacy_code: null,
  },
  {
    species_code: "COUGAR",
    short_description: "Cougar",
    long_description: "Cougar",
    display_order: 4,
    active_ind: true,
    legacy_code: null,
  },
  {
    species_code: "COYOTE",
    short_description: "Coyote",
    long_description: "Coyote",
    display_order: 5,
    active_ind: true,
    legacy_code: null,
  },
  {
    species_code: "DEER",
    short_description: "Deer",
    long_description: "Deer",
    display_order: 6,
    active_ind: true,
    legacy_code: null,
  },
];

const violations = [
  {
    violation_code: "AINVSPC",
    short_description: "AINVSPC",
    long_description: "Aquatic: Invasive Species",
    display_order: 1,
    active_ind: true,
    agency_code: { agency_code: "COS" },
  },
  {
    violation_code: "BOATING",
    short_description: "BOATING",
    long_description: "Boating",
    display_order: 2,
    active_ind: true,
    agency_code: { agency_code: "COS" },
  },
  {
    violation_code: "DUMPING",
    short_description: "DUMPING",
    long_description: "Dumping",
    display_order: 3,
    active_ind: true,
    agency_code: { agency_code: "COS" },
  },
  {
    violation_code: "FISHERY",
    short_description: "FISHERY",
    long_description: "Fisheries",
    display_order: 4,
    active_ind: true,
    agency_code: { agency_code: "COS" },
  },
  {
    violation_code: "ORV",
    short_description: "ORV",
    long_description: "Off-road vehicles (ORV)",
    display_order: 5,
    active_ind: true,
    agency_code: { agency_code: "COS" },
  },
  {
    violation_code: "OPENBURN",
    short_description: "OPENBURN",
    long_description: "Open Burning",
    display_order: 6,
    active_ind: true,
    agency_code: { agency_code: "COS" },
  },
  {
    violation_code: "OTHER",
    short_description: "OTHER",
    long_description: "Other",
    display_order: 7,
    active_ind: true,
    agency_code: { agency_code: "COS" },
  },
  {
    violation_code: "PESTICDE",
    short_description: "PESTICDE",
    long_description: "Pesticide",
    display_order: 8,
    active_ind: true,
    agency_code: { agency_code: "COS" },
  },
  {
    violation_code: "RECREATN",
    short_description: "RECREATN",
    long_description: "Recreation sites/ trails",
    display_order: 9,
    active_ind: true,
    agency_code: { agency_code: "COS" },
  },
];

const cosOrganizationUnits = [
  {
    zone_code: "CLMBAKTNY",
    region_code: "KTNY",
    region_name: "Kootenay",
    zone_name: "Columbia/Kootenay",
    office_location_code: "GLDN",
    office_location_name: "Golden",
    area_code: "BLBRY",
    area_name: "Blaeberry",
  },
  {
    zone_code: "CLMBAKTNY",
    region_code: "KTNY",
    region_name: "Kootenay",
    zone_name: "Columbia/Kootenay",
    office_location_code: "GLDN",
    office_location_name: "Golden",
    area_code: "BRS",
    area_name: "Brisco",
  },
  {
    zone_code: "CLMBAKTNY",
    region_code: "KTNY",
    region_name: "Kootenay",
    zone_name: "Columbia/Kootenay",
    office_location_code: "GLDN",
    office_location_name: "Golden",
    area_code: "CMB",
    area_name: "Cambie",
  },
  {
    zone_code: "CLMBAKTNY",
    region_code: "KTNY",
    region_name: "Kootenay",
    zone_name: "Columbia/Kootenay",
    office_location_code: "GLDN",
    office_location_name: "Golden",
    area_code: "CMRNE",
    area_name: "Camborne",
  },
  {
    zone_code: "CLMBAKTNY",
    region_code: "KTNY",
    region_name: "Kootenay",
    zone_name: "Columbia/Kootenay",
    office_location_code: "GLDN",
    office_location_name: "Golden",
    area_code: "CRSRLAKE",
    area_name: "Coursier Lake",
  },
  {
    zone_code: "CLMBAKTNY",
    region_code: "KTNY",
    region_name: "Kootenay",
    zone_name: "Columbia/Kootenay",
    office_location_code: "GLDN",
    office_location_name: "Golden",
    area_code: "DONALD",
    area_name: "Donald",
  },
  {
    zone_code: "CLMBAKTNY",
    region_code: "KTNY",
    region_name: "Kootenay",
    zone_name: "Columbia/Kootenay",
    office_location_code: "GLDN",
    office_location_name: "Golden",
    area_code: "FTRESSLK",
    area_name: "Fortress Lake",
  },
  {
    zone_code: "CLMBAKTNY",
    region_code: "KTNY",
    region_name: "Kootenay",
    zone_name: "Columbia/Kootenay",
    office_location_code: "GLDN",
    office_location_name: "Golden",
    area_code: "GOLDEN",
    area_name: "Golden",
  },
  {
    zone_code: "CLMBAKTNY",
    region_code: "KTNY",
    region_name: "Kootenay",
    zone_name: "Columbia/Kootenay",
    office_location_code: "GLDN",
    office_location_name: "Golden",
    area_code: "GRIFFNLK",
    area_name: "Griffin Lake",
  },
  {
    zone_code: "CLMBAKTNY",
    region_code: "KTNY",
    region_name: "Kootenay",
    zone_name: "Columbia/Kootenay",
    office_location_code: "GLDN",
    office_location_name: "Golden",
    area_code: "HARROGAT",
    area_name: "Harrogate",
  },
  {
    zone_code: "CLMBAKTNY",
    region_code: "KTNY",
    region_name: "Kootenay",
    zone_name: "Columbia/Kootenay",
    office_location_code: "GLDN",
    office_location_name: "Golden",
    area_code: "KINABSKT",
    area_name: "Kinabasket Lake",
  },
  {
    zone_code: "CLMBAKTNY",
    region_code: "KTNY",
    region_name: "Kootenay",
    zone_name: "Columbia/Kootenay",
    office_location_code: "GLDN",
    office_location_name: "Golden",
    area_code: "MCMURDO",
    area_name: "McMurdo",
  },
  {
    zone_code: "CLMBAKTNY",
    region_code: "KTNY",
    region_name: "Kootenay",
    zone_name: "Columbia/Kootenay",
    office_location_code: "GLDN",
    office_location_name: "Golden",
    area_code: "NICHOLN",
    area_name: "Nicholson",
  },
  {
    zone_code: "CLMBAKTNY",
    region_code: "KTNY",
    region_name: "Kootenay",
    zone_name: "Columbia/Kootenay",
    office_location_code: "GLDN",
    office_location_name: "Golden",
    area_code: "PARSON",
    area_name: "Parson",
  },
];

const complaintTypes = [
  {
    complaint_type_code: "HWCR",
    short_description: "HWCR",
    long_description: "Human Wildlife Conflict",
    display_order: 1,
    active_ind: true,
  },
  {
    complaint_type_code: "ERS",
    short_description: "ERS",
    long_description: "Enforcement",
    display_order: 2,
    active_ind: true,
  },
];

const girTypeCodes = [
  {
    gir_type_code: "COCNT",
    short_description: "CO Contact",
    long_description: "CO Contact",
    display_order: 10,
    active_ind: true,
  },
  {
    gir_type_code: "CODSP",
    short_description: "CO Disposition",
    long_description: "CO Disposition",
    display_order: 20,
    active_ind: true,
  },
  {
    gir_type_code: "GENAD",
    short_description: "General Advice",
    long_description: "General Advice",
    display_order: 30,
    active_ind: true,
  },
  {
    gir_type_code: "MEDIA",
    short_description: "Media",
    long_description: "Media",
    display_order: 40,
    active_ind: true,
  },
  {
    gir_type_code: "QUERY",
    short_description: "Query",
    long_description: "Query",
    display_order: 50,
    active_ind: true,
  },
];

const teamCodes = [
  {
    team_code: "HI",
    short_description: "Heavy Industry",
    long_description: "Heavy Industry",
    display_order: 10,
    active_ind: true,
  },
  {
    team_code: "OPS",
    short_description: "Operations",
    long_description: "Operations",
    display_order: 20,
    active_ind: true,
  },
  {
    team_code: "REACTIVE",
    short_description: "REACTIVE",
    long_description: "REACTIVE",
    display_order: 30,
    active_ind: true,
  },
];

const regions = [
  { code: "KTNY", name: "Kootenay" },
  { code: "OKNGN", name: "Okanagan" },
  { code: "OMINECA", name: "Omineca" },
  { code: "PCLRD", name: "Peace Liard" },
  { code: "SKNA", name: "Skeena" },
  { code: "STHCST", name: "South Coast" },
  { code: "TMPSNCRBO", name: "Thompson Cariboo" },
  { code: "WSTCST", name: "West Coast" },
];

const zones = [
  { code: "NOKNGN", name: "North Okanagan", region: "OKNGN" },
  { code: "NPCE", name: "North Peace", region: "PCLRD" },
  { code: "OMNCA", name: "Omineca", region: "OMINECA" },
  { code: "SEA2SKY", name: "Sea to Sky", region: "STHCST" },
  { code: "SISL", name: "South Island", region: "WSTCST" },
  { code: "SNSHNCST", name: "Sunshine Coast", region: "STHCST" },
  { code: "SOKNGN", name: "South Okanagan", region: "OKNGN" },
  { code: "SPCE", name: "South Peace", region: "PCLRD" },
  { code: "TMPSNNCLA", name: "Thompson Nicola", region: "TMPSNCRBO" },
];

const communities = [
  { code: "100MHHS", name: "100 Mile House", zone: "CRBOTMPSN", region: "TMPSNCRBO" },
  { code: "108MLRNH", name: "108 Mile Ranch", zone: "CRBOTMPSN", region: "TMPSNCRBO" },
  { code: "140MHHS", name: "140 Mile House", zone: "CRBOCHLCTN", region: "TMPSNCRBO" },
  { code: "150MHHS", name: "150 Mile House", zone: "CRBOCHLCTN", region: "TMPSNCRBO" },
  { code: "16MIL", name: "16 Mile", zone: "CRBOTMPSN", region: "TMPSNCRBO" },
  { code: "40MLFLTZ", name: "40 Mile Flats", zone: "CRBOCHLCTN", region: "TMPSNCRBO" },
  { code: "70MLHS", name: "70 Mile House", zone: "CRBOTMPSN", region: "TMPSNCRBO" },
  { code: "ABTFRD", name: "Abbotsford", zone: "FRSRS", region: "STHCST" },
  { code: "ADMSLKHS", name: "Adams Lake", zone: "TMPSNNCLA", region: "TMPSNCRBO" },
  { code: "AGSSZHS", name: "Agassiz", zone: "FRSRS", region: "STHCST" },
  { code: "AHST", name: "Ahousat", zone: "CENISL", region: "WSTCST" },
];

const single = (name: string = "default", idx: number = 0): any => {
  switch (name) {
    case "agency": {
      return idx <= agencyCollection.length ? agencyCollection[idx] : agencyCollection[0];
    }
    case "attractant": {
      return idx <= attractants.length ? attractants[idx] : attractants[0];
    }
    case "complaint-status": {
      return idx <= complaitStatus.length ? complaitStatus[idx] : complaitStatus[0];
    }
    case "nature-of-complaint": {
      return idx <= natureOfComplaints.length ? natureOfComplaints[idx] : natureOfComplaints[0];
    }
    case "person-complaint": {
      return idx <= personTypes.length ? personTypes[idx] : personTypes[0];
    }
    case "species": {
      return idx <= species.length ? species[idx] : species[0];
    }
    case "default":
    default:
      return null;
  }
};

export const MockAgencyCodeTableRepository = () => ({
  find: jest.fn().mockResolvedValue(agencyCollection),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(agencyCollection),
  })),
});

export const MockAttractantCodeTableRepository = () => ({
  find: jest.fn().mockResolvedValue(attractants),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(attractants),
  })),
});

export const MockComplaintStatusCodeTableRepository = () => ({
  find: jest.fn().mockResolvedValue(complaitStatus),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(complaitStatus),
    getOne: jest.fn().mockResolvedValue(complaitStatus[0]),
  })),
});

export const MockNatureOfComplaintCodeTableRepository = () => ({
  find: jest.fn().mockResolvedValue(natureOfComplaints),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(natureOfComplaints),
  })),
});

export const MockOrganizationUnitTypeCodeTableRepository = () => ({
  find: jest.fn().mockResolvedValue(organizationUnitTypes),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(organizationUnitTypes),
  })),
});

export const MockOrganizationUnitCodeTableRepository = () => ({
  find: jest.fn().mockResolvedValue(organizationUnits),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(organizationUnits),
  })),
});

export const MockPersonComplaintCodeTableRepository = () => ({
  find: jest.fn().mockResolvedValue(personTypes),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(personTypes),
  })),
});

export const MockSpeciesCodeTableRepository = () => ({
  find: jest.fn().mockResolvedValue(species),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(species),
  })),
});

export const MockViolationsCodeTableRepository = () => ({
  find: jest.fn().mockResolvedValue(violations),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(violations),
  })),
});

export const MockCosOrganizationUnitCodeTableRepository = () => ({
  find: jest.fn().mockResolvedValue(cosOrganizationUnits),
  map: jest.fn().mockReturnThis(),
  createQueryBuilder: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockReturnThis(),
    distinctOn: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(cosOrganizationUnits),
  })),
});

export const MockComplaintTypeCodeTableRepository = () => ({
  find: jest.fn().mockResolvedValue(complaintTypes),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(complaintTypes),
  })),
});

export const MockRegionCodeTableServiceRepository = () => ({
  find: jest.fn().mockReturnThis(),
  map: jest.fn().mockReturnThis(),
  createQueryBuilder: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    distinct: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue(regions),
    distinctOn: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockResolvedValue(regions),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  })),
});

export const MockZoneCodeTableServiceRepository = () => ({
  find: jest.fn().mockReturnThis(),
  map: jest.fn().mockReturnThis(),
  createQueryBuilder: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    distinct: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue(zones),
    distinctOn: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockResolvedValue(zones),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  })),
});

export const MockCommunityCodeTableServiceRepository = () => ({
  find: jest.fn().mockReturnThis(),
  map: jest.fn().mockReturnThis(),
  createQueryBuilder: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    distinct: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue(communities),
    distinctOn: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockResolvedValue(communities),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  })),
});

export const MockReportedByCodeTableRepository = () => ({
  find: jest.fn().mockResolvedValue(reportedByCollection),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(reportedByCollection),
  })),
});

export const MockGirTypeCodeRepository = () => ({
  find: jest.fn().mockResolvedValue(girTypeCodes),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(girTypeCodes),
  })),
});

export const MockTeamCodeRepository = () => ({
  find: jest.fn().mockResolvedValue(teamCodes),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(teamCodes),
  })),
});

export const MockCompMthdRecvCdAgcyCdXrefRepository = () => ({
  find: jest.fn().mockResolvedValue(teamCodes),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(teamCodes),
  })),
});
