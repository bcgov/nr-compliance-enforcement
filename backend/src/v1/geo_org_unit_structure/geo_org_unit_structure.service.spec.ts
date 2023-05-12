import { Test, TestingModule } from '@nestjs/testing';
import { GeoOrgUnitStructureService } from './geo_org_unit_structure.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GeoOrgUnitStructure } from './entities/geo_org_unit_structure.entity';

describe('GeoOrgUnitStructureService', () => {
  let service: GeoOrgUnitStructureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeoOrgUnitStructureService,
        {
          provide: getRepositoryToken(GeoOrgUnitStructure),
          useValue: {

          },
        },],
    }).compile();

    service = module.get<GeoOrgUnitStructureService>(GeoOrgUnitStructureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
