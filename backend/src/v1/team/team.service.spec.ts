import { Test, TestingModule } from "@nestjs/testing";
import { TeamService } from "./team.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Team } from "./entities/team.entity";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { OfficerTeamXref } from "../officer_team_xref/entities/officer_team_xref.entity";
import { CssService } from "../../external_api/css/css.service";
import { ConfigurationService } from "../configuration/configuration.service";
import { Configuration } from "../configuration/entities/configuration.entity";
import { Officer } from "..//officer/entities/officer.entity";
import { CacheModule } from "@nestjs/cache-manager";

describe("TeamService", () => {
  let service: TeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        TeamService,
        {
          provide: getRepositoryToken(Team),
          useValue: {},
        },
        {
          provide: getRepositoryToken(OfficerTeamXref),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Officer),
          useValue: {},
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
        CssService,
        ConfigurationService,
        {
          provide: getRepositoryToken(Configuration),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
