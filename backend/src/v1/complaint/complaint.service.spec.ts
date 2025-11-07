import { Test, TestingModule } from "@nestjs/testing";
import { REQUEST } from "@nestjs/core";
import { AutomapperModule, getMapperToken } from "@automapper/nestjs";
import { Mapper, createMapper } from "@automapper/core";
import { pojos } from "@automapper/pojos";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { createSharedDataMocks } from "../../../test/mocks/external_api/mock-shared-data";
jest.mock("../../external_api/shared_data", () => createSharedDataMocks());

import { ComplaintService } from "./complaint.service";
import { AppUserComplaintXrefService } from "../app_user_complaint_xref/app_user_complaint_xref.service";
import { AttractantHwcrXrefService } from "../attractant_hwcr_xref/attractant_hwcr_xref.service";
import { EventPublisherService } from "../event_publisher/event_publisher.service";

import { AppUserComplaintXrefCode } from "../app_user_complaint_xref_code/entities/app_user_complaint_xref_code.entity";
import { Complaint } from "./entities/complaint.entity";
import { CodeTableService } from "../code-table/code-table.service";
import { AllegationComplaint } from "../allegation_complaint/entities/allegation_complaint.entity";
import { ComplaintUpdate } from "../complaint_updates/entities/complaint_updates.entity";
import { AttractantCode } from "../attractant_code/entities/attractant_code.entity";
import { ComplaintStatusCode } from "../complaint_status_code/entities/complaint_status_code.entity";
import { ComplaintTypeCode } from "../complaint_type_code/entities/complaint_type_code.entity";
import { HwcrComplaint } from "../hwcr_complaint/entities/hwcr_complaint.entity";
import { HwcrComplaintNatureCode } from "../hwcr_complaint_nature_code/entities/hwcr_complaint_nature_code.entity";
import { SpeciesCode } from "../species_code/entities/species_code.entity";
import { ReportedByCode } from "../reported_by_code/entities/reported_by_code.entity";
import { AttractantHwcrXref } from "../attractant_hwcr_xref/entities/attractant_hwcr_xref.entity";
import { AppUserComplaintXref } from "../app_user_complaint_xref/entities/app_user_complaint_xref.entity";

import { COMPLAINT_TYPE } from "../../types/models/complaints/complaint-type";

import { MockAllegationComplaintRepository } from "../../../test/mocks/mock-allegation-complaint-repository";
import { MockGeneralIncidentComplaintRepository } from "../../../test/mocks/mock-general-incident-complaint-repository";
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
  MockGirTypeCodeRepository,
  MockTeamCodeRepository,
  MockCompMthdRecvCdAgcyCdXrefRepository,
} from "../../../test/mocks/mock-code-table-repositories";
import {
  MockComplaintReferralEmailLogRepository,
  MockComplaintsAgencyRepository,
  MockComplaintsRepositoryV2,
  MockComplaintUpdatesRepository,
  MockUpdateComplaintsRepository,
} from "../../../test/mocks/mock-complaints-repositories";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import {
  ComplaintSearchParameters,
  ComplaintMapSearchClusteredParameters,
} from "../../types/models/complaints/complaint-search-parameters";
import { GirTypeCode } from "../gir_type_code/entities/gir_type_code.entity";
import { GirComplaint } from "../gir_complaint/entities/gir_complaint.entity";
import { ComplaintUpdatesService } from "../complaint_updates/complaint_updates.service";
import { ActionTaken } from "./entities/action_taken.entity";
import { StagingComplaint } from "../staging_complaint/entities/staging_complaint.entity";
import { CompMthdRecvCdAgcyCdXrefService } from "../comp_mthd_recv_cd_agcy_cd_xref/comp_mthd_recv_cd_agcy_cd_xref.service";
import { CompMthdRecvCdAgcyCdXref } from "../comp_mthd_recv_cd_agcy_cd_xref/entities/comp_mthd_recv_cd_agcy_cd_xref";
import { AppUserService } from "../app_user/app_user.service";
import { CssService } from "../../external_api/css/css.service";
import { ConfigurationService } from "../configuration/configuration.service";
import { Configuration } from "../configuration/entities/configuration.entity";
import { LinkedComplaintXrefService } from "../linked_complaint_xref/linked_complaint_xref.service";
import { LinkedComplaintXref } from "../linked_complaint_xref/entities/linked_complaint_xref.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { ViolationAgencyXref } from "../violation_agency_xref/entities/violation_agency_entity_xref";
import { ComplaintReferral } from "../complaint_referral/entities/complaint_referral.entity";
import { EmailReference } from "../email_reference/entities/email_reference.entity";
import { ComplaintReferralEmailLogService } from "../complaint_referral_email_log/complaint_referral_email_log.service";
import { ComplaintReferralEmailLog } from "../complaint_referral_email_log/entities/complaint_referral_email_log.entity";

