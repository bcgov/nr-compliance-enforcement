import { Test, TestingModule } from '@nestjs/testing';
import { OfficerService } from './officer.service';

describe('OfficerService', () => {
  let service: OfficerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfficerService],
    }).compile();

    service = module.get<OfficerService>(OfficerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
