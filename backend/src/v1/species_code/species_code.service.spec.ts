import { Test, TestingModule } from "@nestjs/testing";
import { SpeciesCodeService } from "./species_code.service";
import { SpeciesCode } from "./entities/species_code.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("SpeciesCodeService", () => {
  let service: SpeciesCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpeciesCodeService,
        {
          provide: getRepositoryToken(SpeciesCode),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SpeciesCodeService>(SpeciesCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
