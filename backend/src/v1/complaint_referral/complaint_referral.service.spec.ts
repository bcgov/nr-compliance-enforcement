import { Test, TestingModule } from "@nestjs/testing";
import { ComplaintReferralService } from "./complaint_referral.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { ComplaintReferral } from "./entities/complaint_referral.entity";
import { Complaint } from "../complaint/entities/complaint.entity";
import { PersonComplaintXrefService } from "../person_complaint_xref/person_complaint_xref.service";
import { REQUEST } from "@nestjs/core";
import { ComplaintService } from "../complaint/complaint.service";
import { AutomapperModule } from "@automapper/nestjs";
import { PersonComplaintXref } from "../person_complaint_xref/entities/person_complaint_xref.entity";

describe("ComplaintReferralService", () => {
  let service: ComplaintReferralService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule],
      providers: [
        AutomapperModule,
        ComplaintService,
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
        PersonComplaintXrefService,
        {
          provide: getRepositoryToken(PersonComplaintXref),
          useValue: {},
        },
      ],
    }).compile();

    service = await module.resolve<ComplaintReferralService>(ComplaintReferralService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
