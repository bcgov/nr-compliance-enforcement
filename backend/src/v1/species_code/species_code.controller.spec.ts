import { Test, TestingModule } from '@nestjs/testing';
import { SpeciesCodeController } from './species_code.controller';
import { SpeciesCodeService } from './species_code.service';

describe('SpeciesCodeController', () => {
  let controller: SpeciesCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpeciesCodeController],
      providers: [SpeciesCodeService],
    }).compile();

    controller = module.get<SpeciesCodeController>(SpeciesCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
