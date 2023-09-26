import { Test, TestingModule } from '@nestjs/testing';
import { ComplaintService } from './complaint.service';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Complaint } from '../complaint/entities/complaint.entity';
import { dataSourceMockFactory } from '../../../test/mocks/datasource';

describe('ComplaintService', () => {
  let service: ComplaintService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComplaintService,
        {
          provide: getRepositoryToken(Complaint),
          useValue: {},
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory
        }],
    }).compile();

    service = module.get<ComplaintService>(ComplaintService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
