import { Test, TestingModule } from "@nestjs/testing";
import { FeatureFlagService } from "./feature_flag.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FeatureAgencyXref } from "./entities/feature_agency_xref.entity";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";

describe("FeatureFlagService", () => {
  let service: FeatureFlagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureFlagService,
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

    service = module.get<FeatureFlagService>(FeatureFlagService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
