import { Test, TestingModule } from "@nestjs/testing";
import { ReportedByCodeService } from "./reported_by_code.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ReportedByCode } from "./entities/reported_by_code.entity";

describe("ReportedByCodeService", () => {
  let service: ReportedByCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportedByCodeService,
        {
          provide: getRepositoryToken(ReportedByCode),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ReportedByCodeService>(ReportedByCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
