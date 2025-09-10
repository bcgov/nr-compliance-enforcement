import { Test, TestingModule } from "@nestjs/testing";
import { ComplaintOutcomeResolver } from "./complaint_outcome.resolver";
import { ComplaintOutcomeService } from "./complaint_outcome.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";
import { CaseFileActionService } from "../case_file_action/case_file_action.service";

describe("ComplaintOutcomeResolver", () => {
  let resolver: ComplaintOutcomeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [
        ComplaintOutcomeResolver,
        ComplaintOutcomeService,
        {
          provide: CaseFileActionService,
          useValue: {},
        },
      ],
    }).compile();

    resolver = module.get<ComplaintOutcomeResolver>(ComplaintOutcomeResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
