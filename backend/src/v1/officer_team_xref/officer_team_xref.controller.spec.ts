import { Test, TestingModule } from "@nestjs/testing";
import { OfficerTeamXrefController } from "./officer_team_xref.controller";
import { OfficerTeamXrefService } from "./officer_team_xref.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { OfficerTeamXref } from "./entities/officer_team_xref.entity";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";

describe("OfficerTeamXrefController", () => {
  let controller: OfficerTeamXrefController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfficerTeamXrefController],
      providers: [
        OfficerTeamXrefService,
        {
          provide: getRepositoryToken(OfficerTeamXref),
          useValue: {},
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    controller = module.get<OfficerTeamXrefController>(OfficerTeamXrefController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
