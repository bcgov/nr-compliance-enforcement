import { Test, TestingModule } from "@nestjs/testing";
import { OfficerTeamXrefService } from "./officer_team_xref.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { OfficerTeamXref } from "./entities/officer_team_xref.entity";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";

describe("OfficerTeamXrefService", () => {
  let service: OfficerTeamXrefService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<OfficerTeamXrefService>(OfficerTeamXrefService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
