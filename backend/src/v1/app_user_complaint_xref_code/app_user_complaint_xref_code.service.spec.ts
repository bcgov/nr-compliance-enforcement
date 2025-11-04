import { Test, TestingModule } from "@nestjs/testing";
import { AppUserComplaintXrefCodeService } from "./app_user_complaint_xref_code.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { AppUserComplaintXrefCode } from "./entities/app_user_complaint_xref_code.entity";

describe("AppUserComplaintXrefCodeService", () => {
  let service: AppUserComplaintXrefCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppUserComplaintXrefCodeService,
        {
          provide: getRepositoryToken(AppUserComplaintXrefCode),
          useValue: {},
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    service = module.get<AppUserComplaintXrefCodeService>(AppUserComplaintXrefCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
