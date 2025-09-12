import { Test, TestingModule } from "@nestjs/testing";
import { ConfigurationResolver } from "./configuration.resolver";
import { ConfigurationService } from "./configuration.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("ConfigurationResolver", () => {
  let resolver: ConfigurationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [ConfigurationResolver, ConfigurationService],
    }).compile();

    resolver = module.get<ConfigurationResolver>(ConfigurationResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
