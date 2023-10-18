import { Test, TestingModule } from '@nestjs/testing';
import { ComplaintTypeCodeController } from './complaint_type_code.controller';
import { ComplaintTypeCodeService } from './complaint_type_code.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ComplaintTypeCode } from './entities/complaint_type_code.entity';

describe('ComplaintTypeCodeController', () => {
  let controller: ComplaintTypeCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplaintTypeCodeController],
      providers: [
        ComplaintTypeCodeService,
        {
          provide: getRepositoryToken(ComplaintTypeCode),
          useValue: {

          },
        },],
    }).compile();

    controller = module.get<ComplaintTypeCodeController>(ComplaintTypeCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