describe("Testing: Complaint Service", () => {
  let service: ComplaintService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule, CacheModule.register()],
      providers: [
        AutomapperModule,
        {
          provide: getMapperToken(),
          useValue: createMapper({
            strategyInitializer: pojos(),
          }),
        },
        {
          provide: getRepositoryToken(StagingComplaint),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ActionTaken),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Configuration),
          useValue: {},
        },
        {
          provide: getRepositoryToken(LinkedComplaintXref),
          useValue: {},
        },
        {
          provide: getRepositoryToken(EmailReference),
          useValue: {},
        },
        ComplaintUpdatesService,
        ComplaintService,
        {
          provide: AppUserComplaintXrefService,
          useValue: {},
        },
        AppUserService,
        LinkedComplaintXrefService,
        CssService,
        ConfigurationService,
        AttractantHwcrXrefService,
        CodeTableService,
        CompMthdRecvCdAgcyCdXrefService,
        {
          provide: EventPublisherService,
          useValue: {},
        },
        {
          provide: EventPublisherService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Complaint),
          useFactory: MockComplaintsRepositoryV2,
        },
        {
          provide: getRepositoryToken(AllegationComplaint),
          useFactory: MockAllegationComplaintRepository,
        },
        {
          provide: getRepositoryToken(GirComplaint),
          useFactory: MockGeneralIncidentComplaintRepository,
        },
        {
          provide: getRepositoryToken(ComplaintUpdate),
          useValue: {},
        },
        {
          provide: getRepositoryToken(HwcrComplaint),
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
          provide: getRepositoryToken(AppUserComplaintXrefCode),
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
          provide: getRepositoryToken(AppUserComplaintXref),
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
          provide: getRepositoryToken(CompMthdRecvCdAgcyCdXref),
          useFactory: MockCompMthdRecvCdAgcyCdXrefRepository,
        },
        {
          provide: getRepositoryToken(ComplaintReferral),
          useValue: {},
        },
        ComplaintReferralEmailLogService,
        {
          provide: getRepositoryToken(ComplaintReferralEmailLog),
          useValue: MockComplaintReferralEmailLogRepository,
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
      showReferrals: true,
    };

    //-- act
    const results = await service.search(_complaintType, payload, ["COS"]);

    //-- assert
    expect(results).not.toBe(null);

    const { totalCount, complaints } = results;

    expect(complaints.length).toBe(5);
    expect(totalCount).toBe(35);
  });

  it("should return list of complaints by mapSearch for non ceeb role users", async () => {
    //-- arrange
    const _complaintType: COMPLAINT_TYPE = "HWCR";
    const payload: ComplaintMapSearchClusteredParameters = {
      zone: "CRBOTMPSN",
      status: "OPEN",
      query: "bear",
      zoom: 17,
      clusters: true,
      unmapped: true,
      bbox: undefined,
      page: undefined,
      pageSize: undefined,
      sortBy: undefined,
      orderBy: undefined,
      showReferrals: true,
    };

    //-- act
    const results = await service.mapSearchClustered(_complaintType, payload, ["COS"]);

    //-- assert
    expect(results).not.toBe(null);

    const { mappedCount, unmappedCount } = results;

    expect(mappedCount).toBe(5);
    expect(unmappedCount).toBe(55);
  });

  it("should return list of complaints by mapSearch for user with ceeb role", async () => {
    //-- arrange
    const _complaintType: COMPLAINT_TYPE = "HWCR";
    const payload: ComplaintMapSearchClusteredParameters = {
      zone: "CRBOTMPSN",
      status: "OPEN",
      query: "bear",
      zoom: 17,
      clusters: true,
      unmapped: true,
      bbox: undefined,
      page: undefined,
      pageSize: undefined,
      sortBy: undefined,
      orderBy: undefined,
      showReferrals: true,
    };

    //-- act
    const results = await service.mapSearchClustered(_complaintType, payload, ["CEEB"]);

    //-- assert
    expect(results).not.toBe(null);

    const { mappedCount, unmappedCount } = results;

    expect(mappedCount).toBe(5);
    expect(unmappedCount).toBe(55);
  });
});

