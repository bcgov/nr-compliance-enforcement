import { Test, TestingModule } from '@nestjs/testing';
import { EntityCodeController } from './entity_code.controller';
import { EntityCodeService } from './entity_code.service';

describe('EntityCodeController', () => {
  let controller: EntityCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntityCodeController],
      providers: [EntityCodeService],
    }).compile();

    controller = module.get<EntityCodeController>(EntityCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
