import { Test, TestingModule } from '@nestjs/testing';
import { ComplaintStatusCodeController } from './complaint_status_code.controller';
import { ComplaintStatusCodeService } from './complaint_status_code.service';

describe('ComplaintStatusCodeController', () => {
  let controller: ComplaintStatusCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplaintStatusCodeController],
      providers: [ComplaintStatusCodeService],
    }).compile();

    controller = module.get<ComplaintStatusCodeController>(ComplaintStatusCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
