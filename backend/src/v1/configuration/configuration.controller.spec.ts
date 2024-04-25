import { Test, TestingModule } from "@nestjs/testing";
import { ConfigurationController } from "./configuration.controller";
import { ConfigurationService } from "./configuration.service";
import { Configuration } from "./entities/configuration.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("ConfigurationController", () => {
  let controller: ConfigurationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigurationController],
      providers: [
        ConfigurationService,
        {
          provide: getRepositoryToken(Configuration),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ConfigurationController>(ConfigurationController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
