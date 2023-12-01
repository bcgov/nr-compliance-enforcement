import { Test, TestingModule } from '@nestjs/testing';
import * as request from "supertest";
import { ComplaintController } from './complaint.controller';
import { ComplaintService } from './complaint.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Complaint } from './entities/complaint.entity';
import { INestApplication } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwtauth.guard';
import { JwtRoleGuard } from '../../auth/jwtrole.guard';
import { authGuardMock } from '../../../test/mocks/authGuardMock';
import { roleGuardMock } from '../../../test/mocks/roleGuardMock';
import { MockComplaintsAgencyRepository, MockComplaintsOfficerRepository, MockComplaintsRepository } from "../../../test/mocks/mock-complaints-repositories";
import { getMapperToken } from '@automapper/nestjs';
import { createMapper } from '@automapper/core';
import { pojos } from "@automapper/pojos";
import { AllegationComplaint } from '../allegation_complaint/entities/allegation_complaint.entity';
import { HwcrComplaint } from '../hwcr_complaint/entities/hwcr_complaint.entity';
import { MockAllegationComplaintRepository } from '../../../test/mocks/mock-allegation-complaint-repository';
import { MockWildlifeConflictComplaintRepository } from '../../../test/mocks/mock-wildlife-conflict-complaint-repository';
import { AgencyCode } from '../agency_code/entities/agency_code.entity';
import { Officer } from '../officer/entities/officer.entity';
import { Office } from '../office/entities/office.entity';
import { ContextIdFactory, REQUEST } from '@nestjs/core';

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
        {
          provide: getRepositoryToken(AllegationComplaint),
          useFactory: MockAllegationComplaintRepository
        },
        {
          provide: getRepositoryToken(HwcrComplaint),
          useFactory: MockWildlifeConflictComplaintRepository
        },
        {
          provide: getRepositoryToken(AgencyCode),
          useFactory: MockComplaintsAgencyRepository
        },
        {
          provide: getRepositoryToken(Officer),
          useFactory: MockComplaintsOfficerRepository
        },
        {
          provide: getRepositoryToken(Office),
          useFactory: MockWildlifeConflictComplaintRepository
        },
        {
          provide: REQUEST,
          useValue: {
            user: { idir_username: "TEST" }
          },
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

    controller = await module.resolve<ComplaintController>(ComplaintController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return 200 when a GET is called successfully", async () => {
//     const contextId = ContextIdFactory.create();
// jest.spyOn(ContextIdFactory, 'getByRequest').mockImplementation(() => contextId);

    //-- arrange
   const _type = "HWCR"

    //-- act
    let response = await request(app.getHttpServer()).get(
      `/Complaint/${_type}`
    );
    expect(response.statusCode).toBe(200);

    response = await request(app.getHttpServer()).get(
      `/Complaint/search/${_type}?orderBy=ASC&sortBy=complaint_identifier&page=1&pageSize=50`
    );
    expect(response.statusCode).toBe(200);
  });
});
