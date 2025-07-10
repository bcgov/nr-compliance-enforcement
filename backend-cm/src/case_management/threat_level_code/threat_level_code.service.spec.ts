import { Test, TestingModule } from "@nestjs/testing";
import { ThreatLevelCodeService } from "./threat_level_code.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("ThreatLevelCodeService", () => {
  let service: ThreatLevelCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [ThreatLevelCodeService],
    }).compile();

    service = module.get<ThreatLevelCodeService>(ThreatLevelCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
