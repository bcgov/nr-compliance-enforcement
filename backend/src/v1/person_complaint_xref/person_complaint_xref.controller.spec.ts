import { Test, TestingModule } from "@nestjs/testing";
import { PersonComplaintXrefController } from "./person_complaint_xref.controller";
import { PersonComplaintXrefService } from "./person_complaint_xref.service";
import { PersonComplaintXref } from "./entities/person_complaint_xref.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";

describe("PersonComplaintXrefController", () => {
  let controller: PersonComplaintXrefController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonComplaintXrefController],
      providers: [
        PersonComplaintXrefService,
        {
          provide: getRepositoryToken(PersonComplaintXref),
          useValue: {},
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    controller = module.get<PersonComplaintXrefController>(PersonComplaintXrefController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
