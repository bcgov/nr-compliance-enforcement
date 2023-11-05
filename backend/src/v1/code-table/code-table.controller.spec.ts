import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { authGuardMock } from "../../../test/mocks/authGuardMock";
import { roleGuardMock } from "../../../test/mocks/roleGuardMock";
import { JwtAuthGuard } from "../../auth/jwtauth.guard";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";

import { CodeTableController } from "./code-table.controller";
import { CodeTableService } from "./code-table.service";
import { MockAgencyCodeTableRepository, MockAttractantCodeTableRepository, MockComplaintStatusCodeTableRepository, MockNatureOfComplaintCodeTableRepository, MockOrganizationUnitCodeTableRepository, MockOrganizationUnitTypeCodeTableRepository } from "../../../test/mocks/mock-code-table-repositories";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { AttractantCode } from "../attractant_code/entities/attractant_code.entity";
import { ComplaintStatusCode } from "../complaint_status_code/entities/complaint_status_code.entity";
import { HwcrComplaintNatureCode } from "../hwcr_complaint_nature_code/entities/hwcr_complaint_nature_code.entity";
import { GeoOrgUnitTypeCode } from "../geo_org_unit_type_code/entities/geo_org_unit_type_code.entity";
import { GeoOrganizationUnitCode } from "../geo_organization_unit_code/entities/geo_organization_unit_code.entity";

describe("Testing: CodeTable Controller", () => {
  let app: INestApplication;
  let controller: CodeTableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodeTableController],
      providers: [
        CodeTableService,
        {
          provide: getRepositoryToken(AgencyCode),
          useFactory: MockAgencyCodeTableRepository,
        },
        {
          provide: getRepositoryToken(AttractantCode),
          useFactory: MockAttractantCodeTableRepository,
        },
        {
          provide: getRepositoryToken(ComplaintStatusCode),
          useFactory: MockComplaintStatusCodeTableRepository,
        },
        {
          provide: getRepositoryToken(HwcrComplaintNatureCode),
          useFactory: MockNatureOfComplaintCodeTableRepository,
        },
        {
          provide: getRepositoryToken(GeoOrgUnitTypeCode),
          useFactory: MockOrganizationUnitTypeCodeTableRepository,
        },
        {
          provide: getRepositoryToken(GeoOrganizationUnitCode),
          useFactory: MockOrganizationUnitCodeTableRepository,
        },
      ],
    })      .overrideGuard(JwtAuthGuard)
    .useValue({ authGuardMock })
    .overrideGuard(JwtRoleGuard)
    .useValue({ roleGuardMock })
    .compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get<CodeTableController>(CodeTableController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return 200 when a GET is called successfully", async () => {
    //-- arrange
    const _tableName = "agency";

    //-- act
    let response = await request(app.getHttpServer()).get(
      `/code-table/${_tableName}`
    );
    expect(response.statusCode).toBe(200);
  });

  it("should return 404 when a requesting code table that doesn't exist", async () => {
    //-- arrange
    const _tableName = "test";

    //-- act
    let response = await request(app.getHttpServer()).get(
      `/code-table/${_tableName}`
    );
    expect(response.statusCode).toBe(404);
  });
});
