import { Test, TestingModule } from '@nestjs/testing';
import { BcGeoCoderService } from './bc_geo_coder.service';

describe('BcGeoCoderService', () => {
  let service: BcGeoCoderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcGeoCoderService],
    }).compile();

    service = module.get<BcGeoCoderService>(BcGeoCoderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
