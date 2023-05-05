import { Test, TestingModule } from '@nestjs/testing';
import { GeoOrganizationUnitCodeService } from './geo_organization_unit_code.service';

describe('GeoOrganizationUnitCodeService', () => {
  let service: GeoOrganizationUnitCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeoOrganizationUnitCodeService],
    }).compile();

    service = module.get<GeoOrganizationUnitCodeService>(GeoOrganizationUnitCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
