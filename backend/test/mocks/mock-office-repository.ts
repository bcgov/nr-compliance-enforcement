import { randomUUID } from "crypto";

const simpleCollection = [
  { office_guid: "00048dd4-17b0-4fdc-a3fb-54f820970422", cos_geo_org_unit: "MSNSR" },
  { office_guid: "19addcac-91b2-4ab3-83b9-9a26baa1e635", cos_geo_org_unit: "CRNBK" },
  { office_guid: "2044f08d-b53c-489a-8584-dd867b63514a", cos_geo_org_unit: "CRSTN" },
  { office_guid: "305f0ee6-b525-40fd-b2d8-c7a882e8b7fd", cos_geo_org_unit: "PRTALB" },
  { office_guid: "313f4ec3-e88a-41c2-9956-78c7b18cb71d", cos_geo_org_unit: "QSNL" },
  { office_guid: "3338cb74-5be4-4ed3-8b11-41f83d72de00", cos_geo_org_unit: "BLKCRKCR" },
];

const collection = [
  {
    office_guid: "ee09bf4d-e5a1-4fb8-9012-c192692dd1bd",
    cos_geo_org_unit: {
      zone_code: "NCHKOLKS",
      region_code: "OMINECA",
      region_name: "Omineca",
      zone_name: "Nechako-Lakes",
      office_location_code: "BURNSLK",
      office_location_name: "Burns Lake",
      area_code: "WISTARIA",
      area_name: "Wistaria",
    },
    officers: [
      {
        officer_guid: "af70aeb7-2a6b-45a6-b722-926ebec005b5",
        user_id: "RGRIMES",
        auth_user_guid: null,
        person_guid: {
          person_guid: "1a9a91e1-143d-4b54-82d4-c08137d929f7",
          first_name: "Rick",
          middle_name_1: null,
          middle_name_2: null,
          last_name: "Grimes",
        },
      },
    ],
  },
  {
    office_guid: "5128179c-f622-499b-b8e5-b39199081f22",
    cos_geo_org_unit: {
      zone_code: "NCHKOLKS",
      region_code: "OMINECA",
      region_name: "Omineca",
      zone_name: "Nechako-Lakes",
      office_location_code: "VNDHF",
      office_location_name: "Vanderhoof",
      area_code: "VANDERHF",
      area_name: "Vanderhoof",
    },
    officers: [
      {
        officer_guid: "7fe1cc4e-fc73-412e-9c0e-3f3fec364aac",
        user_id: "HOLSON",
        auth_user_guid: "92a81ac4-d767-414f-a759-b0be2373a072",
        person_guid: {
          person_guid: "7430e049-ac60-441c-a873-ee826a0b0bfc",
          first_name: "Harry",
          middle_name_1: null,
          middle_name_2: null,
          last_name: "Olson",
        },
      },
    ],
  },
];

const simpleSingle = (idx: number = 0) => {
  return simpleCollection[idx];
};

const single = (idx: number = 0) => {
  return collection[idx];
};

export const MockOfficeRepository = () => ({
  findOneByOrFail: jest.fn().mockResolvedValue(simpleSingle(2)),
  find: jest.fn().mockResolvedValue(simpleSingle(4)),
  findAll: jest.fn().mockReturnThis(),
  findByGeoOrgCode: jest.fn().mockReturnThis(),
  findOfficesByZone: jest.fn().mockReturnThis(),
  create: jest
    .fn()
    .mockResolvedValueOnce({
      create_user_id: "TEST",
      update_user_id: "TEST",
      agency_code_ref: "COS",
      office_guid: randomUUID(),
    })
    .mockRejectedValueOnce(new Error("Simulated error")),
  update: jest.fn().mockReturnThis(),
  remove: jest.fn().mockReturnThis(),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    distinctOn: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(collection),
  })),
});
