import { Test, TestingModule } from '@nestjs/testing';
import { TimezoneCodeController } from './timezone_code.controller';
import { TimezoneCodeService } from './timezone_code.service';

describe('TimezoneCodeController', () => {
  let controller: TimezoneCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimezoneCodeController],
      providers: [TimezoneCodeService],
    }).compile();

    controller = module.get<TimezoneCodeController>(TimezoneCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
