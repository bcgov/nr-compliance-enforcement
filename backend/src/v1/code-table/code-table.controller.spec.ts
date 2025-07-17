import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { INestApplication } from "@nestjs/common";
import request from "supertest";

import { authGuardMock } from "../../../test/mocks/authGuardMock";
import { roleGuardMock } from "../../../test/mocks/roleGuardMock";
import { JwtAuthGuard } from "../../auth/jwtauth.guard";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";

import { CodeTableController } from "./code-table.controller";
import { CodeTableService } from "./code-table.service";
import {
  MockAttractantCodeTableRepository,
  MockCommunityCodeTableServiceRepository,
  MockComplaintStatusCodeTableRepository,
  MockComplaintTypeCodeTableRepository,
  MockNatureOfComplaintCodeTableRepository,
  MockOrganizationUnitCodeTableRepository,
  MockOrganizationUnitTypeCodeTableRepository,
  MockPersonComplaintCodeTableRepository,
  MockReportedByCodeTableRepository,
  MockSpeciesCodeTableRepository,
  MockViolationsCodeTableRepository,
  MockGirTypeCodeRepository,
  MockTeamCodeRepository,
  MockCompMthdRecvCdAgcyCdXrefRepository,
} from "../../../test/mocks/mock-code-table-repositories";
import { AttractantCode } from "../attractant_code/entities/attractant_code.entity";
import { ComplaintStatusCode } from "../complaint_status_code/entities/complaint_status_code.entity";
import { HwcrComplaintNatureCode } from "../hwcr_complaint_nature_code/entities/hwcr_complaint_nature_code.entity";
import { GeoOrgUnitTypeCode } from "../geo_org_unit_type_code/entities/geo_org_unit_type_code.entity";
import { GeoOrganizationUnitCode } from "../geo_organization_unit_code/entities/geo_organization_unit_code.entity";
import { PersonComplaintXrefCode } from "../person_complaint_xref_code/entities/person_complaint_xref_code.entity";
import { SpeciesCode } from "../species_code/entities/species_code.entity";
import { CosGeoOrgUnit } from "../cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { ComplaintTypeCode } from "../complaint_type_code/entities/complaint_type_code.entity";
import { ReportedByCode } from "../reported_by_code/entities/reported_by_code.entity";
import { GirTypeCode } from "../gir_type_code/entities/gir_type_code.entity";
import { TeamCode } from "../team_code/entities/team_code.entity";
import { CompMthdRecvCdAgcyCdXref } from "../comp_mthd_recv_cd_agcy_cd_xref/entities/comp_mthd_recv_cd_agcy_cd_xref";
import { ViolationAgencyXref } from "../violation_agency_xref/entities/violation_agency_entity_xref";
import { EmailReference } from "../email_reference/entities/email_reference.entity";

describe("Testing: CodeTable Controller", () => {
  let app: INestApplication;
  let controller: CodeTableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodeTableController],
      providers: [
        CodeTableService,
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
        {
          provide: getRepositoryToken(PersonComplaintXrefCode),
          useFactory: MockPersonComplaintCodeTableRepository,
        },
        {
          provide: getRepositoryToken(SpeciesCode),
          useFactory: MockSpeciesCodeTableRepository,
        },
        {
          provide: getRepositoryToken(ViolationAgencyXref),
          useFactory: MockViolationsCodeTableRepository,
        },
        {
          provide: getRepositoryToken(CosGeoOrgUnit),
          useFactory: MockCommunityCodeTableServiceRepository,
        },
        {
          provide: getRepositoryToken(ComplaintTypeCode),
          useFactory: MockComplaintTypeCodeTableRepository,
        },
        {
          provide: getRepositoryToken(ReportedByCode),
          useFactory: MockReportedByCodeTableRepository,
        },
        {
          provide: getRepositoryToken(GirTypeCode),
          useFactory: MockGirTypeCodeRepository,
        },
        {
          provide: getRepositoryToken(TeamCode),
          useFactory: MockTeamCodeRepository,
        },
        {
          provide: getRepositoryToken(CompMthdRecvCdAgcyCdXref),
          useFactory: MockCompMthdRecvCdAgcyCdXrefRepository,
        },
        {
          provide: getRepositoryToken(EmailReference),
          useValue: {},
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

    controller = module.get<CodeTableController>(CodeTableController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return 200 when a GET is called successfully", async () => {
    //-- arrange
    const _tableName = "agency";
    const _agency = "cos";

    //-- act
    let response = await request(app.getHttpServer()).get(`/code-table/${_tableName}`);
    expect(response.statusCode).toBe(200);

    response = await request(app.getHttpServer()).get(`/code-table/organization-by-agency/${_agency}`);
    expect(response.statusCode).toBe(200);

    response = await request(app.getHttpServer()).get(`/code-table/regions-by-agency/${_agency}`);
    expect(response.statusCode).toBe(200);

    response = await request(app.getHttpServer()).get(`/code-table/zones-by-agency/${_agency}`);
    expect(response.statusCode).toBe(200);

    response = await request(app.getHttpServer()).get(`/code-table/communities-by-agency/${_agency}`);
    expect(response.statusCode).toBe(200);
  });

  it("should return 404 when a requesting code table that doesn't exist", async () => {
    //-- arrange
    const _tableName = "test";

    //-- act
    let response = await request(app.getHttpServer()).get(`/code-table/${_tableName}`);
    expect(response.statusCode).toBe(404);
  });

  it("should return 404 when a requesting organization by an agency doesn't exist", async () => {
    //-- arrange
    const _agency = "test";

    //-- act
    let response = await request(app.getHttpServer()).get(`/code-table/organization-by-agency/${_agency}`);
    expect(response.statusCode).toBe(404);

    response = await request(app.getHttpServer()).get(`/code-table/regions-by-agency/${_agency}`);
    expect(response.statusCode).toBe(404);

    response = await request(app.getHttpServer()).get(`/code-table/zones-by-agency/${_agency}`);
    expect(response.statusCode).toBe(404);

    response = await request(app.getHttpServer()).get(`/code-table/communities-by-agency/${_agency}`);
    expect(response.statusCode).toBe(404);
  });
});
