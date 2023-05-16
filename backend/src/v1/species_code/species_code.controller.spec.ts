import { Test, TestingModule } from '@nestjs/testing';
import { SpeciesCodeController } from './species_code.controller';
import { SpeciesCodeService } from './species_code.service';
import { SpeciesCode } from './entities/species_code.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SpeciesCodeController', () => {
  let controller: SpeciesCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpeciesCodeController],
      providers: [
        SpeciesCodeService,
        {
          provide: getRepositoryToken(SpeciesCode),
          useValue: {

          },
        },],
    }).compile();

    controller = module.get<SpeciesCodeController>(SpeciesCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
