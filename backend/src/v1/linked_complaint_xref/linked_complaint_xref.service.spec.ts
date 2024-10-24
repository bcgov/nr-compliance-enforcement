import { Test, TestingModule } from "@nestjs/testing";
import { LinkedComplaintXrefService } from "./linked_complaint_xref.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { LinkedComplaintXref } from "./entities/linked_complaint_xref.entity";

describe("LinkedComplaintXrefService", () => {
  let service: LinkedComplaintXrefService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinkedComplaintXrefService,
        {
          provide: getRepositoryToken(LinkedComplaintXref),
          useValue: {},
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    service = module.get<LinkedComplaintXrefService>(LinkedComplaintXrefService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
