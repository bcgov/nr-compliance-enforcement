import { Test, TestingModule } from '@nestjs/testing';
import { AttractantCodeController } from './attractant_code.controller';
import { AttractantCodeService } from './attractant_code.service';
import { AttractantCode } from './entities/attractant_code.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AttractantCodeController', () => {
  let controller: AttractantCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttractantCodeController],
      providers: [
        AttractantCodeService,
        {
          provide: getRepositoryToken(AttractantCode),
          useValue: {

          },
        },],
    }).compile();

    controller = module.get<AttractantCodeController>(AttractantCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
