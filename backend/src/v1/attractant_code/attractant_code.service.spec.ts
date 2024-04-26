import { Test, TestingModule } from "@nestjs/testing";
import { AttractantCodeService } from "./attractant_code.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AttractantCode } from "./entities/attractant_code.entity";

describe("AttractantCodeService", () => {
  let service: AttractantCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttractantCodeService,
        {
          provide: getRepositoryToken(AttractantCode),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AttractantCodeService>(AttractantCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
