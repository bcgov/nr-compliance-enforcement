import { Test, TestingModule } from '@nestjs/testing';
import { OfficerController } from './officer.controller';
import { OfficerService } from './officer.service';
import { Officer } from './entities/officer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('OfficerController', () => {
  let controller: OfficerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfficerController],
      providers: [OfficerService,
        {
          provide: getRepositoryToken(Officer),
          useValue: {

          },
      },],
    }).compile();

    controller = module.get<OfficerController>(OfficerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
