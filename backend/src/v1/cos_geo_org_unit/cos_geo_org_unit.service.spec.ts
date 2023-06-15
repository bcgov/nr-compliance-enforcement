import { Test, TestingModule } from '@nestjs/testing';
import { CosGeoOrgUnitService } from './cos_geo_org_unit.service';

describe('CosGeoOrgUnitService', () => {
  let service: CosGeoOrgUnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CosGeoOrgUnitService],
    }).compile();

    service = module.get<CosGeoOrgUnitService>(CosGeoOrgUnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
