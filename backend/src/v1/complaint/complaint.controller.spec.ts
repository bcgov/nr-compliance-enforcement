import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { authGuardMock } from "../../../test/mocks/authGuardMock";
import { roleGuardMock } from "../../../test/mocks/roleGuardMock";
import { JwtAuthGuard } from "../../auth/jwtauth.guard";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";

import { ComplaintController } from "./complaint.controller";
import { ComplaintService } from "./complaint.service";
import { Complaint } from "./entities/complaint.entity";

import { MockComplaintRepository } from "../../../test/mocks/mock-complaint-repository";

describe("ComplaintController", () => {
  let app: INestApplication;
  let controller: ComplaintController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplaintController],
      providers: [
        ComplaintService,
        {
          provide: getRepositoryToken(Complaint),
          useFactory: MockComplaintRepository,
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

    controller = module.get<ComplaintController>(ComplaintController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return 200 when a GET is called successfully", async () => {
    //-- act
    let response = await request(app.getHttpServer()).get(`/complaint`);
    expect(response.statusCode).toBe(200);
  });
});
