import { Test, TestingModule } from "@nestjs/testing";
import { GeoOrgUnitTypeCodeService } from "./geo_org_unit_type_code.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { GeoOrgUnitTypeCode } from "./entities/geo_org_unit_type_code.entity";

describe("GeoOrgUnitTypeCodeService", () => {
  let service: GeoOrgUnitTypeCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeoOrgUnitTypeCodeService,
        {
          provide: getRepositoryToken(GeoOrgUnitTypeCode),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<GeoOrgUnitTypeCodeService>(GeoOrgUnitTypeCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
