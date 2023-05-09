import { Test, TestingModule } from '@nestjs/testing';
import { GeoOrgUnitTypeCodeController } from './geo_org_unit_type_code.controller';
import { GeoOrgUnitTypeCodeService } from './geo_org_unit_type_code.service';

describe('GeoOrgUnitTypeCodeController', () => {
  let controller: GeoOrgUnitTypeCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeoOrgUnitTypeCodeController],
      providers: [GeoOrgUnitTypeCodeService],
    }).compile();

    controller = module.get<GeoOrgUnitTypeCodeController>(GeoOrgUnitTypeCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
