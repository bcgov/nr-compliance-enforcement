import { Test, TestingModule } from "@nestjs/testing";
import { DrugRemainingOutcomeCodeService } from "./drug_remaining_outcome_code.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("DrugRemainingOutcomeCodeService", () => {
  let service: DrugRemainingOutcomeCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [DrugRemainingOutcomeCodeService],
    }).compile();

    service = await module.resolve<DrugRemainingOutcomeCodeService>(DrugRemainingOutcomeCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
