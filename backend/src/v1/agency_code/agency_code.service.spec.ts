import { Test, TestingModule } from "@nestjs/testing";
import { AgencyCodeService } from "./agency_code.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AgencyCode } from "./entities/agency_code.entity";

describe("AgencyCodeService", () => {
  let service: AgencyCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgencyCodeService,
        {
          provide: getRepositoryToken(AgencyCode),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AgencyCodeService>(AgencyCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
