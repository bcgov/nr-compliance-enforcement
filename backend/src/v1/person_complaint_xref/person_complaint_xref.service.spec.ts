import { Test, TestingModule } from "@nestjs/testing";
import { PersonComplaintXrefService } from "./person_complaint_xref.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { PersonComplaintXref } from "./entities/person_complaint_xref.entity";
import { ComplaintService } from "../complaint/complaint.service";
import { EmailService } from "../email/email.service";
import { WebeocService } from "../../external_api/webeoc/webeoc.service";
import { OfficerService } from "../officer/officer.service";
import { FeatureFlagService } from "../feature_flag/feature_flag.service";

describe("PersonComplaintXrefService", () => {
  let service: PersonComplaintXrefService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonComplaintXrefService,
        ComplaintService,
        {
          provide: getRepositoryToken(PersonComplaintXref),
          useValue: {},
        },
        {
          provide: ComplaintService,
          useFactory: dataSourceMockFactory,
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
        {
          provide: EmailService,
          useValue: {},
        },
        {
          provide: WebeocService,
          useValue: {},
        },
        {
          provide: FeatureFlagService,
          useValue: {},
        },
        {
          provide: OfficerService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PersonComplaintXrefService>(PersonComplaintXrefService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
