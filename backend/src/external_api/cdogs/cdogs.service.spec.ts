import { Test, TestingModule } from "@nestjs/testing";
import { CdogsService } from "../cdogs/cdogs.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ConfigurationService } from "../../v1/configuration/configuration.service";
import { Configuration } from "../../v1/configuration/entities/configuration.entity";

describe("CdogsService", () => {
  let service: CdogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CdogsService,
        ConfigurationService,
        {
          provide: getRepositoryToken(Configuration),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CdogsService>(CdogsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
