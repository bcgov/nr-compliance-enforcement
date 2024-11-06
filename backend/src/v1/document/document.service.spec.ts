import { Test, TestingModule } from "@nestjs/testing";
import { DocumentService } from "./document.service";
import { ComplaintService } from "../complaint/complaint.service";
import { AutomapperModule, getMapperToken } from "@automapper/nestjs";
import { createMapper } from "@automapper/core";
import { pojos } from "@automapper/pojos";
import { REQUEST } from "@nestjs/core";
import { getRepositoryToken } from "@nestjs/typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { MockAllegationComplaintRepository } from "../../../test/mocks/mock-allegation-complaint-repository";
import { MockGeneralIncidentComplaintRepository } from "../../../test/mocks/mock-general-incident-complaint-repository";
import {
  MockAttractantCodeTableRepository,
  MockComplaintStatusCodeTableRepository,
  MockNatureOfComplaintCodeTableRepository,
  MockOrganizationUnitTypeCodeTableRepository,
  MockOrganizationUnitCodeTableRepository,
  MockPersonComplaintCodeTableRepository,
  MockSpeciesCodeTableRepository,
  MockViolationsCodeTableRepository,
  MockCosOrganizationUnitCodeTableRepository,
  MockComplaintTypeCodeTableRepository,
  MockReportedByCodeTableRepository,
  MockGirTypeCodeRepository as MockGirTypeCodeTableRepository,
  MockTeamCodeRepository,
  MockCompMthdRecvCdAgcyCdXrefRepository,
} from "../../../test/mocks/mock-code-table-repositories";
import {
  MockComplaintsRepositoryV2,
  MockComplaintsAgencyRepository,
  MockComplaintsOfficerRepository,
} from "../../../test/mocks/mock-complaints-repositories";
import { MockWildlifeConflictComplaintRepository } from "../../../test/mocks/mock-wildlife-conflict-complaint-repository";
import { DataSource } from "typeorm";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { AllegationComplaint } from "../allegation_complaint/entities/allegation_complaint.entity";
import { ComplaintUpdate } from "../complaint_updates/entities/complaint_updates.entity";
import { AttractantCode } from "../attractant_code/entities/attractant_code.entity";
import { AttractantHwcrXrefService } from "../attractant_hwcr_xref/attractant_hwcr_xref.service";
import { AttractantHwcrXref } from "../attractant_hwcr_xref/entities/attractant_hwcr_xref.entity";
import { CodeTableService } from "../code-table/code-table.service";
import { Complaint } from "../complaint/entities/complaint.entity";
import { ComplaintStatusCode } from "../complaint_status_code/entities/complaint_status_code.entity";
import { ComplaintTypeCode } from "../complaint_type_code/entities/complaint_type_code.entity";
import { CosGeoOrgUnit } from "../cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { GeoOrgUnitTypeCode } from "../geo_org_unit_type_code/entities/geo_org_unit_type_code.entity";
import { GeoOrganizationUnitCode } from "../geo_organization_unit_code/entities/geo_organization_unit_code.entity";
import { HwcrComplaint } from "../hwcr_complaint/entities/hwcr_complaint.entity";
import { GirComplaint } from "../gir_complaint/entities/gir_complaint.entity";
import { HwcrComplaintNatureCode } from "../hwcr_complaint_nature_code/entities/hwcr_complaint_nature_code.entity";
import { Office } from "../office/entities/office.entity";
import { Officer } from "../officer/entities/officer.entity";
import { PersonComplaintXref } from "../person_complaint_xref/entities/person_complaint_xref.entity";
import { PersonComplaintXrefService } from "../person_complaint_xref/person_complaint_xref.service";
import { PersonComplaintXrefCode } from "../person_complaint_xref_code/entities/person_complaint_xref_code.entity";
import { ReportedByCode } from "../reported_by_code/entities/reported_by_code.entity";
import { SpeciesCode } from "../species_code/entities/species_code.entity";
import { ViolationCode } from "../violation_code/entities/violation_code.entity";
import { CdogsService } from "../../external_api/cdogs/cdogs.service";
import { ConfigurationService } from "../configuration/configuration.service";
import { Configuration } from "../configuration/entities/configuration.entity";
import { GirTypeCode } from "../gir_type_code/entities/gir_type_code.entity";
import { ComplaintUpdatesService } from "../complaint_updates/complaint_updates.service";
import { ActionTaken } from "../complaint/entities/action_taken.entity";
import { StagingComplaint } from "../staging_complaint/entities/staging_complaint.entity";
import { TeamCode } from "../team_code/entities/team_code.entity";
import { CompMthdRecvCdAgcyCdXrefService } from "../comp_mthd_recv_cd_agcy_cd_xref/comp_mthd_recv_cd_agcy_cd_xref.service";
import { CompMthdRecvCdAgcyCdXref } from "../comp_mthd_recv_cd_agcy_cd_xref/entities/comp_mthd_recv_cd_agcy_cd_xref";
import { OfficerService } from "../officer/officer.service";
import { PersonService } from "../person/person.service";
import { OfficeService } from "../office/office.service";
import { CssService } from "../../external_api/css/css.service";
import { Person } from "../person/entities/person.entity";

describe("DocumentService", () => {
  let service: DocumentService;

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
          provide: getRepositoryToken(GirTypeCode),
          useFactory: MockGirTypeCodeTableRepository,
        },
        {
          provide: getRepositoryToken(PersonComplaintXref),
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
          provide: getRepositoryToken(TeamCode),
          useFactory: MockTeamCodeRepository,
        },
        {
          provide: getRepositoryToken(CompMthdRecvCdAgcyCdXref),
          useFactory: MockCompMthdRecvCdAgcyCdXrefRepository,
        },
        {
          provide: getRepositoryToken(Person),
          useValue: {},
        },
        ComplaintUpdatesService,
        ComplaintService,
        CodeTableService,
        PersonComplaintXrefService,
        OfficerService,
        OfficeService,
        CssService,
        PersonService,
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
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
