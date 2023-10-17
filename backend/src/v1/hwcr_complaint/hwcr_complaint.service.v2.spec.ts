import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

import { HwcrComplaint } from "./entities/hwcr_complaint.entity";
import { CosGeoOrgUnit } from "../cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { AttractantHwcrXrefService } from "../attractant_hwcr_xref/attractant_hwcr_xref.service";
import { ComplaintService } from "../complaint/complaint.service";
import { OfficeService } from "../office/office.service";
import { OfficerService } from "../officer/officer.service";
import { PersonService } from "../person/person.service";
import { PersonComplaintXrefService } from "../person_complaint_xref/person_complaint_xref.service";

import { HwcrComplaintService } from "./hwcr_complaint.service";
import { CosGeoOrgUnitService } from "../cos_geo_org_unit/cos_geo_org_unit.service";
import { AttractantHwcrXref } from "../attractant_hwcr_xref/entities/attractant_hwcr_xref.entity";
import { Complaint } from "../complaint/entities/complaint.entity";
import { Office } from "../office/entities/office.entity";
import { Officer } from "../officer/entities/officer.entity";
import { Person } from "../person/entities/person.entity";
import { PersonComplaintXref } from "../person_complaint_xref/entities/person_complaint_xref.entity";

import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { MockWildlifeConflictComplaintRepository } from "../../../test/mocks/mock-wildlife-conflict-complaint-repository";
import { SearchPayload } from "../complaint/models/search-payload";

describe("Testing: HwcrComplaintService", () => {
  let service: HwcrComplaintService;
  let repository: Repository<HwcrComplaint>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HwcrComplaintService,
        {
          provide: getRepositoryToken(HwcrComplaint),
          useFactory: MockWildlifeConflictComplaintRepository,
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
        // Helps catch ninja like errors from compilation
        console.error("ERROR!", err);
        throw err;
      });

    service = module.get<HwcrComplaintService>(HwcrComplaintService);
    dataSource = module.get<DataSource>(DataSource);
  });

  it("should be defined", () => {
    console.log(service)
    expect(service).toBeDefined();
  });

  it("should be able to search", async () => {
    const sortColumn = "last_name";
    const sortOrder = "test";
    const community = null;
    const zone = null;
    const region = null;
    const officerAssigned = null;
    const natureOfComplaint = null;
    const speciesCode = null;
    const incidentReportedStart = null;
    const incidentReportedEnd = null;
    const status = null;
    const page = null;
    const pageSize = null;

    const payload = { sortColumn, sortOrder, search: "test" } as SearchPayload;

    const result = await service.complaintSearch(payload);

    expect(result).not.toBe(null);
   
    const { complaints, totalCount} = result;
    expect(complaints.length).toBeGreaterThanOrEqual(1)
    expect(totalCount).toBeGreaterThan(0)
  });
});

