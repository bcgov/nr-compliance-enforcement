import { Test, TestingModule } from '@nestjs/testing';
import { StagingStatusCodeController } from './staging_status_code.controller';
import { StagingStatusCodeService } from './staging_status_code.service';

describe('StagingStatusCodeController', () => {
  let controller: StagingStatusCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StagingStatusCodeController],
      providers: [StagingStatusCodeService],
    }).compile();

    controller = module.get<StagingStatusCodeController>(StagingStatusCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
