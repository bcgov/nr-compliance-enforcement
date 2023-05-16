import { Test, TestingModule } from '@nestjs/testing';
import { OfficerService } from './officer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Officer } from './entities/officer.entity';

describe('OfficerService', () => {
  let service: OfficerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfficerService,
        {
          provide: getRepositoryToken(Officer),
          useValue: {

          },
        },],
    }).compile();

    service = module.get<OfficerService>(OfficerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
