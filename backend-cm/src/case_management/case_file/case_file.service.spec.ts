import { Test, TestingModule } from "@nestjs/testing";
import { CaseFileService } from "./case_file.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";
import { CaseFileActionService } from "../case_file_action/case_file_action.service";

describe("CaseFileService", () => {
  let service: CaseFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [
        CaseFileService,
        {
          provide: CaseFileActionService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CaseFileService>(CaseFileService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
