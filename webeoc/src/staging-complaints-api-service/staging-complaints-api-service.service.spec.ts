import { Test, TestingModule } from "@nestjs/testing";
import { StagingComplaintsApiService } from "./staging-complaints-api-service.service";
import { ComplaintsPublisherService } from "../publishers/complaints-publisher.service";

describe("StagingComplaintsApiServiceService", () => {
  let service: StagingComplaintsApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StagingComplaintsApiService, ComplaintsPublisherService],
    }).compile();

    service = module.get<StagingComplaintsApiService>(StagingComplaintsApiService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
