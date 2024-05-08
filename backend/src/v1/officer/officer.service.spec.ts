import { Test, TestingModule } from "@nestjs/testing";
import { OfficerService } from "./officer.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Officer } from "./entities/officer.entity";
import { Person } from "../person/entities/person.entity";
import { Office } from "../office/entities/office.entity";
import { PersonService } from "../person/person.service";
import { OfficeService } from "../office/office.service";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";

describe("OfficerService", () => {
  let service: OfficerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    service = module.get<OfficerService>(OfficerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
