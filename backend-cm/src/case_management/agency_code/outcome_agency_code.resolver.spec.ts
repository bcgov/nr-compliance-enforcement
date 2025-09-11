import { Test, TestingModule } from "@nestjs/testing";
import { OutcomeAgencyCodeResolver } from "./outcome_agency_code.resolver";
import { OutcomeAgencyCodeService } from "./outcome_agency_code.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("OutcomeAgencyCodeResolver", () => {
  let resolver: OutcomeAgencyCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [OutcomeAgencyCodeResolver, OutcomeAgencyCodeService],
    }).compile();

    resolver = module.get<OutcomeAgencyCodeResolver>(OutcomeAgencyCodeResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
