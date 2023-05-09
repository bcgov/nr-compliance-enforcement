import { Test, TestingModule } from '@nestjs/testing';
import { GeoOrgUnitStructureService } from './geo_org_unit_structure.service';

describe('GeoOrgUnitStructureService', () => {
  let service: GeoOrgUnitStructureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeoOrgUnitStructureService],
    }).compile();

    service = module.get<GeoOrgUnitStructureService>(GeoOrgUnitStructureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
