import { Test, TestingModule } from "@nestjs/testing";
import { CodeTableService } from "./code-table.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { AttractantCode } from "../attractant_code/entities/attractant_code.entity";
import { ComplaintStatusCode } from "../complaint_status_code/entities/complaint_status_code.entity";

import {
  MockAgencyCodeTableRepository,
  MockAttractantCodeTableRepository,
  MockComplaintStatusCodeTableRepository,
  MockNatureOfComplaintCodeTableRepository,
  MockOrganizationUnitCodeTableRepository,
  MockOrganizationUnitTypeCodeTableRepository,
  MockPersonComplaintCodeTableRepository,
  MockSpeciesCodeTableRepository,
  MockViolationsCodeTableRepository,
  MockCosOrganizationUnitCodeTableRepository,
  MockComplaintTypeCodeTableRepository,
  MockCommunityCodeTableServiceRepository,
  MockZoneCodeTableServiceRepository,
  MockRegionCodeTableServiceRepository,
  MockReportedByCodeTableRepository,
  MockGirTypeCodeRepository,
  MockTeamCodeRepository,
  MockCompMthdRecvCdAgcyCdXrefRepository,
} from "../../../test/mocks/mock-code-table-repositories";
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

describe("Testing: CodeTable Service", () => {
  let service: CodeTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
          useFactory: MockCosOrganizationUnitCodeTableRepository,
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
    }).compile();

    service = module.get<CodeTableService>(CodeTableService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return collection of agency codes", async () => {
    //-- arrange
    const _tableName = "agency";

    //-- act
    const results = await service.getCodeTableByName(_tableName);

    //-- assert
    expect(results).not.toBe(null);
    expect(results.length).not.toBe(0);
    expect(results.length).toBe(3);
  });

  it("should return collection of reported by codes", async () => {
    //-- arrange
    const _tableName = "reported-by";

    //-- act
    const results = await service.getCodeTableByName(_tableName);

    //-- assert
    expect(results).not.toBe(null);
    expect(results.length).not.toBe(0);
    expect(results.length).toBe(12);
  });

  it("should return collection of attractants", async () => {
    //-- arrange
    const _tableName = "attractant";

    //-- act
    const results = await service.getCodeTableByName(_tableName);

    //-- assert
    expect(results).not.toBe(null);
    expect(results.length).not.toBe(0);
    expect(results.length).toBe(8);
  });

  it("should return collection of complaint status types", async () => {
    //-- arrange
    const _tableName = "complaint-status";

    //-- act
    const results = await service.getCodeTableByName(_tableName);

    //-- assert
    expect(results).not.toBe(null);
    expect(results.length).not.toBe(0);
    expect(results.length).toBe(2);
  });

  it("should return collection of nature of complaints", async () => {
    //-- arrange
    const _tableName = "nature-of-complaint";

    //-- act
    const results = await service.getCodeTableByName(_tableName);

    //-- assert
    expect(results).not.toBe(null);
    expect(results.length).not.toBe(0);
    expect(results.length).toBe(5);
  });

  it("should return collection of organization unit types", async () => {
    //-- arrange
    const _tableName = "organization-unit-type";

    //-- act
    const results = await service.getCodeTableByName(_tableName);

    //-- assert
    expect(results).not.toBe(null);
    expect(results.length).not.toBe(0);
    expect(results.length).toBe(4);
  });

  it("should return collection of organization types", async () => {
    //-- arrange
    const _tableName = "organization-unit";

    //-- act
    const results = await service.getCodeTableByName(_tableName);

    //-- assert
    expect(results).not.toBe(null);
    expect(results.length).not.toBe(0);
    expect(results.length).toBe(5);
  });

  it("should return collection of person complaint types", async () => {
    //-- arrange
    const _tableName = "person-complaint";

    //-- act
    const results = await service.getCodeTableByName(_tableName);

    //-- assert
    expect(results).not.toBe(null);
    expect(results.length).not.toBe(0);
    expect(results.length).toBe(2);
  });

  it("should return collection of species", async () => {
    //-- arrange
    const _tableName = "species";

    //-- act
    const results = await service.getCodeTableByName(_tableName);

    //-- assert
    expect(results).not.toBe(null);
    expect(results.length).not.toBe(0);
    expect(results.length).toBe(6);
  });

  it("should return collection of violations", async () => {
    //-- arrange
    const _tableName = "violation";

    //-- act
    const results = await service.getCodeTableByName(_tableName);

    //-- assert
    expect(results).not.toBe(null);
    expect(results.length).not.toBe(0);
    expect(results.length).toBe(9);
  });

  it("should return collection of organization by agency", async () => {
    //-- arrange
    const _agency = "cos";

    //-- act
    const results = await service.getOrganizationsByAgency(_agency);

    //-- assert
    expect(results).not.toBe(null);
    expect(results.length).not.toBe(0);
    expect(results.length).toBe(14);
  });

  it("should return collection of complaint types", async () => {
    //-- arrange
    const _tableName = "complaint-type";

    //-- act
    const results = await service.getCodeTableByName(_tableName);

    //-- assert
    expect(results).not.toBe(null);
    expect(results.length).not.toBe(0);
    expect(results.length).toBe(2);
  });
});

describe("Testing: CodeTable service", () => {
  let service: CodeTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
          useFactory: MockRegionCodeTableServiceRepository,
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
    }).compile();

    service = module.get<CodeTableService>(CodeTableService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return collection of regions", async () => {
    //-- arrange
    const _agency = "cos";

    //-- act
    const results = await service.getRegionsByAgency(_agency);

    //-- assert
    expect(results).not.toBe(null);
    expect(results.length).not.toBe(0);
    expect(results.length).toBe(8);
  });
});

describe("Testing: CodeTable service", () => {
  let service: CodeTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
          useFactory: MockZoneCodeTableServiceRepository,
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
    }).compile();

    service = module.get<CodeTableService>(CodeTableService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return collection of zones", async () => {
    //-- arrange
    const _agency = "cos";

    //-- act
    const results = await service.getZonesByAgency(_agency);

    //-- assert
    expect(results).not.toBe(null);
    expect(results.length).not.toBe(0);
    expect(results.length).toBe(9);
  });
});

describe("Testing: CodeTable service", () => {
  let service: CodeTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    }).compile();

    service = module.get<CodeTableService>(CodeTableService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return collection of communities", async () => {
    //-- arrange
    const _agency = "cos";

    //-- act
    const results = await service.getCommunitiesByAgency(_agency);

    //-- assert
    expect(results).not.toBe(null);
    expect(results.length).not.toBe(0);
    expect(results.length).toBe(11);
  });

  it("should return complaint-status-code by status", async () => {
    //-- arrange
    const _status = "open";

    //-- act
    const result = await service.getComplaintStatusCodeByStatus(_status);

    //-- assert
    expect(result).not.toBe(null);

    const { complaint_status_code, short_description, long_description } = result;
    expect(complaint_status_code).toBe("OPEN");
    expect(short_description).toBe("OPEN");
    expect(long_description).toBe("Open");
  });
});