describe("Testing: Complaint Service", () => {
  let service: ComplaintService;
  let mapper: Mapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule, CacheModule.register()],
      providers: [
        AutomapperModule,
        {
          provide: getMapperToken(),
          useValue: createMapper({
            strategyInitializer: pojos(),
          }),
        },
        {
          provide: getRepositoryToken(StagingComplaint),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ActionTaken),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Configuration),
          useValue: {},
        },
        {
          provide: getRepositoryToken(LinkedComplaintXref),
          useValue: {},
        },
        ComplaintUpdatesService,
        ComplaintService,
        {
          provide: EventPublisherService,
          useValue: {
            publishComplaintStatusChangeEvents: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: AppUserComplaintXrefService,
          useValue: {},
        },
        AppUserService,
        LinkedComplaintXrefService,
        CssService,
        ConfigurationService,
        AttractantHwcrXrefService,
        CodeTableService,
        CompMthdRecvCdAgcyCdXrefService,
        {
          provide: getRepositoryToken(Complaint),
          useFactory: MockUpdateComplaintsRepository,
        },
        {
          provide: getRepositoryToken(AllegationComplaint),
          useFactory: MockAllegationComplaintRepository,
        },
        {
          provide: getRepositoryToken(GirComplaint),
          useFactory: MockGeneralIncidentComplaintRepository,
        },
        {
          provide: getRepositoryToken(ComplaintUpdate),
          useValue: {},
        },
        {
          provide: getRepositoryToken(HwcrComplaint),
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
          provide: getRepositoryToken(AppUserComplaintXrefCode),
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
          provide: getRepositoryToken(ComplaintTypeCode),
          useFactory: MockComplaintTypeCodeTableRepository,
        },
        {
          provide: getRepositoryToken(GirTypeCode),
          useFactory: MockGirTypeCodeRepository,
        },
        {
          provide: getRepositoryToken(ReportedByCode),
          useFactory: MockReportedByCodeTableRepository,
        },
        {
          provide: getRepositoryToken(AppUserComplaintXref),
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
          provide: getRepositoryToken(EmailReference),
          useValue: {},
        },
        {
          provide: getRepositoryToken(CompMthdRecvCdAgcyCdXref),
          useFactory: MockCompMthdRecvCdAgcyCdXrefRepository,
        },
        {
          provide: REQUEST,
          useValue: {
            user: { idir_username: "TEST" },
          },
        },
        {
          provide: getRepositoryToken(ComplaintReferral),
          useValue: {},
        },
        ComplaintReferralEmailLogService,
        {
          provide: getRepositoryToken(ComplaintReferralEmailLog),
          useValue: MockComplaintReferralEmailLogRepository,
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
    const _token = "test-token";

    //-- act
    const result = await service.updateComplaintStatusById(_id, _status, _token);

    //-- assert
    expect(result).not.toBe(null);
    if (result) {
      const { id } = result;

      expect(id).toBe(_id);
    }
  });
});
