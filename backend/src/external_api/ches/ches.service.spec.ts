import { Test, TestingModule } from '@nestjs/testing';
import { ChesService } from './ches.service';

describe('ChesService', () => {
  let service: ChesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChesService],
    }).compile();

    service = module.get<ChesService>(ChesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
