import { Test, TestingModule } from "@nestjs/testing";
import { ChesService } from "./ches.service";
import { ConfigurationService } from "../../v1/configuration/configuration.service";

describe("ChesService", () => {
  let service: ChesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChesService,
        {
          provide: ConfigurationService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ChesService>(ChesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
