import { Test, TestingModule } from "@nestjs/testing";
import { PersonController } from "./person.controller";
import { PersonService } from "./person.service";
import { Person } from "./entities/person.entity";
import { DataSource } from "typeorm";
import { authGuardMock } from "../../../test/mocks/authGuardMock";
import { roleGuardMock } from "../../../test/mocks/roleGuardMock";
import { JwtAuthGuard } from "../../auth/jwtauth.guard";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { PersonRepositoryMockFactory } from "../../../test/mocks/personRepositoryMockFactory";
import { getRepositoryToken } from "@nestjs/typeorm";
import { INestApplication } from "@nestjs/common";
import request from "supertest";

describe("PersonController", () => {
  let controller: PersonController;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
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
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ authGuardMock })
      .overrideGuard(JwtRoleGuard)
      .useValue({ roleGuardMock })
      .compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get<PersonController>(PersonController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return 201 when a POST is called successfully", () => {
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

    return request(app.getHttpServer()).post("/person/").send({ personDto }).expect(201);
  });

  it("should return 200 when a GET is called successfully", async () => {
    let response = await request(app.getHttpServer()).get("/person/");

    expect(response.statusCode).toBe(200);

    response = await request(app.getHttpServer()).get("/person/81c5d19b-b188-4b52-8ca3-f00fa987ed88/");

    expect(response.statusCode).toBe(200);

    response = await request(app.getHttpServer()).get("/person/find-by-zone/SISL/");

    expect(response.statusCode).toBe(200);

    response = await request(app.getHttpServer()).get("/person/find-by-office/VICTORIA/");

    expect(response.statusCode).toBe(200);

    response = await request(app.getHttpServer()).get("/person/find-by-zone/SISL/");

    expect(response.statusCode).toBe(200);
  });

  it("should return 200 when a DELETE is called successfully", () => {
    return request(app.getHttpServer()).delete("/person/81c5d19b-b188-4b52-8ca3-f00fa987ed88/").expect(200);
  });

  it("should return 200 when a PATCH is called successfully", () => {
    const personDto = {
      person_guid: null,
      first_name: "Miss",
      middle_name_1: "Jane",
      middle_name_2: "Angela",
      last_name: "Marple",
      create_user_id: "JEST",
      create_utc_timestamp: new Date(),
      update_user_id: null,
      update_utc_timestamp: null,
    };

    return request(app.getHttpServer())
      .patch("/person/81c5d19b-b188-4b52-8ca3-f00fa987ed88/")
      .send({ personDto })
      .expect(200);
  });
});
