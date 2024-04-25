import { Test, TestingModule } from "@nestjs/testing";
import { CosGeoOrgUnitService } from "./cos_geo_org_unit.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CosGeoOrgUnit } from "./entities/cos_geo_org_unit.entity";

describe("CosGeoOrgUnitService", () => {
  let service: CosGeoOrgUnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CosGeoOrgUnitService,
        {
          provide: getRepositoryToken(CosGeoOrgUnit),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CosGeoOrgUnitService>(CosGeoOrgUnitService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
