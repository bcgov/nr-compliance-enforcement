import { Test, TestingModule } from "@nestjs/testing";
import { WebEOCComplaintsScheduler } from "./webeoc-complaints-scheduler.service";
import { ComplaintsPublisherService } from "../complaints-publisher/complaints-publisher.service";

describe("WebEOCComplaintsScheduler", () => {
  let service: WebEOCComplaintsScheduler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebEOCComplaintsScheduler, ComplaintsPublisherService],
    }).compile();

    service = module.get<WebEOCComplaintsScheduler>(WebEOCComplaintsScheduler);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
