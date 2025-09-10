import { Test, TestingModule } from "@nestjs/testing";
import { OutcomeAgencyCodeService } from "./outcome_agency_code.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("AgencyCodeService", () => {
  let service: OutcomeAgencyCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [OutcomeAgencyCodeService],
    }).compile();

    service = module.get<OutcomeAgencyCodeService>(OutcomeAgencyCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
