import { Test, TestingModule } from "@nestjs/testing";
import { TeamCodeService } from "./team_code.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { TeamCode } from "./entities/team_code.entity";

describe("TeamCodeService", () => {
  let service: TeamCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamCodeService,
        {
          provide: getRepositoryToken(TeamCode),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TeamCodeService>(TeamCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
