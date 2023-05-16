import { Test, TestingModule } from '@nestjs/testing';
import { AttractantHwcrXrefController } from './attractant_hwcr_xref.controller';
import { AttractantHwcrXrefService } from './attractant_hwcr_xref.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AttractantHwcrXref } from './entities/attractant_hwcr_xref.entity';

describe('AttractantHwcrXrefController', () => {
  let controller: AttractantHwcrXrefController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttractantHwcrXrefController],
      providers: [
        AttractantHwcrXrefService,
        {
          provide: getRepositoryToken(AttractantHwcrXref),
          useValue: {

          },
        },],
    }).compile();

    controller = module.get<AttractantHwcrXrefController>(AttractantHwcrXrefController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
