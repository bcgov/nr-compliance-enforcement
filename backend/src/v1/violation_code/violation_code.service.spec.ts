import { Test, TestingModule } from '@nestjs/testing';
import { ViolationCodeService } from './violation_code.service';

describe('ViolationCodeService', () => {
  let service: ViolationCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViolationCodeService],
    }).compile();

    service = module.get<ViolationCodeService>(ViolationCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
