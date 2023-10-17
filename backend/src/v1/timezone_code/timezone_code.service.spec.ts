import { Test, TestingModule } from '@nestjs/testing';
import { TimezoneCodeService } from './timezone_code.service';

describe('TimezoneCodeService', () => {
  let service: TimezoneCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimezoneCodeService],
    }).compile();

    service = module.get<TimezoneCodeService>(TimezoneCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
