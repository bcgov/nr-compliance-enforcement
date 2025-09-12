import { Test, TestingModule } from "@nestjs/testing";
import { ThreatLevelCodeResolver } from "./threat_level_code.resolver";
import { ThreatLevelCodeService } from "./threat_level_code.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("ThreatLevelCodeResolver", () => {
  let resolver: ThreatLevelCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [ThreatLevelCodeResolver, ThreatLevelCodeService],
    }).compile();

    resolver = module.get<ThreatLevelCodeResolver>(ThreatLevelCodeResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
