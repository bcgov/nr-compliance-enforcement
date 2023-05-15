import { Test, TestingModule } from '@nestjs/testing';
import { OfficeController } from './office.controller';
import { OfficeService } from './office.service';
import { Office } from './entities/office.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('OfficeController', () => {
  let controller: OfficeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfficeController],
      providers: [
        OfficeService,
        {
          provide: getRepositoryToken(Office),
          useValue: {

          },
        },],
    }).compile();

    controller = module.get<OfficeController>(OfficeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
