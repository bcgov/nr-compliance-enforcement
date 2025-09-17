import { Test, TestingModule } from "@nestjs/testing";
import { OutcomeAgencyCodeResolver } from "./outcome_agency_code.resolver";
import { OutcomeAgencyCodeService } from "./outcome_agency_code.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("OutcomeAgencyCodeResolver", () => {
  let resolver: OutcomeAgencyCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [OutcomeAgencyCodeResolver, OutcomeAgencyCodeService],
    }).compile();

    resolver = module.get<OutcomeAgencyCodeResolver>(OutcomeAgencyCodeResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
