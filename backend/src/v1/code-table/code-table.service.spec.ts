import { Test, TestingModule } from '@nestjs/testing';
import { CodeTableService } from './code-table.service';

describe('CodeTableService', () => {
  let service: CodeTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodeTableService],
    }).compile();

    service = module.get<CodeTableService>(CodeTableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
