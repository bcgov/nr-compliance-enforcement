import { Test, TestingModule } from "@nestjs/testing";
import { OutcomeAgencyCodeService } from "./outcome_agency_code.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("AgencyCodeService", () => {
  let service: OutcomeAgencyCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [OutcomeAgencyCodeService],
    }).compile();

    service = module.get<OutcomeAgencyCodeService>(OutcomeAgencyCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
