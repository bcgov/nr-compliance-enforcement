import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ConfigurationService } from "../../v1/configuration/configuration.service";
import { Configuration } from "../../v1/configuration/entities/configuration.entity";
import { CssService } from "./css.service";
import { CacheModule } from "@nestjs/cache-manager";

describe("CssService", () => {
  let service: CssService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        CssService,
        ConfigurationService,
        {
          provide: getRepositoryToken(Configuration),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CssService>(CssService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
