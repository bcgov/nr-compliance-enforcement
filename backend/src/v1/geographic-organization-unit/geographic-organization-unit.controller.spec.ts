import { Test, TestingModule } from '@nestjs/testing';
import { GeographicOrganizationUnitController } from './geographic-organization-unit.controller';
import { GeographicOrganizationUnitService } from './geographic-organization-unit.service';

describe('GeographicOrganizationUnitController', () => {
  let controller: GeographicOrganizationUnitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeographicOrganizationUnitController],
      providers: [GeographicOrganizationUnitService],
    }).compile();

    controller = module.get<GeographicOrganizationUnitController>(GeographicOrganizationUnitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
