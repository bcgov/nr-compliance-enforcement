import { Test, TestingModule } from '@nestjs/testing';
import { GeoOrganizationUnitCodeService } from './geo_organization_unit_code.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GeoOrganizationUnitCode } from './entities/geo_organization_unit_code.entity';

describe('GeoOrganizationUnitCodeService', () => {
  let service: GeoOrganizationUnitCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeoOrganizationUnitCodeService,
        {
          provide: getRepositoryToken(GeoOrganizationUnitCode),
          useValue: {

          },
        },],
    }).compile();

    service = module.get<GeoOrganizationUnitCodeService>(GeoOrganizationUnitCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
