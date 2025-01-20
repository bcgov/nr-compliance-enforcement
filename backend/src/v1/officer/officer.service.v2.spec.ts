import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { OfficerService } from "./officer.service";
import { Officer } from "./entities/officer.entity";

import { MockOfficerRepository } from "../../../test/mocks/mock-officer-repository";
import { MockOfficeRepository } from "../../../test/mocks/mock-office-repository";
import { PersonRepositoryMockFactory } from "../../../test/mocks/personRepositoryMockFactory";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { PersonService } from "../person/person.service";
import { Person } from "../person/entities/person.entity";
import { OfficeService } from "../office/office.service";
import { Office } from "../office/entities/office.entity";
import { CssService } from "../../external_api/css/css.service";
import { ConfigurationService } from "../configuration/configuration.service";
import { Configuration } from "../configuration/entities/configuration.entity";
import { MockRoleRepository } from "../../../test/mocks/mock-role-repository";
import { REQUEST } from "@nestjs/core";
import { Team } from "../team/entities/team.entity";
import { TeamService } from "../team/team.service";
import { OfficerTeamXrefService } from "../officer_team_xref/officer_team_xref.service";
import { OfficerTeamXref } from "../officer_team_xref/entities/officer_team_xref.entity";
import { CacheModule } from "@nestjs/cache-manager";

describe("Testing: OfficerService", () => {
  let service: OfficerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        OfficerService,
        {
          provide: getRepositoryToken(Officer),
          useFactory: MockOfficerRepository,
        },
        PersonService,
        {
          provide: getRepositoryToken(Person),
          useFactory: PersonRepositoryMockFactory,
        },
        OfficeService,
        {
          provide: getRepositoryToken(Office),
          useFactory: MockOfficeRepository,
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
        CssService,
        {
          provide: REQUEST,
          useFactory: MockRoleRepository,
        },
        ConfigurationService,
        {
          provide: getRepositoryToken(Configuration),
          useValue: {},
        },
        TeamService,
        {
          provide: getRepositoryToken(Team),
          useValue: {},
        },
        OfficerTeamXrefService,
        {
          provide: getRepositoryToken(OfficerTeamXref),
          useValue: {},
        },
      ],
    })
      .compile()
      .catch((err) => {
        // Helps catch ninja like errors from compilation-*groa
        console.error("ERROR!", err);
        throw err;
      });

    service = module.get<OfficerService>(OfficerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return a collection of all officers", async () => {
    const _id = "84ac75b9-c584-4f55-a70c-6fa35c8efde4";
    const _userId = "TSPRADO";

    const _officeId = "b494082e-35a3-468f-8955-4aa002066b36";

    const _personId = "7de151c1-ae52-41c3-834d-d538bbb50cda";
    const _firstName = "Tobe";
    const _lastName = "Sprado";

    const results = await service.findAll();

    expect(results).not.toBe(null);
    expect(results.length).toBe(8);

    const officer = results[3];
    const {
      officer_guid: id,
      user_id: userId,
      office_guid: { office_guid: officeId },
      person_guid: {
        person_guid: personId,
        first_name: firstName,
        last_name: lastName,
        middle_name_1: middleName1,
        middle_name_2: middleName2,
      },
    } = officer;

    expect(id).toBe(_id);
    expect(userId).toBe(_userId);
    expect(officeId).toBe(_officeId);
    expect(personId).toBe(_personId);
    expect(firstName).toBe(_firstName);
    expect(lastName).toBe(_lastName);
    expect(middleName1).toBe(null);
    expect(middleName2).toBe(null);
  });

  it("should return office by office_id", async () => {
    //-- arange
    const _id = "9d171865-aab6-43d1-bbf2-93b4d4c5ba02";

    const _userId = "AWILCOX";
    const _authUserId = "287d4e72-8409-4dd1-991a-8b1117b8eb2a";

    const _officeId = "9fc7327b-b206-4a5c-88f1-2875a456eb49";

    const _personId = "666c0f30-d707-4ade-b67f-9b888fe234e6";
    const _firstName = "Alec";
    const _lastName = "Wilcox";

    //-- act
    const result: any = await service.findByOffice(_id);

    //-- assert
    expect(result).not.toBe(null);

    const {
      officer_guid: id,
      user_id: userId,
      auth_user_guid: authUserId,
      office_guid: { office_guid: officeId },
      person_guid: {
        person_guid: personId,
        first_name: firstName,
        last_name: lastName,
        middle_name_1: middleName1,
        middle_name_2: middleName2,
      },
    } = result;

    expect(id).toBe(_id);
    expect(userId).toBe(_userId);
    expect(authUserId).toBe(_authUserId);
    expect(officeId).toBe(_officeId);
    expect(personId).toBe(_personId);
    expect(firstName).toBe(_firstName);
    expect(lastName).toBe(_lastName);
    expect(middleName1).toBe(null);
    expect(middleName2).toBe(null);
  });

  it("should return officer by auth_user_id", async () => {
    //-- arrange
    const _authUserId = "a6620175-84d0-436b-b13e-d97457d69588";

    const _id = "65dbad8b-790a-43cb-b394-c8019f4c86e2";
    const _userId = "M2SEARS";

    const _officeId = "db343458-8eca-42c2-91ec-070b3e6de663";

    const _personId = "5b9bcbf6-73b4-4b56-8fc3-d979bb3c1ff7";
    const _firstName = "Mike";
    const _lastName = "Sears";

    //-- act
    const result = await service.findByAuthUserGuid(_authUserId);

    //-- assert
    expect(result).not.toBe(null);

    const {
      officer_guid: id,
      user_id: userId,
      auth_user_guid: authUserId,
      office_guid: { office_guid: officeId },
      person_guid: {
        person_guid: personId,
        first_name: firstName,
        last_name: lastName,
        middle_name_1: middleName1,
        middle_name_2: middleName2,
      },
    } = result;

    expect(id).toBe(_id);
    expect(userId).toBe(_userId);
    expect(authUserId).toBe(_authUserId);
    expect(officeId).toBe(_officeId);
    expect(personId).toBe(_personId);
    expect(firstName).toBe(_firstName);
    expect(lastName).toBe(_lastName);
    expect(middleName1).toBe(null);
    expect(middleName2).toBe(null);
  });

  it("should return office by user_id", async () => {
    //-- arrange
    const _authUserId = "a6620175-84d0-436b-b13e-d97457d69588";

    const _id = "65dbad8b-790a-43cb-b394-c8019f4c86e2";
    const _userId = "M2SEARS";

    const _officeId = "db343458-8eca-42c2-91ec-070b3e6de663";

    const _personId = "5b9bcbf6-73b4-4b56-8fc3-d979bb3c1ff7";
    const _firstName = "Mike";
    const _lastName = "Sears";

    //-- act
    const result = await service.findByUserId(_userId);

    //-- assert
    expect(result).not.toBe(null);

    const {
      officer_guid: id,
      user_id: userId,
      auth_user_guid: authUserId,
      office_guid: { office_guid: officeId },
      person_guid: {
        person_guid: personId,
        first_name: firstName,
        last_name: lastName,
        middle_name_1: middleName1,
        middle_name_2: middleName2,
      },
    } = result;

    expect(id).toBe(_id);
    expect(userId).toBe(_userId);
    expect(authUserId).toBe(_authUserId);
    expect(officeId).toBe(_officeId);
    expect(personId).toBe(_personId);
    expect(firstName).toBe(_firstName);
    expect(lastName).toBe(_lastName);
    expect(middleName1).toBe(null);
    expect(middleName2).toBe(null);
  });
});
