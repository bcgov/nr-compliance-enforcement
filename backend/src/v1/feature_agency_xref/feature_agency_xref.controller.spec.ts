import { Test, TestingModule } from "@nestjs/testing";
import { FeatureAgencyXrefController } from "./feature_agency_xref.controller";
import { FeatureAgencyXrefService } from "./feature_agency_xref.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FeatureAgencyXref } from "./entities/feature_agency_xref.entity";
import { DataSource } from "typeorm";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";

describe("FeatureAgencyXrefController", () => {
  let controller: FeatureAgencyXrefController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeatureAgencyXrefController],
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

    controller = module.get<FeatureAgencyXrefController>(FeatureAgencyXrefController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
