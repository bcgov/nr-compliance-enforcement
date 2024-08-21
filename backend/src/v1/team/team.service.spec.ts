import { Test, TestingModule } from "@nestjs/testing";
import { TeamService } from "./team.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Team } from "./entities/team.entity";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { TeamCode } from "../team_code/entities/team_code.entity";

describe("TeamService", () => {
  let service: TeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: getRepositoryToken(Team),
          useValue: {},
        },
        {
          provide: getRepositoryToken(TeamCode),
          useValue: {},
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
