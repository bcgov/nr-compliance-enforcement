import { Test, TestingModule } from '@nestjs/testing';
import { ComplaintStatusCodeController } from './complaint_status_code.controller';
import { ComplaintStatusCodeService } from './complaint_status_code.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ComplaintStatusCode } from './entities/complaint_status_code.entity';

describe('ComplaintStatusCodeController', () => {
  let controller: ComplaintStatusCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplaintStatusCodeController],
      providers: [
        ComplaintStatusCodeService,
        {
          provide: getRepositoryToken(ComplaintStatusCode),
          useValue: {

          },
        },],
    }).compile();

    controller = module.get<ComplaintStatusCodeController>(ComplaintStatusCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
