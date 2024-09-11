import { Test, TestingModule } from "@nestjs/testing";
import { ComplaintMethodReceivedCodeService } from "./complaint_method_received_code.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ComplaintMethodReceivedCode } from "./entities/complaint_method_received_code.entity";
import { Repository } from "typeorm";
import { FeatureCodeRepositoryMockFactory } from "../../../test/mocks/featureCodeRepositoryMockFactory";

describe("ComplaintMethodReceivedCodeService", () => {
  let service: ComplaintMethodReceivedCodeService;
  let repository: Repository<ComplaintMethodReceivedCode>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComplaintMethodReceivedCodeService,
        {
          provide: getRepositoryToken(ComplaintMethodReceivedCode),
          useFactory: FeatureCodeRepositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<ComplaintMethodReceivedCodeService>(ComplaintMethodReceivedCodeService);
    repository = module.get<Repository<ComplaintMethodReceivedCode>>(getRepositoryToken(ComplaintMethodReceivedCode));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return a single value", async () => {
    const complaintMethodReceivedCode = "RAPP";

    let response = await service.findOne(complaintMethodReceivedCode);

    expect(response.complaint_method_received_code).toBe("RAPP");
    expect(response.short_description).toBe("RAPP");
  });

  it("should return all the values", async () => {
    let response = await service.findAll();

    expect(response).toHaveLength(7);
  });
});
