import { Test, TestingModule } from '@nestjs/testing';
import * as request from "supertest";
import { ComplaintController } from './complaint.controller';
import { ComplaintService } from './complaint.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Complaint } from './entities/complaint.entity';
import { INestApplication } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwtauth.guard';
import { JwtRoleGuard } from 'src/auth/jwtrole.guard';
import { authGuardMock } from 'test/mocks/authGuardMock';
import { roleGuardMock } from 'test/mocks/roleGuardMock';
import { MockComplaintsRepository } from "../../../test/mocks/mock-complaints-repositories";
import { getMapperToken } from '@automapper/nestjs';
import { createMapper } from '@automapper/core';
import { pojos } from "@automapper/pojos";

describe("Testing: Complaint Controller", () => {
  let app: INestApplication;
  let controller: ComplaintController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplaintController],
      providers: [
        ComplaintService,
        {
          provide: getRepositoryToken(Complaint),
          useFactory: MockComplaintsRepository,
        },
        {
          provide: getMapperToken(),
          useValue: createMapper({
            strategyInitializer: pojos(),
          }),
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
    //-- arrange
   const _type = "HWCR"

    //-- act
    let response = await request(app.getHttpServer()).get(
      `/Complaint/${_type}`
    );
    expect(response.statusCode).toBe(200);
  });
});
