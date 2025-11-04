import { Test, TestingModule } from "@nestjs/testing";
import { DocumentService } from "./document.service";
import { ComplaintService } from "../complaint/complaint.service";
import { EventPublisherService } from "../event_publisher/event_publisher.service";
import { AutomapperModule, getMapperToken } from "@automapper/nestjs";
import { createMapper } from "@automapper/core";
import { pojos } from "@automapper/pojos";
import { REQUEST } from "@nestjs/core";
import { getRepositoryToken } from "@nestjs/typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";

jest.mock("../../external_api/shared_data", () => {
  const { createSharedDataMocks } = require("../../../test/mocks/external_api/mock-shared-data");
  return createSharedDataMocks();
});

import { resetSharedDataMocks } from "../../../test/mocks/external_api/mock-shared-data";
import { MockAllegationComplaintRepository } from "../../../test/mocks/mock-allegation-complaint-repository";
import { MockGeneralIncidentComplaintRepository } from "../../../test/mocks/mock-general-incident-complaint-repository";
import {
  MockAttractantCodeTableRepository,
  MockComplaintStatusCodeTableRepository,
  MockNatureOfComplaintCodeTableRepository,
  MockPersonComplaintCodeTableRepository,
  MockSpeciesCodeTableRepository,
  MockViolationsCodeTableRepository,
  MockComplaintTypeCodeTableRepository,
  MockReportedByCodeTableRepository,
  MockGirTypeCodeRepository as MockGirTypeCodeTableRepository,
  MockCompMthdRecvCdAgcyCdXrefRepository,
} from "../../../test/mocks/mock-code-table-repositories";
import {
  MockComplaintsRepositoryV2,
  MockComplaintsAgencyRepository,
  MockComplaintReferralEmailLogRepository,
} from "../../../test/mocks/mock-complaints-repositories";
import { MockWildlifeConflictComplaintRepository } from "../../../test/mocks/mock-wildlife-conflict-complaint-repository";
import { DataSource } from "typeorm";
import { AllegationComplaint } from "../allegation_complaint/entities/allegation_complaint.entity";
import { ComplaintUpdate } from "../complaint_updates/entities/complaint_updates.entity";
import { AttractantCode } from "../attractant_code/entities/attractant_code.entity";
import { AttractantHwcrXrefService } from "../attractant_hwcr_xref/attractant_hwcr_xref.service";
import { AttractantHwcrXref } from "../attractant_hwcr_xref/entities/attractant_hwcr_xref.entity";
import { CodeTableService } from "../code-table/code-table.service";
import { Complaint } from "../complaint/entities/complaint.entity";
import { ComplaintStatusCode } from "../complaint_status_code/entities/complaint_status_code.entity";
import { ComplaintTypeCode } from "../complaint_type_code/entities/complaint_type_code.entity";
import { HwcrComplaint } from "../hwcr_complaint/entities/hwcr_complaint.entity";
import { GirComplaint } from "../gir_complaint/entities/gir_complaint.entity";
import { HwcrComplaintNatureCode } from "../hwcr_complaint_nature_code/entities/hwcr_complaint_nature_code.entity";
import { AppUserComplaintXref } from "../app_user_complaint_xref/entities/app_user_complaint_xref.entity";
import { AppUserComplaintXrefService } from "../app_user_complaint_xref/app_user_complaint_xref.service";
import { AppUserComplaintXrefCode } from "../app_user_complaint_xref_code/entities/app_user_complaint_xref_code.entity";
import { ReportedByCode } from "../reported_by_code/entities/reported_by_code.entity";
import { SpeciesCode } from "../species_code/entities/species_code.entity";
import { CdogsService } from "../../external_api/cdogs/cdogs.service";
import { ConfigurationService } from "../configuration/configuration.service";
import { Configuration } from "../configuration/entities/configuration.entity";
import { GirTypeCode } from "../gir_type_code/entities/gir_type_code.entity";
import { ComplaintUpdatesService } from "../complaint_updates/complaint_updates.service";
import { ActionTaken } from "../complaint/entities/action_taken.entity";
import { StagingComplaint } from "../staging_complaint/entities/staging_complaint.entity";
import { CompMthdRecvCdAgcyCdXrefService } from "../comp_mthd_recv_cd_agcy_cd_xref/comp_mthd_recv_cd_agcy_cd_xref.service";
import { CompMthdRecvCdAgcyCdXref } from "../comp_mthd_recv_cd_agcy_cd_xref/entities/comp_mthd_recv_cd_agcy_cd_xref";
import { AppUserService } from "../app_user/app_user.service";
import { CssService } from "../../external_api/css/css.service";
import { LinkedComplaintXrefService } from "../linked_complaint_xref/linked_complaint_xref.service";
import { LinkedComplaintXref } from "../linked_complaint_xref/entities/linked_complaint_xref.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { ViolationAgencyXref } from "../violation_agency_xref/entities/violation_agency_entity_xref";
import { ComplaintReferral } from "../complaint_referral/entities/complaint_referral.entity";
import { EmailReference } from "../email_reference/entities/email_reference.entity";
import { ComplaintReferralEmailLogService } from "../complaint_referral_email_log/complaint_referral_email_log.service";
import { ComplaintReferralEmailLog } from "../complaint_referral_email_log/entities/complaint_referral_email_log.entity";

describe("DocumentService", () => {
  let service: DocumentService;

  beforeEach(async () => {
    resetSharedDataMocks();

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
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
        {
          provide: getRepositoryToken(Complaint),
          useFactory: MockComplaintsRepositoryV2,
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
          useFactory: MockGirTypeCodeTableRepository,
        },
        {
          provide: getRepositoryToken(AppUserComplaintXref),
          useValue: {},
        },
        {
          provide: getRepositoryToken(AttractantHwcrXref),
          useValue: {},
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
          provide: getRepositoryToken(StagingComplaint),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ActionTaken),
          useValue: {},
        },
        {
          provide: getRepositoryToken(CompMthdRecvCdAgcyCdXref),
          useFactory: MockCompMthdRecvCdAgcyCdXrefRepository,
        },
        {
          provide: getRepositoryToken(EmailReference),
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
          useValue: {},
        },
        CodeTableService,
        {
          provide: EventPublisherService,
          useValue: {},
        },
        CodeTableService,
        {
          provide: AppUserComplaintXrefService,
          useValue: {},
        },
        AppUserService,
        LinkedComplaintXrefService,
        CssService,
        AttractantHwcrXrefService,
        CompMthdRecvCdAgcyCdXrefService,
        {
          provide: REQUEST,
          useValue: {
            user: { idir_username: "TEST" },
          },
        },
        DocumentService,
        CdogsService,
        ConfigurationService,
        {
          provide: getRepositoryToken(Configuration),
          useValue: {},
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

    service = module.get<DocumentService>(DocumentService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
