import { Test, TestingModule } from "@nestjs/testing";
import { PersonComplaintXrefCodeService } from "./person_complaint_xref_code.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { PersonComplaintXrefCode } from "./entities/person_complaint_xref_code.entity";

describe("PersonComplaintXrefCodeService", () => {
  let service: PersonComplaintXrefCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonComplaintXrefCodeService,
        {
          provide: getRepositoryToken(PersonComplaintXrefCode),
          useValue: {},
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    service = module.get<PersonComplaintXrefCodeService>(PersonComplaintXrefCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
