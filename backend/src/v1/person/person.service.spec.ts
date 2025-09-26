import { Test, TestingModule } from "@nestjs/testing";
import { PersonService } from "./person.service";
import { Person } from "./entities/person.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { PersonRepositoryMockFactory } from "../../../test/mocks/personRepositoryMockFactory";

describe("PersonService", () => {
  let service: PersonService;
  let repository: Repository<Person>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: getRepositoryToken(Person),
          useFactory: PersonRepositoryMockFactory,
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    service = module.get<PersonService>(PersonService);
    repository = module.get<Repository<Person>>(getRepositoryToken(Person));
    dataSource = module.get<DataSource>(DataSource);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a new person record or throw an error", async () => {
    const personDto = {
      person_guid: null,
      first_name: "Miss",
      middle_name_1: "Jane",
      middle_name_2: null,
      last_name: "Marple",
      create_user_id: "JEST",
      create_utc_timestamp: new Date(),
      update_user_id: null,
      update_utc_timestamp: null,
    };

    let response = await service.create(personDto);

    expect(response.first_name).toBe("Miss");
    expect(response.middle_name_1).toBe("Jane");
    expect(response.middle_name_2).toBeNull;
    expect(response.last_name).toBe("Marple");
    expect(repository.create).toHaveBeenCalled();
    //Note saves are managed via Query Runner so unable to validate them

    //mock is currently setup such that second call in a test will fail
    response = await service.create(personDto);
    expect(response).toThrowError;
  });

  it("should create a new person record inside a transaction", async () => {
    const personDto = {
      person_guid: null,
      first_name: "Miss",
      middle_name_1: "Jane",
      middle_name_2: null,
      last_name: "Marple",
      create_user_id: "JEST",
      create_utc_timestamp: new Date(),
      update_user_id: null,
      update_utc_timestamp: null,
    };

    const queryRunner = dataSource.createQueryRunner();

    let response = await service.createInTransaction(personDto, queryRunner);

    expect(response.first_name).toBe("Miss");
    expect(response.middle_name_1).toBe("Jane");
    expect(response.middle_name_2).toBeNull;
    expect(response.last_name).toBe("Marple");
    expect(repository.create).toHaveBeenCalled();
    expect(queryRunner.manager.save).toHaveBeenCalled();
    //Note saves are managed via Query Runner so unable to validate them

    //mock is currently setup such that second call in a test will fail
    response = await service.create(personDto);
    expect(response).toThrowError;
  });

  //This method is not properly implemented yet.  Leaving this here so the test gets written when it is done.
  it("should return all values", async () => {
    let response = service.findAll();
    expect(response).toBe("This action returns all person");
  });

  it("should return a single value", async () => {
    const person_guid = "81c5d19b-b188-4b52-8ca3-f00fa987ed88";

    let response = await service.findOne(person_guid);

    expect(response.first_name).toBe("William");
    expect(response.middle_name_1).toBe("Sherlock");
    expect(response.middle_name_2).toBe("Scott");
    expect(response.last_name).toBe("Holmes");
  });

  it("should return a subset of officers when passed a zone parameter", async () => {
    const zoneCode = "SISL";

    let response = await service.findByZone(zoneCode);

    expect(response).toHaveLength(2);
    expect(response[0].first_name).toBe("Smokey");
    expect(response[1].first_name).toBe("Jack");
  });

  it("should return a subset of officers when passed a office parameter", async () => {
    const officeCode = "Victoria";

    let response = await service.findByOffice(officeCode);

    expect(response).toHaveLength(2);
    expect(response[0].first_name).toBe("Smokey");
    expect(response[1].first_name).toBe("Jack");
  });

  //This method is not properly implemented yet.  Leaving this here so the test gets written when it is done.
  it("should be able to update a value", async () => {
    const person_guid = "81c5d19b-b188-4b52-8ca3-f00fa987ed88";
    const personDto = {
      person_guid: null,
      first_name: "William",
      middle_name_1: "Sherlock",
      middle_name_2: "Scott",
      last_name: "Holmes",
      create_user_id: "JEST",
      create_utc_timestamp: new Date(),
      update_user_id: null,
      update_utc_timestamp: null,
    };

    let response = await service.update(person_guid, personDto);

    expect(response.first_name).toBe("William");
    expect(response.middle_name_1).toBe("Sherlock");
    expect(response.middle_name_2).toBe("Scott");
    expect(response.last_name).toBe("Holmes");
  });

  //This method is not properly implemented yet.  Leaving this here so the test gets written when it is done.
  it("should be able to remove a value", async () => {
    const person_guid = 111;

    let response = service.remove(person_guid);

    expect(response).toBe("This action removes a #111 person");
  });
});
