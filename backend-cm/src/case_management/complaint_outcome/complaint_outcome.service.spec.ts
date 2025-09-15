import { Test, TestingModule } from "@nestjs/testing";
import { ComplaintOutcomeService } from "./complaint_outcome.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";
import { CaseFileActionService } from "../case_file_action/case_file_action.service";

describe("ComplaintOutcomeService", () => {
  let service: ComplaintOutcomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [
        ComplaintOutcomeService,
        {
          provide: CaseFileActionService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ComplaintOutcomeService>(ComplaintOutcomeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
