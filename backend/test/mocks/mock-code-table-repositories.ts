const agencyCollection = [
   { "agency_code": "BCWF", "short_description": "BCWF", "long_description": "BC Wildlife Federation", "display_order": 1, "active_ind": true   },
   { "agency_code": "BYLAW", "short_description": "Bylaw Enforcement", "long_description": "Bylaw Enforcement", "display_order": 2, "active_ind": true   },
   { "agency_code": "COS", "short_description": "COS", "long_description": "Conservation Officer Service", "display_order": 3, "active_ind": true   },
   { "agency_code": "DFO", "short_description": "DFO", "long_description": "Department of Fisheries and Oceans", "display_order": 4, "active_ind": true   },
   { "agency_code": "EPO", "short_description": "EPO", "long_description": "Environmental Protection Office", "display_order": 5, "active_ind": true   },
   { "agency_code": "CEB", "short_description": "FOR", "long_description": "Forestry Compliance and Enforcement Branch", "display_order": 6, "active_ind": true   },
   { "agency_code": "LE", "short_description": "Police", "long_description": "Municipal Police or RCMP", "display_order": 7, "active_ind": true   },
   { "agency_code": "OTHER", "short_description": "Other", "long_description": "Other", "display_order": 8, "active_ind": true   }
]

const attractants = [
   { "attractant_code": "BEEHIVE", "short_description": "Beehive", "long_description": "Beehive", "display_order": 2, "active_ind": true},
   { "attractant_code": "BIRD FDR", "short_description": "Bird Feeder", "long_description": "Bird Feeder", "display_order": 3, "active_ind": true },
   { "attractant_code": "CAMP FD", "short_description": "Campground Food", "long_description": "Campground Food", "display_order": 4, "active_ind": true },
   { "attractant_code": "COMPOST", "short_description": "Compost", "long_description": "Compost", "display_order": 5, "active_ind": true },
   { "attractant_code": "CROPS", "short_description": "Crops", "long_description": "Crops", "display_order": 6, "active_ind": true },
   { "attractant_code": "FREEZER", "short_description": "Freezer", "long_description": "Freezer", "display_order": 7, "active_ind": true },
   { "attractant_code": "BBQ", "short_description": "BBQ", "long_description": "Barbeque", "display_order": 1, "active_ind": true },
   { "attractant_code": "RESFRUIT", "short_description": "Fruit/Berries", "long_description": "Residential Fruit/Berries", "display_order": 8, "active_ind": true }
];

const complaitStatus = [
   { "complaint_status_code": "OPEN", "short_description": "OPEN", "long_description": "Open", "display_order": 1, "active_ind": true   },
   { "complaint_status_code": "CLOSED", "short_description": "CLOSED", "long_description": "Closed", "display_order": 1, "active_ind": true   }
]

const natureOfComplaints = [
   { "hwcr_complaint_nature_code": "AGGNOT", "short_description": "AGGNOT", "long_description": "Aggressive - not present", "display_order": 1, "active_ind": true   },
   { "hwcr_complaint_nature_code": "AGGPRES", "short_description": "AGGPRES", "long_description": "Aggressive - present/recent", "display_order": 2, "active_ind": true   },
   { "hwcr_complaint_nature_code": "CONFINED", "short_description": "CONFINED", "long_description": "Confined", "display_order": 3, "active_ind": true   },
   { "hwcr_complaint_nature_code": "COUGARN", "short_description": "COUGARN", "long_description": "Cougar suspected - killed/injured livestock/pets - not present", "display_order": 4, "active_ind": true   },
   { "hwcr_complaint_nature_code": "DAMNP", "short_description": "DAMNP", "long_description": "Damage to property - not present", "display_order": 5, "active_ind": true   },
   { "hwcr_complaint_nature_code": "DEADNV", "short_description": "DEADNV", "long_description": "Dead wildlife - no violation suspected", "display_order": 6, "active_ind": true   }
]

const organizationUnitTypes = [
   { "geo_org_unit_type_code": "ZONE", "short_description": "Zone", "long_description": null, "display_order": 1, "active_ind": true   },
   { "geo_org_unit_type_code": "REGION", "short_description": "Region", "long_description": null, "display_order": 2, "active_ind": true   },
   { "geo_org_unit_type_code": "OFFLOC", "short_description": "Office Location", "long_description": null, "display_order": 3, "active_ind": true   },
   { "geo_org_unit_type_code": "AREA", "short_description": "Area", "long_description": null, "display_order": 4, "active_ind": true   }
]

