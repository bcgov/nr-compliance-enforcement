import { Test, TestingModule } from "@nestjs/testing";
import { OfficerController } from "./officer.controller";
import { OfficerService } from "./officer.service";
import { Officer } from "./entities/officer.entity";
import { Person } from "../person/entities/person.entity";
import { Office } from "../office/entities/office.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { PersonService } from "../person/person.service";
import { OfficeService } from "../office/office.service";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { CssService } from "../../external_api/css/css.service";
import { ConfigurationService } from "../configuration/configuration.service";
import { Configuration } from "../configuration/entities/configuration.entity";

describe("OfficerController", () => {
  let controller: OfficerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfficerController],
      providers: [
        OfficerService,
        {
          provide: getRepositoryToken(Officer),
          useValue: {},
        },
        PersonService,
        {
          provide: getRepositoryToken(Person),
          useValue: {},
        },
        OfficeService,
        {
          provide: getRepositoryToken(Office),
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

    controller = module.get<OfficerController>(OfficerController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
