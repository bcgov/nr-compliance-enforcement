import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { AllegationComplaintService } from "./allegation_complaint.service";
import { CosGeoOrgUnit } from "../cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { AttractantHwcrXrefService } from "../attractant_hwcr_xref/attractant_hwcr_xref.service";
import { ComplaintService } from "../complaint/complaint.service";
import { OfficeService } from "../office/office.service";
import { OfficerService } from "../officer/officer.service";
import { PersonService } from "../person/person.service";
import { PersonComplaintXrefService } from "../person_complaint_xref/person_complaint_xref.service";

import { CosGeoOrgUnitService } from "../cos_geo_org_unit/cos_geo_org_unit.service";
import { AttractantHwcrXref } from "../attractant_hwcr_xref/entities/attractant_hwcr_xref.entity";
import { Complaint } from "../complaint/entities/complaint.entity";
import { Office } from "../office/entities/office.entity";
import { Officer } from "../officer/entities/officer.entity";
import { Person } from "../person/entities/person.entity";
import { PersonComplaintXref } from "../person_complaint_xref/entities/person_complaint_xref.entity";
import { AllegationComplaint } from "./entities/allegation_complaint.entity";

import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { MockAllegationComplaintRepository } from "../../../test/mocks/mock-allegation-complaint-repository";
import { SearchPayload } from "../complaint/models/search-payload";

describe("Testing: AllegationComplaintService", () => {
  let service: AllegationComplaintService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AllegationComplaintService,
        {
          provide: getRepositoryToken(AllegationComplaint),
          useFactory: MockAllegationComplaintRepository
        },
        CosGeoOrgUnitService,
        {
          provide: getRepositoryToken(CosGeoOrgUnit),
          useFactory: () => {},
        },
        OfficeService,
        {
          provide: getRepositoryToken(Office),
          useFactory: () => {},
        },
        OfficerService,
        {
          provide: getRepositoryToken(Officer),
          useFactory: () => {},
        },
        ComplaintService,
        {
          provide: getRepositoryToken(Complaint),
          useFactory: () => {},
        },
        AttractantHwcrXrefService,
        {
          provide: getRepositoryToken(AttractantHwcrXref),
          useFactory: () => {},
        },
        PersonService,
        {
          provide: getRepositoryToken(Person),
          useFactory: () => {},
        },
        PersonComplaintXrefService,
        {
          provide: getRepositoryToken(PersonComplaintXref),
          useFactory: () => {},
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    })
      .compile()
      .catch((err) => {
        // Helps catch ninja like errors from compilation-*groa
        console.error("ERROR!", err);
        throw err;
      });

    service = module.get<AllegationComplaintService>(AllegationComplaintService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should be able to search", async () => {
    const sortColumn = "last_name";
    const sortOrder = "test";
    const community = null;
    const zone = null;
    const region = null;
    const officerAssigned = null;
    const violationCode = null
    const incidentReportedStart = null;
    const incidentReportedEnd = null;
    const status = null;
    const page = null;
    const pageSize = null;
    const searchQuery = "test";

    const model = {
      sortColumn,
      sortOrder,
      community,
      zone,
      region,
      officerAssigned,
      violationCode,
      incidentReportedStart,
      incidentReportedEnd,
      status,
      page,
      pageSize,
      searchQuery,
    } as SearchPayload;

    const result = await service.search(model);

    expect(result).not.toBe(null);

    const { complaints, totalCount } = result;
    expect(complaints.length).toBeGreaterThanOrEqual(1);
    expect(totalCount).toBeGreaterThan(0);
  });
});

