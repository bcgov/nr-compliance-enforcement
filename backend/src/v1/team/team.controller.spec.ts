import { Test, TestingModule } from "@nestjs/testing";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Team } from "./entities/team.entity";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";

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
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    controller = module.get<TeamController>(TeamController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
