import { Test, TestingModule } from '@nestjs/testing';
import { BcGeoCoderController } from './bc_geo_coder.controller';
import { BcGeoCoderService } from './bc_geo_coder.service';

describe('BcGeoCoderController', () => {
  let controller: BcGeoCoderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BcGeoCoderController],
      providers: [BcGeoCoderService],
    }).compile();

    controller = module.get<BcGeoCoderController>(BcGeoCoderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
