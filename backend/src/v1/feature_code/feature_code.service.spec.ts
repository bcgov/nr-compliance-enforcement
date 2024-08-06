import { Test, TestingModule } from "@nestjs/testing";
import { FeatureCodeService } from "./feature_code.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FeatureCode } from "./entities/feature_code.entity";
import { Repository } from "typeorm";
import { FeatureCodeRepositoryMockFactory } from "../../../test/mocks/featureCodeRepositoryMockFactory";

describe("FeatureCodeService", () => {
  let service: FeatureCodeService;
  let repository: Repository<FeatureCode>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureCodeService,
        {
          provide: getRepositoryToken(FeatureCode),
          useFactory: FeatureCodeRepositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<FeatureCodeService>(FeatureCodeService);
    repository = module.get<Repository<FeatureCode>>(getRepositoryToken(FeatureCode));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return a single value", async () => {
    const featureCode = "AINVSPC";

    let response = await service.findOne(featureCode);

    expect(response.feature_code).toBe("AINVSPC");
    expect(response.short_description).toBe("Aquatic: Invasive Species");
  });

  it("should return all the values", async () => {
    let response = await service.findAll();

    expect(response).toHaveLength(3);
  });

  it("should be able to create a value", async () => {
    const featureCodeDto = {
      feature_code: "NEWCODE",
      short_description: "New description",
      long_description: "New long description",
      display_order: "10",
      active_ind: "Y",
    };

    let response = await service.create(featureCodeDto);
    expect(response.feature_code).toBe("NEWCODE");
    expect(response.short_description).toBe("New description");
    expect(repository.create).toHaveBeenCalled();
    expect(repository.save).toHaveBeenCalled();
  });

  it("should be able to update a value", async () => {
    const featureCode = "AINVSPC";
    const featureCodeDto = {
      feature_code: "AINVSPC",
      short_description: "Updated Value",
      long_description: "Aquatic: Invasive Species",
      display_order: "1",
      active_ind: "Y",
    };

    await service.update(featureCode, featureCodeDto);
    expect(repository.update).toHaveBeenCalled();
  });

  it("should be able to remove a value if it exists", async () => {
    const goodFeatureCode = "AINVSPC";
    const badFeatureCode = "BADVALUE";

    let response = await service.remove(goodFeatureCode);

    expect(response.deleted).toBe(true);
    expect(repository.delete).toHaveBeenCalled();

    response = await service.remove(badFeatureCode);

    expect(response.deleted).toBe(false);
    expect(repository.delete).toHaveBeenCalled();
  });
});
