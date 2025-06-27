import { Test, TestingModule } from "@nestjs/testing";
import { ThreatLevelCodeResolver } from "./threat_level_code.resolver";
import { ThreatLevelCodeService } from "./threat_level_code.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("ThreatLevelCodeResolver", () => {
  let resolver: ThreatLevelCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [ThreatLevelCodeResolver, ThreatLevelCodeService],
    }).compile();

    resolver = module.get<ThreatLevelCodeResolver>(ThreatLevelCodeResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
