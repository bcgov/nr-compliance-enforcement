import { Test, TestingModule } from "@nestjs/testing";
import { AgencyCodeService } from "./agency_code.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("AgencyCodeService", () => {
  let service: AgencyCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [AgencyCodeService],
    }).compile();

    service = module.get<AgencyCodeService>(AgencyCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
