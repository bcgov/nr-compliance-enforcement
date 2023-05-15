import { Test, TestingModule } from '@nestjs/testing';
import { AttractantHwcrXrefController } from './attractant_hwcr_xref.controller';
import { AttractantHwcrXrefService } from './attractant_hwcr_xref.service';

describe('AttractantHwcrXrefController', () => {
  let controller: AttractantHwcrXrefController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttractantHwcrXrefController],
      providers: [AttractantHwcrXrefService],
    }).compile();

    controller = module.get<AttractantHwcrXrefController>(AttractantHwcrXrefController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
