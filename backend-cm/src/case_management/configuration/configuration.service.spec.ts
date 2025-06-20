import { Test, TestingModule } from "@nestjs/testing";
import { ConfigurationService } from "./configuration.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("ConfigurationService", () => {
  let service: ConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [ConfigurationService],
    }).compile();

    service = module.get<ConfigurationService>(ConfigurationService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
