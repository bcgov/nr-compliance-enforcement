import { Test, TestingModule } from "@nestjs/testing";
import { CaseFileActionService } from "./case_file_action.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("HWCRAssessmentActionService", () => {
  let service: CaseFileActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [CaseFileActionService],
    }).compile();

    service = await module.resolve<CaseFileActionService>(CaseFileActionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
