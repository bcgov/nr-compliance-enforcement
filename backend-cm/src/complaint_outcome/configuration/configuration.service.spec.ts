import { Test, TestingModule } from "@nestjs/testing";
import { ConfigurationService } from "./configuration.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("ConfigurationService", () => {
  let service: ConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [ConfigurationService],
    }).compile();

    service = module.get<ConfigurationService>(ConfigurationService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
