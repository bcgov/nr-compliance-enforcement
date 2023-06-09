import { Test, TestingModule } from '@nestjs/testing';
import { GeoOrganizationUnitCodeController } from './geo_organization_unit_code.controller';
import { GeoOrganizationUnitCodeService } from './geo_organization_unit_code.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GeoOrganizationUnitCode } from './entities/geo_organization_unit_code.entity';

describe('GeoOrganizationUnitCodeController', () => {
  let controller: GeoOrganizationUnitCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeoOrganizationUnitCodeController],
      providers: [
        GeoOrganizationUnitCodeService,
        {
          provide: getRepositoryToken(GeoOrganizationUnitCode),
          useValue: {

          },
        },],
    }).compile();

    controller = module.get<GeoOrganizationUnitCodeController>(GeoOrganizationUnitCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
