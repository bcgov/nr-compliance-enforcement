import { Test, TestingModule } from '@nestjs/testing';
import { GeoOrgUnitTypeCodeController } from './geo_org_unit_type_code.controller';
import { GeoOrgUnitTypeCodeService } from './geo_org_unit_type_code.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GeoOrgUnitTypeCode } from './entities/geo_org_unit_type_code.entity';

describe('GeoOrgUnitTypeCodeController', () => {
  let controller: GeoOrgUnitTypeCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeoOrgUnitTypeCodeController],
      providers: [
        GeoOrgUnitTypeCodeService,
        {
          provide: getRepositoryToken(GeoOrgUnitTypeCode),
          useValue: {

          },
        },],
    }).compile();

    controller = module.get<GeoOrgUnitTypeCodeController>(GeoOrgUnitTypeCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
