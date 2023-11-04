import { Test, TestingModule } from '@nestjs/testing';
import { CodeTableController } from './code-table.controller';
import { CodeTableService } from './code-table.service';

describe('CodeTableController', () => {
  let controller: CodeTableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodeTableController],
      providers: [CodeTableService],
    }).compile();

    controller = module.get<CodeTableController>(CodeTableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
