import { Test, TestingModule } from "@nestjs/testing";
import { CaseFileActionService } from "./case_file_action.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("HWCRAssessmentActionService", () => {
  let service: CaseFileActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [CaseFileActionService],
    }).compile();

    service = module.get<CaseFileActionService>(CaseFileActionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
