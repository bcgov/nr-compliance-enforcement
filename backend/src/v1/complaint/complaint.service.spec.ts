import { Test, TestingModule } from "@nestjs/testing";
import { REQUEST } from "@nestjs/core";
import { AutomapperModule, getMapperToken } from "@automapper/nestjs";
import { Mapper, createMapper } from "@automapper/core";
import { pojos } from "@automapper/pojos";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { ComplaintService } from "./complaint.service";
import { PersonComplaintXrefService } from "../person_complaint_xref/person_complaint_xref.service";
import { AttractantHwcrXrefService } from "../attractant_hwcr_xref/attractant_hwcr_xref.service";

import { PersonComplaintXrefCode } from "../person_complaint_xref_code/entities/person_complaint_xref_code.entity";
import { Complaint } from "./entities/complaint.entity";
import { CodeTableService } from "../code-table/code-table.service";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { AllegationComplaint } from "../allegation_complaint/entities/allegation_complaint.entity";
import { AttractantCode } from "../attractant_code/entities/attractant_code.entity";
import { ComplaintStatusCode } from "../complaint_status_code/entities/complaint_status_code.entity";
import { ComplaintTypeCode } from "../complaint_type_code/entities/complaint_type_code.entity";
import { CosGeoOrgUnit } from "../cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { GeoOrgUnitTypeCode } from "../geo_org_unit_type_code/entities/geo_org_unit_type_code.entity";
import { GeoOrganizationUnitCode } from "../geo_organization_unit_code/entities/geo_organization_unit_code.entity";
import { HwcrComplaint } from "../hwcr_complaint/entities/hwcr_complaint.entity";
import { HwcrComplaintNatureCode } from "../hwcr_complaint_nature_code/entities/hwcr_complaint_nature_code.entity";
import { Office } from "../office/entities/office.entity";
import { Officer } from "../officer/entities/officer.entity";
import { SpeciesCode } from "../species_code/entities/species_code.entity";
import { ViolationCode } from "../violation_code/entities/violation_code.entity";
import { ReportedByCode } from "../reported_by_code/entities/reported_by_code.entity";
import { PersonComplaintXref } from "../person_complaint_xref/entities/person_complaint_xref.entity";
import { AttractantHwcrXref } from "../attractant_hwcr_xref/entities/attractant_hwcr_xref.entity";

import { COMPLAINT_TYPE } from "../../types/models/complaints/complaint-type";

import { MockAllegationComplaintRepository } from "../../../test/mocks/mock-allegation-complaint-repository";
import { MockWildlifeConflictComplaintRepository } from "../../../test/mocks/mock-wildlife-conflict-complaint-repository";
import {
  MockAttractantCodeTableRepository,
  MockComplaintStatusCodeTableRepository,
  MockComplaintTypeCodeTableRepository,
  MockCosOrganizationUnitCodeTableRepository,
  MockNatureOfComplaintCodeTableRepository,
  MockOrganizationUnitCodeTableRepository,
  MockOrganizationUnitTypeCodeTableRepository,
  MockPersonComplaintCodeTableRepository,
  MockReportedByCodeTableRepository,
  MockSpeciesCodeTableRepository,
  MockViolationsCodeTableRepository,
} from "../../../test/mocks/mock-code-table-repositories";
import {
  MockComplaintsAgencyRepository,
  MockComplaintsOfficerRepository,
  MockComplaintsRepositoryV2,
  MockComplaintUpdatesRepository,
  MockUpdateComplaintsRepository,
} from "../../../test/mocks/mock-complaints-repositories";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { ComplaintSearchParameters } from "../../types/models/complaints/complaint-search-parameters";
import { ComplaintUpdate } from "../complaint_updates/entities/complaint_updates.entity";

