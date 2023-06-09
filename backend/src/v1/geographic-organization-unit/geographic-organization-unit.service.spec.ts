import { Test, TestingModule } from '@nestjs/testing';
import { GeographicOrganizationUnitService } from './geographic-organization-unit.service';

describe('GeographicOrganizationUnitService', () => {
  let service: GeographicOrganizationUnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeographicOrganizationUnitService],
    }).compile();

    service = module.get<GeographicOrganizationUnitService>(GeographicOrganizationUnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
