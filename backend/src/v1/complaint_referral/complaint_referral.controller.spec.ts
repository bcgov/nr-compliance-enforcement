import { Test, TestingModule } from "@nestjs/testing";
import { ComplaintReferralController } from "./complaint_referral.controller";
import { ComplaintReferralService } from "./complaint_referral.service";
import { ComplaintReferral } from "./entities/complaint_referral.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { Complaint } from "../complaint/entities/complaint.entity";
import { AutomapperModule, getMapperToken } from "@automapper/nestjs";
import { pojos } from "@automapper/pojos";
import { createMapper } from "@automapper/core";
import { CodeTableService } from "../code-table/code-table.service";
import { ComplaintUpdatesService } from "../complaint_updates/complaint_updates.service";
import { AttractantHwcrXrefService } from "../attractant_hwcr_xref/attractant_hwcr_xref.service";
import { CompMthdRecvCdAgcyCdXrefService } from "../comp_mthd_recv_cd_agcy_cd_xref/comp_mthd_recv_cd_agcy_cd_xref.service";
import { AppUserService } from "../app_user/app_user.service";
import { LinkedComplaintXrefService } from "../linked_complaint_xref/linked_complaint_xref.service";

jest.mock("../../external_api/shared_data", () => {
  const { createSharedDataMocks } = require("../../../test/mocks/external_api/mock-shared-data");
  return createSharedDataMocks();
});

import { resetSharedDataMocks } from "../../../test/mocks/external_api/mock-shared-data";
import { ComplaintUpdate } from "../complaint_updates/entities/complaint_updates.entity";
import { StagingComplaint } from "../staging_complaint/entities/staging_complaint.entity";
import { ActionTaken } from "../complaint/entities/action_taken.entity";
import { AttractantCode } from "../attractant_code/entities/attractant_code.entity";
import { ComplaintStatusCode } from "../complaint_status_code/entities/complaint_status_code.entity";
import { Configuration } from "../configuration/entities/configuration.entity";
import { LinkedComplaintXref } from "../linked_complaint_xref/entities/linked_complaint_xref.entity";
import { AllegationComplaint } from "../allegation_complaint/entities/allegation_complaint.entity";
import { GirComplaint } from "../gir_complaint/entities/gir_complaint.entity";
import { HwcrComplaint } from "../hwcr_complaint/entities/hwcr_complaint.entity";
import { HwcrComplaintNatureCode } from "../hwcr_complaint_nature_code/entities/hwcr_complaint_nature_code.entity";
import { AppUserComplaintXrefCode } from "../app_user_complaint_xref_code/entities/app_user_complaint_xref_code.entity";
import { SpeciesCode } from "../species_code/entities/species_code.entity";
import { ViolationAgencyXref } from "../violation_agency_xref/entities/violation_agency_entity_xref";
import { ComplaintTypeCode } from "../complaint_type_code/entities/complaint_type_code.entity";
import { GirTypeCode } from "../gir_type_code/entities/gir_type_code.entity";
import { ReportedByCode } from "../reported_by_code/entities/reported_by_code.entity";
import { CompMthdRecvCdAgcyCdXref } from "../comp_mthd_recv_cd_agcy_cd_xref/entities/comp_mthd_recv_cd_agcy_cd_xref";
import { AttractantHwcrXref } from "../attractant_hwcr_xref/entities/attractant_hwcr_xref.entity";
import { ConfigurationService } from "../configuration/configuration.service";
import { CssService } from "../../external_api/css/css.service";
import { CacheModule } from "@nestjs/cache-manager";
import { AppUserComplaintXref } from "../app_user_complaint_xref/entities/app_user_complaint_xref.entity";
import { AppUserComplaintXrefService } from "../app_user_complaint_xref/app_user_complaint_xref.service";
import { REQUEST } from "@nestjs/core";
import { ComplaintService } from "../complaint/complaint.service";
import { EmailService } from "../../v1/email/email.service";
import { FeatureFlagService } from "../../v1/feature_flag/feature_flag.service";
import { DocumentService } from "../../v1/document/document.service";
import { ComplaintReferralEmailLogService } from "../complaint_referral_email_log/complaint_referral_email_log.service";
import { ComplaintReferralEmailLog } from "../complaint_referral_email_log/entities/complaint_referral_email_log.entity";
import { EmailReference } from "../email_reference/entities/email_reference.entity";

describe("ComplaintReferralController", () => {
  let controller: ComplaintReferralController;

  beforeEach(async () => {
    resetSharedDataMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplaintReferralController],
      imports: [AutomapperModule, CacheModule.register()],
      providers: [
        AutomapperModule,
        {
          provide: getMapperToken(),
          useValue: createMapper({
            strategyInitializer: pojos(),
          }),
        },
        CodeTableService,
        ComplaintUpdatesService,
        {
          provide: AppUserComplaintXrefService,
          useValue: {},
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
          provide: getRepositoryToken(AppUserComplaintXref),
          useValue: {},
        },
        {
          provide: getRepositoryToken(AttractantCode),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ComplaintStatusCode),
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
          provide: getRepositoryToken(AllegationComplaint),
          useValue: {},
        },
        {
          provide: getRepositoryToken(GirComplaint),
          useValue: {},
        },
        {
          provide: getRepositoryToken(HwcrComplaint),
          useValue: {},
        },
        {
          provide: getRepositoryToken(HwcrComplaintNatureCode),
          useValue: {},
        },
        {
          provide: getRepositoryToken(AppUserComplaintXrefCode),
          useValue: {},
        },
        {
          provide: getRepositoryToken(SpeciesCode),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ViolationAgencyXref),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ComplaintTypeCode),
          useValue: {},
        },
        {
          provide: getRepositoryToken(GirTypeCode),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ReportedByCode),
          useValue: {},
        },
        {
          provide: getRepositoryToken(CompMthdRecvCdAgcyCdXref),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ComplaintReferralEmailLog),
          useValue: {},
        },
        {
          provide: getRepositoryToken(EmailReference),
          useValue: {},
        },
        {
          provide: getRepositoryToken(AttractantHwcrXref),
          useValue: {},
        },
        AttractantHwcrXrefService,
        CompMthdRecvCdAgcyCdXrefService,
        AppUserService,
        ComplaintReferralEmailLogService,
        ConfigurationService,
        CssService,
        LinkedComplaintXrefService,
        {
          provide: ComplaintService,
          useValue: {},
        },
        ComplaintReferralService,
        {
          provide: getRepositoryToken(ComplaintReferral),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Complaint),
          useValue: {},
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
        {
          provide: REQUEST,
          useValue: {
            user: { idir_username: "TEST" },
          },
        },
        {
          provide: EmailService,
          useValue: {},
        },
        {
          provide: FeatureFlagService,
          useValue: {},
        },
        {
          provide: DocumentService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ComplaintReferralController>(ComplaintReferralController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
