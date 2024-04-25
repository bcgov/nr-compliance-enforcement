import { Test, TestingModule } from "@nestjs/testing";
import { GeoOrgUnitStructureService } from "./geo_org_unit_structure.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { GeoOrgUnitStructure } from "./entities/geo_org_unit_structure.entity";
import { GeoOrganizationUnitCode } from "../geo_organization_unit_code/entities/geo_organization_unit_code.entity";

describe("GeoOrgUnitStructureService", () => {
  let service: GeoOrgUnitStructureService;

  const geoOrganizationUnitCode1 = new GeoOrganizationUnitCode("Geo1");
  const geoOrganizationUnitCode2 = new GeoOrganizationUnitCode("Geo2");
  const geoOrganizationUnitCode3 = new GeoOrganizationUnitCode("Geo3");

  const geoOrganizationUnitCodeArray = [geoOrganizationUnitCode1, geoOrganizationUnitCode2];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeoOrgUnitStructureService,
        {
          provide: getRepositoryToken(GeoOrgUnitStructure),
          useValue: {
            find: jest.fn().mockResolvedValue(geoOrganizationUnitCodeArray),
            findOneOrFail: jest.fn().mockResolvedValue(geoOrganizationUnitCode1),
            create: jest.fn().mockReturnValue(geoOrganizationUnitCode3),
            save: jest.fn(),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            //update: jest.fn().mockResolvedValue(true),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            delete: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<GeoOrgUnitStructureService>(GeoOrgUnitStructureService);
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const users = await service.findAll();
      expect(users).toEqual(geoOrganizationUnitCodeArray);
    });
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
