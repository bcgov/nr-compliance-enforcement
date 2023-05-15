import { Test, TestingModule } from '@nestjs/testing';
import { AttractantHwcrXrefService } from './attractant_hwcr_xref.service';

describe('AttractantHwcrXrefService', () => {
  let service: AttractantHwcrXrefService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttractantHwcrXrefService],
    }).compile();

    service = module.get<AttractantHwcrXrefService>(AttractantHwcrXrefService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
