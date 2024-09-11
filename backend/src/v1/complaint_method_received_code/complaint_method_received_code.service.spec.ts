import { Test, TestingModule } from "@nestjs/testing";
import { ComplaintMethodReceivedCodeService } from "./complaint_method_received_code.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ComplaintMethodReceivedCode } from "./entities/complaint_method_received_code.entity";
import { FeatureCodeRepositoryMockFactory } from "../../../test/mocks/featureCodeRepositoryMockFactory";

describe("ComplaintMethodReceivedCodeService", () => {
  let service: ComplaintMethodReceivedCodeService;

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
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
