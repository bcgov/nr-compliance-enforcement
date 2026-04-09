import { Test, TestingModule } from "@nestjs/testing";
import { WebEocScheduler } from "./webeoc-scheduler.service";
import { ComplaintsPublisherService } from "../publishers/complaints-publisher.service";
import { ActionsTakenPublisherService } from "../publishers/actions-taken-publisher.service";

describe("WebEOCComplaintsScheduler", () => {
  let service: WebEocScheduler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebEocScheduler,
        ComplaintsPublisherService,
        {
          provide: ActionsTakenPublisherService,
          useValue: {},
        },
      ],
    }).compile();

    service = await module.resolve<WebEocScheduler>(WebEocScheduler);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
