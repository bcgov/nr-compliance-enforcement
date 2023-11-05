import { randomUUID } from "crypto";

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
   { "attractantCode": "BEEHIVE", "shortDescription": "Beehive", "longDescription": "Beehive", "displayOrder": 2, "isActive": true},
   { "attractantCode": "BIRD FDR", "shortDescription": "Bird Feeder", "longDescription": "Bird Feeder", "displayOrder": 3, "isActive": true    },
   { "attractantCode": "CAMP FD", "shortDescription": "Campground Food", "longDescription": "Campground Food", "displayOrder": 4, "isActive": true    },
   { "attractantCode": "COMPOST", "shortDescription": "Compost", "longDescription": "Compost", "displayOrder": 5, "isActive": true    },
   { "attractantCode": "CROPS", "shortDescription": "Crops", "longDescription": "Crops", "displayOrder": 6, "isActive": true    },
   { "attractantCode": "FREEZER", "shortDescription": "Freezer", "longDescription": "Freezer", "displayOrder": 7, "isActive": true    },
   { "attractantCode": "BBQ", "shortDescription": "BBQ", "longDescription": "Barbeque", "displayOrder": 1, "isActive": true    },
   { "attractantCode": "RESFRUIT", "shortDescription": "Fruit/Berries", "longDescription": "Residential Fruit/Berries", "displayOrder": 8, "isActive": true    }
];

const single = (name: string = "default", idx: number = 0): any => {
  switch (name) {
    case "agency": {
      return idx <= agencyCollection.length
        ? agencyCollection[idx]
        : agencyCollection[0];
    }
    case "attractant": { 
      return idx <= attractants.length
      ? attractants[idx]
      : attractants[0];
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
 