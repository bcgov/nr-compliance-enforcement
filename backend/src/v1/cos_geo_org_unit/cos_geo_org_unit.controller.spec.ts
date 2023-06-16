import { Test, TestingModule } from '@nestjs/testing';
import { CosGeoOrgUnitController } from './cos_geo_org_unit.controller';
import { CosGeoOrgUnitService } from './cos_geo_org_unit.service';

describe('CosGeoOrgUnitController', () => {
  let controller: CosGeoOrgUnitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CosGeoOrgUnitController],
      providers: [CosGeoOrgUnitService],
    }).compile();

    controller = module.get<CosGeoOrgUnitController>(CosGeoOrgUnitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
