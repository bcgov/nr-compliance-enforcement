import { Test, TestingModule } from '@nestjs/testing';
import { ViolationCodeController } from './violation_code.controller';
import { ViolationCodeService } from './violation_code.service';
import { ViolationCode } from './entities/violation_code.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ViolationCodeController', () => {
  let controller: ViolationCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViolationCodeController],
      providers: [
        ViolationCodeService,
        {
          provide: getRepositoryToken(ViolationCode),
          useValue: {

          },
        },],
    }).compile();

    controller = module.get<ViolationCodeController>(ViolationCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
