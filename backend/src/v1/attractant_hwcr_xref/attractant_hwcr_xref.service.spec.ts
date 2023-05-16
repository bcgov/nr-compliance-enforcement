import { Test, TestingModule } from '@nestjs/testing';
import { AttractantHwcrXrefService } from './attractant_hwcr_xref.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AttractantHwcrXref } from './entities/attractant_hwcr_xref.entity';

describe('AttractantHwcrXrefService', () => {
  let service: AttractantHwcrXrefService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttractantHwcrXrefService,
        {
          provide: getRepositoryToken(AttractantHwcrXref),
          useValue: {

          },
        },],
    }).compile();

    service = module.get<AttractantHwcrXrefService>(AttractantHwcrXrefService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
