import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ConfigurationService } from "../../v1/configuration/configuration.service";
import { Configuration } from "../../v1/configuration/entities/configuration.entity";
import { WebeocService } from "./webeoc.service";
import { CacheModule } from "@nestjs/cache-manager";

describe("WebeocService", () => {
  let service: WebeocService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        WebeocService,
        ConfigurationService,
        {
          provide: getRepositoryToken(Configuration),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<WebeocService>(WebeocService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
