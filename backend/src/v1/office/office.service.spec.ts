import { Test, TestingModule } from '@nestjs/testing';
import { OfficeService } from './office.service';
import { Office } from './entities/office.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('OfficeService', () => {
  let service: OfficeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfficeService,
        {
          provide: getRepositoryToken(Office),
          useValue: {

          },
        },],
    }).compile();

    service = module.get<OfficeService>(OfficeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
