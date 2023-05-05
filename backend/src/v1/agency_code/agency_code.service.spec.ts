import { Test, TestingModule } from '@nestjs/testing';
import { AgencyCodeService } from './agency_code.service';

describe('AgencyCodeService', () => {
  let service: AgencyCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgencyCodeService],
    }).compile();

    service = module.get<AgencyCodeService>(AgencyCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
