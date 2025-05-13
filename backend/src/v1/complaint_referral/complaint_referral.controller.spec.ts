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
import { OfficerService } from "../officer/officer.service";
import { LinkedComplaintXrefService } from "../linked_complaint_xref/linked_complaint_xref.service";
import { ComplaintUpdate } from "../complaint_updates/entities/complaint_updates.entity";
import { StagingComplaint } from "../staging_complaint/entities/staging_complaint.entity";
import { ActionTaken } from "../complaint/entities/action_taken.entity";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { AttractantCode } from "../attractant_code/entities/attractant_code.entity";
import { ComplaintStatusCode } from "../complaint_status_code/entities/complaint_status_code.entity";
import { Configuration } from "../configuration/entities/configuration.entity";
import { Person } from "../person/entities/person.entity";
import { LinkedComplaintXref } from "../linked_complaint_xref/entities/linked_complaint_xref.entity";
import { Team } from "../team/entities/team.entity";
import { OfficerTeamXref } from "../officer_team_xref/entities/officer_team_xref.entity";
import { AllegationComplaint } from "../allegation_complaint/entities/allegation_complaint.entity";
import { GirComplaint } from "../gir_complaint/entities/gir_complaint.entity";
import { HwcrComplaint } from "../hwcr_complaint/entities/hwcr_complaint.entity";
import { Officer } from "../officer/entities/officer.entity";
import { Office } from "../office/entities/office.entity";
import { GeoOrgUnitTypeCode } from "../geo_org_unit_type_code/entities/geo_org_unit_type_code.entity";
import { GeoOrganizationUnitCode } from "../geo_organization_unit_code/entities/geo_organization_unit_code.entity";
import { HwcrComplaintNatureCode } from "../hwcr_complaint_nature_code/entities/hwcr_complaint_nature_code.entity";
import { PersonComplaintXrefCode } from "../person_complaint_xref_code/entities/person_complaint_xref_code.entity";
import { SpeciesCode } from "../species_code/entities/species_code.entity";
import { ViolationAgencyXref } from "../violation_agency_xref/entities/violation_agency_entity_xref";
import { CosGeoOrgUnit } from "../cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { ComplaintTypeCode } from "../complaint_type_code/entities/complaint_type_code.entity";
import { GirTypeCode } from "../gir_type_code/entities/gir_type_code.entity";
import { ReportedByCode } from "../reported_by_code/entities/reported_by_code.entity";
import { TeamCode } from "../team_code/entities/team_code.entity";
import { CompMthdRecvCdAgcyCdXref } from "../comp_mthd_recv_cd_agcy_cd_xref/entities/comp_mthd_recv_cd_agcy_cd_xref";
import { AttractantHwcrXref } from "../attractant_hwcr_xref/entities/attractant_hwcr_xref.entity";
import { PersonService } from "../person/person.service";
import { OfficeService } from "../office/office.service";
import { TeamService } from "../team/team.service";
import { ConfigurationService } from "../configuration/configuration.service";
import { OfficerTeamXrefService } from "../officer_team_xref/officer_team_xref.service";
import { CssService } from "../../external_api/css/css.service";
import { CacheModule } from "@nestjs/cache-manager";
import { PersonComplaintXref } from "../person_complaint_xref/entities/person_complaint_xref.entity";
import { PersonComplaintXrefService } from "../person_complaint_xref/person_complaint_xref.service";
import { REQUEST } from "@nestjs/core";
import { ComplaintService } from "../complaint/complaint.service";
import { EmailService } from "../../v1/email/email.service";
import { FeatureFlagService } from "../../v1/feature_flag/feature_flag.service";
import { DocumentService } from "src/v1/document/document.service";

describe("ComplaintReferralController", () => {
  let controller: ComplaintReferralController;

  beforeEach(async () => {
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
          provide: PersonComplaintXrefService,
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
          provide: getRepositoryToken(PersonComplaintXref),
          useValue: {},
        },
        {
          provide: getRepositoryToken(AgencyCode),
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
          provide: getRepositoryToken(Person),
          useValue: {},
        },
        {
          provide: getRepositoryToken(LinkedComplaintXref),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Team),
          useValue: {},
        },
        {
          provide: getRepositoryToken(OfficerTeamXref),
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
          provide: getRepositoryToken(Officer),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Office),
          useValue: {},
        },
        {
          provide: getRepositoryToken(GeoOrgUnitTypeCode),
          useValue: {},
        },
        {
          provide: getRepositoryToken(GeoOrganizationUnitCode),
          useValue: {},
        },
        {
          provide: getRepositoryToken(HwcrComplaintNatureCode),
          useValue: {},
        },
        {
          provide: getRepositoryToken(PersonComplaintXrefCode),
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
          provide: getRepositoryToken(CosGeoOrgUnit),
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
          provide: getRepositoryToken(TeamCode),
          useValue: {},
        },
        {
          provide: getRepositoryToken(CompMthdRecvCdAgcyCdXref),
          useValue: {},
        },
        {
          provide: getRepositoryToken(AttractantHwcrXref),
          useValue: {},
        },
        AttractantHwcrXrefService,
        PersonService,
        OfficeService,
        CompMthdRecvCdAgcyCdXrefService,
        OfficerService,
        OfficerTeamXrefService,
        TeamService,
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
