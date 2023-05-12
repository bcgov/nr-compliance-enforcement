import { Test, TestingModule } from '@nestjs/testing';
import { GeoOrgUnitStructureController } from './geo_org_unit_structure.controller';
import { GeoOrgUnitStructureService } from './geo_org_unit_structure.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GeoOrgUnitStructure } from './entities/geo_org_unit_structure.entity';

describe('GeoOrgUnitStructureController', () => {
  let controller: GeoOrgUnitStructureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeoOrgUnitStructureController],
      providers: [
        GeoOrgUnitStructureService,
        {
          provide: getRepositoryToken(GeoOrgUnitStructure),
          useValue: {

          },
        },],
    }).compile();

    controller = module.get<GeoOrgUnitStructureController>(GeoOrgUnitStructureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
