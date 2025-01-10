import { Test, TestingModule } from "@nestjs/testing";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Team } from "./entities/team.entity";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { OfficerTeamXref } from "../officer_team_xref/entities/officer_team_xref.entity";
import { CssService } from "../../external_api/css/css.service";
import { ConfigurationService } from "../configuration/configuration.service";
import { Configuration } from "../configuration/entities/configuration.entity";
import { Officer } from "../officer/entities/officer.entity";

describe("TeamController", () => {
  let controller: TeamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
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

    controller = module.get<TeamController>(TeamController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
