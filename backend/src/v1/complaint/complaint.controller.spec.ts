import { Test, TestingModule } from '@nestjs/testing';
import { ComplaintController } from './complaint.controller';
import { ComplaintService } from './complaint.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Complaint } from './entities/complaint.entity';

describe('ComplaintController', () => {
  let controller: ComplaintController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplaintController],
      providers: [ComplaintService,
        {
          provide: getRepositoryToken(Complaint),
          useValue: {

          },
        },],
    }).compile();

    controller = module.get<ComplaintController>(ComplaintController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
