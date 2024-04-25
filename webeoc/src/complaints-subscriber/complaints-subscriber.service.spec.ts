import { Test, TestingModule } from "@nestjs/testing";
import { ComplaintsSubscriberService } from "./complaints-subscriber.service";
import { StagingComplaintsApiService } from "../staging-complaints-api-service/staging-complaints-api-service.service";
import { ComplaintsPublisherService } from "../complaints-publisher/complaints-publisher.service";

describe("ComplaintsSubscriberService", () => {
  let service: ComplaintsSubscriberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComplaintsSubscriberService, StagingComplaintsApiService, ComplaintsPublisherService],
    }).compile();

    service = module.get<ComplaintsSubscriberService>(ComplaintsSubscriberService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
