import { Test, TestingModule } from "@nestjs/testing";
import { AgencyCodeResolver } from "./agency_code.resolver";
import { AgencyCodeService } from "./agency_code.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("AgencyCodeResolver", () => {
  let resolver: AgencyCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [AgencyCodeResolver, AgencyCodeService],
    }).compile();

    resolver = module.get<AgencyCodeResolver>(AgencyCodeResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
