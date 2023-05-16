import { Test, TestingModule } from '@nestjs/testing';
import { HwcrComplaintNatureCodeController } from './hwcr_complaint_nature_code.controller';
import { HwcrComplaintNatureCodeService } from './hwcr_complaint_nature_code.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HwcrComplaintNatureCode } from './entities/hwcr_complaint_nature_code.entity';

describe('HwcrComplaintNatureCodeController', () => {
  let controller: HwcrComplaintNatureCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HwcrComplaintNatureCodeController],
      providers: [
        HwcrComplaintNatureCodeService,
        {
          provide: getRepositoryToken(HwcrComplaintNatureCode),
          useValue: {

          },
        },],
    }).compile();

    controller = module.get<HwcrComplaintNatureCodeController>(HwcrComplaintNatureCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
