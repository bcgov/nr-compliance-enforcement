import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { INestApplication } from "@nestjs/common";

import { OfficeController } from "./office.controller";
import { OfficeService } from "./office.service";
import { Office } from "./entities/office.entity";

import { authGuardMock } from "../../../test/mocks/authGuardMock";
import { roleGuardMock } from "../../../test/mocks/roleGuardMock";
import { JwtAuthGuard } from "../../auth/jwtauth.guard";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";

import { MockOfficeRepository } from "../../../test/mocks/mock-office-repository";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";

import request from "supertest";
import { UUID } from "crypto";
import { CreateOfficeDto } from "./dto/create-office.dto";
import { UpdateOfficeDto } from "./dto/update-office.dto";

describe("Testing: Office Controller", () => {
  let app: INestApplication;
  let controller: OfficeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfficeController],
      providers: [
        OfficeService,
        {
          provide: getRepositoryToken(Office),
          useFactory: MockOfficeRepository,
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

    controller = module.get<OfficeController>(OfficeController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return 200 when a GET is called successfully", async () => {
    const _officeId: UUID = "2044f08d-b53c-489a-8584-dd867b63514a";
    const _unit = "CRSTN";
    const _zone = "NCHKOLKS";

    let response = await request(app.getHttpServer()).get(`/office/${_officeId}`);
    expect(response.statusCode).toBe(200);

    response = await request(app.getHttpServer()).get(`/office/by-zone/${_zone}`);
    expect(response.statusCode).toBe(200);

    response = await request(app.getHttpServer()).get(`/office/by-geo-code/${_unit}`);
    expect(response.statusCode).toBe(200);
  });

  it("should return 201 when a POST is called successfully", () => {
    const payload: CreateOfficeDto = {
      geo_organization_unit_code: "TEST",
      agency_code_ref: "COS",
      create_user_id: "",
      create_utc_timestamp: new Date(),
      update_user_id: "",
      update_utc_timestamp: new Date(),
    };

    return request(app.getHttpServer()).post("/office/").send({ payload }).expect(201);
  });

  it("should return 501 when a PATCH is is not implemented", () => {
    const payload: UpdateOfficeDto = {
      geo_organization_unit_code: "TEST",
      agency_code_ref: "COS",
      create_user_id: "JEST",
      create_utc_timestamp: new Date(),
      update_user_id: null,
      update_utc_timestamp: null,
    };

    return request(app.getHttpServer())
      .patch("/office/81c5d19b-b188-4b52-8ca3-f00fa987ed88/")
      .send({ payload })
      .expect(501);
  });

  it("should return 501 when a DELETE is is not implemented", async () => {
    const _officeId: UUID = "2044f08d-b53c-489a-8584-dd867b63514a";

    let response = await request(app.getHttpServer()).delete(`/office/${_officeId}`);
    expect(response.statusCode).toBe(501);
  });
});
