import { Test, TestingModule } from "@nestjs/testing";
import { ThreatLevelCodeService } from "./threat_level_code.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("ThreatLevelCodeService", () => {
  let service: ThreatLevelCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [ThreatLevelCodeService],
    }).compile();

    service = module.get<ThreatLevelCodeService>(ThreatLevelCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
