import { Test, TestingModule } from "@nestjs/testing";
import { HwcrOutcomeCodeService } from "./hwcr_outcome_code.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("HwcrOutcomeCodeService", () => {
  let service: HwcrOutcomeCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [HwcrOutcomeCodeService],
    }).compile();

    service = module.get<HwcrOutcomeCodeService>(HwcrOutcomeCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
