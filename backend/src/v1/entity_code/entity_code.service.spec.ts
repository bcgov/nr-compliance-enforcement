import { Test, TestingModule } from '@nestjs/testing';
import { EntityCodeService } from './entity_code.service';

describe('EntityCodeService', () => {
  let service: EntityCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntityCodeService],
    }).compile();

    service = module.get<EntityCodeService>(EntityCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
