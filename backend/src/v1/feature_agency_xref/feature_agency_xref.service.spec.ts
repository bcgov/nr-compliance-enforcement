import { Test, TestingModule } from "@nestjs/testing";
import { FeatureAgencyXrefService } from "./feature_agency_xref.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FeatureAgencyXref } from "./entities/feature_agency_xref.entity";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";

describe("FeatureAgencyXrefService", () => {
  let service: FeatureAgencyXrefService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureAgencyXrefService,
        {
          provide: getRepositoryToken(FeatureAgencyXref),
          useValue: {},
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    service = module.get<FeatureAgencyXrefService>(FeatureAgencyXrefService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
