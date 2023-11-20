import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { authGuardMock } from "../../../test/mocks/authGuardMock";
import { roleGuardMock } from "../../../test/mocks/roleGuardMock";
import { JwtAuthGuard } from "../../auth/jwtauth.guard";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ComplaintsController } from "./complaints.controller";
import { ComplaintsService } from "./complaints.service";
import { Complaint } from "../complaint/entities/complaint.entity";
import { MockComplaintsRepository } from "../../../test/mocks/mock-complaints-repositories";

describe("Testing: Complaints Controller", () => {
  let app: INestApplication;
  let controller: ComplaintsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplaintsController],
      providers: [
        ComplaintsService,
        {
          provide: getRepositoryToken(Complaint),
          useFactory: MockComplaintsRepository,
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

    controller = module.get<ComplaintsController>(ComplaintsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return 200 when a GET is called successfully", async () => {
    //-- arrange
   const _type = "HWCR"

    //-- act
    let response = await request(app.getHttpServer()).get(
      `/complaints/${_type}`
    );
    expect(response.statusCode).toBe(200);
  });
});
