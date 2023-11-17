import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ComplaintService } from './complaint.service';
import { Complaint } from '../complaint/entities/complaint.entity';
import { MockComplaintRepository } from 'test/mocks/mock-complaint-repository';

describe('Testing: Complaint Service', () => {
  let service: ComplaintService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComplaintService,
        {
          provide: getRepositoryToken(Complaint),
          useFactory: MockComplaintRepository,
        },
      ],
    }).compile();

    service = module.get<ComplaintService>(ComplaintService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