const organizationUnits = [
  { organizationUnit: "OKNGN", shortDescription: "Okanagan", longDescription: "Okanagan", organizationUnitType: "REGION",  },
  { organizationUnit: "OMINECA", shortDescription: "Omineca", longDescription: "Omineca", organizationUnitType: "REGION",  },
  { organizationUnit: "BLKYCSR", shortDescription: "Bulkley-Cassiar", longDescription: "Bulkley-Cassiar", organizationUnitType: "ZONE",  },
  { organizationUnit: "CRBOCHLCTN", shortDescription: "Cariboo Chilcotin", longDescription: "Cariboo Chilcotin", organizationUnitType: "ZONE",  },
  { organizationUnit: "CHTWD", shortDescription: "Chetwynd", longDescription: "Chetwynd", organizationUnitType: "OFFLOC",  },
];

const personTypes = [
   { "person_complaint_xref_code": "ASSIGNEE", "short_description": "Officer Assigned", "long_description": "The person to whom the complaint is assigned to.", "display_order": 1,   },
   { "person_complaint_xref_code": "TEST",      "short_description": "TEST",      "long_description": "Test person type",      "display_order": 2,  }
]

const species = [
   { "species_code": "BISON", "short_description": "Bison", "long_description": "Bison", "display_order": 1, "active_ind": true, "legacy_code": null,   },
   { "species_code": "BLKBEAR", "short_description": "Black Bear", "long_description": "Black Bear", "display_order": 2, "active_ind": true, "legacy_code": null,   },
   { "species_code": "BOBCAT", "short_description": "Bobcat", "long_description": "Bobcat", "display_order": 3, "active_ind": true, "legacy_code": null,   },
   { "species_code": "COUGAR", "short_description": "Cougar", "long_description": "Cougar", "display_order": 4, "active_ind": true, "legacy_code": null,   },
   { "species_code": "COYOTE", "short_description": "Coyote", "long_description": "Coyote", "display_order": 5, "active_ind": true, "legacy_code": null,   },
   { "species_code": "DEER", "short_description": "Deer", "long_description": "Deer", "display_order": 6, "active_ind": true, "legacy_code": null,   }]

const violations = [
   { "violation_code": "AINVSPC", "short_description": "AINVSPC", "long_description": "Aquatic: Invasive Species", "display_order": 1, "active_ind": true,   },
   { "violation_code": "BOATING", "short_description": "BOATING", "long_description": "Boating", "display_order": 2, "active_ind": true,   },
   { "violation_code": "DUMPING", "short_description": "DUMPING", "long_description": "Dumping", "display_order": 3, "active_ind": true,   },
   { "violation_code": "FISHERY", "short_description": "FISHERY", "long_description": "Fisheries", "display_order": 4, "active_ind": true,   },
   { "violation_code": "ORV", "short_description": "ORV", "long_description": "Off-road vehicles (ORV)", "display_order": 5, "active_ind": true,   },
   { "violation_code": "OPENBURN", "short_description": "OPENBURN", "long_description": "Open Burning", "display_order": 6, "active_ind": true,   },
   { "violation_code": "OTHER", "short_description": "OTHER", "long_description": "Other", "display_order": 7, "active_ind": true,   },
   { "violation_code": "PESTICDE", "short_description": "PESTICDE", "long_description": "Pesticide", "display_order": 8, "active_ind": true,   },
   { "violation_code": "RECREATN", "short_description": "RECREATN", "long_description": "Recreation sites/ trails", "display_order": 9, "active_ind": true,   }
]

const single = (name: string = "default", idx: number = 0): any => {
  switch (name) {
    case "agency": {
      return idx <= agencyCollection.length
        ? agencyCollection[idx]
        : agencyCollection[0];
    }
    case "attractant": {
      return idx <= attractants.length ? attractants[idx] : attractants[0];
    }
    case "complaint-status": {
      return idx <= complaitStatus.length
        ? complaitStatus[idx]
        : complaitStatus[0];
    }
    case "nature-of-complaint": {
      return idx <= natureOfComplaints.length
        ? natureOfComplaints[idx]
        : natureOfComplaints[0];
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
    getMany: jest.fn().mockResolvedValue(organizationUnitTypes),
  })),
});

export const MockOrganizationUnitCodeTableRepository = () => ({
  find: jest.fn().mockResolvedValue(organizationUnits),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
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
 