describe("Testing: Complaint Service", () => {
  let service: ComplaintService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule],
      providers: [
        AutomapperModule,
        {
          provide: getMapperToken(),
          useValue: createMapper({
            strategyInitializer: pojos(),
          }),
        },
        ComplaintService,
        PersonComplaintXrefService,
        AttractantHwcrXrefService,
        CodeTableService,
        {
          provide: getRepositoryToken(Complaint),
          useFactory: MockComplaintsRepositoryV2,
        },
        {
          provide: getRepositoryToken(AllegationComplaint),
          useFactory: MockAllegationComplaintRepository,
        },
        {
          provide: getRepositoryToken(HwcrComplaint),
          useFactory: MockWildlifeConflictComplaintRepository,
        },
        {
          provide: getRepositoryToken(AgencyCode),
          useFactory: MockComplaintsAgencyRepository,
        },
        {
          provide: getRepositoryToken(Officer),
          useFactory: MockComplaintsOfficerRepository,
        },
        {
          provide: getRepositoryToken(Office),
          useFactory: MockWildlifeConflictComplaintRepository,
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
          provide: getRepositoryToken(ViolationCode),
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
          provide: getRepositoryToken(PersonComplaintXref),
          useValue: {},
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
        {
          provide: getRepositoryToken(AttractantHwcrXref),
          useValue: {},
        },
        {
          provide: REQUEST,
          useValue: {
            user: { idir_username: "TEST" },
          },
        },
        {
          provide: getRepositoryToken(ComplaintUpdate),
          useValue: MockComplaintUpdatesRepository,
        },
        {
          provide: getRepositoryToken(ComplaintUpdate),
          useValue: MockComplaintUpdatesRepository,
        },
      ],
    }).compile();

    service = await module.resolve<ComplaintService>(ComplaintService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();

    const unused = null;
  });

  it("should return list of complaints by type: HWCR", async () => {
    //-- arrange
    const _complaintType: COMPLAINT_TYPE = "HWCR";

    //-- act
    const result = await service.findAllByType(_complaintType);

    //-- assert
    expect(result).not.toBe(null);
    expect(result.length).toBe(5);
  });

  it("should return list of complaints by type: ERS", async () => {
    //-- arrange
    const _complaintType: COMPLAINT_TYPE = "ERS";

    //-- act
    const result = await service.findAllByType(_complaintType);

    //-- assert
    expect(result).not.toBe(null);
    expect(result.length).toBe(5);
  });

  it("should return complaint by id: ", async () => {
    //-- arrange
    const _id = "24-46247";
    const _complaintType: COMPLAINT_TYPE = "HWCR";

    //-- act
    const result = await service.findById(_id, _complaintType);

    //-- assert
    expect(result).not.toBe(null);

    const { id, reportedBy } = result;
    expect(id).toBe(_id);
    expect(reportedBy).toBe("911");
  });

  it("should return list of complaints by search:", async () => {
    //-- arrange
    const _complaintType: COMPLAINT_TYPE = "HWCR";
    const payload: ComplaintSearchParameters = {
      sortBy: "incident_reported_utc_timestmp",
      orderBy: "DESC",
      zone: "CRBOTMPSN",
      status: "OPEN",
      page: 1,
      pageSize: 50,
      query: "bear",
    };

    //-- act
    const results = await service.search(_complaintType, payload);

    //-- assert
    expect(results).not.toBe(null);

    const { totalCount, complaints } = results;

    expect(complaints.length).toBe(5);
    expect(totalCount).toBe(35);
  });

  it("should return list of complaints by mapSearch", async () => {
    //-- arrange
    const _complaintType: COMPLAINT_TYPE = "HWCR";
    const payload: ComplaintSearchParameters = {
      sortBy: "incident_reported_utc_timestmp",
      orderBy: "DESC",
      zone: "CRBOTMPSN",
      status: "OPEN",
      page: 1,
      pageSize: 50,
      query: "bear",
    };

    //-- act
    const results = await service.mapSearch(_complaintType, payload);

    //-- assert
    expect(results).not.toBe(null);

    const { unmappedComplaints, complaints } = results;

    expect(complaints.length).toBe(5);
    expect(unmappedComplaints).toBe(55);
  });

  // it("should return zone at a glance stats by complaint type: HWCR", async () => {
  //   //-- arrange

  //   //-- act

  //   //-- assert
  //   fail();
  // });

  // it("should return zone at a glance stats by complaint type: ERS", async () => {
  //   //-- arrange

  //   //-- act

  //   //-- assert
  //   fail();
  // });
});

describe("Testing: Complaint Service", () => {
  let service: ComplaintService;
  let mapper: Mapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule],
      providers: [
        AutomapperModule,
        {
          provide: getMapperToken(),
          useValue: createMapper({
            strategyInitializer: pojos(),
          }),
        },
        ComplaintService,
        PersonComplaintXrefService,
        AttractantHwcrXrefService,
        CodeTableService,
        {
          provide: getRepositoryToken(Complaint),
          useFactory: MockUpdateComplaintsRepository,
        },
        {
          provide: getRepositoryToken(AllegationComplaint),
          useFactory: MockAllegationComplaintRepository,
        },
        {
          provide: getRepositoryToken(HwcrComplaint),
          useFactory: MockWildlifeConflictComplaintRepository,
        },
        {
          provide: getRepositoryToken(AgencyCode),
          useFactory: MockComplaintsAgencyRepository,
        },
        {
          provide: getRepositoryToken(Officer),
          useFactory: MockComplaintsOfficerRepository,
        },
        {
          provide: getRepositoryToken(Office),
          useFactory: MockWildlifeConflictComplaintRepository,
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
          provide: getRepositoryToken(ViolationCode),
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
          provide: getRepositoryToken(PersonComplaintXref),
          useValue: {},
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
        {
          provide: getRepositoryToken(AttractantHwcrXref),
          useValue: {},
        },
        {
          provide: REQUEST,
          useValue: {
            user: { idir_username: "TEST" },
          },
        },
      ],
    }).compile();

    service = await module.resolve<ComplaintService>(ComplaintService);
    mapper = module.get<Mapper>(getMapperToken());
  });

  it("should update complaint status by id:", async () => {
    //-- arrange
    const _id = "23-031396";
    const _status = "CLOSED";

    //-- act
    const result = await service.updateComplaintStatusById(_id, _status);

    //-- assert
    expect(result).not.toBe(null);
    if (result) {
      const { id } = result;

      expect(id).toBe(_id);
    }
  });
});
