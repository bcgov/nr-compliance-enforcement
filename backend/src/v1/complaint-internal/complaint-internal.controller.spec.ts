import { Test, TestingModule } from '@nestjs/testing';
import { ComplaintInternalController } from './complaint-internal.controller';

describe('ComplaintInternalController', () => {
  let controller: ComplaintInternalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplaintInternalController],
    }).compile();

    controller = module.get<ComplaintInternalController>(ComplaintInternalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
