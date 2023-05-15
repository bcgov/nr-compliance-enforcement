import { Test, TestingModule } from '@nestjs/testing';
import { ViolationCodeService } from './violation_code.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ViolationCode } from './entities/violation_code.entity';

describe('ViolationCodeService', () => {
  let service: ViolationCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ViolationCodeService,
        {
          provide: getRepositoryToken(ViolationCode),
          useValue: {

          },
        },],
    }).compile();

    service = module.get<ViolationCodeService>(ViolationCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
