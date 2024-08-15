import { Test, TestingModule } from "@nestjs/testing";
import { FeatureFlagController } from "./feature_flag.controller";
import { FeatureFlagService } from "./feature_flag.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FeatureAgencyXref } from "./entities/feature_agency_xref.entity";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";

describe("FeatureFlagController", () => {
  let controller: FeatureFlagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeatureFlagController],
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

    controller = module.get<FeatureFlagController>(FeatureFlagController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
