import { Test, TestingModule } from "@nestjs/testing";
import { WebEocScheduler } from "./webeoc-scheduler.service";
import { ComplaintsPublisherService } from "../publishers/complaints-publisher.service";

describe("WebEOCComplaintsScheduler", () => {
  let service: WebEocScheduler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebEocScheduler, ComplaintsPublisherService],
    }).compile();

    service = module.get<WebEocScheduler>(WebEocScheduler);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
