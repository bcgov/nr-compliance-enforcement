import { Test, TestingModule } from "@nestjs/testing";
import { PersonComplaintXrefController } from "./person_complaint_xref.controller";
import { PersonComplaintXrefService } from "./person_complaint_xref.service";
import { PersonComplaintXref } from "./entities/person_complaint_xref.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { ComplaintService } from "../complaint/complaint.service";
import { ComplaintReferral } from "../complaint_referral/entities/complaint_referral.entity";

describe("PersonComplaintXrefController", () => {
  let controller: PersonComplaintXrefController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonComplaintXrefController],
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
          provide: getRepositoryToken(ComplaintReferral),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PersonComplaintXrefController>(PersonComplaintXrefController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
