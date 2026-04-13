import { Test, TestingModule } from "@nestjs/testing";
import { HwcrOutcomeCodeService } from "./hwcr_outcome_code.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("HwcrOutcomeCodeService", () => {
  let service: HwcrOutcomeCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [HwcrOutcomeCodeService],
    }).compile();

    service = await module.resolve<HwcrOutcomeCodeService>(HwcrOutcomeCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
