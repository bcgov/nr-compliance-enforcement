import { Test, TestingModule } from '@nestjs/testing';
import { AgencyCodeController } from './agency_code.controller';
import { AgencyCodeService } from './agency_code.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AgencyCode } from './entities/agency_code.entity';

describe('AgencyCodeController', () => {
  let controller: AgencyCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgencyCodeController],
      providers: [
        AgencyCodeService,
        {
          provide: getRepositoryToken(AgencyCode),
          useValue: {

          },
        },],
    }).compile();

    controller = module.get<AgencyCodeController>(AgencyCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
