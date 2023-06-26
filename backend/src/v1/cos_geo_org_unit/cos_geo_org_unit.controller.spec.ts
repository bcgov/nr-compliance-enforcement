import { Test, TestingModule } from '@nestjs/testing';
import { CosGeoOrgUnitController } from './cos_geo_org_unit.controller';
import { CosGeoOrgUnitService } from './cos_geo_org_unit.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CosGeoOrgUnit } from "../cos_geo_org_unit/entities/cos_geo_org_unit.entity"

describe('CosGeoOrgUnitController', () => {
  let controller: CosGeoOrgUnitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CosGeoOrgUnitController],
      providers: [CosGeoOrgUnitService,
        {
          provide: getRepositoryToken(CosGeoOrgUnit),
          useValue: {

          },
        },],
    }).compile();

    controller = module.get<CosGeoOrgUnitController>(CosGeoOrgUnitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
