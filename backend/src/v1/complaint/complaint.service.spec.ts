import { Test, TestingModule } from '@nestjs/testing';
import { ComplaintService } from './complaint.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Complaint } from './entities/complaint.entity';

describe('ComplaintService', () => {
  let service: ComplaintService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComplaintService,
        {
          provide: getRepositoryToken(Complaint),
          useValue: {

          },
        },],
    }).compile();

    service = module.get<ComplaintService>(ComplaintService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
